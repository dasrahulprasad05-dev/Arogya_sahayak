import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface Props {
  value: number;
  decimals?: number;
  format?: (n: number) => string;
  className?: string;
  suffix?: string;
}

const AnimatedNumber: React.FC<Props> = ({ value, decimals = 0, format, className, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 20 });

  useEffect(() => { mv.set(value); }, [value, mv]);

  useEffect(() => {
    if (reduced) {
      if (ref.current) ref.current.textContent = value.toFixed(decimals) + suffix;
      return;
    }
    return spring.on('change', (v) => {
      if (!ref.current) return;
      const n = Number(v.toFixed(decimals));
      ref.current.textContent = (format ? format(n) : n.toFixed(decimals)) + suffix;
    });
  }, [spring, decimals, format, suffix, reduced, value]);

  return <span ref={ref} className={className}>0{suffix}</span>;
};

export default React.memo(AnimatedNumber);
