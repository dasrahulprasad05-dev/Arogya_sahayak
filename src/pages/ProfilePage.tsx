import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../integrations/supabase/client';
import { User, Sun, Moon, Globe, LogOut, ShieldAlert, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};
const ProfilePage: React.FC = () => {
  const { user, isDevBypass, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [fullName, setFullName] = useState(() => user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const displayName = user?.user_metadata?.full_name || 'Health Companion User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
    
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
      setTimeout(() => setSuccess(false), 2200);
    } catch (err: any) {
      setErrorMsg(err.message || t('state.error'));
    } finally {
      setLoading(false);
    }
  };
  
  const languages: { code: Language; label: string }[] = [
    { code: 'or', label: 'ଓଡ଼ିଆ' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'en', label: 'English' },
  ];
  
  return (
    <motion.div
      className="space-y-6 max-w-2xl mx-auto relative"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-20 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl" />
      
      <motion.div variants={itemVariants} className="relative z-10">
        <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
          {t('nav.profile')}
          <Sparkles className="w-5 h-5 text-primary" />
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your health profile information and visual settings.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 relative z-10">
        {/* Profile Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20 shrink-0"
            >
              {initials || <User className="w-8 h-8" />}
              <motion.span
                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">
                {displayName}
              </h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg flex items-center gap-2 overflow-hidden"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2 overflow-hidden"
              >
                <CheckCircle2 className="w-4 h-4" />
                Profile updated successfully!
              </motion.div>
            )}
          </AnimatePresence>
          
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
            
            <motion.button
              type="submit"
              disabled={loading || isDevBypass}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md transition-all disabled:opacity-60 disabled:pointer-events-none touch-target flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('btn.loading')}
                </>
              ) : (
                t('btn.save')
              )}
            </motion.button>
          </form>
        </motion.div>
        
        {/* Configurations Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm glass space-y-6"
        >
          <h3 className="font-heading font-bold text-lg text-foreground pb-2 border-b border-border">
            Visual & Language Choices
          </h3>
          
          <div className="space-y-4">
            {/* Language Selection */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <span>{t('profile.lang')}</span>
              </div>
              
              <div className="flex items-center bg-muted rounded-xl p-0.5 border border-border relative">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-colors touch-target z-10 ${
                      language === lang.code
                        ? 'text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {language === lang.code && (
                      <motion.span
                        layoutId="activeLangPill"
                        className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Theme selection */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  {theme === 'light' ? (
                    <Sun className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <Moon className="w-4 h-4 text-primary shrink-0" />
                  )}
                </motion.span>
                <span>{t('profile.theme')}</span>
              </div>
              
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-border hover:bg-muted bg-background/50 rounded-xl text-xs font-bold transition-all touch-target"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {theme === 'light' ? t('profile.theme.light') : t('profile.theme.dark')}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Action Sign Out Button */}
        <motion.button
          variants={itemVariants}
          onClick={signOut}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive text-destructive font-semibold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 touch-target"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('profile.logout')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
export default ProfilePage;
