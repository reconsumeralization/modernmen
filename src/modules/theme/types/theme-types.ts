// Theme Module Types
// Type definitions for theme and styling components

export interface ThemeConfig {
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
    border: string
  }
  fonts: {
    heading: string
    body: string
    mono: string
  }
  spacing: {
    small: string
    medium: string
    large: string
    xl: string
  }
  borderRadius: {
    small: string
    medium: string
    large: string
    full: string
  }
}

export interface ThemeComponent {
  id: string
  name: string
  category: 'layout' | 'content' | 'form' | 'navigation' | 'feedback'
  component: React.ComponentType<any>
  themeProps?: Record<string, any>
  preview?: React.ReactNode
}

export interface ThemeShowcaseWidgetProps {
  themes?: ThemeConfig[]
  currentTheme?: string
  onThemeChange?: (themeId: string) => void
  showPreview?: boolean
  compact?: boolean
}

export interface ThemeProviderProps {
  theme?: ThemeConfig
  children: React.ReactNode
  enableSystemTheme?: boolean
  enableTransitions?: boolean
}
