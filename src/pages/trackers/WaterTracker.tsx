import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Droplet, Plus, Minus, Info } from 'lucide-react';
import { showToast } from '../../utils/toast';

const WaterTracker: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const { todaySnapshot } = useHealthRead();
  const { logWater } = useHealthDispatch();
  const [glasses, setGlasses] = useState(1);

  const totalDrunk = todaySnapshot.water;
  const target = 8;
  const progressPercent = Math.min((totalDrunk / target) * 100, 100);

  const handleLog = () => {
    logWater(glasses);
    setGlasses(1);
    showToast(
      navigator.onLine 
        ? `Logged ${glasses} glass(es) of water successfully!`
        : `Logged ${glasses} glass(es) locally. Will sync online soon!`,
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-up-staggered">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('tracker.water.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('tracker.water.goal')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Visual progress cup card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden glass">
          
          {/* Wave fluid simulation wrapper */}
          <div className="relative w-40 h-56 border-4 border-muted rounded-b-3xl rounded-t-lg overflow-hidden flex flex-col justify-end shadow-inner mb-6">
            
            {/* Water liquid filler with wave SVG */}
            <div 
              className="bg-gradient-to-t from-blue-600/90 to-cyan-400/80 w-full transition-all duration-1000 ease-out relative"
              style={{ height: `${progressPercent}%` }}
            >
              {progressPercent > 0 && (
                <>
                  <svg 
                    className="absolute left-0 w-[200%] h-8 -top-7 fill-cyan-400/80 animate-wave-flow overflow-visible" 
                    viewBox="0 0 100 20" 
                    preserveAspectRatio="none"
                  >
                    <path d="M0,10 C30,10 30,15 60,15 C90,15 90,10 120,10 C150,10 150,15 180,15 C210,15 210,10 240,10 L240,20 L0,20 Z" />
                  </svg>
                  <svg 
                    className="absolute left-0 w-[200%] h-8 -top-6 fill-blue-500/50 animate-wave-flow-reverse overflow-visible" 
                    viewBox="0 0 100 20" 
                    preserveAspectRatio="none"
                  >
                    <path d="M0,12 C30,12 30,8 60,8 C90,8 90,12 120,12 C150,12 150,8 180,8 C210,8 210,12 240,12 L240,20 L0,20 Z" />
                  </svg>
                </>
              )}
            </div>
            
            {/* Percentage text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <span className="text-3xl font-extrabold font-number text-foreground drop-shadow-md mix-blend-difference">
                {formatNumber(Math.round(progressPercent))}%
              </span>
              <span className="text-[10px] text-muted-foreground drop-shadow-sm font-semibold mix-blend-difference mt-1">
                {formatNumber(totalDrunk)} / {formatNumber(target)} Glasses
              </span>
            </div>
          </div>

          <div className="text-center w-full">
            <p className="text-sm font-bold text-foreground">
              {totalDrunk >= target ? 'Daily hydration goal achieved!' : 'Keep drinking to reach your daily goal.'}
            </p>

            {/* 8 Glass Icons Grid */}
            <div className="mt-6 border-t border-border/40 pt-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-wider">Hydration Checklist</p>
              <div className="flex justify-center gap-1.5 flex-wrap">
                {Array.from({ length: 8 }).map((_, index) => {
                  const isFilled = index < totalDrunk;
                  return (
                    <div 
                      key={index}
                      className={`w-8 h-8 rounded-lg border transition-all duration-500 flex items-center justify-center ${
                        isFilled
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)] animate-pulse'
                          : 'border-border bg-muted/10 text-muted-foreground/30'
                      }`}
                    >
                      <Droplet className={`w-4 h-4 ${isFilled ? 'fill-current' : ''}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Input logger card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between glass">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-4">Record Water Log</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Enter the number of glasses of water you just drank (approx. 250ml per glass).
            </p>

            <div className="flex items-center justify-center gap-6 mb-8">
              <button
                onClick={() => setGlasses(prev => Math.max(1, prev - 1))}
                className="w-12 h-12 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl flex items-center justify-center border border-border shadow-sm touch-target btn-elastic"
                aria-label="Decrease glasses"
              >
                <Minus className="w-5 h-5" />
              </button>

              <span className="text-3xl font-extrabold font-number w-12 text-center text-primary">
                {formatNumber(glasses)}
              </span>

              <button
                onClick={() => setGlasses(prev => prev + 1)}
                className="w-12 h-12 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl flex items-center justify-center border border-border shadow-sm touch-target btn-elastic"
                aria-label="Increase glasses"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleLog}
            className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10 touch-target btn-elastic btn-pulse-glow"
            style={{ '--btn-glow-color': '139, 92, 246' } as React.CSSProperties}
          >
            <Droplet className="w-5 h-5" />
            <span>Add to Log</span>
          </button>
        </div>

      </div>

      {/* Triage Guidelines */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Why Hydration Matters:</span>
          Water keeps your temperature normal, lubricates and cushions joints, protects your spinal cord, and gets rid of wastes through urination and sweat. The National Health Portal of India recommends at least 2.5-3 liters of fluids daily.
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
