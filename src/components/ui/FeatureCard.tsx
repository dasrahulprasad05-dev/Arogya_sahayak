import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronRight, type LucideIcon } from 'lucide-react';

export interface FeatureCardProps {
  icon: LucideIcon | React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  /** @deprecated use `description` — kept for backward-compat */
  desc?: string;
  description?: string;
  rgb: string;              // e.g. "6, 182, 212"
  /** @deprecated use `rgb`-based colour — textClass no longer needed */
  textClass?: string;
  /** @deprecated use `footerLabel` */
  ctaLabel?: string;
  footerLabel?: string;
  badge?: string;
  index?: number;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  desc,
  description,
  rgb,
  ctaLabel,
  footerLabel,
  badge,
  index = 0,
  onClick,
  className = '',
  children,
}) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3-D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 220, damping: 22 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
    // spotlight
    cardRef.current?.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current?.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const label = footerLabel ?? ctaLabel;
  const bodyText = description ?? desc ?? '';

  return (
    <motion.button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={
        {
          '--card-rgb': rgb,
          rotateX,
          rotateY,
          transformPerspective: 800,
        } as React.CSSProperties
      }
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.97 }}
      className={`feature-card group relative text-left rounded-3xl p-6 overflow-hidden touch-target w-full ${className}`}
    >
      {/* rotating conic border ring */}
      <div className="feature-card-border" />
      {/* mouse-follow spotlight */}
      <div className="feature-card-spotlight" />

      {badge && (
        <div
          className="absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full border z-10"
          style={{
            borderColor: `rgba(${rgb}, 0.3)`,
            backgroundColor: `rgba(${rgb}, 0.1)`,
            color: `rgb(${rgb})`,
          }}
        >
          {badge}
        </div>
      )}

      {/* main content lifted 20px in Z */}
      <div className="relative z-10 space-y-4" style={{ transform: 'translateZ(20px)' }}>
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `rgba(${rgb}, 0.15)` }}
          animate={isHovered ? { scale: 1.12, rotate: 8 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Icon className="w-7 h-7" style={{ color: `rgb(${rgb})` } as React.CSSProperties} />
        </motion.div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold font-heading text-foreground leading-snug">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed min-h-[36px]">
            {bodyText}
          </p>
        </div>

        {/* backward-compat slot for extra content (stat values etc.) */}
        {children}
      </div>

      {label && (
        <div
          className="relative z-10 mt-6 pt-4 border-t border-border/60 flex items-center justify-between w-full"
          style={{ transform: 'translateZ(20px)' }}
        >
          <span className="text-xs font-bold flex items-center gap-1" style={{ color: `rgb(${rgb})` }}>
            {label}
            <motion.span
              animate={isHovered ? { x: 4 } : { x: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.span>
          </span>
        </div>
      )}
    </motion.button>
  );
};

export default React.memo(FeatureCard);
