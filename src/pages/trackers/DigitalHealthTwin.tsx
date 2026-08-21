import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHealthRead } from '../../context/HealthReadContext';
import jsPDF from 'jspdf';
import {
  Heart,
  Brain,
  Wind,
  Droplet,
  Activity,
  ArrowLeft,
  TrendingDown,
  Sliders,
  RotateCcw,
  Settings2,
  Sparkles,
  Download,
  Flame,
  Dna,
  Zap,
  Clock
} from 'lucide-react';

interface OrganStatus {
  id: string;
  name: string;
  category: string;
  score: number; // 0-100
  grade: 'Optimal' | 'Good' | 'Moderate' | 'At Risk';
  bioAge: number;
  agingVelocity: number; // e.g. 0.85x
  clinicalTips: string;
  biomarkers: { label: string; value: string; status: 'optimal' | 'normal' | 'attention' }[];
}

const DigitalHealthTwin: React.FC = () => {
  const navigate = useNavigate();
  const { todaySnapshot } = useHealthRead();

  // Baseline User Inputs
  const [chronologicalAge, setChronologicalAge] = useState<number>(32);
  const [restingHr, setRestingHr] = useState<number>(72);
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [sleepHours, setSleepHours] = useState<number>(7.0);
  const [waterGlasses, setWaterGlasses] = useState<number>(todaySnapshot.water || 7);
  const [dailyExerciseMins, setDailyExerciseMins] = useState<number>(35);
  const [stressLevel, setStressLevel] = useState<number>(35); // 0-100
  const [dietQuality, setDietQuality] = useState<number>(70); // 0-100 (Mediterranean/anti-inflammatory)
  const [showBaselineConfig, setShowBaselineConfig] = useState(false);

  // Interactive What-If simulation delta modifiers
  const [simSleepDelta, setSimSleepDelta] = useState<number>(0);
  const [simWaterDelta, setSimWaterDelta] = useState<number>(0);
  const [simExerciseDelta, setSimExerciseDelta] = useState<number>(0);
  const [simStressDelta, setSimStressDelta] = useState<number>(0);
  const [simDietDelta, setSimDietDelta] = useState<number>(0);

  const [selectedOrgan, setSelectedOrgan] = useState<string>('heart');

  // Compute Comprehensive Cellular Biological Age & Longevity Model
  const simulation = useMemo(() => {
    const effectiveSleep = Math.min(9.5, Math.max(4, Number((sleepHours + simSleepDelta).toFixed(1))));
    const effectiveWater = Math.min(14, Math.max(2, waterGlasses + simWaterDelta));
    const effectiveExercise = Math.min(90, Math.max(0, dailyExerciseMins + simExerciseDelta));
    const effectiveStress = Math.min(100, Math.max(0, stressLevel + simStressDelta));
    const effectiveDiet = Math.min(100, Math.max(20, dietQuality + simDietDelta));

    // Baseline age impact modifiers
    let totalDelta = 0;

    // Heart rate & BP impact
    if (restingHr < 65) totalDelta -= 1.6;
    else if (restingHr > 80) totalDelta += 2.2;

    if (systolicBp <= 118) totalDelta -= 1.8;
    else if (systolicBp > 130) totalDelta += 3.4;

    // Sleep impact (Glymphatic brain clearance)
    if (effectiveSleep >= 7.5 && effectiveSleep <= 8.5) totalDelta -= 2.4;
    else if (effectiveSleep < 6) totalDelta += 3.0;

    // Water & Renal filtration
    if (effectiveWater >= 8) totalDelta -= 1.5;
    else if (effectiveWater < 4) totalDelta += 2.0;

    // Physical Movement & Mitochondria
    if (effectiveExercise >= 45) totalDelta -= 3.2;
    else if (effectiveExercise < 15) totalDelta += 2.6;

    // Stress & Cortisol
    if (effectiveStress < 30) totalDelta -= 1.4;
    else if (effectiveStress > 65) totalDelta += 2.5;

    // Anti-inflammatory Nutrition
    if (effectiveDiet >= 80) totalDelta -= 2.0;
    else if (effectiveDiet < 40) totalDelta += 2.2;

    const overallBioAge = Number((chronologicalAge + totalDelta).toFixed(1));
    const ageDiff = Number((overallBioAge - chronologicalAge).toFixed(1));
    const agingVelocity = Number((overallBioAge / chronologicalAge).toFixed(2));

    // Predicted Healthy Lifespan (Indian base avg: 71 yrs)
    const baselineLifespan = 76.5;
    const predictedLifespan = Number((baselineLifespan - totalDelta * 1.3).toFixed(1));

    // Organ-Specific Scores & Biological Ages
    const heartScore = Math.min(100, Math.max(25, Math.round(98 - (restingHr - 60) * 1.1 - (systolicBp - 115) * 1.2 + (effectiveExercise - 30) * 0.4)));
    const brainScore = Math.min(100, Math.max(25, Math.round(86 + (effectiveSleep - 7) * 7 - effectiveStress * 0.35 + (effectiveDiet - 50) * 0.15)));
    const lungScore = Math.min(100, Math.max(25, Math.round(75 + effectiveExercise * 0.5 - (systolicBp > 130 ? 8 : 0))));
    const liverScore = Math.min(100, Math.max(25, Math.round(72 + (effectiveDiet - 50) * 0.4 + effectiveWater * 1.8 - effectiveStress * 0.15)));
    const kidneyScore = Math.min(100, Math.max(25, Math.round(62 + effectiveWater * 4.2 - (systolicBp > 135 ? 12 : 0))));
    const cellScore = Math.min(100, Math.max(25, Math.round(70 + effectiveExercise * 0.35 + (effectiveSleep - 6) * 4 + (effectiveDiet - 50) * 0.25)));

    const getGrade = (score: number): OrganStatus['grade'] => {
      if (score >= 82) return 'Optimal';
      if (score >= 68) return 'Good';
      if (score >= 50) return 'Moderate';
      return 'At Risk';
    };

    const organs: Record<string, OrganStatus> = {
      heart: {
        id: 'heart',
        name: 'Cardiovascular & Arterial Tree',
        category: 'Cardiac & Circulation',
        score: heartScore,
        grade: getGrade(heartScore),
        bioAge: Number((chronologicalAge - (heartScore - 70) * 0.18).toFixed(1)),
        agingVelocity: Number((1 - (heartScore - 70) * 0.006).toFixed(2)),
        clinicalTips: 'Low resting pulse and steady blood pressure preserve arterial elasticity, endothelial nitric oxide synthesis, and micro-vascular longevity.',
        biomarkers: [
          { label: 'Resting Pulse', value: `${restingHr} BPM`, status: restingHr <= 75 ? 'optimal' : 'normal' },
          { label: 'Systolic BP', value: `${systolicBp} mmHg`, status: systolicBp <= 120 ? 'optimal' : systolicBp <= 135 ? 'normal' : 'attention' },
          { label: 'Arterial Elasticity', value: heartScore >= 75 ? 'High (Youthful)' : 'Moderate', status: heartScore >= 75 ? 'optimal' : 'normal' }
        ]
      },
      brain: {
        id: 'brain',
        name: 'Cognitive Matrix & Neuro-Plasticity',
        category: 'Neurological & Sleep',
        score: brainScore,
        grade: getGrade(brainScore),
        bioAge: Number((chronologicalAge - (brainScore - 70) * 0.2).toFixed(1)),
        agingVelocity: Number((1 - (brainScore - 70) * 0.007).toFixed(2)),
        clinicalTips: 'Deep non-REM stage 3 sleep activates glymphatic cerebrospinal flow, washing out beta-amyloid neurotoxins and preserving cognitive memory speed.',
        biomarkers: [
          { label: 'Deep Sleep Target', value: `${effectiveSleep} hrs/night`, status: effectiveSleep >= 7 ? 'optimal' : 'attention' },
          { label: 'Stress Index', value: `${effectiveStress}/100`, status: effectiveStress <= 40 ? 'optimal' : 'attention' },
          { label: 'Synaptic Plasticity', value: brainScore >= 75 ? 'Robust' : 'Adequate', status: brainScore >= 75 ? 'optimal' : 'normal' }
        ]
      },
      lung: {
        id: 'lung',
        name: 'Pulmonary & VO2 Oxygenation',
        category: 'Respiratory Endurance',
        score: lungScore,
        grade: getGrade(lungScore),
        bioAge: Number((chronologicalAge - (lungScore - 70) * 0.16).toFixed(1)),
        agingVelocity: Number((1 - (lungScore - 70) * 0.005).toFixed(2)),
        clinicalTips: 'Zone-2 aerobic training expands alveolar surface area, increases diaphragmatic endurance, and maximizes capillary oxygen delivery.',
        biomarkers: [
          { label: 'Daily Cardio', value: `${effectiveExercise} mins/day`, status: effectiveExercise >= 30 ? 'optimal' : 'normal' },
          { label: 'Estimated VO2 Max', value: lungScore >= 75 ? '42 mL/kg/min (Good)' : '35 mL/kg/min', status: lungScore >= 75 ? 'optimal' : 'normal' },
          { label: 'Alveolar Diffusion', value: 'Clear & Elastic', status: 'optimal' }
        ]
      },
      liver: {
        id: 'liver',
        name: 'Metabolic & Hepatic Detox Network',
        category: 'Hepatic & Metabolism',
        score: liverScore,
        grade: getGrade(liverScore),
        bioAge: Number((chronologicalAge - (liverScore - 70) * 0.17).toFixed(1)),
        agingVelocity: Number((1 - (liverScore - 70) * 0.006).toFixed(2)),
        clinicalTips: 'High antioxidant polyphenol intake protects hepatocytes from lipid accumulation (fatty liver NAFLD) and optimizes glutathione recycling.',
        biomarkers: [
          { label: 'Dietary Quality', value: `${effectiveDiet}/100 Clean`, status: effectiveDiet >= 65 ? 'optimal' : 'normal' },
          { label: 'Insulin Sensitivity', value: effectiveExercise >= 30 ? 'High' : 'Moderate', status: 'optimal' },
          { label: 'Fatty Liver Risk', value: liverScore >= 70 ? 'Low Risk' : 'Moderate Guard', status: liverScore >= 70 ? 'optimal' : 'normal' }
        ]
      },
      kidney: {
        id: 'kidney',
        name: 'Renal Glomerular Filtration',
        category: 'Renal & Fluid Balance',
        score: kidneyScore,
        grade: getGrade(kidneyScore),
        bioAge: Number((chronologicalAge - (kidneyScore - 70) * 0.15).toFixed(1)),
        agingVelocity: Number((1 - (kidneyScore - 70) * 0.005).toFixed(2)),
        clinicalTips: 'Adequate hydration maintains steady renal perfusion pressure and prevents toxic crystal nucleation in nephrons.',
        biomarkers: [
          { label: 'Daily Fluid Input', value: `${effectiveWater} Glasses (${(effectiveWater * 0.25).toFixed(1)}L)`, status: effectiveWater >= 8 ? 'optimal' : 'attention' },
          { label: 'Est. Filtration Rate', value: kidneyScore >= 75 ? '>90 mL/min (Optimal)' : '80 mL/min', status: kidneyScore >= 75 ? 'optimal' : 'normal' },
          { label: 'Electrolyte Equilibrium', value: 'Balanced', status: 'optimal' }
        ]
      },
      cell: {
        id: 'cell',
        name: 'Cellular Telomeres & Mitochondria',
        category: 'Longevity & DNA Repair',
        score: cellScore,
        grade: getGrade(cellScore),
        bioAge: Number((chronologicalAge - (cellScore - 70) * 0.22).toFixed(1)),
        agingVelocity: Number((1 - (cellScore - 70) * 0.007).toFixed(2)),
        clinicalTips: 'Intermittent exercise and deep sleep stimulate autophagy, clearing out senescent zombie cells and protecting chromosome telomere length.',
        biomarkers: [
          { label: 'Cellular Autophagy', value: effectiveExercise >= 35 ? 'Active' : 'Baseline', status: 'optimal' },
          { label: 'Telomere Integrity', value: cellScore >= 75 ? 'Protected' : 'Standard Decay', status: cellScore >= 75 ? 'optimal' : 'normal' },
          { label: 'Mitochondrial Density', value: `${cellScore}% Vitality`, status: cellScore >= 75 ? 'optimal' : 'normal' }
        ]
      }
    };

    return {
      overallBioAge,
      ageDiff,
      agingVelocity,
      predictedLifespan,
      organs,
      effectiveSleep,
      effectiveWater,
      effectiveExercise,
      effectiveStress,
      effectiveDiet
    };
  }, [chronologicalAge, restingHr, systolicBp, sleepHours, waterGlasses, dailyExerciseMins, stressLevel, dietQuality, simSleepDelta, simWaterDelta, simExerciseDelta, simStressDelta, simDietDelta]);

  const resetSliders = () => {
    setSimSleepDelta(0);
    setSimWaterDelta(0);
    setSimExerciseDelta(0);
    setSimStressDelta(0);
    setSimDietDelta(0);
  };

  const activeOrgan = simulation.organs[selectedOrgan] || simulation.organs.heart;

  // Export Full Longevity Assessment PDF
  const exportLongevityReport = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();

    // Top Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AAROGYA SAHAYAK — DIGITAL HEALTH TWIN & LONGEVITY CERTIFICATE', 14, 12);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} | Certified Clinical Longevity Simulation`, 14, 18);
    doc.text(`Patient Chronological Age: ${chronologicalAge} Yrs | Cellular Biological Age: ${simulation.overallBioAge} Yrs`, 14, 23);

    let y = 38;

    // Summary Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, pageW - 28, 26, 3, 3, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Cellular Longevity Index: ${simulation.overallBioAge} Years (${Math.abs(simulation.ageDiff)} Yrs ${simulation.ageDiff <= 0 ? 'Younger' : 'Older'})`, 18, y + 8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Aging Velocity: ${simulation.agingVelocity}x | Projected Healthy Lifespan: ${simulation.predictedLifespan} Years`, 18, y + 15);
    doc.text(`Resting HR: ${restingHr} BPM | Blood Pressure: ${systolicBp}/80 mmHg | Sleep: ${simulation.effectiveSleep}h | Hydration: ${simulation.effectiveWater} gls`, 18, y + 21);

    y += 34;

    // Organ Breakdown Header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 57, 249);
    doc.text('ORGAN-BY-ORGAN RESILIENCE & CELLULAR AGE MATRIX:', 14, y);
    y += 8;

    Object.values(simulation.organs).forEach((org) => {
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${org.name} — ${org.grade} (${org.score}/100)`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(16, 185, 129);
      doc.text(`Bio Age: ${org.bioAge} Yrs (Rate: ${org.agingVelocity}x)`, 135, y);
      y += 5;

      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const tipLines = doc.splitTextToSize(org.clinicalTips, pageW - 32);
      doc.text(tipLines, 18, y);
      y += tipLines.length * 4 + 4;
    });

    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y, pageW - 14, y);
    y += 6;

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Disclaimer: Cellular biological age is estimated via mathematical longevity algorithms and physiological biomarkers.', 14, y);

    doc.save(`Arogya_HealthTwin_Longevity_Report_${Date.now()}.pdf`);
  };

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
              <span>Holographic Health Twin &amp; Longevity AI</span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30">
                Cellular Simulation
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Interactive 6-organ resilience twin calculating real-time cellular biological age and lifespan velocity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportLongevityReport}
            className="px-3.5 py-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> Longevity PDF Report
          </button>
        </div>
      </div>

      {/* Main Grid: Holographic Avatar (Left) vs Longevity Cockpit (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Holographic Anatomical Avatar */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
                <Dna className="w-4 h-4 text-violet-500" /> Holographic Organ Twin
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-lg">
                Tap node to inspect
              </span>
            </div>

            {/* Glowing Holographic Body Container */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-violet-500/30 shadow-inner flex items-center justify-center p-4 overflow-hidden">
              {/* Futuristic Holographic Grid & Radial Aura */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.22),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              {/* Animated Laser Scanning Line */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] animate-laser-scan pointer-events-none" />

              {/* Holographic Body Silhouette SVG */}
              <svg viewBox="0 0 200 280" className="w-48 h-auto text-violet-400/80 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                {/* Outer Head Contour */}
                <ellipse cx="100" cy="38" rx="22" ry="26" fill="none" stroke="currentColor" strokeWidth="2.2" />
                <path d="M85 35 Q100 20 115 35" fill="none" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Neck */}
                <path d="M91 63 L91 76 M109 63 L109 76" stroke="currentColor" strokeWidth="2.2" />
                {/* Torso Silhouette */}
                <path d="M58 76 Q100 70 142 76 L132 175 Q100 182 68 175 Z" fill="rgba(139,92,246,0.06)" stroke="currentColor" strokeWidth="2.2" />
                {/* Spine / Central Nervous Axis */}
                <line x1="100" y1="75" x2="100" y2="175" stroke="rgba(6,182,212,0.4)" strokeWidth="1.8" strokeDasharray="4 3" />
                {/* Ribcage Outline */}
                <path d="M72 100 Q100 110 128 100 M70 120 Q100 130 130 120 M75 140 Q100 148 125 140" fill="none" stroke="rgba(168,85,247,0.35)" strokeWidth="1.2" />
                {/* Arms */}
                <path d="M58 76 L30 145 M142 76 L170 145" fill="none" stroke="currentColor" strokeWidth="2.2" />
                {/* Legs */}
                <path d="M78 175 L70 268 M122 175 L130 268" fill="none" stroke="currentColor" strokeWidth="2.2" />
              </svg>

              {/* Hotspot 1: 🧠 Brain (Purple) */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('brain')}
                className={`absolute top-6 p-2 rounded-full border-2 transition-all shadow-lg ${
                  selectedOrgan === 'brain'
                    ? 'bg-purple-600 text-white border-white scale-110 shadow-purple-500/70'
                    : 'bg-slate-900/90 text-purple-400 border-purple-500/60 hover:bg-purple-500/30'
                }`}
                title="Brain & Cognitive Matrix"
              >
                <Brain className="w-4 h-4" />
              </motion.button>

              {/* Hotspot 2: ❤️ Heart (Rose) */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('heart')}
                className={`absolute top-22 left-[44%] p-2.5 rounded-full border-2 transition-all shadow-lg ${
                  selectedOrgan === 'heart'
                    ? 'bg-rose-600 text-white border-white scale-110 shadow-rose-500/70'
                    : 'bg-slate-900/90 text-rose-400 border-rose-500/60 hover:bg-rose-500/30'
                }`}
                title="Cardiovascular Network"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-white animate-pulse" />
              </motion.button>

              {/* Hotspot 3: 🫁 Lungs (Cyan) */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('lung')}
                className={`absolute top-22 right-[24%] p-2 rounded-full border-2 transition-all shadow-lg ${
                  selectedOrgan === 'lung'
                    ? 'bg-cyan-600 text-white border-white scale-110 shadow-cyan-500/70'
                    : 'bg-slate-900/90 text-cyan-400 border-cyan-500/60 hover:bg-cyan-500/30'
                }`}
                title="Pulmonary Network"
              >
                <Wind className="w-3.5 h-3.5" />
              </motion.button>

              {/* Hotspot 4: 🩸 Liver & Metabolism (Amber) */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('liver')}
                className={`absolute top-33 left-[32%] p-2 rounded-full border-2 transition-all shadow-lg ${
                  selectedOrgan === 'liver'
                    ? 'bg-amber-600 text-white border-white scale-110 shadow-amber-500/70'
                    : 'bg-slate-900/90 text-amber-400 border-amber-500/60 hover:bg-amber-500/30'
                }`}
                title="Hepatic & Metabolism"
              >
                <Flame className="w-3.5 h-3.5" />
              </motion.button>

              {/* Hotspot 5: 💧 Kidneys (Emerald) */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('kidney')}
                className={`absolute top-36 right-[34%] p-2 rounded-full border-2 transition-all shadow-lg ${
                  selectedOrgan === 'kidney'
                    ? 'bg-emerald-600 text-white border-white scale-110 shadow-emerald-500/70'
                    : 'bg-slate-900/90 text-emerald-400 border-emerald-500/60 hover:bg-emerald-500/30'
                }`}
                title="Renal System"
              >
                <Droplet className="w-3.5 h-3.5" />
              </motion.button>

              {/* Hotspot 6: 🦴 Musculoskeletal & Telomeres (Indigo) */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrgan('cell')}
                className={`absolute bottom-8 left-[45%] p-2 rounded-full border-2 transition-all shadow-lg ${
                  selectedOrgan === 'cell'
                    ? 'bg-indigo-600 text-white border-white scale-110 shadow-indigo-500/70'
                    : 'bg-slate-900/90 text-indigo-400 border-indigo-500/60 hover:bg-indigo-500/30'
                }`}
                title="Cellular Telomeres & DNA"
              >
                <Zap className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Selected Organ Bio-Metrics Card */}
            <motion.div
              key={activeOrgan.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/40 p-4 rounded-xl border border-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-primary uppercase font-mono font-bold">{activeOrgan.category}</span>
                  <h4 className="font-heading font-extrabold text-sm text-foreground">{activeOrgan.name}</h4>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      activeOrgan.grade === 'Optimal'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : activeOrgan.grade === 'Good'
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {activeOrgan.grade} ({activeOrgan.score}/100)
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    Bio Age: <strong className="text-foreground">{activeOrgan.bioAge} yrs</strong> ({activeOrgan.agingVelocity}x speed)
                  </span>
                </div>
              </div>

              {/* 3 Organ Biomarkers Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {activeOrgan.biomarkers.map((bm, idx) => (
                  <div key={idx} className="bg-card border border-border/70 p-2 rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block truncate">{bm.label}</span>
                    <span className="text-xs font-bold text-foreground mt-0.5 block truncate">{bm.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                {activeOrgan.clinicalTips}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Longevity Cockpit & Life Sliders */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Cellular Longevity Index Banner */}
          <div className="bg-gradient-to-br from-primary/15 via-card to-violet-500/10 border-2 border-primary/30 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> True Cellular Longevity Index
              </span>
              <button
                onClick={() => setShowBaselineConfig(!showBaselineConfig)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 transition-all"
              >
                <Settings2 className="w-3.5 h-3.5" /> Baseline: {chronologicalAge} yrs
              </button>
            </div>

            {/* Big Age Comparison */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-xs text-muted-foreground block">Estimated Biological Age:</span>
                <span className="font-heading font-extrabold text-4xl sm:text-5xl text-foreground tracking-tight">
                  {simulation.overallBioAge} <span className="text-sm font-normal text-muted-foreground">Years</span>
                </span>
              </div>

              <div className="text-right space-y-0.5">
                <span
                  className={`font-heading font-extrabold text-base sm:text-lg flex items-center justify-end gap-1 ${
                    simulation.ageDiff <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }`}
                >
                  {simulation.ageDiff <= 0 ? (
                    <>
                      <TrendingDown className="w-5 h-5" /> {Math.abs(simulation.ageDiff)} Yrs Younger!
                    </>
                  ) : (
                    <>+{simulation.ageDiff} Yrs Biological Wear</>
                  )}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono block">
                  Aging Velocity: <strong>{simulation.agingVelocity}x</strong>
                </span>
              </div>
            </div>

            {/* Lifespan Prediction Pill */}
            <div className="bg-card/90 border border-primary/20 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Predicted Healthy Lifespan</span>
                  <span className="font-heading font-extrabold text-sm text-foreground">
                    {simulation.predictedLifespan} <span className="text-xs font-normal">Years</span>
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +{(simulation.predictedLifespan - 71).toFixed(1)} Yrs vs Base
              </span>
            </div>

            {/* Collapsible Personal Baseline Settings Panel */}
            {showBaselineConfig && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-3 border-t border-primary/20 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs"
              >
                <div>
                  <label className="text-[10px] text-muted-foreground block">Calendar Age</label>
                  <input
                    type="number"
                    value={chronologicalAge}
                    onChange={(e) => setChronologicalAge(Number(e.target.value) || 30)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Resting HR (BPM)</label>
                  <input
                    type="number"
                    value={restingHr}
                    onChange={(e) => setRestingHr(Number(e.target.value) || 72)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Systolic BP</label>
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(Number(e.target.value) || 120)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Base Sleep (hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value) || 7)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Base Water (gls)</label>
                  <input
                    type="number"
                    value={waterGlasses}
                    onChange={(e) => setWaterGlasses(Number(e.target.value) || 7)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Exercise (mins)</label>
                  <input
                    type="number"
                    value={dailyExerciseMins}
                    onChange={(e) => setDailyExerciseMins(Number(e.target.value) || 35)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Stress (0-100)</label>
                  <input
                    type="number"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value) || 35)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block">Diet Whole Food %</label>
                  <input
                    type="number"
                    value={dietQuality}
                    onChange={(e) => setDietQuality(Number(e.target.value) || 70)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive "What-If" Life Simulator Levers */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-heading font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" /> "What-If" Lifestyle Levers
              </h3>
              <button
                onClick={resetSliders}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Slider 1: Sleep */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-purple-500" /> Sleep Duration
                </span>
                <span className="font-mono font-bold text-primary">{simulation.effectiveSleep} hrs/night</span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="2.5"
                step="0.5"
                value={simSleepDelta}
                onChange={(e) => setSimSleepDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] text-muted-foreground">Optimal: 7.5–8.5 hours for brain amyloid clearance.</span>
            </div>

            {/* Slider 2: Water */}
            <div className="space-y-1">
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
              <span className="text-[10px] text-muted-foreground">Optimal: 8–10 glasses for renal glomerular filtration.</span>
            </div>

            {/* Slider 3: Daily Exercise */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> Daily Cardio &amp; Movement
                </span>
                <span className="font-mono font-bold text-primary">{simulation.effectiveExercise} mins/day</span>
              </div>
              <input
                type="range"
                min="-20"
                max="45"
                step="5"
                value={simExerciseDelta}
                onChange={(e) => setSimExerciseDelta(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] text-muted-foreground">Optimal: 35–45 mins zone-2 cardio for telomere maintenance.</span>
            </div>

            {/* Slider 4: Mindfulness & Stress Reduction */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Stress &amp; Cortisol Index
                </span>
                <span className="font-mono font-bold text-primary">{simulation.effectiveStress}/100</span>
              </div>
              <input
                type="range"
                min="-25"
                max="30"
                step="5"
                value={simStressDelta}
                onChange={(e) => setSimStressDelta(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] text-muted-foreground">Lower score reduces adrenal fatigue and vascular inflammation.</span>
            </div>

            {/* Slider 5: Clean Anti-Inflammatory Nutrition */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" /> Anti-Inflammatory Nutrition
                </span>
                <span className="font-mono font-bold text-primary">{simulation.effectiveDiet}% Whole Foods</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={simDietDelta}
                onChange={(e) => setSimDietDelta(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] text-muted-foreground">Polyphenols &amp; fiber slow down cellular epigenetic aging.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalHealthTwin;
