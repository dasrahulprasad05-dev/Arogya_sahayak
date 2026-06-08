import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../integrations/supabase/client';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('arogya_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  useEffect(() => {
    if (isAuthenticated && user && user.id !== '00000000-0000-0000-0000-000000000000') {
      supabase
        .from('profiles')
        .select('theme')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data && data.theme) {
            const nextTheme = data.theme as Theme;
            setTheme(nextTheme);
            localStorage.setItem('arogya_theme', nextTheme);
          }
        });
    }
  }, [user, isAuthenticated]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('arogya_theme', next);

      if (isAuthenticated && user && user.id !== '00000000-0000-0000-0000-000000000000') {
        supabase
          .from('profiles')
          .update({ theme: next, updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .then(({ error }) => {
            if (error) {
              console.error('Failed to sync theme preference:', error.message);
            }
          });
      }
      return next;
    });
  }, [user, isAuthenticated]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
