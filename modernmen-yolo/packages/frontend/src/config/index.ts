// =============================================================================
// CONFIGURATION INDEX - Application configuration management
// =============================================================================

// -----------------------------------------------------------------------------
// ENVIRONMENT CONFIGURATION - Environment variable handling
// -----------------------------------------------------------------------------
export const env = {
  // Supabase Configuration
  supabase: {
    projectId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  },

  // Application Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'ModernMen',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000')
  }
}

// -----------------------------------------------------------------------------
// FEATURE FLAGS - Feature toggle configuration
// -----------------------------------------------------------------------------
export const featureFlags = {
  builder: process.env.NEXT_PUBLIC_ENABLE_BUILDER === 'true',
  notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
  analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  debug: process.env.NODE_ENV === 'development'
}

// -----------------------------------------------------------------------------
// VALIDATION RULES - Common validation configurations
// -----------------------------------------------------------------------------
export const validation = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/
  }
}

// -----------------------------------------------------------------------------
// THEME CONFIGURATION - Theme and styling configuration
// -----------------------------------------------------------------------------
export const theme = {
  colors: {
    primary: '#000000',
    secondary: '#666666',
    accent: '#ff6b35',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
}

// -----------------------------------------------------------------------------
// TYPE EXPORTS - Configuration types
// -----------------------------------------------------------------------------
export type Environment = typeof env
export type FeatureFlags = typeof featureFlags
export type ValidationRules = typeof validation
export type ThemeConfig = typeof theme
