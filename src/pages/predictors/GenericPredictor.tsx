import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { genericPredictorConfig } from '../../lib/predictorConfig';
import { genericSchemas } from '../../lib/validators/genericSchemas';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { getLocalPredictionFallback } from '../../utils/localPredictorsFallback';
import { showToast } from '../../utils/toast';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../components/medical/PredictionResult';
import { useTheme } from '../../context/ThemeContext';
import { 
  BrainCircuit, 
  RefreshCw, 
  Send, 
  ArrowLeft, 
  ShieldAlert,
  ChevronDown,
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
  Sparkles
} from 'lucide-react';

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

const getGradientClass = (id: string) => {
  switch (id) {
    case 'hypertension': return 'from-purple-600 via-primary to-fuchsia-500 dark:from-purple-400 dark:via-primary dark:to-fuchsia-400';
    case 'stroke': return 'from-indigo-600 via-primary to-blue-500 dark:from-indigo-400 dark:via-primary dark:to-blue-400';
    case 'tuberculosis': return 'from-lime-600 via-primary to-emerald-500 dark:from-lime-400 dark:via-primary dark:to-emerald-400';
    case 'dengue': return 'from-yellow-600 via-primary to-orange-500 dark:from-yellow-400 dark:via-primary dark:to-orange-400';
    case 'pcos': return 'from-pink-600 via-primary to-rose-500 dark:from-pink-400 dark:via-primary dark:to-rose-400';
    case 'phq9': return 'from-sky-600 via-primary to-cyan-500 dark:from-sky-400 dark:via-primary dark:to-cyan-400';
    case 'gad7': return 'from-teal-600 via-primary to-emerald-500 dark:from-teal-400 dark:via-primary dark:to-emerald-400';
    case 'stopbang': return 'from-slate-600 via-primary to-zinc-500 dark:from-slate-400 dark:via-primary dark:to-zinc-400';
    case 'vitaminD': return 'from-amber-600 via-primary to-yellow-500 dark:from-amber-400 dark:via-primary dark:to-yellow-400';
    case 'osteoporosis': return 'from-stone-600 via-primary to-neutral-500 dark:from-stone-400 dark:via-primary dark:to-neutral-400';
    default: return 'from-indigo-600 via-primary to-blue-500 dark:from-indigo-400 dark:via-primary dark:to-blue-400';
  }
};

