import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'
import { z } from 'zod'

// Enhanced error types
export enum ErrorCode {
  // Validation errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  OUT_OF_RANGE = 'OUT_OF_RANGE',

  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  RESOURCE_LOCKED = 'RESOURCE_LOCKED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  // Data errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATA_INTEGRITY_ERROR = 'DATA_INTEGRITY_ERROR',
  CONCURRENT_MODIFICATION = 'CONCURRENT_MODIFICATION',

  // Network/External errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',

  // Business logic errors
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INVALID_STATE_TRANSITION = 'INVALID_STATE_TRANSITION',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',

  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Array/Bounds specific errors
  INDEX_OUT_OF_BOUNDS = 'INDEX_OUT_OF_BOUNDS',
  ARRAY_EMPTY = 'ARRAY_EMPTY',
  INVALID_ARRAY_OPERATION = 'INVALID_ARRAY_OPERATION'
}

export interface APIErrorDetails {
  field?: string
  value?: any
  expected?: any
  received?: any
  path?: string
  suggestion?: string
  context?: Record<string, any>
}

export interface APIError {
  code: ErrorCode
  message: string
  details?: APIErrorDetails
  statusCode: number
  timestamp: string
  requestId: string
  path?: string
  stack?: string
}

// Enhanced error class
export class EnhancedAPIError extends Error implements APIError {
  public code: ErrorCode
  public statusCode: number
  public details?: APIErrorDetails
  public timestamp: string
  public requestId: string
  public path?: string

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: APIErrorDetails,
    path?: string
  ) {
    super(message)
    this.name = 'EnhancedAPIError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
    this.requestId = this.generateRequestId()
    this.path = path
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  toJSON(): APIError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      requestId: this.requestId,
      path: this.path,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    }
  }
}

