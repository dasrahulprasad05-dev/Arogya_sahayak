import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { triggerSync } from '../../utils/syncQueue';
import { 
  Home, 
  Activity, 
  BrainCircuit, 
  Camera, 
  User, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { syncQueueLength } = useHealthRead();
  const location = useLocation();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Track connection status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' | 'warning' }[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: 'success' | 'info' | 'error' | 'warning' }>;
      const { message, type } = customEvent.detail;
      const newToast = { id: crypto.randomUUID(), message, type };
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener('arogya_toast', handleToastEvent);
    return () => window.removeEventListener('arogya_toast', handleToastEvent);
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) return;
    setSyncing(true);
    const result = await triggerSync();
    setSyncing(false);
    if (result) {
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2000);
    }
  };

  const navItems = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: Home },
    { name: t('nav.trackers'), path: '/trackers', icon: Activity },
    { name: t('nav.predictors'), path: '/predictors', icon: BrainCircuit },
    { name: t('nav.scanners'), path: '/scan', icon: Camera },
    { name: t('nav.profile'), path: '/profile', icon: User },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'or', label: 'ଓ' },
    { code: 'hi', label: 'हि' },
    { code: 'en', label: 'EN' }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background transition-colors duration-200">
      
      {/* 1. Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-card border-r border-slate-200 dark:border-border transition-all duration-300 relative ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                AS
              </div>
              <span className="font-heading font-bold text-lg text-primary">{t('app.name')}</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold mx-auto">
              AS
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-muted rounded-md absolute -right-3 top-5 bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm touch-target flex items-center justify-center"
            aria-label="Toggle Sidebar"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4 text-foreground" /> : <ChevronLeft className="w-4 h-4 text-foreground" />}
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all group relative touch-target ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-none dark:bg-primary dark:text-white dark:shadow-md dark:shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
                {sidebarCollapsed && (
                  <span className="absolute left-16 bg-popover border border-border text-foreground px-2 py-1 rounded shadow-md text-xs font-semibold scale-0 group-hover:scale-100 transition-all origin-left z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border flex flex-col gap-2">
          {!sidebarCollapsed && (
            <div className="text-xs text-muted-foreground truncate mb-2">
              {user?.email}
            </div>
          )}
          <button 
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all touch-target"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>{t('profile.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        
        {/* Top Header */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 hover:bg-muted rounded-md md:hidden touch-target"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="md:hidden font-heading font-bold text-lg text-primary">{t('app.name')}</h1>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Sync Status Banner / Icon */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  <Wifi className="w-4 h-4" />
                  {syncSuccess ? (
                    <motion.span
                      className="text-emerald-500 font-bold"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      ✓ Synced!
                    </motion.span>
                  ) : syncQueueLength > 0 ? (
                    <button 
                      onClick={handleManualSync}
                      disabled={syncing}
                      className="flex items-center gap-1 hover:underline focus:outline-none touch-target"
                      title={t('state.syncing')}
                    >
                      <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                      <span className="relative">
                        {syncQueueLength} logs pending
                        <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      </span>
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500 text-xs font-medium">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline ({syncQueueLength} saved)</span>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-muted/60 rounded-lg p-0.5 border border-border">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded text-xs font-bold transition-all touch-target ${
                    language === lang.code
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label={`Switch language to ${lang.code}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted border border-border text-foreground transition-all touch-target"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Offline Warning Banner — animated slide */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              className="bg-amber-500 text-white text-xs font-semibold py-2 px-4 text-center shadow-inner"
              initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {t('state.offline')}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body — route transition wrapper */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation (Visible on mobile screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border z-40 flex items-center justify-around py-2 shadow-lg px-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-center transition-all ${
                isActive 
                  ? 'text-primary scale-105 font-bold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{ minWidth: '60px' }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 4. Mobile Overlay Sidebar Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-64 max-w-[80%] h-full bg-white dark:bg-card border-r border-slate-200 dark:border-border flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 dark:border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                  AS
                </div>
                <span className="font-heading font-bold text-lg text-primary">{t('app.name')}</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 hover:bg-muted rounded-md touch-target"
                aria-label="Close Mobile Menu"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
            </div>
            
            <nav className="flex-1 p-3 space-y-1 mt-4">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all touch-target ${
                      isActive 
                        ? 'bg-primary/10 text-primary dark:bg-primary dark:text-white shadow-none' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-border flex flex-col gap-2">
              <div className="text-xs text-muted-foreground truncate mb-2">
                {user?.email}
              </div>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all touch-target"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>{t('profile.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Global Toast Container */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 md:px-0">
        {toasts.map(toast => {
          let typeColor = 'border-primary/20 text-primary bg-primary/5';
          if (toast.type === 'success') typeColor = 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5';
          if (toast.type === 'error') typeColor = 'border-rose-500/20 text-rose-500 bg-rose-500/5';
          if (toast.type === 'warning') typeColor = 'border-amber-500/20 text-amber-500 bg-amber-500/5';
          if (toast.type === 'info') typeColor = 'border-blue-500/20 text-blue-500 bg-blue-500/5';

          return (
            <div 
              key={toast.id}
              className={`p-4 border rounded-xl shadow-lg backdrop-blur-md pointer-events-auto flex items-start gap-3 transition-all duration-300 animate-slide-up bg-card/90 ${typeColor}`}
            >
              <div className="flex-1 text-xs font-bold font-heading">
                {toast.message}
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-muted-foreground hover:text-foreground text-[10px] font-bold"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardLayout;
