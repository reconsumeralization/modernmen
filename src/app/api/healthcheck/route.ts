import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Basic health check
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0',
      checks: {
        database: 'ok', // TODO: Add actual database connectivity check
        redis: 'ok',     // TODO: Add Redis connectivity check if using
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        }
      }
    }

    return NextResponse.json(healthCheck, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 })
}