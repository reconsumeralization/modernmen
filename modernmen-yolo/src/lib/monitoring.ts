import { logger } from './logger'

// Types for monitoring configuration
export interface MonitoringConfig {
  sentry?: {
    dsn: string
    environment: string
    release?: string
    sampleRate?: number
    tracesSampleRate?: number
    replaysOnErrorSampleRate?: number
    replaysSessionSampleRate?: number
  }
  logRocket?: {
    appId: string
    environment: string
  }
  analytics?: {
    enabled: boolean
    trackPerformance?: boolean
    trackErrors?: boolean
  }
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  tags?: Record<string, string>
  timestamp?: number
}

export interface ErrorEvent {
  message: string
  stack?: string
  context?: Record<string, any>
  user?: {
    id?: string
    email?: string
    role?: string
  }
  tags?: Record<string, string>
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
}

export interface UserAction {
  type: 'click' | 'navigation' | 'form_submission' | 'rch' | 'api_call'
  target?: string
  data?: Record<string, any>
  timestamp?: number
  duration?: number
}

// Singleton monitoring service
class MonitoringService {
  private static instance: MonitoringService
  private config: MonitoringConfig = {}
  private initialized = false

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  initialize(config: MonitoringConfig) {
    if (this.initialized) {
      logger.warn('Monitoring service already initialized')
      return
    }

    this.config = config

    try {
      // Initialize Sentry if configured
      if (config.sentry && typeof window !== 'undefined') {
        this.initializeSentry(config.sentry)
      }

      // Initialize LogRocket if configured
      if (config.logRocket && typeof window !== 'undefined') {
        this.initializeLogRocket(config.logRocket)
      }

      // Initialize analytics if configured
      if (config.analytics?.enabled) {
        this.initializeAnalytics(config.analytics)
      }

      this.initialized = true
      logger.info('Monitoring service initialized successfully', {
        services: {
          sentry: !!config.sentry,
          logRocket: !!config.logRocket,
          analytics: !!config.analytics?.enabled
        }
      })
    } catch (error) {
      logger.error('Failed to initialize monitoring service', {
        error: error instanceof Error ? error.message : 'Unknown error'
      }, error instanceof Error ? error : undefined)
    }
  }

