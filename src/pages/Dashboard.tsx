import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../context/LanguageContext';
import { useHealthRead } from '../context/HealthReadContext';
import { useHealthDispatch } from '../context/HealthDispatchContext';
import {
  Bot,
  Activity,
  Heart,
  Droplet,
  Search,
  Video,
  Building2,
  FileText,
  PhoneCall,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Stethoscope,
  Scan,
  Shield,
  X,
  UserCheck,
  ChevronRight,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { healthScore, todaySnapshot } = useHealthRead();
  const { logWater, logMood } = useHealthDispatch();
  const navigate = useNavigate();

  const [activeDoctorTab, setActiveDoctorTab] = useState<'video' | 'clinic'>('video');
  const [selectedScheme, setSelectedScheme] = useState<'ayushman' | 'bsky' | null>(null);
  const [showSosModal, setShowSosModal] = useState(false);
  const [waterFlash, setWaterFlash] = useState(false);
  const [moodFlash, setMoodFlash] = useState<string | null>(null);
  const [doctorSearch, setDoctorSearch] = useState('');

  // Localized greetings
  const greeting = useMemo(() => {
    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || (language === 'or' ? 'ଅଞ୍ଜଳି ଶର୍ମା' : language === 'hi' ? 'अंजलि शर्मा' : 'Anjali Sharma');
    return name;
  }, [user, language]);

  const languages: { code: Language; label: string; name: string }[] = [
    { code: 'en', label: 'English', name: 'English' },
    { code: 'hi', label: 'हिन्दी', name: 'हिन्दी' },
    { code: 'or', label: 'ଓଡ଼ିଆ', name: 'ଓଡ଼ିଆ' }
  ];

  // Predictor Matrix Config
  const PREDICTORS = [
    { id: 'diabetes', title: 'Diabetes Risk', value: '80%', trend: 'up', path: '/predictors/diabetes', color: 'from-cyan-500/20 to-blue-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    { id: 'ecg', title: 'Hypertension', value: '70%', trend: 'up', path: '/predictors/ecg', color: 'from-indigo-500/20 to-violet-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    { id: 'heart', title: 'Heart Health', value: '91%', trend: 'down', path: '/predictors/heart-attack', color: 'from-rose-500/20 to-red-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    { id: 'liver', title: 'Liver Function', value: '83%', trend: 'up', path: '/predictors/liver', color: 'from-amber-500/20 to-orange-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    { id: 'kidney', title: 'Kidney Health', value: '88%', trend: 'up', path: '/predictors/kidney', color: 'from-teal-500/20 to-emerald-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
    { id: 'thyroid', title: 'Thyroid / Mood', value: '76%', trend: 'down', path: '/predictors/thyroid', color: 'from-purple-500/20 to-fuchsia-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    { id: 'anemia', title: 'Anemia Screen', value: '85%', trend: 'up', path: '/predictors/anemia', color: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    { id: 'cancer', title: 'Cancer Screener', value: '94%', trend: 'down', path: '/predictors/cancer', color: 'from-pink-500/20 to-rose-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  ];

  const MOODS = [
    { emoji: '😀', label: 'Great', value: 'Great' },
    { emoji: '🙂', label: 'Good', value: 'Good' },
    { emoji: '😐', label: 'Okay', value: 'Okay' },
    { emoji: '😕', label: 'Low', value: 'Low' },
    { emoji: '😢', label: 'Awful', value: 'Awful' },
  ];

  const handleWaterClick = () => {
    logWater(1);
    setWaterFlash(true);
    setTimeout(() => setWaterFlash(false), 1200);
  };

  const handleMoodClick = (mood: string) => {
    logMood(mood);
    setMoodFlash(mood);
    setTimeout(() => setMoodFlash(null), 1200);
  };

  const displayScore = healthScore || 88;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-3 sm:p-5 md:p-6 font-body selection:bg-primary/30">
      
      {/* ── Ambient Background Glows ─────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* ═══════════════════════════════════════════════
            TOP ROW: PROFILE, LANG, TREND, HEALTH GAUGE & SOS
        ════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          
          {/* Patient Profile Card (Col 1-4) */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl"
          >
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Arogya Sahayak" className="w-12 h-12 object-contain drop-shadow-md" />
              <div>
                <h2 className="font-heading font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                  Arogya Sahayak
                </h2>
                <p className="text-slate-400 text-xs">Smart • Safe • Supportive</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" 
                  alt="Patient Avatar" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/40"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d1424]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-sm text-slate-100 truncate">{greeting}</span>
                  <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Patient ID: AS-2026</span>
              </div>
            </div>
          </motion.div>

          {/* Multi-Language Selector (Col 5-7) */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-3 bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Multi-Language Selector</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full font-medium">Active</span>
            </div>
            
            <div className="grid grid-cols-3 gap-1.5 bg-[#070b14]/80 p-1.5 rounded-xl border border-slate-800 mt-3">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all text-center outline-none ${
                    language === l.code
                      ? 'bg-gradient-to-r from-primary to-violet-600 text-white shadow-md shadow-primary/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 7-Day Health Trend Sparkline (Col 8-9) */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">7-Day Trend</span>
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {/* Glowing SVG Sparkline */}
            <div className="h-12 w-full my-auto flex items-center">
              <svg viewBox="0 0 100 35" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="trendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,25 Q 20,5 35,20 T 70,10 T 100,5"
                  fill="none"
                  stroke="url(#trendGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-ecg-line"
                />
                <circle cx="100" cy="5" r="4" fill="#34d399" className="animate-ping opacity-75" />
                <circle cx="100" cy="5" r="3" fill="#34d399" />
              </svg>
            </div>
          </motion.div>

          {/* Health Score Gauge & 1-Click SOS (Col 10-12) */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3 flex flex-col gap-3"
          >
            {/* Circular Health Score Card */}
            <div className="flex-1 bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between shadow-xl relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Health Score</span>
                <span className="text-xs font-extrabold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  EXCELLENT
                </span>
              </div>

              {/* Glowing Circle Gauge */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeDasharray={`${displayScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-heading font-extrabold text-xl text-white">
                  {displayScore}
                </span>
              </div>
            </div>

            {/* 1-Click 108 SOS Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSosModal(true)}
              className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-heading font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/30 border border-rose-400/30 transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <PhoneCall className="w-4 h-4 text-white" />
              </div>
              <span className="tracking-wide">1-Click 108 SOS Emergency</span>
            </motion.button>
          </motion.div>

        </div>


        {/* ═══════════════════════════════════════════════
            MAIN BENTO GRID: SECTION 1 (TRIAGE) & SECTION 2 (PREDICTORS)
        ════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          
          {/* Card 1: AI Clinical Triage Assistant (Col 1-5) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/chat')}
            className="lg:col-span-5 bg-gradient-to-br from-violet-950/70 via-[#0d1424] to-[#070b14] border border-violet-500/40 hover:border-violet-400/70 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-violet-950/40 relative overflow-hidden group cursor-pointer flex flex-col justify-between"
          >
            {/* Glowing Orbs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-fuchsia-500/15 rounded-full blur-2xl group-hover:bg-fuchsia-500/25 transition-all" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-600/15 rounded-full blur-2xl group-hover:bg-violet-600/25 transition-all" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    AI Clinical Triage Assistant
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> 24/7 Live
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
                Describe clinical symptoms, get instant triage analysis, home care remedies, and verified specialist recommendations.
              </p>

              {/* 3-Step Workflow Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center group-hover:border-violet-400/40 transition-colors">
                  <Stethoscope className="w-4 h-4 text-violet-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-200 block">Symptoms</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center group-hover:border-violet-400/40 transition-colors">
                  <Activity className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-200 block">Analysis</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center group-hover:border-violet-400/40 transition-colors">
                  <FileText className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-200 block">Guidance</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-4 border-t border-violet-500/20 flex items-center justify-between text-xs font-bold text-violet-300 group-hover:text-white transition-colors">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                Start AI Medical Consultation
              </span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: AI Predictors Matrix (Col 6-12) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-7 bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
                  AI Predictors Matrix
                </h3>
              </div>
              <button 
                onClick={() => navigate('/predictors')} 
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors outline-none"
              >
                <span>View All 8 Models</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 8-Tile Predictors Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
              {PREDICTORS.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(p.path)}
                  className={`bg-gradient-to-br ${p.color} border ${p.border} rounded-xl p-3 cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between`}
                >
                  <span className="text-[11px] font-semibold text-slate-300 truncate">{p.title}</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="font-heading font-extrabold text-lg text-white">{p.value}</span>
                    {p.trend === 'up' ? (
                      <ArrowUpRight className={`w-4 h-4 ${p.text}`} />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>


        {/* ═══════════════════════════════════════════════
            BOTTOM BENTO GRID: SECTION 3 (TRACKERS), SECTION 4 (DOCTORS), SECTION 5 (SCANNER), SECTION 6 (SCHEMES)
        ════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
          
          {/* Card 3: Real-Time Health Trackers (Col 1-3) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="font-heading font-extrabold text-sm text-white">Real-Time Trackers</h3>
              </div>
              <button 
                onClick={() => navigate('/trackers')} 
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 outline-none"
              >
                Hub &rarr;
              </button>
            </div>

            {/* Heart Rate + Live Wave */}
            <div className="bg-[#070b14]/80 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" /> Heart Rate
                </span>
                <span className="font-heading font-extrabold text-rose-400">72 bpm</span>
              </div>
              <div className="h-8 w-full mt-1.5 flex items-center">
                <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
                  <path
                    d="M 0,10 L 25,10 L 30,2 L 35,18 L 40,5 L 45,14 L 50,10 L 100,10"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-ecg-line"
                  />
                </svg>
              </div>
            </div>

            {/* Water Hydration Quick-Log */}
            <div className="bg-[#070b14]/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-slate-400 text-xs flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" /> Water Hydration
                </span>
                <span className="font-heading font-extrabold text-cyan-300 text-sm">
                  {todaySnapshot.water || 5}/8 glasses
                </span>
              </div>
              <button
                onClick={handleWaterClick}
                className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold transition-all active:scale-95 outline-none"
              >
                {waterFlash ? '✓ Added!' : '+1 Glass'}
              </button>
            </div>

            {/* Mood Journal Quick Tap */}
            <div className="bg-[#070b14]/80 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Mood Journal</span>
                <span className="text-emerald-400 font-bold">{moodFlash ? `✓ ${moodFlash}` : 'Tap to Log'}</span>
              </div>
              <div className="flex items-center justify-between">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => handleMoodClick(m.value)}
                    className="text-lg hover:scale-125 active:scale-95 transition-transform p-1 rounded-lg hover:bg-slate-800 outline-none"
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 4: Find & Book Doctors (Col 4-6) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-3 bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-extrabold text-sm text-white">Find & Book Doctors</h3>
              </div>
              <button 
                onClick={() => navigate('/doctors')} 
                className="text-[11px] font-bold text-primary hover:text-primary/80 outline-none"
              >
                Directory &rarr;
              </button>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1.5 bg-[#070b14]/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveDoctorTab('video')}
                className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all outline-none ${
                  activeDoctorTab === 'video'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Consult</span>
              </button>
              <button
                onClick={() => setActiveDoctorTab('clinic')}
                className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all outline-none ${
                  activeDoctorTab === 'clinic'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>In-Clinic</span>
              </button>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                placeholder="Search specialty, name, city..."
                className="w-full bg-[#070b14]/80 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-primary/60"
              />
            </div>

            {/* Doctor Preview Mini-Card */}
            <div className="bg-[#070b14]/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"
                  alt="Doctor"
                  className="w-9 h-9 rounded-full object-cover border border-cyan-500/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Dr. Priya Sharma</h4>
                  <p className="text-[10px] text-slate-400">Cardiology Specialist &bull; 4.9 &#9733;</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/doctors')}
                className="px-2.5 py-1.5 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 text-white rounded-lg text-[11px] font-bold shadow-sm outline-none"
              >
                Book
              </button>
            </div>
          </motion.div>

          {/* Card 5: Prescription & Lab Report Scanner (Col 7-9) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/scan/prescription')}
            className="lg:col-span-3 bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-extrabold text-sm text-white">
                Prescription Scanner
              </h3>
            </div>

            {/* Document with Laser Scan Animation */}
            <div className="relative my-3 w-full h-24 bg-[#070b14]/80 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
              {/* Document Mock */}
              <div className="w-16 h-20 bg-white/10 border border-white/20 rounded-md p-1.5 space-y-1">
                <div className="w-6 h-1.5 bg-cyan-400/60 rounded" />
                <div className="w-12 h-1 bg-slate-500/40 rounded" />
                <div className="w-10 h-1 bg-slate-500/40 rounded" />
                <div className="w-8 h-1 bg-slate-500/40 rounded" />
              </div>

              {/* Animated Laser Scanning Line */}
              <div className="absolute left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_8px_#f43f5e] animate-laser-scan" />
            </div>

            <div>
              <span className="text-xs font-bold text-white block">Instant OCR Analysis</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Digitize paper prescriptions and lab reports in seconds.</p>
            </div>
          </motion.div>

          {/* Card 6: Government Health Schemes (Col 10-12) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="lg:col-span-3 bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="font-heading font-extrabold text-sm text-white">Government Schemes</h3>
            </div>

            {/* Ayushman Bharat PM-JAY Tile */}
            <div 
              onClick={() => setSelectedScheme('ayushman')}
              className="bg-[#070b14]/80 hover:bg-slate-800/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  Ayushman Bharat (PM-JAY)
                </span>
                <span className="text-[10px] text-emerald-400 block font-medium group-hover:underline">
                  Free ₹5 Lakh Coverage &rarr;
                </span>
              </div>
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-[10px] border border-emerald-500/30">
                IN
              </span>
            </div>

            {/* BSKY Odisha Tile */}
            <div 
              onClick={() => setSelectedScheme('bsky')}
              className="bg-[#070b14]/80 hover:bg-slate-800/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  BSKY (Odisha Health)
                </span>
                <span className="text-[10px] text-cyan-400 block font-medium group-hover:underline">
                  Cashless Hospital Card &rarr;
                </span>
              </div>
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-extrabold text-[10px] border border-cyan-500/30">
                OD
              </span>
            </div>
          </motion.div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════════
          MODAL: EMERGENCY 108 SOS DISPATCH
      ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSosModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0d1424] border-2 border-rose-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="font-heading font-extrabold text-lg">Emergency 108 SOS</h3>
                </div>
                <button 
                  onClick={() => setShowSosModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If you or someone around you is experiencing severe symptoms (chest pain, breathing difficulty, severe trauma), connect to official emergency responders immediately:
              </p>

              <div className="space-y-2">
                <a
                  href="tel:108"
                  className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 108 Ambulance Dispatch</span>
                </a>

                <a
                  href="tel:112"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>National Emergency Helpline (112)</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          MODAL: GOVERNMENT SCHEMES DETAILS (PM-JAY & BSKY)
      ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0d1424] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Shield className="w-5 h-5" />
                  <h3 className="font-heading font-extrabold text-base text-white">
                    {selectedScheme === 'ayushman' ? 'Ayushman Bharat PM-JAY' : 'Biju Swasthya Kalyan Yojana (BSKY)'}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedScheme(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedScheme === 'ayushman' ? (
                <div className="space-y-3 text-xs text-slate-300">
                  <p>
                    <strong>Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)</strong> provides cashless health coverage of up to <strong>₹5,00,000 per family per year</strong> for secondary and tertiary care hospitalization across India.
                  </p>
                  <div className="bg-[#070b14] p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">Key Benefits:</span>
                    <p>&bull; 100% cashless treatment at empanelled public and private hospitals nationwide.</p>
                    <p>&bull; Pre-existing conditions covered from day one.</p>
                    <p>&bull; National Toll-Free Helpline: <strong>14555</strong></p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-slate-300">
                  <p>
                    <strong>BSKY (Biju Swasthya Kalyan Yojana)</strong> is the flagship universal healthcare program in Odisha providing cashless treatment up to <strong>₹5 Lakh per family (₹10 Lakh for women members)</strong>.
                  </p>
                  <div className="bg-[#070b14] p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">Key Benefits:</span>
                    <p>&bull; Cashless care in premier hospitals across Odisha and premier tier-1 hospitals in India.</p>
                    <p>&bull; Smart health card cashless admission without paperwork.</p>
                    <p>&bull; State Toll-Free Helpline: <strong>104 / 155369</strong></p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedScheme(null)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Close Scheme Info
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
