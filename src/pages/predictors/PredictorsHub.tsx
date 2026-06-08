import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { genericPredictorConfig } from '../../lib/predictorConfig';
import { 
  Droplets, 
  HeartPulse, 
  Activity, 
  Microscope, 
  Filter, 
  FlaskConical, 
  Syringe, 
  Zap, 
  Gauge, 
  Brain, 
  Wind, 
  Bug, 
  Circle, 
  SmilePlus, 
  AlertCircle, 
  Moon, 
  Sun, 
  Bone,
  ChevronRight,
  ClipboardCheck,
  Sparkles
} from 'lucide-react';

const dedicatedPredictors = [
  { id: 'diabetes', name: 'Diabetes Predictor', desc: 'Assess risk index using HbA1c, glucose, and symptoms.', path: '/predictors/diabetes' },
  { id: 'heart-attack', name: 'Heart Attack Screener', desc: 'Check cardiovascular risks using blood pressure and ECG metrics.', path: '/predictors/heart-attack' },
  { id: 'ecg', name: 'ECG Analyzer', desc: 'Screen for cardiac rhythm anomalies and QT intervals.', path: '/predictors/ecg' },
  { id: 'cancer', name: 'Cancer Screener', desc: 'General screening for family history and warning signs.', path: '/predictors/cancer' },
  { id: 'kidney', name: 'Kidney Health Assessor', desc: 'Assess renal function indicators using urea and creatinine.', path: '/predictors/kidney' },
  { id: 'liver', name: 'Liver Function Screener', desc: 'Check hepatic metrics using bilirubin, SGOT, and SGPT values.', path: '/predictors/liver' },
  { id: 'anemia', name: 'Anemia Checker', desc: 'Assess blood hemoglobin concentrations and chronic fatigue.', path: '/predictors/anemia' },
  { id: 'thyroid', name: 'Thyroid Assessment', desc: 'Triage thyroid parameters using TSH, T3, and T4 levels.', path: '/predictors/thyroid' }
];

