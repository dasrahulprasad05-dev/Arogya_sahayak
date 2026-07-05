import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Activity, ArrowRight, Sun, Moon, Globe, Check, Lock, HeartPulse, HelpCircle,
} from 'lucide-react';
import {
  marqueeItems, stats, features, steps, scanTypes, testimonials, faqItems,
} from '../components/landing/landingData';
import {
  FloatingDashboard, MarqueeStrip, StatCounter, BentoFeatureCard,
  TimelineStep, TestimonialCard, FAQItem,
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

/* Section heading helper */
const SectionTitle: React.FC<{ title: string; subtitle: string; gradient?: string }> = ({
  title, subtitle, gradient = 'from-purple-700 via-indigo-600 to-cyan-600 dark:from-purple-400 dark:via-cyan-400 dark:to-pink-400',
}) => (
  <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
    <h2 className={`text-3xl md:text-5xl font-black font-heading tracking-tight bg-gradient-to-r ${gradient} bg-clip-text text-transparent leading-tight`}>
      {title}
    </h2>
    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
      {subtitle}
    </p>
  </div>
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
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-mesh-move" />
      <div className="absolute top-[20%] right-[-10%] w-[550px] h-[550px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }} />
      <div className="absolute bottom-[40%] left-[20%] w-[500px] h-[500px] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }} />
      <div className="absolute bottom-[-5%] right-[10%] w-[520px] h-[520px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '28s', animationDelay: '-15s' }} />

      {/* ===== Navbar ===== */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 w-full bg-white/70 dark:bg-[#030310]/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/40"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 text-primary rounded-xl border border-purple-500/10">
              <Activity className="w-5 h-5" />
            </motion.div>
            <span className="font-heading font-extrabold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 glass-card rounded-xl px-3 py-1.5 text-xs font-semibold">
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
              className="p-2.5 rounded-xl glass-card text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors touch-target"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2 px-5 rounded-xl text-xs transition-all shadow-md shadow-purple-500/20 dark:shadow-purple-500/10"
              >
                {isAuthenticated ? t('nav.dashboard') : t('btn.login')}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ===== Hero — Split Layout ===== */}
      <header className="relative pt-12 md:pt-20 pb-8 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="dot-grid absolute inset-0 -z-10 opacity-40" />

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-xs font-black mb-8 tracking-widest uppercase"
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <HeartPulse className="w-4 h-4 shrink-0 text-pink-500" />
              </motion.div>
              <span className="text-purple-600 dark:text-purple-400">{tagline}</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.08]">
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg mt-6 leading-relaxed font-medium"
            >
              {t('landing.desc') || 'A secure, offline-first clinical assistant bringing generative medical guidance and on-device predictive diagnostics to your fingertips.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 items-center lg:items-start justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3.5 px-9 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/30 dark:shadow-[0_0_20px_rgba(168,85,247,0.3)] touch-target group text-sm"
              >
                <span>{t('landing.get_started') || 'Get Started'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#features"
                className="glass-card font-bold py-3.5 px-9 rounded-xl text-slate-800 dark:text-slate-200 transition-all touch-target text-sm hover:shadow-lg"
              >
                Learn More
              </motion.a>
            </motion.div>
          </div>

          {/* Right: Floating Dashboard */}
          <div className="flex-1 w-full max-w-lg lg:max-w-md xl:max-w-lg">
            <FloatingDashboard />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scroll To Explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </div>
        </motion.div>
      </header>

      {/* ===== Marquee Strip ===== */}
      <MarqueeStrip items={marqueeItems} />

      {/* ===== Stats Bar ===== */}
      <Reveal className="py-16 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => <StatCounter key={i} stat={s} />)}
        </div>
      </Reveal>

      {/* ===== Bento Features Grid ===== */}
      <Reveal id="features" className="py-16 px-6 max-w-7xl mx-auto w-full z-10 relative">
        <div className="dot-grid absolute inset-0 -z-10 opacity-30 rounded-3xl" />

        <SectionTitle
          title={t('landing.features') || 'Core Platform Superpowers'}
          subtitle="Standard clinical indexes and edge-AI engines consolidated into one patient-first healthcare companion."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => <BentoFeatureCard key={i} feature={f} index={i} />)}
        </div>
      </Reveal>

      {/* ===== How It Works — Vertical Timeline ===== */}
      <Reveal className="py-20 px-6 max-w-4xl mx-auto w-full z-10">
        <SectionTitle
          title="Continuous Care Cycle"
          subtitle="How Aarogya Sahayak works to monitor and triage preventative indicators."
          gradient="from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-cyan-400"
        />

        <div className="space-y-8 pl-12 md:pl-0">
          {steps.map((s, i) => (
            <TimelineStep key={i} step={s} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>
      </Reveal>

      {/* ===== CNN Scanner Showcase ===== */}
      <Reveal className="py-20 px-6 max-w-5xl mx-auto w-full z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
          {/* Scan line effect */}
          <div className="scan-line absolute left-0 w-full" style={{ zIndex: 0 }} />

          <div className="space-y-6 lg:w-1/2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Images Never Leave Your Device</span>
            </div>
            <h2 className="text-3xl font-black font-heading tracking-tight text-slate-800 dark:text-slate-100 leading-snug">
              Secure On-Device Convolutional Scanning
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
              We compile and ship lightweight convolutional networks (TensorFlow.js) straight to your local browser. All scans run instantly on your hardware — zero photos ever cross our cloud servers.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {['COPPA & HIPAA Compliant', 'Edge WASM Acceleration'].map(txt => (
                <div key={txt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700/50">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex flex-col gap-3 relative z-10">
            {scanTypes.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ scale: 1.02, x: -4 }}
                className="flex items-center justify-between p-3.5 rounded-xl glass-card shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
                  On-Device CNN
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ===== Testimonials — Auto-scroll Carousel ===== */}
      <Reveal className="py-20 w-full z-10 overflow-hidden">
        <div className="px-6 max-w-7xl mx-auto">
          <SectionTitle
            title="Trusted Across Communities"
            subtitle="Real experiences from families and community workers in India."
            gradient="from-purple-700 to-rose-600 dark:from-purple-400 dark:to-pink-400"
          />
        </div>

        <div className="overflow-hidden">
          <div className="testimonial-track">
            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* ===== FAQ Section ===== */}
      <Reveal className="py-20 px-6 max-w-3xl mx-auto w-full z-10">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about Aarogya Sahayak."
          gradient="from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
        />

        <div className="space-y-3">
          {faqItems.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} index={i} />)}
        </div>
      </Reveal>

      {/* ===== CTA ===== */}
      <Reveal className="py-16 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 text-white p-10 md:p-20 text-center shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-[-20%] left-[-15%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] pointer-events-none animate-mesh-move" />
          <div className="absolute bottom-[-20%] right-[-15%] w-[400px] h-[400px] bg-cyan-400/15 rounded-full blur-[80px] pointer-events-none animate-mesh-move" style={{ animationDuration: '22s' }} />
          <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-pink-400/10 rounded-full blur-[100px] pointer-events-none animate-mesh-move" style={{ animationDuration: '18s', animationDelay: '-8s' }} />

          {/* Dot grid overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black font-heading tracking-tight mb-4 leading-tight"
            >
              Ready to Take Control of Your Health?
            </motion.h2>
            <p className="text-purple-100 text-sm md:text-base max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Create your account today, toggle your preferred language, and screen metrics dynamically. No credit card required.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="bg-white hover:bg-slate-50 text-primary font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-black/20 text-sm"
            >
              Start Free Today
            </motion.button>
          </div>
        </div>
      </Reveal>

      {/* ===== Footer ===== */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-900 bg-white/50 dark:bg-slate-950/60 py-12 px-6 backdrop-blur-xl z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 text-primary rounded-xl border border-purple-500/10">
                <Activity className="w-5 h-5" />
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

        <div className="max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-900/60 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
          <span>Made for India 🇮🇳 • Powered by Gemini AI</span>
          <span>&copy; {new Date().getFullYear()} Aarogya Sahayak. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
