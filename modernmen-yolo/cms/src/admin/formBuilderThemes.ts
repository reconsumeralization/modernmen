import React from 'react';

// Form Builder Theme System for ModernMen CMS
export interface FormBuilderTheme {
  id: string;
  name: string;
  description: string;
  preview: React.ComponentType;
  cssVariables: Record<string, string>;
  cssClasses: Record<string, string>;
  isDefault?: boolean;
}

// Theme 1: ModernMen Professional (Default)
export const modernmenProfessional: FormBuilderTheme = {
  id: 'modernmen-professional',
  name: 'ModernMen Professional',
  description: 'Clean, professional styling with ModernMen brand colors',
  isDefault: true,
  cssVariables: {
    '--form-primary-color': '#1f2937',
    '--form-secondary-color': '#374151',
    '--form-accent-color': '#60a5fa',
    '--form-success-color': '#22c55e',
    '--form-error-color': '#ef4444',
    '--form-warning-color': '#f59e0b',
    '--form-text-color': '#1f2937',
    '--form-text-light': '#6b7280',
    '--form-border-color': '#d1d5db',
    '--form-border-focus': '#3b82f6',
    '--form-bg-color': '#ffffff',
    '--form-bg-hover': '#f9fafb',
    '--form-input-bg': '#fafafa',
    '--form-input-border': '#a9a9a9',
    '--form-button-bg': '#1f2937',
    '--form-button-hover': '#111827',
    '--form-button-text': '#ffffff',
    '--form-shadow': '0 1px 3px rgba(0, 0, 0, 0.1)',
    '--form-shadow-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
    '--form-radius': '0.5rem',
    '--form-transition': 'all 0.2s ease'
  },
  cssClasses: {
    'form-container': 'modernmen-form-container',
    'form-field': 'modernmen-form-field',
    'form-input': 'modernmen-form-input',
    'form-textarea': 'modernmen-form-textarea',
    'form-select': 'modernmen-form-select',
    'form-checkbox': 'modernmen-form-checkbox',
    'form-radio': 'modernmen-form-radio',
    'form-button': 'modernmen-form-button',
    'form-button-primary': 'modernmen-form-button-primary',
    'form-button-secondary': 'modernmen-form-button-secondary',
    'form-error': 'modernmen-form-error',
    'form-success': 'modernmen-form-success',
    'form-label': 'modernmen-form-label',
    'form-help': 'modernmen-form-help',
    'form-group': 'modernmen-form-group',
    'form-row': 'modernmen-form-row',
    'form-col': 'modernmen-form-col'
  }
};

// Theme 2: ModernMen Elegant
export const modernmenElegant: FormBuilderTheme = {
  id: 'modernmen-elegant',
  name: 'ModernMen Elegant',
  description: 'Sophisticated styling with refined typography and spacing',
  cssVariables: {
    '--form-primary-color': '#2d3748',
    '--form-secondary-color': '#4a5568',
    '--form-accent-color': '#805ad5',
    '--form-success-color': '#38a169',
    '--form-error-color': '#e53e3e',
    '--form-warning-color': '#d69e2e',
    '--form-text-color': '#2d3748',
    '--form-text-light': '#718096',
    '--form-border-color': '#e2e8f0',
    '--form-border-focus': '#805ad5',
    '--form-bg-color': '#ffffff',
    '--form-bg-hover': '#f7fafc',
    '--form-input-bg': '#ffffff',
    '--form-input-border': '#e2e8f0',
    '--form-button-bg': '#2d3748',
    '--form-button-hover': '#1a202c',
    '--form-button-text': '#ffffff',
    '--form-shadow': '0 4px 6px rgba(0, 0, 0, 0.05)',
    '--form-shadow-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
    '--form-radius': '0.75rem',
    '--form-transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  cssClasses: {
    'form-container': 'modernmen-form-container elegant',
    'form-field': 'modernmen-form-field elegant',
    'form-input': 'modernmen-form-input elegant',
    'form-textarea': 'modernmen-form-textarea elegant',
    'form-select': 'modernmen-form-select elegant',
    'form-checkbox': 'modernmen-form-checkbox elegant',
    'form-radio': 'modernmen-form-radio elegant',
    'form-button': 'modernmen-form-button elegant',
    'form-button-primary': 'modernmen-form-button-primary elegant',
    'form-button-secondary': 'modernmen-form-button-secondary elegant',
    'form-error': 'modernmen-form-error elegant',
    'form-success': 'modernmen-form-success elegant',
    'form-label': 'modernmen-form-label elegant',
    'form-help': 'modernmen-form-help elegant',
    'form-group': 'modernmen-form-group elegant',
    'form-row': 'modernmen-form-row elegant',
    'form-col': 'modernmen-form-col elegant'
  }
};

