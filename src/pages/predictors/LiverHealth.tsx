import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { liverSchema } from '../../lib/validators/liverSchema';
import type { LiverInputs } from '../../lib/validators/liverSchema';
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
  FlaskConical,
  ChevronDown
} from 'lucide-react';

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
      setResult(data);
      logPrediction('liver', validationResult.data, data);
    } catch (err: any) {
      console.error(err);
      const fallbackResult = getLocalPredictionFallback('liver', validationResult.data);
      setResult(fallbackResult);
      logPrediction('liver', validationResult.data, fallbackResult);
      showToast("Edge function unavailable. Using offline local risk assessment.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-emerald-500/3 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-teal-500/3 dark:bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] bg-green-500/3 dark:bg-green-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse bg-emerald-500/15 shrink-0">
            <FlaskConical className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-primary to-green-500 dark:from-emerald-400 dark:via-primary dark:to-green-400">Liver Function Screener</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evaluate hepatic wellness indicators using total bilirubin, SGOT, SGPT, and protein metrics.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Panel (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 scan-active-panel rounded-2xl p-6 shadow-xl relative space-y-5 animate-slide-up" style={{ '--scan-rgb': '16, 185, 129' } as React.CSSProperties}>
          
          <h3 
            className="relative pl-5 py-3 pr-3 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex items-center gap-3 font-heading font-bold text-sm text-slate-800 dark:text-white"
            style={{ borderLeft: '3px solid #10b981' }}
          >
            <BrainCircuit className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Enter Hepatic Lab Profiles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2">
            
            {/* Age */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="liverAge">Age</label>
              <input
                id="liverAge"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 45"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={formData.age ?? ''}
                onChange={e => handleFieldChange('age', Number(e.target.value))}
              />
              {formErrors.age && <p className="text-[10px] text-rose-500 font-bold">{formErrors.age}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="liverGender">Gender</label>
              <div className="relative">
                <select
                  id="liverGender"
                  className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none pr-10"
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
            </div>

            {/* Total Bilirubin */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="totBil">Total Bilirubin (mg/dL)</label>
              <input
                id="totBil"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 0.8"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={formData.totalBilirubin ?? ''}
                onChange={e => handleFieldChange('totalBilirubin', Number(e.target.value))}
              />
              {formErrors.totalBilirubin && <p className="text-[10px] text-rose-500 font-bold">{formErrors.totalBilirubin}</p>}
            </div>

            {/* Direct Bilirubin */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="dirBil">Direct Bilirubin (mg/dL)</label>
              <input
                id="dirBil"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 0.2"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={formData.directBilirubin ?? ''}
                onChange={e => handleFieldChange('directBilirubin', Number(e.target.value))}
              />
              {formErrors.directBilirubin && <p className="text-[10px] text-rose-500 font-bold">{formErrors.directBilirubin}</p>}
            </div>

            {/* Alkaline Phosphotase */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="alkPhos">Alkaline Phosphatase (IU/L)</label>
              <input
                id="alkPhos"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 120"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={formData.alkalinePhosphotase ?? ''}
                onChange={e => handleFieldChange('alkalinePhosphotase', Number(e.target.value))}
              />
              {formErrors.alkalinePhosphotase && <p className="text-[10px] text-rose-500 font-bold">{formErrors.alkalinePhosphotase}</p>}
            </div>

            {/* SGOT */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '250ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="sgot">SGOT / AST (IU/L)</label>
              <input
                id="sgot"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 35"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={formData.sgotAlat ?? ''}
                onChange={e => handleFieldChange('sgotAlat', Number(e.target.value))}
              />
              {formErrors.sgotAlat && <p className="text-[10px] text-rose-500 font-bold">{formErrors.sgotAlat}</p>}
            </div>

            {/* SGPT */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="sgpt">SGPT / ALT (IU/L)</label>
              <input
                id="sgpt"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 40"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={formData.sgptAsat ?? ''}
                onChange={e => handleFieldChange('sgptAsat', Number(e.target.value))}
              />
              {formErrors.sgptAsat && <p className="text-[10px] text-rose-500 font-bold">{formErrors.sgptAsat}</p>}
            </div>

            {/* Total Proteins */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '350ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="totProt">Total Proteins (g/dL)</label>
              <input
                id="totProt"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 7.0"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={formData.totalProteins ?? ''}
                onChange={e => handleFieldChange('totalProteins', Number(e.target.value))}
              />
              {formErrors.totalProteins && <p className="text-[10px] text-rose-500 font-bold">{formErrors.totalProteins}</p>}
            </div>

            {/* Albumin */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="alb">Albumin (g/dL)</label>
              <input
                id="alb"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 4.0"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={formData.albumin ?? ''}
                onChange={e => handleFieldChange('albumin', Number(e.target.value))}
              />
              {formErrors.albumin && <p className="text-[10px] text-rose-500 font-bold">{formErrors.albumin}</p>}
            </div>

            {/* A/G Ratio */}
            <div className="space-y-1 animate-slide-up" style={{ animationDelay: '450ms' }}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="agRat">A/G Ratio</label>
              <input
                id="agRat"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 1.2"
                className="w-full h-12 bg-slate-900/5 dark:bg-white/5 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={formData.agRatio ?? ''}
                onChange={e => handleFieldChange('agRatio', Number(e.target.value))}
              />
              {formErrors.agRatio && <p className="text-[10px] text-rose-500 font-bold">{formErrors.agRatio}</p>}
            </div>

          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:brightness-110 shadow-emerald-500/10 hover:shadow-emerald-500/25 transform hover:scale-[1.01] animate-pulse-slow disabled:opacity-60 disabled:pointer-events-none touch-target"
              style={{ backgroundImage: 'linear-gradient(to right, #10b981, #059669)' }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing liver function...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Run Liver Function Check</span>
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
            <PredictionResult predictorId="liver" data={result} />
          ) : (
            <div className="scan-active-panel border-dashed rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold py-20 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-4 shadow-xl" style={{ '--scan-rgb': '16, 185, 129' } as React.CSSProperties}>
              {/* Decorative animated rings */}
              <div 
                className="absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin-slow opacity-15"
                style={{ borderColor: '#10b981', animationDuration: '15s' }}
              ></div>
              <div 
                className="absolute w-28 h-28 rounded-full border border-dashed animate-spin opacity-10"
                style={{ borderColor: '#10b981', animationDuration: '30s', animationDirection: 'reverse' }}
              ></div>
              
              <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse bg-emerald-500/15 relative z-10">
                <BrainCircuit className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
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

export default LiverHealth;

