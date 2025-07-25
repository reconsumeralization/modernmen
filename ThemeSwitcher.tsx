import React, { useState, useEffect } from 'react';
import { themes, generateCSSVariables, Theme } from './themes';

interface ThemeSwitcherProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  showInDemo?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
  showInDemo = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentThemeData = themes[currentTheme];

  return (
    <div className={`theme-switcher ${showInDemo ? 'demo-mode' : ''}`}>
      <button
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch theme"
      >
        <span className="theme-icon">🎨</span>
        {showInDemo && (
          <span className="theme-label">
            {currentThemeData.name}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">
            <h3>Choose Theme</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="theme-grid">
            {Object.values(themes).map((theme) => (
              <div
                key={theme.id}
                className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => {
                  onThemeChange(theme.id);
                  setIsOpen(false);
                }}
              >              >
                <div 
                  className="theme-preview"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 50%, ${theme.colors.accent} 100%)`
                  }}
                >
                  <div className="theme-preview-content">
                    <div className="preview-header" style={{ backgroundColor: theme.colors.primary }}></div>
                    <div className="preview-body" style={{ backgroundColor: theme.colors.background }}>
                      <div className="preview-text" style={{ backgroundColor: theme.colors.text }}></div>
                      <div className="preview-accent" style={{ backgroundColor: theme.colors.accent }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="theme-info">
                  <h4>{theme.name}</h4>
                  <p>{theme.description}</p>
                </div>
                
                {currentTheme === theme.id && (
                  <div className="active-indicator">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for theme management
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('modern');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('barbershop-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme CSS variables
    const theme = themes[currentTheme];
    const cssVariables = generateCSSVariables(theme);
    
    // Remove existing theme style
    const existingStyle = document.getElementById('theme-variables');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Add new theme style
    const styleElement = document.createElement('style');
    styleElement.id = 'theme-variables';
    styleElement.textContent = cssVariables;
    document.head.appendChild(styleElement);
    
    // Save to localStorage
    localStorage.setItem('barbershop-theme', currentTheme);
  }, [currentTheme]);

  return {
    currentTheme,
    setTheme: setCurrentTheme,
    themeData: themes[currentTheme]
  };
};