import {
  Eye,
  Brain,
  Stethoscope,
  ScanLine,
  Bone,
  Microscope,
  Droplets,
  CircleDot
} from 'lucide-react';
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
  // 1. Diabetic Retinopathy Detection
  retinopathy: {
    icon: Eye,
    rgb: '245, 158, 11',
    colorHex: '#f59e0b',
    textClass: 'text-amber-500 dark:text-amber-400',
    bgClass: 'bg-amber-500/15',
    gradientClass: 'from-amber-500 to-orange-500',
    glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  },

  // 2. Alzheimer's Disease Detection
  alzheimer: {
    icon: Brain,
    rgb: '139, 92, 246',
    colorHex: '#8b5cf6',
    textClass: 'text-violet-500 dark:text-violet-400',
    bgClass: 'bg-violet-500/15',
    gradientClass: 'from-violet-500 to-purple-500',
    glowClass: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
  },

  // 3. Brain Tumor Grade Classification
  brain_tumor: {
    icon: Brain,
    rgb: '217, 70, 239',
    colorHex: '#d946ef',
    textClass: 'text-fuchsia-500 dark:text-fuchsia-400',
    bgClass: 'bg-fuchsia-500/15',
    gradientClass: 'from-fuchsia-500 to-pink-600',
    glowClass: 'shadow-[0_0_15px_rgba(217,70,239,0.3)]',
  },

  // 4. Lung Cancer Detection
  lung_cancer: {
    icon: Stethoscope,
    rgb: '239, 68, 68',
    colorHex: '#ef4444',
    textClass: 'text-red-500 dark:text-red-400',
    bgClass: 'bg-red-500/15',
    gradientClass: 'from-red-500 to-rose-600',
    glowClass: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  },

  // 5. Dry Eye Disease Severity Prediction
  dry_eye: {
    icon: Droplets,
    rgb: '14, 165, 233',
    colorHex: '#0ea5e9',
    textClass: 'text-sky-500 dark:text-sky-400',
    bgClass: 'bg-sky-500/15',
    gradientClass: 'from-sky-500 to-cyan-500',
    glowClass: 'shadow-[0_0_15px_rgba(14,165,233,0.3)]',
  },

  // 6. Keratoconus Early Detection
  keratoconus: {
    icon: CircleDot,
    rgb: '20, 184, 166',
    colorHex: '#14b8a6',
    textClass: 'text-teal-500 dark:text-teal-400',
    bgClass: 'bg-teal-500/15',
    gradientClass: 'from-teal-500 to-emerald-500',
    glowClass: 'shadow-[0_0_15px_rgba(20,184,166,0.3)]',
  },

  // 7. Skin Disease Classification
  skin_disease: {
    icon: ScanLine,
    rgb: '244, 63, 94',
    colorHex: '#f43f5e',
    textClass: 'text-rose-500 dark:text-rose-400',
    bgClass: 'bg-rose-500/15',
    gradientClass: 'from-rose-500 to-pink-500',
    glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  },

  // 8. Pneumonia Detection
  pneumonia: {
    icon: Stethoscope,
    rgb: '59, 130, 246',
    colorHex: '#3b82f6',
    textClass: 'text-blue-500 dark:text-blue-400',
    bgClass: 'bg-blue-500/15',
    gradientClass: 'from-blue-500 to-indigo-500',
    glowClass: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  },

  // 9. Bone Fracture Detection
  bone_fracture: {
    icon: Bone,
    rgb: '234, 88, 12',
    colorHex: '#ea580c',
    textClass: 'text-orange-500 dark:text-orange-400',
    bgClass: 'bg-orange-500/15',
    gradientClass: 'from-orange-500 to-amber-500',
    glowClass: 'shadow-[0_0_15px_rgba(234,88,12,0.3)]',
  },

  // 10. Tuberculosis Detection
  tuberculosis: {
    icon: Microscope,
    rgb: '132, 204, 22',
    colorHex: '#84cc16',
    textClass: 'text-lime-500 dark:text-lime-400',
    bgClass: 'bg-lime-500/15',
    gradientClass: 'from-lime-500 to-emerald-600',
    glowClass: 'shadow-[0_0_15px_rgba(132,204,22,0.3)]',
  },

  // Aliases for backward compatibility
  retina: {
    icon: Eye,
    rgb: '245, 158, 11',
    colorHex: '#f59e0b',
    textClass: 'text-amber-500 dark:text-amber-400',
    bgClass: 'bg-amber-500/15',
    gradientClass: 'from-amber-500 to-orange-500',
    glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  },
  mri: {
    icon: Brain,
    rgb: '217, 70, 239',
    colorHex: '#d946ef',
    textClass: 'text-fuchsia-500 dark:text-fuchsia-400',
    bgClass: 'bg-fuchsia-500/15',
    gradientClass: 'from-fuchsia-500 to-pink-600',
    glowClass: 'shadow-[0_0_15px_rgba(217,70,239,0.3)]',
  },
  chest: {
    icon: Stethoscope,
    rgb: '59, 130, 246',
    colorHex: '#3b82f6',
    textClass: 'text-blue-500 dark:text-blue-400',
    bgClass: 'bg-blue-500/15',
    gradientClass: 'from-blue-500 to-indigo-500',
    glowClass: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  },
  skin: {
    icon: ScanLine,
    rgb: '244, 63, 94',
    colorHex: '#f43f5e',
    textClass: 'text-rose-500 dark:text-rose-400',
    bgClass: 'bg-rose-500/15',
    gradientClass: 'from-rose-500 to-pink-500',
    glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  },
  bone: {
    icon: Bone,
    rgb: '234, 88, 12',
    colorHex: '#ea580c',
    textClass: 'text-orange-500 dark:text-orange-400',
    bgClass: 'bg-orange-500/15',
    gradientClass: 'from-orange-500 to-amber-500',
    glowClass: 'shadow-[0_0_15px_rgba(234,88,12,0.3)]',
  }
};
