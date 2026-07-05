import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { fadeUp } from './motion';

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  rgb: string;              // "6, 182, 212"
  textClass: string;        // "text-cyan-500 dark:text-cyan-400"
  ctaLabel?: string;
  badge?: string;
  onClick?: () => void;
  children?: React.ReactNode; // for stat values / custom footers
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon, title, desc, rgb, textClass, ctaLabel, badge, onClick, children,
}) => {
  // spotlight follows cursor
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
  }, []);

  return (
    <motion.button
      variants={fadeUp}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.98 }}
      style={{ '--card-accent-rgb': rgb } as React.CSSProperties}
      className="feature-card group relative p-5 rounded-2xl flex flex-col justify-between text-left touch-target w-full"
    >
      {badge && (
        <span
          className="absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full border"
          style={{
            borderColor: `rgba(${rgb}, .3)`,
            backgroundColor: `rgba(${rgb}, .1)`,
            color: `rgb(${rgb})`,
          }}
        >
          {badge}
        </span>
      )}
      <div className="space-y-3 relative z-10">
        <motion.div
          className="w-12 h-12 flex items-center justify-center rounded-xl"
          style={{ backgroundColor: `rgba(${rgb}, .15)` }}
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Icon className={`w-6 h-6 ${textClass}`} />
        </motion.div>
        <h3 className="font-heading font-bold text-base text-foreground leading-snug">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed min-h-[32px]">{desc}</p>
      </div>
      {children}
      {ctaLabel && (
        <div className="mt-5 pt-3 border-t border-border/60 relative z-10">
          <span className={`text-xs font-bold ${textClass} flex items-center gap-1`}>
            {ctaLabel}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      )}
    </motion.button>
  );
};

export default React.memo(FeatureCard);
