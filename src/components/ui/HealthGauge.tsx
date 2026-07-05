import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const CIRC = 2 * Math.PI * 60; // r=60

const HealthGauge: React.FC<{ score: number; label?: string }> = ({ score, label = 'Health Score' }) => {
  const reduced = useReducedMotion();
  
  const color = useMemo(() =>
    score < 30 ? '#ef4444' : score < 50 ? '#f59e0b' : score < 80 ? '#14b8a6' : '#10b981',
  [score]);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="72" cy="72" r="68" stroke={color} strokeWidth="1.5" strokeDasharray="4 6"
          fill="none" className="opacity-30"
          style={{ transformOrigin: 'center', animation: reduced ? 'none' : 'spin 30s linear infinite' }} />
        <circle cx="72" cy="72" r="60" strokeWidth="8" fill="none" className="stroke-muted/20" />
        <motion.circle
          cx="72" cy="72" r="60" fill="none" strokeWidth="8" strokeLinecap="round"
          stroke="url(#gaugeGrad)"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: CIRC - (CIRC * score) / 100 }}
          transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedNumber value={score}
          className="text-4xl font-extrabold font-number bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent" />
        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{label}</span>
      </div>
    </div>
  );
};

export default React.memo(HealthGauge);
