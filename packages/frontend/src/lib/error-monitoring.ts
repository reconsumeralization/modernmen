import { logger } from './logger'

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error categories for better organization
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  DATABASE = 'database',
  EXTERNAL_SERVICE = 'external_service',
  BUSINESS_LOGIC = 'business_logic',
  UI_RENDERING = 'ui_rendering',
  ARRAY_BOUNDS = 'array_bounds',
  PERFORMANCE = 'performance',
  CONFIGURATION = 'configuration',
  UNKNOWN = 'unknown'
}

// Error context interface
export interface ErrorContext {
  userId?: string
  sessionId?: string
  requestId?: string
  url?: string
  userAgent?: string
  ip?: string
  timestamp: string
  environment: string
  version?: string
  component?: string
  action?: string
  metadata?: Record<string, any>
}

// Comprehensive error interface
export interface MonitoredError {
  id: string
  message: string
  stack?: string
  severity: ErrorSeverity
  category: ErrorCategory
  context: ErrorContext
  fingerprint: string
  occurrences: number
  firstSeen: string
  lastSeen: string
  resolved: boolean
  resolution?: string
  tags: string[]
  breadcrumbs: ErrorBreadcrumb[]
}

// Error breadcrumb for tracking user actions leading to error
export interface ErrorBreadcrumb {
  timestamp: string
  message: string
  category: 'user_action' | 'navigation' | 'api_call' | 'state_change' | 'error'
  data?: Record<string, any>
}

// Error pattern detection
export interface ErrorPattern {
  fingerprint: string
  pattern: RegExp
  category: ErrorCategory
  severity: ErrorSeverity
  description: string
  suggestedFix?: string
}

// Predefined error patterns
const ERROR_PATTERNS: ErrorPattern[] = [
  {
    fingerprint: 'array_index_out_of_bounds',
    pattern: /Index \d+ is out of bounds|Cannot read properties of undefined.*index|array.*index.*out of bounds/i,
    category: ErrorCategory.ARRAY_BOUNDS,
    severity: ErrorSeverity.HIGH,
    description: 'Array index out of bounds error',
    suggestedFix: 'Use safe array access utilities or validate indices before access'
  },
  {
    fingerprint: 'null_reference_error',
    pattern: /Cannot read properties of (null|undefined)|null.*reference|undefined.*reference/i,
    category: ErrorCategory.UI_RENDERING,
    severity: ErrorSeverity.MEDIUM,
    description: 'Null or undefined reference error',
    suggestedFix: 'Add null checks or use optional chaining operator'
  },
  {
    fingerprint: 'network_timeout',
    pattern: /timeout|network.*error|connection.*failed|fetch.*failed/i,
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    description: 'Network or timeout error',
    suggestedFix: 'Implement retry logic and error boundaries'
  },
  {
    fingerprint: 'authentication_error',
    pattern: /unauthorized|forbidden|invalid.*token|authentication.*failed/i,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.HIGH,
    description: 'Authentication or authorization error',
    suggestedFix: 'Check authentication flow and token validity'
  },
  {
    fingerprint: 'database_error',
    pattern: /database.*error|query.*failed|connection.*failed|SQL/i,
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.HIGH,
    description: 'Database operation error',
    suggestedFix: 'Check database connection and query syntax'
  },
  {
    fingerprint: 'validation_error',
    pattern: /validation.*failed|invalid.*input|schema.*error/i,
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    description: 'Input validation error',
    suggestedFix: 'Review validation rules and user input'
  }
]

// Error monitoring service
export class ErrorMonitoringService {
  private static instance: ErrorMonitoringService
  private errors: Map<string, MonitoredError> = new Map()
  private breadcrumbs: ErrorBreadcrumb[] = []
  private maxBreadcrumbs: number = 50
  private errorCallbacks: ((error: MonitoredError) => void)[] = []

  private constructor() {}