const dedicatedConfigs: Record<string, { icon: React.ComponentType<any>; rgb: string; textClass: string; bgClass: string }> = {
  diabetes: { icon: Droplets, rgb: '6, 182, 212', textClass: 'text-cyan-600 dark:text-cyan-400', bgClass: 'bg-cyan-500/15' },
  'heart-attack': { icon: HeartPulse, rgb: '239, 68, 68', textClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500/15' },
  ecg: { icon: Activity, rgb: '139, 92, 246', textClass: 'text-violet-600 dark:text-violet-400', bgClass: 'bg-violet-500/15' },
  cancer: { icon: Microscope, rgb: '245, 158, 11', textClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-500/15' },
  kidney: { icon: Filter, rgb: '59, 130, 246', textClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-500/15' },
  liver: { icon: FlaskConical, rgb: '16, 185, 129', textClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-500/15' },
  anemia: { icon: Syringe, rgb: '244, 63, 94', textClass: 'text-rose-600 dark:text-rose-400', bgClass: 'bg-rose-500/15' },
  thyroid: { icon: Zap, rgb: '249, 115, 22', textClass: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-500/15' },
};

const genericConfigs: Record<string, { icon: React.ComponentType<any>; rgb: string; textClass: string; bgClass: string }> = {
  hypertension: { icon: Gauge, rgb: '168, 85, 247', textClass: 'text-purple-600 dark:text-purple-400', bgClass: 'bg-purple-500/15' },
  stroke: { icon: Brain, rgb: '99, 102, 241', textClass: 'text-indigo-600 dark:text-indigo-400', bgClass: 'bg-indigo-500/15' },
  tuberculosis: { icon: Wind, rgb: '132, 204, 22', textClass: 'text-lime-600 dark:text-lime-400', bgClass: 'bg-lime-500/15' },
  dengue: { icon: Bug, rgb: '234, 179, 8', textClass: 'text-yellow-600 dark:text-yellow-400', bgClass: 'bg-yellow-500/15' },
  pcos: { icon: Circle, rgb: '236, 72, 153', textClass: 'text-pink-600 dark:text-pink-400', bgClass: 'bg-pink-500/15' },
  phq9: { icon: SmilePlus, rgb: '14, 165, 233', textClass: 'text-sky-600 dark:text-sky-400', bgClass: 'bg-sky-500/15' },
  gad7: { icon: AlertCircle, rgb: '20, 184, 166', textClass: 'text-teal-600 dark:text-teal-400', bgClass: 'bg-teal-500/15' },
  stopbang: { icon: Moon, rgb: '100, 116, 139', textClass: 'text-slate-600 dark:text-slate-400', bgClass: 'bg-slate-500/15' },
  vitaminD: { icon: Sun, rgb: '245, 158, 11', textClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-500/15' },
  osteoporosis: { icon: Bone, rgb: '120, 113, 108', textClass: 'text-stone-600 dark:text-stone-400', bgClass: 'bg-stone-500/15' },
};

const PredictorsHub: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-12 relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] bg-cyan-500/3 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-purple-500/3 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] bg-pink-500/3 dark:bg-pink-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

      {/* Header and title area */}
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-primary to-purple-500 dark:from-cyan-400 dark:via-primary dark:to-purple-500">
          {t('nav.predictors')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
          Select a clinical predictor dashboard below to run preventive risk assessments, powered by standard diagnostic guidelines.
        </p>
      </div>

      {/* 1. Dedicated Predictors Section */}
      <div className="space-y-6">
        <div className="relative pl-5 flex items-center gap-3">
          <div className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full"></div>
          <Activity className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-800 dark:text-white">Dedicated Lab & Vitals Screeners</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {dedicatedPredictors.map((pred, index) => {
            const cfg = dedicatedConfigs[pred.id] || { icon: Activity, rgb: '139, 92, 246', textClass: 'text-violet-600 dark:text-violet-400', bgClass: 'bg-violet-500/15' };
            const IconComp = cfg.icon;
            return (
              <button
                key={pred.id}
                onClick={() => navigate(pred.path)}
                className="p-5 flex flex-col justify-between text-left rounded-2xl predictor-card group touch-target animate-slide-up"
                style={{ 
                  '--card-accent-rgb': cfg.rgb,
                  animationDelay: `${index * 75}ms`
                } as React.CSSProperties}
              >
                <div className="space-y-3">
                  {/* Icon container with accent color at 15% opacity background */}
                  <div 
                    className="w-12 h-12 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `rgba(${cfg.rgb}, 0.15)`,
                    }}
                  >
                    <IconComp className={`w-6 h-6 ${cfg.textClass}`} />
                  </div>
                  <h3 className="font-heading font-bold text-slate-800 dark:text-white text-lg leading-snug">
                    {pred.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pred.desc}
                  </p>
                </div>

                <span className={`text-xs ${cfg.textClass} mt-6 font-bold flex items-center gap-1`}>
                  <span>Run Screener</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Generic Config-Driven Section */}
      <div className="space-y-6">
        <div className="relative pl-5 flex items-center gap-3">
          <div className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
          <ClipboardCheck className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0" />
          <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-800 dark:text-white">Symptom & Questionnaire Screener Panels</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Object.values(genericPredictorConfig).map((pred, index) => {
            const cfg = genericConfigs[pred.id] || { icon: Sparkles, rgb: '236, 72, 153', textClass: 'text-pink-600 dark:text-pink-400', bgClass: 'bg-pink-500/15' };
            const IconComp = cfg.icon;
            return (
              <button
                key={pred.id}
                onClick={() => navigate(`/predictors/generic/${pred.id}`)}
                className="p-5 flex flex-col justify-between text-left rounded-2xl predictor-card group touch-target animate-slide-up"
                style={{ 
                  '--card-accent-rgb': cfg.rgb,
                  animationDelay: `${index * 75}ms`
                } as React.CSSProperties}
              >
                <div className="space-y-3">
                  {/* Icon container with accent color at 15% opacity background */}
                  <div 
                    className="w-12 h-12 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `rgba(${cfg.rgb}, 0.15)`,
                    }}
                  >
                    <IconComp className={`w-6 h-6 ${cfg.textClass}`} />
                  </div>
                  <h3 className="font-heading font-bold text-slate-800 dark:text-white text-lg leading-snug">
                    {pred.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pred.description}
                  </p>
                </div>

                <span className={`text-xs ${cfg.textClass} mt-6 font-bold flex items-center gap-1`}>
                  <span>Open Assessment</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PredictorsHub;
