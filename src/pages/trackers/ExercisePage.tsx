import React, { useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { Info, Flame, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { showToast } from '../../utils/toast';

interface Routine {
  name: string;
  duration: string;
  difficulty: string;
  steps: string[];
}

const restorativeRoutines: Routine[] = [
  {
    name: 'Restorative Yoga & Pranayama',
    duration: '20 mins',
    difficulty: 'Gentle',
    steps: [
      'Balasana (Child\'s Pose) - 3 mins. Calms the nervous system and relaxes the lower back.',
      'Anulom Vilom (Alternate Nostril Breathing) - 5 mins. Balances sympathetic tone.',
      'Bhramari Pranayama (Bee Breath) - 3 mins. Reduces cerebral stress and mental anxiety.',
      'Viparita Karani (Legs Up the Wall Pose) - 5 mins. Facilitates venous return and deep rest.',
      'Savasana (Corpse Pose) - 4 mins. Complete physical and somatic recovery.'
    ]
  },
  {
    name: 'Gentle Stretch & Mobilization',
    duration: '15 mins',
    difficulty: 'Easy',
    steps: [
      'Neck & Shoulder Rolls - 3 mins. Releases localized muscle tension.',
      'Cat-Cow Stretch - 3 mins. Mobilizes spine and activates core diaphragmatic breathing.',
      'Seated Forward Fold - 3 mins. Stretches hamstrings and calms mental chatter.',
      'Gentle Torso Twists - 3 mins. Promotes spinal alignment and blood flow.',
      'Deep Chest Opener Stretch - 3 mins. Enhances lung capacity.'
    ]
  }
];

const activeRoutines: Routine[] = [
  {
    name: 'Surya Namaskar & Cardio Flow',
    duration: '30 mins',
    difficulty: 'Moderate',
    steps: [
      'Surya Namaskar (Sun Salutation) - 6 rounds (approx 10 mins). Full body mobility and cardiovascular activation.',
      'Brisk Walk or Light Jogging - 10 mins. Raises heart rate and triggers endorphin release.',
      'Bodyweight Squats - 3 sets of 12 reps (approx 5 mins). Builds lower body strength.',
      'Plank Hold - 3 sets of 30-45 seconds (approx 3 mins). Improves abdominal core stability.',
      'Cooldown Stretching - 2 mins. Restores resting muscle length.'
    ]
  },
  {
    name: 'Bodyweight Strength Circuit',
    duration: '25 mins',
    difficulty: 'Intermediate',
    steps: [
      'Jumping Jacks - 3 mins. Active warm up.',
      'Wall Push-Ups / Knee Push-Ups - 3 sets of 10 reps (approx 5 mins). Builds upper body strength.',
      'Lunges - 3 sets of 10 reps per leg (approx 5 mins). Improves lower body coordination.',
      'Glute Bridges - 3 sets of 12 reps (approx 5 mins). Activates posterior chain.',
      'Child\'s Pose Cooldown - 2 mins. Relaxes joints.'
    ]
  }
];

const ExercisePage: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const { logs } = useHealthRead();
  const { logExercise } = useHealthDispatch();

  // Find last stress & mood log to determine dynamic routine selection
  const lastStress = useMemo(() => logs.find(l => l.type === 'stress'), [logs]);
  const lastMood = useMemo(() => logs.find(l => l.type === 'mood'), [logs]);

  const stressScore = lastStress ? Number(lastStress.value.score || 0) : 15;
  const moodState = lastMood ? String(lastMood.value.mood || '') : 'calm';

  const isHighStressOrLowMood = stressScore > 26 || moodState === 'anxious' || moodState === 'angry' || moodState === 'sad';

  const routines = isHighStressOrLowMood ? restorativeRoutines : activeRoutines;

  // Track checked steps checklist locally
  const [checkedSteps, setCheckedSteps] = useState<Record<string, Record<number, boolean>>>({});

  const handleToggleStep = (routineName: string, stepIndex: number) => {
    setCheckedSteps(prev => {
      const routineSteps = prev[routineName] || {};
      return {
        ...prev,
        [routineName]: {
          ...routineSteps,
          [stepIndex]: !routineSteps[stepIndex]
        }
      };
    });
  };

  const getProgress = (routine: Routine) => {
    const routineSteps = checkedSteps[routine.name] || {};
    const checkedCount = Object.values(routineSteps).filter(Boolean).length;
    return routine.steps.length > 0 ? (checkedCount / routine.steps.length) * 100 : 0;
  };

  const handleLogExercise = (routineName: string, durationMin: number) => {
    logExercise({ routine: routineName, duration: durationMin });
    showToast(
      navigator.onLine 
        ? `Logged workout: ${routineName} (${durationMin} mins) successfully!`
        : `Logged exercise locally. Will sync online soon!`,
      'success'
    );
    // Clear checklist for this routine
    setCheckedSteps(prev => ({
      ...prev,
      [routineName]: {}
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up-staggered">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('tracker.exercise.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Explore customized exercise routines matching your psychological stress and emotional mood indices.
        </p>
      </div>

      {/* Dynamic Recommendation Alert Banner (Animated floating banner) */}
      <div className={`p-5 border-2 rounded-2xl flex items-start gap-4 glass animate-float ${
        isHighStressOrLowMood 
          ? 'bg-purple-500/5 border-purple-500/20 text-purple-700 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
          : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
      }`}>
        <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-sm block mb-1">
            {isHighStressOrLowMood ? '🧘 Recommended: Restorative / Gentle Routine' : '⚡ Recommended: Active / Cardio Routine'}
          </span>
          <p className="text-xs opacity-90 leading-relaxed font-medium">
            {isHighStressOrLowMood 
              ? `Because your stress levels are elevated (Score: ${formatNumber(stressScore)}/40) or your mood is low, we advise soothing routines (like yoga, pranayama, stretching) to reduce cortisol markers.` 
              : `Your health checks indicate standard parameters. We recommend moderate cardiovascular activity (like Surya Namaskar, brisk walking, circuit workouts) to maintain high metabolic efficiency.`
            }
          </p>
        </div>
      </div>

      {/* Grid of routines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routines.map((rot, idx) => {
          const progress = getProgress(rot);
          return (
            <div key={idx} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between glass hover:border-primary/20 transition-all duration-300">
              <div>
                <div className="flex justify-between items-start gap-4 mb-5 pb-3 border-b border-border/40">
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-foreground leading-snug">
                      {rot.name}
                    </h3>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded font-number">
                        {rot.duration}
                      </span>
                      <span className="text-[10px] bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded">
                        {rot.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Completion Progress Ring */}
                  {(() => {
                    const radius = 18;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (progress / 100) * circumference;
                    return (
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3.5" className="text-muted/10 dark:text-muted/20" fill="none" />
                          <circle 
                            cx="24" 
                            cy="24" 
                            r={radius} 
                            stroke="hsl(var(--primary))" 
                            strokeWidth="3.5" 
                            className="transition-all duration-300 drop-shadow-[0_0_4px_rgba(139,92,246,0.4)]" 
                            fill="none" 
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-extrabold font-number text-foreground">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="space-y-3 mb-6">
                  <span className="text-xs font-bold text-muted-foreground uppercase block tracking-wider">
                    Exercise Steps Checklist:
                  </span>
                  
                  {/* Step Checklist UI with Checkboxes */}
                  <div className="space-y-2.5">
                    {rot.steps.map((step, sIdx) => {
                      const isChecked = !!(checkedSteps[rot.name] && checkedSteps[rot.name][sIdx]);
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleToggleStep(rot.name, sIdx)}
                          className={`w-full p-3 border rounded-xl flex items-start gap-2.5 text-left text-xs leading-relaxed transition-all touch-target btn-elastic ${
                            isChecked
                              ? 'border-primary bg-primary/5 text-foreground font-bold'
                              : 'border-border bg-background/50 hover:bg-muted/30 text-muted-foreground'
                          }`}
                        >
                          <span className="shrink-0 mt-0.5">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-primary fill-current" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </span>
                          <span>{step}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLogExercise(rot.name, parseInt(rot.duration))}
                className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 touch-target btn-elastic btn-pulse-glow"
                style={{ '--btn-glow-color': '139, 92, 246' } as React.CSSProperties}
              >
                <Flame className="w-4 h-4" />
                <span>Log Completion</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Guidelines info */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Cardiorespiratory & Autonomic Benefits:</span>
          Regular physical exercise lowers resting heart rate, improves insulin sensitivity, and regulates blood pressure index levels. Choosing exercises dynamically matching your psychological metrics avoids sympathetic overload, protecting the hypothalamic-pituitary-adrenal (HPA) axis from chronic burnout.
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
