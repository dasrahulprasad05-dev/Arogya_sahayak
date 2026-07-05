import { 
  Droplets, HeartPulse, Activity, Microscope, Filter, FlaskConical, Syringe, 
  Zap, Gauge, Brain, Wind, Bug, Circle, SmilePlus, AlertCircle, Moon, Sun, Bone
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const dedicatedPredictors = [
  { id: 'diabetes', name: 'Diabetes Predictor', desc: 'Assess risk index using HbA1c, glucose, and symptoms.', path: '/predictors/diabetes' },
  { id: 'heart-attack', name: 'Heart Attack Screener', desc: 'Check cardiovascular risks using blood pressure and ECG metrics.', path: '/predictors/heart-attack' },
  { id: 'ecg', name: 'ECG Analyzer', desc: 'Screen for cardiac rhythm anomalies and QT intervals.', path: '/predictors/ecg' },
  { id: 'cancer', name: 'Cancer Screener', desc: 'General screening for family history and warning signs.', path: '/predictors/cancer' },
  { id: 'kidney', name: 'Kidney Health Assessor', desc: 'Assess renal function indicators using urea and creatinine.', path: '/predictors/kidney' },
  { id: 'liver', name: 'Liver Function Screener', desc: 'Check hepatic metrics using bilirubin, SGOT, and SGPT values.', path: '/predictors/liver' },
  { id: 'anemia', name: 'Anemia Checker', desc: 'Assess blood hemoglobin concentrations and chronic fatigue.', path: '/predictors/anemia' },
  { id: 'thyroid', name: 'Thyroid Assessment', desc: 'Triage thyroid parameters using TSH, T3, and T4 levels.', path: '/predictors/thyroid' }
];

export const dedicatedConfigs: Record<string, { icon: LucideIcon; rgb: string; textClass: string; bgClass: string }> = {
  diabetes: { icon: Droplets, rgb: '6, 182, 212', textClass: 'text-cyan-500 dark:text-cyan-400', bgClass: 'bg-cyan-500/15' },
  'heart-attack': { icon: HeartPulse, rgb: '239, 68, 68', textClass: 'text-red-500 dark:text-red-400', bgClass: 'bg-red-500/15' },
  ecg: { icon: Activity, rgb: '139, 92, 246', textClass: 'text-violet-500 dark:text-violet-400', bgClass: 'bg-violet-500/15' },
  cancer: { icon: Microscope, rgb: '245, 158, 11', textClass: 'text-amber-500 dark:text-amber-400', bgClass: 'bg-amber-500/15' },
  kidney: { icon: Filter, rgb: '59, 130, 246', textClass: 'text-blue-500 dark:text-blue-400', bgClass: 'bg-blue-500/15' },
  liver: { icon: FlaskConical, rgb: '16, 185, 129', textClass: 'text-emerald-500 dark:text-emerald-400', bgClass: 'bg-emerald-500/15' },
  anemia: { icon: Syringe, rgb: '244, 63, 94', textClass: 'text-rose-500 dark:text-rose-400', bgClass: 'bg-rose-500/15' },
  thyroid: { icon: Zap, rgb: '249, 115, 22', textClass: 'text-orange-500 dark:text-orange-400', bgClass: 'bg-orange-500/15' },
};

export const genericConfigs: Record<string, { icon: LucideIcon; rgb: string; textClass: string; bgClass: string }> = {
  hypertension: { icon: Gauge, rgb: '168, 85, 247', textClass: 'text-purple-500 dark:text-purple-400', bgClass: 'bg-purple-500/15' },
  stroke: { icon: Brain, rgb: '99, 102, 241', textClass: 'text-indigo-500 dark:text-indigo-400', bgClass: 'bg-indigo-500/15' },
  tuberculosis: { icon: Wind, rgb: '132, 204, 22', textClass: 'text-lime-500 dark:text-lime-400', bgClass: 'bg-lime-500/15' },
  dengue: { icon: Bug, rgb: '234, 179, 8', textClass: 'text-yellow-500 dark:text-yellow-400', bgClass: 'bg-yellow-500/15' },
  pcos: { icon: Circle, rgb: '236, 72, 153', textClass: 'text-pink-500 dark:text-pink-400', bgClass: 'bg-pink-500/15' },
  phq9: { icon: SmilePlus, rgb: '14, 165, 233', textClass: 'text-sky-500 dark:text-sky-400', bgClass: 'bg-sky-500/15' },
  gad7: { icon: AlertCircle, rgb: '20, 184, 166', textClass: 'text-teal-500 dark:text-teal-400', bgClass: 'bg-teal-500/15' },
  stopbang: { icon: Moon, rgb: '100, 116, 139', textClass: 'text-slate-500 dark:text-slate-400', bgClass: 'bg-slate-500/15' },
  vitaminD: { icon: Sun, rgb: '245, 158, 11', textClass: 'text-amber-500 dark:text-amber-400', bgClass: 'bg-amber-500/15' },
  osteoporosis: { icon: Bone, rgb: '120, 113, 108', textClass: 'text-stone-500 dark:text-stone-400', bgClass: 'bg-stone-500/15' },
};
