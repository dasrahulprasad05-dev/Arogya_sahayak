import React, { useState, useEffect, useRef, Suspense, lazy, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  Zap,
  HeartPulse,
  Activity,
  Microscope
} from 'lucide-react';

const TipWidget = lazy(() => import('./dashboard/TipWidget'));
const RecentTimelineWidget = lazy(() => import('./dashboard/RecentTimelineWidget'));

const quickTools = [
  {
    id: 'diabetes',
    title: 'Diabetes Predictor',
    desc: 'Assess glycemic risk using HbA1c, glucose, and symptoms.',
    path: '/predictors/diabetes',
    icon: Droplet,
    rgb: '6, 182, 212', // Cyan
    textClass: 'text-cyan-500 dark:text-cyan-400'
  },
  {
    id: 'heart',
    title: 'Heart Attack Predictor',
    desc: 'Cardiovascular checkups via vitals and chest-pain logs.',
    path: '/predictors/heart-attack',
    icon: HeartPulse,
    rgb: '239, 68, 68', // Red
    textClass: 'text-red-500 dark:text-red-400'
  },
  {
    id: 'ecg',
    title: 'ECG Analysis',
    desc: 'Identify cardiac anomalies and QT interval issues.',
    path: '/predictors/ecg',
    icon: Activity,
    rgb: '139, 92, 246', // Violet
    textClass: 'text-violet-500 dark:text-violet-400'
  },
  {
    id: 'cancer',
    title: 'Cancer Screening',
    desc: 'Verify early warning flags and risk assessments.',
    path: '/predictors/cancer',
    icon: Microscope,
    rgb: '16, 185, 129', // Emerald
    textClass: 'text-emerald-500 dark:text-emerald-400'
  }
];

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

  // Count-up states
  const [displayHealthScore, setDisplayHealthScore] = useState(0);
  const [displaySleep, setDisplaySleep] = useState(0);
  const [displayStress, setDisplayStress] = useState(0);
  const [displayWater, setDisplayWater] = useState(0);

  const avgSleepVal = useMemo(() => {
    const sleepLogs = logs.filter(l => l.type === 'sleep');
    return sleepLogs.length > 0 
      ? Math.round((sleepLogs.reduce((acc, curr) => acc + curr.value.duration, 0) / sleepLogs.length) * 10) / 10
      : 0;
  }, [logs]);

  const lastStressLog = useMemo(() => logs.find(l => l.type === 'stress'), [logs]);
  const stressScoreVal = lastStressLog ? lastStressLog.value.score : 0;
  const stressCategory = lastStressLog
    ? lastStressLog.value.score < 14 ? 'Low' : lastStressLog.value.score <= 26 ? 'Moderate' : 'High'
    : '--';

  const waterVal = todaySnapshot.water * 250 / 1000; // in Liters

  useEffect(() => {
    const duration = 1200; // 1.2s count up
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplayHealthScore(Math.round(healthScore * ease));
      setDisplaySleep(Math.round(avgSleepVal * ease * 10) / 10);
      setDisplayStress(Math.round(stressScoreVal * ease));
      setDisplayWater(Math.round(waterVal * ease * 100) / 100);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [healthScore, avgSleepVal, stressScoreVal, waterVal]);

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
      logSleep(hrsNum, 3); // Average "Good" (3) quality
      setSuccessSleep(true);
      setTimeout(() => setSuccessSleep(false), 1500);
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const prefersReducedMotion = useReducedMotion();

  // Gauge color interpolation: red(0) → amber(50) → teal(80) → emerald(100)
  const gaugeColor = useMemo(() => {
    if (healthScore < 30) return '#ef4444';       // red
    if (healthScore < 50) return '#f59e0b';        // amber
    if (healthScore < 80) return '#14b8a6';         // teal
    return '#10b981';                               // emerald
  }, [healthScore]);

  return (
    <motion.div
      className="space-y-8 relative pb-12"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] bg-cyan-500/3 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-purple-500/3 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] bg-pink-500/3 dark:bg-pink-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>
      
      {/* Header Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl animate-pulse text-cyan-500 dark:text-cyan-400 shrink-0">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
              {getGreeting()}, {userName} 👋
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-0.5">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Metrics & Circular Gauge Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Radial Health Score Gauge */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm glass">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10"></div>
          
          <div className="relative w-36 h-36 flex items-center justify-center animate-float-slow">
            <svg className="w-full h-full health-gauge-ring">
              <defs>
                <linearGradient id="healthScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gaugeColor} />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              {/* Outer spinning dashed ring */}
              <circle
                cx="72"
                cy="72"
                r="68"
                stroke={gaugeColor}
                strokeWidth="1.5"
                strokeDasharray="4 6"
                fill="transparent"
                className="opacity-30"
                style={{ transformOrigin: '72px 72px', animation: prefersReducedMotion ? 'none' : 'spin 30s linear infinite' }}
              />
              {/* Background track */}
              <circle
                cx="72"
                cy="72"
                r="60"
                className="health-gauge-track stroke-muted/20 dark:stroke-muted/10"
                fill="transparent"
              />
              {/* Animated progress arc */}
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="url(#healthScoreGrad)"
                className="health-gauge-progress"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * displayHealthScore) / 100}
                style={{ filter: `drop-shadow(0 0 12px ${gaugeColor}80)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-number bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                {formatNumber(displayHealthScore)}
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
            className="tracker-card p-5 shadow-sm bg-gradient-to-br from-indigo-500/10 via-indigo-600/5 to-transparent hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 flex flex-col justify-between group cursor-pointer rounded-2xl"
            style={{ '--tracker-accent-rgb': '99, 102, 241' } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Moon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">Sleep Avg</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold font-number text-foreground block">
                {avgSleepVal > 0 ? `${formatNumber(displaySleep)}h` : '--'}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">Recommended: 7-9h</span>
            </div>
          </div>

          {/* Stress Card */}
          <div 
            onClick={() => navigate('/trackers/stress')}
            className="tracker-card p-5 shadow-sm bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300 flex flex-col justify-between group cursor-pointer rounded-2xl"
            style={{ '--tracker-accent-rgb': '168, 85, 247' } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-purple-500/20 text-purple-500 dark:text-purple-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wide">Stress</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold font-number text-foreground block">
                {lastStressLog ? `${formatNumber(displayStress)}/40` : '--'}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">{lastStressLog ? `${stressCategory} Index` : 'PSS-10 Index'}</span>
            </div>
          </div>

          {/* Mood Card */}
          <div 
            onClick={() => navigate('/trackers/mood')}
            className="tracker-card p-5 shadow-sm bg-gradient-to-br from-rose-500/10 via-rose-600/5 to-transparent hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all duration-300 flex flex-col justify-between group cursor-pointer rounded-2xl"
            style={{ '--tracker-accent-rgb': '244, 63, 94' } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-rose-500/20 text-rose-500 dark:text-rose-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Smile className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">Mood</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold font-number text-foreground block truncate">
                {todaySnapshot.mood ? todaySnapshot.mood : '--'}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">Today's feeling</span>
            </div>
          </div>

          {/* Water Card */}
          <div 
            onClick={() => navigate('/trackers/water')}
            className="tracker-card p-5 shadow-sm bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-transparent hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col justify-between group cursor-pointer rounded-2xl"
            style={{ '--tracker-accent-rgb': '6, 182, 212' } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Droplet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wide">Water</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold font-number text-foreground block">
                {formatNumber(displayWater)}L
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">Goal: 2.0L ({formatNumber(8)} gl)</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Direct Log Activity Cards */}
      <div className="space-y-4">
        <div className="relative pl-4 flex items-center gap-2">
          <div className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full"></div>
          <Zap className="w-5.5 h-5.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
          <h2 className="text-xl font-bold font-heading text-foreground">Quick Trackers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Log Sleep Form Card */}
          <div 
            className="tracker-card p-5 shadow-sm flex flex-col justify-between rounded-2xl"
            style={{ '--tracker-accent-rgb': '99, 102, 241' } as React.CSSProperties}
          >
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
          <div 
            className="tracker-card p-5 shadow-sm flex flex-col justify-between rounded-2xl"
            style={{ '--tracker-accent-rgb': '244, 63, 94' } as React.CSSProperties}
          >
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
          <div 
            className="tracker-card p-5 shadow-sm flex flex-col justify-between rounded-2xl"
            style={{ '--tracker-accent-rgb': '6, 182, 212' } as React.CSSProperties}
          >
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
          <div 
            className="tracker-card p-5 shadow-sm flex flex-col justify-between rounded-2xl"
            style={{ '--tracker-accent-rgb': '16, 185, 129' } as React.CSSProperties}
          >
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
      </div>

      {/* 3. Medical Predictions Grid Section */}
      <div className="space-y-6">
        <div className="relative pl-4 flex items-center gap-2">
          <div className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full"></div>
          <BrainCircuit className="w-5.5 h-5.5 text-purple-500 dark:text-purple-400 shrink-0" />
          <h2 className="text-xl font-bold font-heading text-foreground">Medical Predictions</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickTools.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="p-5 flex flex-col justify-between text-left rounded-2xl predictor-card group touch-target animate-slide-up"
                style={{
                  '--card-accent-rgb': item.rgb,
                  animationDelay: `${index * 50}ms`
                } as React.CSSProperties}
              >
                <div>
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `rgba(${item.rgb}, 0.15)`
                    }}
                  >
                    <IconComponent className={`w-6 h-6 ${item.textClass}`} />
                  </div>
                  <h3 className="font-heading font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-normal">{item.desc}</p>
                </div>
                <span className={`text-[10px] ${item.textClass} font-bold flex items-center gap-0.5 mt-4`}>
                  <span>Run predictor</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Below Fold Area (Lazy Loaded Suggestions & Timeline) */}
      <div ref={foldRef} className="pt-8 border-t border-border border-dashed space-y-6">
        <div className="relative pl-4 flex items-center gap-2">
          <div className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full"></div>
          <Activity className="w-5.5 h-5.5 text-pink-500 shrink-0" />
          <h2 className="text-xl font-bold font-heading text-foreground">Timeline & Suggestions</h2>
        </div>

        {showBelowFold ? (
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="tracker-card p-6 rounded-2xl min-h-[300px] flex flex-col justify-between relative overflow-hidden" style={{ '--tracker-accent-rgb': '244, 63, 94' } as React.CSSProperties}>
                  <div className="neon-shimmer-bg"></div>
                  <div className="h-6 bg-muted/40 rounded-lg w-1/4 animate-pulse"></div>
                  <div className="space-y-4 my-6">
                    <div className="h-4 bg-muted/40 rounded-lg w-full animate-pulse"></div>
                    <div className="h-4 bg-muted/40 rounded-lg w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-muted/40 rounded-lg w-2/3 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-muted/40 rounded-lg w-1/3 animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="tracker-card p-6 rounded-2xl min-h-[300px] flex flex-col justify-between relative overflow-hidden" style={{ '--tracker-accent-rgb': '6, 182, 212' } as React.CSSProperties}>
                  <div className="neon-shimmer-bg"></div>
                  <div className="h-6 bg-muted/40 rounded-lg w-1/3 animate-pulse"></div>
                  <div className="space-y-4 my-6">
                    <div className="h-4 bg-muted/40 rounded-lg w-full animate-pulse"></div>
                    <div className="h-4 bg-muted/40 rounded-lg w-full animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-muted/40 rounded-lg w-1/2 animate-pulse"></div>
                </div>
              </div>
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
          <div className="h-20 flex items-center justify-center text-slate-400 text-xs font-semibold">
            Scroll down to view recent timeline and health suggestions...
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default Dashboard;
