import React from 'react'
import ReactGA from 'react-ga4'

// Analytics configuration
export interface AnalyticsConfig {
  trackingId: string
  debug?: boolean
  testMode?: boolean
}

// Event types for tracking
export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  customParameters?: Record<string, any>
}

// User properties
export interface UserProperties {
  userType?: 'new' | 'returning' | 'vip'
  membershipStatus?: 'none' | 'basic' | 'premium'
  preferredBarber?: string
  totalBookings?: number
  lifetimeValue?: number
  lastBookingDate?: string
  favoriteService?: string
}

// E-commerce events
export interface ProductData {
  item_id: string
  item_name: string
  item_category: string
  item_variant?: string
  price: number
  quantity?: number
  barber_id?: string
  barber_name?: string
}

export interface PurchaseData {
  transaction_id: string
  value: number
  currency: string
  tax?: number
  shipping?: number
  items: ProductData[]
  customer_email?: string
  customer_id?: string
}

// Custom event categories
export const EVENT_CATEGORIES = {
  BOOKING: 'booking',
  PAYMENT: 'payment',
  USER_ENGAGEMENT: 'user_engagement',
  SERVICE_INTERACTION: 'service_interaction',
  BARBER_INTERACTION: 'barber_interaction',
  NAVIGATION: 'navigation',
  ERROR: 'error',
  CONVERSION: 'conversion'
} as const

// Custom event actions
export const EVENT_ACTIONS = {
  // Booking events
  BOOKING_STARTED: 'booking_started',
  SERVICE_SELECTED: 'service_selected',
  BARBER_SELECTED: 'barber_selected',
  DATE_SELECTED: 'date_selected',
  TIME_SELECTED: 'time_selected',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',

  // Payment events
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REFUNDED: 'payment_refunded',

  // User engagement
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_SPENT: 'time_spent',

  // Service interactions
  SERVICE_VIEWED: 'service_viewed',
  SERVICE_FILTERED: 'service_filtered',
  PRICE_COMPARISON: 'price_comparison',

  // Barber interactions
  BARBER_PROFILE_VIEWED: 'barber_profile_viewed',
  BARBER_RATING_CLICKED: 'barber_rating_clicked',
  BARBER_CONTACTED: 'barber_contacted',

  // Navigation
  MENU_CLICKED: 'menu_clicked',
  FOOTER_LINK_CLICKED: 'footer_link_clicked',
  BREADCRUMB_CLICKED: 'breadcrumb_clicked',

  // Errors
  FORM_ERROR: 'form_error',
  API_ERROR: 'api_error',
  PAYMENT_ERROR: 'payment_error',

  // Conversions
  LEAD_GENERATED: 'lead_generated',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  SOCIAL_SHARE: 'social_share',
  PHONE_CALL_INITIATED: 'phone_call_initiated'
} as const

