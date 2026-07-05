import { ScanLine, Stethoscope, Brain, Eye, Scan } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const scanConfigs: Record<string, {
  icon: LucideIcon;
  rgb: string;
  colorHex: string;
  textClass: string;
  bgClass: string;
  gradientClass: string;
  glowClass: string;
}> = {
  skin: {
    icon: ScanLine,
    rgb: '244, 63, 94',
    colorHex: '#f43f5e',
    textClass: 'text-rose-500 dark:text-rose-400',
    bgClass: 'bg-rose-500/15',
    gradientClass: 'from-rose-500 to-pink-500',
    glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  },
  chest: {
    icon: Stethoscope,
    rgb: '14, 165, 233',
    colorHex: '#0ea5e9',
    textClass: 'text-sky-500 dark:text-sky-400',
    bgClass: 'bg-sky-500/15',
    gradientClass: 'from-sky-500 to-cyan-500',
    glowClass: 'shadow-[0_0_15px_rgba(14,165,233,0.3)]',
  },
  mri: {
    icon: Brain,
    rgb: '139, 92, 246',
    colorHex: '#8b5cf6',
    textClass: 'text-violet-500 dark:text-violet-400',
    bgClass: 'bg-violet-500/15',
    gradientClass: 'from-violet-500 to-purple-500',
    glowClass: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
  },
  retina: {
    icon: Eye,
    rgb: '245, 158, 11',
    colorHex: '#f59e0b',
    textClass: 'text-amber-500 dark:text-amber-400',
    bgClass: 'bg-amber-500/15',
    gradientClass: 'from-amber-500 to-orange-500',
    glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  },
  oral: {
    icon: Scan,
    rgb: '16, 185, 129',
    colorHex: '#10b981',
    textClass: 'text-emerald-500 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/15',
    gradientClass: 'from-emerald-500 to-teal-500',
    glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  },
};
