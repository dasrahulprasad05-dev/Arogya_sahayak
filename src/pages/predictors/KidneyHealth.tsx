import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kidneySchema } from '../../lib/validators/kidneySchema';
import type { KidneyInputs } from '../../lib/validators/kidneySchema';
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
  Filter,
  ChevronDown
} from 'lucide-react';

const KidneyHealth: React.FC = () => {
  const navigate = useNavigate();
  const { logPrediction } = useHealthDispatch();

  const [formData, setFormData] = useState<Partial<KidneyInputs>>({
    age: 45,
    bloodPressure: 80,
    specificGravity: 1.020,
    albumin: 0,
    sugar: 0,
    redBloodCells: 'Normal',
    pusCells: 'Normal',
    bloodUrea: 36,
    serumCreatinine: 0.8,
    sodium: 138,
    potassium: 4.1,
    hemoglobin: 15.0
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (name: keyof KidneyInputs, val: any) => {
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

    const validationResult = kidneySchema.safeParse(formData);
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
          predictorId: 'kidney',
          inputs: validationResult.data
        }
      });

      if (error) throw error;
      setResult(data);
      logPrediction('kidney', validationResult.data, data);
    } catch (err: any) {
      console.error(err);
      const fallbackResult = getLocalPredictionFallback('kidney', validationResult.data);
      setResult(fallbackResult);
      logPrediction('kidney', validationResult.data, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-blue-500/3 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-purple-500/3 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] bg-sky-500/3 dark:bg-sky-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse bg-blue-500/15 shrink-0">
            <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-sky-500 dark:from-blue-400 dark:via-primary dark:to-sky-400">Kidney Health Assessor</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evaluate renal health indicators using serum urea, creatinine, and urine parameters.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Panel (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white/40 dark:bg-card/40 border border-blue-500/15 rounded-2xl p-6 shadow-xl backdrop-blur-md relative space-y-5 animate-slide-up">
          
          <h3 
            className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white"
            style={{ borderLeft: '3px solid #3b82f6' }}
          >
            <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Enter Renal Lab Metrics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2">
            
            {/* Age */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneyAge">Age</label>
              <input
                id="kidneyAge"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 45"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.age ?? ''}
                onChange={e => handleFieldChange('age', Number(e.target.value))}
              />
              {formErrors.age && <p className="text-[10px] text-rose-500 font-bold">{formErrors.age}</p>}
            </div>

            {/* Blood Pressure */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneyBp">Blood Pressure (mmHg)</label>
              <input
                id="kidneyBp"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 80"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.bloodPressure ?? ''}
                onChange={e => handleFieldChange('bloodPressure', Number(e.target.value))}
              />
              {formErrors.bloodPressure && <p className="text-[10px] text-rose-500 font-bold">{formErrors.bloodPressure}</p>}
            </div>

            {/* Specific Gravity */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneySg">Urine Specific Gravity</label>
              <input
                id="kidneySg"
                type="number"
                step="0.005"
                inputMode="decimal"
                placeholder="e.g. 1.020"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.specificGravity ?? ''}
                onChange={e => handleFieldChange('specificGravity', Number(e.target.value))}
              />
              {formErrors.specificGravity && <p className="text-[10px] text-rose-500 font-bold">{formErrors.specificGravity}</p>}
            </div>

            {/* Albumin */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneyAlb">Urine Albumin (0 to 5)</label>
              <input
                id="kidneyAlb"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 0"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.albumin ?? ''}
                onChange={e => handleFieldChange('albumin', Number(e.target.value))}
              />
              {formErrors.albumin && <p className="text-[10px] text-rose-500 font-bold">{formErrors.albumin}</p>}
            </div>

            {/* Sugar */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneySug">Urine Sugar (0 to 5)</label>
              <input
                id="kidneySug"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 0"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.sugar ?? ''}
                onChange={e => handleFieldChange('sugar', Number(e.target.value))}
              />
              {formErrors.sugar && <p className="text-[10px] text-rose-500 font-bold">{formErrors.sugar}</p>}
            </div>

            {/* Blood Urea */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '250ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneyUrea">Blood Urea (mg/dL)</label>
              <input
                id="kidneyUrea"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 36"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.bloodUrea ?? ''}
                onChange={e => handleFieldChange('bloodUrea', Number(e.target.value))}
              />
              {formErrors.bloodUrea && <p className="text-[10px] text-rose-500 font-bold">{formErrors.bloodUrea}</p>}
            </div>

            {/* Serum Creatinine */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneyCreat">Serum Creatinine (mg/dL)</label>
              <input
                id="kidneyCreat"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 0.8"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.serumCreatinine ?? ''}
                onChange={e => handleFieldChange('serumCreatinine', Number(e.target.value))}
              />
              {formErrors.serumCreatinine && <p className="text-[10px] text-rose-500 font-bold">{formErrors.serumCreatinine}</p>}
            </div>

            {/* Sodium */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '350ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneySod">Serum Sodium (mEq/L)</label>
              <input
                id="kidneySod"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 138"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.sodium ?? ''}
                onChange={e => handleFieldChange('sodium', Number(e.target.value))}
              />
              {formErrors.sodium && <p className="text-[10px] text-rose-500 font-bold">{formErrors.sodium}</p>}
            </div>

            {/* Potassium */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneyPot">Serum Potassium (mEq/L)</label>
              <input
                id="kidneyPot"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 4.1"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.potassium ?? ''}
                onChange={e => handleFieldChange('potassium', Number(e.target.value))}
              />
              {formErrors.potassium && <p className="text-[10px] text-rose-500 font-bold">{formErrors.potassium}</p>}
            </div>

            {/* Hemoglobin */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '450ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneyHb">Hemoglobin (g/dL)</label>
              <input
                id="kidneyHb"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 15.0"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.hemoglobin ?? ''}
                onChange={e => handleFieldChange('hemoglobin', Number(e.target.value))}
              />
              {formErrors.hemoglobin && <p className="text-[10px] text-rose-500 font-bold">{formErrors.hemoglobin}</p>}
            </div>

            {/* Red Blood Cells */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '500ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneyRbc">Urine Red Blood Cells</label>
              <div className="relative">
                <select
                  id="kidneyRbc"
                  className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none pr-10"
                  value={formData.redBloodCells || 'Normal'}
                  onChange={e => handleFieldChange('redBloodCells', e.target.value as any)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Pus Cells */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '550ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="kidneyPus">Urine Pus Cells</label>
              <div className="relative">
                <select
                  id="kidneyPus"
                  className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none pr-10"
                  value={formData.pusCells || 'Normal'}
                  onChange={e => handleFieldChange('pusCells', e.target.value as any)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:brightness-110 shadow-blue-500/10 hover:shadow-blue-500/25 transform hover:scale-[1.01] animate-pulse-slow disabled:opacity-60 disabled:pointer-events-none touch-target"
              style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #0284c7)' }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing renal health...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Run Renal Health Check</span>
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
            <PredictionResult predictorId="kidney" data={result} />
          ) : (
            <div className="bg-card/45 border border-blue-500/15 rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold py-20 backdrop-blur-md relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-4 shadow-xl">
              {/* Decorative animated rings */}
              <div 
                className="absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin-slow opacity-15"
                style={{ borderColor: '#3b82f6', animationDuration: '15s' }}
              ></div>
              <div 
                className="absolute w-28 h-28 rounded-full border border-dashed animate-spin opacity-10"
                style={{ borderColor: '#3b82f6', animationDuration: '30s', animationDirection: 'reverse' }}
              ></div>
              
              <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse bg-blue-500/15 relative z-10">
                <BrainCircuit className="w-7 h-7 text-blue-600 dark:text-blue-400" />
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

export default KidneyHealth;

