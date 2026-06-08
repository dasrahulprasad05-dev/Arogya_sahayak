import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Play, Square, Info, Sparkles } from 'lucide-react';
import { showToast } from '../../utils/toast';

type BreatheMode = 'box' | '478';

const BreathingExercise: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const { logExercise } = useHealthDispatch();

  const [mode, setMode] = useState<BreatheMode>('478');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycles, setCycles] = useState(0);

  const timerRef = useRef<any>(null);

  // Core Breathing State Machine
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setSecondsLeft(4);
      setPhase('Inhale');
      return;
    }

    const runTimer = () => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (mode === '478') {
            if (phase === 'Inhale') {
              setPhase('Hold');
              return 7;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return 8;
            } else {
              setPhase('Inhale');
              setCycles(c => c + 1);
              return 4;
            }
          } else {
            // Box Breathing: Inhale(4s) -> Hold(4s) -> Exhale(4s) -> Hold(4s)
            if (phase === 'Inhale') {
              setPhase('Hold');
              return 4;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return 4;
            } else {
              setPhase('Inhale');
              setCycles(c => c + 1);
              return 4;
            }
          }
        }
        return prev - 1;
      });
    };

    timerRef.current = setInterval(runTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, mode]);

  const handleStart = () => {
    setIsActive(true);
    setCycles(0);
    setPhase('Inhale');
    setSecondsLeft(4);
  };

  const handleStop = () => {
    setIsActive(false);
    if (cycles > 0) {
      const routineName = `${mode === '478' ? '4-7-8' : 'Box'} Guided Breathing`;
      const durationMin = Math.round(cycles * (mode === '478' ? 19 : 16) / 60) || 1;
      
      logExercise({
        routine: routineName,
        duration: durationMin
      });

      showToast(
        navigator.onLine 
          ? `Saved guided breathing session of ${durationMin} min(s)!`
          : `Session saved locally. Will sync online soon!`,
        'success'
      );
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-up-staggered">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('tracker.breathing.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Perform paced diaphragmatic breathing to regulate your nervous system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Animated circle widget */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden glass min-h-[350px]">
          
          {/* Glowing background halo */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl"></div>
          </div>

          {/* Exhale Ripples */}
          {isActive && phase === 'Exhale' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-44 h-44 rounded-full border-2 border-cyan-400/50 animate-ripple"></div>
              <div className="absolute w-44 h-44 rounded-full border-2 border-cyan-400/35 animate-ripple" style={{ animationDelay: '1s' }}></div>
              <div className="absolute w-44 h-44 rounded-full border-2 border-cyan-400/20 animate-ripple" style={{ animationDelay: '2s' }}></div>
            </div>
          )}

          {/* Growing / shrinking circle with SVG Gradient Stroke */}
          <div 
            className={`w-44 h-44 rounded-full flex flex-col items-center justify-center relative shadow-lg shadow-cyan-500/5 ${
              isActive 
                ? mode === '478' 
                  ? 'animate-breath-478' 
                  : 'animate-breath-box'
                : 'scale-100'
            }`}
            style={{ transition: 'transform 1s ease-in-out' }}
          >
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="breathGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <circle
                cx="88"
                cy="88"
                r="82"
                stroke="url(#breathGlow)"
                strokeWidth="6"
                fill="none"
                className="opacity-90 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]"
              />
            </svg>

            {/* Inner fill card */}
            <div className="w-[152px] h-[152px] bg-card dark:bg-card/90 rounded-full flex flex-col items-center justify-center z-10">
              <span className="text-4xl font-extrabold font-number text-cyan-600 dark:text-cyan-400 drop-shadow-sm">
                {isActive ? formatNumber(secondsLeft) : 'Ready'}
              </span>
              {isActive && (
                <span className="text-[10px] text-cyan-800 dark:text-cyan-500 font-bold uppercase tracking-wider mt-1">
                  {phase}
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 text-center w-full">
            <h3 className="font-bold text-sm text-foreground">
              {isActive 
                ? phase === 'Inhale' ? '🔑 Breathe in slowly through your nose...' : phase === 'Hold' ? '🤫 Hold your breath...' : '💨 Exhale fully through your mouth...'
                : 'Press start to begin'
              }
            </h3>
            
            <div className="mt-4 border-t border-border/40 pt-4">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">
                Completed cycles: {formatNumber(cycles)}
              </p>
              {/* Cycle dots row */}
              <div className="flex gap-1.5 mt-2.5 justify-center">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                      i < cycles 
                        ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-110' 
                        : 'bg-muted/30 border border-border/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Configurations and instructions */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between glass">
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <span>Routine Settings</span>
            </h3>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={isActive}
                onClick={() => setMode('478')}
                className={`p-4 border rounded-xl text-left transition-all touch-target btn-elastic ${
                  mode === '478'
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-800 dark:text-cyan-400 font-bold scale-102 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'border-border bg-background/50 text-muted-foreground hover:bg-muted/50'
                } disabled:opacity-60`}
              >
                <span className="text-sm block mb-1">4-7-8 Breathing</span>
                <span className="text-[10px] leading-tight font-medium opacity-80 block">
                  Inhale 4s · Hold 7s · Exhale 8s. Great for sleep and anxiety.
                </span>
              </button>

              <button
                disabled={isActive}
                onClick={() => setMode('box')}
                className={`p-4 border rounded-xl text-left transition-all touch-target btn-elastic ${
                  mode === 'box'
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-800 dark:text-cyan-400 font-bold scale-102 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'border-border bg-background/50 text-muted-foreground hover:bg-muted/50'
                } disabled:opacity-60`}
              >
                <span className="text-sm block mb-1">Box Breathing</span>
                <span className="text-[10px] leading-tight font-medium opacity-80 block">
                  Inhale 4s · Hold 4s · Exhale 4s. Promotes mental focus.
                </span>
              </button>
            </div>

            {/* Instructions */}
            <div className="p-4 border border-border bg-muted/30 rounded-xl space-y-2 text-xs text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground block uppercase tracking-wide">How to perform:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Sit comfortably with your back straight and feet on the ground.</li>
                <li>Place one hand on your chest and the other on your abdomen.</li>
                <li>Inhale deeply through your nose, expanding your abdomen (diaphragm).</li>
                <li>Exhale slowly, letting your abdomen fall. Keep your shoulders relaxed.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            {isActive ? (
              <button
                onClick={handleStop}
                className="w-full bg-destructive hover:bg-destructive/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md touch-target btn-elastic"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Routine</span>
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10 touch-target btn-elastic btn-pulse-glow"
                style={{ '--btn-glow-color': '139, 92, 246' } as React.CSSProperties}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Routine</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Guidelines info */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Autonomic Regulation Protocol:</span>
          Slow, diaphragmatic breathing (around 6 breaths per minute) stimulates the vagus nerve, increasing heart rate variability (HRV) and switching the autonomic nervous system from sympathetic (fight-or-flight) to parasympathetic (rest-and-digest). This causes an immediate reduction in blood pressure and somatic anxiety scores.
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
