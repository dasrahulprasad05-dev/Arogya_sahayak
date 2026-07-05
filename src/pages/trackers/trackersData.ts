import { 
  Activity, Droplet, Moon, Smile, Thermometer, Brain, Pill, Heart, Wind, 
  Utensils, Dumbbell, ShieldAlert, Syringe
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const trackerConfigs: Record<string, { icon: LucideIcon; rgb: string; textClass: string; bgClass: string; desc: string }> = {
  symptom: { icon: Activity, rgb: '6, 182, 212', textClass: 'text-cyan-500 dark:text-cyan-400', bgClass: 'bg-cyan-500/15', desc: 'Triage health symptoms and check recommendations' },
  water: { icon: Droplet, rgb: '59, 130, 246', textClass: 'text-blue-500 dark:text-blue-400', bgClass: 'bg-blue-500/15', desc: 'Track daily hydration goals' },
  sleep: { icon: Moon, rgb: '99, 102, 241', textClass: 'text-indigo-500 dark:text-indigo-400', bgClass: 'bg-indigo-500/15', desc: 'Log sleep duration and quality' },
  mood: { icon: Smile, rgb: '236, 72, 153', textClass: 'text-pink-500 dark:text-pink-400', bgClass: 'bg-pink-500/15', desc: 'Track mood history and daily feelings' },
  temp: { icon: Thermometer, rgb: '249, 115, 22', textClass: 'text-orange-500 dark:text-orange-400', bgClass: 'bg-orange-500/15', desc: 'Monitor body temperature fluctuations' },
  stress: { icon: Brain, rgb: '168, 85, 247', textClass: 'text-purple-500 dark:text-purple-400', bgClass: 'bg-purple-500/15', desc: 'Assess cognitive and physiological stress indices' },
  medicine: { icon: Pill, rgb: '239, 68, 68', textClass: 'text-red-500 dark:text-red-400', bgClass: 'bg-red-500/15', desc: 'Schedule and log vital medication intakes' },
  vitals: { icon: Heart, rgb: '16, 185, 129', textClass: 'text-emerald-500 dark:text-emerald-400', bgClass: 'bg-emerald-500/15', desc: 'Log vital metrics and complete morning check-ins' },
  breathing: { icon: Wind, rgb: '14, 165, 233', textClass: 'text-sky-500 dark:text-sky-400', bgClass: 'bg-sky-500/15', desc: 'Practice guided deep breathing exercises' },
  diet: { icon: Utensils, rgb: '132, 204, 22', textClass: 'text-lime-500 dark:text-lime-400', bgClass: 'bg-lime-500/15', desc: 'Explore personalized diet tips and traditional remedies' },
  exercise: { icon: Dumbbell, rgb: '234, 179, 8', textClass: 'text-yellow-500 dark:text-yellow-400', bgClass: 'bg-yellow-500/15', desc: 'Obtain tailored daily physical workout suggestions' },
  vaccine: { icon: Syringe, rgb: '139, 92, 246', textClass: 'text-violet-500 dark:text-violet-400', bgClass: 'bg-violet-500/15', desc: 'Maintain and track family immunization schedules' },
  firstaid: { icon: ShieldAlert, rgb: '239, 68, 68', textClass: 'text-red-500 dark:text-red-400', bgClass: 'bg-red-500/15', desc: 'Access critical step-by-step emergency instructions' }
};
