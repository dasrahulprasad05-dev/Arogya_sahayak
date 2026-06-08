import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { thyroidSchema } from '../../lib/validators/thyroidSchema';
import type { ThyroidInputs } from '../../lib/validators/thyroidSchema';
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
  Zap,
  ChevronDown
} from 'lucide-react';

const ThyroidAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { logPrediction } = useHealthDispatch();

  const [formData, setFormData] = useState<Partial<ThyroidInputs>>({
    age: 35,
    gender: 'Female',
    tsh: 2.5,
    freeT3: 3.0,
    freeT4: 1.2,
    goiter: false,
    thyroidSurgery: false,
    iodineDeficiency: false,
    weightChange: 'None',
    temperatureSensitivity: 'None'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (name: keyof ThyroidInputs, val: any) => {
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

    const validationResult = thyroidSchema.safeParse(formData);
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
          predictorId: 'thyroid',
          inputs: validationResult.data
        }
      });

      if (error) throw error;
      setResult(data);
      logPrediction('thyroid', validationResult.data, data);
    } catch (err: any) {
      console.error(err);
      const fallbackResult = getLocalPredictionFallback('thyroid', validationResult.data);
      setResult(fallbackResult);
      logPrediction('thyroid', validationResult.data, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-orange-500/3 dark:bg-orange-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-amber-500/3 dark:bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse bg-orange-500/15 shrink-0">
            <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-primary to-amber-500 dark:from-orange-400 dark:via-primary dark:to-amber-400">Thyroid Assessor</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evaluate thyroid parameters using serum TSH, free T3, and free T4 metrics.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Panel (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white/40 dark:bg-card/40 border border-orange-500/15 rounded-2xl p-6 shadow-xl backdrop-blur-md relative space-y-5 animate-slide-up">
          
          <h3 
            className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white"
            style={{ borderLeft: '3px solid #f97316' }}
          >
            <BrainCircuit className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
            <span>Enter Thyroid Lab Profiles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2">
            
            {/* Age */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="thAge">Age</label>
              <input
                id="thAge"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 35"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                value={formData.age ?? ''}
                onChange={e => handleFieldChange('age', Number(e.target.value))}
              />
              {formErrors.age && <p className="text-[10px] text-rose-500 font-bold">{formErrors.age}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="thGender">Gender</label>
              <div className="relative">
                <select
                  id="thGender"
                  className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none pr-10"
                  value={formData.gender || 'Female'}
                  onChange={e => handleFieldChange('gender', e.target.value as any)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            {/* TSH */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="tsh">TSH (uIU/mL)</label>
              <input
                id="tsh"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 2.5"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                value={formData.tsh ?? ''}
                onChange={e => handleFieldChange('tsh', Number(e.target.value))}
              />
              {formErrors.tsh && <p className="text-[10px] text-rose-500 font-bold">{formErrors.tsh}</p>}
            </div>

            {/* Free T3 */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="ft3">Free T3 (pg/mL)</label>
              <input
                id="ft3"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 3.0"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                value={formData.freeT3 ?? ''}
                onChange={e => handleFieldChange('freeT3', Number(e.target.value))}
              />
              {formErrors.freeT3 && <p className="text-[10px] text-rose-500 font-bold">{formErrors.freeT3}</p>}
            </div>

            {/* Free T4 */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="ft4">Free T4 (ng/dL)</label>
              <input
                id="ft4"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 1.2"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                value={formData.freeT4 ?? ''}
                onChange={e => handleFieldChange('freeT4', Number(e.target.value))}
              />
              {formErrors.freeT4 && <p className="text-[10px] text-rose-500 font-bold">{formErrors.freeT4}</p>}
            </div>

            {/* Weight Change */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '250ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="wtChange">Weight Change</label>
              <div className="relative">
                <select
                  id="wtChange"
                  className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none pr-10"
                  value={formData.weightChange || 'None'}
                  onChange={e => handleFieldChange('weightChange', e.target.value as any)}
                >
                  <option value="None">No changes</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Weight Gain">Weight Gain</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            {/* Temperature Sensitivity */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="tempSens">Temperature Sensitivity</label>
              <div className="relative">
                <select
                  id="tempSens"
                  className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none pr-10"
                  value={formData.temperatureSensitivity || 'None'}
                  onChange={e => handleFieldChange('temperatureSensitivity', e.target.value as any)}
                >
                  <option value="None">Normal sensitivity</option>
                  <option value="Cold Intolerance">Cold Intolerance</option>
                  <option value="Heat Intolerance">Heat Intolerance</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="sm:col-span-2 border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Select Symptomatic Indicators:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'goiter', label: 'Goiter / Enlarged Thyroid Gland' },
                  { key: 'thyroidSurgery', label: 'History of Thyroid Surgery' },
                  { key: 'iodineDeficiency', label: 'History of Iodine Deficiency' }
                ].map((item, idx) => (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => handleFieldChange(item.key as any, !formData[item.key as keyof ThyroidInputs])}
                    style={{ 
                      borderColor: formData[item.key as keyof ThyroidInputs] ? 'rgba(249, 115, 22, 0.5)' : '',
                      backgroundColor: formData[item.key as keyof ThyroidInputs] ? 'rgba(249, 115, 22, 0.08)' : '',
                      animationDelay: `${350 + idx * 50}ms`
                    }}
                    className="flex items-center justify-between p-3.5 border border-slate-250 dark:border-slate-800 rounded-xl hover:border-orange-500/30 transition-all text-left duration-250 cursor-pointer h-12 animate-slide-up"
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                      {item.label}
                    </span>
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center border transition-all"
                      style={{ 
                        borderColor: formData[item.key as keyof ThyroidInputs] ? '#f97316' : 'rgba(128,128,128,0.4)',
                        backgroundColor: formData[item.key as keyof ThyroidInputs] ? '#f97316' : 'transparent'
                      }}
                    >
                      {formData[item.key as keyof ThyroidInputs] && (
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
              className="w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:brightness-110 shadow-orange-500/10 hover:shadow-orange-500/25 transform hover:scale-[1.01] animate-pulse-slow disabled:opacity-60 disabled:pointer-events-none touch-target"
              style={{ backgroundImage: 'linear-gradient(to right, #f97316, #d97706)' }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing thyroid function...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Run Thyroid Assessment</span>
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
            <PredictionResult predictorId="thyroid" data={result} />
          ) : (
            <div className="bg-card/45 border border-orange-500/15 rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold py-20 backdrop-blur-md relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-4 shadow-xl">
              {/* Decorative animated rings */}
              <div 
                className="absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin-slow opacity-15"
                style={{ borderColor: '#f97316', animationDuration: '15s' }}
              ></div>
              <div 
                className="absolute w-28 h-28 rounded-full border border-dashed animate-spin opacity-10"
                style={{ borderColor: '#f97316', animationDuration: '30s', animationDirection: 'reverse' }}
              ></div>
              
              <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse bg-orange-500/15 relative z-10">
                <BrainCircuit className="w-7 h-7 text-orange-600 dark:text-orange-400" />
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

export default ThyroidAssessment;

