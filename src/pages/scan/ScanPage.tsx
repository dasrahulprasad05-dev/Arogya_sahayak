import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { scanToolsConfig } from '../../lib/cnn/scanConfig';
import type { ScanTool } from '../../lib/cnn/scanConfig';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import ImageScanner from '../../components/scan/ImageScanner';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../components/medical/PredictionResult';
import { ArrowLeft, ShieldAlert, RefreshCw, Scan } from 'lucide-react';
import PageShell from '../../components/ui/PageShell';
import FeatureCard from '../../components/ui/FeatureCard';
import { staggerContainer } from '../../components/ui/motion';
import { scanConfigs } from './scanData';

const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate="show"
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
    {children}
  </motion.div>
);

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
          localLabel: cnnResult.label
        }
      });

      if (error) throw error;

      const cnnPct = cnnResult.score * 100;
      const llmPct = data.confidence || 75;
      const blendedPct = Math.round(0.35 * cnnPct + 0.65 * llmPct);

      const finalResult = {
        ...data,
        confidence: blendedPct
      };

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
          'Could not connect to Supabase edge function for blended interpretation.'
        ],
        recommendations: [
          'Ensure network connection is online.',
          'Please present physical radiograph film or skin scans to a physician.'
        ],
        urgency: 'routine',
        disclaimer: t('disclaimer.text')
      };
      setResult(fallbackResult);
      logScan(selectedTool.id, cnnResult.label, cnnResult.score, fallbackResult);
    } finally {
      setLoading(false);
    }
  };

  const activeCfg = selectedTool ? scanConfigs[selectedTool.id] : null;
  const ActiveIcon = activeCfg ? activeCfg.icon : null;

  return (
    <PageShell 
      title={
        <div className="flex items-center gap-3">
          {selectedTool && (
            <button 
              onClick={() => {
                setSelectedTool(null);
                setResult(null);
                setErrorMsg(null);
              }}
              className="p-2.5 bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-all border border-border touch-target flex items-center justify-center shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {selectedTool && ActiveIcon && (
            <ActiveIcon className={`w-8 h-8 ${activeCfg?.textClass}`} />
          )}
          <span>{selectedTool ? selectedTool.name : t('nav.scanners')}</span>
          <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30 uppercase tracking-wider hidden sm:inline-block">
            Experimental Preview
          </span>
        </div>
      }
      subtitle={selectedTool 
        ? 'Upload an image for on-device feature extraction. Results provide general guidance only — this is NOT a diagnosis. Please consult a doctor for clinical interpretation.' 
        : 'Experimental image triage tools running entirely on-device. These provide general observations only and cannot replace a trained medical professional.'
      }
      gradient="from-rose-600 via-violet-600 to-cyan-500 dark:from-rose-400 dark:via-violet-400 dark:to-cyan-400"
    >
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">⚠️ This is NOT a medical diagnosis tool</p>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed mt-1">
            This scanner uses a general-purpose MobileNetV2 model (trained on everyday objects, not medical images). 
            Results are <strong>experimental image quality assessments</strong>, not clinical diagnoses. 
            Always consult a qualified healthcare professional. If you notice concerning symptoms, 
            please visit your nearest Primary Health Centre (PHC).
          </p>
        </div>
      </div>

      {!selectedTool ? (
        <Grid>
          {Object.values(scanToolsConfig).map((tool) => {
            const cfg = scanConfigs[tool.id] || { icon: Scan, rgb: '139, 92, 246', textClass: 'text-violet-600 dark:text-violet-400' };
            return (
              <FeatureCard
                key={tool.id}
                icon={cfg.icon}
                rgb={cfg.rgb}
                textClass={cfg.textClass}
                title={tool.name}
                desc={tool.description}
                ctaLabel="Open Scanner"
                badge="Experimental • On-Device"
                onClick={() => setSelectedTool(tool)}
              />
            );
          })}
        </Grid>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
          <div className="lg:col-span-5 space-y-4">
            {loading && (
              <div className="bg-card/40 border border-border rounded-2xl p-8 text-center text-xs font-semibold py-20 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                <RefreshCw className={`w-8 h-8 ${activeCfg?.textClass} animate-spin`} />
                <span className="text-muted-foreground">Blended CNN & LLM analysis in progress...</span>
              </div>
            )}
            {errorMsg && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive-foreground text-xs rounded-xl flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                <span className="text-red-500 leading-relaxed">{errorMsg}</span>
              </div>
            )}
            {result && !loading && (
              <div>
                <PredictionResult predictorId={selectedTool.id} data={result} />
              </div>
            )}
            {!result && !loading && activeCfg && (
              <div className="bg-white/40 dark:bg-card/40 border border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground text-xs font-semibold py-20 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                <div className={`w-12 h-12 rounded-full ${activeCfg.bgClass} flex items-center justify-center animate-pulse`}>
                  {ActiveIcon && <ActiveIcon className={`w-6 h-6 ${activeCfg.textClass}`} />}
                </div>
                <span className="max-w-xs leading-relaxed">
                  Awaiting scan... Upload or capture a clear diagnostic photo to start local CNN feature extraction immediately.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default ScanPage;
