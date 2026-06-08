import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Activity, CheckCircle, Info } from 'lucide-react';
import { showToast } from '../../utils/toast';

const MorningCheckIn: React.FC = () => {
  const { t, formatDate, formatNumber } = useLanguage();
  const { logs } = useHealthRead();
  const { logVitals } = useHealthDispatch();

  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [heartRate, setHeartRate] = useState(72);
  const [spO2, setSpO2] = useState(98);
  const [weight, setWeight] = useState(70);

  const vitalsLogs = logs.filter(log => log.type === 'vitals').slice(0, 5);

  const getSystolicStatus = (sys: number) => {
    if (sys < 90) return { label: 'Low', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    if (sys <= 120) return { label: 'Normal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    if (sys <= 139) return { label: 'Elevated', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
    return { label: 'High', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
  };

  const getDiastolicStatus = (dia: number) => {
    if (dia < 60) return { label: 'Low', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    if (dia <= 80) return { label: 'Normal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    if (dia <= 89) return { label: 'Elevated', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
    return { label: 'High', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
  };

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { label: 'Low', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    if (hr <= 100) return { label: 'Normal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    return { label: 'High', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
  };

  const getSpO2Status = (ox: number) => {
    if (ox >= 95) return { label: 'Normal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    return { label: 'Low', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
  };

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    logVitals({ systolic, diastolic, heartRate, spO2, weight });
    showToast(
      navigator.onLine 
        ? `Daily vitals saved successfully!`
        : `Vitals saved locally. Will sync online soon!`,
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up-staggered">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('tracker.vitals.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">Record your blood pressure, pulse rate, oxygen saturation, and body mass indicators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Entry Form (7 cols) */}
        <form onSubmit={handleLog} className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-4">
          <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Activity className="w-5 h-5 text-primary" />
            <span>Daily Vitals Entry</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Blood Pressure Systolic */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="systolic">
                  Systolic BP (mmHg)
                </label>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${getSystolicStatus(systolic).color}`}>
                  {getSystolicStatus(systolic).label}
                </span>
              </div>
              <input
                id="systolic"
                type="number"
                inputMode="numeric"
                required
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                value={systolic}
                onChange={e => setSystolic(Number(e.target.value))}
              />
            </div>

            {/* Blood Pressure Diastolic */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="diastolic">
                  Diastolic BP (mmHg)
                </label>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${getDiastolicStatus(diastolic).color}`}>
                  {getDiastolicStatus(diastolic).label}
                </span>
              </div>
              <input
                id="diastolic"
                type="number"
                inputMode="numeric"
                required
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                value={diastolic}
                onChange={e => setDiastolic(Number(e.target.value))}
              />
            </div>

            {/* Heart Rate */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="heartRate">
                  Heart Rate (bpm)
                </label>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${getHeartRateStatus(heartRate).color}`}>
                  {getHeartRateStatus(heartRate).label}
                </span>
              </div>
              <input
                id="heartRate"
                type="number"
                inputMode="numeric"
                required
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                value={heartRate}
                onChange={e => setHeartRate(Number(e.target.value))}
              />
            </div>

            {/* SpO2 */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="spO2">
                  Blood Oxygen (SpO2 %)
                </label>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${getSpO2Status(spO2).color}`}>
                  {getSpO2Status(spO2).label}
                </span>
              </div>
              <input
                id="spO2"
                type="number"
                inputMode="numeric"
                required
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                value={spO2}
                onChange={e => setSpO2(Number(e.target.value))}
              />
            </div>

            {/* Weight */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase" htmlFor="weight">
                Body Weight (kg) - Optional
              </label>
              <input
                id="weight"
                type="number"
                inputMode="numeric"
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm input-accent-glow font-number"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
              />
            </div>

          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md touch-target btn-elastic btn-pulse-glow"
              style={{ '--btn-glow-color': '139, 92, 246' } as React.CSSProperties}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save Vitals Log</span>
            </button>
          </div>
        </form>

        {/* History List (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm glass">
          <h3 className="font-heading font-bold text-lg text-foreground mb-4">Vitals Logs</h3>
          
          {vitalsLogs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm font-medium">
              No vitals logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {vitalsLogs.map(log => (
                <div key={log.id} className="p-3.5 border border-border bg-muted/20 rounded-xl space-y-2 hover:scale-[1.01] transition-all">
                  <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                    <time className="text-[10px] text-muted-foreground font-semibold">
                      {formatDate(log.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                    </time>
                    {log.value.weight && (
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded font-number">
                        Weight: {formatNumber(log.value.weight)} kg
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-1 border border-border/40 rounded bg-card">
                      <span className="text-[9px] text-muted-foreground block">BP</span>
                      <span className="font-bold font-number">{log.value.systolic}/{log.value.diastolic}</span>
                    </div>
                    <div className="p-1 border border-border/40 rounded bg-card">
                      <span className="text-[9px] text-muted-foreground block">HR</span>
                      <span className="font-bold font-number">{formatNumber(log.value.heartRate)} bpm</span>
                    </div>
                    <div className="p-1 border border-border/40 rounded bg-card">
                      <span className="text-[9px] text-muted-foreground block">SpO2</span>
                      <span className="font-bold font-number">{formatNumber(log.value.spO2)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Guidelines info */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Standard Clinical Metrics:</span>
          - **Blood Pressure (BP)**: Normal is less than 120/80 mmHg. Hypertension stage 1 begins at 130-139 / 80-89 mmHg.<br />
          - **Heart Rate (HR)**: Standard resting heart rate for adults ranges from 60 to 100 beats per minute.<br />
          - **Oxygen Saturation (SpO2)**: A healthy SpO2 reading should range between 95% and 100%. Readings under 92% indicate severe respiratory distress.
        </div>
      </div>
    </div>
  );
};

export default MorningCheckIn;
