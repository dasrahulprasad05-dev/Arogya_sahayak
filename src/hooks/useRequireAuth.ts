import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook that provides a gate-keeper function for protected actions.
 *
 * Usage:
 *   const { requireAuth, showLoginModal, setShowLoginModal } = useRequireAuth();
 *
 *   const handleSubmit = () => {
 *     if (!requireAuth()) return;   // opens modal if guest
 *     // ... proceed with protected action
 *   };
 *
 *   return <><LoginPromptModal open={showLoginModal} onClose={() => setShowLoginModal(false)} /> ... </>;
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const requireAuth = useCallback((): boolean => {
    if (isAuthenticated) return true;
    setShowLoginModal(true);
    return false;
  }, [isAuthenticated]);

  return { requireAuth, showLoginModal, setShowLoginModal };
}