class AnalyticsService {
  private static instance: AnalyticsService
  private initialized = false
  private config: AnalyticsConfig | null = null

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  // Initialize Google Analytics
  initialize(config: AnalyticsConfig): void {
    if (this.initialized) {
      console.warn('Analytics already initialized')
      return
    }

    this.config = config

    try {
      ReactGA.initialize(config.trackingId, {
        gaOptions: {
          debug_mode: config.debug,
          testMode: config.testMode,
        },
        gtagOptions: {
          debug_mode: config.debug,
          test_mode: config.testMode,
        }
      })

      this.initialized = true
      console.log('Google Analytics initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error)
    }
  }

  // Track page views
  trackPageView(path: string, title?: string): void {
    if (!this.initialized) return

    try {
      ReactGA.send({
        hitType: 'pageview',
        page: path,
        title: title || document.title
      })

      // Also track as custom event for more detailed analytics
      this.trackEvent({
        action: EVENT_ACTIONS.PAGE_VIEW,
        category: EVENT_CATEGORIES.NAVIGATION,
        label: path,
        customParameters: {
          page_title: title || document.title,
          page_path: path,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) return

    try {
      ReactGA.event(event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.customParameters
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  // Track user properties
  setUserProperties(properties: UserProperties): void {
    if (!this.initialized) return

    try {
      Object.entries(properties).forEach(([key, value]) => {
        ReactGA.gtag('set', 'user_properties', {
          [key]: value
        })
      })
    } catch (error) {
      console.error('Failed to set user properties:', error)
    }
  }

  // Track e-commerce events
  trackPurchase(purchaseData: PurchaseData): void {
    if (!this.initialized) return

    try {
      ReactGA.gtag('event', 'purchase', {
        transaction_id: purchaseData.transaction_id,
        value: purchaseData.value,
        currency: purchaseData.currency,
        tax: purchaseData.tax,
        shipping: purchaseData.shipping,
        items: purchaseData.items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          item_variant: item.item_variant,
          price: item.price,
          quantity: item.quantity || 1,
          barber_id: item.barber_id,
          barber_name: item.barber_name
        })),
        custom_parameters: {
          customer_email: purchaseData.customer_email,
          customer_id: purchaseData.customer_id,
          purchase_timestamp: new Date().toISOString()
        }
      })

      // Also track as custom event
      this.trackEvent({
        action: EVENT_ACTIONS.PAYMENT_COMPLETED,
        category: EVENT_CATEGORIES.PAYMENT,
        label: purchaseData.transaction_id,
        value: Math.round(purchaseData.value * 100), // Convert to cents for GA
        customParameters: {
          currency: purchaseData.currency,
          item_count: purchaseData.items.length,
          customer_id: purchaseData.customer_id
        }
      })
    } catch (error) {
      console.error('Failed to track purchase:', error)
    }
  }

  // Track booking funnel steps
  trackBookingStep(step: string, stepNumber: number, serviceId?: string, barberId?: string): void {
    this.trackEvent({
      action: `booking_step_${stepNumber}`,
      category: EVENT_CATEGORIES.BOOKING,
      label: step,
      customParameters: {
        step_number: stepNumber,
        service_id: serviceId,
        barber_id: barberId,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Track service interactions
  trackServiceInteraction(serviceId: string, action: string, additionalData?: Record<string, any>): void {
    this.trackEvent({
      action: action,
      category: EVENT_CATEGORIES.SERVICE_INTERACTION,
      label: serviceId,
      customParameters: {
        service_id: serviceId,
        ...additionalData,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Track barber interactions
  trackBarberInteraction(barberId: string, action: string, additionalData?: Record<string, any>): void {
    this.trackEvent({
      action: action,
      category: EVENT_CATEGORIES.BARBER_INTERACTION,
      label: barberId,
      customParameters: {
        barber_id: barberId,
        ...additionalData,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Track form interactions
  trackFormInteraction(formName: string, action: string, fieldName?: string, errorMessage?: string): void {
    this.trackEvent({
      action: action,
      category: EVENT_CATEGORIES.USER_ENGAGEMENT,
      label: formName,
      customParameters: {
        form_name: formName,
        field_name: fieldName,
        error_message: errorMessage,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Track errors
  trackError(errorType: string, errorMessage: string, errorContext?: Record<string, any>): void {
    this.trackEvent({
      action: EVENT_ACTIONS.API_ERROR,
      category: EVENT_CATEGORIES.ERROR,
      label: errorType,
      customParameters: {
        error_message: errorMessage,
        error_context: JSON.stringify(errorContext),
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      }
    })
  }

  // Track scroll depth
  trackScrollDepth(percentage: number): void {
    this.trackEvent({
      action: EVENT_ACTIONS.SCROLL_DEPTH,
      category: EVENT_CATEGORIES.USER_ENGAGEMENT,
      label: `${percentage}%`,
      value: percentage,
      customParameters: {
        scroll_percentage: percentage,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Track time spent on page
  trackTimeSpent(duration: number, pagePath: string): void {
    this.trackEvent({
      action: EVENT_ACTIONS.TIME_SPENT,
      category: EVENT_CATEGORIES.USER_ENGAGEMENT,
      label: pagePath,
      value: Math.round(duration),
      customParameters: {
        duration_seconds: duration,
        page_path: pagePath,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Track conversions
  trackConversion(conversionType: string, value?: number, additionalData?: Record<string, any>): void {
    this.trackEvent({
      action: conversionType,
      category: EVENT_CATEGORIES.CONVERSION,
      value: value,
      customParameters: {
        conversion_type: conversionType,
        ...additionalData,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Track social interactions
  trackSocialInteraction(platform: string, action: string, target?: string): void {
    this.trackEvent({
      action: 'social_interaction',
      category: EVENT_CATEGORIES.USER_ENGAGEMENT,
      label: `${platform}_${action}`,
      customParameters: {
        social_platform: platform,
        social_action: action,
        social_target: target,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Track search interactions
  trackSearch(query: string, resultsCount?: number, filters?: Record<string, any>): void {
    this.trackEvent({
      action: 'search_performed',
      category: EVENT_CATEGORIES.USER_ENGAGEMENT,
      label: query,
      customParameters: {
        search_query: query,
        search_results_count: resultsCount,
        search_filters: JSON.stringify(filters),
        timestamp: new Date().toISOString()
      }
    })
  }

  // Utility methods
  isInitialized(): boolean {
    return this.initialized
  }

  getConfig(): AnalyticsConfig | null {
    return this.config
  }

  // Reset for testing
  reset(): void {
    this.initialized = false
    this.config = null
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance()

// React hooks for analytics
export function useAnalytics() {
  const trackEvent = React.useCallback((event: AnalyticsEvent) => {
    analyticsService.trackEvent(event)
  }, [])

  const trackPageView = React.useCallback((path: string, title?: string) => {
    analyticsService.trackPageView(path, title)
  }, [])

  const trackPurchase = React.useCallback((purchaseData: PurchaseData) => {
    analyticsService.trackPurchase(purchaseData)
  }, [])

  return {
    trackEvent,
    trackPageView,
    trackPurchase,
    isInitialized: analyticsService.isInitialized(),
  }
}

// Utility functions for common tracking scenarios
export const trackBookingFunnel = {
  start: (source?: string) => analyticsService.trackEvent({
    action: EVENT_ACTIONS.BOOKING_STARTED,
    category: EVENT_CATEGORIES.BOOKING,
    label: source || 'unknown',
    customParameters: { source, timestamp: new Date().toISOString() }
  }),

  serviceSelected: (serviceId: string, serviceName: string) => analyticsService.trackEvent({
    action: EVENT_ACTIONS.SERVICE_SELECTED,
    category: EVENT_CATEGORIES.BOOKING,
    label: serviceId,
    customParameters: { service_name: serviceName, timestamp: new Date().toISOString() }
  }),

  barberSelected: (barberId: string, barberName: string) => analyticsService.trackEvent({
    action: EVENT_ACTIONS.BARBER_SELECTED,
    category: EVENT_CATEGORIES.BOOKING,
    label: barberId,
    customParameters: { barber_name: barberName, timestamp: new Date().toISOString() }
  }),

  dateTimeSelected: (date: string, time: string) => analyticsService.trackEvent({
    action: EVENT_ACTIONS.DATE_SELECTED,
    category: EVENT_CATEGORIES.BOOKING,
    label: `${date} ${time}`,
    customParameters: { selected_date: date, selected_time: time, timestamp: new Date().toISOString() }
  }),

  completed: (bookingId: string, totalValue: number) => analyticsService.trackEvent({
    action: EVENT_ACTIONS.BOOKING_COMPLETED,
    category: EVENT_CATEGORIES.BOOKING,
    label: bookingId,
    value: Math.round(totalValue * 100),
    customParameters: { booking_id: bookingId, total_value: totalValue, timestamp: new Date().toISOString() }
  })
}

export const trackPaymentFunnel = {
  initiated: (amount: number, currency: string) => analyticsService.trackEvent({
    action: EVENT_ACTIONS.PAYMENT_INITIATED,
    category: EVENT_CATEGORIES.PAYMENT,
    value: Math.round(amount * 100),
    customParameters: { currency, timestamp: new Date().toISOString() }
  }),

  completed: (transactionId: string, amount: number, currency: string) => analyticsService.trackEvent({
    action: EVENT_ACTIONS.PAYMENT_COMPLETED,
    category: EVENT_CATEGORIES.PAYMENT,
    label: transactionId,
    value: Math.round(amount * 100),
    customParameters: { currency, transaction_id: transactionId, timestamp: new Date().toISOString() }
  }),

  failed: (errorMessage: string, amount?: number) => analyticsService.trackEvent({
    action: EVENT_ACTIONS.PAYMENT_FAILED,
    category: EVENT_CATEGORIES.PAYMENT,
    label: errorMessage,
    value: amount ? Math.round(amount * 100) : undefined,
    customParameters: { error_message: errorMessage, timestamp: new Date().toISOString() }
  })
}
