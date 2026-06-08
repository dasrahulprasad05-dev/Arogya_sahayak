import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Activity, 
  Brain, 
  Shield, 
  Heart, 
  ArrowRight,
  Sun,
  Moon,
  Globe,
  Star,
  Check,
  Zap,
  Lock,
  Camera,
  Sparkles,
  ChevronRight,
  HeartPulse,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Scroll Reveal Observer
  const [sectionsRevealed, setSectionsRevealed] = useState<Record<string, boolean>>({});
  
  // Stats counters
  const [statsTriggered, setStatsTriggered] = useState(false);
  const [statPredictors, setStatPredictors] = useState(0);
  const [statTrackers, setStatTrackers] = useState(0);
  const [statScanners, setStatScanners] = useState(0);
  const [statLanguages, setStatLanguages] = useState(0);

  const statsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [howItWorksRevealed, setHowItWorksRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setSectionsRevealed(prev => ({ ...prev, [id]: true }));
            entry.target.classList.add('revealed');
            
            if (id === 'how-it-works') {
              setHowItWorksRevealed(true);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Stats Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Count up animation
  useEffect(() => {
    if (!statsTriggered) return;

    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setStatPredictors(Math.round(18 * ease));
      setStatTrackers(Math.round(13 * ease));
      setStatScanners(Math.round(5 * ease));
      setStatLanguages(Math.round(3 * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [statsTriggered]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  const tagline = t('app.tagline') || 'Your Family Health Companion';
  const mainTitleText = t('landing.title') || 'Stay Healthy With Advanced Preventive Screening';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030310] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden flex flex-col font-body">
      
      {/* Noise Overlay */}
      <div className="noise-overlay"></div>

      {/* Hero background blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move"></div>
      <div className="absolute top-[20%] right-[-10%] w-[550px] h-[550px] bg-purple-500/5 dark:bg-purple-500/15 rounded-full blur-[130px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[30%] left-[-10%] w-[500px] h-[500px] bg-pink-500/5 dark:bg-pink-500/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '30s', animationDelay: '-10s' }}></div>
      <div className="absolute bottom-[-5%] right-[10%] w-[520px] h-[520px] bg-indigo-500/5 dark:bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '28s', animationDelay: '-15s' }}></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#030310]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 text-primary rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Activity className="w-5.5 h-5.5" />
            </div>
            <span className="font-heading font-extrabold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            
            {/* Language switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 transition-all text-xs font-semibold">
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

            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all touch-target"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Action CTA */}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-primary hover:bg-primary/95 text-white font-bold py-2 px-5 rounded-xl text-xs transition-all shadow-md shadow-primary/20 dark:shadow-primary/10 hover:scale-105"
              >
                {t('nav.dashboard')}
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary/95 text-white font-bold py-2 px-5 rounded-xl text-xs transition-all shadow-md shadow-primary/20 dark:shadow-primary/10 hover:scale-105"
              >
                {t('btn.login')}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="relative pt-16 md:pt-24 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10">
        
        {/* Floating Health Metric Card 1 (BP: 120/80) */}
        <div className="absolute top-24 left-[5%] xl:left-[10%] hidden lg:block p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-indigo-500/20 backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-[0_0_15px_rgba(99,102,241,0.15)] animate-float text-left" style={{ animationDelay: '0s' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-lg">
              <Heart className="w-4 h-4 fill-indigo-500" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vitals Check</span>
          </div>
          <span className="text-xl font-extrabold font-number text-slate-800 dark:text-slate-100">120/80</span>
          <span className="text-[9px] text-muted-foreground font-semibold ml-1">mmHg</span>
        </div>

        {/* Floating Health Metric Card 2 (SpO2: 98%) */}
        <div className="absolute top-40 right-[5%] xl:right-[10%] hidden lg:block p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-emerald-500/20 backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-float-slow text-left" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oxygenation</span>
          </div>
          <span className="text-xl font-extrabold font-number text-slate-800 dark:text-slate-100">98%</span>
          <span className="text-[9px] text-muted-foreground font-semibold ml-1">SpO2</span>
        </div>

        {/* Floating Health Metric Card 3 (Sleep: 7.5h) */}
        <div className="absolute bottom-16 left-[8%] xl:left-[12%] hidden lg:block p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-purple-500/20 backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-float text-left" style={{ animationDelay: '2s' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-purple-500/10 text-purple-500 dark:text-purple-400 rounded-lg">
              <Moon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sleep Logs</span>
          </div>
          <span className="text-xl font-extrabold font-number text-slate-800 dark:text-slate-100">7.5</span>
          <span className="text-[9px] text-muted-foreground font-semibold ml-1">hours</span>
        </div>

        {/* Glowing Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/20 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-black mb-8 tracking-widest uppercase animate-pulse shadow-sm">
          <HeartPulse className="w-4 h-4 shrink-0 text-pink-500 animate-pulse" />
          <span>{tagline}</span>
        </div>

        {/* Word-by-word animate title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading tracking-tight leading-[1.1] max-w-5xl">
          {mainTitleText.split(' ').map((word, i) => (
            <span
              key={i}
              className="inline-block animate-fade-in opacity-0 bg-gradient-to-r from-purple-700 via-violet-600 to-cyan-600 dark:from-purple-400 dark:via-cyan-400 dark:to-pink-400 bg-clip-text text-transparent"
              style={{ 
                animationDelay: `${i * 120}ms`, 
                animationFillMode: 'forwards',
                paddingRight: '0.2em'
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-xl mt-8 max-w-3xl leading-relaxed font-medium">
          {t('landing.desc') || 'A secure, offline-first clinical assistant bringing generative medical guidance and on-device predictive diagnostics to your fingertips.'}
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3.5 px-9 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/40 dark:shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:scale-105 active:scale-95 touch-target group text-sm"
          >
            <span>{t('landing.get_started') || 'Get Started'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a
            href="#features"
            className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/30 backdrop-blur-md font-bold py-3.5 px-9 rounded-xl text-slate-800 dark:text-slate-200 transition-all duration-300 hover:scale-105 active:scale-95 touch-target text-sm"
          >
            Learn More
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-20 animate-bounce cursor-pointer flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scroll To Explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-400 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-slate-400 rounded-full"></div>
          </div>
        </div>

      </header>

      {/* Stats Bar */}
      <section 
        id="stats-bar" 
        ref={statsRef}
        className="w-full border-y border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl py-8 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          
          <div>
            <div className="text-3xl md:text-4xl font-extrabold font-number bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {statPredictors}+
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1.5">AI Predictors</div>
          </div>

          <div>
            <div className="text-3xl md:text-4xl font-extrabold font-number bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {statTrackers}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1.5">Wellness Trackers</div>
          </div>

          <div>
            <div className="text-3xl md:text-4xl font-extrabold font-number bg-gradient-to-r from-cyan-600 to-rose-600 dark:from-cyan-400 dark:to-rose-400 bg-clip-text text-transparent">
              {statScanners}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1.5">CNN Scanners</div>
          </div>

          <div>
            <div className="text-3xl md:text-4xl font-extrabold font-number bg-gradient-to-r from-rose-600 to-purple-600 dark:from-rose-400 dark:to-purple-400 bg-clip-text text-transparent">
              {statLanguages}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1.5">Supported Languages</div>
          </div>

        </div>
      </section>

      {/* Core Features Section */}
      <section 
        id="features" 
        className="reveal-on-scroll py-24 px-6 max-w-7xl mx-auto w-full z-10 transition-all duration-1000 relative grid-bg-overlay"
      >
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 dark:from-purple-400 dark:via-cyan-400 dark:to-pink-400 bg-clip-text text-transparent">
            {t('landing.features') || 'Core Platform Superpowers'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            Standard clinical indexes and edge-AI engines consolidated into one patient-first healthcare companion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Symptom Checker */}
          <div 
            className="tracker-card p-8 shadow-sm flex flex-col items-start bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-cyan-500/10 rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
            style={{ 
              '--tracker-accent-rgb': '6, 182, 212',
              boxShadow: theme === 'light' ? '0 4px 24px rgba(6, 182, 212, 0.05)' : undefined
            } as React.CSSProperties}
          >
            <div className="p-3 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 rounded-xl mb-6">
              <Brain className="w-6 h-6 animate-float" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-800 dark:text-slate-100">
              {t('landing.ai_triage') || 'AI Symptom Checker'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {t('landing.ai_triage_desc') || 'Gemini AI-powered diagnostic recommendations matching standard triage protocols.'}
            </p>
            <div className="w-full h-1 mt-6 rounded bg-cyan-500/20 dark:bg-cyan-500/10 shadow-[0_1px_10px_rgba(6,182,212,0.3)]"></div>
          </div>

          {/* Card 2: Wellness Trackers */}
          <div 
            className="tracker-card p-8 shadow-sm flex flex-col items-start bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-purple-500/10 rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
            style={{ 
              '--tracker-accent-rgb': '168, 85, 247',
              boxShadow: theme === 'light' ? '0 4px 24px rgba(168, 85, 247, 0.05)' : undefined
            } as React.CSSProperties}
          >
            <div className="p-3 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl mb-6">
              <Activity className="w-6 h-6 animate-float" style={{ animationDelay: '0.5s' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-800 dark:text-slate-100">
              {t('landing.trackers') || 'Wellness Trackers'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {t('landing.trackers_desc') || 'Log and monitor sleep quality, hydration, mood indices, medication reminders, and body temperature.'}
            </p>
            <div className="w-full h-1 mt-6 rounded bg-purple-500/20 dark:bg-purple-500/10 shadow-[0_1px_10px_rgba(168,85,247,0.3)]"></div>
          </div>

          {/* Card 3: CNN Image Scan */}
          <div 
            className="tracker-card p-8 shadow-sm flex flex-col items-start bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-rose-500/10 rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
            style={{ 
              '--tracker-accent-rgb': '244, 63, 94',
              boxShadow: theme === 'light' ? '0 4px 24px rgba(244, 63, 94, 0.05)' : undefined
            } as React.CSSProperties}
          >
            <div className="p-3 bg-rose-500/15 text-rose-600 dark:text-rose-400 rounded-xl mb-6">
              <Camera className="w-6 h-6 animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-800 dark:text-slate-100">
              {t('landing.cnn') || 'CNN Image Scan'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {t('landing.cnn_desc') || 'On-device chest X-Ray, skin lesion, and eye scans using compiled TensorFlowJS convolutional networks.'}
            </p>
            <div className="w-full h-1 mt-6 rounded bg-rose-500/20 dark:bg-rose-500/10 shadow-[0_1px_10px_rgba(244,63,94,0.3)]"></div>
          </div>

          {/* Card 4: AI Predictors */}
          <div 
            className="tracker-card p-8 shadow-sm flex flex-col items-start bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-amber-500/10 rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
            style={{ 
              '--tracker-accent-rgb': '245, 158, 11',
              boxShadow: theme === 'light' ? '0 4px 24px rgba(245, 158, 11, 0.05)' : undefined
            } as React.CSSProperties}
          >
            <div className="p-3 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl mb-6">
              <HeartPulse className="w-6 h-6 animate-float" style={{ animationDelay: '1.5s' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-800 dark:text-slate-100">
              Clinical Predictors
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Screen for diabetes, heart attack probability, kidney health, liver function, and anemia using input vitals indexes.
            </p>
            <div className="w-full h-1 mt-6 rounded bg-amber-500/20 dark:bg-amber-500/10 shadow-[0_1px_10px_rgba(245,158,11,0.3)]"></div>
          </div>

          {/* Card 5: Offline First */}
          <div 
            className="tracker-card p-8 shadow-sm flex flex-col items-start bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-emerald-500/10 rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
            style={{ 
              '--tracker-accent-rgb': '16, 185, 129',
              boxShadow: theme === 'light' ? '0 4px 24px rgba(16, 185, 129, 0.05)' : undefined
            } as React.CSSProperties}
          >
            <div className="p-3 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl mb-6">
              <Shield className="w-6 h-6 animate-float" style={{ animationDelay: '2s' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-800 dark:text-slate-100">
              Resilient Offline First
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              IndexedDB local databases queues vital logs during internet dropouts and syncs bidirectionally on reconnection.
            </p>
            <div className="w-full h-1 mt-6 rounded bg-emerald-500/20 dark:bg-emerald-500/10 shadow-[0_1px_10px_rgba(16,185,129,0.3)]"></div>
          </div>

          {/* Card 6: Multilingual */}
          <div 
            className="tracker-card p-8 shadow-sm flex flex-col items-start bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-indigo-500/10 rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
            style={{ 
              '--tracker-accent-rgb': '99, 102, 241',
              boxShadow: theme === 'light' ? '0 4px 24px rgba(99, 102, 241, 0.05)' : undefined
            } as React.CSSProperties}
          >
            <div className="p-3 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl mb-6">
              <Globe className="w-6 h-6 animate-float" style={{ animationDelay: '2.5s' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-800 dark:text-slate-100">
              Made for India
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Fully localized interface available in Odia (ଓଡ଼ିଆ), Hindi (हिन्दी), and English, with localized home remedy recommendations.
            </p>
            <div className="w-full h-1 mt-6 rounded bg-indigo-500/20 dark:bg-indigo-500/10 shadow-[0_1px_10px_rgba(99,102,241,0.3)]"></div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works" 
        ref={howItWorksRef}
        className="reveal-on-scroll py-24 px-6 max-w-7xl mx-auto w-full z-10 transition-all duration-1000 bg-slate-100/50 dark:bg-slate-950/20 border-y border-slate-200 dark:border-slate-900/60 rounded-3xl"
      >
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Continuous Care Cycle
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            How Aarogya Sahayak works to monitor and triage preventative indicators.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto items-stretch">
          
          {/* Animated Connecting Line */}
          {/* Desktop line */}
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 hidden md:block">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 origin-left transition-transform duration-[1200ms] ease-out scale-x-0"
              style={{ transform: howItWorksRevealed ? 'scaleX(1)' : 'scaleX(0)' }}
            ></div>
          </div>

          {/* Mobile line */}
          <div className="absolute left-[33px] top-6 bottom-6 w-[3px] bg-slate-200 dark:bg-slate-800 z-0 md:hidden">
            <div 
              className="w-full bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 origin-top transition-transform duration-[1200ms] ease-out scale-y-0"
              style={{ transform: howItWorksRevealed ? 'scaleY(1)' : 'scaleY(0)' }}
            ></div>
          </div>

          {/* Step 1 */}
          <div className="relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow z-10 flex flex-col items-center text-center">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-indigo-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              1
            </div>
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Track Daily Health</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Log vitals, sleep, mood, and water intake using specialized premium trackers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow z-10 flex flex-col items-center text-center">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-purple-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              2
            </div>
            <div className="w-14 h-14 bg-purple-500/10 text-purple-500 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">AI Risk Analysis</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Check indicators against clinical algorithms and secure generative model endpoints.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow z-10 flex flex-col items-center text-center">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-cyan-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              3
            </div>
            <div className="w-14 h-14 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Get Recommendations</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Review Ayush-guided remedies, risk levels, and instant triage procedures.
            </p>
          </div>

        </div>
      </section>

      {/* CNN Scanner Showcase */}
      <section 
        id="cnn-showcase" 
        className="reveal-on-scroll py-24 px-6 max-w-5xl mx-auto w-full z-10 transition-all duration-1000"
      >
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
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700/60">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>COPPA & HIPAA Compliant Privacy</span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700/60">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Edge Web Assembly Acceleration</span>
              </div>
            </div>

          </div>

          <div className="lg:w-1/2 w-full flex flex-col gap-4 relative">
            
            {/* Visual Scan Grid Container */}
            <div className="relative border border-slate-200 dark:border-rose-500/20 bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl overflow-hidden min-h-[320px] flex flex-col justify-center gap-3">
              
              {/* Scan Laser Line Overlay */}
              <div className="scan-line"></div>

              {/* Scan Types */}
              {[
                { name: 'Skin Melanoma Detector', color: 'text-rose-500 bg-rose-500/10' },
                { name: 'Chest X-Ray Pneumonia Triage', color: 'text-cyan-500 bg-cyan-500/10' },
                { name: 'ECG Rhythm Lead Classifier', color: 'text-purple-500 bg-purple-500/10' },
                { name: 'Oral Mucosal Leukoplakia Triage', color: 'text-amber-500 bg-amber-500/10' },
                { name: 'Cataract Corneal Clouding Screen', color: 'text-indigo-500 bg-indigo-500/10' },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm z-10 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color.split(' ')[0]}`}></span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    On-Device CNN
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* Testimonials section */}
      <section 
        id="testimonials" 
        className="reveal-on-scroll py-24 px-6 max-w-7xl mx-auto w-full z-10 transition-all duration-1000"
      >
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight bg-gradient-to-r from-purple-700 to-rose-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Trusted Across Communities
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            Real experiences from families and community workers in India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Testimonial 1 */}
          <div className="tracker-card p-6 rounded-2xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">
                "ମୋ ବାପାଙ୍କର ଜଳପାନ ଓ ମନୋଦଶା ଟ୍ରାକ୍ କରିବାରେ ଏହି ଆପ୍ ବହୁତ ସାହାଯ୍ୟ କରିଛି। ଏହାର ଓଡ଼ିଆ ଅନୁବାଦ ମଧ୍ୟ ଅତ୍ୟନ୍ତ ସରଳ ଓ ସୁବିଧାଜନକ ଅଟେ।"
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                RD
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Rahul Das</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Bhubaneswar, Odisha</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="tracker-card p-6 rounded-2xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">
                "Having the skin scan and X-Ray classifiers load instantly on my phone without transferring pictures is excellent for clinical privacy."
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                PS
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Priya Sharma</h4>
                <p className="text-[10px] text-slate-400 font-semibold">New Delhi, Delhi</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="tracker-card p-6 rounded-2xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">
                "The IndexDB-powered offline logging works perfectly during field diagnostics where internet speeds drop. Reconnecting triggers a clean cloud sync."
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                AS
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Amit Sawant</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Mumbai, Maharashtra</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        className="reveal-on-scroll py-20 px-6 max-w-7xl mx-auto w-full z-10 transition-all duration-1000"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white p-8 md:p-16 text-center shadow-xl">
          
          {/* Animated decorative mesh blobs specifically in the CTA background */}
          <div className="absolute top-[-30%] left-[-20%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] pointer-events-none -z-10 animate-mesh-move"></div>
          <div className="absolute bottom-[-30%] right-[-20%] w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none -z-10 animate-mesh-move" style={{ animationDuration: '20s' }}></div>

          <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight mb-4 leading-tight">
            Ready to Take Control of Your Health?
          </h2>
          
          <p className="text-purple-100 text-sm md:text-base max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Create your account today, toggle your preferred language, and screen metrics dynamically. No credit card required.
          </p>

          <button
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-slate-100 text-primary font-black py-4 px-10 rounded-xl transition-all duration-300 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 text-sm"
          >
            Start Free Today
          </button>

        </div>
      </section>

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
