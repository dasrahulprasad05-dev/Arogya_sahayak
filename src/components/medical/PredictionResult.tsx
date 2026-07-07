import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { PhoneCall, ShieldAlert, Sparkles, CheckCircle, Save, Download } from 'lucide-react';

export interface PredictionData {
  risk: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Insufficient Data';
  confidence: number;
  reasoning: string[];
  recommendations: string[];
  urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
  missing_fields?: string[];
  sos_guidance?: string | null;
  disclaimer: string;
}

interface PredictionResultProps {
  predictorId: string;
  data: PredictionData;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ predictorId, data }) => {
  const { t, formatNumber } = useLanguage();
  const { logSymptom } = useHealthDispatch();
  const [saved, setSaved] = useState(false);
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
          label: 'Insufficient Data',
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

  const showSos = data.risk === 'High' || data.risk === 'Critical' || data.urgency === 'emergency' || data.urgency === 'urgent';

  // Animation variants — deliberate for high risk, springy for low risk
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
      
      {/* Header and Risk Badge — 0ms: badge scales in */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Screening Result Indicator</span>
          <h3 className="font-heading font-extrabold text-lg text-foreground mt-0.5">AI Preventive Risk Report</h3>
        </div>
        
        <motion.span
          className={`px-4 py-1.5 border rounded-xl text-xs font-extrabold uppercase tracking-wide shrink-0 ${colors.bg}`}
          {...badgeVariant}
        >
          {colors.label}
        </motion.span>
      </div>

      {/* Confidence gauge bar — 150ms: fills left-to-right */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-muted-foreground">Predictive Confidence Index:</span>
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

      {/* Reasoning List — 300ms: staggered 60ms apart */}
      <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
        <span className="text-xs font-bold text-foreground block uppercase tracking-wide flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
          <span>Reasoning Indices (Citing patient inputs):</span>
        </span>
        <ul className="space-y-2 pl-4 text-xs text-muted-foreground leading-relaxed list-disc">
          {data.reasoning.map((reason, idx) => (
            <motion.li key={idx} className="break-words font-medium" variants={staggerItem}>
              {reason}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Recommendations — 600ms: slides up */}
      <motion.div className="space-y-3" {...slideUpProps}>
        <span className="text-xs font-bold text-foreground block uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>India-Specific Actionable Recommendations:</span>
        </span>
        <ul className="space-y-2 pl-4 text-xs text-muted-foreground leading-relaxed list-disc">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="break-words font-medium">{rec}</li>
          ))}
        </ul>
      </motion.div>

      {/* non-dismissible screening disclaimer in active language */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
          <strong className="text-foreground">DISCLAIMER:</strong> {data.disclaimer || t('disclaimer.text')}
        </p>
      </div>

      {/* Action buttons footer */}
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
          onClick={() => window.print()}
          className="flex-1 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm touch-target shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.35)]"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

    </motion.div>
  );
};

export default PredictionResult;