  static getInstance(): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService()
    }
    return ErrorMonitoringService.instance
  }

  // Capture and process an error
  async captureError(
    error: Error,
    context: Partial<ErrorContext> = {},
    additionalTags: string[] = []
  ): Promise<MonitoredError> {
    const errorContext: ErrorContext = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      ...context
    }

    // Generate fingerprint for error deduplication
    const fingerprint = this.generateFingerprint(error, errorContext)

    // Check if this error has been seen before
    let monitoredError = this.errors.get(fingerprint)

    if (monitoredError) {
      // Update existing error
      monitoredError.occurrences++
      monitoredError.lastSeen = errorContext.timestamp
      monitoredError.context = { ...monitoredError.context, ...errorContext }

      // Add breadcrumbs
      monitoredError.breadcrumbs.push(...this.breadcrumbs.slice(-10))
      monitoredError.breadcrumbs = monitoredError.breadcrumbs.slice(-100) // Keep last 100
    } else {
      // Create new monitored error
      const category = this.detectCategory(error)
      const severity = this.detectSeverity(error, category)

      monitoredError = {
        id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        message: error.message,
        stack: error.stack,
        severity,
        category,
        context: errorContext,
        fingerprint,
        occurrences: 1,
        firstSeen: errorContext.timestamp,
        lastSeen: errorContext.timestamp,
        resolved: false,
        tags: this.generateTags(error, category, additionalTags),
        breadcrumbs: [...this.breadcrumbs]
      }

      this.errors.set(fingerprint, monitoredError)
    }

    // Log the error
    this.logError(monitoredError)

    // Notify subscribers
    this.notifyErrorCallbacks(monitoredError)

    // Check for critical errors that need immediate attention
    if (monitoredError.severity === ErrorSeverity.CRITICAL) {
      await this.handleCriticalError(monitoredError)
    }

    return monitoredError
  }

  // Add breadcrumb for tracking user actions
  addBreadcrumb(
    message: string,
    category: ErrorBreadcrumb['category'] = 'user_action',
    data?: Record<string, any>
  ): void {
    const breadcrumb: ErrorBreadcrumb = {
      timestamp: new Date().toISOString(),
      message,
      category,
      data
    }

    this.breadcrumbs.push(breadcrumb)

    // Keep only the most recent breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs)
    }
  }

  // Clear breadcrumbs
  clearBreadcrumbs(): void {
    this.breadcrumbs = []
  }

  // Subscribe to error notifications
  onError(callback: (error: MonitoredError) => void): () => void {
    this.errorCallbacks.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.errorCallbacks.indexOf(callback)
      if (index > -1) {
        this.errorCallbacks.splice(index, 1)
      }
    }
  }

  // Get all monitored errors
  getErrors(): MonitoredError[] {
    return Array.from(this.errors.values())
  }

  // Get error by ID
  getError(id: string): MonitoredError | null {
    for (const error of this.errors.values()) {
      if (error.id === id) {
        return error
      }
    }
    return null
  }

  // Mark error as resolved
  resolveError(id: string, resolution?: string): boolean {
    const error = this.getError(id)
    if (error) {
      error.resolved = true
      error.resolution = resolution
      logger.info(`Error resolved: ${id}`, { resolution })
      return true
    }
    return false
  }

  // Get error statistics
  getErrorStats(): {
    total: number
    bySeverity: Record<ErrorSeverity, number>
    byCategory: Record<ErrorCategory, number>
    unresolved: number
    critical: number
  } {
    const errors = this.getErrors()
    const stats = {
      total: errors.length,
      bySeverity: {
        [ErrorSeverity.LOW]: 0,
        [ErrorSeverity.MEDIUM]: 0,
        [ErrorSeverity.HIGH]: 0,
        [ErrorSeverity.CRITICAL]: 0
      },
      byCategory: {
        [ErrorCategory.NETWORK]: 0,
        [ErrorCategory.AUTHENTICATION]: 0,
        [ErrorCategory.AUTHORIZATION]: 0,
        [ErrorCategory.VALIDATION]: 0,
        [ErrorCategory.DATABASE]: 0,
        [ErrorCategory.EXTERNAL_SERVICE]: 0,
        [ErrorCategory.BUSINESS_LOGIC]: 0,
        [ErrorCategory.UI_RENDERING]: 0,
        [ErrorCategory.ARRAY_BOUNDS]: 0,
        [ErrorCategory.PERFORMANCE]: 0,
        [ErrorCategory.CONFIGURATION]: 0,
        [ErrorCategory.UNKNOWN]: 0
      },
      unresolved: 0,
      critical: 0
    }

    errors.forEach(error => {
      stats.bySeverity[error.severity]++
      stats.byCategory[error.category]++

      if (!error.resolved) {
        stats.unresolved++
      }

      if (error.severity === ErrorSeverity.CRITICAL) {
        stats.critical++
      }
    })

    return stats
  }

  // Export errors for analysis
  exportErrors(): string {
    const errors = this.getErrors()
    return JSON.stringify(errors, null, 2)
  }

  // Import errors (for persistence)
  importErrors(jsonData: string): void {
    try {
      const errors: MonitoredError[] = JSON.parse(jsonData)
      errors.forEach(error => {
        this.errors.set(error.fingerprint, error)
      })
    } catch (error) {
      logger.error('Failed to import error data', {}, error instanceof Error ? error : new Error(String(error)))
    }
  }

  private generateFingerprint(error: Error, context: ErrorContext): string {
    // Create a unique fingerprint based on error message, stack, and context
    const components = [
      error.message.substring(0, 100), // First 100 chars of message
      error.stack?.split('\n')[1]?.trim() || '', // First line of stack
      context.component || '',
      context.action || '',
      context.url || ''
    ]

    return btoa(components.join('|')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
  }

  private detectCategory(error: Error): ErrorCategory {
    const message = error.message.toLowerCase()
    const stack = error.stack?.toLowerCase() || ''

    // Check predefined patterns
    for (const pattern of ERROR_PATTERNS) {
      if (pattern.pattern.test(message) || pattern.pattern.test(stack)) {
        return pattern.category
      }
    }

    // Fallback detection
    if (message.includes('network') || message.includes('fetch') || message.includes('http')) {
      return ErrorCategory.NETWORK
    }

    if (message.includes('auth') || message.includes('login') || message.includes('token')) {
      return ErrorCategory.AUTHENTICATION
    }

    if (message.includes('data') || message.includes('database') || message.includes('query')) {
      return ErrorCategory.DATABASE
    }

    if (message.includes('component') || message.includes('render') || message.includes('ui')) {
      return ErrorCategory.UI_RENDERING
    }

    return ErrorCategory.UNKNOWN
  }

  private detectSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
    const message = error.message.toLowerCase()

    // Check predefined patterns for severity
    for (const pattern of ERROR_PATTERNS) {
      if (pattern.pattern.test(message) && category === pattern.category) {
        return pattern.severity
      }
    }

    // Category-based severity
    switch (category) {
      case ErrorCategory.ARRAY_BOUNDS:
      case ErrorCategory.AUTHENTICATION:
      case ErrorCategory.DATABASE:
        return ErrorSeverity.HIGH
      case ErrorCategory.NETWORK:
      case ErrorCategory.UI_RENDERING:
        return ErrorSeverity.MEDIUM
      case ErrorCategory.VALIDATION:
        return ErrorSeverity.LOW
      default:
        return ErrorSeverity.MEDIUM
    }
  }

  private generateTags(error: Error, category: ErrorCategory, additionalTags: string[]): string[] {
    const tags = [category]

    if (additionalTags.length > 0) {
      tags.push(...additionalTags)
    }

    // Add severity tag
    const severity = this.detectSeverity(error, category)
    tags.push(`severity:${severity}`)

    // Add environment tag
    tags.push(`env:${process.env.NODE_ENV || 'development'}`)

    return [...new Set(tags)] // Remove duplicates
  }

  private logError(error: MonitoredError): void {
    const logData = {
      errorId: error.id,
      fingerprint: error.fingerprint,
      severity: error.severity,
      category: error.category,
      occurrences: error.occurrences,
      context: error.context,
      tags: error.tags
    }

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        logger.error(`🚨 CRITICAL ERROR: ${error.message}`, logData, new Error(error.stack))
        break
      case ErrorSeverity.HIGH:
        logger.error(`🔴 HIGH ERROR: ${error.message}`, logData)
        break
      case ErrorSeverity.MEDIUM:
        logger.warn(`🟡 MEDIUM ERROR: ${error.message}`, logData)
        break
      case ErrorSeverity.LOW:
        logger.info(`🟢 LOW ERROR: ${error.message}`, logData)
        break
    }
  }

  private notifyErrorCallbacks(error: MonitoredError): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error)
      } catch (callbackError) {
        logger.error('Error in error callback', {}, callbackError instanceof Error ? callbackError : new Error(String(callbackError)))
      }
    })
  }

  private async handleCriticalError(error: MonitoredError): Promise<void> {
    // Implement critical error handling (e.g., send alerts, notifications)
    logger.error('🚨 CRITICAL ERROR HANDLING TRIGGERED', {
      errorId: error.id,
      message: error.message,
      category: error.category,
      context: error.context
    })

    // In a real application, you might:
    // - Send alerts to development team
    // - Trigger incident response
    // - Log to external monitoring service
    // - Send notifications to stakeholders

    // For now, we'll just log extensively
    console.error('🚨 CRITICAL ERROR DETECTED 🚨')
    console.error('Error ID:', error.id)
    console.error('Message:', error.message)
    console.error('Category:', error.category)
    console.error('Severity:', error.severity)
    console.error('Occurrences:', error.occurrences)
    console.error('First seen:', error.firstSeen)
    console.error('Last seen:', error.lastSeen)
    console.error('Context:', error.context)
    console.error('Stack:', error.stack)
    console.error('Breadcrumbs:', error.breadcrumbs.slice(-5)) // Last 5 breadcrumbs
  }
}

