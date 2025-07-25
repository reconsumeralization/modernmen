import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verify JWT and get customer ID
function getCustomerId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.id
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const customerId = getCustomerId(request)
    if (!customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const bookings = await prisma.booking.findMany({
      where: {
        clientId: customerId
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            duration: true
          }
        },
        staff: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    // Format bookings for response
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      date: booking.date,
      time: new Date(booking.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      service: booking.service,
      staff: booking.staff,
      status: booking.status,
      notes: booking.notes
    }))
    
    return NextResponse.json(formattedBookings)
    
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}