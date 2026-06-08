import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { healthTools } from '../../utils/diseaseData';
import { 
  ClipboardList, 
  Info,
  Activity,
  Droplet,
  Moon,
  Smile,
  Thermometer,
  Brain,
  Pill,
  Heart,
  Wind,
  Utensils,
  Dumbbell,
  ShieldAlert,
  Syringe,
  ChevronRight
} from 'lucide-react';

const trackerConfigs: Record<string, { icon: React.ComponentType<any>; rgb: string; textClass: string; bgClass: string; desc: string }> = {
  symptom: { icon: Activity, rgb: '6, 182, 212', textClass: 'text-cyan-600 dark:text-cyan-400', bgClass: 'bg-cyan-500/15', desc: 'Triage health symptoms and check recommendations' },
  water: { icon: Droplet, rgb: '59, 130, 246', textClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-500/15', desc: 'Track daily hydration goals' },
  sleep: { icon: Moon, rgb: '99, 102, 241', textClass: 'text-indigo-600 dark:text-indigo-400', bgClass: 'bg-indigo-500/15', desc: 'Log sleep duration and quality' },
  mood: { icon: Smile, rgb: '236, 72, 153', textClass: 'text-pink-600 dark:text-pink-400', bgClass: 'bg-pink-500/15', desc: 'Track mood history and daily feelings' },
  temp: { icon: Thermometer, rgb: '249, 115, 22', textClass: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-500/15', desc: 'Monitor body temperature fluctuations' },
  stress: { icon: Brain, rgb: '168, 85, 247', textClass: 'text-purple-600 dark:text-purple-400', bgClass: 'bg-purple-500/15', desc: 'Assess cognitive and physiological stress indices' },
  medicine: { icon: Pill, rgb: '239, 68, 68', textClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500/15', desc: 'Schedule and log vital medication intakes' },
  vitals: { icon: Heart, rgb: '16, 185, 129', textClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-500/15', desc: 'Log vital metrics and complete morning check-ins' },
  breathing: { icon: Wind, rgb: '14, 165, 233', textClass: 'text-sky-600 dark:text-sky-400', bgClass: 'bg-sky-500/15', desc: 'Practice guided deep breathing exercises' },
  diet: { icon: Utensils, rgb: '132, 204, 22', textClass: 'text-lime-600 dark:text-lime-400', bgClass: 'bg-lime-500/15', desc: 'Explore personalized diet tips and traditional remedies' },
  exercise: { icon: Dumbbell, rgb: '234, 179, 8', textClass: 'text-yellow-600 dark:text-yellow-400', bgClass: 'bg-yellow-500/15', desc: 'Obtain tailored daily physical workout suggestions' },
  vaccine: { icon: Syringe, rgb: '139, 92, 246', textClass: 'text-violet-600 dark:text-violet-400', bgClass: 'bg-violet-500/15', desc: 'Maintain and track family immunization schedules' },
  firstaid: { icon: ShieldAlert, rgb: '239, 68, 68', textClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500/15', desc: 'Access critical step-by-step emergency instructions' }
};

const TrackersHub: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const categories = [
    { id: 'tracker', name: 'Wellness Logs & Tools', icon: ClipboardList },
    { id: 'info', name: 'Reference & Guides', icon: Info }
  ];

  return (
    <div className="space-y-12 relative overflow-hidden pb-12">
      {/* Background drifting blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] bg-cyan-500/3 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-purple-500/3 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] bg-pink-500/3 dark:bg-pink-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>

      {/* Header and title area */}
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400">
          {t('nav.trackers')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
          Select a widget below to log vitals, track daily targets, or read clinical guidance.
        </p>
      </div>

      {categories.map((category) => {
        const Icon = category.icon;
        const items = healthTools.filter(tool => tool.category === category.id);
        
        if (items.length === 0) return null;

        return (
          <div key={category.id} className="space-y-6">
            {/* Section Header */}
            <div className="relative pl-5 flex items-center justify-between">
              <div className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-teal-500 to-cyan-600 dark:from-teal-400 dark:to-cyan-500 rounded-full"></div>
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-800 dark:text-white">{category.name}</h2>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800/40 border border-slate-300/50 dark:border-slate-700/50 px-2.5 py-1 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((tool, index) => {
                const cfg = trackerConfigs[tool.id] || { icon: Activity, rgb: '14, 165, 233', textClass: 'text-sky-600 dark:text-sky-400', bgClass: 'bg-sky-500/15', desc: 'Click to record or review entries.' };
                const ToolIcon = cfg.icon;

                return (
                  <button
                    key={tool.id}
                    onClick={() => navigate(tool.path)}
                    style={{ 
                      '--tracker-accent-rgb': cfg.rgb,
                      animationDelay: `${index * 75}ms`
                    } as React.CSSProperties}
                    className="p-5 tracker-card rounded-2xl flex flex-col justify-between text-left touch-target group animate-slide-up"
                  >
                    <div className="space-y-4">
                      {/* Top-left positioned Icon container at 15% opacity background */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.bgClass} shrink-0`}>
                        <ToolIcon className={`w-6 h-6 ${cfg.textClass} group-hover:scale-110 transition-transform duration-300`} />
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white leading-snug">
                          {t(tool.nameKey)}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">
                          {cfg.desc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom: colored Open Tracker link */}
                    <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between w-full">
                      <span className={`text-xs font-bold ${cfg.textClass} flex items-center gap-1`}>
                        Open Tracker
                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackersHub;
