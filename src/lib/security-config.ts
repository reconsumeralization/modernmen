/**
 * Security Configuration for Next.js Application
 * Addresses image optimization, cache poisoning, and other security vulnerabilities
 */

import { NextRequest, NextResponse } from 'next/server'

export interface SecurityConfig {
  // Image security settings
  allowedImageDomains: string[]
  blockedImageExtensions: string[]
  maxImageSize: number
  allowedImageFormats: string[]

  // Cache security
  cachePoisoningPrevention: boolean
  secureHeaders: Record<string, string>

  // Request validation
  maxUrlLength: number
  blockedPaths: string[]
  allowedOrigins: string[]
}

export const securityConfig: SecurityConfig = {
  // Image security - prevent cache key confusion and content injection
  allowedImageDomains: [
    'images.unsplash.com',
    'localhost',
    '*.modernmen.ca',
    '*.vercel.app'
  ],
  blockedImageExtensions: [
    '.svg',  // Prevent XSS via SVG
    '.html', // Prevent HTML injection
    '.js',   // Prevent script injection
    '.php',  // Prevent PHP execution
    '.asp',  // Prevent ASP execution
    '.jsp'   // Prevent JSP execution
  ],
  maxImageSize: 10 * 1024 * 1024, // 10MB limit
  allowedImageFormats: [
    'image/webp',
    'image/avif',
    'image/jpeg',
    'image/png',
    'image/gif'
  ],

  // Cache security
  cachePoisoningPrevention: true,
  secureHeaders: {
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'none'; object-src 'none'; base-uri 'self';",
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  },

  // Request validation
  maxUrlLength: 2048,
  blockedPaths: [
    '/_next/static/../../../',
    '/api/../../../',
    '/_next/image/../../../',
    '/.env',
    '/.git',
    '/wp-admin',
    '/wp-login',
    '/phpmyadmin',
    '/admin.php'
  ],
  allowedOrigins: [
    'http://localhost:3000',
    'https://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL
  ].filter(Boolean)
}

/**
 * Validates image requests to prevent cache key confusion and content injection
 */
export function validateImageRequest(request: NextRequest): { isValid: boolean; error?: string } {
  const url = request.url

  // Check URL length
  if (url.length > securityConfig.maxUrlLength) {
    return { isValid: false, error: 'URL too long' }
  }

  // Check for blocked paths
  for (const blockedPath of securityConfig.blockedPaths) {
    if (url.includes(blockedPath)) {
      return { isValid: false, error: 'Blocked path detected' }
    }
  }

  // Check for directory traversal
  if (url.includes('../') || url.includes('..\\')) {
    return { isValid: false, error: 'Directory traversal detected' }
  }

  // Validate image URL parameters
  const { searchParams } = new URL(url)

  // Check for malicious query parameters
  const suspiciousParams = ['script', 'onload', 'onerror', 'javascript:', 'data:', 'vbscript:']
  for (const param of searchParams.values()) {
    for (const suspicious of suspiciousParams) {
      if (param.toLowerCase().includes(suspicious)) {
        return { isValid: false, error: 'Suspicious parameter detected' }
      }
    }
  }

  // Validate width and height parameters
  const width = searchParams.get('w')
  const height = searchParams.get('h')

  if (width && (isNaN(Number(width)) || Number(width) > 4000 || Number(width) < 1)) {
    return { isValid: false, error: 'Invalid width parameter' }
  }

  if (height && (isNaN(Number(height)) || Number(height) > 4000 || Number(height) < 1)) {
    return { isValid: false, error: 'Invalid height parameter' }
  }

  return { isValid: true }
}

/**
 * Validates file uploads to prevent security issues
 */
export function validateFileUpload(
  file: File,
  allowedTypes: string[] = securityConfig.allowedImageFormats
): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > securityConfig.maxImageSize) {
    return { isValid: false, error: 'File too large' }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type' }
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || securityConfig.blockedImageExtensions.includes(`.${extension}`)) {
    return { isValid: false, error: 'Blocked file extension' }
  }

  return { isValid: true }
}

/**
 * Creates secure cache key to prevent cache poisoning
 */
export function createSecureCacheKey(request: NextRequest): string {
  const url = new URL(request.url)

  // Remove potentially malicious query parameters
  const cleanParams = new URLSearchParams()
  const allowedParams = ['w', 'h', 'q', 'f']

  for (const [key, value] of url.searchParams) {
    if (allowedParams.includes(key) && value.length < 100) {
      cleanParams.set(key, value)
    }
  }

  // Create deterministic cache key
  const key = `${url.pathname}?${cleanParams.toString()}`

  // Hash the key to prevent extremely long cache keys
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Applies comprehensive security headers
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityConfig.secureHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add additional dynamic headers
  response.headers.set('X-Request-ID', crypto.randomUUID())
  response.headers.set('X-Content-Security-Policy', securityConfig.secureHeaders['Content-Security-Policy']!)

  return response
}

/**
 * Validates origin for CORS and CSRF protection
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  if (!origin) return true // Allow requests without origin (same-origin)

  // Check if origin is in allowed list
  const isAllowedOrigin = securityConfig.allowedOrigins.some(allowed => {
    if (allowed!.includes('*')) {
      // Handle wildcard domains
      const pattern = allowed!.replace('*.', '').replace('/*', '')
      return origin.includes(pattern)
    }
    return origin === allowed
  })

  if (!isAllowedOrigin) {
    console.warn(`Blocked request from unauthorized origin: ${origin}`)
    return false
  }

  // Additional referer validation
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      const originUrl = new URL(origin)

      if (refererUrl.origin !== originUrl.origin) {
        console.warn(`Referer/origin mismatch: ${referer} !== ${origin}`)
        return false
      }
    } catch (error) {
      console.warn(`Invalid referer URL: ${referer}`)
      return false
    }
  }

  return true
}

/**
 * Prevents cache poisoning attacks
 */
export function preventCachePoisoning(request: NextRequest): NextResponse | null {
  const url = request.url
  const userAgent = request.headers.get('user-agent') || ''

  // Block requests with suspicious user agents
  const suspiciousUserAgents = [
    'curl',
    'wget',
    'python-requests',
    'go-http-client',
    'java/',
    'bot',
    'crawler'
  ]

  if (suspiciousUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Block requests with unusual headers that could be used for cache poisoning
  const suspiciousHeaders = [
    'x-cache',
    'x-cache-lookup',
    'x-cache-info',
    'x-cache-status',
    'cf-cache-status',
    'x-amz-cf-id'
  ]

  for (const header of suspiciousHeaders) {
    if (request.headers.has(header)) {
      console.warn(`Cache poisoning attempt detected with header: ${header}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return null
}
