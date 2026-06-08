import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Activity, Brain, Shield, Heart, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background glowing decorations */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10 animate-mesh-move"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl -z-10 animate-mesh-move" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl -z-10 animate-mesh-move" style={{ animationDuration: '30s' }}></div>

      {/* Header */}
      <header className="px-6 py-4 border-b border-border flex items-center justify-between z-10 glass max-w-7xl mx-auto w-full rounded-2xl mt-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary animate-pulse-slow">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-xl text-primary">{t('app.name')}</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-primary hover:bg-primary/95 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-all shadow-md shadow-primary/10 touch-target hover:scale-105"
            >
              {t('nav.dashboard')}
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold hover:text-primary transition-all px-3 py-2 touch-target">
                {t('btn.login')}
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary/95 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-all shadow-md shadow-primary/10 touch-target hover:scale-105"
              >
                {t('btn.register')}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center max-w-4xl mx-auto mt-12 md:mt-24 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold mb-6 tracking-wide uppercase animate-bounce-wave">
          <Heart className="w-4.5 h-4.5 text-pink-500 fill-pink-500" />
          <span>{t('app.tagline')}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            {t('landing.title')}
          </span>
        </h1>
        
        <p className="text-muted-foreground text-md md:text-xl mt-6 max-w-2xl leading-relaxed">
          {t('landing.desc')}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className="bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 touch-target group hover:scale-105"
          >
            <span>{t('landing.get_started')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#features"
            className="border border-border bg-card/50 hover:bg-muted/50 font-semibold py-3 px-8 rounded-xl text-foreground transition-all touch-target hover:scale-105"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full z-10">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center font-heading mb-12">
          {t('landing.features')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent border border-purple-500/20 dark:border-purple-500/10 rounded-2xl shadow-sm flex flex-col items-start hover:scale-[1.02] hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
            <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl mb-6">
              <Brain className="w-6 h-6 animate-float" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-purple-600 dark:text-purple-400">{t('landing.ai_triage')}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('landing.ai_triage_desc')}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 bg-gradient-to-br from-pink-500/10 via-pink-600/5 to-transparent border border-pink-500/20 dark:border-pink-500/10 rounded-2xl shadow-sm flex flex-col items-start hover:scale-[1.02] hover:border-pink-500/40 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all duration-300">
            <div className="p-3 bg-pink-500/20 text-pink-500 rounded-xl mb-6">
              <Activity className="w-6 h-6 animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-pink-600 dark:text-pink-400">{t('landing.trackers')}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('landing.trackers_desc')}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-transparent border border-cyan-500/20 dark:border-cyan-500/10 rounded-2xl shadow-sm flex flex-col items-start hover:scale-[1.02] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300">
            <div className="p-3 bg-cyan-500/20 text-cyan-500 rounded-xl mb-6">
              <Shield className="w-6 h-6 animate-float" style={{ animationDelay: '2s' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-cyan-600 dark:text-cyan-400">{t('landing.cnn')}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('landing.cnn_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-auto text-center text-xs text-muted-foreground glass">
        <p className="max-w-xl mx-auto px-4 leading-relaxed">
          {t('disclaimer.text')}
        </p>
        <p className="mt-4">
          &copy; {new Date().getFullYear()} Aarogya Sahayak. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
