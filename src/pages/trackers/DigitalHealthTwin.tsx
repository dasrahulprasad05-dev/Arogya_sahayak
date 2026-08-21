import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHealthRead } from '../../context/HealthReadContext';
import {
  Heart,
  Brain,
  Wind,
  Droplet,
  Activity,
  ArrowLeft,
  ShieldCheck,
  TrendingDown,
  Sliders,
  RotateCcw,
  Settings2
} from 'lucide-react';

interface OrganStatus {
  id: string;
  name: string;
  score: number; // 0-100
  grade: 'Optimal' | 'Good' | 'Moderate' | 'At Risk';
  ageImpactYears: number; // impact on biological age
  clinicalTips: string;
}

const DigitalHealthTwin: React.FC = () => {
  const navigate = useNavigate();
  const { todaySnapshot } = useHealthRead();

  // Baseline User Inputs
  const [chronologicalAge, setChronologicalAge] = useState<number>(32);
  const [restingHr, setRestingHr] = useState<number>(72);
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [sleepHours, setSleepHours] = useState<number>(7.0);
  const [waterGlasses, setWaterGlasses] = useState<number>(todaySnapshot.water || 6);
  const [dailyExerciseMins, setDailyExerciseMins] = useState<number>(30);
  const [stressLevel, setStressLevel] = useState<number>(35); // 0-100
  const [showBaselineConfig, setShowBaselineConfig] = useState(false);

  // Interactive What-If simulation delta modifiers
  const [simSleepDelta, setSimSleepDelta] = useState<number>(0);
  const [simWaterDelta, setSimWaterDelta] = useState<number>(0);
  const [simExerciseDelta, setSimExerciseDelta] = useState<number>(0);
  const [simBpDelta, setSimBpDelta] = useState<number>(0);

  const [selectedOrgan, setSelectedOrgan] = useState<string>('heart');

  // Compute Biological Age
  const simulation = useMemo(() => {
    const effectiveSleep = Math.min(9, Math.max(4, sleepHours + simSleepDelta));
    const effectiveWater = Math.min(12, Math.max(2, waterGlasses + simWaterDelta));
    const effectiveExercise = Math.min(90, Math.max(0, dailyExerciseMins + simExerciseDelta));
    const effectiveBp = Math.max(90, systolicBp + simBpDelta);

    // Baseline age impact modifiers
    let delta = 0;

    // Heart rate & BP impact
    if (restingHr < 65) delta -= 1.5;
    else if (restingHr > 80) delta += 2.0;

    if (effectiveBp <= 118) delta -= 1.8;
    else if (effectiveBp > 130) delta += 3.2;

    // Sleep impact
    if (effectiveSleep >= 7.5 && effectiveSleep <= 8.5) delta -= 2.2;
    else if (effectiveSleep < 6) delta += 2.8;

    // Water & Kidney impact
    if (effectiveWater >= 8) delta -= 1.4;
    else if (effectiveWater < 4) delta += 1.8;

    // Exercise & Mitochondria impact
    if (effectiveExercise >= 45) delta -= 3.0;
    else if (effectiveExercise < 15) delta += 2.5;

    // Stress impact
    if (stressLevel < 30) delta -= 1.2;
    else if (stressLevel > 65) delta += 2.4;

    const bioAge = Number((chronologicalAge + delta).toFixed(1));
    const ageDiff = Number((bioAge - chronologicalAge).toFixed(1));

    // Organ resilience scores
    const heartScore = Math.min(100, Math.max(30, Math.round(100 - (restingHr - 60) * 1.2 - (effectiveBp - 115) * 1.4)));
    const brainScore = Math.min(100, Math.max(30, Math.round(85 + (effectiveSleep - 7) * 6 - stressLevel * 0.3)));
    const kidneyScore = Math.min(100, Math.max(30, Math.round(60 + effectiveWater * 4.5)));
    const lungScore = Math.min(100, Math.max(30, Math.round(70 + effectiveExercise * 0.4)));

    const organs: Record<string, OrganStatus> = {
      heart: {
        id: 'heart',
        name: 'Cardiovascular Network',
        score: heartScore,
        grade: heartScore >= 80 ? 'Optimal' : heartScore >= 65 ? 'Good' : 'Moderate',
        ageImpactYears: Number(((effectiveBp - 118) * 0.08).toFixed(1)),
        clinicalTips: 'Low resting pulse and steady blood pressure preserve arterial elasticity and protect against micro-vascular aging.'
      },
      brain: {
        id: 'brain',
        name: 'Cognitive & Neuro Resilience',
        score: brainScore,
        grade: brainScore >= 80 ? 'Optimal' : brainScore >= 65 ? 'Good' : 'Moderate',
        ageImpactYears: Number(((8 - effectiveSleep) * 0.4).toFixed(1)),
        clinicalTips: 'Deep non-REM sleep clears beta-amyloid brain toxins and repairs synaptic plasticity.'
      },
      kidney: {
        id: 'kidney',
        name: 'Renal & Fluid Filtration',
        score: kidneyScore,
        grade: kidneyScore >= 80 ? 'Optimal' : kidneyScore >= 65 ? 'Good' : 'Moderate',
        ageImpactYears: Number(((8 - effectiveWater) * 0.25).toFixed(1)),
        clinicalTips: 'Adequate hydration maintains glomerular filtration rate and prevents kidney stone precipitation.'
      },
      lung: {
        id: 'lung',
        name: 'Pulmonary & Oxygenation',
        score: lungScore,
        grade: lungScore >= 80 ? 'Optimal' : lungScore >= 65 ? 'Good' : 'Moderate',
        ageImpactYears: Number(((30 - effectiveExercise) * 0.05).toFixed(1)),
        clinicalTips: 'Aerobic training expands VO2 Max and mitochondrial efficiency across all muscle tissues.'
      }
    };

    return {
      bioAge,
      ageDiff,
      organs,
      effectiveSleep,
      effectiveWater,
      effectiveExercise,
      effectiveBp
    };
  }, [chronologicalAge, restingHr, systolicBp, sleepHours, waterGlasses, dailyExerciseMins, stressLevel, simSleepDelta, simWaterDelta, simExerciseDelta, simBpDelta]);

  const resetSliders = () => {
    setSimSleepDelta(0);
    setSimWaterDelta(0);
    setSimExerciseDelta(0);
    setSimBpDelta(0);
  };

  const activeOrgan = simulation.organs[selectedOrgan] || simulation.organs.heart;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/trackers')}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground flex items-center gap-2">
              <span>Digital Health Twin & Biological Age</span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30">
                Longevity AI
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Simulate your internal organ resilience and calculate your true cellular biological age in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Clinical Longevity Models
          </span>
        </div>
      </div>

      {/* Main Grid: Biological Age Hero & 3D Interactive Twin */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Interactive Twin Avatar & Organ Matrix */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> Anatomical Twin Model
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground">Tap an organ to inspect</span>
            </div>

            {/* Anatomical Body Silhouette Vector with Interactive Organ Nodes */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#0d1424] dark:to-[#070b14] rounded-xl border border-border flex items-center justify-center p-4">
              {/* Central Abstract Body Lines */}
              <svg viewBox="0 0 200 280" className="w-44 h-auto opacity-75">
                {/* Head */}
                <ellipse cx="100" cy="40" rx="22" ry="26" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
                {/* Neck */}
                <path d="M92 65 L92 80 M108 65 L108 80" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
                {/* Torso */}
                <path d="M60 80 Q100 75 140 80 L130 180 Q100 185 70 180 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
                {/* Arms */}
                <path d="M60 80 L35 150 M140 80 L165 150" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
                {/* Legs */}
                <path d="M80 180 L75 270 M120 180 L125 270" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
              </svg>

              {/* Organ Hotspot 1: Brain */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('brain')}
                className={`absolute top-8 p-2.5 rounded-full border-2 transition-all shadow-md ${
                  selectedOrgan === 'brain'
                    ? 'bg-purple-600 text-white border-white scale-110 shadow-purple-500/40'
                    : 'bg-card text-purple-600 dark:text-purple-400 border-purple-500/40 hover:bg-purple-500/20'
                }`}
                title="Brain"
              >
                <Brain className="w-4 h-4" />
              </motion.button>

              {/* Organ Hotspot 2: Heart */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('heart')}
                className={`absolute top-24 left-[44%] p-2.5 rounded-full border-2 transition-all shadow-md ${
                  selectedOrgan === 'heart'
                    ? 'bg-rose-600 text-white border-white scale-110 shadow-rose-500/40'
                    : 'bg-card text-rose-600 dark:text-rose-400 border-rose-500/40 hover:bg-rose-500/20'
                }`}
                title="Heart"
              >
                <Heart className="w-4 h-4 animate-pulse" />
              </motion.button>

              {/* Organ Hotspot 3: Lungs */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('lung')}
                className={`absolute top-24 right-[25%] p-2 rounded-full border-2 transition-all shadow-md ${
                  selectedOrgan === 'lung'
                    ? 'bg-cyan-600 text-white border-white scale-110 shadow-cyan-500/40'
                    : 'bg-card text-cyan-600 dark:text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/20'
                }`}
                title="Lungs"
              >
                <Wind className="w-3.5 h-3.5" />
              </motion.button>

              {/* Organ Hotspot 4: Kidneys */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('kidney')}
                className={`absolute top-36 p-2 rounded-full border-2 transition-all shadow-md ${
                  selectedOrgan === 'kidney'
                    ? 'bg-emerald-600 text-white border-white scale-110 shadow-emerald-500/40'
                    : 'bg-card text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20'
                }`}
                title="Kidneys"
              >
                <Droplet className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Selected Organ Detail Card */}
            <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-foreground">{activeOrgan.name}</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    activeOrgan.grade === 'Optimal'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {activeOrgan.grade} ({activeOrgan.score}/100)
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeOrgan.clinicalTips}</p>
            </div>
          </div>
        </div>

        {/* Right: Biological Age Hero & What-If Life Sliders */}
        <div className="lg:col-span-6 space-y-4">
          {/* Biological Age Hero Badge */}
          <div className="bg-gradient-to-br from-primary/15 via-card to-violet-500/10 border-2 border-primary/30 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase font-mono tracking-wider">
                True Cellular Longevity Index
              </span>
              <button
                onClick={() => setShowBaselineConfig(!showBaselineConfig)}
                className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1"
              >
                <Settings2 className="w-3 h-3" /> Chronological: {chronologicalAge} yrs
              </button>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-xs text-muted-foreground block">Estimated Biological Age:</span>
                <span className="font-heading font-extrabold text-4xl text-foreground">
                  {simulation.bioAge} <span className="text-sm font-normal text-muted-foreground">Years</span>
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`font-heading font-extrabold text-lg flex items-center gap-1 ${
                    simulation.ageDiff <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }`}
                >
                  {simulation.ageDiff <= 0 ? (
                    <>
                      <TrendingDown className="w-5 h-5" /> {Math.abs(simulation.ageDiff)} Yrs Younger!
                    </>
                  ) : (
                    <>+{simulation.ageDiff} Yrs Biological Load</>
                  )}
                </span>
                <span className="text-[10px] text-muted-foreground block">Telomere & Mitochondrial Proxy</span>
              </div>
            </div>

            {/* Collapsible Personal Baseline Settings */}
            {showBaselineConfig && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-3 border-t border-primary/20 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs"
              >
                <div>
                  <label className="text-[10px] text-muted-foreground block">Real Age</label>
                  <input
                    type="number"
                    value={chronologicalAge}
                    onChange={(e) => setChronologicalAge(Number(e.target.value) || 30)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Resting HR (BPM)</label>
                  <input
                    type="number"
                    value={restingHr}
                    onChange={(e) => setRestingHr(Number(e.target.value) || 72)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Systolic BP</label>
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(Number(e.target.value) || 120)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Base Sleep (hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value) || 7)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Base Water (gls)</label>
                  <input
                    type="number"
                    value={waterGlasses}
                    onChange={(e) => setWaterGlasses(Number(e.target.value) || 6)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Exercise (mins)</label>
                  <input
                    type="number"
                    value={dailyExerciseMins}
                    onChange={(e) => setDailyExerciseMins(Number(e.target.value) || 30)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Stress Index (0-100)</label>
                  <input
                    type="number"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value) || 35)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive "What-If" Life Sliders */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" /> "What-If" Lifestyle Sliders
              </h3>
              <button
                onClick={resetSliders}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Slider 1: Sleep */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-purple-500" /> Sleep Duration
                </span>
                <span className="font-mono font-bold text-primary">{simulation.effectiveSleep} hrs/night</span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="2.0"
                step="0.5"
                value={simSleepDelta}
                onChange={(e) => setSimSleepDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] text-muted-foreground">Optimal: 7.5–8.5 hours for brain toxin clearance.</span>
            </div>

            {/* Slider 2: Water */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-cyan-500" /> Daily Water Intake
                </span>
                <span className="font-mono font-bold text-primary">{simulation.effectiveWater} glasses</span>
              </div>
              <input
                type="range"
                min="-3"
                max="4"
                step="1"
                value={simWaterDelta}
                onChange={(e) => setSimWaterDelta(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] text-muted-foreground">Optimal: 8–10 glasses for renal filtration balance.</span>
            </div>

            {/* Slider 3: Daily Exercise */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> Daily Exercise
                </span>
                <span className="font-mono font-bold text-primary">{simulation.effectiveExercise} mins/day</span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                step="10"
                value={simExerciseDelta}
                onChange={(e) => setSimExerciseDelta(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] text-muted-foreground">Optimal: 30–45 mins cardio for cellular mitochondrial density.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalHealthTwin;
