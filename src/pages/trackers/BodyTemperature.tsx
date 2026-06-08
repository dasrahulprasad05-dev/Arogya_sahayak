import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Thermometer, Info, ShieldAlert, CheckCircle, Plus, Minus } from 'lucide-react';
import { showToast } from '../../utils/toast';

const BodyTemperature: React.FC = () => {
  const { t, formatDate, formatNumber } = useLanguage();
  const { logs } = useHealthRead();
  const { logTemperature } = useHealthDispatch();

  const [temp, setTemp] = useState(36.8);
  const [isDragging, setIsDragging] = useState(false);

  const tempLogs = logs.filter(log => log.type === 'temperature').slice(0, 5);

  const minTemp = 35.0;
  const maxTemp = 41.5;

  const percentage = Math.min(Math.max((temp - minTemp) / (maxTemp - minTemp), 0), 1);
  const stemMaxHeight = 120;
  const mercuryHeight = percentage * stemMaxHeight + 15;
  const mercuryY = 125 - (percentage * stemMaxHeight);

  const calculateTempFromY = (clientY: number, containerRect: DOMRect) => {
    const clickY = clientY - containerRect.top;
    const clickPercentage = 1 - (clickY / containerRect.height);
    const calculatedTemp = minTemp + clickPercentage * (maxTemp - minTemp);
    const roundedTemp = Math.round(calculatedTemp * 10) / 10;
    return Math.min(Math.max(roundedTemp, minTemp), maxTemp);
  };

  const handleThermometerClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newTemp = calculateTempFromY(e.clientY, rect);
    setTemp(newTemp);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newTemp = calculateTempFromY(e.clientY, rect);
    setTemp(newTemp);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleLog = () => {
    logTemperature(temp);
    showToast(
      navigator.onLine 
        ? `Logged body temperature of ${temp}°C successfully!`
        : `Logged temperature locally. Will sync online soon!`,
      'success'
    );
  };

  const getFeverStatus = (value: number) => {
    if (value < 37.5) {
      return { 
        label: 'Normal Temperature', 
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        desc: 'Your body temperature is within standard parameters (< 37.5°C).' 
      };
    } else if (value <= 38.5) {
      return { 
        label: 'Low Grade Fever', 
        color: 'text-amber-600 dark:text-amber-500 bg-amber-500/10 border-amber-500/20',
        desc: 'Indicates a minor immune response (37.5–38.5°C). Rest and keep hydrated.' 
      };
    } else {
      return { 
        label: 'High Fever', 
        color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
        desc: 'Fever is elevated (> 38.5°C). Warrants alert! Consult a doctor if fever persists.' 
      };
    }
  };

  const activeStatus = getFeverStatus(temp);

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-up-staggered">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('tracker.temp.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">Record body temperature and monitor fever indexes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Logger Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between glass">
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 pb-3 border-b border-border/40">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <span>Record Temperature</span>
            </h3>

            {/* Interactive SVG Thermometer Column & Controls */}
            <div className="flex gap-6 items-center justify-center py-4 bg-muted/10 rounded-2xl border border-border/20">
              {/* SVG Thermometer */}
              <div className="relative group">
                <svg 
                  viewBox="0 0 60 160" 
                  className="w-20 h-60 select-none cursor-pointer overflow-visible"
                  onClick={handleThermometerClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <defs>
                    <linearGradient id="thermometerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="60%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                  </defs>
                  {/* Outer glass boundary */}
                  <rect x="23" y="10" width="14" height="116" rx="7" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted-foreground/30" />
                  <circle cx="30" cy="132" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted-foreground/30" />
                  {/* Inner empty space */}
                  <rect x="25" y="12" width="10" height="112" rx="5" fill="currentColor" className="text-muted/10 dark:text-muted/20" />
                  <circle cx="30" cy="132" r="14" fill="currentColor" className="text-muted/10 dark:text-muted/20" />
                  {/* Mercury fill level */}
                  <rect x="26" y={mercuryY} width="8" height={mercuryHeight} rx="4" fill="url(#thermometerGrad)" className="transition-all duration-300" />
                  <circle cx="30" cy="132" r="12" fill="url(#thermometerGrad)" />
                </svg>
              </div>

              {/* Readout and Adjustment Buttons */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Value</span>
                <span className="text-3xl font-extrabold font-number text-primary drop-shadow-sm">
                  {formatNumber(temp, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}°C
                </span>

                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => setTemp(prev => Math.max(35.0, Math.round((prev - 0.1) * 10) / 10))}
                    className="w-10 h-10 border border-border bg-card rounded-xl text-xs font-bold hover:bg-muted flex items-center justify-center touch-target btn-elastic"
                    aria-label="Decrease 0.1 degrees"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setTemp(prev => Math.min(41.5, Math.round((prev + 0.1) * 10) / 10))}
                    className="w-10 h-10 border border-border bg-card rounded-xl text-xs font-bold hover:bg-muted flex items-center justify-center touch-target btn-elastic"
                    aria-label="Increase 0.1 degrees"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[9px] text-muted-foreground mt-2 italic text-center leading-tight">Click/Drag thermometer<br/>for quick adjustment</span>
              </div>
            </div>

            {/* Live Warning Status Card */}
            <div className={`p-4 border rounded-xl flex items-start gap-2.5 transition-all duration-300 ${activeStatus.color} animate-pulse shadow-sm`}>
              {temp < 37.5 ? (
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-extrabold text-xs block mb-1 uppercase tracking-wider">
                  {activeStatus.label}
                </span>
                <p className="text-[11px] leading-relaxed opacity-95">
                  {activeStatus.desc}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleLog}
              className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10 touch-target btn-elastic btn-pulse-glow"
              style={{ '--btn-glow-color': '139, 92, 246' } as React.CSSProperties}
            >
              <span>Log Entry</span>
            </button>
          </div>
        </div>

        {/* History List Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-4 pb-3 border-b border-border/40">Temperature History</h3>

            {tempLogs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm font-medium">
                No temperature records found.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {tempLogs.map(log => {
                  const status = getFeverStatus(Number(log.value.temperature));
                  return (
                    <div key={log.id} className="p-3 border border-border bg-muted/20 rounded-xl flex items-center justify-between hover:scale-[1.01] transition-all">
                      <div>
                        <time className="text-[10px] text-muted-foreground font-semibold block">
                          {formatDate(log.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                        </time>
                        <span className="text-base font-extrabold text-foreground font-number">
                          {formatNumber(log.value.temperature)}°C
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${status.color.split(' ')[0]} ${status.color.split(' ')[2]}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="text-[10px] text-muted-foreground text-center mt-6 italic">
            Visual logs show the latest 5 entries recorded.
          </div>
        </div>

      </div>

      {/* Triage Guidelines */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Clinical Fever Metrics:</span>
          A normal body temperature is around 37.0°C (98.6°F) but varies by individual, age, activity, and time of day. Fever is a normal immune defense mechanism indicating infectious or inflammatory indices. If temperature exceeds 38.5°C or is accompanied by confusion, stiff neck, or dyspnea, seek immediate medical attention or dial 108.
        </div>
      </div>
    </div>
  );
};

export default BodyTemperature;