// Error factory functions
export const APIErrorFactory = {
  // Validation errors
  validationFailed: (details: APIErrorDetails) =>
    new EnhancedAPIError(
      ErrorCode.VALIDATION_FAILED,
      'Validation failed for one or more fields',
      400,
      details
    ),

  missingRequiredField: (field: string, suggestion?: string) =>
    new EnhancedAPIError(
      ErrorCode.MISSING_REQUIRED_FIELD,
      `Required field '${field}' is missing`,
      400,
      { field, suggestion }
    ),

  invalidFormat: (field: string, expected: string, received: any) =>
    new EnhancedAPIError(
      ErrorCode.INVALID_FORMAT,
      `Invalid format for field '${field}'`,
      400,
      { field, expected, received: String(received) }
    ),

  outOfRange: (field: string, value: any, min?: number, max?: number) =>
    new EnhancedAPIError(
      ErrorCode.OUT_OF_RANGE,
      `Value for field '${field}' is out of allowed range`,
      400,
      {
        field,
        value,
        expected: min !== undefined && max !== undefined ? `${min}-${max}` : undefined
      }
    ),

  // Authentication errors
  unauthorized: (message: string = 'Authentication required') =>
    new EnhancedAPIError(
      ErrorCode.UNAUTHORIZED,
      message,
      401
    ),

  forbidden: (message: string = 'Access denied', resource?: string) =>
    new EnhancedAPIError(
      ErrorCode.FORBIDDEN,
      message,
      403,
      { context: { resource } }
    ),

  tokenExpired: () =>
    new EnhancedAPIError(
      ErrorCode.TOKEN_EXPIRED,
      'Authentication token has expired',
      401
    ),

  invalidCredentials: () =>
    new EnhancedAPIError(
      ErrorCode.INVALID_CREDENTIALS,
      'Invalid email or password',
      401
    ),

  // Resource errors
  notFound: (resource: string, identifier?: string) =>
    new EnhancedAPIError(
      ErrorCode.NOT_FOUND,
      `${resource} not found${identifier ? `: ${identifier}` : ''}`,
      404,
      { context: { resource, identifier } }
    ),

  alreadyExists: (resource: string, identifier: string) =>
    new EnhancedAPIError(
      ErrorCode.ALREADY_EXISTS,
      `${resource} already exists: ${identifier}`,
      409,
      { context: { resource, identifier } }
    ),

  resourceLocked: (resource: string, reason?: string) =>
    new EnhancedAPIError(
      ErrorCode.RESOURCE_LOCKED,
      `${resource} is currently locked${reason ? `: ${reason}` : ''}`,
      423,
      { context: { resource, reason } }
    ),

  // Array/Bounds errors
  indexOutOfBounds: (index: number, length: number, context?: string) =>
    new EnhancedAPIError(
      ErrorCode.INDEX_OUT_OF_BOUNDS,
      `Index ${index} is out of bounds for array of length ${length}`,
      400,
      {
        field: 'index',
        value: index,
        expected: `0-${length - 1}`,
        context: { arrayLength: length, context }
      }
    ),

  arrayEmpty: (context?: string) =>
    new EnhancedAPIError(
      ErrorCode.ARRAY_EMPTY,
      'Array is empty',
      400,
      { context: { context } }
    ),

  invalidArrayOperation: (operation: string, reason?: string) =>
    new EnhancedAPIError(
      ErrorCode.INVALID_ARRAY_OPERATION,
      `Invalid array operation: ${operation}${reason ? ` - ${reason}` : ''}`,
      400,
      { context: { operation, reason } }
    ),

  // Data errors
  databaseError: (operation: string, details?: any) =>
    new EnhancedAPIError(
      ErrorCode.DATABASE_ERROR,
      `Database operation failed: ${operation}`,
      500,
      { context: { operation, details } }
    ),

  dataIntegrityError: (constraint: string, details?: any) =>
    new EnhancedAPIError(
      ErrorCode.DATA_INTEGRITY_ERROR,
      `Data integrity constraint violated: ${constraint}`,
      400,
      { context: { constraint, details } }
    ),

  // Network errors
  networkError: (service?: string, details?: any) =>
    new EnhancedAPIError(
      ErrorCode.NETWORK_ERROR,
      `Network error${service ? ` with ${service}` : ''}`,
      503,
      { context: { service, details } }
    ),

  timeoutError: (operation: string, timeout?: number) =>
    new EnhancedAPIError(
      ErrorCode.TIMEOUT_ERROR,
      `Operation timed out: ${operation}`,
      504,
      { context: { operation, timeout } }
    ),

  // Business logic errors
  businessRuleViolation: (rule: string, details?: any) =>
    new EnhancedAPIError(
      ErrorCode.BUSINESS_RULE_VIOLATION,
      `Business rule violation: ${rule}`,
      400,
      { context: { rule, details } }
    ),

  invalidStateTransition: (from: string, to: string, reason?: string) =>
    new EnhancedAPIError(
      ErrorCode.INVALID_STATE_TRANSITION,
      `Invalid state transition from ${from} to ${to}${reason ? `: ${reason}` : ''}`,
      400,
      { context: { from, to, reason } }
    ),

  // System errors
  internalError: (message?: string, details?: any) =>
    new EnhancedAPIError(
      ErrorCode.INTERNAL_ERROR,
      message || 'Internal server error',
      500,
      { context: { details } }
    ),

  rateLimitExceeded: (retryAfter?: number) =>
    new EnhancedAPIError(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Too many requests',
      429,
      { context: { retryAfter } }
    )
}

