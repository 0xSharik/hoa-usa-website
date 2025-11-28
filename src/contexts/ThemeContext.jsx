import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback
} from 'react';

const ThemeContext = createContext(undefined);
const STORAGE_KEY = 'hoa-theme';

/* ===== PROFESSIONAL COLOR PALETTES ===== */

const themes = {
  light: {
    name: 'light',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    card: 'rgba(0,0,0,0.03)',

    primary: '#4F46E5',
    primarySoft: '#EEF2FF',

    secondary: '#6366F1',
    accent: '#8B5CF6',

    text: '#111827',
    textMuted: '#6B7280',

    border: 'rgba(0,0,0,0.08)',
    shadow: 'rgba(0,0,0,0.06)',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    heroGradient:
      'linear-gradient(120deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)'
  },

  dark: {
    name: 'dark',
    background: '#111827',
    surface: '#1F2937',
    card: 'rgba(255,255,255,0.03)',

    primary: '#6366F1',
    primarySoft: '#312E81',

    secondary: '#8B5CF6',
    accent: '#A78BFA',

    text: '#F9FAFB',
    textMuted: '#9CA3AF',

    border: 'rgba(255,255,255,0.08)',
    shadow: 'rgba(0,0,0,0.4)',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    heroGradient:
      'linear-gradient(120deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)'
  }
};

/* ===== HELPERS ===== */

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const getStoredTheme = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
};

/* ===== PROVIDER ===== */

export const ThemeProvider = ({ children, defaultTheme = 'system' }) => {
  const [theme, setTheme] = useState(() => {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    if (defaultTheme === 'system') return getSystemTheme();
    return defaultTheme;
  });

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  /* ===== APPLY THEME + SMOOTH TRANSITION ===== */

  useEffect(() => {
    const root = document.documentElement;
    const colors = themes[resolvedTheme];

    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, resolvedTheme]);

  /* ===== LISTEN TO SYSTEM CHANGES ===== */

  useEffect(() => {
    if (theme !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setTheme('system');

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [theme]);

  /* ===== CONTROLS ===== */

  const toggleTheme = useCallback(() => {
    setTheme(prev =>
      prev === 'dark' ? 'light' : prev === 'light' ? 'dark' : 'dark'
    );
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === 'dark',
      setTheme,
      toggleTheme,
      colors: themes[resolvedTheme]
    }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
};

export default ThemeContext;
