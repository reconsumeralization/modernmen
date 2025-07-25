'use client';

import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronDownIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

export default function ThemeSelector() {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeValue: string) => {
    setTheme(themeValue as any);
    setIsOpen(false);
  };

  const currentThemeConfig = availableThemes.find(t => t.value === currentTheme);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-text-primary hover:bg-opacity-80 transition-all duration-200"
        aria-label="Change theme"
      >
        <PaintBrushIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{currentThemeConfig?.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">Choose Theme</h3>
              <p className="text-xs text-text-muted">Customize the look and feel</p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {availableThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`w-full p-4 text-left hover:bg-background transition-colors ${
                    currentTheme === theme.value ? 'bg-background border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{theme.label}</div>
                      <div className="text-xs text-text-muted mt-1">{theme.description}</div>
                    </div>
                    <div className="flex gap-1 ml-3">
                      {/* Color preview */}
                      <ThemePreview themeValue={theme.value} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-border bg-background">
              <p className="text-xs text-text-muted">
                Theme preference is saved automatically
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ThemePreview({ themeValue }: { themeValue: string }) {
  const getThemeColors = (theme: string) => {
    const themes: Record<string, { primary: string; secondary: string; accent: string }> = {
      'modern-dark': { primary: '#D4AF37', secondary: '#1A1A1A', accent: '#FFD700' },
      'classic-luxury': { primary: '#B8860B', secondary: '#000000', accent: '#DAA520' },
      'minimalist': { primary: '#4F46E5', secondary: '#F8FAFC', accent: '#7C3AED' },
      'vintage-barber': { primary: '#DC143C', secondary: '#1A1A1A', accent: '#FF4444' },
      'urban-neon': { primary: '#8B5CF6', secondary: '#0F0F23', accent: '#00FFFF' },
      'natural-wood': { primary: '#8B4513', secondary: '#2F1B14', accent: '#CD853F' },
      'premium-blue': { primary: '#1E3A8A', secondary: '#F8FAFC', accent: '#FBBF24' },
      'monochrome': { primary: '#000000', secondary: '#FFFFFF', accent: '#6B7280' }
    };
    
    return themes[theme] || themes['modern-dark'];
  };

  const colors = getThemeColors(themeValue);

  return (
    <div className="flex gap-1">
      <div 
        className="w-3 h-3 rounded-full border border-opacity-20 border-white"
        style={{ backgroundColor: colors.primary }}
      />
      <div 
        className="w-3 h-3 rounded-full border border-opacity-20 border-white"
        style={{ backgroundColor: colors.secondary }}
      />
      <div 
        className="w-3 h-3 rounded-full border border-opacity-20 border-white"
        style={{ backgroundColor: colors.accent }}
      />
    </div>
  );
}
