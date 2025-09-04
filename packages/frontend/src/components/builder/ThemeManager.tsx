// 🎨 AMAZING Theme Manager - Professional Theme System
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuilder } from '../../lib/builder-engine'
import { systemManager } from '../../config/system.config'
import { cn } from '../../lib/utils'

interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
  }
  typography: {
    heading: string
    body: string
    mono: string
  }
  spacing: {
    container: string
    section: string
    component: string
  }
  preview: string
}

const PRESET_THEMES: Theme[] = [
  {
    id: 'modern-light',
    name: 'Modern Light',
    description: 'Clean and professional light theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#10b981',
      background: '#ffffff',
      foreground: '#1f2937',
      muted: '#f8fafc'
    },
    typography: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    spacing: {
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      section: 'py-16 md:py-24',
      component: 'p-6 md:p-8'
    },
    preview: 'bg-gradient-to-br from-blue-50 to-white border border-gray-200'
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Sleek dark theme for premium feel',
    colors: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#34d399',
      background: '#0f172a',
      foreground: '#f8fafc',
      muted: '#1e293b'
    },
    typography: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    spacing: {
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      section: 'py-16 md:py-24',
      component: 'p-6 md:p-8'
    },
    preview: 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700'
  },
  {
    id: 'warm-minimal',
    name: 'Warm Minimal',
    description: 'Cozy warm colors with minimal design',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#ef4444',
      background: '#fef7ed',
      foreground: '#451a03',
      muted: '#fed7aa'
    },
    typography: {
      heading: 'Georgia, serif',
      body: 'system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    spacing: {
      container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
      section: 'py-12 md:py-20',
      component: 'p-4 md:p-6'
    },
    preview: 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200'
  },
  {
    id: 'cool-professional',
    name: 'Cool Professional',
    description: 'Cool blues and grays for corporate feel',
    colors: {
      primary: '#1e40af',
      secondary: '#475569',
      accent: '#06b6d4',
      background: '#f8fafc',
      foreground: '#0f172a',
      muted: '#e2e8f0'
    },
    typography: {
      heading: 'system-ui, sans-serif',
      body: 'system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    spacing: {
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      section: 'py-16 md:py-24',
      component: 'p-6 md:p-8'
    },
    preview: 'bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-200'
  },
  {
    id: 'vibrant-playful',
    name: 'Vibrant Playful',
    description: 'Bold colors for creative and fun designs',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#f97316',
      background: '#fefefe',
      foreground: '#1f2937',
      muted: '#f3f4f6'
    },
    typography: {
      heading: 'Poppins, sans-serif',
      body: 'Open Sans, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    spacing: {
      container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
      section: 'py-14 md:py-22',
      component: 'p-5 md:p-7'
    },
    preview: 'bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 border border-pink-200'
  }
]

