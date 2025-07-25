import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin page protection (client-side handled by AdminLayout)

  // API protection
  if (pathname.startsWith('/api')) {
    // Public endpoints
    const publicPaths = [
      '/api/bookings',
      '/api/services', 
      '/api/docs',
      '/api/auth/login',
      '/api/auth/customer',
      '/api/availability'
    ]
    
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
    
    if (isPublicPath) {
      return NextResponse.next()
    }
    
    // Protected admin endpoints
    if (pathname.startsWith('/api/admin') || 
        pathname.startsWith('/api/clients') ||
        pathname.startsWith('/api/staff') ||
        pathname.startsWith('/api/analytics') ||
        pathname.startsWith('/api/products') ||
        pathname.startsWith('/api/orders')) {
      
      const authHeader = request.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      const token = authHeader.substring(7)
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        // Add the decoded token to the request headers for API routes to use
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-data', JSON.stringify(decoded))
        
        const response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
        
        return response
      } catch (error) {
        console.error('JWT verification failed:', error)
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }
    }
    
    // Customer protected endpoints
    if (pathname.startsWith('/api/customers')) {
      const authHeader = request.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Customer authentication required' },
          { status: 401 }
        )
      }
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
  matcher: ['/api/:path*', '/admin/:path*']
}