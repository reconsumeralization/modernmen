// =============================================================================
// ERROR HANDLING UTILITIES - Consistent error handling patterns
// =============================================================================

// -----------------------------------------------------------------------------
// CUSTOM ERROR CLASSES - Domain-specific error types
// -----------------------------------------------------------------------------

export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly details?: Record<string, any>

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.isOperational = true
    this.details = details

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`
    super(message, 'NOT_FOUND', 404, { resource, identifier })
    this.name = 'NotFoundError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

// -----------------------------------------------------------------------------
// ERROR HANDLING UTILITIES - Helper functions for error management
// -----------------------------------------------------------------------------

export interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: Record<string, any>
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred'
): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: 'UNKNOWN_ERROR'
    }
  }

  return {
    success: false,
    error: defaultMessage,
    code: 'UNKNOWN_ERROR'
  }
}

/**
 * Safely executes an async function and handles errors
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<{ success: true; data: T } | ErrorResponse> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    return createErrorResponse(error, errorMessage)
  }
}

/**
 * Safely executes a synchronous function and handles errors
 */
export function safeSync<T>(
  fn: () => T,
  errorMessage?: string
): { success: true; data: T } | ErrorResponse {
  try {
    const data = fn()
    return { success: true, data }
  } catch (error) {
    return createErrorResponse(error, errorMessage)
  }
}

/**
 * Logs an error with additional context
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error,
    context
  }

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error occurred:', errorInfo)
  }

  // In production, you might want to send to an error reporting service
  // Example: Sentry, LogRocket, etc.
}

/**
 * Handles API errors consistently
 */
export function handleApiError(error: unknown, operation: string): ErrorResponse {
  logError(error, { operation })

  if (error instanceof ValidationError) {
    return createErrorResponse(error)
  }

  if (error instanceof NotFoundError) {
    return createErrorResponse(error)
  }

  if (error instanceof AuthenticationError) {
    return createErrorResponse(error)
  }

  if (error instanceof AuthorizationError) {
    return createErrorResponse(error)
  }

  if (error instanceof NetworkError) {
    return createErrorResponse(error)
  }

  return createErrorResponse(error, `Failed to ${operation}`)
}

// -----------------------------------------------------------------------------
// ERROR BOUNDARY HOOK - React hook for error handling in components
// -----------------------------------------------------------------------------

import { useState, useCallback } from 'react'

export interface UseErrorHandlerReturn {
  error: ErrorResponse | null
  isError: boolean
  setError: (error: unknown) => void
  clearError: () => void
  handleAsync: <T>(fn: () => Promise<T>) => Promise<T | null>
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<ErrorResponse | null>(null)

  const setError = useCallback((error: unknown) => {
    const errorResponse = createErrorResponse(error)
    setErrorState(errorResponse)
    logError(error)
  }, [])

  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  const handleAsync = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      clearError()
      return await fn()
    } catch (error) {
      setError(error)
      return null
    }
  }, [setError, clearError])

  return {
    error,
    isError: error !== null,
    setError,
    clearError,
    handleAsync
  }
}

// -----------------------------------------------------------------------------
// TYPE EXPORTS - Error-related types
// -----------------------------------------------------------------------------
// ErrorResponse is already exported as interface above
