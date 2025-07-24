import { NextRequest, NextResponse } from 'next/server'

// Middleware for API authentication and validation
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public endpoints
  const publicPaths = [
    '/api/bookings',      // Public booking endpoint
    '/api/services',      // Public services endpoint
    '/api/docs',          // API documentation
    '/api/init'           // Database initialization (dev only)
  ]

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Admin endpoints require authentication
  if (pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // In production, verify JWT token here
    const token = authHeader.substring(7)
    
    // Simple token validation (replace with proper JWT verification)
    if (process.env.NODE_ENV === 'production' && token !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }
  }

  // Add CORS headers
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  return response
}

export const config = {
  matcher: '/api/:path*'
}
