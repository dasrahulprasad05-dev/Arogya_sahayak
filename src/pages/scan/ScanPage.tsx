import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { scanToolsConfig } from '../../lib/cnn/scanConfig';
import type { ScanTool } from '../../lib/cnn/scanConfig';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import ImageScanner from '../../components/scan/ImageScanner';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../components/medical/PredictionResult';
import FeatureCard from '../../components/ui/FeatureCard';
import { scanConfigs } from './scanData';
import {
  ArrowLeft,
  ShieldAlert,
  RefreshCw,
  Scan,
} from 'lucide-react';

const DEFAULT_SCAN_CFG = {
  icon: Scan,
  rgb: '139, 92, 246',
  textClass: 'text-violet-600 dark:text-violet-400',
  bgClass: 'bg-violet-500/15',
  gradientClass: 'from-violet-500 to-purple-500',
  glowClass: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
};

const ScanPage: React.FC = () => {
  const { t } = useLanguage();
  const { logScan } = useHealthDispatch();

  const [selectedTool, setSelectedTool] = useState<ScanTool | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleScanComplete = async (cnnResult: { vector: number[]; score: number; label: string }) => {
    if (!selectedTool) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

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
      const llmPct = data.confidence || 75;
      const blendedPct = Math.round(0.35 * cnnPct + 0.65 * llmPct);

      const finalResult = { ...data, confidence: blendedPct };
      setResult(finalResult);
      logScan(selectedTool.id, cnnResult.label, cnnResult.score, finalResult);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit feature vectors to cloud analyzer.');

      const fallbackResult: PredictionData = {
        risk: 'Insufficient Data',
        confidence: Math.round(cnnResult.score * 100),
        reasoning: [
          `Local CNN classified as: ${cnnResult.label}`,
          'Could not connect to Supabase edge function for blended interpretation.',
        ],
        recommendations: [
          'Ensure network connection is online.',
          'Please present physical radiograph film or skin scans to a physician.',
        ],
        urgency: 'routine',
        disclaimer: t('disclaimer.text'),
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
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12">

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
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
            ⚠️ This is NOT a medical diagnosis tool
          </p>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed mt-1">
            This scanner uses a general-purpose MobileNetV2 model (trained on everyday objects, not
            medical images). Results are{' '}
            <strong>experimental image quality assessments</strong>, not clinical diagnoses. Always
            consult a qualified healthcare professional. If you notice concerning symptoms, please
            visit your nearest Primary Health Centre (PHC).
          </p>
        </div>
      </motion.div>

      {/* ── Animated header ───────────────────────── */}
      <motion.div layout className="flex items-center gap-4">
        {/* Back button — springs in when a tool is selected */}
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
            {/* Active tool icon — springs in */}
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

            {/* Title cross-fade */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={selectedTool ? selectedTool.id : '__menu__'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-violet-500 to-cyan-500 bg-[length:200%_auto]"
                style={{ animation: 'gradient-shift 6s ease infinite' }}
              >
                {selectedTool ? selectedTool.name : t('nav.scanners')}
              </motion.h1>
            </AnimatePresence>

            <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30 uppercase tracking-wider hidden sm:inline-block shrink-0">
              Experimental Preview
            </span>
          </div>

          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            {selectedTool
              ? 'Upload an image for on-device feature extraction. Results provide general guidance only — this is NOT a diagnosis. Please consult a doctor for clinical interpretation.'
              : 'Experimental image triage tools running entirely on-device. These provide general observations only and cannot replace a trained medical professional.'}
          </p>
        </div>
      </motion.div>

      {/* ── Main content — animated menu ↔ scanner ── */}
      <AnimatePresence mode="wait">
        {!selectedTool ? (
          /* Tool Selection Grid */
          <motion.div
            key="menu-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
          >
            {Object.values(scanToolsConfig).map((tool, index) => {
              const cfg = scanConfigs[tool.id] ?? DEFAULT_SCAN_CFG;
              return (
                <FeatureCard
                  key={tool.id}
                  icon={cfg.icon}
                  title={tool.name}
                  description={tool.description}
                  rgb={cfg.rgb}
                  index={index}
                  footerLabel="Open Scanner"
                  badge="Experimental • On-Device"
                  onClick={() => setSelectedTool(tool)}
                />
              );
            })}
          </motion.div>
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
                      Blended CNN &amp; LLM analysis in progress…
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
                      feature extraction immediately.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanPage;