// Enhanced error handler
export class EnhancedErrorHandler {
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
      ip: this.getClientIP(request),
      timestamp: new Date().toISOString(),
      context
    }

    let apiError: EnhancedAPIError

    // Handle different error types
    if (error instanceof EnhancedAPIError) {
      apiError = error
    } else if (error instanceof z.ZodError) {
      apiError = this.handleZodError(error, requestContext)
    } else if (error instanceof Error) {
      apiError = this.handleGenericError(error, requestContext)
    } else {
      apiError = this.handleUnknownError(error, requestContext)
    }

    // Update path if not set
    if (!apiError.path) {
      apiError.path = request.nextUrl.pathname
    }

    // Log based on severity
    this.logError(apiError, requestContext)

    // Create response
    const response = NextResponse.json(
      {
        success: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          details: apiError.details,
          requestId: apiError.requestId,
          timestamp: apiError.timestamp,
          ...(process.env.NODE_ENV === 'development' && {
            stack: apiError.stack
          })
        }
      },
      { status: apiError.statusCode }
    )

    // Add rate limit headers if applicable
    if (apiError.code === ErrorCode.RATE_LIMIT_EXCEEDED && apiError.details?.context?.retryAfter) {
      response.headers.set('Retry-After', String(apiError.details.context.retryAfter))
    }

    return response
  }

  private static handleZodError(error: z.ZodError, context: any): EnhancedAPIError {
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
      received: String(err.received || 'unknown')
    }))

    return new EnhancedAPIError(
      ErrorCode.VALIDATION_FAILED,
      'Validation failed for one or more fields',
      400,
      {
        context: {
          errors: validationErrors,
          errorCount: validationErrors.length
        }
      }
    )
  }

  private static handleGenericError(error: Error, context: any): EnhancedAPIError {
    // Check for specific error patterns
    const message = error.message.toLowerCase()

    if (message.includes('out of bounds') || message.includes('index out of range')) {
      return APIErrorFactory.indexOutOfBounds(-1, 0, context.context)
    }

    if (message.includes('cannot read properties of undefined') ||
        message.includes('cannot read property')) {
      return new EnhancedAPIError(
        ErrorCode.INTERNAL_ERROR,
        'Null reference error',
        500,
        { context: { originalMessage: error.message } }
      )
    }

    return new EnhancedAPIError(
      ErrorCode.INTERNAL_ERROR,
      'An unexpected error occurred',
      500,
      { context: { originalMessage: error.message } }
    )
  }

  private static handleUnknownError(error: unknown, context: any): EnhancedAPIError {
    return new EnhancedAPIError(
      ErrorCode.INTERNAL_ERROR,
      'An unknown error occurred',
      500,
      { context: { error: String(error), type: typeof error } }
    )
  }

  private static logError(error: EnhancedAPIError, context: any): void {
    const logData = {
      ...context,
      errorCode: error.code,
      statusCode: error.statusCode,
      requestId: error.requestId,
      details: error.details
    }

    if (error.statusCode >= 500) {
      logger.error(`API Error (${error.statusCode}): ${error.message}`, logData, error)
    } else if (error.statusCode >= 400) {
      logger.warn(`API Error (${error.statusCode}): ${error.message}`, logData)
    } else {
      logger.info(`API Error (${error.statusCode}): ${error.message}`, logData)
    }
  }

  private static getClientIP(request: NextRequest): string {
    return (
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-client-ip') ||
      'unknown'
    )
  }
}

// Wrapper for API routes with enhanced error handling
export function withEnhancedErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      const request = args[0] as NextRequest
      return EnhancedErrorHandler.handleError(error, request, handler.name)
    }
  }
}

// Success response helper
export function createEnhancedSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: any,
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString()
    },
    { status: statusCode }
  )
}

// Validation helpers
export const ValidationHelpers = {
  validateIndex: (index: number, array: any[], fieldName: string = 'index') => {
    if (!Array.isArray(array)) {
      throw APIErrorFactory.invalidFormat(fieldName, 'array', typeof array)
    }

    if (index < 0 || index >= array.length) {
      throw APIErrorFactory.indexOutOfBounds(index, array.length, fieldName)
    }
  },

  validateNotEmpty: (array: any[], fieldName: string = 'array') => {
    if (!Array.isArray(array) || array.length === 0) {
      throw APIErrorFactory.arrayEmpty(fieldName)
    }
  },

  validateRange: (value: number, min: number, max: number, fieldName: string) => {
    if (value < min || value > max) {
      throw APIErrorFactory.outOfRange(fieldName, value, min, max)
    }
  },

  validateRequired: (value: any, fieldName: string) => {
    if (value == null || value === '') {
      throw APIErrorFactory.missingRequiredField(fieldName)
    }
  }
}

export default {
  EnhancedAPIError,
  ErrorCode,
  APIErrorFactory,
  EnhancedErrorHandler,
  withEnhancedErrorHandler,
  createEnhancedSuccessResponse,
  ValidationHelpers
}
