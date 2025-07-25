import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

// Direct Prisma instance
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'modernmen-barbershop-secret-key-2025'

function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check cookies
  const tokenCookie = request.cookies.get('auth-token')
  if (tokenCookie) {
    return tokenCookie.value
  }

  return null
}

function verifyToken(token: string): any | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    
    if (!user || user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Invalid token or insufficient permissions' },
        { status: 401 }
      )
    }

    // Fetch user's bookings with related data
    const bookings = await prisma.booking.findMany({
      where: { clientId: user.id },
      include: {
        service: {
          select: {
            name: true,
            duration: true,
            price: true,
            category: true
          }
        },
        staff: {
          select: {
            firstName: true,
            lastName: true,
            specialties: true
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { startTime: 'desc' }
      ]
    })

    return NextResponse.json(bookings)

  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    
    if (!user || user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Invalid token or insufficient permissions' },
        { status: 401 }
      )
    }

    const { serviceId, staffId, date, startTime, notes } = await request.json()

    if (!serviceId || !staffId || !date || !startTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get service details for pricing and duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Calculate end time
    const startDateTime = new Date(`${date}T${startTime}`)
    const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000)
    const endTime = endDateTime.toTimeString().slice(0, 5)

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        clientId: user.id,
        serviceId,
        staffId,
        date: new Date(date),
        startTime,
        endTime,
        duration: service.duration,
        totalPrice: service.price,
        notes: notes || '',
        status: 'PENDING',
        paymentStatus: 'UNPAID'
      },
      include: {
        service: {
          select: {
            name: true,
            duration: true,
            price: true
          }
        },
        staff: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json(booking, { status: 201 })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}