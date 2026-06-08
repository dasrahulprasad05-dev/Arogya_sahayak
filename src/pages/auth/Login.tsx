import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../integrations/supabase/client';
import { Activity, Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { toggleDevBypass, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || t('state.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || t('state.error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl glass">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-primary/10 text-primary rounded-xl mb-3">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-heading">{t('app.name')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('app.tagline')}</p>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center">{t('auth.login_title')}</h2>

        {errorMsg && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg mb-4 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="email">
              {t('auth.email')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium" htmlFor="password">
                {t('auth.password')}
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                {t('btn.forgot')}
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 mt-6 shadow-md shadow-primary/10 disabled:opacity-60 disabled:pointer-events-none touch-target"
          >
            {loading ? t('btn.loading') : (
              <>
                <span>{t('btn.login')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase tracking-wider">OR</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-card hover:bg-muted/50 border border-border font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 text-sm touch-target"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 01-2.45 3.71v3.08h3.95c2.31-2.13 3.63-5.27 3.63-8.64z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.95-3.08c-1.1.74-2.5 1.18-4.01 1.18-3.09 0-5.71-2.09-6.64-4.89H1.37v3.19A11.99 11.99 0 0012 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.36 14.3a7.16 7.16 0 010-4.6V6.51H1.37a11.99 11.99 0 000 10.98l3.99-3.19z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.28 2.68 1.37 6.51l3.99 3.19c.93-2.8 3.55-4.95 6.64-4.95z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            {t('btn.register')}
          </Link>
        </p>

        {/* Skip Login Dev Bypass Toggle */}
        {import.meta.env.DEV && (
          <div className="mt-8 pt-6 border-t border-border border-dashed flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">DEV MODE ACTIVE</span>
            </div>
            <button
              onClick={toggleDevBypass}
              type="button"
              className="px-4 py-2 border border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm shadow-emerald-500/5 touch-target"
            >
              {t('btn.skip')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
