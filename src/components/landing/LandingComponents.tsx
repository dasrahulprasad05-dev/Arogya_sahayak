import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Activity, Moon, Star, BrainCircuit, Zap, ChevronDown, Sparkles } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

const iconMap: Record<string, React.ComponentType<any>> = { Heart, Activity, Moon, BrainCircuit, Zap };
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/* ========================================== */
/*  Magnetic Button Wrapper                    */
/* ========================================== */
export const MagneticButton: React.FC<{ children: React.ReactNode; strength?: number; className?: string }> = ({
  children, strength = 0.35, className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.94 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* ========================================== */
/*  Floating Dashboard Mock (3D tilt on mouse) */
/* ========================================== */
export const FloatingDashboard: React.FC = () => {
  const metrics = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { label: 'SpO₂', value: '98%', unit: '', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Sleep', value: '7.5h', unit: '', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 200, damping: 20 });
  const springRy = useSpring(ry, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springRx, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(springRy, [-0.5, 0.5], ['-14deg', '14deg']);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rx.set((e.clientY - rect.top) / rect.height - 0.5);
    ry.set((e.clientX - rect.left) / rect.width - 0.5);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <div className="floating-dashboard w-full max-w-md mx-auto" style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
      >
        <div style={{ transform: 'translateZ(40px)' }} className="glass-card rounded-2xl p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dashboard</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Health Overview</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          </div>

          {/* Health Score — animated ring */}
          <div className="text-center py-3">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-800" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGradient)" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray="264"
                  className="origin-center -rotate-90"
                  initial={{ strokeDashoffset: 264 }}
                  whileInView={{ strokeDashoffset: 40 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.8, ease: easeOutExpo }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute">
                <span className="text-2xl font-black font-number bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">85</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Health Score</p>
          </div>

          {/* Metric cards grid */}
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`p-3 rounded-xl ${m.bg} border ${m.border} text-center cursor-default`}
              >
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{m.label}</p>
                <p className={`text-lg font-black font-number ${m.color}`}>{m.value}</p>
                {m.unit && <p className="text-[8px] text-slate-400 font-semibold">{m.unit}</p>}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating notification (floats above surface in 3D) */}
        <motion.div
          style={{ transform: 'translateZ(80px)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{ opacity: { delay: 1.5, duration: 0.5 }, x: { delay: 1.5 }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute -left-8 top-12 glass-card rounded-xl p-3 shadow-lg max-w-[160px] hidden xl:block"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 text-emerald-500" />
            </div>
            <p className="text-[9px] font-bold text-slate-600 dark:text-slate-300 leading-tight">All vitals within healthy range</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ========================================== */
/*  Marquee Badge Strip                        */
/* ========================================== */
export const MarqueeStrip: React.FC<{ items: string[] }> = ({ items }) => {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6 border-y border-slate-200 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/30 backdrop-blur-sm group">
      <div className="marquee-track gap-6">
        {doubled.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.08, y: -2, boxShadow: '0 0 15px rgba(6, 182, 212, 0.6)' }}
            className="relative flex items-center gap-3 px-5 py-2 rounded-full bg-white dark:bg-slate-900 whitespace-nowrap flex-shrink-0 cursor-default shadow-md"
          >
            <div className="pill-border-glow" />
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 relative z-10" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors relative z-10">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ========================================== */
/*  Stat Counter (Glassmorphic)                */
/* ========================================== */
export const StatCounter: React.FC<{ stat: { label: string; value: number; suffix: string; gradient: string }; index?: number }> = ({ stat, index = 0 }) => {
  const { ref, value } = useCountUp(stat.value);
  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: easeOutExpo }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="glass-card rounded-2xl p-6 text-center cursor-default"
    >
      <div className={`text-3xl md:text-4xl font-black font-number bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
        {value}{stat.suffix}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-2">
        {stat.label}
      </div>
    </motion.div>
  );
};

/* ========================================== */
/*  Bento Feature Card (mouse-follow spotlight)*/
/* ========================================== */
export const BentoFeatureCard: React.FC<{
  feature: { icon: React.ComponentType<any>; rgb: string; title: string; desc: string; span: string };
  index: number;
}> = ({ feature, index }) => {
  const Icon = feature.icon;
  const isHero = feature.span.includes('col-span-2');
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: easeOutExpo }}
      className={`bento-card ${feature.span} p-8 backdrop-blur-sm relative group`}
      style={{ '--bento-rgb': feature.rgb } as React.CSSProperties}
    >
      <div className="bento-border-glow" />
      <div
        className="bento-spotlight"
        style={{ background: `radial-gradient(400px circle at ${spot.x}% ${spot.y}%, rgba(${feature.rgb}, 0.12), transparent 55%)` }}
      />

      <div className={`relative z-10 ${isHero ? 'flex flex-col md:flex-row md:items-center gap-6' : ''}`}>
        <motion.div
          className={`p-3.5 rounded-2xl inline-flex ${isHero ? 'md:p-5' : ''}`}
          style={{ backgroundColor: `rgba(${feature.rgb}, 0.1)`, color: `rgb(${feature.rgb})` }}
          whileHover={{ scale: 1.15, rotate: 8 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Icon className={`${isHero ? 'w-8 h-8' : 'w-6 h-6'}`} />
        </motion.div>

        <div className={isHero ? 'flex-1' : 'mt-5'}>
          <h3 className={`font-heading font-bold text-slate-800 dark:text-slate-100 ${isHero ? 'text-2xl' : 'text-lg'} mb-2`}>
            {feature.title}
          </h3>
          <p className={`text-slate-500 dark:text-slate-400 leading-relaxed ${isHero ? 'text-sm' : 'text-xs'}`}>
            {feature.desc}
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500 group-hover:h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, rgb(${feature.rgb}), transparent)`, opacity: 0.4 }}
      />
    </motion.div>
  );
};

/* ========================================== */
/*  Timeline Step (Vertical)                   */
/* ========================================== */
const stepColorMap: Record<string, string> = { indigo: '99, 102, 241', purple: '168, 85, 247', cyan: '6, 182, 212' };

export const TimelineStep: React.FC<{
  step: { num: number; color: string; icon: string; title: string; desc: string };
  index: number;
  isLast: boolean;
}> = ({ step, index, isLast }) => {
  const Icon = iconMap[step.icon];
  const rgb = stepColorMap[step.color];
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: easeOutExpo }}
      className={`relative flex items-start gap-6 md:gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
    >
      <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'} text-left`}>
        <motion.div
          whileHover={{ scale: 1.03, y: -3 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`glass-card rounded-2xl p-6 inline-block ${isEven ? 'md:ml-auto' : ''}`}
        >
          <div className="flex items-center gap-3 mb-3" style={{ flexDirection: isEven ? 'row-reverse' : 'row' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `rgba(${rgb}, 0.1)`, color: `rgb(${rgb})` }}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100">{step.title}</h3>
          </div>
          <p className={`text-slate-500 dark:text-slate-400 text-sm leading-relaxed ${isEven ? 'md:text-right' : ''}`}>{step.desc}</p>
        </motion.div>
      </div>

      <div className="flex flex-col items-center flex-shrink-0 absolute left-0 md:relative md:left-auto">
        <motion.div
          className="w-10 h-10 rounded-full text-white font-black flex items-center justify-center text-sm shadow-lg z-10"
          style={{ backgroundColor: `rgb(${rgb})`, boxShadow: `0 0 20px rgba(${rgb}, 0.4)` }}
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: index * 0.15 + 0.2 }}
        >
          {step.num}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
            style={{ originY: 0 }}
            className="w-[2px] flex-1 min-h-[60px] bg-gradient-to-b from-slate-300 dark:from-slate-700 to-transparent"
          />
        )}
      </div>

      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

/* ========================================== */
/*  Testimonial Card (for carousel)            */
/* ========================================== */
export const TestimonialCard: React.FC<{
  t: { text: string; name: string; location: string; initials: string; gradient: string };
}> = ({ t }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="glass-card rounded-2xl p-6 w-[340px] flex-shrink-0 flex flex-col justify-between mx-3"
  >
    <div>
      <div className="flex gap-1 text-amber-500 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />)}
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">{t.text}</p>
    </div>
    <div className="flex items-center gap-3 mt-6 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-[10px] font-black shadow-sm`}>
        {t.initials}
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.name}</h4>
        <p className="text-[10px] text-slate-400 font-semibold">{t.location}</p>
      </div>
    </div>
  </motion.div>
);

/* ========================================== */
/*  FAQ Accordion Item                         */
/* ========================================== */
export const FAQItem: React.FC<{ q: string; a: string; index: number }> = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`glass-card rounded-2xl overflow-hidden transition-shadow ${open ? 'shadow-lg shadow-purple-500/5' : ''}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <span className="font-heading font-bold text-sm text-slate-800 dark:text-slate-100 pr-4">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0, backgroundColor: open ? 'rgba(139,92,246,0.1)' : undefined }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-purple-500 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
