import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only handle API concerns here. Individual API routes perform auth.
  if (pathname.startsWith('/api')) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      const preflight = new NextResponse(null, { status: 204 })
      preflight.headers.set('Access-Control-Allow-Origin', '*')
      preflight.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
      preflight.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
      return preflight
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
  matcher: ['/api/:path*']
}