import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/db/seed'

// POST /api/init - Initialize database with seed data
export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Database initialization not allowed in production' },
        { status: 403 }
      )
    }

    await seedDatabase()

    return NextResponse.json({
      message: 'Database initialized successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ DATABASE INIT ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}

// GET /api/init - Check database status
export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const [
      clientCount,
      staffCount,
      serviceCount,
      bookingCount
    ] = await Promise.all([
      prisma.client.count(),
      prisma.staff.count(),
      prisma.service.count(),
      prisma.booking.count()
    ])

    return NextResponse.json({
      database: {
        clients: clientCount,
        staff: staffCount,
        services: serviceCount,
        bookings: bookingCount,
        initialized: clientCount > 0 || staffCount > 0 || serviceCount > 0
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ DATABASE CHECK ERROR:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check database status',
        database: {
          clients: 0,
          staff: 0,
          services: 0,
          bookings: 0,
          initialized: false
        }
      },
      { status: 500 }
    )
  }
}
