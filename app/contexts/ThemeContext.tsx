'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeVariant = 
  | 'modern-dark'      // Original dark theme
  | 'classic-luxury'   // Gold/black luxury
  | 'minimalist'       // Clean white/gray
  | 'vintage-barber'   // Red/black traditional
  | 'urban-neon'       // Purple/cyan modern
  | 'natural-wood'     // Brown/green organic
  | 'premium-blue'     // Navy/gold professional
  | 'monochrome';      // Black/white/gray

interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    hero: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

const themes: Record<ThemeVariant, ThemeConfig> = {
  'modern-dark': {
    name: 'modern-dark',
    displayName: 'Modern Dark',
    description: 'Sleek dark theme with gold accents',
    colors: {
      primary: '#D4AF37',
      secondary: '#1A1A1A',
      accent: '#FFD700',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: {
        primary: '#FFFFFF',
        secondary: '#D4AF37',
        muted: '#888888'
      },
      border: '#333333',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
      secondary: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
      hero: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #2A2A2A 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(212, 175, 55, 0.1)',
      md: '0 4px 6px -1px rgba(212, 175, 55, 0.1)',
      lg: '0 10px 15px -3px rgba(212, 175, 55, 0.1)',
      xl: '0 20px 25px -5px rgba(212, 175, 55, 0.2)'
    }
  },

  'classic-luxury': {
    name: 'classic-luxury',
    displayName: 'Classic Luxury',
    description: 'Timeless elegance with rich gold and deep black',
    colors: {
      primary: '#B8860B',
      secondary: '#000000',
      accent: '#DAA520',
      background: '#1C1C1C',
      surface: '#2C2C2C',
      text: {
        primary: '#F5F5DC',
        secondary: '#DAA520',
        muted: '#A0A0A0'
      },
      border: '#444444',
      success: '#228B22',
      warning: '#FF8C00',
      error: '#DC143C'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
      secondary: 'linear-gradient(135deg, #000000 0%, #2C2C2C 100%)',
      hero: 'linear-gradient(135deg, #1C1C1C 0%, #2C2C2C 50%, #3C3C3C 100%)'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Source Sans Pro, sans-serif'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(184, 134, 11, 0.15)',
      md: '0 4px 6px -1px rgba(184, 134, 11, 0.15)',
      lg: '0 10px 15px -3px rgba(184, 134, 11, 0.15)',
      xl: '0 20px 25px -5px rgba(184, 134, 11, 0.25)'
    }
  },

  'minimalist': {
    name: 'minimalist',
    displayName: 'Minimalist',
    description: 'Clean and simple with subtle accents',
    colors: {
      primary: '#4F46E5',
      secondary: '#F8FAFC',
      accent: '#7C3AED',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: {
        primary: '#1E293B',
        secondary: '#475569',
        muted: '#94A3B8'
      },
      border: '#E2E8F0',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
      secondary: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
      hero: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)'
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
    }
  },

  'vintage-barber': {
    name: 'vintage-barber',
    displayName: 'Vintage Barber',
    description: 'Classic barbershop with red and black',
    colors: {
      primary: '#DC143C',
      secondary: '#1A1A1A',
      accent: '#FF4444',
      background: '#0F0F0F',
      surface: '#2A1A1A',
      text: {
        primary: '#F5F5F5',
        secondary: '#DC143C',
        muted: '#999999'
      },
      border: '#444444',
      success: '#32CD32',
      warning: '#FFA500',
      error: '#FF6B6B'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #DC143C 0%, #FF4444 100%)',
      secondary: 'linear-gradient(135deg, #1A1A1A 0%, #2A1A1A 100%)',
      hero: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #2A1A1A 100%)'
    },
    fonts: {
      heading: 'Bebas Neue, sans-serif',
      body: 'Open Sans, sans-serif'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(220, 20, 60, 0.1)',
      md: '0 4px 6px -1px rgba(220, 20, 60, 0.1)',
      lg: '0 10px 15px -3px rgba(220, 20, 60, 0.1)',
      xl: '0 20px 25px -5px rgba(220, 20, 60, 0.2)'
    }
  },

  'urban-neon': {
    name: 'urban-neon',
    displayName: 'Urban Neon',
    description: 'Futuristic cyber aesthetic',
    colors: {
      primary: '#8B5CF6',
      secondary: '#0F0F23',
      accent: '#00FFFF',
      background: '#050505',
      surface: '#1A1A2E',
      text: {
        primary: '#E5E7EB',
        secondary: '#8B5CF6',
        muted: '#9CA3AF'
      },
      border: '#374151',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8B5CF6 0%, #00FFFF 100%)',
      secondary: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      hero: 'linear-gradient(135deg, #050505 0%, #0F0F23 50%, #1A1A2E 100%)'
    },
    fonts: {
      heading: 'Orbitron, monospace',
      body: 'Roboto, sans-serif'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(139, 92, 246, 0.1)',
      md: '0 4px 6px -1px rgba(139, 92, 246, 0.15)',
      lg: '0 10px 15px -3px rgba(139, 92, 246, 0.2)',
      xl: '0 20px 25px -5px rgba(139, 92, 246, 0.3)'
    }
  },

  'natural-wood': {
    name: 'natural-wood',
    displayName: 'Natural Wood',
    description: 'Organic earth tones with wood textures',
    colors: {
      primary: '#8B4513',
      secondary: '#2F1B14',
      accent: '#CD853F',
      background: '#FDF6E3',
      surface: '#F5DEB3',
      text: {
        primary: '#3E2723',
        secondary: '#8B4513',
        muted: '#8D6E63'
      },
      border: '#D7CCC8',
      success: '#388E3C',
      warning: '#F57C00',
      error: '#D32F2F'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8B4513 0%, #CD853F 100%)',
      secondary: 'linear-gradient(135deg, #2F1B14 0%, #5D4037 100%)',
      hero: 'linear-gradient(135deg, #FDF6E3 0%, #F5DEB3 50%, #DDD6C7 100%)'
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Lato, sans-serif'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(139, 69, 19, 0.1)',
      md: '0 4px 6px -1px rgba(139, 69, 19, 0.1)',
      lg: '0 10px 15px -3px rgba(139, 69, 19, 0.1)',
      xl: '0 20px 25px -5px rgba(139, 69, 19, 0.15)'
    }
  },

  'premium-blue': {
    name: 'premium-blue',
    displayName: 'Premium Blue',
    description: 'Professional navy with gold highlights',
    colors: {
      primary: '#1E3A8A',
      secondary: '#F8FAFC',
      accent: '#FBBF24',
      background: '#FFFFFF',
      surface: '#F1F5F9',
      text: {
        primary: '#1E293B',
        secondary: '#1E3A8A',
        muted: '#64748B'
      },
      border: '#CBD5E1',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1E3A8A 0%, #FBBF24 100%)',
      secondary: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
      hero: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #EFF6FF 100%)'
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Source Sans Pro, sans-serif'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(30, 58, 138, 0.05)',
      md: '0 4px 6px -1px rgba(30, 58, 138, 0.1)',
      lg: '0 10px 15px -3px rgba(30, 58, 138, 0.1)',
      xl: '0 20px 25px -5px rgba(30, 58, 138, 0.15)'
    }
  },

  'monochrome': {
    name: 'monochrome',
    displayName: 'Monochrome',
    description: 'Sophisticated black, white, and gray palette',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#6B7280',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: {
        primary: '#111827',
        secondary: '#374151',
        muted: '#9CA3AF'
      },
      border: '#E5E7EB',
      success: '#065F46',
      warning: '#92400E',
      error: '#991B1B'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #000000 0%, #6B7280 100%)',
      secondary: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
      hero: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)'
    },
    fonts: {
      heading: 'Space Grotesk, sans-serif',
      body: 'Inter, sans-serif'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
    }
  }
};

