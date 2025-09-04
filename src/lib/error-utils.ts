// Error handling utilities
export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  url?: string
  userAgent?: string
  timestamp?: number
}

export class AppError extends Error {
  public readonly context?: ErrorContext
  public readonly severity: 'low' | 'medium' | 'high' | 'critical'

  constructor(
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: ErrorContext
  ) {
    super(message)
    this.name = 'AppError'
    this.severity = severity
    this.context = context
  }
}

export function handleError(
  error: Error | AppError,
  context?: ErrorContext,
  showToast: boolean = true
) {
  // Create full context
  const fullContext: ErrorContext = {
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    ...context
  }

  // Log error
  console.error('Error handled:', {
    message: error.message,
    stack: error.stack,
    context: fullContext,
    severity: error instanceof AppError ? error.severity : 'medium'
  })

  // Report to monitoring service if available
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      tags: {
        severity: error instanceof AppError ? error.severity : 'medium'
      },
      extra: fullContext
    })
  }

  // Show user-friendly error message
  if (showToast && typeof window !== 'undefined') {
    // This would integrate with your toast system
    console.warn('Error displayed to user:', error.message)
  }

  return error
}

export function createErrorHandler(componentName: string) {
  return {
    handleError: (error: Error, action?: string) =>
      handleError(error, {
        component: componentName,
        action
      }),

    handleAsyncError: async <T>(
      operation: () => Promise<T>,
      action?: string
    ): Promise<T | null> => {
      try {
        return await operation()
      } catch (error) {
        handleError(error as Error, {
          component: componentName,
          action
        })
        return null
      }
    }
  }
}

export function validateInput<T>(
  data: T,
  schema: Record<keyof T, (value: any) => string | null>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {}

  for (const [field, validator] of Object.entries(schema)) {
    const error = validator((data as any)[field])
    if (error) {
      errors[field as keyof T] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Common validation rules
export const validationRules = {
  required: (value: any) => !value ? 'This field is required' : null,
  email: (value: string) =>
    !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : null,
  minLength: (min: number) => (value: string) =>
    !value || value.length < min ? `Must be at least ${min} characters` : null,
  maxLength: (max: number) => (value: string) =>
    value && value.length > max ? `Must be no more than ${max} characters` : null,
  phone: (value: string) =>
    !value || !/^\+?[\d\s\-\(\)]+$/.test(value) ? 'Invalid phone number' : null,
  date: (value: string) =>
    !value || isNaN(Date.parse(value)) ? 'Invalid date' : null,
  futureDate: (value: string) =>
    !value || new Date(value) <= new Date() ? 'Date must be in the future' : null
}

export function retryAsync<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  return operation().catch(error => {
    if (maxRetries > 0) {
      return new Promise(resolve =>
        setTimeout(() => resolve(retryAsync(operation, maxRetries - 1, delay)), delay)
      )
    }
    throw error
  })
}
