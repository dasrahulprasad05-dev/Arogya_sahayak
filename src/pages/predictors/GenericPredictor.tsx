import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { genericPredictorConfig } from '../../lib/predictorConfig';
import { genericSchemas } from '../../lib/validators/genericSchemas';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { getLocalPredictionFallback } from '../../utils/localPredictorsFallback';
import { showToast } from '../../utils/toast';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../components/medical/PredictionResult';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { sendPredictionReportEmail } from '../../lib/emailService';
import { 
  BrainCircuit, 
  Loader2, 
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
  Sparkles,
  Mail,
  CheckCircle2
} from 'lucide-react';

/* ── Framer motion choreography ── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};
const fieldVariant = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
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
  const { user } = useAuth();

  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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
    <div
      className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12"
      style={{ '--accent-rgb': cfg.rgb } as React.CSSProperties}
    >
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
      <motion.div
        className="flex items-center gap-4 relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button 
          onClick={() => navigate('/predictors')}
          className="p-2.5 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all border border-slate-300 dark:border-slate-800/60 touch-target flex items-center justify-center shadow-sm"
          aria-label="Back to predictors hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `rgba(${cfg.rgb}, 0.15)` }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <IconComp className={`w-6 h-6 ${cfg.textClass}`} />
          </motion.div>
          <div>
            <h1 className={`text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r ${getGradientClass(config.id)}`}>
              {config.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{config.description}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Dynamic Form Panel (7 cols) */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="lg:col-span-7 scan-active-panel rounded-2xl p-6 shadow-xl relative space-y-5"
          style={{ '--scan-rgb': cfg.rgb } as React.CSSProperties}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <motion.h3 
            className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white"
            style={{ borderLeft: `3px solid rgb(${cfg.rgb})` }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <motion.span
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BrainCircuit className={`w-5 h-5 ${cfg.textClass} shrink-0`} />
            </motion.span>
            <span>Enter Assessment Indicators</span>
          </motion.h3>

          <motion.div
            className="space-y-4 max-h-[520px] overflow-y-auto pr-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            
            {nonBooleanFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nonBooleanFields.map((f) => (
                  <motion.div key={f.name} className="space-y-1.5" variants={fieldVariant}>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor={f.name}>
                      {f.label}
                    </label>
                    {f.type === 'select' ? (
                      <div className="relative">
                        <select
                          id={f.name}
                          className="predictor-input w-full h-12 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none appearance-none pr-10 cursor-pointer"
                          style={{ '--accent-rgb': cfg.rgb } as React.CSSProperties}
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
                        className="predictor-input w-full h-12 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none"
                        style={{ '--accent-rgb': cfg.rgb } as React.CSSProperties}
                        value={formData[f.name] ?? ''}
                        onChange={e => handleFieldChange(f.name, e.target.value)}
                      />
                    )}
                    {formErrors[f.name] && <p className="text-[10px] text-rose-500 font-bold">{formErrors[f.name]}</p>}
                  </motion.div>
                ))}
              </div>
            )}

            {booleanFields.length > 0 && (
              <motion.div className={`pt-4 space-y-3 ${nonBooleanFields.length > 0 ? 'border-t border-slate-200 dark:border-slate-800' : ''}`} variants={fieldVariant}>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: `rgba(${cfg.rgb}, 0.6)` }} />
                  Select Symptomatic Indicators
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {booleanFields.map((f) => {
                    const isActive = !!formData[f.name];
                    return (
                      <motion.button
                        type="button"
                        key={f.name}
                        onClick={() => handleFieldChange(f.name, !formData[f.name])}
                        variants={fieldVariant}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ y: -1 }}
                        className={`flex items-center justify-between p-3.5 border rounded-xl text-left cursor-pointer h-12 transition-all duration-300 ${
                          isActive
                            ? 'predictor-checkbox-active'
                            : 'border-slate-250 dark:border-slate-800'
                        }`}
                        style={{
                          '--accent-rgb': cfg.rgb,
                          borderColor: isActive ? `rgba(${cfg.rgb}, 0.4)` : '',
                          backgroundColor: isActive ? `rgba(${cfg.rgb}, 0.08)` : ''
                        } as React.CSSProperties}
                      >
                        <span className={`text-xs font-semibold leading-tight transition-colors duration-200 ${
                          isActive ? 'text-slate-800 dark:text-slate-200' : 'text-slate-700 dark:text-slate-200'
                        }`}>
                          {f.label}
                        </span>
                        <div 
                          className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-200 shrink-0"
                          style={{ 
                            borderColor: isActive ? `rgb(${cfg.rgb})` : 'rgba(128,128,128,0.35)',
                            backgroundColor: isActive ? `rgb(${cfg.rgb})` : 'transparent'
                          }}
                        >
                          <AnimatePresence>
                            {isActive && (
                              <motion.svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="4"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="animate-checkmark-draw" />
                              </motion.svg>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </motion.div>

          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.015, boxShadow: `0 8px 30px rgba(${cfg.rgb}, 0.3)` }}
              whileTap={loading ? {} : { scale: 0.98 }}
              className="group relative w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 disabled:pointer-events-none touch-target overflow-hidden"
              style={{ 
                backgroundImage: `linear-gradient(135deg, rgb(${cfg.rgb}), rgba(${cfg.rgb}, 0.7))`,
              }}
            >
              <span className="btn-shine" />
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  <span className="relative z-10">Analyzing screener responses...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Run AI Health Assessment</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Prediction Output Card (5 cols) */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          {errorMsg && (
            <motion.div
              className="p-3 bg-destructive/10 border border-destructive/20 text-rose-500 text-xs rounded-lg mb-4 flex items-start gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              >
                <PredictionResult predictorId={config.id} data={result} />

                {/* Email Report Button */}
                <motion.button
                  onClick={async () => {
                    if (!user?.email || emailSending || emailSent) return;
                    setEmailSending(true);
                    try {
                      await sendPredictionReportEmail(
                        user.email,
                        user.user_metadata?.full_name || '',
                        {
                          predictorName: config.name,
                          risk: result.risk,
                          confidence: result.confidence,
                          reasoning: result.reasoning,
                          recommendations: result.recommendations,
                          urgency: result.urgency,
                          disclaimer: result.disclaimer,
                        }
                      );
                      setEmailSent(true);
                      setTimeout(() => setEmailSent(false), 4000);
                    } catch {
                      // silently fail — email is non-critical
                    } finally {
                      setEmailSending(false);
                    }
                  }}
                  disabled={emailSending || emailSent || !user?.email}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full mt-3 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 border transition-all text-sm touch-target ${
                    emailSent
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-card border-border hover:bg-muted text-foreground hover:border-foreground'
                  }`}
                >
                  {emailSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Report Sent to {user?.email}</span>
                    </>
                  ) : emailSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Report...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>📧 Email My Report</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="scan-active-panel rounded-2xl p-8 text-center text-xs font-semibold relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-5 shadow-xl"
                style={{ '--scan-rgb': cfg.rgb } as React.CSSProperties}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {/* Layered gradient orbs */}
                <div 
                  className="absolute w-32 h-32 rounded-full animate-orb-pulse"
                  style={{ background: `radial-gradient(circle, rgba(${cfg.rgb}, 0.15), transparent 70%)` }}
                />
                <div 
                  className="absolute w-48 h-48 rounded-full animate-orb-pulse"
                  style={{ background: `radial-gradient(circle, rgba(${cfg.rgb}, 0.08), transparent 70%)`, animationDelay: '1s' }}
                />

                {/* Floating particles */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full animate-float-particle"
                    style={{
                      backgroundColor: `rgba(${cfg.rgb}, 0.3)`,
                      left: `${20 + i * 15}%`,
                      top: `${25 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.7}s`,
                      animationDuration: `${3 + i * 0.5}s`,
                    }}
                  />
                ))}
                
                <motion.div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                  style={{ backgroundColor: `rgba(${cfg.rgb}, 0.12)` }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <BrainCircuit className={`w-8 h-8 ${cfg.textClass}`} />
                </motion.div>

                <div className="relative z-10 space-y-2">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    Awaiting Your Inputs
                  </p>
                  <p className="max-w-[240px] leading-relaxed text-slate-400 dark:text-slate-500 text-xs">
                    Complete the form to see your AI risk evaluation and personalized recommendations.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

    </div>
  );
};

export default GenericPredictor;
