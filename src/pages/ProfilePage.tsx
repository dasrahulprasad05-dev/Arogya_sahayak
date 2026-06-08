import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../integrations/supabase/client';
import { User, Sun, Moon, Globe, LogOut, ShieldAlert } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isDevBypass, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState(() => user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDevBypass) {
      setErrorMsg('Profile edits are blocked in Developer Bypass mode.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || t('state.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">{t('nav.profile')}</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your health profile information and visual settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6">
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">
                {user?.user_metadata?.full_name || 'Health Companion User'}
              </h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="profName">
                {t('auth.name')}
              </label>
              <input
                id="profName"
                type="text"
                className="w-full p-2.5 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                disabled={isDevBypass}
              />
            </div>

            <button
              type="submit"
              disabled={loading || isDevBypass}
              className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md transition-all disabled:opacity-60 disabled:pointer-events-none touch-target"
            >
              {loading ? t('btn.loading') : t('btn.save')}
            </button>
          </form>
        </div>

        {/* Configurations Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6">
          <h3 className="font-heading font-bold text-lg text-foreground pb-2 border-b border-border">Visual & Language Choices</h3>

          <div className="space-y-4">
            {/* Language Selection */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <span>{t('profile.lang')}</span>
              </div>

              <div className="flex items-center bg-muted rounded-xl p-0.5 border border-border">
                {([
                  { code: 'or', label: 'ଓଡ଼ିଆ' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'en', label: 'English' }
                ] as { code: Language; label: string }[]).map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-target ${
                      language === lang.code
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme selection */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                {theme === 'light' ? <Sun className="w-4 h-4 text-primary shrink-0" /> : <Moon className="w-4 h-4 text-primary shrink-0" />}
                <span>{t('profile.theme')}</span>
              </div>

              <button
                onClick={toggleTheme}
                className="px-4 py-2 border border-border hover:bg-muted bg-background/50 rounded-xl text-xs font-bold transition-all touch-target"
              >
                {theme === 'light' ? t('profile.theme.light') : t('profile.theme.dark')}
              </button>
            </div>
          </div>
        </div>

        {/* Action Sign Out Button */}
        <button
          onClick={signOut}
          className="w-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive text-destructive font-semibold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 touch-target"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('profile.logout')}</span>
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;