interface ThemeContextType {
  currentTheme: ThemeVariant;
  theme: ThemeConfig;
  setTheme: (theme: ThemeVariant) => void;
  availableThemes: { value: ThemeVariant; label: string; description: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>('modern-dark');

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('modernmen-theme') as ThemeVariant;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme CSS variables
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    // Apply color variables
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text-primary', theme.colors.text.primary);
    root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--color-text-muted', theme.colors.text.muted);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-error', theme.colors.error);

    // Apply gradient variables
    root.style.setProperty('--gradient-primary', theme.gradients.primary);
    root.style.setProperty('--gradient-secondary', theme.gradients.secondary);
    root.style.setProperty('--gradient-hero', theme.gradients.hero);

    // Apply font variables
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);

    // Apply shadow variables
    root.style.setProperty('--shadow-sm', theme.shadows.sm);
    root.style.setProperty('--shadow-md', theme.shadows.md);
    root.style.setProperty('--shadow-lg', theme.shadows.lg);
    root.style.setProperty('--shadow-xl', theme.shadows.xl);

    // Add theme class to body
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  const setTheme = (theme: ThemeVariant) => {
    setCurrentTheme(theme);
    localStorage.setItem('modernmen-theme', theme);
  };

  const availableThemes = Object.entries(themes).map(([key, config]) => ({
    value: key as ThemeVariant,
    label: config.displayName,
    description: config.description
  }));

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        theme: themes[currentTheme],
        setTheme,
        availableThemes
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
