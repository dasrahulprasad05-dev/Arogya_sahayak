import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ecgSchema } from '../../lib/validators/ecgSchema';
import type { EcgInputs } from '../../lib/validators/ecgSchema';
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
  Activity 
} from 'lucide-react';

const ECGAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { logPrediction } = useHealthDispatch();

  const [formData, setFormData] = useState<Partial<EcgInputs>>({
    heartRate: 72,
    prInterval: 160,
    qrsDuration: 90,
    qtInterval: 400,
    qtcInterval: 420,
    symptoms: []
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (name: keyof EcgInputs, val: any) => {
    setFormData(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const errors = { ...prev };
        delete errors[name];
        return errors;
      });
    }
  };

  const handleSymptomToggle = (symp: string) => {
    const activeSymp = formData.symptoms || [];
    const nextSymp = activeSymp.includes(symp)
      ? activeSymp.filter(s => s !== symp)
      : [...activeSymp, symp];
    handleFieldChange('symptoms', nextSymp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setFormErrors({});

    const validationResult = ecgSchema.safeParse(formData);
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
          predictorId: 'ecg',
          inputs: validationResult.data
        }
      });

      if (error) throw error;
      setResult(data);
      logPrediction('ecg', validationResult.data, data);
    } catch (err: any) {
      console.error(err);
      const fallbackResult = getLocalPredictionFallback('ecg', validationResult.data);
      setResult(fallbackResult);
      logPrediction('ecg', validationResult.data, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-violet-500/3 dark:bg-violet-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse bg-violet-500/15 shrink-0">
            <Activity className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-primary to-purple-500 dark:from-violet-400 dark:via-primary dark:to-purple-400">ECG Analysis</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evaluate ECG wave intervals, heart rates, and palpitations triggers.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Panel (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white/40 dark:bg-card/40 border border-violet-500/15 rounded-2xl p-6 shadow-xl backdrop-blur-md relative space-y-5 animate-slide-up">
          
          <h3 
            className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white"
            style={{ borderLeft: '3px solid #8b5cf6' }}
          >
            <BrainCircuit className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 animate-pulse" />
            <span>Enter ECG Analysis & Rhythm Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2">
            
            {/* Heart Rate */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="ecgHr">Heart Rate (bpm)</label>
              <input
                id="ecgHr"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 72"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                value={formData.heartRate ?? ''}
                onChange={e => handleFieldChange('heartRate', Number(e.target.value))}
              />
              {formErrors.heartRate && <p className="text-[10px] text-rose-500 font-bold">{formErrors.heartRate}</p>}
            </div>

            {/* PR Interval */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="prInt">PR Interval (ms)</label>
              <input
                id="prInt"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 160"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                value={formData.prInterval ?? ''}
                onChange={e => handleFieldChange('prInterval', Number(e.target.value))}
              />
              {formErrors.prInterval && <p className="text-[10px] text-rose-500 font-bold">{formErrors.prInterval}</p>}
            </div>

            {/* QRS Duration */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="qrsDur">QRS Duration (ms)</label>
              <input
                id="qrsDur"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 90"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                value={formData.qrsDuration ?? ''}
                onChange={e => handleFieldChange('qrsDuration', Number(e.target.value))}
              />
              {formErrors.qrsDuration && <p className="text-[10px] text-rose-500 font-bold">{formErrors.qrsDuration}</p>}
            </div>

            {/* QT Interval */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="qtInt">QT Interval (ms)</label>
              <input
                id="qtInt"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 400"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                value={formData.qtInterval ?? ''}
                onChange={e => handleFieldChange('qtInterval', Number(e.target.value))}
              />
              {formErrors.qtInterval && <p className="text-[10px] text-rose-500 font-bold">{formErrors.qtInterval}</p>}
            </div>

            {/* QTc Interval */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="qtcInt">QTc Interval (ms)</label>
              <input
                id="qtcInt"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 420"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                value={formData.qtcInterval ?? ''}
                onChange={e => handleFieldChange('qtcInterval', Number(e.target.value))}
              />
              {formErrors.qtcInterval && <p className="text-[10px] text-rose-500 font-bold">{formErrors.qtcInterval}</p>}
            </div>

            {/* Symptom selection */}
            <div className="sm:col-span-2 space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-heading">Select Accompanying Symptoms:</span>
              <div className="grid grid-cols-2 gap-3">
                {['Palpitations', 'Dizziness', 'Chest Tightness', 'Shortness of Breath', 'None of these'].map((symp, idx) => {
                  const checked = (formData.symptoms || []).includes(symp);
                  return (
                    <button
                      key={symp}
                      type="button"
                      onClick={() => handleSymptomToggle(symp)}
                      style={{ 
                        borderColor: checked ? 'rgba(139, 92, 246, 0.5)' : '',
                        backgroundColor: checked ? 'rgba(139, 92, 246, 0.08)' : '',
                        animationDelay: `${250 + idx * 50}ms`
                      }}
                      className="flex items-center justify-between p-3.5 border border-slate-250 dark:border-slate-800 rounded-xl hover:border-violet-500/30 transition-all text-left duration-250 cursor-pointer h-12 animate-slide-up"
                    >
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                        {symp}
                      </span>
                      <div 
                        className="w-5 h-5 rounded flex items-center justify-center border transition-all"
                        style={{ 
                          borderColor: checked ? '#8b5cf6' : 'rgba(128,128,128,0.4)',
                          backgroundColor: checked ? '#8b5cf6' : 'transparent'
                        }}
                      >
                        {checked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {formErrors.symptoms && <p className="text-[10px] text-rose-500 font-bold">{formErrors.symptoms}</p>}
            </div>

          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:brightness-110 shadow-violet-500/10 hover:shadow-violet-500/25 transform hover:scale-[1.01] animate-pulse-slow disabled:opacity-60 disabled:pointer-events-none touch-target"
              style={{ backgroundImage: 'linear-gradient(to right, #8b5cf6, #6d28d9)' }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing ECG Waves...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Analyze ECG Profile</span>
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
            <PredictionResult predictorId="ecg" data={result} />
          ) : (
            <div className="bg-card/45 border border-violet-500/15 rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold py-20 backdrop-blur-md relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-4 shadow-xl">
              {/* Decorative animated rings */}
              <div 
                className="absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin-slow opacity-15"
                style={{ borderColor: '#8b5cf6', animationDuration: '15s' }}
              ></div>
              <div 
                className="absolute w-28 h-28 rounded-full border border-dashed animate-spin opacity-10"
                style={{ borderColor: '#8b5cf6', animationDuration: '30s', animationDirection: 'reverse' }}
              ></div>
              
              <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse bg-violet-500/15 relative z-10">
                <Activity className="w-7 h-7 text-violet-600 dark:text-violet-400" />
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

export default ECGAnalysis;
