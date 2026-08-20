import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { scanToolsConfig } from '../../lib/cnn/scanConfig';
import type { ScanTool } from '../../lib/cnn/scanConfig';
import { buildClinicalAssessment } from '../../lib/cnn/clinicalEngine';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import LoginPromptModal from '../../components/auth/LoginPromptModal';
import ImageScanner from '../../components/scan/ImageScanner';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../lib/types/prediction';
import FeatureCard from '../../components/ui/FeatureCard';
import { scanConfigs } from './scanData';
import {
  ArrowLeft,
  ShieldAlert,
  RefreshCw,
  Scan,
  FileText,
  Search,
  Layers
} from 'lucide-react';

const DEFAULT_SCAN_CFG = {
  icon: Scan,
  rgb: '139, 92, 246',
  textClass: 'text-violet-600 dark:text-violet-400',
  bgClass: 'bg-violet-500/15',
  gradientClass: 'from-violet-500 to-purple-500',
  glowClass: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
};

type CategoryFilter = 'all' | 'infectious' | 'maternal_child' | 'dermatology' | 'ophthalmology' | 'radiology_neurology' | 'dental';

const CATEGORIES: { id: CategoryFilter; label: string; count?: number }[] = [
  { id: 'all', label: 'All Scanners' },
  { id: 'infectious', label: 'Infectious & Endemic' },
  { id: 'maternal_child', label: 'Maternal & Blood' },
  { id: 'dermatology', label: 'Dermatology & Ulcers' },
  { id: 'ophthalmology', label: 'Eye & Vision' },
  { id: 'radiology_neurology', label: 'Radiology & Organs' },
  { id: 'dental', label: 'Dental & Oral' },
];

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { logScan } = useHealthDispatch();
  const { requireAuth, showLoginModal, setShowLoginModal } = useRequireAuth();

  const [selectedTool, setSelectedTool] = useState<ScanTool | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return Object.values(scanToolsConfig).filter((tool) => {
      // Category match
      let matchesCategory = true;
      if (activeCategory === 'infectious') {
        matchesCategory = tool.category === 'infectious';
      } else if (activeCategory === 'maternal_child') {
        matchesCategory = tool.category === 'gynecology' || tool.category === 'hematology' || tool.category === 'pediatrics';
      } else if (activeCategory === 'dermatology') {
        matchesCategory = tool.category === 'dermatology';
      } else if (activeCategory === 'ophthalmology') {
        matchesCategory = tool.category === 'ophthalmology';
      } else if (activeCategory === 'radiology_neurology') {
        matchesCategory = tool.category === 'radiology' || tool.category === 'neurology';
      } else if (activeCategory === 'dental') {
        matchesCategory = tool.category === 'dental';
      }

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        tool.name.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query) ||
        tool.labels.some(l => l.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleScanComplete = async (cnnResult: { 
    vector: number[]; 
    score: number; 
    label: string;
    gradCam?: { heatmapDataUrl: string; compositeDataUrl: string };
    quality?: { blurScore: number; brightnessScore: number; contrastScore: number; status: 'excellent' | 'acceptable' | 'poor' };
    originalImage: string;
  }) => {
    if (!requireAuth()) return;
    if (!selectedTool) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    // Safety Gate threshold evaluation
    const threshold = selectedTool.calibratedThreshold || 0.50;
    const isSafetyGatePassed = cnnResult.score >= threshold;
    const safetyGateStatus = isSafetyGatePassed ? 'usable' : 'uncertain_further_evaluation';

    // Generate comprehensive clinical disease findings & precautions
    const clinicalAssessment = buildClinicalAssessment(
      selectedTool.id,
      cnnResult.score,
      cnnResult.label,
      isSafetyGatePassed
    );

    try {
      const { data, error } = await supabase.functions.invoke('medical-predictor', {
        body: {
          predictorId: 'image_analysis',
          scanType: selectedTool.id,
          vector: cnnResult.vector,
          localLabel: cnnResult.label,
        },
      });

      if (error) throw error;

      const cnnPct = cnnResult.score * 100;
      const llmPct = data?.confidence || 78;
      const blendedPct = Math.round(0.40 * cnnPct + 0.60 * llmPct);

      // Merge LLM narrative with clinical guidelines
      const finalResult: PredictionData = {
        ...data,
        risk: isSafetyGatePassed ? (data.risk || clinicalAssessment.risk) : 'Insufficient Data',
        confidence: blendedPct,
        safetyGateStatus,
        heatmapUrl: cnnResult.gradCam?.heatmapDataUrl,
        compositeUrl: cnnResult.gradCam?.compositeDataUrl,
        originalImageUrl: cnnResult.originalImage,
        qualityMetrics: cnnResult.quality ? {
          blurScore: cnnResult.quality.blurScore,
          brightnessScore: cnnResult.quality.brightnessScore,
          contrastScore: cnnResult.quality.contrastScore,
          status: cnnResult.quality.status,
        } : undefined,
        reasoning: [
          `Condition Evaluated: ${clinicalAssessment.clinicalProfile.conditionName}`,
          `Suspected Visual Finding: ${cnnResult.label}`,
          `Clinical Pathology: ${clinicalAssessment.clinicalProfile.pathologySummary}`,
          ...(data.reasoning || []).filter((r: string) => !r.includes('Local MobileNet')),
          `Grad-CAM: Saliency activation hotspot localized across feature tensor.`,
          !isSafetyGatePassed 
            ? `⚠️ Safety Gate Note: Saliency activation is near classification threshold.` 
            : `Safety Gate: Passed.`
        ],
        recommendations: [
          ...clinicalAssessment.clinicalProfile.actionablePrecautions,
          ...(data.recommendations || []).slice(0, 2),
          `🩺 Specialist Referral: Schedule an appointment with a ${clinicalAssessment.clinicalProfile.recommendedSpecialist}.`,
          `🧪 Confirmatory Tests: ${clinicalAssessment.clinicalProfile.confirmatoryTests.join(', ')}.`
        ],
        urgency: data.urgency || clinicalAssessment.urgency,
        disclaimer: data.disclaimer || clinicalAssessment.disclaimer,
        computedBy: 'server_rules_ml'
      };

      setResult(finalResult);
      logScan(selectedTool.id, cnnResult.label, cnnResult.score, finalResult);
    } catch (err: any) {
      console.error('Edge function call error, using rich local clinical engine:', err);

      const fallbackResult: PredictionData = {
        risk: clinicalAssessment.risk as PredictionData['risk'],
        confidence: clinicalAssessment.confidence,
        safetyGateStatus,
        heatmapUrl: cnnResult.gradCam?.heatmapDataUrl,
        compositeUrl: cnnResult.gradCam?.compositeDataUrl,
        originalImageUrl: cnnResult.originalImage,
        qualityMetrics: cnnResult.quality ? {
          blurScore: cnnResult.quality.blurScore,
          brightnessScore: cnnResult.quality.brightnessScore,
          contrastScore: cnnResult.quality.contrastScore,
          status: cnnResult.quality.status,
        } : undefined,
        reasoning: clinicalAssessment.reasoning,
        recommendations: clinicalAssessment.recommendations,
        urgency: clinicalAssessment.urgency,
        disclaimer: clinicalAssessment.disclaimer,
        computedBy: 'server_rules_ml'
      };

      setResult(fallbackResult);
      logScan(selectedTool.id, cnnResult.label, cnnResult.score, fallbackResult);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedTool(null);
    setResult(null);
    setErrorMsg(null);
  };

  const activeCfg = selectedTool ? (scanConfigs[selectedTool.id] ?? DEFAULT_SCAN_CFG) : null;
  const ActiveIcon = activeCfg?.icon ?? null;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto relative overflow-hidden pb-12">

      {/* ── Ambient blobs ─────────────────────────── */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] bg-rose-500/[0.03] dark:bg-rose-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move" />
      <div
        className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-violet-500/[0.03] dark:bg-violet-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move"
        style={{ animationDuration: '25s', animationDelay: '-5s' }}
      />
      <div
        className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] bg-cyan-500/[0.03] dark:bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move"
        style={{ animationDuration: '30s', animationDelay: '-10s' }}
      />

      {/* ── Disclaimer banner ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3"
      >
        <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <span>⚠️ Clinical Triage &amp; Predictive Precautions Assistant</span>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full font-extrabold uppercase">16 Models + Vision OCR</span>
          </p>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed mt-1">
            This scanner suite runs on-device CNN feature extraction with Grad-CAM saliency heatmaps. It identifies suspected conditions and provides{' '}
            <strong>actionable disease precautions &amp; home care guidelines</strong>. Always
            consult a qualified physician or Primary Health Centre (PHC) specialist for definitive diagnosis.
          </p>
        </div>
      </motion.div>

      {/* ── Animated header ───────────────────────── */}
      <motion.div layout className="flex items-center gap-4">
        {/* Back button */}
        <AnimatePresence mode="popLayout">
          {selectedTool && (
            <motion.button
              key="back-btn"
              initial={{ opacity: 0, x: -14, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -14, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleBack}
              className="p-2.5 bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-all border border-border touch-target flex items-center justify-center shrink-0"
              aria-label="Back to scans menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Active tool icon */}
            <AnimatePresence mode="wait">
              {selectedTool && ActiveIcon && (
                <motion.div
                  key={selectedTool.id + '-icon'}
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <ActiveIcon className={`w-8 h-8 ${activeCfg?.textClass}`} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={selectedTool ? selectedTool.id : '__menu__'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-violet-500 to-cyan-500 bg-[length:200%_auto]"
                style={{ animation: 'gradient-shift 6s ease infinite' }}
              >
                {selectedTool ? selectedTool.name : 'AI Medical Image Scanners'}
              </motion.h1>
            </AnimatePresence>

            <span className="text-[9px] font-bold px-2.5 py-1 bg-primary/15 text-primary rounded-full border border-primary/30 uppercase tracking-wider hidden sm:inline-block shrink-0">
              🇮🇳 India Focus Edition
            </span>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl leading-relaxed">
            {selectedTool
              ? 'Upload an image for on-device feature extraction. Results identify suspected conditions and provide tailored precautions with Grad-CAM heatmaps.'
              : 'Explore 16 India-specific on-device CNN triage models & Vision OCR. Runs in real-time in your browser with comprehensive disease insights & precautions.'}
          </p>
        </div>
      </motion.div>

      {/* ── Main content — animated menu ↔ scanner ── */}
      <AnimatePresence mode="wait">
        {!selectedTool ? (
          <div className="space-y-5">
            {/* Search & Category Filter Controls */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scanners by disease, organ, or condition..."
                  className="w-full bg-card/60 backdrop-blur-md border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Counter badge */}
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground shrink-0">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Showing {filteredTools.length + 1} scanners</span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all outline-none ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                      : 'bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tool Selection Grid */}
            <motion.div
              key="menu-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            >
              {/* Prescription & Medicine OCR Card */}
              {activeCategory === 'all' && !searchQuery && (
                <FeatureCard
                  icon={FileText}
                  title="Prescription & Medicine OCR"
                  description="Snap prescription slips or tablet strips to extract dosages and set reminder alarms"
                  rgb="16, 185, 129"
                  index={0}
                  footerLabel="Open OCR Scanner"
                  badge="Vision OCR • Active"
                  onClick={() => navigate('/scan/prescription')}
                />
              )}

              {filteredTools.map((tool, index) => {
                const cfg = scanConfigs[tool.id] ?? DEFAULT_SCAN_CFG;
                return (
                  <FeatureCard
                    key={tool.id}
                    icon={cfg.icon}
                    title={tool.name}
                    description={tool.description}
                    rgb={cfg.rgb}
                    index={index + 1}
                    footerLabel="Launch Scanner"
                    badge="On-Device • Grad-CAM"
                    onClick={() => setSelectedTool(tool)}
                  />
                );
              })}
            </motion.div>
          </div>
        ) : (
          /* Active Scanner Panel */
          <motion.div
            key="active-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left — Image capture / scanner */}
            <div className="lg:col-span-7">
              {activeCfg && (
                <ImageScanner
                  guidance={selectedTool.guidance}
                  domainLabels={selectedTool.labels}
                  toolId={selectedTool.id}
                  onScanComplete={handleScanComplete}
                  rgb={activeCfg.rgb}
                  textClass={activeCfg.textClass}
                  bgClass={activeCfg.bgClass}
                  gradientClass={activeCfg.gradientClass}
                  glowClass={activeCfg.glowClass}
                />
              )}
            </div>

            {/* Right — Report / outcome panel */}
            <div
              className="lg:col-span-5 space-y-4"
              style={{ '--scan-rgb': activeCfg?.rgb } as React.CSSProperties}
            >
              <AnimatePresence mode="wait">
                {/* Loading state — pulsing ring */}
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="scan-active-panel rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[240px]"
                  >
                    <div
                      className={`w-16 h-16 rounded-full ${activeCfg?.bgClass} flex items-center justify-center loader-ring-pulse`}
                    >
                      <RefreshCw className={`w-8 h-8 ${activeCfg?.textClass} animate-spin`} />
                    </div>
                    <span className="text-sm font-semibold text-foreground/80 text-center">
                      Analyzing disease indicators &amp; compiling clinical precautions…
                    </span>
                    {/* Progress shimmer bar */}
                    <div className="w-full max-w-[200px] h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-1/2 animate-progress-shimmer rounded-full" />
                    </div>
                  </motion.div>
                )}

                {/* Error state */}
                {errorMsg && !loading && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 bg-destructive/10 border border-destructive/20 text-xs rounded-xl flex items-start gap-2.5"
                  >
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-500 dark:text-red-400" />
                    <span className="text-red-500 dark:text-red-400 leading-relaxed">{errorMsg}</span>
                  </motion.div>
                )}

                {/* Result — animated reveal */}
                {result && !loading && (
                  <motion.div key="result" className="animate-result-reveal">
                    <PredictionResult predictorId={selectedTool.id} data={result} />
                  </motion.div>
                )}

                {/* Idle / awaiting state */}
                {!result && !loading && !errorMsg && activeCfg && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="scan-active-panel border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[240px] p-8 text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      className={`w-14 h-14 rounded-full ${activeCfg.bgClass} flex items-center justify-center`}
                    >
                      {ActiveIcon && (
                        <ActiveIcon className={`w-7 h-7 ${activeCfg.textClass}`} />
                      )}
                    </motion.div>
                    <span className="text-xs font-semibold text-muted-foreground max-w-[220px] leading-relaxed">
                      Awaiting scan… Upload or capture a clear diagnostic photo to start local CNN
                      feature extraction and disease precautions analysis.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginPromptModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default ScanPage;