// Theme 3: ModernMen Minimal
export const modernmenMinimal: FormBuilderTheme = {
  id: 'modernmen-minimal',
  name: 'ModernMen Minimal',
  description: 'Clean, minimal design with focus on content',
  cssVariables: {
    '--form-primary-color': '#000000',
    '--form-secondary-color': '#666666',
    '--form-accent-color': '#000000',
    '--form-success-color': '#000000',
    '--form-error-color': '#ff0000',
    '--form-warning-color': '#ff6600',
    '--form-text-color': '#000000',
    '--form-text-light': '#666666',
    '--form-border-color': '#e5e5e5',
    '--form-border-focus': '#000000',
    '--form-bg-color': '#ffffff',
    '--form-bg-hover': '#fafafa',
    '--form-input-bg': '#ffffff',
    '--form-input-border': '#e5e5e5',
    '--form-button-bg': '#000000',
    '--form-button-hover': '#333333',
    '--form-button-text': '#ffffff',
    '--form-shadow': 'none',
    '--form-shadow-hover': 'none',
    '--form-radius': '0',
    '--form-transition': 'all 0.2s ease'
  },
  cssClasses: {
    'form-container': 'modernmen-form-container minimal',
    'form-field': 'modernmen-form-field minimal',
    'form-input': 'modernmen-form-input minimal',
    'form-textarea': 'modernmen-form-textarea minimal',
    'form-select': 'modernmen-form-select minimal',
    'form-checkbox': 'modernmen-form-checkbox minimal',
    'form-radio': 'modernmen-form-radio minimal',
    'form-button': 'modernmen-form-button minimal',
    'form-button-primary': 'modernmen-form-button-primary minimal',
    'form-button-secondary': 'modernmen-form-button-secondary minimal',
    'form-error': 'modernmen-form-error minimal',
    'form-success': 'modernmen-form-success minimal',
    'form-label': 'modernmen-form-label minimal',
    'form-help': 'modernmen-form-help minimal',
    'form-group': 'modernmen-form-group minimal',
    'form-row': 'modernmen-form-row minimal',
    'form-col': 'modernmen-form-col minimal'
  }
};

// Theme 4: ModernMen Bold
export const modernmenBold: FormBuilderTheme = {
  id: 'modernmen-bold',
  name: 'ModernMen Bold',
  description: 'High contrast, bold styling for maximum impact',
  cssVariables: {
    '--form-primary-color': '#000000',
    '--form-secondary-color': '#ffffff',
    '--form-accent-color': '#ff6b35',
    '--form-success-color': '#00ff00',
    '--form-error-color': '#ff0000',
    '--form-warning-color': '#ffff00',
    '--form-text-color': '#000000',
    '--form-text-light': '#333333',
    '--form-border-color': '#000000',
    '--form-border-focus': '#ff6b35',
    '--form-bg-color': '#ffffff',
    '--form-bg-hover': '#f0f0f0',
    '--form-input-bg': '#ffffff',
    '--form-input-border': '#000000',
    '--form-button-bg': '#000000',
    '--form-button-hover': '#ff6b35',
    '--form-button-text': '#ffffff',
    '--form-shadow': '4px 4px 0px #000000',
    '--form-shadow-hover': '6px 6px 0px #000000',
    '--form-radius': '0',
    '--form-transition': 'all 0.1s ease'
  },
  cssClasses: {
    'form-container': 'modernmen-form-container bold',
    'form-field': 'modernmen-form-field bold',
    'form-input': 'modernmen-form-input bold',
    'form-textarea': 'modernmen-form-textarea bold',
    'form-select': 'modernmen-form-select bold',
    'form-checkbox': 'modernmen-form-checkbox bold',
    'form-radio': 'modernmen-form-radio bold',
    'form-button': 'modernmen-form-button bold',
    'form-button-primary': 'modernmen-form-button-primary bold',
    'form-button-secondary': 'modernmen-form-button-secondary bold',
    'form-error': 'modernmen-form-error bold',
    'form-success': 'modernmen-form-success bold',
    'form-label': 'modernmen-form-label bold',
    'form-help': 'modernmen-form-help bold',
    'form-group': 'modernmen-form-group bold',
    'form-row': 'modernmen-form-row bold',
    'form-col': 'modernmen-form-col bold'
  }
};

