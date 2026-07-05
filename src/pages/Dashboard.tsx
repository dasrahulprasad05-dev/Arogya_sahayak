import React, { useState, useEffect, useRef, Suspense, lazy, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useHealthRead } from '../context/HealthReadContext';
import { useHealthDispatch } from '../context/HealthDispatchContext';
import { 
  Droplet, Moon, Smile, Brain, BrainCircuit, 
  Plus, Zap, HeartPulse, Activity, Microscope
} from 'lucide-react';
import PageShell from '../components/ui/PageShell';
import FeatureCard from '../components/ui/FeatureCard';
import SectionHeader from '../components/ui/SectionHeader';
import HealthGauge from '../components/ui/HealthGauge';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import { staggerContainer } from '../components/ui/motion';

const TipWidget = lazy(() => import('./dashboard/TipWidget'));
const RecentTimelineWidget = lazy(() => import('./dashboard/RecentTimelineWidget'));

const quickTools = [
  {
    id: 'diabetes',
    title: 'Diabetes Predictor',
    desc: 'Assess glycemic risk using HbA1c, glucose, and symptoms.',
    path: '/predictors/diabetes',
    icon: Droplet,
    rgb: '6, 182, 212',
    textClass: 'text-cyan-500 dark:text-cyan-400'
  },
  {
    id: 'heart',
    title: 'Heart Attack Predictor',
    desc: 'Cardiovascular checkups via vitals and chest-pain logs.',
    path: '/predictors/heart-attack',
    icon: HeartPulse,
    rgb: '239, 68, 68',
    textClass: 'text-red-500 dark:text-red-400'
  },
  {
    id: 'ecg',
    title: 'ECG Analysis',
    desc: 'Identify cardiac anomalies and QT interval issues.',
    path: '/predictors/ecg',
    icon: Activity,
    rgb: '139, 92, 246',
    textClass: 'text-violet-500 dark:text-violet-400'
  },
  {
    id: 'cancer',
    title: 'Cancer Screening',
    desc: 'Verify early warning flags and risk assessments.',
    path: '/predictors/cancer',
    icon: Microscope,
    rgb: '16, 185, 129',
    textClass: 'text-emerald-500 dark:text-emerald-400'
  }
];

