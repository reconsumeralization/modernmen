import { z } from 'zod'
import { logger } from './logger'

// Error types
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR'
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    type: ErrorType,
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message)
    this.type = type
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorType.VALIDATION_ERROR, message, 400)
    this.details = details
  }
  details?: any
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(ErrorType.AUTHENTICATION_ERROR, message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(ErrorType.AUTHORIZATION_ERROR, message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(ErrorType.NOT_FOUND_ERROR, `${resource} not found`, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(ErrorType.CONFLICT_ERROR, message, 409)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(ErrorType.DATABASE_ERROR, message, 500)
  }
}

// Error handler function
export const handleError = (error: unknown): AppError => {
  // Log the error
  logger.error('Error occurred:', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })

  // Handle known error types
  if (error instanceof AppError) {
    return error
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return new ValidationError('Validation failed', error.errors)
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any

    switch (prismaError.code) {
      case 'P2002':
        return new ConflictError('A record with this information already exists')
      case 'P2025':
        return new NotFoundError('Record')
      default:
        return new DatabaseError('Database operation failed')
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('unauthorized')) {
      return new AuthenticationError()
    }

    if (error.message.includes('forbidden')) {
      return new AuthorizationError()
    }

    if (error.message.includes('not found')) {
      return new NotFoundError('Resource')
    }

    return new AppError(ErrorType.INTERNAL_ERROR, error.message)
  }

  // Handle unknown errors
  return new AppError(
    ErrorType.INTERNAL_ERROR,
    'An unexpected error occurred',
    500,
    false
  )
}

// Async error wrapper
export const asyncErrorHandler = (
  fn: (...args: any[]) => Promise<any>
) => {
  return (...args: any[]) => {
    const fnReturn = fn(...args)
    return fnReturn.catch(handleError)
  }
}

// Error response formatter
export const formatErrorResponse = (error: AppError) => {
  const baseResponse = {
    success: false,
    error: {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode
    }
  }

  // Add additional details for validation errors
  if (error instanceof ValidationError && error.details) {
    baseResponse.error.details = error.details
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    baseResponse.error.stack = error.stack
  }

  return baseResponse
}

// Retry utility with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)
        logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// Circuit breaker pattern
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'

  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeout: number = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = 'CLOSED'
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN'
    }
  }
}

// Error monitoring/reporting
export const reportError = (error: AppError, context?: any) => {
  // Log to console/service
  logger.error('Error reported:', {
    type: error.type,
    message: error.message,
    statusCode: error.statusCode,
    context
  })

  // Here you could send to error monitoring service like Sentry
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureException(error, { contexts: { custom: context } })
  // }
}

// Global error handler for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // You might want to exit the process here
  // process.exit(1)
})

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  // You might want to exit the process here
  // process.exit(1)
})
