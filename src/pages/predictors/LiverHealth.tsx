import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { liverSchema } from '../../lib/validators/liverSchema';
import type { LiverInputs } from '../../lib/validators/liverSchema';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { getLocalPredictionFallback } from '../../utils/localPredictorsFallback';
import { showToast } from '../../utils/toast';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../lib/types/prediction';
import { templateRenderer } from '../../utils/templateRenderer';
import { 
  BrainCircuit, 
  Loader2, 
  Send, 
  ArrowLeft, 
  ShieldAlert,
  FlaskConical,
  ChevronDown
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

const ACCENT_RGB = '16, 185, 129'; // emerald-500
const ACCENT_HEX = '#10b981';

const numFields: { id: string; label: string; field: keyof LiverInputs; placeholder: string; step?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'] }[] = [
  { id: 'liverAge', label: 'Age', field: 'age', placeholder: 'e.g. 45' },
  { id: 'totBil', label: 'Total Bilirubin (mg/dL)', field: 'totalBilirubin', placeholder: 'e.g. 0.8', step: '0.1', inputMode: 'decimal' },
  { id: 'dirBil', label: 'Direct Bilirubin (mg/dL)', field: 'directBilirubin', placeholder: 'e.g. 0.2', step: '0.1', inputMode: 'decimal' },
  { id: 'alkPhos', label: 'Alkaline Phosphatase (IU/L)', field: 'alkalinePhosphotase', placeholder: 'e.g. 120' },
  { id: 'sgot', label: 'SGOT / AST (IU/L)', field: 'sgotAlat', placeholder: 'e.g. 35' },
  { id: 'sgpt', label: 'SGPT / ALT (IU/L)', field: 'sgptAsat', placeholder: 'e.g. 40' },
  { id: 'totProt', label: 'Total Proteins (g/dL)', field: 'totalProteins', placeholder: 'e.g. 7.0', step: '0.1', inputMode: 'decimal' },
  { id: 'alb', label: 'Albumin (g/dL)', field: 'albumin', placeholder: 'e.g. 4.0', step: '0.1', inputMode: 'decimal' },
  { id: 'agRat', label: 'A/G Ratio', field: 'agRatio', placeholder: 'e.g. 1.2', step: '0.1', inputMode: 'decimal' }
];

const LiverHealth: React.FC = () => {
  const navigate = useNavigate();
  const { logPrediction } = useHealthDispatch();

  const [formData, setFormData] = useState<Partial<LiverInputs>>({
    age: 45,
    gender: 'Male',
    totalBilirubin: 0.8,
    directBilirubin: 0.2,
    alkalinePhosphotase: 120,
    sgotAlat: 35,
    sgptAsat: 40,
    totalProteins: 7.0,
    albumin: 4.0,
    agRatio: 1.2
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (name: keyof LiverInputs, val: any) => {
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

    const validationResult = liverSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('medical-predictor', {
        body: {
          predictorId: 'liver',
          inputs: validationResult.data
        }
      });

      if (error) throw error;
      let finalResult = data;
      if (data.llm_failed && data.facts) {
        finalResult = templateRenderer(data.facts);
        showToast("AI Narrative generation failed. Displaying Basic Assessment.", "warning");
      }
      setResult(finalResult);
      logPrediction('liver', validationResult.data, finalResult);
    } catch (err: any) {
      console.error(err);
      const offlineFacts = getLocalPredictionFallback('liver', validationResult.data);
      const fallbackResult = templateRenderer(offlineFacts);
      setResult(fallbackResult);
      logPrediction('liver', validationResult.data, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12"
      style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties}
    >
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-emerald-500/3 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-teal-500/3 dark:bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] bg-green-500/3 dark:bg-green-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

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
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/15 shrink-0"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FlaskConical className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-primary to-green-500 dark:from-emerald-400 dark:via-primary dark:to-green-400">Liver Function Screener</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evaluate hepatic wellness indicators using total bilirubin, SGOT, SGPT, and protein metrics.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Panel (7 cols) */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="lg:col-span-7 scan-active-panel rounded-2xl p-6 shadow-xl relative space-y-5" 
          style={{ '--scan-rgb': ACCENT_RGB } as React.CSSProperties}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <motion.h3 
            className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white"
            style={{ borderLeft: `3px solid ${ACCENT_HEX}` }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <motion.span
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BrainCircuit className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </motion.span>
            <span>Enter Hepatic Lab Profiles</span>
          </motion.h3>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Gender */}
            <motion.div className="space-y-1.5" variants={fieldVariant}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="liverGender">Gender</label>
              <div className="relative">
                <select
                  id="liverGender"
                  className="predictor-input w-full h-12 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none appearance-none pr-10 cursor-pointer"
                  style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties}
                  value={formData.gender || 'Male'}
                  onChange={e => handleFieldChange('gender', e.target.value as any)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </motion.div>

            {numFields.map(({ id, label, field, placeholder, step, inputMode }) => (
              <motion.div key={id} className="space-y-1.5" variants={fieldVariant}>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor={id}>{label}</label>
                <input
                  id={id}
                  type="number"
                  step={step ?? '1'}
                  inputMode={inputMode ?? 'numeric'}
                  placeholder={placeholder}
                  className="predictor-input w-full h-12 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none"
                  style={{ '--accent-rgb': ACCENT_RGB } as React.CSSProperties}
                  value={(formData as any)[field] ?? ''}
                  onChange={e => handleFieldChange(field, Number(e.target.value))}
                />
                {formErrors[field] && <p className="text-[10px] text-rose-500 font-bold">{formErrors[field]}</p>}
              </motion.div>
            ))}

          </motion.div>

          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.015, boxShadow: `0 8px 30px rgba(${ACCENT_RGB}, 0.3)` }}
              whileTap={loading ? {} : { scale: 0.98 }}
              className="group relative w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 disabled:pointer-events-none touch-target overflow-hidden"
              style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_HEX}, #059669)` }}
            >
              <span className="btn-shine" />
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  <span className="relative z-10">Analyzing liver function...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Run Liver Function Check</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Output Panel (5 cols) */}
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
                <PredictionResult predictorId="liver" data={result} />
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                className="scan-active-panel rounded-2xl p-8 text-center text-xs font-semibold relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-5 shadow-xl" 
                style={{ '--scan-rgb': ACCENT_RGB } as React.CSSProperties}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div 
                  className="absolute w-32 h-32 rounded-full animate-orb-pulse"
                  style={{ background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.15), transparent 70%)` }}
                />
                <div 
                  className="absolute w-48 h-48 rounded-full animate-orb-pulse"
                  style={{ background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.08), transparent 70%)`, animationDelay: '1s' }}
                />
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full animate-float-particle"
                    style={{
                      backgroundColor: `rgba(${ACCENT_RGB}, 0.3)`,
                      left: `${20 + i * 15}%`,
                      top: `${25 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.7}s`,
                      animationDuration: `${3 + i * 0.5}s`,
                    }}
                  />
                ))}
                
                <motion.div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 bg-emerald-500/12"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <FlaskConical className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <div className="relative z-10 space-y-2">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Awaiting Your Inputs</p>
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

export default LiverHealth;
