import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { diabetesSchema } from '../../lib/validators/diabetesSchema';
import type { DiabetesInputs } from '../../lib/validators/diabetesSchema';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { getLocalPredictionFallback } from '../../utils/localPredictorsFallback';
import { showToast } from '../../utils/toast';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../components/medical/PredictionResult';
import { BrainCircuit, Loader2, Send, ArrowLeft, ShieldAlert, Droplets, ChevronDown, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const fieldVariant = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const ACCENT_RGB = '6, 182, 212'; // cyan-500
const ACCENT_HEX = '#06b6d4';

const DiabetesPredictor: React.FC = () => {
  const navigate = useNavigate();
  const { logPrediction } = useHealthDispatch();

  const [formData, setFormData] = useState<Partial<DiabetesInputs>>({
    age: 45, gender: 'Male', polyuria: false, polydipsia: false, suddenWeightLoss: false,
    weakness: false, polyphagia: false, visualBlurring: false, itching: false,
    irritability: false, delayedHealing: false, partialParesis: false,
    muscleStiffness: false, alopecia: false, obesity: false, hba1c: 5.7, fastingBloodSugar: 100
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg] = useState<string | null>(null);

  const handleFieldChange = (name: keyof DiabetesInputs, val: any) => {
    setFormData(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) setFormErrors(prev => { const e = { ...prev }; delete e[name]; return e; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});
    const validationResult = diabetesSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => { if (issue.path[0]) errors[issue.path[0] as string] = issue.message; });
      setFormErrors(errors);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('medical-predictor', { body: { predictorId: 'diabetes', inputs: validationResult.data } });
      if (error) throw error;
      setResult(data);
      logPrediction('diabetes', validationResult.data, data);
    } catch {
      const fallbackResult = getLocalPredictionFallback('diabetes', validationResult.data);
      setResult(fallbackResult);
      logPrediction('diabetes', validationResult.data, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const symptoms = [
    { key: 'polyuria', label: 'Polyuria (Excessive Urination)' },
    { key: 'polydipsia', label: 'Polydipsia (Excessive Thirst)' },
    { key: 'suddenWeightLoss', label: 'Sudden Weight Loss' },
    { key: 'weakness', label: 'Chronic Weakness / Fatigue' },
    { key: 'polyphagia', label: 'Polyphagia (Excessive Hunger)' },
    { key: 'visualBlurring', label: 'Visual Blurring / Dimness' },
    { key: 'itching', label: 'Pruritus / Severe Itching' },
    { key: 'irritability', label: 'Irritability / Mood changes' },
    { key: 'delayedHealing', label: 'Delayed Healing of cuts/sores' },
    { key: 'partialParesis', label: 'Partial Paresis / muscle weakness' },
    { key: 'muscleStiffness', label: 'Muscle Stiffness / Spasms' },
    { key: 'alopecia', label: 'Alopecia (Sudden Hair Loss)' },
    { key: 'obesity', label: 'Obesity / High body weight' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12" style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties}>
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-cyan-500/3 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-purple-500/3 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] bg-teal-500/3 dark:bg-teal-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

      <motion.div className="flex items-center gap-4 relative z-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <button onClick={() => navigate('/predictors')} className="p-2.5 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all border border-slate-300 dark:border-slate-800/60 touch-target flex items-center justify-center shadow-sm" aria-label="Back to predictors hub">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center bg-cyan-500/15 shrink-0" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <Droplets className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-primary to-teal-500 dark:from-cyan-400 dark:via-primary dark:to-teal-400">Diabetes Risk Predictor</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evaluate risk using clinical checks, HbA1c, and metabolic symptoms.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <motion.form onSubmit={handleSubmit} className="lg:col-span-7 scan-active-panel rounded-2xl p-6 shadow-xl relative space-y-5" style={{ '--scan-rgb': ACCENT_RGB } as React.CSSProperties} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
          <motion.h3 className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white" style={{ borderLeft: `3px solid ${ACCENT_HEX}` }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
            <motion.span animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <BrainCircuit className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            </motion.span>
            <span>Enter Diabetes Lab &amp; Vitals Metrics</span>
          </motion.h3>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2" variants={containerVariants} initial="hidden" animate="show">
            <motion.div className="space-y-1.5" variants={fieldVariant}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="diabAge">Age</label>
              <input id="diabAge" type="number" inputMode="numeric" placeholder="e.g. 45" className="predictor-input w-full h-12 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none" style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties} value={formData.age ?? ''} onChange={e => handleFieldChange('age', Number(e.target.value))} />
              {formErrors.age && <p className="text-[10px] text-rose-500 font-bold">{formErrors.age}</p>}
            </motion.div>

            <motion.div className="space-y-1.5" variants={fieldVariant}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="diabGender">Gender</label>
              <div className="relative">
                <select id="diabGender" className="predictor-input w-full h-12 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none appearance-none pr-10 cursor-pointer" style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties} value={formData.gender || 'Male'} onChange={e => handleFieldChange('gender', e.target.value as any)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /></div>
              </div>
            </motion.div>

            <motion.div className="space-y-1.5" variants={fieldVariant}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="diabHba1c">HbA1c (%)</label>
              <input id="diabHba1c" type="number" step="0.1" inputMode="decimal" placeholder="e.g. 5.7" className="predictor-input w-full h-12 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none" style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties} value={formData.hba1c ?? ''} onChange={e => handleFieldChange('hba1c', Number(e.target.value))} />
              {formErrors.hba1c && <p className="text-[10px] text-rose-500 font-bold">{formErrors.hba1c}</p>}
            </motion.div>

            <motion.div className="space-y-1.5" variants={fieldVariant}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="diabFbs">Fasting Blood Sugar (mg/dL)</label>
              <input id="diabFbs" type="number" inputMode="numeric" placeholder="e.g. 100" className="predictor-input w-full h-12 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none" style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties} value={formData.fastingBloodSugar ?? ''} onChange={e => handleFieldChange('fastingBloodSugar', Number(e.target.value))} />
              {formErrors.fastingBloodSugar && <p className="text-[10px] text-rose-500 font-bold">{formErrors.fastingBloodSugar}</p>}
            </motion.div>

            <motion.div className="sm:col-span-2 border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3" variants={fieldVariant}>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500/60" />Select Symptomatic Indicators
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {symptoms.map((item) => {
                  const isActive = !!formData[item.key as keyof DiabetesInputs];
                  return (
                    <motion.button type="button" key={item.key} onClick={() => handleFieldChange(item.key as any, !isActive)} variants={fieldVariant} whileTap={{ scale: 0.97 }} whileHover={{ y: -1 }}
                      className={`flex items-center justify-between p-3.5 border rounded-xl text-left cursor-pointer h-12 transition-all duration-300 ${isActive ? 'predictor-checkbox-active border-cyan-500/40 bg-cyan-500/8 dark:bg-cyan-500/10' : 'border-slate-250 dark:border-slate-800 hover:border-cyan-500/25 hover:bg-cyan-500/3'}`}
                      style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties}>
                      <span className={`text-xs font-semibold leading-tight transition-colors duration-200 ${isActive ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-700 dark:text-slate-200'}`}>{item.label}</span>
                      <div className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-200 shrink-0" style={{ borderColor: isActive ? ACCENT_HEX : 'rgba(128,128,128,0.35)', backgroundColor: isActive ? ACCENT_HEX : 'transparent' }}>
                        <AnimatePresence>
                          {isActive && (
                            <motion.svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </motion.svg>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          <div className="pt-4">
            <motion.button type="submit" disabled={loading} whileHover={loading ? {} : { scale: 1.015, boxShadow: `0 8px 30px rgba(${ACCENT_RGB}, 0.3)` }} whileTap={loading ? {} : { scale: 0.98 }} className="group relative w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 disabled:pointer-events-none touch-target overflow-hidden" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_HEX}, #0f766e)` }}>
              <span className="btn-shine" />
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin relative z-10" /><span className="relative z-10">Analyzing metabolic metrics...</span></>) : (<><Send className="w-4 h-4 relative z-10" /><span className="relative z-10">Run AI Risk Assessment</span></>)}
            </motion.button>
          </div>
        </motion.form>

        <motion.div className="lg:col-span-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}>
          {errorMsg && <motion.div className="p-3 bg-destructive/10 border border-destructive/20 text-rose-500 text-xs rounded-lg mb-4 flex items-start gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" /><span>{errorMsg}</span></motion.div>}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                <PredictionResult predictorId="diabetes" data={result} />
              </motion.div>
            ) : (
              <motion.div key="placeholder" className="scan-active-panel rounded-2xl p-8 text-center text-xs font-semibold relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-5 shadow-xl" style={{ '--scan-rgb': ACCENT_RGB } as React.CSSProperties} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
                <div className="absolute w-32 h-32 rounded-full animate-orb-pulse" style={{ background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.15), transparent 70%)` }} />
                <div className="absolute w-48 h-48 rounded-full animate-orb-pulse" style={{ background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.08), transparent 70%)`, animationDelay: '1s' }} />
                {[...Array(5)].map((_, i) => (<div key={i} className="absolute w-1.5 h-1.5 rounded-full animate-float-particle" style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.3)`, left: `${20 + i * 15}%`, top: `${25 + (i % 3) * 20}%`, animationDelay: `${i * 0.7}s`, animationDuration: `${3 + i * 0.5}s` }} />))}
                <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 bg-cyan-500/12" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <BrainCircuit className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                </motion.div>
                <div className="relative z-10 space-y-2">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Awaiting Your Inputs</p>
                  <p className="max-w-[240px] leading-relaxed text-slate-400 dark:text-slate-500 text-xs">Complete the form to see your AI risk evaluation and personalized recommendations.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default DiabetesPredictor;
