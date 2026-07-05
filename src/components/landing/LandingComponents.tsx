import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Moon, Star, BrainCircuit, Zap } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

const iconMap: Record<string, React.ComponentType<any>> = { Heart, Activity, Moon, BrainCircuit, Zap };

/* ---------- Floating Metric Card ---------- */
export const FloatingMetric: React.FC<{ metric: typeof import('./landingData').floatingMetrics[0] }> = ({ metric }) => {
  const Icon = iconMap[metric.icon];
  return (
    <motion.div
      className={`absolute ${metric.pos} hidden lg:block p-4 rounded-2xl bg-white dark:bg-slate-900/40 border backdrop-blur-xl shadow-lg text-left ${metric.float}`}
      style={{
        borderColor: `rgba(${metric.rgb}, 0.2)`,
        boxShadow: `0 0 15px rgba(${metric.rgb}, 0.15)`,
        animationDelay: `${metric.delay}s`,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 + metric.delay * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `rgba(${metric.rgb}, 0.12)`, color: `rgb(${metric.rgb})` }}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</span>
      </div>
      <span className="text-xl font-extrabold font-number text-slate-800 dark:text-slate-100">{metric.value}</span>
      <span className="text-[9px] text-muted-foreground font-semibold ml-1">{metric.unit}</span>
    </motion.div>
  );
};

/* ---------- Stat Counter ---------- */
export const StatCounter: React.FC<{ stat: typeof import('./landingData').stats[0] }> = ({ stat }) => {
  const { ref, value } = useCountUp(stat.value);
  return (
    <div ref={ref as any}>
      <div className={`text-3xl md:text-4xl font-extrabold font-number bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
        {value}{stat.suffix}
      </div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1.5">
        {stat.label}
      </div>
    </div>
  );
};

/* ---------- Feature Card ---------- */
export const LandingFeatureCard: React.FC<{ feature: typeof import('./landingData').features[0]; index: number }> = ({ feature, index }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="p-8 flex flex-col items-start bg-white dark:bg-slate-900/20 border rounded-2xl transition-shadow duration-300 relative overflow-hidden group"
      style={{
        borderColor: `rgba(${feature.rgb}, 0.15)`,
        boxShadow: `0 4px 24px rgba(${feature.rgb}, 0.05)`,
      }}
    >
      <motion.div
        className="p-3 rounded-xl mb-6"
        style={{ backgroundColor: `rgba(${feature.rgb}, 0.15)`, color: `rgb(${feature.rgb})` }}
        whileHover={{ scale: 1.15, rotate: 8 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
      <h3 className="text-xl font-bold mb-3 font-heading text-slate-800 dark:text-slate-100">{feature.title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
      <div
        className="w-full h-1 mt-6 rounded transition-all duration-500 group-hover:h-1.5"
        style={{ backgroundColor: `rgba(${feature.rgb}, 0.2)`, boxShadow: `0 1px 10px rgba(${feature.rgb}, 0.3)` }}
      />
    </motion.div>
  );
};

/* ---------- Step Card ---------- */
const stepColorMap: Record<string, string> = { indigo: '99, 102, 241', purple: '168, 85, 247', cyan: '6, 182, 212' };

export const StepCard: React.FC<{ step: typeof import('./landingData').steps[0]; index: number }> = ({ step, index }) => {
  const Icon = iconMap[step.icon];
  const rgb = stepColorMap[step.color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow z-10 flex flex-col items-center text-center"
    >
      <motion.div
        className="absolute -top-4 -left-4 w-8 h-8 rounded-full text-white font-extrabold flex items-center justify-center text-sm shadow-md"
        style={{ backgroundColor: `rgb(${rgb})` }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 400, delay: index * 0.15 + 0.2 }}
      >
        {step.num}
      </motion.div>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `rgba(${rgb}, 0.1)`, color: `rgb(${rgb})` }}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">{step.title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{step.desc}</p>
    </motion.div>
  );
};

/* ---------- Testimonial Card ---------- */
export const TestimonialCard: React.FC<{ t: typeof import('./landingData').testimonials[0]; index: number }> = ({ t, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay: index * 0.12 }}
    whileHover={{ y: -4 }}
    className="p-6 rounded-2xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm"
  >
    <div>
      <div className="flex gap-1 text-amber-500 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">{t.text}</p>
    </div>
    <div className="flex items-center gap-3 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-black shadow-sm`}>
        {t.initials}
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.name}</h4>
        <p className="text-[10px] text-slate-400 font-semibold">{t.location}</p>
      </div>
    </div>
  </motion.div>
);