const GenericPredictor: React.FC = () => {
  const { predictorId } = useParams<{ predictorId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { logPrediction } = useHealthDispatch();

  const [config, setConfig] = useState(() => 
    predictorId ? genericPredictorConfig[predictorId] : null
  );
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync config when URL changes
  useEffect(() => {
    if (predictorId) {
      const activeConfig = genericPredictorConfig[predictorId];
      if (activeConfig) {
        setConfig(activeConfig);
        setResult(null);
        setErrorMsg(null);
        setFormErrors({});
        
        // Initialize default form fields
        const initialForm: Record<string, any> = {};
        activeConfig.fields.forEach(f => {
          if (f.type === 'boolean') initialForm[f.name] = false;
          else if (f.type === 'number') initialForm[f.name] = '';
          else if (f.type === 'select') initialForm[f.name] = f.options ? f.options[0] : '';
        });
        setFormData(initialForm);
      } else {
        navigate('/predictors');
      }
    }
  }, [predictorId, navigate]);

  if (!config) return null;

  const cfg = genericConfigs[config.id] || { icon: Sparkles, rgb: '99, 102, 241', textClass: 'text-indigo-600 dark:text-indigo-400', bgClass: 'bg-indigo-500/15' };
  const IconComp = cfg.icon;

  const handleFieldChange = (name: string, val: any) => {
    setFormData(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const errors = { ...prev };
        delete errors[name];
        return errors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setFormErrors({});

    // Parse values (convert number strings to numbers)
    const parsedData: Record<string, any> = {};
    config.fields.forEach(f => {
      if (f.type === 'number') {
        parsedData[f.name] = formData[f.name] === '' ? undefined : Number(formData[f.name]);
      } else if (f.type === 'select' && f.options) {
        // Strip number prefix if doing PHQ/GAD (e.g. '0 - Not at all' to number 0)
        const val = formData[f.name];
        if (config.id === 'phq9' || config.id === 'gad7') {
          parsedData[f.name] = Number(val.split(' ')[0]);
        } else {
          parsedData[f.name] = val;
        }
      } else {
        parsedData[f.name] = formData[f.name];
      }
    });

    // Client-side Zod validation
    const schema = (genericSchemas as any)[config.id];
    if (schema) {
      const validationResult = schema.safeParse(parsedData);
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue: any) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setFormErrors(errors);
        setLoading(false);
        return;
      }
    }

    try {
      // Connect to Supabase edge function medical-predictor
      const { data, error } = await supabase.functions.invoke('medical-predictor', {
        body: {
          predictorId: config.id,
          inputs: parsedData
        }
      });

      if (error) throw error;
      
      setResult(data);
      logPrediction(config.id, parsedData, data);
    } catch (err: any) {
      console.error(err);
      const fallbackResult = getLocalPredictionFallback(config.id, parsedData);
      setResult(fallbackResult);
      logPrediction(config.id, parsedData, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const nonBooleanFields = config.fields.filter(f => f.type !== 'boolean');
  const booleanFields = config.fields.filter(f => f.type === 'boolean');

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12">
      <style>{`
        .focus-accent-${config.id}:focus {
          border-color: rgb(${cfg.rgb}) !important;
          box-shadow: 0 0 0 2px rgba(${cfg.rgb}, 0.2) !important;
        }
      `}</style>

      {/* Background drifting blobs */}
      <div 
        className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"
        style={{ backgroundColor: `rgba(${cfg.rgb}, ${isDark ? 0.1 : 0.03})` }}
      ></div>
      <div 
        className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" 
        style={{ 
          animationDuration: '25s', 
          animationDelay: '-5s',
          backgroundColor: `rgba(${cfg.rgb}, ${isDark ? 0.08 : 0.02})`
        }}
      ></div>
      <div 
        className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" 
        style={{ 
          animationDuration: '30s', 
          animationDelay: '-10s',
          backgroundColor: `rgba(${cfg.rgb}, ${isDark ? 0.08 : 0.02})`
        }}
      ></div>

      {/* Page Header */}
      <div className="flex items-center gap-4 relative z-10 animate-fade-in">
        <button 
          onClick={() => navigate('/predictors')}
          className="p-2.5 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all border border-slate-300 dark:border-slate-800/60 touch-target flex items-center justify-center shadow-sm"
          aria-label="Back to predictors hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse shrink-0"
            style={{ backgroundColor: `rgba(${cfg.rgb}, 0.15)` }}
          >
            <IconComp className={`w-6 h-6 ${cfg.textClass}`} />
          </div>
          <div>
            <h1 className={`text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r ${getGradientClass(config.id)}`}>
              {config.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{config.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Dynamic Form Panel (7 cols) */}
        <form 
          onSubmit={handleSubmit} 
          className="lg:col-span-7 scan-active-panel rounded-2xl p-6 shadow-xl relative space-y-5 animate-slide-up"
          style={{ '--scan-rgb': cfg.rgb } as React.CSSProperties}
        >
          <h3 
            className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white"
            style={{ borderLeft: `3px solid rgb(${cfg.rgb})` }}
          >
            <BrainCircuit className={`w-5 h-5 ${cfg.textClass} shrink-0`} />
            <span>Enter Assessment Indicators</span>
          </h3>

          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
            
            {nonBooleanFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nonBooleanFields.map((f, idx) => (
                  <div key={f.name} className="space-y-1 animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor={f.name}>
                      {f.label}
                    </label>
                    {f.type === 'select' ? (
                      <div className="relative">
                        <select
                          id={f.name}
                          className={`w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none transition-all appearance-none pr-10 focus-accent-${config.id}`}
                          onChange={e => handleFieldChange(f.name, e.target.value)}
                          value={formData[f.name] || ''}
                        >
                          {f.options?.map(opt => (
                            <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-850 dark:text-white">{opt}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-4 h-4" style={{ color: `rgb(${cfg.rgb})` }} />
                        </div>
                      </div>
                    ) : (
                      <input
                        id={f.name}
                        type="number"
                        inputMode="numeric"
                        step="any"
                        placeholder={f.placeholder}
                        className={`w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none transition-all focus-accent-${config.id}`}
                        value={formData[f.name] ?? ''}
                        onChange={e => handleFieldChange(f.name, e.target.value)}
                      />
                    )}
                    {formErrors[f.name] && <p className="text-[10px] text-rose-500 font-bold">{formErrors[f.name]}</p>}
                  </div>
                ))}
              </div>
            )}

            {booleanFields.length > 0 && (
              <div className={`pt-4 space-y-3 ${nonBooleanFields.length > 0 ? 'border-t border-slate-200 dark:border-slate-800' : ''}`}>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Select Symptomatic Indicators:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {booleanFields.map((f, idx) => (
                    <button
                      type="button"
                      key={f.name}
                      onClick={() => handleFieldChange(f.name, !formData[f.name])}
                      className="flex items-center justify-between p-3.5 border border-slate-250 dark:border-slate-800 rounded-xl hover:border-slate-400/30 transition-all text-left duration-250 cursor-pointer h-12 animate-slide-up"
                      style={{ 
                        animationDelay: `${(nonBooleanFields.length * 50) + idx * 50}ms`,
                        borderColor: formData[f.name] ? `rgba(${cfg.rgb}, 0.5)` : '',
                        backgroundColor: formData[f.name] ? `rgba(${cfg.rgb}, 0.08)` : ''
                      }}
                    >
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                        {f.label}
                      </span>
                      <div 
                        className="w-5 h-5 rounded flex items-center justify-center border transition-all"
                        style={{ 
                          borderColor: formData[f.name] ? `rgb(${cfg.rgb})` : 'rgba(128,128,128,0.4)',
                          backgroundColor: formData[f.name] ? `rgb(${cfg.rgb})` : 'transparent'
                        }}
                      >
                        {formData[f.name] && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:brightness-110 transform hover:scale-[1.01] animate-pulse-slow disabled:opacity-60 disabled:pointer-events-none touch-target"
              style={{ 
                backgroundImage: `linear-gradient(to right, rgb(${cfg.rgb}), rgba(${cfg.rgb}, 0.7))`,
                boxShadow: `0 4px 20px rgba(${cfg.rgb}, 0.15)`
              }}
            >
              {loading ? (
                <>
                  <div className={`w-5 h-5 rounded-full loader-ring-pulse flex items-center justify-center`} style={{ '--scan-rgb': '255,255,255' } as React.CSSProperties}>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <span>Analyzing screener responses...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Run AI Health Assessment</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Prediction Output Card (5 cols) */}
        <div className="lg:col-span-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {errorMsg && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-rose-500 text-xs rounded-lg mb-4 flex items-start gap-2">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {result ? (
            <PredictionResult predictorId={config.id} data={result} />
          ) : (
            <div 
              className="scan-active-panel border-dashed rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold py-20 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-4 shadow-xl"
              style={{ '--scan-rgb': cfg.rgb } as React.CSSProperties}
            >
              {/* Decorative animated rings */}
              <div 
                className="absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin-slow opacity-15"
                style={{ borderColor: `rgb(${cfg.rgb})`, animationDuration: '15s' }}
              ></div>
              <div 
                className="absolute w-28 h-28 rounded-full border border-dashed animate-spin opacity-10"
                style={{ borderColor: `rgb(${cfg.rgb})`, animationDuration: '30s', animationDirection: 'reverse' }}
              ></div>
              
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse relative z-10"
                style={{ backgroundColor: `rgba(${cfg.rgb}, 0.15)` }}
              >
                <BrainCircuit className={`w-7 h-7 ${cfg.textClass}`} />
              </div>
              <span className="max-w-[240px] leading-relaxed text-slate-500 dark:text-slate-400 relative z-10">
                Complete the form to see your AI risk evaluation
              </span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default GenericPredictor;

