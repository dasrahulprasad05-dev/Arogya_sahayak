import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ecgSchema } from '../../lib/validators/ecgSchema';
import type { EcgInputs } from '../../lib/validators/ecgSchema';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { getLocalPredictionFallback } from '../../utils/localPredictorsFallback';
import { showToast } from '../../utils/toast';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../components/medical/PredictionResult';
import { BrainCircuit, Loader2, Send, ArrowLeft, ShieldAlert, Activity, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const fieldVariant = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const ACCENT_RGB = '139, 92, 246';
const ACCENT_HEX = '#8b5cf6';

const ECGAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { logPrediction } = useHealthDispatch();

  const [formData, setFormData] = useState<Partial<EcgInputs>>({ heartRate: 72, prInterval: 160, qrsDuration: 90, qtInterval: 400, qtcInterval: 420, symptoms: [] });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg] = useState<string | null>(null);

  const handleFieldChange = (name: keyof EcgInputs, val: any) => {
    setFormData(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) setFormErrors(prev => { const e = { ...prev }; delete e[name]; return e; });
  };

  const handleSymptomToggle = (symp: string) => {
    const activeSymp = formData.symptoms || [];
    handleFieldChange('symptoms', activeSymp.includes(symp) ? activeSymp.filter(s => s !== symp) : [...activeSymp, symp]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});
    const validationResult = ecgSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => { if (issue.path[0]) errors[issue.path[0] as string] = issue.message; });
      setFormErrors(errors);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('medical-predictor', { body: { predictorId: 'ecg', inputs: validationResult.data } });
      if (error) throw error;
      setResult(data);
      logPrediction('ecg', validationResult.data, data);
    } catch {
      const fallbackResult = getLocalPredictionFallback('ecg', validationResult.data);
      setResult(fallbackResult);
      logPrediction('ecg', validationResult.data, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const numFields = [
    { id: 'ecgHr', label: 'Heart Rate (bpm)', field: 'heartRate', placeholder: 'e.g. 72' },
    { id: 'prInt', label: 'PR Interval (ms)', field: 'prInterval', placeholder: 'e.g. 160' },
    { id: 'qrsDur', label: 'QRS Duration (ms)', field: 'qrsDuration', placeholder: 'e.g. 90' },
    { id: 'qtInt', label: 'QT Interval (ms)', field: 'qtInterval', placeholder: 'e.g. 400' },
    { id: 'qtcInt', label: 'QTc Interval (ms)', field: 'qtcInterval', placeholder: 'e.g. 420' },
  ];

  const symptomOptions = ['Palpitations', 'Dizziness', 'Chest Tightness', 'Shortness of Breath', 'None of these'];

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12" style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties}>
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-violet-500/3 dark:bg-violet-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-purple-500/3 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] bg-pink-500/3 dark:bg-pink-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

      <motion.div className="flex items-center gap-4 relative z-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <button onClick={() => navigate('/predictors')} className="p-2.5 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all border border-slate-300 dark:border-slate-800/60 touch-target flex items-center justify-center shadow-sm" aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet-500/15 shrink-0" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <Activity className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-primary to-purple-500 dark:from-violet-400 dark:via-primary dark:to-purple-400">ECG Analysis</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evaluate ECG wave intervals, heart rates, and palpitations triggers.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <motion.form onSubmit={handleSubmit} className="lg:col-span-7 scan-active-panel rounded-2xl p-6 shadow-xl relative space-y-5" style={{ '--scan-rgb': ACCENT_RGB } as React.CSSProperties} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
          <motion.h3 className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white" style={{ borderLeft: `3px solid ${ACCENT_HEX}` }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
            <motion.span animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <BrainCircuit className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
            </motion.span>
            <span>Enter ECG Analysis &amp; Rhythm Parameters</span>
          </motion.h3>

          <motion.div className="space-y-4 max-h-[520px] overflow-y-auto pr-2" variants={containerVariants} initial="hidden" animate="show">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {numFields.map(({ id, label, field, placeholder }) => (
                <motion.div key={id} className="space-y-1.5" variants={fieldVariant}>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor={id}>{label}</label>
                  <input id={id} type="number" inputMode="numeric" placeholder={placeholder} className="predictor-input w-full h-12 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none" style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties} value={(formData as any)[field] ?? ''} onChange={e => handleFieldChange(field as any, Number(e.target.value))} />
                  {formErrors[field] && <p className="text-[10px] text-rose-500 font-bold">{formErrors[field]}</p>}
                </motion.div>
              ))}
            </div>

            <motion.div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3" variants={fieldVariant}>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-500/60" />Select Accompanying Symptoms
              </span>
              <div className="grid grid-cols-2 gap-3">
                {symptomOptions.map((symp) => {
                  const checked = (formData.symptoms || []).includes(symp);
                  return (
                    <motion.button type="button" key={symp} onClick={() => handleSymptomToggle(symp)} variants={fieldVariant} whileTap={{ scale: 0.97 }} whileHover={{ y: -1 }}
                      className={`flex items-center justify-between p-3.5 border rounded-xl text-left cursor-pointer h-12 transition-all duration-300 ${checked ? 'predictor-checkbox-active border-violet-500/40 bg-violet-500/8 dark:bg-violet-500/10' : 'border-slate-250 dark:border-slate-800 hover:border-violet-500/25'}`}
                      style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties}>
                      <span className={`text-xs font-semibold leading-tight ${checked ? 'text-violet-700 dark:text-violet-300' : 'text-slate-700 dark:text-slate-200'}`}>{symp}</span>
                      <div className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-200 shrink-0" style={{ borderColor: checked ? ACCENT_HEX : 'rgba(128,128,128,0.35)', backgroundColor: checked ? ACCENT_HEX : 'transparent' }}>
                        <AnimatePresence>
                          {checked && (
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
              {formErrors.symptoms && <p className="text-[10px] text-rose-500 font-bold">{formErrors.symptoms}</p>}
            </motion.div>
          </motion.div>

          <div className="pt-4">
            <motion.button type="submit" disabled={loading} whileHover={loading ? {} : { scale: 1.015, boxShadow: `0 8px 30px rgba(${ACCENT_RGB}, 0.3)` }} whileTap={loading ? {} : { scale: 0.98 }} className="group relative w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 disabled:pointer-events-none touch-target overflow-hidden" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_HEX}, #6d28d9)` }}>
              <span className="btn-shine" />
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin relative z-10" /><span className="relative z-10">Analyzing ECG Waves...</span></>) : (<><Send className="w-4 h-4 relative z-10" /><span className="relative z-10">Analyze ECG Profile</span></>)}
            </motion.button>
          </div>
        </motion.form>

        <motion.div className="lg:col-span-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}>
          {errorMsg && <div className="p-3 bg-destructive/10 border border-destructive/20 text-rose-500 text-xs rounded-lg mb-4 flex items-start gap-2"><ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" /><span>{errorMsg}</span></div>}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                <PredictionResult predictorId="ecg" data={result} />
              </motion.div>
            ) : (
              <motion.div key="placeholder" className="scan-active-panel rounded-2xl p-8 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-5 shadow-xl" style={{ '--scan-rgb': ACCENT_RGB } as React.CSSProperties} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
                <div className="absolute w-32 h-32 rounded-full animate-orb-pulse" style={{ background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.15), transparent 70%)` }} />
                <div className="absolute w-48 h-48 rounded-full animate-orb-pulse" style={{ background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.08), transparent 70%)`, animationDelay: '1s' }} />
                {[...Array(5)].map((_, i) => (<div key={i} className="absolute w-1.5 h-1.5 rounded-full animate-float-particle" style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.3)`, left: `${20 + i * 15}%`, top: `${25 + (i % 3) * 20}%`, animationDelay: `${i * 0.7}s`, animationDuration: `${3 + i * 0.5}s` }} />))}
                <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10" style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.12)` }} animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <Activity className="w-8 h-8 text-violet-600 dark:text-violet-400" />
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

export default ECGAnalysis;
