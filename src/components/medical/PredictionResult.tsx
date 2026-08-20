import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { PREDICTOR_SPECIALTY_MAP } from '../../lib/types/doctor';
import { generateScanReportPdf } from '../../utils/scanPdfReport';
import { 
  PhoneCall, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  Save, 
  Download, 
  Stethoscope, 
  Flame, 
  AlertTriangle,
  Sliders
} from 'lucide-react';

import type { PredictionData } from '../../lib/types/prediction';

interface PredictionResultProps {
  predictorId: string;
  data: PredictionData;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ predictorId, data }) => {
  const navigate = useNavigate();
  const { t, formatNumber } = useLanguage();
  const { logSymptom } = useHealthDispatch();
  const [saved, setSaved] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [heatmapMode, setHeatmapMode] = useState<'composite' | 'heatmap' | 'original'>('composite');
  const [heatmapOpacity, setHeatmapOpacity] = useState(60);
  const prefersReducedMotion = useReducedMotion();

  // For High/Critical: use slow, deliberate animations — no bounce/spring
  const isHighRisk = data.risk === 'High' || data.risk === 'Critical';

  const getRiskColors = (risk: string) => {
    switch (risk) {
      case 'Low':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
          bar: 'bg-emerald-500',
          label: 'Low Risk',
          border: 'border-l-emerald-500'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
          bar: 'bg-amber-500',
          label: 'Moderate Risk',
          border: 'border-l-amber-500'
        };
      case 'High':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
          bar: 'bg-rose-500',
          label: 'High Risk',
          border: 'border-l-rose-500'
        };
      case 'Critical':
        return {
          bg: 'bg-red-600/10 border-red-600/20 text-red-600 dark:text-red-400',
          bar: 'bg-red-600',
          label: 'Critical Risk',
          border: 'border-l-red-600'
        };
      default:
        return {
          bg: 'bg-muted border-border text-muted-foreground',
          bar: 'bg-muted-foreground/30',
          label: 'Insufficient Data / Review',
          border: 'border-l-border'
        };
    }
  };

  const colors = getRiskColors(data.risk);

  const handleSaveToHistory = () => {
    logSymptom([`${predictorId.toUpperCase()} Prediction`], {
      risk: data.risk,
      confidence: data.confidence,
      reasoning: data.reasoning,
      recommendations: data.recommendations
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (data.originalImageUrl || data.heatmapUrl) {
      setGeneratingPdf(true);
      try {
        await generateScanReportPdf({
          toolName: predictorId.toUpperCase() + ' Imaging Assessment',
          category: 'Diagnostic Triage',
          result: data,
          originalImage: data.originalImageUrl,
          heatmapImage: data.compositeUrl || data.heatmapUrl,
        });
      } catch (err) {
        console.error('PDF generation error, falling back to print:', err);
        window.print();
      } finally {
        setGeneratingPdf(false);
      }
    } else {
      window.print();
    }
  };

  const showSos = data.risk === 'High' || data.risk === 'Critical' || data.urgency === 'emergency' || data.urgency === 'urgent';
  const hasHeatmap = Boolean(data.heatmapUrl || data.compositeUrl);
  const isSafetyGateFlagged = data.safetyGateStatus === 'uncertain_further_evaluation';

  // Animation variants
  const badgeVariant = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : isHighRisk
      ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.6 } } }
      : { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } } };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06, delayChildren: prefersReducedMotion ? 0 : 0.3 }
    }
  };

  const staggerItem = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

  const slideUpProps = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 12 } as const, animate: { opacity: 1, y: 0 } as const, transition: { duration: 0.35, delay: 0.6 } };

  return (
    <motion.div
      className={`bg-card border rounded-2xl shadow-lg p-6 glass space-y-6 ${isHighRisk ? `border-l-4 ${colors.border} border-border` : 'border-border'} pdf-report`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isHighRisk ? 0.5 : 0.3, ease: 'easeOut' }}
    >
      
      {/* 1. Header and Risk Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Screening Result Indicator</span>
          <h3 className="font-heading font-extrabold text-lg text-foreground mt-0.5">
            {data.computedBy === 'offline_rules' ? 'Offline Local Mode' : 
             data.computedBy === 'server_rules' ? 'Basic Assessment' :
             data.computedBy === 'server_rules_ml' ? 'Advanced ML Assessment' :
             'AI Multimodal Health Report'}
          </h3>
        </div>
        
        <motion.span
          className={`px-4 py-1.5 border rounded-xl text-xs font-extrabold uppercase tracking-wide shrink-0 ${colors.bg}`}
          {...badgeVariant}
        >
          {colors.label}
        </motion.span>
      </div>

      {/* 2. Safety Gate Alert (If Uncertain / Borderline) */}
      {isSafetyGateFlagged && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">
              🛡️ Safety Gate: Model Uncertainty Detected
            </span>
            <p className="text-amber-700/90 dark:text-amber-300/90">
              The neural activation confidence for this scan is near the classification boundary. To ensure patient safety, this result is marked as <strong>Inconclusive</strong>. Please consult a clinician for standard physical evaluation.
            </p>
          </div>
        </div>
      )}

      {/* 3. Grad-CAM Visual Explainability Viewer (if scan image available) */}
      {hasHeatmap && (
        <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>🔥 Grad-CAM Visual Saliency Heatmap</span>
            </div>
            
            {/* View switcher buttons */}
            <div className="flex items-center bg-card border border-border rounded-lg p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setHeatmapMode('original')}
                className={`px-2.5 py-1 rounded-md transition-all ${heatmapMode === 'original' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Original Scan
              </button>
              <button
                type="button"
                onClick={() => setHeatmapMode('composite')}
                className={`px-2.5 py-1 rounded-md transition-all ${heatmapMode === 'composite' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Heatmap Overlay
              </button>
              <button
                type="button"
                onClick={() => setHeatmapMode('heatmap')}
                className={`px-2.5 py-1 rounded-md transition-all ${heatmapMode === 'heatmap' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Pure Saliency
              </button>
            </div>
          </div>

          {/* Interactive Heatmap Image Canvas */}
          <div className="relative h-64 w-full bg-slate-950/40 rounded-xl overflow-hidden flex items-center justify-center border border-border/60">
            {heatmapMode === 'original' && data.originalImageUrl && (
              <img 
                src={data.originalImageUrl} 
                alt="Original Captured Scan" 
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            )}

            {heatmapMode === 'heatmap' && data.heatmapUrl && (
              <img 
                src={data.heatmapUrl} 
                alt="Grad-CAM Saliency Map" 
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            )}

            {heatmapMode === 'composite' && (
              <div className="relative max-h-full max-w-full flex items-center justify-center">
                {data.originalImageUrl && (
                  <img 
                    src={data.originalImageUrl} 
                    alt="Base Scan" 
                    className="max-h-60 w-auto object-contain rounded-lg"
                  />
                )}
                {data.heatmapUrl && (
                  <img 
                    src={data.heatmapUrl} 
                    alt="Heatmap Overlay" 
                    className="absolute inset-0 max-h-60 w-auto object-contain rounded-lg mix-blend-screen"
                    style={{ opacity: heatmapOpacity / 100 }}
                  />
                )}
              </div>
            )}

            {/* Heatmap legend */}
            <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur px-2.5 py-1 rounded-lg border border-border text-[9px] flex items-center gap-2">
              <span className="font-bold text-muted-foreground">Attention:</span>
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-blue-400">Baseline</span>
                <div className="w-12 h-2 rounded bg-gradient-to-r from-blue-500 via-green-500 to-red-500" />
                <span className="text-[8px] text-red-500 font-bold">Hotspot</span>
              </div>
            </div>
          </div>

          {/* Opacity slider for composite mode */}
          {heatmapMode === 'composite' && (
            <div className="flex items-center gap-3 pt-1 text-xs">
              <Sliders className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-[11px] text-muted-foreground font-semibold">Heatmap Intensity:</span>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={heatmapOpacity} 
                onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs font-bold w-8">{heatmapOpacity}%</span>
            </div>
          )}
        </div>
      )}

      {/* 4. Confidence gauge bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-muted-foreground">Calibrated Predictive Confidence:</span>
          <span className="font-mono text-foreground font-bold">{formatNumber(data.confidence)}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/40">
          <motion.div 
            className={`h-full ${colors.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${data.confidence}%` }}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.15, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 5. Reasoning List */}
      <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
        <span className="text-xs font-bold text-foreground block uppercase tracking-wide flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
          <span>Clinical Reasoning &amp; Feature Indicators:</span>
        </span>
        <ul className="space-y-2 pl-4 text-xs text-muted-foreground leading-relaxed list-disc">
          {data.reasoning.map((reason, idx) => (
            <motion.li key={idx} className="break-words font-medium" variants={staggerItem}>
              {reason}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* 6. Recommendations */}
      <motion.div className="space-y-3" {...slideUpProps}>
        <span className="text-xs font-bold text-foreground block uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Actionable Clinical Guidance:</span>
        </span>
        <ul className="space-y-2 pl-4 text-xs text-muted-foreground leading-relaxed list-disc">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="break-words font-medium">{rec}</li>
          ))}
        </ul>
      </motion.div>

      {/* 7. Disclaimer */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
          <strong className="text-foreground">DISCLAIMER:</strong> {data.disclaimer || t('disclaimer.text')}
        </p>
      </div>

      {/* 8. Action buttons footer */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 hide-on-print">
        {showSos && (
          <a
            href="tel:108"
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all text-sm touch-target"
            style={isHighRisk ? { animation: 'pulse 2s ease-in-out infinite' } : {}}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency SOS (108)</span>
          </a>
        )}

        <button
          onClick={handleSaveToHistory}
          disabled={saved}
          className={`flex-1 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 border transition-all text-sm touch-target ${
            saved
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
              : 'bg-card border-border hover:bg-muted text-foreground hover:border-foreground'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save to History</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={generatingPdf}
          className="flex-1 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm touch-target shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>{generatingPdf ? 'Generating PDF...' : hasHeatmap ? 'Download Scan PDF' : 'Download PDF'}</span>
        </button>

        {/* See Doctor button */}
        {isHighRisk && (
          <button
            onClick={() => {
              const specialties = PREDICTOR_SPECIALTY_MAP[predictorId];
              const specialty = specialties?.[0] || '';
              navigate(`/doctors${specialty ? `?specialty=${specialty}` : ''}`);
            }}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all text-sm touch-target"
          >
            <Stethoscope className="w-4 h-4" />
            <span>🩺 Consult Specialist</span>
          </button>
        )}
      </div>

    </motion.div>
  );
};

export default PredictionResult;
