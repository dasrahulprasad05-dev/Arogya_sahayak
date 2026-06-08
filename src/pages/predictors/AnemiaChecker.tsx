import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { anemiaSchema } from '../../lib/validators/anemiaSchema';
import type { AnemiaInputs } from '../../lib/validators/anemiaSchema';
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
  Syringe,
  ChevronDown
} from 'lucide-react';

const AnemiaChecker: React.FC = () => {
  const navigate = useNavigate();
  const { logPrediction } = useHealthDispatch();

  const [formData, setFormData] = useState<Partial<AnemiaInputs>>({
    gender: 'Female',
    hbLevel: 11.5,
    fatigue: false,
    paleSkin: false,
    dizziness: false,
    coldHandsFeet: false,
    shortnessOfBreath: false,
    tongueSwelling: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (name: keyof AnemiaInputs, val: any) => {
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

    const validationResult = anemiaSchema.safeParse(formData);
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
          predictorId: 'anemia',
          inputs: validationResult.data
        }
      });

      if (error) throw error;
      setResult(data);
      logPrediction('anemia', validationResult.data, data);
    } catch (err: any) {
      console.error(err);
      const fallbackResult = getLocalPredictionFallback('anemia', validationResult.data);
      setResult(fallbackResult);
      logPrediction('anemia', validationResult.data, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-rose-500/3 dark:bg-rose-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-pink-500/3 dark:bg-pink-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] bg-purple-500/3 dark:bg-purple-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse bg-rose-500/15 shrink-0">
            <Syringe className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-primary to-pink-500 dark:from-rose-400 dark:via-primary dark:to-pink-400">Anemia Checker</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evaluate hemoglobin concentrations and clinical signs of anemia.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Panel (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white/40 dark:bg-card/40 border border-rose-500/15 rounded-2xl p-6 shadow-xl backdrop-blur-md relative space-y-5 animate-slide-up">
          
          <h3 
            className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white"
            style={{ borderLeft: '3px solid #f43f5e' }}
          >
            <BrainCircuit className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Enter Anemia Indicators</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2">
            
            {/* Gender */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="anemiaGender">Gender</label>
              <div className="relative">
                <select
                  id="anemiaGender"
                  className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none pr-10"
                  value={formData.gender || 'Female'}
                  onChange={e => handleFieldChange('gender', e.target.value as any)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>
              </div>
            </div>

            {/* Hb Level */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="hbLevel">Hemoglobin Level (g/dL)</label>
              <input
                id="hbLevel"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 11.5"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                value={formData.hbLevel ?? ''}
                onChange={e => handleFieldChange('hbLevel', Number(e.target.value))}
              />
              {formErrors.hbLevel && <p className="text-[10px] text-rose-500 font-bold">{formErrors.hbLevel}</p>}
            </div>

            {/* Checkboxes */}
            <div className="sm:col-span-2 border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Select Symptomatic Indicators:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'fatigue', label: 'Fatigue / Severe Weakness' },
                  { key: 'paleSkin', label: 'Pale or Yellowish Skin' },
                  { key: 'dizziness', label: 'Dizziness or Lightheadedness' },
                  { key: 'coldHandsFeet', label: 'Cold Hands & Feet' },
                  { key: 'shortnessOfBreath', label: 'Shortness of Breath' },
                  { key: 'tongueSwelling', label: 'Tongue soreness or swelling' }
                ].map((item, idx) => (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => handleFieldChange(item.key as any, !formData[item.key as keyof AnemiaInputs])}
                    style={{ 
                      borderColor: formData[item.key as keyof AnemiaInputs] ? 'rgba(244, 63, 94, 0.5)' : '',
                      backgroundColor: formData[item.key as keyof AnemiaInputs] ? 'rgba(244, 63, 94, 0.08)' : '',
                      animationDelay: `${100 + idx * 50}ms`
                    }}
                    className="flex items-center justify-between p-3.5 border border-slate-250 dark:border-slate-800 rounded-xl hover:border-rose-500/30 transition-all text-left duration-250 cursor-pointer h-12 animate-slide-up"
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                      {item.label}
                    </span>
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center border transition-all"
                      style={{ 
                        borderColor: formData[item.key as keyof AnemiaInputs] ? '#f43f5e' : 'rgba(128,128,128,0.4)',
                        backgroundColor: formData[item.key as keyof AnemiaInputs] ? '#f43f5e' : 'transparent'
                      }}
                    >
                      {formData[item.key as keyof AnemiaInputs] && (
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
              className="w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:brightness-110 shadow-rose-500/10 hover:shadow-rose-500/25 transform hover:scale-[1.01] animate-pulse-slow disabled:opacity-60 disabled:pointer-events-none touch-target"
              style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #db2777)' }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing anemia markers...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Run Anemia Check</span>
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
            <PredictionResult predictorId="anemia" data={result} />
          ) : (
            <div className="bg-card/45 border border-rose-500/15 rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold py-20 backdrop-blur-md relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-4 shadow-xl">
              {/* Decorative animated rings */}
              <div 
                className="absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin-slow opacity-15"
                style={{ borderColor: '#f43f5e', animationDuration: '15s' }}
              ></div>
              <div 
                className="absolute w-28 h-28 rounded-full border border-dashed animate-spin opacity-10"
                style={{ borderColor: '#f43f5e', animationDuration: '30s', animationDirection: 'reverse' }}
              ></div>
              
              <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse bg-rose-500/15 relative z-10">
                <BrainCircuit className="w-7 h-7 text-rose-600 dark:text-rose-400" />
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

export default AnemiaChecker;

