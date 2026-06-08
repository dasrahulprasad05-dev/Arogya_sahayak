export interface HealthTool {
  id: string;
  nameKey: string;
  path: string;
  colorClass: string;
  bgClass: string;
  category: 'tracker' | 'ai' | 'info';
}

export const healthTools: HealthTool[] = [
  {
    id: 'symptom',
    nameKey: 'tracker.symptom.title',
    path: '/trackers/symptom',
    colorClass: 'text-teal-600 dark:text-teal-400',
    bgClass: 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/40',
    category: 'tracker'
  },
  {
    id: 'water',
    nameKey: 'tracker.water.title',
    path: '/trackers/water',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40',
    category: 'tracker'
  },
  {
    id: 'sleep',
    nameKey: 'tracker.sleep.title',
    path: '/trackers/sleep',
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40',
    category: 'tracker'
  },
  {
    id: 'mood',
    nameKey: 'tracker.mood.title',
    path: '/trackers/mood',
    colorClass: 'text-pink-600 dark:text-pink-400',
    bgClass: 'bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900/40',
    category: 'tracker'
  },
  {
    id: 'temp',
    nameKey: 'tracker.temp.title',
    path: '/trackers/temperature',
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40',
    category: 'tracker'
  },
  {
    id: 'stress',
    nameKey: 'tracker.stress.title',
    path: '/trackers/stress',
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40',
    category: 'tracker'
  },
  {
    id: 'medicine',
    nameKey: 'tracker.medicine.title',
    path: '/trackers/medicine',
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40',
    category: 'tracker'
  },
  {
    id: 'vitals',
    nameKey: 'tracker.vitals.title',
    path: '/trackers/vitals',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40',
    category: 'tracker'
  },
  {
    id: 'breathing',
    nameKey: 'tracker.breathing.title',
    path: '/trackers/breathing',
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    bgClass: 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900/40',
    category: 'tracker'
  },
  {
    id: 'diet',
    nameKey: 'tracker.diet.title',
    path: '/trackers/diet',
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40',
    category: 'tracker'
  },
  {
    id: 'exercise',
    nameKey: 'tracker.exercise.title',
    path: '/trackers/exercise',
    colorClass: 'text-lime-600 dark:text-lime-400',
    bgClass: 'bg-lime-50 dark:bg-lime-950/20 border-lime-200 dark:border-lime-900/40',
    category: 'tracker'
  },
  {
    id: 'firstaid',
    nameKey: 'tracker.firstaid.title',
    path: '/trackers/firstaid',
    colorClass: 'text-red-600 dark:text-red-400',
    bgClass: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40',
    category: 'info'
  },
  {
    id: 'vaccine',
    nameKey: 'tracker.vaccine.title',
    path: '/trackers/vaccine',
    colorClass: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900/40',
    category: 'tracker'
  }
];
