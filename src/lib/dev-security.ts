/**
 * Development Server Security Configuration
 * Prevents information exposure and other dev-specific vulnerabilities
 */

import { NextRequest, NextResponse } from 'next/server'

// Development security configuration
export const devSecurityConfig = {
  // Hide sensitive information in development
  hideErrorDetails: true,
  hideStackTraces: true,

  // Block access to sensitive development endpoints
  blockedDevPaths: [
    '/_next/static/chunks/',
    '/_next/webpack-hmr',
    '/__nextjs',
    '/_error',
    '/_document',
    '/api/debug',
    '/api/health',
    '/api/metrics'
  ],

  // Allowed origins for development
  allowedDevOrigins: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://127.0.0.1:3000',
    'https://127.0.0.1:3000'
  ],

  // Headers to remove in development
  sensitiveHeaders: [
    'x-powered-by',
    'server',
    'x-aspnet-version',
    'x-debug-info',
    'x-runtime'
  ]
}

/**
 * Sanitize error responses in development
 */
export function sanitizeDevError(error: Error): { message: string; stack?: string } {
  if (process.env.NODE_ENV === 'development') {
    return {
      message: devSecurityConfig.hideErrorDetails
        ? 'An error occurred'
        : error.message,
      stack: devSecurityConfig.hideStackTraces
        ? undefined
        : error.stack
    }
  }

  // In production, always hide sensitive information
  return {
    message: 'An error occurred',
    stack: undefined
  }
}

/**
 * Check if a path is blocked in development
 */
export function isBlockedDevPath(pathname: string): boolean {
  return devSecurityConfig.blockedDevPaths.some(blockedPath =>
    pathname.startsWith(blockedPath)
  )
}

/**
 * Validate development origin
 */
export function isValidDevOrigin(origin: string | null): boolean {
  if (!origin) return true // Allow requests without origin

  return devSecurityConfig.allowedDevOrigins.some(allowed =>
    origin === allowed
  )
}

/**
 * Remove sensitive headers from development responses
 */
export function sanitizeDevHeaders(response: NextResponse): NextResponse {
  if (process.env.NODE_ENV === 'development') {
    devSecurityConfig.sensitiveHeaders.forEach(header => {
      response.headers.delete(header)
    })

    // Add development security headers
    response.headers.set('X-Dev-Security', 'enabled')
    response.headers.set('X-Environment', 'development')
  }

  return response
}

/**
 * Development server security middleware
 */
export function devSecurityMiddleware(request: NextRequest): NextResponse | null {
  // Only apply in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const pathname = request.nextUrl.pathname

  // Block access to sensitive development paths
  if (isBlockedDevPath(pathname)) {
    console.warn(`Blocked access to sensitive dev path: ${pathname}`)
    return new NextResponse('Not Found', { status: 404 })
  }

  // Validate origin for API requests
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    if (!isValidDevOrigin(origin)) {
      console.warn(`Invalid origin for dev API request: ${origin}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // Check for suspicious development requests
  if (isSuspiciousDevRequest(request)) {
    console.warn(`Suspicious development request detected: ${request.url}`)
    return new NextResponse('Bad Request', { status: 400 })
  }

  return null
}

/**
 * Detect suspicious development requests
 */
function isSuspiciousDevRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  const pathname = request.nextUrl.pathname

  // Block common security scanning tools
  const blockedUserAgents = [
    'sqlmap',
    'nikto',
    'dirbuster',
    'gobuster',
    'wpscan',
    'joomlavs',
    'drupalscan',
    'nessus',
    'acunetix',
    'qualysguard'
  ]

  if (blockedUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return true
  }

  // Block access to common sensitive files
  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    '.git',
    '.svn',
    '.hg',
    'composer.json',
    'package.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'webpack.config.js',
    'next.config.js',
    'tailwind.config.js'
  ]

  if (sensitiveFiles.some(file => pathname.includes(file))) {
    return true
  }

  // Block directory traversal attempts
  if (pathname.includes('../') || pathname.includes('..\\')) {
    return true
  }

  // Block access to hidden files/directories
  if (pathname.includes('/.') && !pathname.includes('/.next')) {
    return true
  }

  return false
}

/**
 * Create secure development error page
 */
export function createDevErrorPage(statusCode: number, message: string): NextResponse {
  const errorPage = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Error ${statusCode}</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error { color: #e74c3c; }
        .dev-notice { color: #f39c12; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1 class="error">Error ${statusCode}</h1>
      <p>${message}</p>
      ${process.env.NODE_ENV === 'development' ? '<p class="dev-notice">Development Mode - Additional error details hidden for security</p>' : ''}
    </body>
    </html>
  `

  return new NextResponse(errorPage, {
    status: statusCode,
    headers: {
      'Content-Type': 'text/html',
      'X-Dev-Security': 'enabled'
    }
  })
}

/**
 * Log development security events
 */
export function logDevSecurityEvent(event: string, details: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[DEV SECURITY] ${event}:`, details)
  }
}

/**
 * Development CORS configuration
 */
export const devCorsConfig = {
  origin: devSecurityConfig.allowedDevOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With'
  ],
  credentials: true,
  maxAge: 86400 // 24 hours
}

/**
 * Validate development CORS
 */
export function validateDevCors(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return true
  }

  const origin = request.headers.get('origin')
  const method = request.method

  // Check origin
  if (origin && !devSecurityConfig.allowedDevOrigins.includes(origin)) {
    return false
  }

  // Check method
  if (!devCorsConfig.methods.includes(method)) {
    return false
  }

  return true
}
