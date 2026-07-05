import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from './motion';

interface Props {
  rgb: string;
  className?: string;
  onClick?: () => void;
  hoverLift?: boolean;
  children: React.ReactNode;
}

/** Non-button glass card — safe to put forms/buttons inside. */
const GlassCard: React.FC<Props> = ({ rgb, className = '', onClick, hoverLift = true, children }) => {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
  }, []);

  return (
    <motion.div
      variants={fadeUp}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      whileHover={hoverLift ? { y: -5, transition: { duration: 0.25 } } : undefined}
      style={{ '--card-accent-rgb': rgb } as React.CSSProperties}
      className={`feature-card rounded-2xl relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default React.memo(GlassCard);
