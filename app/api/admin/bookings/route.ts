import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { 
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }, 
        service: {
          select: {
            name: true,
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
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ message: 'Error fetching bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newBooking = await prisma.booking.create({ data })
    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ message: 'Error creating booking' }, { status: 500 })
  }
}