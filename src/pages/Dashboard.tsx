import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useHealthRead } from '../context/HealthReadContext';
import { useHealthDispatch } from '../context/HealthDispatchContext';
import { 
  Droplet, 
  Moon, 
  Smile, 
  Brain,
  BrainCircuit,
  ChevronRight, 
  Plus, 
  Zap
} from 'lucide-react';

const TipWidget = lazy(() => import('./dashboard/TipWidget'));
const RecentTimelineWidget = lazy(() => import('./dashboard/RecentTimelineWidget'));

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, formatNumber } = useLanguage();
  const { healthScore, todaySnapshot, logs } = useHealthRead();
  const { logWater, logMood, logVitals, logSleep } = useHealthDispatch();
  const navigate = useNavigate();

  const [showBelowFold, setShowBelowFold] = useState(false);
  const foldRef = useRef<HTMLDivElement>(null);

  // Quick action states
  const [successWater, setSuccessWater] = useState(false);
  const [successMood, setSuccessMood] = useState(false);
  const [successVitals, setSuccessVitals] = useState(false);
  const [successSleep, setSuccessSleep] = useState(false);

  const [sleepHrs, setSleepHrs] = useState<string>('8');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowBelowFold(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (foldRef.current) {
      observer.observe(foldRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleQuickWater = (glasses: number) => {
    logWater(glasses);
    setSuccessWater(true);
    setTimeout(() => setSuccessWater(false), 1500);
  };

  const handleQuickMood = (mood: string) => {
    logMood(mood);
    setSuccessMood(true);
    setTimeout(() => setSuccessMood(false), 1500);
  };

  const handleQuickVitals = (feeling: 'Energetic' | 'Good' | 'Tired' | 'Unwell') => {
    const sys = 120;
    const dia = 80;
    logVitals({
      systolic: sys,
      diastolic: dia,
      heartRate: feeling === 'Energetic' ? 76 : feeling === 'Good' ? 72 : feeling === 'Tired' ? 68 : 85,
      spO2: feeling === 'Unwell' ? 96 : 98,
      weight: feeling === 'Energetic' ? 70 : undefined
    });
    setSuccessVitals(true);
    setTimeout(() => setSuccessVitals(false), 1500);
  };

  const handleQuickSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const hrsNum = parseFloat(sleepHrs);
    if (!isNaN(hrsNum) && hrsNum > 0 && hrsNum <= 24) {
      logSleep(hrsNum, 3); // Log sleep with Average "Good" (3) quality
      setSuccessSleep(true);
      setTimeout(() => setSuccessSleep(false), 1500);
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // Calculate dynamic average sleep duration from history logs
  const sleepLogs = logs.filter(l => l.type === 'sleep');
  const avgSleepStr = sleepLogs.length > 0 
    ? `${formatNumber(Math.round((sleepLogs.reduce((acc, curr) => acc + curr.value.duration, 0) / sleepLogs.length) * 10) / 10)}h`
    : '--';

  // Get last stress log
  const lastStressLog = logs.find(l => l.type === 'stress');
  const stressStr = lastStressLog
    ? lastStressLog.value.score < 14 ? 'Low' : lastStressLog.value.score <= 26 ? 'Moderate' : 'High'
    : '--';

  // Determine Greeting dynamically
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Background glowing decorations */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      
      {/* Header Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground tracking-tight">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-0.5">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* 1. Metrics & Circular Gauge Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Radial Health Score Gauge */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm glass">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10"></div>
          
          <div className="relative w-36 h-36 flex items-center justify-center animate-float-slow">
            <svg className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="healthGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-muted/40"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="url(#healthGlow)"
                className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * healthScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-mono bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
                {formatNumber(healthScore)}
              </span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">Health Score</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 font-medium max-w-[220px] leading-relaxed">
            {t('dash.score_desc')}
          </p>
        </div>

        {/* 4 Stats Cards Column Grid */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Sleep Card */}
          <div 
            onClick={() => navigate('/trackers/sleep')}
            className="bg-gradient-to-br from-indigo-500/10 via-indigo-600/5 to-transparent border border-indigo-500/20 dark:border-indigo-500/10 rounded-2xl p-5 shadow-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Moon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">Sleep Avg</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold font-mono text-foreground block">
                {avgSleepStr}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">Recommended: 7-9h</span>
            </div>
          </div>

          {/* Stress Card */}
          <div 
            onClick={() => navigate('/trackers/stress')}
            className="bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent border border-purple-500/20 dark:border-purple-500/10 rounded-2xl p-5 shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-purple-500/20 text-purple-500 dark:text-purple-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wide">Stress</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold font-sans text-foreground block">
                {stressStr}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">PSS-10 Index</span>
            </div>
          </div>

          {/* Mood Card */}
          <div 
            onClick={() => navigate('/trackers/mood')}
            className="bg-gradient-to-br from-pink-500/10 via-pink-600/5 to-transparent border border-pink-500/20 dark:border-pink-500/10 rounded-2xl p-5 shadow-sm hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:border-pink-500/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-pink-500/20 text-pink-500 dark:text-pink-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Smile className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wide">Mood</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold font-sans text-foreground block truncate">
                {todaySnapshot.mood ? todaySnapshot.mood : '--'}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">Today's feeling</span>
            </div>
          </div>

          {/* Water Card */}
          <div 
            onClick={() => navigate('/trackers/water')}
            className="bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent border border-blue-500/20 dark:border-blue-500/10 rounded-2xl p-5 shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Droplet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">Water</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold font-mono text-foreground block">
                {formatNumber(todaySnapshot.water * 250 / 1000)}L
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">Goal: 2.0L ({formatNumber(8)} gl)</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Direct Log Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Log Sleep Form Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm glass flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2">
              <Moon className="w-4.5 h-4.5 text-indigo-500" />
              <span>Log Sleep</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">Record last night's sleep hours.</p>
            
            <form onSubmit={handleQuickSleep} className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                max="24"
                step="0.5"
                className="w-full p-2 border border-border rounded-lg bg-background/50 focus:border-primary outline-none text-xs font-mono font-bold"
                value={sleepHrs}
                onChange={e => setSleepHrs(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white font-bold p-2 px-3 rounded-lg text-xs shrink-0 touch-target"
              >
                Log
              </button>
            </form>
          </div>
          {successSleep && (
            <div className="mt-3 p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold text-center rounded-md animate-fade-in">
              ✓ Sleep Logged!
            </div>
          )}
        </div>

        {/* Quick Mood Form Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm glass flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2">
              <Smile className="w-4.5 h-4.5 text-pink-500" />
              <span>Quick Mood</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">How are you feeling today?</p>
            
            <div className="flex justify-between gap-1">
              {[
                { label: 'Awful', emoji: '😢' },
                { label: 'Low', emoji: '😕' },
                { label: 'Okay', emoji: '😐' },
                { label: 'Good', emoji: '🙂' },
                { label: 'Great', emoji: '😀' }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => handleQuickMood(item.label)}
                  className="p-1.5 hover:bg-muted rounded-lg text-lg transition-transform hover:scale-125 touch-target"
                  title={item.label}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>
          {successMood && (
            <div className="mt-3 p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold text-center rounded-md animate-fade-in">
              ✓ Mood Updated!
            </div>
          )}
        </div>

        {/* Water Level log Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm glass flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2">
              <Droplet className="w-4.5 h-4.5 text-blue-500" />
              <span>Water: {formatNumber(todaySnapshot.water * 250)}ml</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">Log hydration quantity directly.</p>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickWater(1)}
                className="bg-muted hover:bg-muted/80 text-foreground font-bold p-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 touch-target border border-border"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>250ml</span>
              </button>
              <button
                onClick={() => handleQuickWater(2)}
                className="bg-muted hover:bg-muted/80 text-foreground font-bold p-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 touch-target border border-border"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>500ml</span>
              </button>
            </div>
          </div>
          {successWater && (
            <div className="mt-3 p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold text-center rounded-md animate-fade-in">
              ✓ Water Logged!
            </div>
          )}
        </div>

        {/* Morning Check-In Form Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm glass flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2">
              <Zap className="w-4.5 h-4.5 text-emerald-500" />
              <span>Morning Check-in</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">Record somatic feeling and vitals.</p>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Energetic' },
                { label: 'Good' },
                { label: 'Tired' },
                { label: 'Unwell' }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => handleQuickVitals(item.label as any)}
                  className="bg-muted hover:bg-muted/80 text-foreground font-semibold p-1.5 rounded-lg text-[10px] text-center border border-border touch-target transition-all hover:border-emerald-500/20"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {successVitals && (
            <div className="mt-3 p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold text-center rounded-md animate-fade-in">
              ✓ Logged Check-in!
            </div>
          )}
        </div>

      </div>

      {/* 3. Medical Predictions Grid Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
          <BrainCircuit className="w-5.5 h-5.5 text-primary shrink-0" />
          <span>Medical Predictions</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'diabetes', title: 'Diabetes Predictor', path: '/predictors/diabetes', color: 'border-orange-500/20 hover:border-orange-500/40 bg-orange-500/5' },
            { id: 'heart', title: 'Heart Attack Predictor', path: '/predictors/heart-attack', color: 'border-red-500/20 hover:border-red-500/40 bg-red-500/5' },
            { id: 'ecg', title: 'ECG Analysis', path: '/predictors/ecg', color: 'border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5' },
            { id: 'cancer', title: 'Cancer Screening', path: '/predictors/cancer', color: 'border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`p-5 border rounded-2xl text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${item.color} flex flex-col justify-between min-h-[120px] touch-target group`}
            >
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] text-muted-foreground leading-normal">Interactive clinical risk indices evaluator.</p>
              </div>
              <span className="text-[10px] text-primary font-bold flex items-center gap-0.5 mt-4">
                Run predictor
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Below Fold Area (Lazy Loaded Suggestions & Timeline) */}
      <div ref={foldRef} className="pt-4 border-t border-border border-dashed">
        {showBelowFold ? (
          <Suspense fallback={
            <div className="w-full space-y-4 animate-pulse">
              <div className="h-40 bg-muted rounded-2xl"></div>
              <div className="h-60 bg-muted rounded-2xl"></div>
            </div>
          }>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <RecentTimelineWidget logs={logs} />
              </div>
              <div>
                <TipWidget />
              </div>
            </div>
          </Suspense>
        ) : (
          <div className="h-20 flex items-center justify-center text-muted-foreground text-xs font-semibold">
            Scroll down to view recent timeline and health suggestions...
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;