  private initializeSentry(sentryConfig: NonNullable<MonitoringConfig['sentry']>) {
    try {
      // Dynamic import to avoid bundling issues
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.init({
          dsn: sentryConfig.dsn,
          environment: sentryConfig.environment,
          release: sentryConfig.release || process.env.VERCEL_GIT_COMMIT_SHA,
          sampleRate: sentryConfig.sampleRate || 1.0,
          tracesSampleRate: sentryConfig.tracesSampleRate || 0.1,
          replaysOnErrorSampleRate: sentryConfig.replaysOnErrorSampleRate || 1.0,
          replaysSessionSampleRate: sentryConfig.replaysSessionSampleRate || 0.1,
          integrations: [
            // Sentry.replayIntegration is not available in this version
            // Use browserTracingIntegration instead if available
          ],
          beforeSend: (event: any) => {
            // Filter out development errors
            if (process.env.NODE_ENV === 'development' && !sentryConfig.environment?.includes('dev')) {
              return null
            }
            return event
          },
        })

        logger.info('Sentry initialized successfully', {
          environment: sentryConfig.environment
        })
      }).catch((error) => {
        logger.warn('Sentry not available - install @sentry/nextjs to enable Sentry monitoring', {
          error: error instanceof Error ? error.message : 'Import failed'
        })
      })
    } catch (error) {
      logger.warn('Sentry initialization failed - dependency not installed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private initializeLogRocket(logRocketConfig: NonNullable<MonitoringConfig['logRocket']>) {
    try {
      // Dynamic import to avoid bundling issues
      import('logrocket').then((LogRocket) => {
        LogRocket.init(logRocketConfig.appId, {
          release: process.env.VERCEL_GIT_COMMIT_SHA,
        })

        logger.info('LogRocket initialized successfully', {
          environment: logRocketConfig.environment
        })
      }).catch((error) => {
        logger.warn('LogRocket not available - install logrocket to enable session recording', {
          error: error instanceof Error ? error.message : 'Import failed'
        })
      })
    } catch (error) {
      logger.warn('LogRocket initialization failed - dependency not installed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private initializeAnalytics(analyticsConfig: NonNullable<MonitoringConfig['analytics']>) {
    if (analyticsConfig.trackPerformance) {
      this.setupPerformanceMonitoring()
    }

    if (analyticsConfig.trackErrors) {
      this.setupErrorMonitoring()
    }

    logger.info('Analytics monitoring initialized', {
      trackPerformance: analyticsConfig.trackPerformance,
      trackErrors: analyticsConfig.trackErrors
    })
  }

  private setupPerformanceMonitoring() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor Core Web Vitals
      this.monitorWebVitals()

      // Monitor custom metrics
      this.monitorCustomMetrics()
    }
  }

  private setupErrorMonitoring() {
    if (typeof window !== 'undefined') {
      // Catch unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError({
          message: 'Unhandled Promise Rejection',
          stack: event.reason?.stack,
          context: {
            reason: event.reason?.message || event.reason
          },
          level: 'error'
        })
      })

      // Catch global errors
      window.addEventListener('error', (event) => {
        // Skip benign ResizeObserver errors
        if (event.message?.includes('ResizeObserver')) {
          return
        }

        this.captureError({
          message: event.message,
          stack: event.error?.stack,
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          },
          level: 'error'
        })
      })
    }
  }

  private monitorWebVitals() {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          size?: number
        }

        this.trackMetric({
          name: 'lcp',
          value: lastEntry.startTime,
          unit: 'ms',
          tags: {
            size: lastEntry.size?.toString() || 'unknown'
          }
        })
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          processingStart?: number
        }

        if (lastEntry.processingStart) {
          this.trackMetric({
            name: 'fid',
            value: lastEntry.processingStart - lastEntry.startTime,
            unit: 'ms'
          })
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Monitor Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries() as any[]

      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value || 0
        }
      })

        this.trackMetric({
          name: 'cls',
          value: clsValue,
          unit: 'score'
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }

  private monitorCustomMetrics() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      if (navigation) {
        this.trackMetric({
          name: 'page_load_time',
          value: navigation.loadEventEnd - navigation.fetchStart,
          unit: 'ms'
        })

        this.trackMetric({
          name: 'dom_content_loaded',
          value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          unit: 'ms'
        })

        // Use modern performance timing properties
        this.trackMetric({
          name: 'dns_lookup_time',
          value: navigation.domainLookupEnd - navigation.domainLookupStart,
          unit: 'ms'
        })

        this.trackMetric({
          name: 'tcp_connect_time',
          value: navigation.connectEnd - navigation.connectStart,
          unit: 'ms'
        })
      }
    })
  }

  // Public API methods
  trackEvent(eventName: string, properties?: Record<string, any>) {
    try {
      // Send to analytics service
      if (this.config.analytics?.enabled) {
        logger.info('Event tracked', { eventName, properties })
      }

      // Send to LogRocket if available
      if (typeof window !== 'undefined' && (window as any).LogRocket) {
        const LogRocket = (window as any).LogRocket
        LogRocket.track(eventName, properties)
      }

      // Send to Sentry if available
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        const Sentry = (window as any).Sentry
        Sentry.captureMessage(`Event: ${eventName}`, {
          level: 'info',
          extra: properties
        })
      }
    } catch (error) {
      logger.error('Failed to track event', {
        eventName,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  captureError(error: ErrorEvent) {
    try {
      // Filter out benign browser warnings and errors
      const benignErrors = [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
        'Script error',
        'Network request failed'
      ]

      const shouldIgnore = benignErrors.some(benignError => 
        error.message?.toLowerCase().includes(benignError.toLowerCase())
      )

      if (shouldIgnore) {
        // Log as debug instead of error for benign issues
        logger.debug(`Ignoring benign error: ${error.message}`)
        return
      }

      // Log to our custom logger
      logger.error(error.message, {
        stack: error.stack,
        context: error.context,
        user: error.user,
        tags: error.tags,
        level: error.level
      }, new Error(error.message))

      // Send to Sentry if available
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        const Sentry = (window as any).Sentry

        Sentry.captureException(new Error(error.message), {
          tags: error.tags,
          user: error.user,
          level: error.level || 'error',
          contexts: {
            custom: error.context
          }
        })
      }

      // Send to LogRocket if available
      if (typeof window !== 'undefined' && (window as any).LogRocket) {
        const LogRocket = (window as any).LogRocket
        LogRocket.captureException(new Error(error.message), {
          tags: error.tags,
          extra: error.context
        })
      }
    } catch (captureError) {
      logger.error('Failed to capture error in monitoring service', {
        originalError: error.message,
        captureError: captureError instanceof Error ? captureError.message : 'Unknown error'
      })
    }
  }

  trackMetric(metric: PerformanceMetric) {
    try {
      const metricWithTimestamp = {
        ...metric,
        timestamp: metric.timestamp || Date.now()
      }

      // Send to analytics service
      if (this.config.analytics?.enabled) {
        // This would integrate with your analytics service
        logger.info('Performance metric tracked', metricWithTimestamp)
      }

      // Send to Sentry if available
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        const Sentry = (window as any).Sentry
        Sentry.captureMessage(`Performance: ${metric.name}`, {
          level: 'info',
          tags: {
            metric: metric.name,
            unit: metric.unit,
            ...metric.tags
          },
          extra: metricWithTimestamp
        })
      }
    } catch (error) {
      logger.error('Failed to track metric', {
        metric: metric.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  trackUserAction(action: UserAction) {
    try {
      const actionWithTimestamp = {
        ...action,
        timestamp: action.timestamp || Date.now()
      }

      // Send to analytics service
      if (this.config.analytics?.enabled) {
        logger.info('User action tracked', actionWithTimestamp)
      }

      // Send to LogRocket if available
      if (typeof window !== 'undefined' && (window as any).LogRocket) {
        const LogRocket = (window as any).LogRocket
        LogRocket.track(action.type, actionWithTimestamp)
      }
    } catch (error) {
      logger.error('Failed to track user action', {
        action: action.type,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  setUser(user: { id?: string; email?: string | null; role?: string }) {
    try {
      // Normalize user data to handle nullable email
      const normalizedUser = {
        id: user.id,
        email: user.email || undefined,
        role: user.role
      }

      // Set user context in Sentry
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        const Sentry = (window as any).Sentry
        Sentry.setUser(normalizedUser)
      }

      // Set user context in LogRocket
      if (typeof window !== 'undefined' && (window as any).LogRocket) {
        const LogRocket = (window as any).LogRocket
        LogRocket.identify(normalizedUser.id || 'anonymous', {
          email: normalizedUser.email,
          role: normalizedUser.role
        })
      }

      logger.info('User context set in monitoring services', {
        hasId: !!user.id,
        hasEmail: !!user.email,
        hasRole: !!user.role
      })
    } catch (error) {
      logger.error('Failed to set user context', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error') {
    try {
      // Add breadcrumb to Sentry
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        const Sentry = (window as any).Sentry
        Sentry.addBreadcrumb({
          message,
          category: category || 'custom',
          level: level || 'info'
        })
      }

      // Log breadcrumb
      logger.info(`Breadcrumb: ${message}`, {
        category,
        level
      })
    } catch (error) {
      logger.error('Failed to add breadcrumb', {
        message,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance()

// Helper functions for common monitoring tasks
export const monitoringHelpers = {
  // Track page views
  trackPageView: (page: string, properties?: Record<string, any>) => {
    monitoring.trackUserAction({
      type: 'navigation',
      target: page,
      data: properties
    })
  },

  // Track API calls
  trackApiCall: (endpoint: string, method: string, duration: number, success: boolean) => {
    monitoring.trackMetric({
      name: 'api_call',
      value: duration,
      unit: 'ms',
      tags: {
        endpoint,
        method,
        success: success.toString()
      }
    })
  },

  // Track form submissions
  trackFormSubmission: (formName: string, success: boolean, duration?: number) => {
    monitoring.trackUserAction({
      type: 'form_submission',
      target: formName,
      data: { success },
      duration
    })
  },

  // Track rch queries
  trackrch: (query: string, resultsCount?: number) => {
    monitoring.trackUserAction({
      type: 'rch',
      data: {
        query,
        resultsCount
      }
    })
  }
}
