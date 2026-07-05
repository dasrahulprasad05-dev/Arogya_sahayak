import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Activity, ScanLine, HeartPulse, User } from 'lucide-react';



interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  rgb: string; // for active glow color
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/', rgb: '139, 92, 246' },
  { id: 'dashboard', label: 'Vitals', icon: Activity, path: '/dashboard', rgb: '6, 182, 212' },
  { id: 'scan', label: 'Scan', icon: ScanLine, path: '/scan', rgb: '236, 72, 153' }, // center highlighted
  { id: 'wellness', label: 'Wellness', icon: HeartPulse, path: '/trackers', rgb: '16, 185, 129' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile', rgb: '99, 102, 241' },
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      // hide when scrolling down past 80px, show when scrolling up
      setHidden(current > lastScroll && current > 80);
      lastScroll = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) =>
      item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
    )
  );

  return (
    <motion.nav
      animate={{ y: hidden ? 120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-md px-4 pb-3 pointer-events-auto">
        <div className="relative flex items-center justify-around rounded-2xl glass-card shadow-2xl shadow-black/10 dark:shadow-black/40 px-2 py-2 border border-white/40 dark:border-white/10">
          {/* Sliding active pill background */}
          <motion.div
            className="absolute top-2 bottom-2 rounded-xl"
            style={{
              width: `calc((100% - 1rem) / ${navItems.length})`,
              background: `linear-gradient(135deg, rgba(${navItems[activeIndex].rgb}, 0.15), rgba(${navItems[activeIndex].rgb}, 0.05))`,
              border: `1px solid rgba(${navItems[activeIndex].rgb}, 0.2)`,
            }}
            animate={{ left: `calc(0.5rem + (100% - 1rem) / ${navItems.length} * ${activeIndex})` }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />

          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = i === activeIndex;
            const isCenter = item.id === 'scan';

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="relative z-10 flex-1 flex flex-col items-center justify-center gap-1 py-1.5 touch-target"
                aria-label={item.label}
              >
                {/* Center action button (raised & highlighted) */}
                {isCenter ? (
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    animate={isActive ? { y: -14, scale: 1.05 } : { y: -14, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-500/40"
                  >
                    {/* Pulsing ring */}
                    <motion.span
                      className="absolute inset-0 rounded-2xl border-2 border-pink-400"
                      animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <Icon className="w-5 h-5 relative z-10" />
                  </motion.div>
                ) : (
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    animate={
                      isActive
                        ? { scale: 1.15, y: -2, color: `rgb(${item.rgb})` }
                        : { scale: 1, y: 0, color: 'rgb(148, 163, 184)' }
                    }
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                )}

                {/* Label */}
                <motion.span
                  animate={{
                    opacity: isActive ? 1 : 0.55,
                    color: isActive && !isCenter ? `rgb(${item.rgb})` : undefined,
                  }}
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    isCenter ? 'mt-3' : ''
                  } ${isActive ? '' : 'text-slate-400 dark:text-slate-500'}`}
                >
                  {item.label}
                </motion.span>

                {/* Active dot indicator */}
                <AnimatePresence>
                  {isActive && !isCenter && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                      style={{ backgroundColor: `rgb(${item.rgb})` }}
                    />
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
