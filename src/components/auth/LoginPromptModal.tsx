import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogIn, UserPlus, X } from 'lucide-react';

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * A premium glassmorphism modal that prompts unauthenticated users to sign in
 * when they try to perform a protected action (submit a form, log data, etc.).
 *
 * Passes the current path as a `redirect` query param so the user returns
 * to the same page after logging in.
 */
const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectParam = encodeURIComponent(location.pathname + location.search);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />

            {/* Ambient blobs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="relative p-8 pt-10 flex flex-col items-center text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/15 to-cyan-500/15 border border-purple-500/20 flex items-center justify-center mb-5"
              >
                <Lock className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </motion.div>

              <h2 className="text-xl font-bold font-heading text-foreground mb-2">
                Login Required
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mb-8">
                Sign in to access this feature, save your health data, and get personalized insights.
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => navigate(`/login?redirect=${redirectParam}`)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/20 text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => navigate(`/register?redirect=${redirectParam}`)}
                  className="w-full flex items-center justify-center gap-2 bg-card hover:bg-muted/50 border border-border text-foreground font-bold py-3 px-6 rounded-xl transition-all text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;
