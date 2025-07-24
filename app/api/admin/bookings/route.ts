import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/bookings - Get all bookings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const status = searchParams.get('status')
    const staffId = searchParams.get('staffId')
    const clientId = searchParams.get('clientId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where conditions
    const where: any = {}

    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      where.date = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    if (status) where.status = status
    if (staffId) where.staffId = staffId
    if (clientId) where.clientId = clientId

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true
            }
          },
          staff: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
              category: true
            }
          }
        },
        orderBy: [
          { date: 'desc' },
          { startTime: 'asc' }
        ]
      }),
      prisma.booking.count({ where })
    ])

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('❌ GET BOOKINGS ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    
    // Validate required fields
    const requiredFields = ['clientId', 'staffId', 'serviceId', 'date', 'startTime']
    const missingFields = requiredFields.filter(field => !bookingData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields 
        },
        { status: 400 }
      )
    }

    // Get service details for duration and price
    const service = await prisma.service.findUnique({
      where: { id: bookingData.serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Calculate end time
    const startTime = bookingData.startTime
    const startHour = parseInt(startTime.split(':')[0])
    const startMinute = parseInt(startTime.split(':')[1])
    const endMinute = (startMinute + service.duration) % 60
    const endHour = startHour + Math.floor((startMinute + service.duration) / 60)
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`

    // Check for conflicts
    const bookingDate = new Date(bookingData.date)
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        staffId: bookingData.staffId,
        date: bookingDate,
        status: { in: ['CONFIRMED', 'PENDING'] },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { 
          error: 'Time slot conflicts with existing booking',
          conflictingBooking: conflictingBooking.id
        },
        { status: 409 }
      )
    }

    // Create the booking
    const newBooking = await prisma.booking.create({
      data: {
        clientId: bookingData.clientId,
        staffId: bookingData.staffId,
        serviceId: bookingData.serviceId,
        date: bookingDate,
        startTime,
        endTime,
        duration: service.duration,
        totalPrice: service.price,
        status: bookingData.status || 'CONFIRMED',
        notes: bookingData.notes || null,
        paymentStatus: bookingData.paymentStatus || 'UNPAID'
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        staff: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        service: {
          select: {
            name: true,
            duration: true,
            price: true
          }
        }
      }
    })

    // Update client stats
    await prisma.client.update({
      where: { id: bookingData.clientId },
      data: {
        totalVisits: { increment: 1 },
        totalSpent: { increment: service.price },
        lastVisit: bookingDate
      }
    })

    // Update staff stats
    await prisma.staff.update({
      where: { id: bookingData.staffId },
      data: {
        totalBookings: { increment: 1 }
      }
    })

    return NextResponse.json({
      message: 'Booking created successfully',
      booking: newBooking
    }, { status: 201 })

  } catch (error) {
    console.error('❌ CREATE BOOKING ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
