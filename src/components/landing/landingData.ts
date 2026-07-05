import {
  Brain, Activity, Camera, HeartPulse, Shield, Globe,
} from 'lucide-react';

export const floatingMetrics = [
  { label: 'Vitals Check', value: '120/80', unit: 'mmHg', icon: 'Heart', rgb: '99, 102, 241', pos: 'top-24 left-[5%] xl:left-[10%]', delay: 0, float: 'animate-float' },
  { label: 'Oxygenation', value: '98%', unit: 'SpO2', icon: 'Activity', rgb: '16, 185, 129', pos: 'top-40 right-[5%] xl:right-[10%]', delay: 1, float: 'animate-float-slow' },
  { label: 'Sleep Logs', value: '7.5', unit: 'hours', icon: 'Moon', rgb: '168, 85, 247', pos: 'bottom-16 left-[8%] xl:left-[12%]', delay: 2, float: 'animate-float' },
];

export const stats = [
  { label: 'AI Predictors', value: 18, suffix: '+', gradient: 'from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400' },
  { label: 'Wellness Trackers', value: 13, suffix: '', gradient: 'from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400' },
  { label: 'CNN Scanners', value: 5, suffix: '', gradient: 'from-cyan-600 to-rose-600 dark:from-cyan-400 dark:to-rose-400' },
  { label: 'Supported Languages', value: 3, suffix: '', gradient: 'from-rose-600 to-purple-600 dark:from-rose-400 dark:to-purple-400' },
];

export const features = [
  {
    icon: Brain, rgb: '6, 182, 212',
    title: 'AI Symptom Checker',
    desc: 'Gemini AI-powered diagnostic recommendations matching standard triage protocols.',
  },
  {
    icon: Activity, rgb: '168, 85, 247',
    title: 'Wellness Trackers',
    desc: 'Log and monitor sleep quality, hydration, mood indices, medication reminders, and body temperature.',
  },
  {
    icon: Camera, rgb: '244, 63, 94',
    title: 'CNN Image Scan',
    desc: 'On-device chest X-Ray, skin lesion, and eye scans using compiled TensorFlowJS convolutional networks.',
  },
  {
    icon: HeartPulse, rgb: '245, 158, 11',
    title: 'Clinical Predictors',
    desc: 'Screen for diabetes, heart attack probability, kidney health, liver function, and anemia using input vitals indexes.',
  },
  {
    icon: Shield, rgb: '16, 185, 129',
    title: 'Resilient Offline First',
    desc: 'IndexedDB local databases queues vital logs during internet dropouts and syncs bidirectionally on reconnection.',
  },
  {
    icon: Globe, rgb: '99, 102, 241',
    title: 'Made for India',
    desc: 'Fully localized interface available in Odia (ଓଡ଼ିଆ), Hindi (हिन्दी), and English, with localized home remedy recommendations.',
  },
];

export const steps = [
  {
    num: 1, color: 'indigo', icon: 'Activity',
    title: 'Track Daily Health',
    desc: 'Log vitals, sleep, mood, and water intake using specialized premium trackers.',
  },
  {
    num: 2, color: 'purple', icon: 'BrainCircuit',
    title: 'AI Risk Analysis',
    desc: 'Check indicators against clinical algorithms and secure generative model endpoints.',
  },
  {
    num: 3, color: 'cyan', icon: 'Zap',
    title: 'Get Recommendations',
    desc: 'Review Ayush-guided remedies, risk levels, and instant triage procedures.',
  },
];

export const scanTypes = [
  { name: 'Skin Melanoma Detector', color: 'bg-rose-500' },
  { name: 'Chest X-Ray Pneumonia Triage', color: 'bg-cyan-500' },
  { name: 'ECG Rhythm Lead Classifier', color: 'bg-purple-500' },
  { name: 'Oral Mucosal Leukoplakia Triage', color: 'bg-amber-500' },
  { name: 'Cataract Corneal Clouding Screen', color: 'bg-indigo-500' },
];

export const testimonials = [
  {
    text: '"ମୋ ବାପାଙ୍କର ଜଳପାନ ଓ ମନୋଦଶା ଟ୍ରାକ୍ କରିବାରେ ଏହି ଆପ୍ ବହୁତ ସାହାଯ୍ୟ କରିଛି। ଏହାର ଓଡ଼ିଆ ଅନୁବାଦ ମଧ୍ୟ ଅତ୍ୟନ୍ତ ସରଳ ଓ ସୁବିଧାଜନକ ଅଟେ।"',
    name: 'Rahul Das', location: 'Bhubaneswar, Odisha', initials: 'RD', gradient: 'from-indigo-500 to-purple-600',
  },
  {
    text: 'Having the skin scan and X-Ray classifiers load instantly on my phone without transferring pictures is excellent for clinical privacy.',
    name: 'Priya Sharma', location: 'New Delhi, Delhi', initials: 'PS', gradient: 'from-purple-500 to-pink-500',
  },
  {
    text: 'The IndexDB-powered offline logging works perfectly during field diagnostics where internet speeds drop. Reconnecting triggers a clean cloud sync.',
    name: 'Amit Sawant', location: 'Mumbai, Maharashtra', initials: 'AS', gradient: 'from-cyan-500 to-indigo-500',
  },
];