// Global error monitoring instance
export const errorMonitor = ErrorMonitoringService.getInstance()

// React hook for error monitoring
export function useErrorMonitoring() {
  const addBreadcrumb = (message: string, category?: ErrorBreadcrumb['category'], data?: Record<string, any>) => {
    errorMonitor.addBreadcrumb(message, category, data)
  }

  const captureError = (error: Error, context?: Partial<ErrorContext>, tags?: string[]) => {
    return errorMonitor.captureError(error, context, tags)
  }

  const onError = (callback: (error: MonitoredError) => void) => {
    return errorMonitor.onError(callback)
  }

  return {
    addBreadcrumb,
    captureError,
    onError,
    getErrors: () => errorMonitor.getErrors(),
    getErrorStats: () => errorMonitor.getErrorStats(),
    resolveError: (id: string, resolution?: string) => errorMonitor.resolveError(id, resolution)
  }
}

// Global error handler for unhandled errors
export function setupGlobalErrorHandling(): void {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    const error = reason instanceof Error ? reason : new Error(String(reason))
    errorMonitor.captureError(error, {
      component: 'global',
      action: 'unhandled_promise_rejection'
    }, ['unhandled', 'promise'])
  })

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    errorMonitor.captureError(error, {
      component: 'global',
      action: 'uncaught_exception'
    }, ['uncaught', 'exception'])
  })

  // Browser-specific error handling
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      errorMonitor.captureError(event.error || new Error(event.message), {
        component: 'browser',
        url: event.filename,
        metadata: {
          lineno: event.lineno,
          colno: event.colno
        }
      }, ['browser', 'global'])
    })

    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      errorMonitor.captureError(error, {
        component: 'browser',
        action: 'unhandled_promise_rejection'
      }, ['browser', 'promise'])
    })
  }
}

// Utility functions for common error scenarios
export const ErrorUtils = {
  // Wrap async functions with error monitoring
  async withMonitoring<T>(
    fn: () => Promise<T>,
    context: Partial<ErrorContext> = {},
    tags: string[] = []
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      await errorMonitor.captureError(
        error instanceof Error ? error : new Error(String(error)),
        context,
        tags
      )
      throw error
    }
  },

  // Create monitored error
  createMonitoredError(
    message: string,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: Partial<ErrorContext> = {}
  ): Error {
    const error = new Error(message)
    errorMonitor.captureError(error, context, [category, `severity:${severity}`])
    return error
  },

  // Safe async operation with timeout
  async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    context: Partial<ErrorContext> = {}
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(ErrorUtils.createMonitoredError(
          `Operation timed out after ${timeoutMs}ms`,
          ErrorCategory.PERFORMANCE,
          ErrorSeverity.MEDIUM,
          { ...context, action: 'timeout' }
        ))
      }, timeoutMs)
    })

    return Promise.race([promise, timeoutPromise])
  }
}

export default {
  ErrorMonitoringService,
  errorMonitor,
  useErrorMonitoring,
  setupGlobalErrorHandling,
  ErrorUtils,
  ErrorSeverity,
  ErrorCategory
}
