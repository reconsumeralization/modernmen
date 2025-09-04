/**
 * Image Security Middleware
 * Protects against cache key confusion, content injection, and SSRF attacks
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  validateImageRequest,
  createSecureCacheKey,
  validateOrigin,
  preventCachePoisoning,
  applySecurityHeaders
} from './security-config'

/**
 * Enhanced image middleware with comprehensive security protections
 */
export async function imageSecurityMiddleware(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url)

  // Only process image optimization requests
  if (!url.pathname.startsWith('/_next/image')) {
    return NextResponse.next()
  }

  // Validate the image request
  const validation = validateImageRequest(request)
  if (!validation.isValid) {
    console.warn(`Image security validation failed: ${validation.error} for ${request.url}`)
    return new NextResponse('Bad Request', { status: 400 })
  }

  // Prevent cache poisoning
  const cachePoisoningResponse = preventCachePoisoning(request)
  if (cachePoisoningResponse) {
    return cachePoisoningResponse
  }

  // Validate origin for cross-origin requests
  if (!validateOrigin(request)) {
    return new NextResponse('Forbidden - Invalid Origin', { status: 403 })
  }

  // Extract and validate image source URL
  const imageUrl = url.searchParams.get('url')
  if (!imageUrl) {
    return new NextResponse('Bad Request - Missing image URL', { status: 400 })
  }

  // Prevent SSRF by validating image source URL
  try {
    const sourceUrl = new URL(imageUrl)

    // Only allow HTTPS for external images
    if (sourceUrl.protocol !== 'https:' && !sourceUrl.hostname.includes('localhost')) {
      return new NextResponse('Forbidden - Only HTTPS images allowed', { status: 403 })
    }

    // Prevent access to internal services
    const blockedHostnames = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'internal',
      'metadata',
      '169.254.', // AWS metadata
      '10.',       // Private networks
      '172.',      // Private networks
      '192.168.'   // Private networks
    ]

    if (blockedHostnames.some(blocked =>
      sourceUrl.hostname.includes(blocked) ||
      sourceUrl.hostname.startsWith(blocked)
    )) {
      console.warn(`SSRF attempt blocked for hostname: ${sourceUrl.hostname}`)
      return new NextResponse('Forbidden - Invalid image source', { status: 403 })
    }

    // Additional SSRF protection - prevent access to common internal ports
    if (sourceUrl.port && ['22', '23', '25', '53', '110', '143', '993', '995'].includes(sourceUrl.port)) {
      console.warn(`SSRF attempt blocked for port: ${sourceUrl.port}`)
      return new NextResponse('Forbidden - Invalid port', { status: 403 })
    }

  } catch (error) {
    console.warn(`Invalid image URL format: ${imageUrl}`)
    return new NextResponse('Bad Request - Invalid image URL', { status: 400 })
  }

  // Create secure cache key to prevent cache poisoning
  const secureCacheKey = createSecureCacheKey(request)

  // Create response with security headers
  const response = NextResponse.next()

  // Add security headers
  applySecurityHeaders(response)

  // Add cache control headers
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  response.headers.set('X-Image-Security', 'validated')
  response.headers.set('X-Cache-Key', secureCacheKey)

  // Prevent content sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Add CSP for images
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'none'; img-src 'self' https: data:; style-src 'unsafe-inline';"
  )

  return response
}

/**
 * Validates image transformation parameters to prevent DoS
 */
export function validateImageTransform(params: URLSearchParams): boolean {
  const width = params.get('w')
  const height = params.get('h')
  const quality = params.get('q')
  const format = params.get('f')

  // Validate width
  if (width) {
    const w = parseInt(width)
    if (isNaN(w) || w < 1 || w > 4000) {
      return false
    }
  }

  // Validate height
  if (height) {
    const h = parseInt(height)
    if (isNaN(h) || h < 1 || h > 4000) {
      return false
    }
  }

  // Validate quality
  if (quality) {
    const q = parseInt(quality)
    if (isNaN(q) || q < 1 || q > 100) {
      return false
    }
  }

  // Validate format
  if (format) {
    const allowedFormats = ['webp', 'avif', 'jpeg', 'png']
    if (!allowedFormats.includes(format.toLowerCase())) {
      return false
    }
  }

  return true
}

/**
 * Rate limiting for image requests to prevent DoS
 */
const imageRequestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimitImageRequests(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const windowKey = Math.floor(now / windowMs)
  const key = `${identifier}-${windowKey}`

  const current = imageRequestCounts.get(key) || { count: 0, resetTime: now + windowMs }

  if (now > current.resetTime) {
    current.count = 0
    current.resetTime = now + windowMs
  }

  current.count++
  imageRequestCounts.set(key, current)

  return current.count <= maxRequests
}

/**
 * Comprehensive image security check
 */
export async function comprehensiveImageSecurity(request: NextRequest): Promise<{
  isValid: boolean
  response?: NextResponse
  warnings?: string[]
}> {
  const warnings: string[] = []

  // Basic validation
  const validation = validateImageRequest(request)
  if (!validation.isValid) {
    return { isValid: false, response: new NextResponse('Bad Request', { status: 400 }) }
  }

  // Rate limiting
  const identifier = request.ip || 'unknown'
  if (!rateLimitImageRequests(identifier)) {
    return { isValid: false, response: new NextResponse('Too Many Requests', { status: 429 }) }
  }

  // Parameter validation
  const params = new URL(request.url).searchParams
  if (!validateImageTransform(params)) {
    warnings.push('Invalid image transformation parameters')
  }

  // Origin validation
  if (!validateOrigin(request)) {
    return { isValid: false, response: new NextResponse('Forbidden', { status: 403 }) }
  }

  // Cache poisoning check
  const cachePoisoningResponse = preventCachePoisoning(request)
  if (cachePoisoningResponse) {
    return { isValid: false, response: cachePoisoningResponse }
  }

  // Process the secure image request
  const secureResponse = await imageSecurityMiddleware(request)

  return {
    isValid: true,
    response: secureResponse,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}
