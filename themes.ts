export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    display: string;
  };
  spacing: {
    container: string;
    section: string;
    element: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  shadows: {
    light: string;
    medium: string;
    heavy: string;
  };
}

export const themes: Record<string, Theme> = {
  // Modern Minimalist (Default)
  modern: {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean, contemporary design with sharp lines and premium feel',
    colors: {
      primary: '#1a1a1a',
      secondary: '#8b5a3c',
      accent: '#d4af37',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#2c2c2c',
      textLight: '#6c757d',
      border: '#e9ecef',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545'
    },    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      secondary: "'Roboto', sans-serif",
      display: "'Playfair Display', serif"
    },
    spacing: {
      container: '1200px',
      section: '5rem',
      element: '1.5rem'
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px'
    },
    shadows: {
      light: '0 2px 4px rgba(0,0,0,0.1)',
      medium: '0 4px 12px rgba(0,0,0,0.15)',
      heavy: '0 8px 24px rgba(0,0,0,0.2)'
    }
  },

  // Classic Barber
  classic: {
    id: 'classic',
    name: 'Classic Barber',
    description: 'Traditional barbershop with vintage charm and heritage colors',
    colors: {
      primary: '#2c1810',
      secondary: '#8b0000',
      accent: '#cd853f',
      background: '#faf8f5',
      surface: '#f5f2ed',
      text: '#2c1810',
      textLight: '#5d4037',
      border: '#d7ccc8',
      success: '#2e7d32',
      warning: '#f57c00',
      error: '#c62828'
    },    fonts: {
      primary: "'Crimson Text', serif",
      secondary: "'Source Sans Pro', sans-serif",
      display: "'Fredericka the Great', cursive"
    },
    spacing: {
      container: '1100px',
      section: '4rem',
      element: '1.25rem'
    },
    borderRadius: {
      small: '2px',
      medium: '4px',
      large: '8px'
    },
    shadows: {
      light: '0 1px 3px rgba(44,24,16,0.1)',
      medium: '0 3px 8px rgba(44,24,16,0.15)',
      heavy: '0 6px 16px rgba(44,24,16,0.2)'
    }
  },

  // Industrial Dark
  industrial: {
    id: 'industrial',
    name: 'Industrial Dark',
    description: 'Bold, masculine design with dark tones and metallic accents',
    colors: {
      primary: '#121212',
      secondary: '#ff6b35',
      accent: '#ffd700',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textLight: '#b0b0b0',
      border: '#404040',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336'
    },    fonts: {
      primary: "'Oswald', sans-serif",
      secondary: "'Open Sans', sans-serif",
      display: "'Bebas Neue', cursive"
    },
    spacing: {
      container: '1300px',
      section: '6rem',
      element: '2rem'
    },
    borderRadius: {
      small: '2px',
      medium: '6px',
      large: '12px'
    },
    shadows: {
      light: '0 2px 8px rgba(255,107,53,0.1)',
      medium: '0 4px 16px rgba(255,107,53,0.2)',
      heavy: '0 8px 32px rgba(255,107,53,0.3)'
    }
  },

  // Luxury Gold
  luxury: {
    id: 'luxury',
    name: 'Luxury Gold',
    description: 'Premium, upscale design with gold accents and elegant typography',
    colors: {
      primary: '#0a0a0a',
      secondary: '#8b4513',
      accent: '#daa520',
      background: '#fefefe',
      surface: '#f9f7f4',
      text: '#1a1a1a',
      textLight: '#666666',
      border: '#e5ddd5',
      success: '#155724',
      warning: '#856404',
      error: '#721c24'
    },    fonts: {
      primary: "'Cormorant Garamond', serif",
      secondary: "'Lato', sans-serif",
      display: "'Cinzel', serif"
    },
    spacing: {
      container: '1150px',
      section: '5.5rem',
      element: '1.75rem'
    },
    borderRadius: {
      small: '6px',
      medium: '12px',
      large: '20px'
    },
    shadows: {
      light: '0 3px 6px rgba(218,165,32,0.1)',
      medium: '0 6px 18px rgba(218,165,32,0.15)',
      heavy: '0 12px 36px rgba(218,165,32,0.25)'
    }
  },

  // Urban Street
  urban: {
    id: 'urban',
    name: 'Urban Street',
    description: 'Contemporary street style with vibrant colors and bold typography',
    colors: {
      primary: '#1e1e1e',
      secondary: '#e74c3c',
      accent: '#3498db',
      background: '#ffffff',
      surface: '#f4f4f4',
      text: '#2c3e50',
      textLight: '#7f8c8d',
      border: '#bdc3c7',
      success: '#27ae60',
      warning: '#f39c12',
      error: '#e74c3c'
    },    fonts: {
      primary: "'Nunito Sans', sans-serif",
      secondary: "'Roboto Condensed', sans-serif",
      display: "'Bangers', cursive"
    },
    spacing: {
      container: '1250px',
      section: '4.5rem',
      element: '1.5rem'
    },
    borderRadius: {
      small: '8px',
      medium: '16px',
      large: '24px'
    },
    shadows: {
      light: '0 2px 8px rgba(52,152,219,0.1)',
      medium: '0 4px 16px rgba(52,152,219,0.2)',
      heavy: '0 8px 32px rgba(52,152,219,0.3)'
    }
  }
};

// Theme utility functions
export function getTheme(themeId: string): Theme {
  return themes[themeId] || themes.modern;
}

export function generateCSSVariables(theme: Theme): string {
  return `
    :root {
      /* Colors */
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-light: ${theme.colors.textLight};
      --color-border: ${theme.colors.border};
      --color-success: ${theme.colors.success};
      --color-warning: ${theme.colors.warning};
      --color-error: ${theme.colors.error};
      
      /* Fonts */
      --font-primary: ${theme.fonts.primary};
      --font-secondary: ${theme.fonts.secondary};
      --font-display: ${theme.fonts.display};      
      /* Spacing */
      --container-width: ${theme.spacing.container};
      --section-spacing: ${theme.spacing.section};
      --element-spacing: ${theme.spacing.element};
      
      /* Border Radius */
      --radius-small: ${theme.borderRadius.small};
      --radius-medium: ${theme.borderRadius.medium};
      --radius-large: ${theme.borderRadius.large};
      
      /* Shadows */
      --shadow-light: ${theme.shadows.light};
      --shadow-medium: ${theme.shadows.medium};
      --shadow-heavy: ${theme.shadows.heavy};
    }
  `;
}

export const themeList = Object.values(themes);