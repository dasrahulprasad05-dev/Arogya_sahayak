import {
  Brain, Activity, Camera, HeartPulse, Shield, Globe,
} from 'lucide-react';

/* ---------- Marquee Badges ---------- */
export const marqueeItems = [
  'AI Symptom Checker',
  '18+ Clinical Predictors',
  'Offline-First Architecture',
  '5 CNN Scanners',
  '3 Languages Supported',
  'HIPAA Compliant Privacy',
  'Edge WebAssembly Acceleration',
  'Gemini AI Powered',
  'IndexedDB Sync Engine',
  'TensorFlow.js On-Device',
];

/* ---------- Floating Metrics ---------- */
export const floatingMetrics = [
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'Heart', rgb: '99, 102, 241' },
  { label: 'Oxygenation', value: '98%', unit: 'SpO₂', icon: 'Activity', rgb: '16, 185, 129' },
  { label: 'Sleep Score', value: '7.5', unit: 'hours', icon: 'Moon', rgb: '168, 85, 247' },
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: 'Heart', rgb: '244, 63, 94' },
];

/* ---------- Stats ---------- */
export const stats = [
  { label: 'AI Predictors', value: 18, suffix: '+', gradient: 'from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400' },
  { label: 'Wellness Trackers', value: 13, suffix: '', gradient: 'from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400' },
  { label: 'CNN Scanners', value: 5, suffix: '', gradient: 'from-cyan-600 to-rose-600 dark:from-cyan-400 dark:to-rose-400' },
  { label: 'Supported Languages', value: 3, suffix: '', gradient: 'from-rose-600 to-purple-600 dark:from-rose-400 dark:to-purple-400' },
];

/* ---------- Bento Features ---------- */
export const features = [
  {
    icon: Brain, rgb: '6, 182, 212',
    title: 'AI Symptom Checker',
    desc: 'Gemini AI-powered diagnostic recommendations matching standard triage protocols. Get instant clinical guidance.',
    span: 'md:col-span-2', // Hero card, wider
  },
  {
    icon: Activity, rgb: '168, 85, 247',
    title: 'Wellness Trackers',
    desc: 'Log and monitor sleep quality, hydration, mood indices, medication reminders, and body temperature.',
    span: '',
  },
  {
    icon: Camera, rgb: '244, 63, 94',
    title: 'CNN Image Scan',
    desc: 'On-device chest X-Ray, skin lesion, and eye scans using compiled TensorFlowJS convolutional networks.',
    span: '',
  },
  {
    icon: HeartPulse, rgb: '245, 158, 11',
    title: 'Clinical Predictors',
    desc: 'Screen for diabetes, heart attack probability, kidney health, liver function, and anemia using input vitals.',
    span: '',
  },
  {
    icon: Shield, rgb: '16, 185, 129',
    title: 'Resilient Offline First',
    desc: 'IndexedDB queues vital logs during internet dropouts and syncs bidirectionally on reconnection.',
    span: '',
  },
  {
    icon: Globe, rgb: '99, 102, 241',
    title: 'Made for India',
    desc: 'Fully localized in Odia (ଓଡ଼ିଆ), Hindi (हिन्दी), and English, with Ayush home remedy recommendations.',
    span: 'md:col-span-2', // Wide card at bottom
  },
];

/* ---------- Steps ---------- */
export const steps = [
  {
    num: 1, color: 'indigo', icon: 'Activity',
    title: 'Track Daily Health',
    desc: 'Log vitals, sleep, mood, and water intake using specialized premium trackers designed for daily use.',
  },
  {
    num: 2, color: 'purple', icon: 'BrainCircuit',
    title: 'AI Risk Analysis',
    desc: 'Check indicators against clinical algorithms and secure generative model endpoints for risk scoring.',
  },
  {
    num: 3, color: 'cyan', icon: 'Zap',
    title: 'Get Recommendations',
    desc: 'Review Ayush-guided remedies, risk levels, and instant triage procedures personalized to your profile.',
  },
];

/* ---------- Scan Types ---------- */
export const scanTypes = [
  { name: 'Skin Melanoma Detector', color: 'bg-rose-500' },
  { name: 'Chest X-Ray Pneumonia Triage', color: 'bg-cyan-500' },
  { name: 'ECG Rhythm Lead Classifier', color: 'bg-purple-500' },
  { name: 'Oral Mucosal Leukoplakia Triage', color: 'bg-amber-500' },
  { name: 'Cataract Corneal Clouding Screen', color: 'bg-indigo-500' },
];

/* ---------- Testimonials ---------- */
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

/* ---------- FAQ ---------- */
export const faqItems = [
  {
    q: 'Is my health data secure and private?',
    a: 'All CNN image scans run entirely on your device using TensorFlow.js — no photos ever leave your browser. Health logs are encrypted in IndexedDB locally and only sync to your authenticated cloud account when connected.',
  },
  {
    q: 'Does Aarogya Sahayak work without internet?',
    a: 'Yes. The app is built offline-first. All wellness trackers, CNN scanners, and clinical predictors function without internet. Data syncs bidirectionally when connectivity resumes.',
  },
  {
    q: 'What languages are supported?',
    a: 'The entire interface is available in English, Hindi (हिन्दी), and Odia (ଓଡ଼ିଆ). All labels, descriptions, and home remedy recommendations are fully localized.',
  },
  {
    q: 'How accurate are the AI predictions?',
    a: 'Our clinical predictors use peer-reviewed medical indices (Framingham, MDRD-GFI, etc.). CNN models are trained on publicly validated medical imaging datasets. Results are for screening guidance — always consult a physician.',
  },
  {
    q: 'Is this app free to use?',
    a: 'Yes, Aarogya Sahayak is completely free. No credit card, no premium tiers, no hidden costs. Built as an open healthcare initiative for Indian communities.',
  },
];
