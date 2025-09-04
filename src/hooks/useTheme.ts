'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function useTheme(defaultTheme: Theme = 'system'): ThemeState {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setThemeState(storedTheme);
    }
  }, []);

  // Update resolved theme when theme changes
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    // Listen for system theme changes when theme is 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateResolvedTheme();

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Add resolved theme class
    root.classList.add(resolvedTheme);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#1a1a1a' : '#ffffff');
    }
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  };
}

// Hook for managing theme with additional features
export function useAdvancedTheme(defaultTheme: Theme = 'system') {
  const themeState = useTheme(defaultTheme);

  // Get theme colors based on current theme
  const colors = {
    background: themeState.resolvedTheme === 'dark' ? '#1a1a1a' : '#ffffff',
    foreground: themeState.resolvedTheme === 'dark' ? '#ffffff' : '#000000',
    primary: themeState.resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb',
    secondary: themeState.resolvedTheme === 'dark' ? '#64748b' : '#64748b',
    accent: themeState.resolvedTheme === 'dark' ? '#374151' : '#f3f4f6',
    border: themeState.resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'
  };

  // Check if theme matches system preference
  const matchesSystem = themeState.theme === 'system' ||
    (themeState.theme === 'light' && !window.matchMedia('(prefers-color-scheme: dark)').matches) ||
    (themeState.theme === 'dark' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return {
    ...themeState,
    colors,
    matchesSystem
  };
}