// Theme 5: ModernMen Warm
export const modernmenWarm: FormBuilderTheme = {
  id: 'modernmen-warm',
  name: 'ModernMen Warm',
  description: 'Warm, inviting colors with comfortable spacing',
  cssVariables: {
    '--form-primary-color': '#8b4513',
    '--form-secondary-color': '#a0522d',
    '--form-accent-color': '#ff8c00',
    '--form-success-color': '#228b22',
    '--form-error-color': '#dc143c',
    '--form-warning-color': '#ffa500',
    '--form-text-color': '#2f1b14',
    '--form-text-light': '#8b7355',
    '--form-border-color': '#d2b48c',
    '--form-border-focus': '#ff8c00',
    '--form-bg-color': '#faf0e6',
    '--form-bg-hover': '#f5e6d3',
    '--form-input-bg': '#ffffff',
    '--form-input-border': '#d2b48c',
    '--form-button-bg': '#8b4513',
    '--form-button-hover': '#a0522d',
    '--form-button-text': '#ffffff',
    '--form-shadow': '0 2px 8px rgba(139, 69, 19, 0.1)',
    '--form-shadow-hover': '0 4px 16px rgba(139, 69, 19, 0.2)',
    '--form-radius': '1rem',
    '--form-transition': 'all 0.3s ease'
  },
  cssClasses: {
    'form-container': 'modernmen-form-container warm',
    'form-field': 'modernmen-form-field warm',
    'form-input': 'modernmen-form-input warm',
    'form-textarea': 'modernmen-form-textarea warm',
    'form-select': 'modernmen-form-select warm',
    'form-checkbox': 'modernmen-form-checkbox warm',
    'form-radio': 'modernmen-form-radio warm',
    'form-button': 'modernmen-form-button warm',
    'form-button-primary': 'modernmen-form-button-primary warm',
    'form-button-secondary': 'modernmen-form-button-secondary warm',
    'form-error': 'modernmen-form-error warm',
    'form-success': 'modernmen-form-success warm',
    'form-label': 'modernmen-form-label warm',
    'form-help': 'modernmen-form-help warm',
    'form-group': 'modernmen-form-group warm',
    'form-row': 'modernmen-form-row warm',
    'form-col': 'modernmen-form-col warm'
  }
};

// All available themes
export const formBuilderThemes: FormBuilderTheme[] = [
  modernmenProfessional,
  modernmenElegant,
  modernmenMinimal,
  modernmenBold,
  modernmenWarm
];

// Theme selector component
export const FormThemeSelector: React.FC<{
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
}> = ({ selectedTheme, onThemeChange }) => {
  return (
    <div className="form-theme-selector">
      <label htmlFor="theme-select" className="theme-selector-label">
        Form Theme:
      </label>
      <select
        id="theme-select"
        value={selectedTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        className="theme-selector-dropdown"
      >
        {formBuilderThemes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
      <div className="theme-description">
        {formBuilderThemes.find(t => t.id === selectedTheme)?.description}
      </div>
    </div>
  );
};

// Theme preview component
export const FormThemePreview: React.FC<{
  theme: FormBuilderTheme;
}> = ({ theme }) => {
  return (
    <div className="form-theme-preview">
      <h4>{theme.name}</h4>
      <div className="preview-form" style={theme.cssVariables as React.CSSProperties}>
        <div className={theme.cssClasses['form-field']}>
          <label className={theme.cssClasses['form-label']}>Sample Input</label>
          <input
            type="text"
            className={theme.cssClasses['form-input']}
            placeholder="Enter text..."
          />
        </div>
        <div className={theme.cssClasses['form-field']}>
          <button className={theme.cssClasses['form-button-primary']}>
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
};

// Export default theme
export const defaultFormTheme = modernmenProfessional;

// Theme utilities
export const getFormTheme = (themeId: string): FormBuilderTheme => {
  return formBuilderThemes.find(theme => theme.id === themeId) || defaultFormTheme;
};

export const getFormThemeCSS = (theme: FormBuilderTheme): string => {
  const cssVariables = Object.entries(theme.cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');

  return `
/* ModernMen Form Builder Theme: ${theme.name} */
.modernmen-form-builder[data-theme="${theme.id}"] {
  ${cssVariables}
}
  `.trim();
};

export default {
  formBuilderThemes,
  defaultFormTheme,
  getFormTheme,
  getFormThemeCSS,
  FormThemeSelector,
  FormThemePreview
};
