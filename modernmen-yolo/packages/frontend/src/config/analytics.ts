/**
 * Google Analytics 4 Configuration
 *
 * This file contains the configuration for GA4 tracking implementation
 */

export const GA_CONFIG = {
  // Get this from your GA4 property settings
  TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',

  // Debug mode for development
  DEBUG: process.env.NEXT_PUBLIC_GA_DEBUG === 'true' || process.env.NODE_ENV === 'development',

  // Test mode for development
  TEST_MODE: process.env.NEXT_PUBLIC_GA_TEST_MODE === 'true' || process.env.NODE_ENV === 'development',

  // Privacy and compliance settings
  CONSENT_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_CONSENT !== 'false',
  GDPR_COMPLIANCE: process.env.NEXT_PUBLIC_GDPR_COMPLIANCE === 'true',
}

// Custom dimensions for enhanced tracking
export const CUSTOM_DIMENSIONS = {
  SERVICE_TYPE: 'service_type',
  BARBER_SELECTED: 'barber_selected',
  BOOKING_STEP: 'booking_step',
  PAYMENT_METHOD: 'payment_method',
  CUSTOMER_TYPE: 'customer_type',
  DEVICE_CATEGORY: 'device_category',
  TRAFFIC_SOURCE: 'traffic_source',
}

// Custom metrics
export const CUSTOM_METRICS = {
  BOOKING_VALUE: 'booking_value',
  TIME_TO_BOOK: 'time_to_book',
  SESSION_DURATION: 'session_duration',
}

// E-commerce configuration
export const ECOMMERCE_CONFIG = {
  CURRENCY: 'USD',
  TAX_RATE: 0.08, // 8% tax rate
  SHIPPING_COST: 0,
}

// Conversion goals
export const CONVERSION_GOALS = {
  BOOKING_COMPLETED: 'booking_completed',
  PAYMENT_COMPLETED: 'payment_completed',
  LEAD_GENERATED: 'lead_generated',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
}

// Event tracking configuration
export const EVENT_CONFIG = {
  // Debounce settings for performance
  SCROLL_DEBOUNCE_MS: 1000,
  TIME_SPENT_DEBOUNCE_MS: 5000,

  // Scroll depth milestones
  SCROLL_MILESTONES: [25, 50, 75, 90, 100],

  // Time spent milestones (in seconds)
  TIME_MILESTONES: [30, 60, 120, 300, 600],
}

// Privacy and consent settings
export const PRIVACY_CONFIG = {
  CONSENT_COOKIE_NAME: 'modernmen_analytics_consent',
  CONSENT_EXPIRY_DAYS: 365,
  DEFAULT_CONSENT: false,
}

// Validation
export function validateGAConfig(): boolean {
  if (!GA_CONFIG.TRACKING_ID) {
    console.warn('GA4 tracking ID not configured. Analytics will be disabled.')
    return false
  }

  if (!GA_CONFIG.TRACKING_ID.startsWith('G-')) {
    console.error('Invalid GA4 tracking ID format. Should start with "G-"')
    return false
  }

  return true
}

// Helper functions
export function isAnalyticsEnabled(): boolean {
  return validateGAConfig() && GA_CONFIG.CONSENT_ENABLED
}

export function getUserConsent(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const consent = localStorage.getItem(PRIVACY_CONFIG.CONSENT_COOKIE_NAME)
    return consent === 'true'
  } catch (error) {
    console.warn('Failed to read analytics consent from localStorage:', error)
    return PRIVACY_CONFIG.DEFAULT_CONSENT
  }
}

export function setUserConsent(consent: boolean): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(PRIVACY_CONFIG.CONSENT_COOKIE_NAME, consent.toString())
  } catch (error) {
    console.warn('Failed to save analytics consent to localStorage:', error)
  }
}
