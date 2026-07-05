import React, { useState, useEffect, useRef, Suspense, lazy, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useHealthRead } from '../context/HealthReadContext';
import { useHealthDispatch } from '../context/HealthDispatchContext';
import PageShell from '../components/ui/PageShell';
import SectionHeader from '../components/ui/SectionHeader';
import FeatureCard from '../components/ui/FeatureCard';
import GlassCard from '../components/ui/GlassCard';
import HealthGauge from '../components/ui/HealthGauge';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import { staggerContainer, fadeUp } from '../components/ui/motion';
import {
  Droplet, Moon, Smile, Brain, BrainCircuit, Plus, Zap,
  HeartPulse, Activity, Microscope,
} from 'lucide-react';

const TipWidget = lazy(() => import('./dashboard/TipWidget'));
const RecentTimelineWidget = lazy(() => import('./dashboard/RecentTimelineWidget'));

/* ─────────────────────── Config Data ─────────────────────── */
const QUICK_TOOLS = [
  { id: 'diabetes', title: 'Diabetes Predictor', desc: 'Assess glycemic risk using HbA1c, glucose, and symptoms.', path: '/predictors/diabetes', icon: Droplet, rgb: '6, 182, 212', textClass: 'text-cyan-500 dark:text-cyan-400' },
  { id: 'heart', title: 'Heart Attack Predictor', desc: 'Cardiovascular checkups via vitals and chest-pain logs.', path: '/predictors/heart-attack', icon: HeartPulse, rgb: '239, 68, 68', textClass: 'text-red-500 dark:text-red-400' },
  { id: 'ecg', title: 'ECG Analysis', desc: 'Identify cardiac anomalies and QT interval issues.', path: '/predictors/ecg', icon: Activity, rgb: '139, 92, 246', textClass: 'text-violet-500 dark:text-violet-400' },
  { id: 'cancer', title: 'Cancer Screening', desc: 'Verify early warning flags and risk assessments.', path: '/predictors/cancer', icon: Microscope, rgb: '16, 185, 129', textClass: 'text-emerald-500 dark:text-emerald-400' },
] as const;

const MOODS = [
  { label: 'Awful', emoji: '😢' },
  { label: 'Low', emoji: '😕' },
  { label: 'Okay', emoji: '😐' },
  { label: 'Good', emoji: '🙂' },
  { label: 'Great', emoji: '😀' },
] as const;

const FEELINGS = ['Energetic', 'Good', 'Tired', 'Unwell'] as const;

/* ─────────────────────── Small internals ─────────────────────── */
const SuccessFlash: React.FC<{ show: boolean; text: string }> = ({ show, text }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mt-3 p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold text-center rounded-md"
      >
        ✓ {text}
      </motion.div>
    )}
  </AnimatePresence>
);

interface StatCardDef {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  rgb: string;
  colorClass: string;
  path: string;
  value: React.ReactNode;
  hint: string;
}