export function ThemeManager() {
  const { currentPage, applyTheme } = useBuilder()
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [customThemes, setCustomThemes] = useState<Theme[]>([])
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  // Apply theme to current page
  const handleApplyTheme = async (theme: Theme) => {
    if (!currentPage) return

    setIsApplying(true)
    try {
      await applyTheme(currentPage.id, theme)
      setSelectedTheme(theme.id)

      // Show success feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = `Theme "${theme.name}" applied successfully!`
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)

    } catch (error) {
      console.error('Failed to apply theme:', error)

      // Show error feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = 'Failed to apply theme. Please try again.'
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)
    } finally {
      setIsApplying(false)
    }
  }

  // Save custom theme
  const handleSaveCustomTheme = (theme: Theme) => {
    setCustomThemes(prev => [...prev, theme])
    setShowCustomizer(false)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">🎨 Theme Manager</h2>
            <p className="text-sm text-gray-600">Apply beautiful themes to your pages</p>
          </div>

          <motion.button
            onClick={() => setShowCustomizer(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Custom Theme
          </motion.button>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-8">
          {/* Preset Themes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">✨ Preset Themes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRESET_THEMES.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme === theme.id}
                  isApplying={isApplying}
                  onApply={() => handleApplyTheme(theme)}
                />
              ))}
            </div>
          </div>

          {/* Custom Themes */}
          {customThemes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Custom Themes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isSelected={selectedTheme === theme.id}
                    isApplying={isApplying}
                    onApply={() => handleApplyTheme(theme)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Theme Modal */}
      <AnimatePresence>
        {showCustomizer && (
          <CustomThemeModal
            onSave={handleSaveCustomTheme}
            onClose={() => setShowCustomizer(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// 🎨 Theme Card Component
interface ThemeCardProps {
  theme: Theme
  isSelected: boolean
  isApplying: boolean
  onApply: () => void
}

function ThemeCard({ theme, isSelected, isApplying, onApply }: ThemeCardProps) {
  return (
    <motion.div
      className={cn(
        "relative bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200",
        isSelected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
      )}
      whileHover={{ y: -2 }}
      onClick={onApply}
    >
      {/* Preview */}
      <div className={cn("h-32", theme.preview)}>
        <div className="h-full flex items-center justify-center">
          <div
            className="text-2xl font-bold"
            style={{ color: theme.colors.primary }}
          >
            Aa
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">{theme.name}</h4>
          {isSelected && (
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">{theme.description}</p>

        {/* Color Palette */}
        <div className="flex gap-2 mb-4">
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: theme.colors.primary }}
            title="Primary"
          />
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: theme.colors.secondary }}
            title="Secondary"
          />
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: theme.colors.accent }}
            title="Accent"
          />
        </div>

        <motion.button
          className={cn(
            "w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors",
            isSelected
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isApplying}
          onClick={(e) => {
            e.stopPropagation()
            onApply()
          }}
        >
          {isApplying ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Applying...
            </div>
          ) : isSelected ? (
            'Applied'
          ) : (
            'Apply Theme'
          )}
        </motion.button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}

// 🎨 Custom Theme Modal
interface CustomThemeModalProps {
  onSave: (theme: Theme) => void
  onClose: () => void
}

function CustomThemeModal({ onSave, onClose }: CustomThemeModalProps) {
  const [themeData, setThemeData] = useState({
    name: '',
    description: '',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#10b981',
      background: '#ffffff',
      foreground: '#1f2937',
      muted: '#f8fafc'
    },
    typography: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    spacing: {
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      section: 'py-16 md:py-24',
      component: 'p-6 md:p-8'
    }
  })

  const handleSave = () => {
    if (!themeData.name.trim()) return

    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      ...themeData
    }

    onSave(newTheme)
  }

  const updateColor = (key: keyof Theme['colors'], value: string) => {
    setThemeData(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }))
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">🎨 Create Custom Theme</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Name
                </label>
                <input
                  type="text"
                  value={themeData.name}
                  onChange={(e) => setThemeData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="My Awesome Theme"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={themeData.description}
                  onChange={(e) => setThemeData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="A brief description"
                />
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">🎨 Color Palette</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(themeData.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => updateColor(key as keyof Theme['colors'], e.target.value)}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateColor(key as keyof Theme['colors'], e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">📝 Typography</h3>
              <div className="space-y-4">
                {Object.entries(themeData.typography).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key} Font
                    </label>
                    <select
                      value={value}
                      onChange={(e) => setThemeData(prev => ({
                        ...prev,
                        typography: { ...prev.typography, [key]: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="system-ui, sans-serif">System UI</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Poppins, sans-serif">Poppins</option>
                      <option value="Open Sans, sans-serif">Open Sans</option>
                      <option value="JetBrains Mono, monospace">JetBrains Mono</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">👁️ Preview</h3>
              <div
                className="h-32 rounded-lg border border-gray-200 flex items-center justify-center"
                style={{
                  backgroundColor: themeData.colors.background,
                  color: themeData.colors.foreground
                }}
              >
                <div className="text-center">
                  <h4
                    className="text-xl font-bold mb-2"
                    style={{
                      color: themeData.colors.primary,
                      fontFamily: themeData.typography.heading
                    }}
                  >
                    {themeData.name || 'Theme Preview'}
                  </h4>
                  <p
                    className="text-sm"
                    style={{
                      color: themeData.colors.foreground,
                      fontFamily: themeData.typography.body
                    }}
                  >
                    This is how your content will look
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!themeData.name.trim()}
            className={cn(
              "px-4 py-2 rounded-lg transition-colors",
              themeData.name.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            Save Theme
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
