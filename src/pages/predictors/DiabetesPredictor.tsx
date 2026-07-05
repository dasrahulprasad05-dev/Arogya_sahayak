import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diabetesSchema } from '../../lib/validators/diabetesSchema';
import type { DiabetesInputs } from '../../lib/validators/diabetesSchema';
import { supabase } from '../../integrations/supabase/client';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { getLocalPredictionFallback } from '../../utils/localPredictorsFallback';
import { showToast } from '../../utils/toast';
import PredictionResult from '../../components/medical/PredictionResult';
import type { PredictionData } from '../../components/medical/PredictionResult';
import { 
  BrainCircuit, 
  RefreshCw, 
  Send, 
  ArrowLeft, 
  ShieldAlert, 
  Droplets, 
  ChevronDown 
} from 'lucide-react';

const DiabetesPredictor: React.FC = () => {
  const navigate = useNavigate();
  const { logPrediction } = useHealthDispatch();

  const [formData, setFormData] = useState<Partial<DiabetesInputs>>({
    age: 45,
    gender: 'Male',
    polyuria: false,
    polydipsia: false,
    suddenWeightLoss: false,
    weakness: false,
    polyphagia: false,
    visualBlurring: false,
    itching: false,
    irritability: false,
    delayedHealing: false,
    partialParesis: false,
    muscleStiffness: false,
    alopecia: false,
    obesity: false,
    hba1c: 5.7,
    fastingBloodSugar: 100
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (name: keyof DiabetesInputs, val: any) => {
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

    const validationResult = diabetesSchema.safeParse(formData);
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
          predictorId: 'diabetes',
          inputs: validationResult.data
        }
      });

      if (error) throw error;
      setResult(data);
      logPrediction('diabetes', validationResult.data, data);
    } catch (err: any) {
      console.error(err);
      const fallbackResult = getLocalPredictionFallback('diabetes', validationResult.data);
      setResult(fallbackResult);
      logPrediction('diabetes', validationResult.data, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-cyan-500/3 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-purple-500/3 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] bg-pink-500/3 dark:bg-pink-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse bg-cyan-500/15 shrink-0">
            <Droplets className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-primary to-teal-500 dark:from-cyan-400 dark:via-primary dark:to-teal-400">Diabetes Risk Predictor</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evaluate risk using clinical checks, HbA1c, and metabolic symptoms.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Panel (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 scan-active-panel rounded-2xl p-6 shadow-xl relative space-y-5 animate-slide-up" style={{ '--scan-rgb': '6, 182, 212' } as React.CSSProperties}>
          
          <h3 
            className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white"
            style={{ borderLeft: '3px solid #06b6d4' }}
          >
            <BrainCircuit className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Enter Diabetes Lab & Vitals Metrics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2">
            
            {/* Age */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="diabAge">Age</label>
              <input
                id="diabAge"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 45"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                value={formData.age ?? ''}
                onChange={e => handleFieldChange('age', Number(e.target.value))}
              />
              {formErrors.age && <p className="text-[10px] text-rose-500 font-bold">{formErrors.age}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="diabGender">Gender</label>
              <div className="relative">
                <select
                  id="diabGender"
                  className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none pr-10"
                  value={formData.gender || 'Male'}
                  onChange={e => handleFieldChange('gender', e.target.value as any)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
            </div>

            {/* HbA1c */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="diabHba1c">HbA1c (%)</label>
              <input
                id="diabHba1c"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 5.7"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                value={formData.hba1c ?? ''}
                onChange={e => handleFieldChange('hba1c', Number(e.target.value))}
              />
              {formErrors.hba1c && <p className="text-[10px] text-rose-500 font-bold">{formErrors.hba1c}</p>}
            </div>

            {/* Fasting Blood Sugar */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="diabFbs">Fasting Blood Sugar (mg/dL)</label>
              <input
                id="diabFbs"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 100"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                value={formData.fastingBloodSugar ?? ''}
                onChange={e => handleFieldChange('fastingBloodSugar', Number(e.target.value))}
              />
              {formErrors.fastingBloodSugar && <p className="text-[10px] text-rose-500 font-bold">{formErrors.fastingBloodSugar}</p>}
            </div>

            {/* Symptom Checkboxes */}
            <div className="sm:col-span-2 border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Select Symptomatic Indicators:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
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
                  { key: 'obesity', label: 'Obesity / High body weight' }
                ].map((item, idx) => (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => handleFieldChange(item.key as any, !formData[item.key as keyof DiabetesInputs])}
                    style={{ 
                      borderColor: formData[item.key as keyof DiabetesInputs] ? 'rgba(6, 182, 212, 0.5)' : '',
                      backgroundColor: formData[item.key as keyof DiabetesInputs] ? 'rgba(6, 182, 212, 0.08)' : '',
                      animationDelay: `${200 + idx * 50}ms`
                    }}
                    className="flex items-center justify-between p-3.5 border border-slate-250 dark:border-slate-800 rounded-xl hover:border-cyan-500/30 transition-all text-left duration-250 cursor-pointer h-12 animate-slide-up"
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                      {item.label}
                    </span>
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center border transition-all"
                      style={{ 
                        borderColor: formData[item.key as keyof DiabetesInputs] ? '#06b6d4' : 'rgba(128,128,128,0.4)',
                        backgroundColor: formData[item.key as keyof DiabetesInputs] ? '#06b6d4' : 'transparent'
                      }}
                    >
                      {formData[item.key as keyof DiabetesInputs] && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:brightness-110 shadow-cyan-500/10 hover:shadow-cyan-500/25 transform hover:scale-[1.01] animate-pulse-slow disabled:opacity-60 disabled:pointer-events-none touch-target"
              style={{ backgroundImage: 'linear-gradient(to right, #06b6d4, #0f766e)' }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing metabolic metrics...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Run AI Risk Assessment</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Output Panel (5 cols) */}
        <div className="lg:col-span-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {errorMsg && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-rose-500 text-xs rounded-lg mb-4 flex items-start gap-2">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {result ? (
            <PredictionResult predictorId="diabetes" data={result} />
          ) : (
            <div className="scan-active-panel border-dashed rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold py-20 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-4 shadow-xl" style={{ '--scan-rgb': '6, 182, 212' } as React.CSSProperties}>
              {/* Decorative animated rings */}
              <div 
                className="absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin-slow opacity-15"
                style={{ borderColor: '#06b6d4', animationDuration: '15s' }}
              ></div>
              <div 
                className="absolute w-28 h-28 rounded-full border border-dashed animate-spin opacity-10"
                style={{ borderColor: '#06b6d4', animationDuration: '30s', animationDirection: 'reverse' }}
              ></div>
              
              <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse bg-cyan-500/15 relative z-10">
                <BrainCircuit className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
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

export default DiabetesPredictor;
