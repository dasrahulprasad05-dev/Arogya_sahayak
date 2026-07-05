import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Activity, ArrowRight, Sun, Moon, Globe, Check, Lock, HeartPulse,
} from 'lucide-react';
import {
  floatingMetrics, stats, features, steps, scanTypes, testimonials,
} from '../components/landing/landingData';
import {
  FloatingMetric, StatCounter, LandingFeatureCard, StepCard, TestimonialCard,
} from '../components/landing/LandingComponents';

/* Reusable scroll-reveal section wrapper */
const Reveal: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = '', id }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.section>
);

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value as any);
  const tagline = t('app.tagline') || 'Your Family Health Companion';
  const mainTitleText = t('landing.title') || 'Stay Healthy With Advanced Preventive Screening';
  const titleWords = mainTitleText.split(' ');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030310] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden flex flex-col font-body">
      <div className="noise-overlay" />

      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" />
      <div className="absolute top-[20%] right-[-10%] w-[550px] h-[550px] bg-purple-500/5 dark:bg-purple-500/15 rounded-full blur-[130px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }} />
      <div className="absolute bottom-[30%] left-[-10%] w-[500px] h-[500px] bg-pink-500/5 dark:bg-pink-500/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }} />
      <div className="absolute bottom-[-5%] right-[10%] w-[520px] h-[520px] bg-indigo-500/5 dark:bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '28s', animationDelay: '-15s' }} />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#030310]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2 bg-primary/10 text-primary rounded-xl">
              <Activity className="w-5.5 h-5.5" />
            </motion.div>
            <span className="font-heading font-extrabold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-transparent outline-none cursor-pointer text-slate-700 dark:text-slate-200 font-bold"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="or">ଓଡ଼ିଆ</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors touch-target"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="bg-primary hover:bg-primary/95 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-md shadow-primary/20 dark:shadow-primary/10"
              >
                {isAuthenticated ? t('nav.dashboard') : t('btn.login')}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <header className="relative pt-16 md:pt-24 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10">
        {floatingMetrics.map((m, i) => <FloatingMetric key={i} metric={m} />)}

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/20 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-black mb-8 tracking-widest uppercase shadow-sm"
        >
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <HeartPulse className="w-4 h-4 shrink-0 text-pink-500" />
          </motion.div>
          <span>{tagline}</span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading tracking-tight leading-[1.1] max-w-5xl">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block bg-gradient-to-r from-purple-700 via-violet-600 to-cyan-600 dark:from-purple-400 dark:via-cyan-400 dark:to-pink-400 bg-clip-text text-transparent"
              style={{ paddingRight: '0.2em' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-xl mt-8 max-w-3xl leading-relaxed font-medium"
        >
          {t('landing.desc') || 'A secure, offline-first clinical assistant bringing generative medical guidance and on-device predictive diagnostics to your fingertips.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3.5 px-9 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-500/40 dark:shadow-[0_0_20px_rgba(168,85,247,0.35)] touch-target group text-sm"
          >
            <span>{t('landing.get_started') || 'Get Started'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#features"
            className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/30 backdrop-blur-md font-bold py-3.5 px-9 rounded-xl text-slate-800 dark:text-slate-200 transition-colors touch-target text-sm"
          >
            Learn More
          </motion.a>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-20 cursor-pointer flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scroll To Explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-400 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </div>
        </motion.div>
      </header>

      {/* Stats Bar */}
      <Reveal className="w-full border-y border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl py-8 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          {stats.map((s, i) => <StatCounter key={i} stat={s} />)}
        </div>
      </Reveal>

      {/* Features */}
      <Reveal id="features" className="py-24 px-6 max-w-7xl mx-auto w-full z-10 relative grid-bg-overlay">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 dark:from-purple-400 dark:via-cyan-400 dark:to-pink-400 bg-clip-text text-transparent">
            {t('landing.features') || 'Core Platform Superpowers'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            Standard clinical indexes and edge-AI engines consolidated into one patient-first healthcare companion.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => <LandingFeatureCard key={i} feature={f} index={i} />)}
        </div>
      </Reveal>

      {/* How It Works */}
      <Reveal className="py-24 px-6 max-w-7xl mx-auto w-full z-10 bg-slate-100/50 dark:bg-slate-950/20 border-y border-slate-200 dark:border-slate-900/60 rounded-3xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Continuous Care Cycle
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            How Aarogya Sahayak works to monitor and triage preventative indicators.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto items-stretch">
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 hidden md:block overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <div className="absolute left-[33px] top-6 bottom-6 w-[3px] bg-slate-200 dark:bg-slate-800 z-0 md:hidden overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          {steps.map((s, i) => <StepCard key={i} step={s} index={i} />)}
        </div>
      </Reveal>

      {/* CNN Showcase */}
      <Reveal className="py-24 px-6 max-w-5xl mx-auto w-full z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl shadow-xl flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
          <div className="space-y-6 lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Images Never Leave Your Device</span>
            </div>
            <h2 className="text-3xl font-black font-heading tracking-tight text-slate-800 dark:text-slate-100 leading-snug">
              Secure On-Device Convolutional Scanning
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
              We compile and ship lightweight convolutional networks (`TensorFlow.js`) straight to your local browser. All scans run instantly on your hardware, ensuring zero photos ever cross our cloud servers.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {['COPPA & HIPAA Compliant Privacy', 'Edge Web Assembly Acceleration'].map(txt => (
                <div key={txt} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700/60">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex flex-col gap-4 relative">
            <div className="relative border border-slate-200 dark:border-rose-500/20 bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl overflow-hidden min-h-[320px] flex flex-col justify-center gap-3">
              <div className="scan-line" />
              {scanTypes.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm z-10"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    On-Device CNN
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Testimonials */}
      <Reveal className="py-24 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight bg-gradient-to-r from-purple-700 to-rose-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Trusted Across Communities
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            Real experiences from families and community workers in India.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => <TestimonialCard key={i} t={t} index={i} />)}
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal className="py-20 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white p-8 md:p-16 text-center shadow-xl">
          <div className="absolute top-[-30%] left-[-20%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] pointer-events-none -z-10 animate-mesh-move" />
          <div className="absolute bottom-[-30%] right-[-20%] w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '20s' }} />

          <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight mb-4 leading-tight">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-purple-100 text-sm md:text-base max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Create your account today, toggle your preferred language, and screen metrics dynamically. No credit card required.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-slate-100 text-primary font-black py-4 px-10 rounded-xl transition-colors shadow-lg shadow-black/20 text-sm"
          >
            Start Free Today
          </motion.button>
        </div>
      </Reveal>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-950/60 py-12 px-6 backdrop-blur-xl z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Activity className="w-5.5 h-5.5" />
              </div>
              <span className="font-heading font-black text-lg text-primary">{t('app.name')}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('app.tagline')}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-400">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-900/60 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
          <span>Made for India 🇮🇳 • Powered by Gemini AI</span>
          <span>&copy; {new Date().getFullYear()} Aarogya Sahayak. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
