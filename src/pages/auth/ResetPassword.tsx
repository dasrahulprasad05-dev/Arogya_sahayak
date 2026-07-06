import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../integrations/supabase/client';
import { Activity, Lock, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator';

const ResetPassword: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMsg('Please ensure your new password meets all requirements.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccessMsg('Your password has been reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || t('state.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl glass">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-primary/10 text-primary rounded-xl mb-3">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-heading">{t('app.name')}</h1>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-center">{t('btn.reset')}</h2>
        <p className="text-muted-foreground text-sm text-center mb-6">{t('auth.reset_desc')}</p>

        {errorMsg && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg mb-4 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="password">
              {t('auth.password')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <PasswordStrengthIndicator 
              password={password} 
              onValidationChange={setIsPasswordValid} 
            />
          </div>

          <button
            type="submit"
            disabled={loading || (password.length > 0 && !isPasswordValid)}
            className="w-full bg-primary hover:bg-primary/95 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 mt-6 shadow-md shadow-primary/10 disabled:opacity-60 disabled:pointer-events-none touch-target"
          >
            {loading ? t('btn.loading') : t('btn.reset')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