/* ─────────────────────── Page ─────────────────────── */
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, formatNumber } = useLanguage();
  const { healthScore, todaySnapshot, logs } = useHealthRead();
  const { logWater, logMood, logVitals, logSleep } = useHealthDispatch();
  const navigate = useNavigate();

  const [showBelowFold, setShowBelowFold] = useState(false);
  const foldRef = useRef<HTMLDivElement>(null);

  // single success flash state instead of 4 booleans
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout>>();

  const triggerFlash = useCallback((key: string) => {
    setFlash(key);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1500);
  }, []);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const [sleepHrs, setSleepHrs] = useState('8');

  /* derived metrics */
  const avgSleepVal = useMemo(() => {
    const s = logs.filter(l => l.type === 'sleep');
    return s.length ? Math.round((s.reduce((a, c) => a + c.value.duration, 0) / s.length) * 10) / 10 : 0;
  }, [logs]);

  const lastStressLog = useMemo(() => logs.find(l => l.type === 'stress'), [logs]);
  const stressScoreVal = lastStressLog?.value.score ?? 0;
  const stressCategory = lastStressLog
    ? stressScoreVal < 14 ? 'Low' : stressScoreVal <= 26 ? 'Moderate' : 'High'
    : '--';

  const waterVal = (todaySnapshot.water * 250) / 1000;

  /* handlers */
  const handleQuickWater = (glasses: number) => { logWater(glasses); triggerFlash('water'); };
  const handleQuickMood = (mood: string) => { logMood(mood); triggerFlash('mood'); };
  const handleQuickVitals = (feeling: typeof FEELINGS[number]) => {
    logVitals({
      systolic: 120,
      diastolic: 80,
      heartRate: feeling === 'Energetic' ? 76 : feeling === 'Good' ? 72 : feeling === 'Tired' ? 68 : 85,
      spO2: feeling === 'Unwell' ? 96 : 98,
      weight: feeling === 'Energetic' ? 70 : undefined,
    });
    triggerFlash('vitals');
  };

  const handleQuickSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = parseFloat(sleepHrs);
    if (!isNaN(hrs) && hrs > 0 && hrs <= 24) {
      logSleep(hrs, 3);
      triggerFlash('sleep');
    }
  };

  /* lazy below-fold */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) { setShowBelowFold(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    if (foldRef.current) observer.observe(foldRef.current);
    return () => observer.disconnect();
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  }, []);

  /* stat cards config */
  const statCards: StatCardDef[] = [
    {
      key: 'sleep', label: 'Sleep Avg', icon: Moon, rgb: '99, 102, 241',
      colorClass: 'text-indigo-500 dark:text-indigo-400', path: '/trackers/sleep',
      value: avgSleepVal > 0 ? <AnimatedNumber value={avgSleepVal} decimals={1} suffix="h" /> : '--',
      hint: 'Recommended: 7-9h',
    },
    {
      key: 'stress', label: 'Stress', icon: Brain, rgb: '168, 85, 247',
      colorClass: 'text-purple-500 dark:text-purple-400', path: '/trackers/stress',
      value: lastStressLog ? <><AnimatedNumber value={stressScoreVal} />/40</> : '--',
      hint: lastStressLog ? `${stressCategory} Index` : 'PSS-10 Index',
    },
    {
      key: 'mood', label: 'Mood', icon: Smile, rgb: '244, 63, 94',
      colorClass: 'text-rose-500 dark:text-rose-400', path: '/trackers/mood',
      value: todaySnapshot.mood || '--',
      hint: "Today's feeling",
    },
    {
      key: 'water', label: 'Water', icon: Droplet, rgb: '6, 182, 212',
      colorClass: 'text-cyan-500 dark:text-cyan-400', path: '/trackers/water',
      value: <AnimatedNumber value={waterVal} decimals={2} suffix="L" />,
      hint: `Goal: 2.0L (${formatNumber(8)} gl)`,
    },
  ];

  return (
    <PageShell
      title={<>{greeting}, {userName} 👋</>}
      subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      gradient="from-cyan-500 to-purple-600"
    >
      {/* 1 ── Gauge + Stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Health Score */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          className="lg:col-span-4 feature-card rounded-2xl p-6 flex flex-col items-center justify-center text-center"
          style={{ '--card-accent-rgb': '139, 92, 246' } as React.CSSProperties}
        >
          <div className="animate-float-slow">
            <HealthGauge score={healthScore} />
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium max-w-[220px] leading-relaxed">
            {t('dash.score_desc')}
          </p>
        </motion.div>

        {/* 4 Stat cards */}
        <motion.div
          variants={staggerContainer} initial="hidden" animate="show"
          className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {statCards.map(card => {
            const Icon = card.icon;
            return (
              <GlassCard key={card.key} rgb={card.rgb} onClick={() => navigate(card.path)}
                className="p-5 flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className={`p-2.5 rounded-xl ${card.colorClass}`}
                    style={{ backgroundColor: `rgba(${card.rgb}, .18)` }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${card.colorClass}`}>
                    {card.label}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-extrabold font-number text-foreground block truncate">
                    {card.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">{card.hint}</span>
                </div>
              </GlassCard>
            );
          })}
        </motion.div>
      </div>

      {/* 2 ── Quick Trackers */}
      <div className="space-y-4">
        <SectionHeader icon={Zap} title="Quick Trackers" />
        <motion.div
          variants={staggerContainer} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* Log Sleep */}
          <GlassCard rgb="99, 102, 241" hoverLift={false} className="p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2">
                <Moon className="w-4 h-4 text-indigo-500" /> Log Sleep
              </h3>
              <p className="text-[11px] text-muted-foreground mb-4">Record last night's sleep hours.</p>
              <form onSubmit={handleQuickSleep} className="flex gap-2 items-center">
                <input
                  type="number" min="1" max="24" step="0.5" value={sleepHrs}
                  onChange={e => setSleepHrs(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background/50 focus:border-primary outline-none text-xs font-mono font-bold"
                />
                <motion.button whileTap={{ scale: 0.92 }} type="submit"
                  className="bg-primary hover:bg-primary/90 text-white font-bold p-2 px-3 rounded-lg text-xs shrink-0 touch-target">
                  Log
                </motion.button>
              </form>
            </div>
            <SuccessFlash show={flash === 'sleep'} text="Sleep Logged!" />
          </GlassCard>

          {/* Quick Mood */}
          <GlassCard rgb="244, 63, 94" hoverLift={false} className="p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2">
                <Smile className="w-4 h-4 text-pink-500" /> Quick Mood
              </h3>
              <p className="text-[11px] text-muted-foreground mb-4">How are you feeling today?</p>
              <div className="flex justify-between gap-1">
                {MOODS.map(m => (
                  <motion.button key={m.label} title={m.label}
                    whileHover={{ scale: 1.3, y: -3 }} whileTap={{ scale: 0.85 }}
                    onClick={() => handleQuickMood(m.label)}
                    className="p-1.5 rounded-lg text-lg touch-target">
                    {m.emoji}
                  </motion.button>
                ))}
              </div>
            </div>
            <SuccessFlash show={flash === 'mood'} text="Mood Updated!" />
          </GlassCard>

          {/* Water */}
          <GlassCard rgb="6, 182, 212" hoverLift={false} className="p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-blue-500" />
                Water: {formatNumber(todaySnapshot.water * 250)}ml
              </h3>
              <p className="text-[11px] text-muted-foreground mb-4">Log hydration quantity directly.</p>
              <div className="grid grid-cols-2 gap-2">
                {[{ g: 1, ml: '250ml' }, { g: 2, ml: '500ml' }].map(o => (
                  <motion.button key={o.g} whileTap={{ scale: 0.94 }}
                    onClick={() => handleQuickWater(o.g)}
                    className="bg-muted hover:bg-muted/80 text-foreground font-bold p-2 rounded-lg text-xs flex items-center justify-center gap-1 touch-target border border-border transition-colors">
                    <Plus className="w-3.5 h-3.5" /> {o.ml}
                  </motion.button>
                ))}
              </div>
            </div>
            <SuccessFlash show={flash === 'water'} text="Water Logged!" />
          </GlassCard>

          {/* Morning Check-in */}
          <GlassCard rgb="16, 185, 129" hoverLift={false} className="p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-emerald-500" /> Morning Check-in
              </h3>
              <p className="text-[11px] text-muted-foreground mb-4">Record somatic feeling and vitals.</p>
              <div className="grid grid-cols-2 gap-2">
                {FEELINGS.map(f => (
                  <motion.button key={f} whileTap={{ scale: 0.94 }}
                    onClick={() => handleQuickVitals(f)}
                    className="bg-muted hover:bg-muted/80 text-foreground font-semibold p-1.5 rounded-lg text-[10px] border border-border touch-target hover:border-emerald-500/30 transition-colors">
                    {f}
                  </motion.button>
                ))}
              </div>
            </div>
            <SuccessFlash show={flash === 'vitals'} text="Logged Check-in!" />
          </GlassCard>
        </motion.div>
      </div>

      {/* 3 ── Medical Predictions */}
      <div className="space-y-4">
        <SectionHeader icon={BrainCircuit} title="Medical Predictions" />
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          {QUICK_TOOLS.map(tool => (
            <FeatureCard
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              desc={tool.desc}
              rgb={tool.rgb}
              textClass={tool.textClass}
              ctaLabel="Run predictor"
              onClick={() => navigate(tool.path)}
            />
          ))}
        </motion.div>
      </div>

      {/* 4 ── Below fold: Timeline & Suggestions */}
      <div ref={foldRef} className="pt-8 border-t border-border border-dashed space-y-4">
        <SectionHeader icon={Activity} title="Timeline & Suggestions" />
        {showBelowFold ? (
          <Suspense fallback={<BelowFoldSkeleton />}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2"><RecentTimelineWidget logs={logs} /></div>
              <div><TipWidget /></div>
            </motion.div>
          </Suspense>
        ) : (
          <div className="h-20 flex items-center justify-center text-muted-foreground text-xs font-semibold">
            Scroll down to view recent timeline and health suggestions...
          </div>
        )}
      </div>
    </PageShell>
  );
};

/* ─────────────────────── Skeleton ─────────────────────── */
const SkeletonCard: React.FC<{ rgb: string; className?: string }> = ({ rgb, className = '' }) => (
  <div className={`feature-card p-6 rounded-2xl min-h-[300px] flex flex-col justify-between relative overflow-hidden ${className}`}
    style={{ '--card-accent-rgb': rgb } as React.CSSProperties}>
    <div className="neon-shimmer-bg" />
    <div className="h-6 bg-muted/40 rounded-lg w-1/4 animate-pulse" />
    <div className="space-y-4 my-6">
      <div className="h-4 bg-muted/40 rounded-lg w-full animate-pulse" />
      <div className="h-4 bg-muted/40 rounded-lg w-5/6 animate-pulse" />
      <div className="h-4 bg-muted/40 rounded-lg w-2/3 animate-pulse" />
    </div>
    <div className="h-4 bg-muted/40 rounded-lg w-1/3 animate-pulse" />
  </div>
);

const BelowFoldSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-2"><SkeletonCard rgb="244, 63, 94" /></div>
    <div><SkeletonCard rgb="6, 182, 212" /></div>
  </div>
);

export default Dashboard;
