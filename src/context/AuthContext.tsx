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
        supabase.auth.getSession().then(({ data }) => {
          setSession(data.session);
          setUser(data.session?.user ?? null);
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

    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
