import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../integrations/supabase/client';
import {
  User,
  Sun,
  Moon,
  Globe,
  LogOut,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';

/* ---------------------------------------------------
   Toast System (lightweight, local to this page)
--------------------------------------------------- */
type Toast = {
  id: number;
  type: 'success' | 'error';
  message: string;
};

const useToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const pushToast = useCallback((type: Toast['type'], message: string) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, pushToast, dismissToast };
};

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({
  toasts,
  onDismiss,
}) => (
  <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
    <AnimatePresence>
      {toasts.map(toast => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className={`flex items-start gap-2.5 p-3.5 rounded-xl shadow-lg border backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-destructive/15 border-destructive/30 text-destructive'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          )}
          <p className="text-xs font-semibold leading-relaxed flex-1">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ---------------------------------------------------
   Skeleton Loader
--------------------------------------------------- */
const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-muted rounded-lg ${className}`}>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-2xl mx-auto">
    <div>
      <Shimmer className="h-8 w-48 mb-2" />
      <Shimmer className="h-4 w-72" />
    </div>

    <div className="grid grid-cols-1 gap-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <Shimmer className="w-16 h-16 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Shimmer className="h-4 w-40" />
            <Shimmer className="h-3 w-28" />
          </div>
        </div>
        <div className="space-y-2">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
        <Shimmer className="h-10 w-full rounded-xl" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <Shimmer className="h-5 w-48 pb-2" />
        <div className="flex items-center justify-between">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-40 rounded-xl" />
        </div>
        <div className="flex items-center justify-between">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      <Shimmer className="h-12 w-full rounded-2xl" />
    </div>
  </div>
);

/* ---------------------------------------------------
   Main Component
--------------------------------------------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ProfilePage: React.FC = () => {
  const auth = useAuth() as ReturnType<typeof useAuth> & { loading?: boolean };
  const { user, isDevBypass, signOut } = auth;
  const authLoading = auth.loading ?? false;
  
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const { toasts, pushToast, dismissToast } = useToasts();

  const [fullName, setFullName] = useState(() => user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);

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
      pushToast('error', 'Profile edits are blocked in Developer Bypass mode.');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;
      
      pushToast('success', 'Profile updated successfully!');
    } catch (err: any) {
      pushToast('error', err.message || t('state.error'));
    } finally {
      setLoading(false);
    }
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'or', label: 'ଓଡ଼ିଆ' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'en', label: 'English' },
  ];

  if (authLoading || !user) {
    return (
      <>
        <ProfileSkeleton />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

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
      
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </motion.div>
  );
};

export default ProfilePage;
