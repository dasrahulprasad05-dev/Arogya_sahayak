import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  LayoutGroup,
} from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import {
  Info, Flame, Clock, Trophy, Play, Pause, RotateCcw, X,
  Search, Sparkles, Check, CheckCircle, Activity, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { showToast } from '../../utils/toast';
import { exercisesDatabase, type Exercise } from './exercisesData';

/* ---------- Motion Variants ---------- */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalPanel = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  exit: { opacity: 0, scale: 0.92, y: 30, transition: { duration: 0.2 } },
};

/* ---------- Animated Counter ---------- */
const AnimatedNumber: React.FC<{ value: number; format: (n: number) => string }> = ({ value, format }) => {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplay(format(Math.round(v))));
    return () => unsub();
  }, [spring, format]);

  return <span>{display}</span>;
};

/* ---------- Tilt Card wrapper (3D hover) ---------- */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ExercisePage: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const { logs } = useHealthRead();
  const { logExercise } = useHealthDispatch();

  const [activeTab, setActiveTab] = useState<'All' | 'Yoga' | 'Cardio' | 'Strength' | 'Breathing' | 'Stretching'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [stepDir, setStepDir] = useState(1);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ text: string; exercises: Exercise[] } | null>(null);

  const lastStress = useMemo(() => logs.find(l => l.type === 'stress'), [logs]);
  const lastMood = useMemo(() => logs.find(l => l.type === 'mood'), [logs]);
  const stressScore = lastStress ? Number(lastStress.value.score || 0) : 15;
  const moodState = lastMood ? String(lastMood.value.mood || '') : 'calm';
  const isHighStressOrLowMood = stressScore > 26 || ['anxious', 'angry', 'sad'].includes(moodState);

  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();
    let workoutsToday = 0, minutesToday = 0, caloriesToday = 0;
    logs.forEach(log => {
      if (log.type === 'exercise' && new Date(log.created_at).toDateString() === todayStr) {
        workoutsToday += 1;
        const duration = Number(log.value.duration || 0);
        minutesToday += duration;
        const matched = exercisesDatabase.find(ex => ex.name.toLowerCase() === String(log.value.routine || '').toLowerCase());
        caloriesToday += matched ? matched.calories : duration * 7;
      }
    });
    return { workoutsToday, minutesToday, caloriesToday };
  }, [logs]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) { setIsTimerRunning(false); showToast('Workout time completed! Good job!', 'success'); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning, timerSeconds]);

  const handleStartExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setTimerSeconds(exercise.duration * 60);
    setIsTimerRunning(true);
    setActiveStepIdx(0);
    showToast(`Started exercise: ${exercise.name}`, 'info');
  };

  const handleCloseWorkout = () => { setActiveExercise(null); setIsTimerRunning(false); };

  const handleLogWorkout = () => {
    if (!activeExercise) return;
    logExercise({ routine: activeExercise.name, duration: activeExercise.duration });
    showToast(navigator.onLine
      ? `Logged workout: ${activeExercise.name} (${activeExercise.duration} mins) successfully!`
      : `Logged workout locally. Will sync online soon!`, 'success');
    setActiveExercise(null);
    setIsTimerRunning(false);
  };

  const filteredExercises = useMemo(() => {
    return exercisesDatabase.filter(ex => {
      let matchesCategory = true;
      if (activeTab !== 'All') {
        const catMap: Record<string, string> = { Yoga: 'yoga', Cardio: 'cardio', Strength: 'strength', Breathing: 'breathing', Stretching: 'stretch' };
        matchesCategory = ex.category === catMap[activeTab];
      }
      const q = searchQuery.toLowerCase();
      const matchesSearch = ex.name.toLowerCase().includes(q) || ex.difficulty.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleAskAi = () => {
    if (!aiInput.trim()) { showToast('Please describe your problem or goal first!', 'warning'); return; }
    setIsAiLoading(true);
    setAiResult(null);
    setTimeout(() => {
      const input = aiInput.toLowerCase();
      let ids: string[] = [], explanation = '';
      if (/(back|spine|sciatica|posture)/.test(input)) { ids = ['st2', 'st5', 'st11']; explanation = 'We recommend gentle stretching and decompression exercises to mobilize the spine, relieve intervertebral pressure, and stretch tight lower back muscles.'; }
      else if (/(neck|shoulder|headache|sitting)/.test(input)) { ids = ['st1', 'st9', 'st12']; explanation = 'Long sitting causes forward head posture. These stretches open your thoracic chest wall and relax tense upper trapezius muscles.'; }
      else if (/(knee|leg|calf|hamstring|foot)/.test(input)) { ids = ['st6', 'st13', 's1']; explanation = 'To alleviate lower limb stiffness, stretch the posterior chain while gently strengthening ankles and calves to support your joints.'; }
      else if (/(stress|anxiety|calm|mind|relax|sleep|head)/.test(input)) { ids = ['b1', 'y17', 'b2']; explanation = 'Box breathing and restorative poses activate your parasympathetic vagus nerve, lowering blood pressure and centering your mind.'; }
      else if (/(weight|fat|burn|cardio|sweat|stamina|lose)/.test(input)) { ids = ['c2', 'c8', 'c14']; explanation = 'High-intensity intervals elevate your heart rate rapidly, inducing a strong post-exercise oxygen consumption (EPOC) effect.'; }
      else if (/(strength|muscle|abs|chest|core|pushup|power)/.test(input)) { ids = ['s10', 's8', 's9']; explanation = 'Squats engage the lower body, push-ups build upper-limb stability, and planks solidify core structure.'; }
      else if (/(flexibility|stiff|stretch)/.test(input)) { ids = ['st3', 'st8', 'st17']; explanation = 'Static holds release tight hip flexors, while forward folds elongate back and hamstring fibers.'; }
      else { ids = ['y6', 'c10', 's2']; explanation = 'A balanced circuit: Tree Pose for focus, Jumping Jacks to warm up, and a Wall Sit for lower-body strength.'; }
      setAiResult({ text: explanation, exercises: exercisesDatabase.filter(ex => ids.includes(ex.id)) });
      setIsAiLoading(false);
      showToast('AI Recommendations generated!', 'success');
    }, 1500);
  };

  const getCategoryStyles = (category: string) => {
    const map: Record<string, any> = {
      yoga: { grad: 'from-purple-500 to-fuchsia-500', ring: 'rgba(168,85,247', badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-300', text: 'text-purple-500' },
      cardio: { grad: 'from-orange-500 to-red-500', ring: 'rgba(249,115,22', badge: 'bg-orange-500/15 text-orange-600 dark:text-orange-300', text: 'text-orange-500' },
      strength: { grad: 'from-cyan-500 to-blue-500', ring: 'rgba(6,182,212', badge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300', text: 'text-cyan-500' },
      stretch: { grad: 'from-emerald-500 to-teal-500', ring: 'rgba(16,185,129', badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300', text: 'text-emerald-500' },
      breathing: { grad: 'from-pink-500 to-rose-500', ring: 'rgba(236,72,153', badge: 'bg-pink-500/15 text-pink-600 dark:text-pink-300', text: 'text-pink-500' },
    };
    return map[category] || map.strength;
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

  const statCards = [
    { icon: Flame, label: 'Calories today', value: stats.caloriesToday, grad: 'from-orange-500 to-red-500', ring: 'rgba(249,115,22' },
    { icon: Clock, label: 'Minutes today', value: stats.minutesToday, grad: 'from-cyan-500 to-blue-500', ring: 'rgba(6,182,212' },
    { icon: Trophy, label: 'Workouts today', value: stats.workoutsToday, grad: 'from-emerald-500 to-teal-500', ring: 'rgba(16,185,129' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto relative pb-10"
    >
      {/* Ambient animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 -left-20 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-3xl"
        />
      </div>

      {/* HEADER */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: 12, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="p-3.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl text-white shadow-lg shadow-orange-500/30"
        >
          <Activity className="w-6 h-6" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">
            {t('tracker.exercise.title') || 'Exercise Recommendations'}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Stay active, stay healthy.</p>
        </div>
      </motion.div>

      {/* STATISTICS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((c) => (
          <TiltCard key={c.label} className="group">
            <div
              className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-5 flex items-center gap-4 overflow-hidden transition-shadow duration-300"
              style={{ boxShadow: `0 8px 30px -12px ${c.ring},0.25)` }}
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${c.grad} opacity-10 blur-xl group-hover:opacity-25 transition-opacity`} />
              <motion.div
                whileHover={{ scale: 1.1, rotate: -6 }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br ${c.grad} text-white shadow-md`}
              >
                <c.icon className="w-6 h-6" />
              </motion.div>
              <div className="relative z-10">
                <div className="text-3xl font-extrabold font-number text-foreground tracking-tight">
                  <AnimatedNumber value={c.value} format={formatNumber} />
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{c.label}</span>
              </div>
            </div>
          </TiltCard>
        ))}
      </motion.div>

      {/* DYNAMIC RECOMMENDATION ALERT */}
      <motion.div
        variants={itemVariants}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        className={`relative p-5 border rounded-2xl flex items-start gap-4 backdrop-blur-xl overflow-hidden ${
          isHighStressOrLowMood
            ? 'bg-purple-500/5 border-purple-500/20 text-purple-700 dark:text-purple-300'
            : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        }`}
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="p-2.5 bg-background/80 rounded-xl border border-border/40 shrink-0"
        >
          <Sparkles className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <span className="font-extrabold text-sm block mb-1">
            {isHighStressOrLowMood ? '🧘 Dynamic recommendation: Soothing & Restorative' : "⚡ Today's Recommendation"}
          </span>
          <p className="text-xs opacity-90 leading-relaxed font-semibold">
            {isHighStressOrLowMood
              ? `Your stress markers are elevated (${formatNumber(stressScore)}/40) or mood feels low. We recommend gentle Breathing exercises or stretching to reduce sympathetic system tone.`
              : "You're doing well! Try some general fitness, active cardio, or lower limb strength workouts today."}
          </p>
        </div>
      </motion.div>

      {/* AI RECOMMENDER */}
      <motion.div variants={itemVariants} className="relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/30">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </motion.div>
            <h3 className="font-heading font-extrabold text-lg text-foreground">AI Exercise Recommender</h3>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Describe any discomfort, stiffness, energy level, or goal, and the AI will build an optimized session.
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <textarea
              className="flex-1 p-3 text-xs rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium resize-none h-20"
              placeholder="e.g. My lower back is stiff from sitting all day, what stretches do you recommend?"
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAskAi}
              disabled={isAiLoading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-fuchsia-500 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 h-12 md:h-auto shrink-0 shadow-lg shadow-indigo-500/25"
            >
              {isAiLoading ? (
                <>
                  <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  <span>Analyzing...</span>
                </>
              ) : (
                <><Sparkles className="w-4 h-4" /><span>Analyze &amp; Recommend</span></>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-4 overflow-hidden"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0 mt-0.5"><Sparkles className="w-4 h-4" /></div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground">AI Companion Assessment:</span>
                    <p className="text-xs leading-relaxed text-muted-foreground font-medium">{aiResult.text}</p>
                  </div>
                </div>
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {aiResult.exercises.map(ex => {
                    const s = getCategoryStyles(ex.category);
                    return (
                      <motion.div key={ex.id} variants={itemVariants} whileHover={{ y: -4 }} className="bg-card border border-border/50 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.grad}`} />
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-2xl">{ex.emoji}</span>
                            <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded ${s.badge}`}>{ex.category}</span>
                          </div>
                          <h4 className="font-bold text-xs text-foreground leading-snug">{ex.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                            <span className="bg-muted px-1.5 py-0.5 rounded">{ex.difficulty}</span><span>•</span><span>{ex.duration} min</span>
                          </div>
                        </div>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStartExercise(ex)} className={`w-full mt-4 bg-gradient-to-r ${s.grad} text-white font-bold py-2 rounded-lg text-[10px] flex items-center justify-center gap-1`}>
                          <Play className="w-3.5 h-3.5 fill-current" /><span>Start Exercise</span>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* FILTERS & SEARCH */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <LayoutGroup>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none">
              {(['All', 'Yoga', 'Cardio', 'Strength', 'Breathing', 'Stretching'] as const).map(tab => {
                const isActive = activeTab === tab;
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`relative px-4 py-2 text-xs font-bold rounded-full transition-colors shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {isActive && (
                      <motion.span layoutId="activePill" className="absolute inset-0 bg-primary rounded-full shadow-md" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
          <div className="relative w-full sm:max-w-xs shrink-0">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search exercise..." className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* EXERCISES GRID */}
        <motion.div layout variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredExercises.map(ex => {
              const s = getCategoryStyles(ex.category);
              return (
                <motion.div key={ex.id} layout variants={itemVariants} initial="hidden" animate="show" exit="exit" whileHover={{ y: -6 }} className="group">
                  <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-5 flex flex-col justify-between overflow-hidden h-full transition-shadow duration-300 group-hover:shadow-[0_12px_40px_-12px] "
                    style={{ ['--tw-shadow-color' as any]: `${s.ring},0.4)` }}>
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.grad} opacity-70 group-hover:opacity-100 transition-opacity`} />
                    <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${s.grad} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`} />
                    <div>
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div whileHover={{ scale: 1.15, rotate: 8 }} className="w-12 h-12 bg-muted/60 dark:bg-muted/30 border border-border/40 rounded-xl flex items-center justify-center text-2xl shrink-0">
                            {ex.emoji}
                          </motion.div>
                          <div>
                            <h3 className="font-heading font-extrabold text-sm text-foreground leading-snug">{ex.name}</h3>
                            <div className="flex gap-1.5 mt-1 flex-wrap">
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${s.badge}`}>{ex.category === 'stretch' ? 'Stretch' : ex.category}</span>
                              <span className="text-[9px] bg-muted/80 text-muted-foreground font-extrabold px-1.5 py-0.5 rounded uppercase">{ex.difficulty}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 py-2.5 border-t border-b border-border/40 my-4 text-xs font-semibold text-muted-foreground font-number">
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-cyan-500" /><span>{ex.duration} min</span></div>
                        <div className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500" /><span>{ex.calories} cal</span></div>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => handleStartExercise(ex)} className={`w-full bg-gradient-to-r ${s.grad} text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md`}>
                      <Play className="w-4 h-4 fill-current" /><span>Start Exercise</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredExercises.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/20">
            <p className="text-sm text-muted-foreground font-semibold">No exercises match your filters. Try search terms or check category pills!</p>
          </motion.div>
        )}
      </motion.div>

      {/* INFO BAR */}
      <motion.div variants={itemVariants} className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Cardiorespiratory &amp; Autonomic Benefits:</span>
          Regular exercise lowers resting heart rate, improves insulin sensitivity, and regulates blood pressure. Matching exercises to your psychological metrics avoids sympathetic overload, protecting the HPA axis from chronic burnout.
        </div>
      </motion.div>

      {/* WORKOUT MODAL */}
      <AnimatePresence>
        {activeExercise && (
          <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="exit" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div variants={modalPanel} className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col justify-between">
              <motion.button whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleCloseWorkout} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground z-10">
                <X className="w-5 h-5" />
              </motion.button>

              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0">{activeExercise.emoji}</div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-foreground">{activeExercise.name}</h3>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Category: {activeExercise.category} • {activeExercise.difficulty}</span>
                  </div>
                </div>

                {/* TIMER */}
                <div className="flex flex-col items-center justify-center p-4 border border-border/30 bg-muted/20 rounded-2xl gap-3">
                  {(() => {
                    const totalSecs = activeExercise.duration * 60;
                    const ratio = totalSecs > 0 ? timerSeconds / totalSecs : 0;
                    const radius = 50, circumference = 2 * Math.PI * radius;
                    const offset = circumference - ratio * circumference;
                    return (
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="5" className="text-muted/10 dark:text-muted/20" fill="none" />
                          <motion.circle cx="64" cy="64" r={radius} stroke="hsl(var(--primary))" strokeWidth="5" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" animate={{ strokeDashoffset: offset }} transition={{ ease: 'linear' }} />
                        </svg>
                        <motion.div key={isTimerRunning ? 'run' : 'stop'} className="absolute flex flex-col items-center">
                          <motion.span animate={isTimerRunning ? { scale: [1, 1.04, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} className="text-2xl font-extrabold font-number text-foreground tracking-tight">
                            {formatTime(timerSeconds)}
                          </motion.span>
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">Remaining</span>
                        </motion.div>
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-3">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsTimerRunning(!isTimerRunning)} className="p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/30">
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1, rotate: -30 }} whileTap={{ scale: 0.9 }} onClick={() => { setIsTimerRunning(false); setTimerSeconds(activeExercise.duration * 60); showToast('Timer reset', 'info'); }} className="p-3 bg-card border border-border text-muted-foreground hover:text-foreground rounded-full">
                      <RotateCcw className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* STEPS */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-foreground block">Instruction Guide ({activeStepIdx + 1}/{activeExercise.steps.length}):</span>
                  <div className="relative p-4 border border-primary/20 bg-primary/5 rounded-xl min-h-[90px] overflow-hidden">
                    <AnimatePresence mode="wait" custom={stepDir}>
                      <motion.div key={activeStepIdx} custom={stepDir} initial={{ opacity: 0, x: stepDir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: stepDir * -40 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="flex items-start gap-3">
                        <div className="p-1 bg-primary text-white rounded-full mt-0.5 shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>
                        <p className="text-xs text-foreground font-medium leading-relaxed">{activeExercise.steps[activeStepIdx]}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <motion.button whileTap={{ scale: 0.94 }} disabled={activeStepIdx === 0} onClick={() => { setStepDir(-1); setActiveStepIdx(p => p - 1); }} className="px-3.5 py-1.5 text-[10px] font-bold border border-border rounded-lg bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Prev
                    </motion.button>
                    <div className="flex gap-1">
                      {activeExercise.steps.map((_, i) => (
                        <motion.div key={i} animate={{ width: i === activeStepIdx ? 16 : 6, backgroundColor: i === activeStepIdx ? 'hsl(var(--primary))' : 'rgba(148,163,184,0.35)' }} className="h-1.5 rounded-full" />
                      ))}
                    </div>
                    <motion.button whileTap={{ scale: 0.94 }} disabled={activeStepIdx === activeExercise.steps.length - 1} onClick={() => { setStepDir(1); setActiveStepIdx(p => p + 1); }} className="px-3.5 py-1.5 text-[10px] font-bold border border-border rounded-lg bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-1">
                      Next <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* LOG BUTTON */}
              <div className="pt-4 border-t border-border/40 mt-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleLogWorkout} className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25">
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete &amp; Log Workout ({activeExercise.calories} cal)</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExercisePage;
