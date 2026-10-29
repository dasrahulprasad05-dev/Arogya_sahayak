import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Mail, Sparkles, ExternalLink, Key } from 'lucide-react';

interface WelcomeCardsProps {
  // Optional callback when completely dismissed
  onDismiss?: () => void;
}

const DISMISS_KEY = 'arogya_credentials_dismissed';

export const WelcomeCards: React.FC<WelcomeCardsProps> = ({ onDismiss }) => {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return (
        sessionStorage.getItem(DISMISS_KEY) !== 'true' &&
        localStorage.getItem(DISMISS_KEY) !== 'true'
      );
    } catch {
      return true;
    }
  });

  const DEV_EMAIL = 'rahulprasadcoding01@gmail.com';
  const WHATSAPP_NUMBER = '909040786464'; // international format (+90 9040786464)
  const WHATSAPP_DISPLAY = '+90 9040786464';

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
      localStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // ignore storage access errors
    }
    onDismiss?.();
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: 'spring', damping: 25, stiffness: 320 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: -25, 
      transition: { duration: 0.2 } 
    },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="credentials-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/30 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.3)] text-white"
            >
              {/* Glowing top line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

              {/* Ambient radial glows */}
              <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Cross button */}
              <button
                onClick={handleClose}
                aria-label="Close credentials popup"
                title="Close"
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-300 border border-white/10 hover:border-emerald-500/30 transition-all duration-200 group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>

              <div className="relative p-6 sm:p-8">
                {/* Header Icon & Tag */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20 shrink-0">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                      🔑 Developer Access
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight mt-1">
                      Account Credentials
                    </h3>
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-semibold text-slate-200 mb-2">
                  To Use All Account Credentials, Mail the Developer
                </h4>

                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Want instant access to doctor dashboards, admin portals, clinical predictors, and zero-cost dispensary tools? Reach out directly to the developer below via Email or WhatsApp for quick setup!
                </p>

                {/* Contact Options Container */}
                <div className="space-y-3.5 mb-6">
                  {/* Email Option */}
                  <a
                    href={`mailto:${DEV_EMAIL}?subject=Arogya%20Sahayak%20-%20Account%20Credentials%20Request&body=Hi%20Rahul,%0A%0AI%20would%20like%20to%20request%20account%20credentials%20to%20access%20all%20features%20of%20Arogya%20Sahayak.%0A%0AName:%20%0ARole%20(Patient/Doctor/Admin):%20%0A%0AThank%20you!`}
                    className="group relative flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.01]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">Send Email to Developer</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Mail App</span>
                      </div>
                      <p className="text-indigo-400 text-xs sm:text-sm font-mono truncate mt-0.5">
                        {DEV_EMAIL}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Click to open your device mail app with pre-filled message
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 shrink-0 transition-colors" />
                  </a>

                  {/* WhatsApp Option */}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      'Hello Rahul, I would like to request account credentials to access all features of Arogya Sahayak.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.01]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0 group-hover:scale-105 transition-transform">
                      {/* WhatsApp Official SVG Logo */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-white"
                      >
                        <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.93.551 3.732 1.503 5.258L2.06 21.94a.75.75 0 0 0 .918.918l4.678-1.443A9.96 9.96 0 0 0 12.004 22c5.518 0 10.004-4.486 10.004-9.996C22.008 6.486 17.522 2 12.004 2zm5.787 14.195c-.244.686-1.22 1.258-1.996 1.341-.53.057-1.221.082-3.535-.877-2.96-1.227-4.86-4.24-5.008-4.437-.144-.197-1.196-1.594-1.196-3.04 0-1.448.756-2.158 1.025-2.451.268-.293.587-.366.782-.366.196 0 .391.002.562.01.18.01.423-.069.661.504.245.587.834 2.038.907 2.186.074.147.123.32.025.516-.098.196-.147.318-.293.49-.147.172-.309.384-.441.516-.147.147-.3.308-.129.602.17.293.757 1.248 1.626 2.022 1.118.995 2.06 1.304 2.353 1.451.293.147.465.123.637-.074.172-.196.734-.856.93-1.15.196-.293.392-.245.66-.147.268.098 1.71.807 2.003.954.294.147.49.22.563.342.073.123.073.71-.171 1.396z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">Message on WhatsApp</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">WhatsApp App</span>
                      </div>
                      <p className="text-emerald-400 text-xs sm:text-sm font-mono truncate mt-0.5">
                        {WHATSAPP_DISPLAY}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Click to open WhatsApp with pre-filled greeting message
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0 transition-colors" />
                  </a>
                </div>

                {/* Footer close / finish */}
                <div className="flex items-center justify-end pt-2">
                  <button
                    onClick={handleClose}
                    className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Got It, Continue to Website ✓
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher button so users can re-open credentials card anytime */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 left-5 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-emerald-500/40 shadow-xl shadow-emerald-500/10 hover:border-emerald-500 transition-all duration-200"
          title="Account Credentials & Developer Access"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Key className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold hidden sm:inline">Account Credentials</span>
        </motion.button>
      )}
    </>
  );
};

export default WelcomeCards;
