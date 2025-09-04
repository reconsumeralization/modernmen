/**
 * DoS Protection Middleware
 * Prevents Denial of Service attacks through rate limiting, request size limits, and resource exhaustion
 */

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  blockDurationMs: number
}

interface DosProtectionConfig {
  // Rate limiting
  apiRateLimit: RateLimitConfig
  authRateLimit: RateLimitConfig
  imageRateLimit: RateLimitConfig

  // Request size limits
  maxBodySize: number
  maxUrlLength: number
  maxHeadersCount: number

  // Resource protection
  maxConcurrentRequests: number
  requestTimeoutMs: number

  // Suspicious request patterns
  suspiciousPatterns: RegExp[]
}

export const dosConfig: DosProtectionConfig = {
  apiRateLimit: {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
    blockDurationMs: 300000 // 5 minutes
  },
  authRateLimit: {
    windowMs: 300000, // 5 minutes
    maxRequests: 5,
    blockDurationMs: 900000 // 15 minutes
  },
  imageRateLimit: {
    windowMs: 60000, // 1 minute
    maxRequests: 50,
    blockDurationMs: 180000 // 3 minutes
  },

  maxBodySize: 10 * 1024 * 1024, // 10MB
  maxUrlLength: 2048,
  maxHeadersCount: 50,

  maxConcurrentRequests: 100,
  requestTimeoutMs: 30000, // 30 seconds

  suspiciousPatterns: [
    /\.\.\//, // Directory traversal
    /<script/i, // Script injection
    /javascript:/i, // JavaScript URLs
    /vbscript:/i, // VBScript
    /data:/i, // Data URLs
    /onload=/i, // Event handlers
    /onerror=/i, // Error handlers
    /eval\(/i, // Eval usage
    /Function\(/i, // Function constructor
    /setTimeout\(/i, // setTimeout abuse
    /setInterval\(/i, // setInterval abuse
    /XMLHttpRequest/i, // XHR abuse
    /fetch\(/i, // Fetch abuse
  ]
}

// In-memory storage for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, {
  requests: number[]
  blockedUntil?: number
}>()

const concurrentRequests = new Map<string, number>()

/**
 * Rate limiting implementation
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remainingRequests: number; resetTime: number } {
  const now = Date.now()
  const key = `${identifier}_${config.windowMs}`

  let userData = rateLimitStore.get(key)
  if (!userData) {
    userData = { requests: [] }
    rateLimitStore.set(key, userData)
  }

  // Check if user is currently blocked
  if (userData.blockedUntil && now < userData.blockedUntil) {
    return {
      allowed: false,
      remainingRequests: 0,
      resetTime: userData.blockedUntil
    }
  }

  // Clean old requests outside the window
  userData.requests = userData.requests.filter(
    timestamp => now - timestamp < config.windowMs
  )

  // Check if limit exceeded
  if (userData.requests.length >= config.maxRequests) {
    userData.blockedUntil = now + config.blockDurationMs
    rateLimitStore.set(key, userData)

    console.warn(`Rate limit exceeded for ${identifier}, blocked until ${new Date(userData.blockedUntil)}`)

    return {
      allowed: false,
      remainingRequests: 0,
      resetTime: userData.blockedUntil
    }
  }

  // Add current request
  userData.requests.push(now)
  rateLimitStore.set(key, userData)

  const remainingRequests = config.maxRequests - userData.requests.length
  const resetTime = now + config.windowMs

  return {
    allowed: true,
    remainingRequests,
    resetTime
  }
}

/**
 * Concurrent request limiting
 */
export function checkConcurrentRequests(identifier: string): boolean {
  const current = concurrentRequests.get(identifier) || 0

  if (current >= dosConfig.maxConcurrentRequests) {
    console.warn(`Concurrent request limit exceeded for ${identifier}`)
    return false
  }

  concurrentRequests.set(identifier, current + 1)
  return true
}

/**
 * Release concurrent request counter
 */
export function releaseConcurrentRequest(identifier: string): void {
  const current = concurrentRequests.get(identifier) || 0
  if (current > 0) {
    concurrentRequests.set(identifier, current - 1)
  }
}

/**
 * Request size validation
 */
export function validateRequestSize(request: NextRequest): { valid: boolean; error?: string } {
  // Check URL length
  if (request.url.length > dosConfig.maxUrlLength) {
    return { valid: false, error: 'URL too long' }
  }

  // Check headers count
  const headersCount = Array.from(request.headers.entries()).length
  if (headersCount > dosConfig.maxHeadersCount) {
    return { valid: false, error: 'Too many headers' }
  }

  // Check body size (for requests with body)
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > dosConfig.maxBodySize) {
    return { valid: false, error: 'Request body too large' }
  }

  return { valid: true }
}

/**
 * Suspicious pattern detection
 */
export function detectSuspiciousPatterns(request: NextRequest): { suspicious: boolean; patterns: string[] } {
  const suspiciousPatterns: string[] = []
  const url = request.url.toLowerCase()

  // Check URL for suspicious patterns
  for (const pattern of dosConfig.suspiciousPatterns) {
    if (pattern.test(url)) {
      suspiciousPatterns.push(pattern.source)
    }
  }

  // Check headers for suspicious content
  for (const [key, value] of request.headers.entries()) {
    const headerContent = `${key}: ${value}`.toLowerCase()
    for (const pattern of dosConfig.suspiciousPatterns) {
      if (pattern.test(headerContent)) {
        suspiciousPatterns.push(`${pattern.source} in header ${key}`)
      }
    }
  }

  return {
    suspicious: suspiciousPatterns.length > 0,
    patterns: suspiciousPatterns
  }
}

/**
 * Comprehensive DoS protection middleware
 */
export async function dosProtectionMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const identifier = getRequestIdentifier(request)

  try {
    // Validate request size
    const sizeValidation = validateRequestSize(request)
    if (!sizeValidation.valid) {
      console.warn(`Request size validation failed: ${sizeValidation.error} for ${request.url}`)
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Check for suspicious patterns
    const patternDetection = detectSuspiciousPatterns(request)
    if (patternDetection.suspicious) {
      console.warn(`Suspicious patterns detected: ${patternDetection.patterns.join(', ')} for ${request.url}`)
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Check concurrent requests
    if (!checkConcurrentRequests(identifier)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': '60' }
      })
    }

    // Apply appropriate rate limiting based on request type
    let rateLimitConfig: RateLimitConfig

    if (request.nextUrl.pathname.startsWith('/api/auth')) {
      rateLimitConfig = dosConfig.authRateLimit
    } else if (request.nextUrl.pathname.startsWith('/_next/image')) {
      rateLimitConfig = dosConfig.imageRateLimit
    } else if (request.nextUrl.pathname.startsWith('/api/')) {
      rateLimitConfig = dosConfig.apiRateLimit
    } else {
      // Skip rate limiting for non-API routes
      return null
    }

    const rateLimitResult = checkRateLimit(identifier, rateLimitConfig)

    if (!rateLimitResult.allowed) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
        }
      })
    }

    // Set rate limit headers on successful requests
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remainingRequests.toString())
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())

    return response

  } finally {
    // Release concurrent request counter
    releaseConcurrentRequest(identifier)
  }
}

/**
 * Get unique identifier for rate limiting
 */
function getRequestIdentifier(request: NextRequest): string {
  // Use IP address as primary identifier
  const ip = request.ip ||
             request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown'

  // For authenticated requests, also consider user ID
  const userId = request.headers.get('x-user-id')

  return userId ? `${ip}-${userId}` : ip
}

/**
 * Clean up expired rate limit data (call periodically)
 */
export function cleanupExpiredRateLimits(): void {
  const now = Date.now()

  for (const [key, data] of rateLimitStore.entries()) {
    // Remove blocked users whose block has expired
    if (data.blockedUntil && now > data.blockedUntil) {
      rateLimitStore.delete(key)
      continue
    }

    // Clean old requests (keep only within the largest window)
    const maxWindow = Math.max(
      dosConfig.apiRateLimit.windowMs,
      dosConfig.authRateLimit.windowMs,
      dosConfig.imageRateLimit.windowMs
    )

    data.requests = data.requests.filter(
      timestamp => now - timestamp < maxWindow
    )

    if (data.requests.length === 0 && !data.blockedUntil) {
      rateLimitStore.delete(key)
    }
  }
}

// Clean up expired data every 5 minutes
setInterval(cleanupExpiredRateLimits, 5 * 60 * 1000)