const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate="show"
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {children}
  </motion.div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, formatNumber } = useLanguage();
  const { healthScore, todaySnapshot, logs } = useHealthRead();
  const { logWater, logMood, logVitals, logSleep } = useHealthDispatch();
  const navigate = useNavigate();

  const [showBelowFold, setShowBelowFold] = useState(false);
  const foldRef = useRef<HTMLDivElement>(null);

  const [successWater, setSuccessWater] = useState(false);
  const [successMood, setSuccessMood] = useState(false);
  const [successVitals, setSuccessVitals] = useState(false);
  const [successSleep, setSuccessSleep] = useState(false);
  const [sleepHrs, setSleepHrs] = useState<string>('8');

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

  const waterVal = todaySnapshot.water * 250 / 1000;

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
    if (foldRef.current) observer.observe(foldRef.current);
    return () => observer.disconnect();
  }, []);

  const handleQuickWater = (glasses: number) => { logWater(glasses); setSuccessWater(true); setTimeout(() => setSuccessWater(false), 1500); };
  const handleQuickMood = (mood: string) => { logMood(mood); setSuccessMood(true); setTimeout(() => setSuccessMood(false), 1500); };
  const handleQuickVitals = () => { logVitals({ systolic: 120, diastolic: 80, heartRate: 72, spO2: 98 }); setSuccessVitals(true); setTimeout(() => setSuccessVitals(false), 1500); };
  const handleQuickSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const hrsNum = parseFloat(sleepHrs);
    if (!isNaN(hrsNum) && hrsNum > 0 && hrsNum <= 24) { logSleep(hrsNum, 3); setSuccessSleep(true); setTimeout(() => setSuccessSleep(false), 1500); }
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <PageShell 
      title={
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl animate-pulse text-cyan-500 shrink-0">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight text-foreground">{getGreeting()}, {userName} 👋</span>
              <p className="text-slate-500 text-sm font-medium mt-0.5" style={{WebkitTextFillColor: 'initial'}}>
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      }
      gradient="from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-500"
    >

      {/* 1. Metrics & Circular Gauge Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm glass">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10"></div>
          <HealthGauge score={healthScore} label="Health Score" />
          <p className="text-xs text-muted-foreground mt-4 font-medium max-w-[220px] leading-relaxed">
            {t('dash.score_desc')}
          </p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <FeatureCard icon={Moon} title="Sleep Avg" desc="Recommended: 7-9h" rgb="99, 102, 241" textClass="text-indigo-500" onClick={() => navigate('/trackers/sleep')}>
            <div className="mt-2 text-2xl font-extrabold font-number text-foreground block">
              {avgSleepVal > 0 ? <AnimatedNumber value={avgSleepVal} decimals={1} suffix="h" /> : '--'}
            </div>
          </FeatureCard>

          <FeatureCard icon={Brain} title="Stress" desc={lastStressLog ? `${stressCategory} Index` : 'PSS-10 Index'} rgb="168, 85, 247" textClass="text-purple-500" onClick={() => navigate('/trackers/stress')}>
            <div className="mt-2 text-2xl font-extrabold font-number text-foreground block">
              {lastStressLog ? <><AnimatedNumber value={stressScoreVal} />/40</> : '--'}
            </div>
          </FeatureCard>

          <FeatureCard icon={Smile} title="Mood" desc="Today's feeling" rgb="244, 63, 94" textClass="text-rose-500" onClick={() => navigate('/trackers/mood')}>
            <div className="mt-2 text-2xl font-extrabold font-number text-foreground block truncate">
              {todaySnapshot.mood ? todaySnapshot.mood : '--'}
            </div>
          </FeatureCard>

          <FeatureCard icon={Droplet} title="Water" desc="Goal: 2.0L" rgb="6, 182, 212" textClass="text-cyan-500" onClick={() => navigate('/trackers/water')}>
            <div className="mt-2 text-2xl font-extrabold font-number text-foreground block">
              <AnimatedNumber value={waterVal} decimals={2} suffix="L" />
            </div>
          </FeatureCard>
        </div>
      </div>

      {/* 2. Direct Log Activity Cards */}
      <div className="space-y-4">
        <SectionHeader icon={Zap} title="Quick Trackers" />
        <Grid>
          <div className="feature-card p-5 shadow-sm flex flex-col justify-between rounded-2xl" style={{ '--card-accent-rgb': '99, 102, 241' } as any}>
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2"><Moon className="w-4.5 h-4.5 text-indigo-500" /><span>Log Sleep</span></h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">Record last night's sleep hours.</p>
              <form onSubmit={handleQuickSleep} className="flex gap-2 items-center relative z-10">
                <input type="number" min="1" max="24" step="0.5" className="w-full p-2 border border-border rounded-lg bg-background/50 focus:border-primary outline-none text-xs font-mono font-bold" value={sleepHrs} onChange={e => setSleepHrs(e.target.value)} />
                <button type="submit" className="bg-primary hover:bg-primary/95 text-white font-bold p-2 px-3 rounded-lg text-xs shrink-0 touch-target">Log</button>
              </form>
            </div>
            {successSleep && <div className="mt-3 p-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold text-center rounded-md animate-fade-in relative z-10">✓ Sleep Logged!</div>}
          </div>

          <div className="feature-card p-5 shadow-sm flex flex-col justify-between rounded-2xl" style={{ '--card-accent-rgb': '244, 63, 94' } as any}>
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2"><Smile className="w-4.5 h-4.5 text-rose-500" /><span>Quick Mood</span></h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">How are you feeling today?</p>
              <div className="flex justify-between gap-1 relative z-10">
                {[ { label: 'Awful', emoji: '😢' }, { label: 'Low', emoji: '😕' }, { label: 'Okay', emoji: '😐' }, { label: 'Good', emoji: '🙂' }, { label: 'Great', emoji: '😀' } ].map(item => (
                  <button key={item.label} onClick={() => handleQuickMood(item.label)} className="p-1.5 hover:bg-muted rounded-lg text-lg transition-transform hover:scale-125 touch-target" title={item.label}>{item.emoji}</button>
                ))}
              </div>
            </div>
            {successMood && <div className="mt-3 p-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold text-center rounded-md animate-fade-in relative z-10">✓ Mood Updated!</div>}
          </div>

          <div className="feature-card p-5 shadow-sm flex flex-col justify-between rounded-2xl" style={{ '--card-accent-rgb': '6, 182, 212' } as any}>
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2"><Droplet className="w-4.5 h-4.5 text-cyan-500" /><span>Water: {formatNumber(todaySnapshot.water * 250)}ml</span></h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">Log hydration quantity directly.</p>
              <div className="grid grid-cols-2 gap-2 relative z-10">
                <button onClick={() => handleQuickWater(1)} className="bg-muted hover:bg-muted/80 text-foreground font-bold p-2 rounded-lg text-xs flex items-center justify-center gap-1 touch-target border border-border"><Plus className="w-3.5 h-3.5" /><span>250ml</span></button>
                <button onClick={() => handleQuickWater(2)} className="bg-muted hover:bg-muted/80 text-foreground font-bold p-2 rounded-lg text-xs flex items-center justify-center gap-1 touch-target border border-border"><Plus className="w-3.5 h-3.5" /><span>500ml</span></button>
              </div>
            </div>
            {successWater && <div className="mt-3 p-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold text-center rounded-md animate-fade-in relative z-10">✓ Water Logged!</div>}
          </div>

          <div className="feature-card p-5 shadow-sm flex flex-col justify-between rounded-2xl" style={{ '--card-accent-rgb': '16, 185, 129' } as any}>
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 mb-2"><Zap className="w-4.5 h-4.5 text-emerald-500" /><span>Morning Check-in</span></h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">Record somatic feeling and vitals.</p>
              <div className="grid grid-cols-2 gap-2 relative z-10">
                {['Energetic', 'Good', 'Tired', 'Unwell'].map(label => (
                  <button key={label} onClick={() => handleQuickVitals(label)} className="bg-muted hover:bg-muted/80 text-foreground font-semibold p-1.5 rounded-lg text-[10px] text-center border border-border touch-target">{label}</button>
                ))}
              </div>
            </div>
            {successVitals && <div className="mt-3 p-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold text-center rounded-md animate-fade-in relative z-10">✓ Logged Check-in!</div>}
          </div>
        </Grid>
      </div>

      {/* 3. Medical Predictions Grid Section */}
      <div className="space-y-6">
        <SectionHeader icon={BrainCircuit} title="Medical Predictions" />
        <Grid>
          {quickTools.map(item => (
            <FeatureCard key={item.id} icon={item.icon} title={item.title} desc={item.desc} rgb={item.rgb} textClass={item.textClass} ctaLabel="Run predictor" onClick={() => navigate(item.path)} />
          ))}
        </Grid>
      </div>

      {/* 4. Below Fold Area */}
      <div ref={foldRef} className="pt-8 border-t border-border border-dashed space-y-6">
        <SectionHeader icon={Activity} title="Timeline & Suggestions" />
        {showBelowFold ? (
          <Suspense fallback={<div className="h-48 bg-muted rounded-2xl animate-pulse"></div>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2"><RecentTimelineWidget logs={logs} /></div>
              <div><TipWidget /></div>
            </div>
          </Suspense>
        ) : (
          <div className="h-20 flex items-center justify-center text-slate-400 text-xs font-semibold">
            Scroll down to view recent timeline and health suggestions...
          </div>
        )}
      </div>

    </PageShell>
  );
};

export default Dashboard;
