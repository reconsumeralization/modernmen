import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { authRateLimiters, getRateLimitIdentifier, createRateLimitResponse } from '@/lib/auth-ratelimit'
import { imageSecurityMiddleware } from '@/lib/image-security-middleware'
import { dosProtectionMiddleware } from '@/lib/dos-protection'
import { devSecurityMiddleware, sanitizeDevHeaders } from '@/lib/dev-security'

export async function middleware(request: NextRequest) {
  // Handle image security middleware first
  if (request.nextUrl.pathname.startsWith('/_next/image')) {
    return await imageSecurityMiddleware(request)
  }

  // Apply development security middleware
  const devResponse = devSecurityMiddleware(request)
  if (devResponse) {
    return devResponse
  }

  // Apply DoS protection
  const dosResponse = await dosProtectionMiddleware(request)
  if (dosResponse) {
    return dosResponse
  }

  const response = NextResponse.next()

  // Enhanced Security headers
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CSRF protection with improved validation
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    const referer = request.headers.get('referer')

    // Validate Origin header
    if (origin) {
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.NEXT_PUBLIC_VERCEL_URL,
        'http://localhost:3000',
        'https://localhost:3000'
      ].filter(Boolean)

      const isValidOrigin = allowedOrigins.some(allowed =>
        origin === allowed || (host && origin.includes(host))
      )

      if (!isValidOrigin) {
        console.warn(`CSRF attempt blocked: Origin ${origin} not allowed for ${request.url}`)
        return new NextResponse('Forbidden - Invalid Origin', { status: 403 })
      }
    }

    // Additional Referer validation
    if (referer && origin) {
      try {
        const refererUrl = new URL(referer)
        const originUrl = new URL(origin)
        if (refererUrl.origin !== originUrl.origin) {
          console.warn(`CSRF attempt blocked: Referer ${referer} doesn't match origin ${origin}`)
          return new NextResponse('Forbidden - Referer Mismatch', { status: 403 })
        }
      } catch (error) {
        console.warn('Invalid referer URL:', referer)
        return new NextResponse('Forbidden - Invalid Referer', { status: 403 })
      }
    }
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const identifier = getRateLimitIdentifier(request, 'api')
      const result = await authRateLimiters.api.check(identifier)

      if (!result.success) {
        return createRateLimitResponse(result)
      }

      // Add rate limit headers to successful requests
      response.headers.set('X-RateLimit-Limit', result.limit.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', result.reset.toISOString())
      response.headers.set('X-RateLimit-Using-Redis', result.redis ? 'true' : 'false')

    } catch (error) {
      console.error('Rate limiting error in middleware:', error)
      // Continue with request on rate limiting failure to prevent blocking legitimate users
    }
  }

  // Authentication check for protected routes
  const protectedPaths = [
    '/dashboard',
    '/admin',
    '/profile',
    '/settings',
    '/api/protected',
    '/api/user',
    '/api/admin',
    '/api/appointments',
    '/api/customers',
    '/api/services'
  ]

  // Documentation access control - enhanced validation
  if (request.nextUrl.pathname.startsWith('/documentation/admin')) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      })

      // Enhanced token validation
      if (!token ||
          !token.sub ||
          !token.email ||
          token.role !== 'admin' ||
          typeof token.exp === 'number' && token.exp < Math.floor(Date.now() / 1000)) {
        console.warn(`Unauthorized access attempt to admin docs: ${request.url}`)
        const redirectUrl = new URL('/auth/signin', request.url.origin || 'http://localhost:3000')
        redirectUrl.searchParams.set('error', 'access_denied')
        redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
        return createSecureRedirect(redirectUrl.toString())
      }
    } catch (error) {
      console.error('Token validation error:', error)
      return new NextResponse('Authentication Error', { status: 401 })
    }
  }

  const publicAuthPaths = [
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/auth/forgot-password',
    '/auth/reset-password'
  ]

  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  const isPublicAuthPath = publicAuthPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  const isApiAuthPath = request.nextUrl.pathname.startsWith('/api/auth/')

  // Redirect authenticated users away from auth pages
  if (isPublicAuthPath && !isApiAuthPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (token && !request.nextUrl.pathname.includes('/error')) {
      const redirectUrl = new URL('/dashboard', request.url.origin || 'http://localhost:3000')
      return createSecureRedirect(redirectUrl.toString())
    }
  }

  if (isProtectedPath) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      })

      // Comprehensive token validation
      if (!token ||
          !token.sub ||
          !token.email ||
          typeof token.exp === 'number' && token.exp < Math.floor(Date.now() / 1000) ||
          typeof token.iat === 'number' && token.iat > Math.floor(Date.now() / 1000) + 300) { // Token issued in future + 5min tolerance

        console.warn(`Invalid token for protected path: ${request.nextUrl.pathname}`)

        if (request.nextUrl.pathname.startsWith('/api/')) {
          return new NextResponse(JSON.stringify({
            error: 'Unauthorized',
            message: 'Invalid or expired authentication token'
          }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        const redirectUrl = new URL('/auth/signin', request.url.origin || 'http://localhost:3000')
        redirectUrl.searchParams.set('error', 'session_expired')
        redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
        return createSecureRedirect(redirectUrl.toString())
      }

      // Enhanced role-based access control
      if (request.nextUrl.pathname.startsWith('/admin') && token.role !== 'admin') {
        console.warn(`Forbidden access attempt to admin path: ${request.nextUrl.pathname} by user ${token.email}`)

        if (request.nextUrl.pathname.startsWith('/api/')) {
          return new NextResponse(JSON.stringify({
            error: 'Forbidden',
            message: 'Insufficient permissions for admin access'
          }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          })
        }
        return new NextResponse('Forbidden - Admin Access Required', { status: 403 })
      }

      // Validate token role is valid
      const validRoles = ['admin', 'manager', 'stylist', 'user']
      if (!validRoles.includes(token.role as string)) {
        console.warn(`Invalid role in token: ${token.role} for user ${token.email}`)
        return new NextResponse('Forbidden - Invalid Role', { status: 403 })
      }

      // Add validated user info to request headers for API routes
      if (request.nextUrl.pathname.startsWith('/api/')) {
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', token.sub!)
        requestHeaders.set('x-user-role', token.role as string)
        requestHeaders.set('x-user-email', token.email as string)
        requestHeaders.set('x-user-validated', 'true')

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      }
    } catch (error) {
      console.error('Authentication error in middleware:', error)

      if (request.nextUrl.pathname.startsWith('/api/')) {
        return new NextResponse(JSON.stringify({
          error: 'Authentication Error',
          message: 'Failed to validate authentication token'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const redirectUrl = new URL('/auth/signin', request.url.origin || 'http://localhost:3000')
      redirectUrl.searchParams.set('error', 'auth_error')
      return createSecureRedirect(redirectUrl.toString())
    }
  }

  // Cache control for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/') || 
      request.nextUrl.pathname.startsWith('/images/') ||
      request.nextUrl.pathname.endsWith('.png') ||
      request.nextUrl.pathname.endsWith('.jpg') ||
      request.nextUrl.pathname.endsWith('.jpeg') ||
      request.nextUrl.pathname.endsWith('.gif') ||
      request.nextUrl.pathname.endsWith('.svg')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // PWA service worker
  if (request.nextUrl.pathname === '/sw.js') {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    response.headers.set('Service-Worker-Allowed', '/')
  }

  // Sanitize headers for development
  return sanitizeDevHeaders(response)
}

// SSRF protection function
function isValidRedirectUrl(url: string, baseUrl: string): boolean {
  try {
    const redirectUrl = new URL(url, baseUrl)
    const baseUrlObj = new URL(baseUrl)

    // Prevent open redirects by ensuring same origin
    return redirectUrl.origin === baseUrlObj.origin
  } catch {
    return false
  }
}

// Enhanced redirect handling to prevent SSRF
function createSecureRedirect(url: string, fallbackPath: string = '/auth/signin'): NextResponse {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (isValidRedirectUrl(url, baseUrl)) {
    return NextResponse.redirect(url)
  } else {
    console.warn(`SSRF attempt blocked: Invalid redirect URL ${url}`)
    const fallbackUrl = new URL(fallbackPath, baseUrl)
    return NextResponse.redirect(fallbackUrl.toString())
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths including image optimization for security processing
     * Exclusions:
     * - _next/static (static files - handled separately for performance)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|favicon.ico).*)',
  ],
}
