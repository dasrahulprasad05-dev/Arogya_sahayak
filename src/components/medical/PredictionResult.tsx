import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { PhoneCall, ShieldAlert, Sparkles, CheckCircle, Save } from 'lucide-react';

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
  const { logSymptom } = useHealthDispatch(); // we can reuse logSymptom as a generic log dispatcher or write logs
  const [saved, setSaved] = useState(false);

  const getRiskColors = (risk: string) => {
    switch (risk) {
      case 'Low':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
          bar: 'bg-emerald-500',
          label: 'Low Risk'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
          bar: 'bg-amber-500',
          label: 'Moderate Risk'
        };
      case 'High':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
          bar: 'bg-rose-500',
          label: 'High Risk'
        };
      case 'Critical':
        return {
          bg: 'bg-red-600/10 border-red-600/20 text-red-600 dark:text-red-400 animate-pulse',
          bar: 'bg-red-600',
          label: 'Critical Risk'
        };
      default:
        return {
          bg: 'bg-muted border-border text-muted-foreground',
          bar: 'bg-muted-foreground/30',
          label: 'Insufficient Data'
        };
    }
  };

  const colors = getRiskColors(data.risk);

  const handleSaveToHistory = () => {
    // Reuse dispatch to write an AI history log entry
    // In our HealthDispatchContext, we log AI predictions as generic or symptom logs
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

  return (
    <div className="bg-card border border-border rounded-2xl shadow-lg p-6 glass space-y-6">
      
      {/* Header and Risk Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Screening Result Indicator</span>
          <h3 className="font-heading font-extrabold text-lg text-foreground mt-0.5">AI Preventive Risk Report</h3>
        </div>
        
        <span className={`px-4 py-1.5 border rounded-xl text-xs font-extrabold uppercase tracking-wide shrink-0 ${colors.bg}`}>
          {colors.label}
        </span>
      </div>

      {/* Confidence gauge bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-muted-foreground">Predictive Confidence Index:</span>
          <span className="font-mono text-foreground font-bold">{formatNumber(data.confidence)}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/40">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${colors.bar}`}
            style={{ width: `${data.confidence}%` }}
          ></div>
        </div>
      </div>

      {/* Reasoning List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-foreground block uppercase tracking-wide flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
          <span>Reasoning Indices (Citing patient inputs):</span>
        </span>
        <ul className="space-y-2 pl-4 text-xs text-muted-foreground leading-relaxed list-disc">
          {data.reasoning.map((reason, idx) => (
            <li key={idx} className="break-words font-medium">{reason}</li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-foreground block uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>India-Specific Actionable Recommendations:</span>
        </span>
        <ul className="space-y-2 pl-4 text-xs text-muted-foreground leading-relaxed list-disc">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="break-words font-medium">{rec}</li>
          ))}
        </ul>
      </div>

      {/* non-dismissible screening disclaimer in active language */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
          <strong className="text-foreground">DISCLAIMER:</strong> {data.disclaimer || t('disclaimer.text')}
        </p>
      </div>

      {/* Action buttons footer */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {showSos && (
          <a
            href="tel:108"
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all text-sm touch-target"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
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
      </div>

    </div>
  );
};

export default PredictionResult;
