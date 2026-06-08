import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Moon, Star, Info, Calendar } from 'lucide-react';
import { showToast } from '../../utils/toast';

const SleepTracker: React.FC = () => {
  const { formatNumber } = useLanguage();
  const { logs } = useHealthRead();
  const { logSleep } = useHealthDispatch();

  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [bedtime, setBedtime] = useState<string>('23:00');
  const [waketime, setWaketime] = useState<string>('07:00');
  const [quality, setQuality] = useState<number>(3); // 1 = Restless, 3 = Light, 4 = Deep, 5 = Excellent

  // Calculate duration dynamically
  const duration = useMemo(() => {
    const [bH, bM] = bedtime.split(':').map(Number);
    const [wH, wM] = waketime.split(':').map(Number);
    let diff = (wH + wM / 60) - (bH + bM / 60);
    if (diff < 0) diff += 24;
    return Math.round(diff * 10) / 10;
  }, [bedtime, waketime]);

  // Calculate sleep score out of 100 based on duration and quality
  const sleepScore = useMemo(() => {
    let score = 0;
    if (duration >= 7 && duration <= 9) score += 60;
    else if (duration >= 6 || duration === 10) score += 40;
    else if (duration >= 5 || duration === 11) score += 20;

    score += (quality / 5) * 40;
    return Math.round(score);
  }, [duration, quality]);

  const sleepLogs = logs.filter(log => log.type === 'sleep');

  // Compute metrics from log history
  const avgSleep = useMemo(() => {
    if (sleepLogs.length === 0) return 0;
    const sum = sleepLogs.reduce((acc, curr) => acc + curr.value.duration, 0);
    return Math.round((sum / sleepLogs.length) * 10) / 10;
  }, [sleepLogs]);

  const bestNight = useMemo(() => {
    if (sleepLogs.length === 0) return 0;
    return Math.max(...sleepLogs.map(l => l.value.duration));
  }, [sleepLogs]);

  const worstNight = useMemo(() => {
    if (sleepLogs.length === 0) return 0;
    return Math.min(...sleepLogs.map(l => l.value.duration));
  }, [sleepLogs]);

  const sleepDebt = useMemo(() => {
    if (sleepLogs.length === 0) return 0;
    const debt = sleepLogs.reduce((acc, curr) => acc + (8 - curr.value.duration), 0);
    return Math.max(0, Math.round(debt * 10) / 10);
  }, [sleepLogs]);

  const handleLog = () => {
    logSleep(duration, quality);
    showToast(
      navigator.onLine 
        ? `Logged sleep duration of ${duration} hours successfully!`
        : `Logged sleep locally. Will sync online soon!`,
      'success'
    );
  };

  const getScoreRating = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-indigo-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up-staggered relative">
      {/* Background atmospheric blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-500/20 via-primary/10 to-transparent p-6 rounded-2xl border border-indigo-500/20 flex items-center justify-between shadow-lg shadow-indigo-950/20 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-cyan-500"></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground drop-shadow-sm">Sleep Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor, analyze, and optimize your sleep cycles for peak recovery.</p>
        </div>
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl animate-float border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          <Moon className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Sleep Logger Form (7 columns) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm glass flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
          {/* Corner overlay accents */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-indigo-500 rounded-tl-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-indigo-500 rounded-br-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

          <div className="space-y-6">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Log Sleep Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="sleepDate">Date</label>
                <input
                  id="sleepDate"
                  type="date"
                  className="w-full p-2.5 border border-border rounded-xl bg-background/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 outline-none text-xs font-semibold transition-all input-accent-glow"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>

              {/* Bedtime Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="bedtime">Bedtime</label>
                <input
                  id="bedtime"
                  type="time"
                  className="w-full p-2.5 border border-border rounded-xl bg-background/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 outline-none text-xs font-semibold transition-all input-accent-glow"
                  value={bedtime}
                  onChange={e => setBedtime(e.target.value)}
                />
              </div>

              {/* Wake Time Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="waketime">Wake Time</label>
                <input
                  id="waketime"
                  type="time"
                  className="w-full p-2.5 border border-border rounded-xl bg-background/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 outline-none text-xs font-semibold transition-all input-accent-glow"
                  value={waketime}
                  onChange={e => setWaketime(e.target.value)}
                />
              </div>
            </div>

            {/* Calculated Duration View */}
            <div className="p-5 bg-gradient-to-br from-indigo-500/10 via-background/40 to-cyan-500/5 border border-indigo-500/20 rounded-xl text-center space-y-3 shadow-inner">
              <span className="text-4xl font-extrabold font-number text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                {formatNumber(duration)}h
              </span>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Sleep Duration</p>
              
              {/* Target progress bar */}
              <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden mt-2 border border-border/20">
                <div 
                  className={`h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)] ${
                    duration >= 7 && duration <= 9 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : duration >= 6 || duration === 10 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-destructive to-rose-500'
                  }`}
                  style={{ width: `${Math.min((duration / 12) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">Target: 7-9 hours</p>
            </div>

            {/* Sleep Quality Selector Grid */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Sleep Quality</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { val: 1, label: 'Insomnia', emoji: '😣' },
                  { val: 2, label: 'Restless', emoji: '🥱' },
                  { val: 3, label: 'Light Sleep', emoji: '💤' },
                  { val: 5, label: 'Deep Sleep', emoji: '😴' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setQuality(item.val)}
                    className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all text-xs touch-target hover:scale-[1.03] active:scale-[0.97] btn-elastic ${
                      quality === item.val
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 font-bold shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                        : 'border-border bg-background/20 hover:bg-muted/30 hover:border-indigo-500/20 text-muted-foreground'
                    }`}
                  >
                    <span className="text-2xl drop-shadow-sm">{item.emoji}</span>
                    <span className="tracking-wide">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-3 pt-6 border-t border-border">
            <button
              onClick={handleLog}
              className="w-full bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-500 hover:to-primary/95 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] touch-target btn-elastic btn-pulse-glow"
              style={{ '--btn-glow-color': '99, 102, 241' } as React.CSSProperties}
            >
              <span>Submit Log</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Radial Score & Metrics Dashboard (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Radial Score Gauge Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
            {/* Corner overlay accents */}
            <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-tr-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-indigo-500 rounded-bl-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

            {/* Star Particles Behind Gauge */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
              <Star className="absolute w-3 h-3 text-indigo-300/40 animate-star-pulse" style={{ top: '15%', left: '25%', animationDelay: '0.2s' }} />
              <Star className="absolute w-2 h-2 text-indigo-300/30 animate-star-pulse" style={{ top: '30%', right: '20%', animationDelay: '1.2s' }} />
              <Star className="absolute w-3 h-3 text-cyan-300/40 animate-star-pulse" style={{ bottom: '20%', left: '20%', animationDelay: '0.8s' }} />
              <Star className="absolute w-2 h-2 text-indigo-300/30 animate-star-pulse" style={{ bottom: '15%', right: '25%', animationDelay: '1.6s' }} />
            </div>

            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-4 z-10">
              <Star className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="tracking-wide">Sleep Score</span>
            </h3>

            <div className="relative w-36 h-36 flex items-center justify-center animate-float-slow z-10">
              <svg className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id="sleepGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="sleepGlowOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                {/* Background Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  className="stroke-muted/10 dark:stroke-muted/20"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Outer Glow Ring (Dual Stroke) */}
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke="url(#sleepGlowOuter)"
                  className="transition-all duration-1000 ease-out"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={402}
                  strokeDashoffset={402 - (402 * sleepScore) / 100}
                  strokeLinecap="round"
                  opacity="0.8"
                />
                {/* Main Progress Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="url(#sleepGlow)"
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={352}
                  strokeDashoffset={352 - (352 * sleepScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold font-number text-foreground drop-shadow-md">
                  {sleepScore}
                </span>
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">/100</span>
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground mt-4 z-10">
              Rating: <span className={`font-extrabold ${getScoreTextColor(sleepScore)}`}>{getScoreRating(sleepScore)}</span>
            </p>
          </div>

          {/* Metrics Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Avg Sleep */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm glass flex flex-col justify-between min-h-[95px] relative overflow-hidden group/card hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/40 group-hover/card:bg-indigo-500 transition-colors"></div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Avg Sleep</span>
              <span className="text-2xl font-extrabold font-number text-indigo-400 mt-2 drop-shadow-sm">
                {formatNumber(avgSleep)}h
              </span>
            </div>

            {/* Best Night */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm glass flex flex-col justify-between min-h-[95px] relative overflow-hidden group/card hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/40 group-hover/card:bg-cyan-500 transition-colors"></div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Best Night</span>
              <span className="text-2xl font-extrabold font-number text-cyan-400 mt-2 drop-shadow-sm">
                {bestNight > 0 ? `${formatNumber(bestNight)}h` : '--'}
              </span>
            </div>

            {/* Worst Night */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm glass flex flex-col justify-between min-h-[95px] relative overflow-hidden group/card hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/40 group-hover/card:bg-indigo-500 transition-colors"></div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Worst Night</span>
              <span className="text-2xl font-extrabold font-number text-indigo-400/80 mt-2 drop-shadow-sm">
                {worstNight > 0 ? `${formatNumber(worstNight)}h` : '--'}
              </span>
            </div>

            {/* Sleep Debt */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm glass flex flex-col justify-between min-h-[95px] relative overflow-hidden group/card hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-destructive/40 group-hover/card:bg-destructive transition-colors"></div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Sleep Debt</span>
              <span className="text-2xl font-extrabold font-number text-rose-400 mt-2 drop-shadow-sm">
                {sleepLogs.length > 0 ? `${formatNumber(sleepDebt)}h` : '--'}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Guidelines Banner */}
      <div className="p-5 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 border border-indigo-500/10 rounded-2xl flex gap-3 text-xs leading-relaxed text-muted-foreground relative overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-transparent"></div>
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1 tracking-wide">Healthy Sleep Habits:</span>
          Adolescents need 8-10 hours, and adults need 7-9 hours of restful sleep daily. Chronic sleep deprivation increases the risk of hypertension, cardiovascular disorders, obesity, and depressive indices. Keep a regular sleep schedule, avoid screens before bed, and restrict tea/coffee in late hours.
        </div>
      </div>

    </div>
  );
};

export default SleepTracker;
