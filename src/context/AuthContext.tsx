import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isDevBypass: boolean;
  toggleDevBypass: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// 🔒 PRODUCTION SAFETY: Mock data only exists in DEV builds.
// Vite tree-shakes `import.meta.env.DEV` branches in production,
// ensuring no auth backdoor ships to prod.
const mockUser: User | null = import.meta.env.DEV ? {
  id: '00000000-0000-0000-0000-000000000000',
  app_metadata: {},
  user_metadata: {
    full_name: 'ଭଞ୍ଜ ଦେବ (Dev User)',
    language: 'or',
    theme: 'dark'
  },
  aud: 'authenticated',
  email: 'dev@arogyasahayak.in',
  created_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString()
} : null;

const mockSession: Session | null = import.meta.env.DEV && mockUser ? {
  access_token: 'mock-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh-token',
  user: mockUser
} : null;

/**
 * Retry wrapper for supabase.auth.getSession().
 * When Supabase free-tier wakes from sleep, the first call can fail or
 * return an error. This retries with exponential backoff so the user
 * doesn't see "user not fetched" while the database is starting up.
 */
const getSessionWithRetry = async (
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<{ session: Session | null }> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn(`[Auth] getSession attempt ${attempt + 1} failed:`, error.message);
        if (attempt < maxRetries) {
          const delay = baseDelayMs * Math.pow(2, attempt);
          console.log(`[Auth] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        // Final attempt failed — return null session instead of crashing
        console.error('[Auth] All getSession retries exhausted. Supabase may be sleeping.');
        return { session: null };
      }
      if (attempt > 0) {
        console.log(`[Auth] getSession succeeded on attempt ${attempt + 1}`);
      }
      return { session: data.session };
    } catch (err) {
      console.warn(`[Auth] getSession attempt ${attempt + 1} threw:`, err);
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return { session: null };
    }
  }
  return { session: null };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDevBypass, setIsDevBypass] = useState(() => {
    // only active in development modes
    if (import.meta.env.DEV) {
      return localStorage.getItem('arogya_dev_bypass') === 'true';
    }
    return false;
  });

  const toggleDevBypass = useCallback(() => {
    if (!import.meta.env.DEV) return;
    setIsDevBypass(prev => {
      const next = !prev;
      localStorage.setItem('arogya_dev_bypass', String(next));
      if (next) {
        setUser(mockUser);
        setSession(mockSession);
      } else {
        setUser(null);
        setSession(null);
        getSessionWithRetry().then(({ session }) => {
          setSession(session);
          setUser(session?.user ?? null);
        });
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (isDevBypass) {
      setUser(mockUser);
      setSession(mockSession);
      setLoading(false);
      return;
    }

    // Initialize session with retry logic for Supabase free-tier wake-up
    getSessionWithRetry().then(({ session }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isDevBypass) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isDevBypass]);

  const signOut = useCallback(async () => {
    if (isDevBypass) {
      setIsDevBypass(false);
      localStorage.setItem('arogya_dev_bypass', 'false');
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  }, [isDevBypass]);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isAuthenticated,
    isDevBypass,
    toggleDevBypass,
    signOut
  }), [user, session, loading, isAuthenticated, isDevBypass, toggleDevBypass, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
