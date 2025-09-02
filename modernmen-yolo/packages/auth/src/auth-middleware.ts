import { NextRequest, NextResponse } from 'next/server'
import { authService } from '../services/auth'

// Types for middleware configuration
export interface AuthMiddlewareConfig {
  requireAuth?: boolean
  requireAdmin?: boolean
  requireStaff?: boolean
  allowedRoles?: ('admin' | 'staff' | 'customer')[]
}

// Authentication middleware function
export async function withAuth(
  request: NextRequest,
  config: AuthMiddlewareConfig = { requireAuth: true }
) {
  try {
    // Get current user
    const user = authService.getCurrentUser()

    // Check if authentication is required
    if (config.requireAuth && !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      )
    }

    // Check admin requirement
    if (config.requireAdmin && !authService.hasRole('admin')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin privileges required',
          code: 'ADMIN_REQUIRED'
        },
        { status: 403 }
      )
    }

    // Check staff requirement
    if (config.requireStaff && !authService.hasRole('staff') && !authService.hasRole('admin')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Staff privileges required',
          code: 'STAFF_REQUIRED'
        },
        { status: 403 }
      )
    }

    // Check allowed roles
    if (config.allowedRoles && user && !config.allowedRoles.includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        },
        { status: 403 }
      )
    }

    // Return user for use in route handlers
    return { user, isAuthenticated: !!user }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication service unavailable',
        code: 'AUTH_SERVICE_ERROR'
      },
      { status: 503 }
    )
  }
}

// Helper functions for common auth patterns
export const requireAdmin = () => withAuthConfig({ requireAdmin: true })
export const requireStaff = () => withAuthConfig({ requireStaff: true })
export const requireAuth = () => withAuthConfig({ requireAuth: true })

export const requireRole = (roles: ('admin' | 'staff' | 'customer')[]) =>
  withAuthConfig({ allowedRoles: roles })

// Configuration helper
function withAuthConfig(config: AuthMiddlewareConfig) {
  return async (request: NextRequest) => {
    return await withAuth(request, config)
  }
}

// Rate limiting middleware
interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{ allowed: boolean; resetTime?: number; remaining?: number }> {
  const { windowMs, maxRequests, skipSuccessfulRequests, skipFailedRequests } = config

  // Get client identifier (IP address)
  const clientId = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown'

  const now = Date.now()
  const windowKey = `${clientId}:${Math.floor(now / windowMs)}`

  let clientData = rateLimitStore.get(windowKey)

  if (!clientData || now > clientData.resetTime) {
    clientData = {
      count: 0,
      resetTime: now + windowMs
    }
    rateLimitStore.set(windowKey, clientData)
  }

  // Check if request should be skipped
  if (skipSuccessfulRequests || skipFailedRequests) {
    // This would need to be implemented based on response status
    // For now, we'll count all requests
  }

  clientData.count++

  const allowed = clientData.count <= maxRequests
  const remaining = Math.max(0, maxRequests - clientData.count)

  if (!allowed) {
    return {
      allowed: false,
      resetTime: clientData.resetTime,
      remaining: 0
    }
  }

  return {
    allowed: true,
    resetTime: clientData.resetTime,
    remaining
  }
}

// Input validation middleware
export async function withValidation<T>(
  request: NextRequest,
  validator: (data: T) => { isValid: boolean; errors?: string[] }
): Promise<{ data?: T; errors?: string[] }> {
  try {
    const body = await request.json()
    const validation = validator(body as T)

    if (!validation.isValid) {
      return {
        errors: validation.errors || ['Validation failed']
      }
    }

    return { data: body as T }
  } catch (error) {
    return {
      errors: ['Invalid JSON data']
    }
  }
}

// Combined middleware for API routes
export async function withApiMiddleware(
  request: NextRequest,
  options: {
    auth?: AuthMiddlewareConfig
    rateLimit?: RateLimitConfig
    validation?: {
      validator: (data: any) => { isValid: boolean; errors?: string[] }
    }
  } = {}
) {
  const { auth, rateLimit, validation } = options

  // Apply rate limiting
  if (rateLimit) {
    const rateLimitResult = await withRateLimit(request, rateLimit)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          resetTime: rateLimitResult.resetTime,
          retryAfter: Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '',
            'Retry-After': Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString()
          }
        }
      )
    }
  }

  // Apply authentication
  if (auth) {
    const authResult = await withAuth(request, auth)
    if (authResult instanceof NextResponse) {
      return authResult
    }
  }

  // Apply validation if provided
  if (validation) {
    const validationResult = await withValidation(request, validation.validator)
    if (validationResult.errors) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationResult.errors
        },
        { status: 400 }
      )
    }
  }

  return { success: true }
}

// Error response helpers
export function createApiError(
  message: string,
  code: string,
  status: number = 500,
  details?: any
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
      details,
      timestamp: new Date().toISOString()
    },
    { status }
  )
}

export function createApiSuccess<T>(
  data: T,
  message?: string,
  pagination?: any
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      pagination,
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}
