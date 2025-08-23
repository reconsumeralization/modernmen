import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'
import { z } from 'zod'

export interface APIError {
  code: string
  message: string
  details?: any
  statusCode: number
}

export class APIErrorHandler {
  static createError(
    code: string,
    message: string,
    statusCode: number = 500,
    details?: any
  ): APIError {
    return {
      code,
      message,
      details,
      statusCode
    }
  }

  static async handleError(
    error: unknown,
    request: NextRequest,
    context?: string
  ): Promise<NextResponse> {
    // Extract request context for logging
    const requestContext = {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
      timestamp: new Date().toISOString(),
      context
    }

    // Handle different error types
    if (error instanceof z.ZodError) {
      return this.handleValidationError(error, requestContext)
    }

    if (error instanceof APIError) {
      return this.handleAPIError(error, requestContext)
    }

    if (error instanceof Error) {
      return this.handleGenericError(error, requestContext)
    }

    // Handle unknown errors
    return this.handleUnknownError(error, requestContext)
  }

  private static handleValidationError(
    error: z.ZodError,
    context: any
  ): NextResponse {
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }))

    logger.warn('Validation error in API route', {
      ...context,
      errors: validationErrors,
      errorCount: validationErrors.length
    })

    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validationErrors
      },
      { status: 400 }
    )
  }

  private static handleAPIError(
    error: APIError,
    context: any
  ): NextResponse {
    // Log based on severity
    if (error.statusCode >= 500) {
      logger.error('API Error (5xx)', {
        ...context,
        error: error.message,
        code: error.code,
        details: error.details
      })
    } else if (error.statusCode >= 400) {
      logger.warn('API Error (4xx)', {
        ...context,
        error: error.message,
        code: error.code,
        details: error.details
      })
    } else {
      logger.info('API Error (Other)', {
        ...context,
        error: error.message,
        code: error.code,
        details: error.details
      })
    }

    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details
      },
      { status: error.statusCode }
    )
  }

  private static handleGenericError(
    error: Error,
    context: any
  ): NextResponse {
    logger.error('Generic error in API route', {
      ...context,
      error: error.message,
      stack: error.stack
    }, error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }

  private static handleUnknownError(
    error: unknown,
    context: any
  ): NextResponse {
    logger.error('Unknown error in API route', {
      ...context,
      error: String(error),
      errorType: typeof error
    })

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    )
  }
}

// Common API errors
export const APIErrors = {
  UNAUTHORIZED: () => APIErrorHandler.createError(
    'UNAUTHORIZED',
    'Authentication required',
    401
  ),

  FORBIDDEN: (reason?: string) => APIErrorHandler.createError(
    'FORBIDDEN',
    reason || 'Access denied',
    403
  ),

  NOT_FOUND: (resource?: string) => APIErrorHandler.createError(
    'NOT_FOUND',
    `${resource || 'Resource'} not found`,
    404
  ),

  VALIDATION_FAILED: (details?: any) => APIErrorHandler.createError(
    'VALIDATION_FAILED',
    'Invalid input data',
    400,
    details
  ),

  RATE_LIMIT_EXCEEDED: (retryAfter?: number) => APIErrorHandler.createError(
    'RATE_LIMIT_EXCEEDED',
    'Too many requests',
    429,
    { retryAfter }
  ),

  INTERNAL_ERROR: (message?: string) => APIErrorHandler.createError(
    'INTERNAL_ERROR',
    message || 'Internal server error',
    500
  ),

  DATABASE_ERROR: (operation?: string) => APIErrorHandler.createError(
    'DATABASE_ERROR',
    `Database operation failed: ${operation || 'unknown'}`,
    500
  ),

  EXTERNAL_SERVICE_ERROR: (service?: string) => APIErrorHandler.createError(
    'EXTERNAL_SERVICE_ERROR',
    `External service error: ${service || 'unknown'}`,
    502
  )
}

// Helper function to wrap API route handlers with error handling
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      const request = args[0] as NextRequest
      return APIErrorHandler.handleError(error, request, handler.name)
    }
  }
}

// Helper function to create success responses
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: any
) {
  return NextResponse.json({
    success: true,
    message,
    data,
    meta
  })
}
