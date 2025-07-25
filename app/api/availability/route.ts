import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, addMinutes, format, parse, isWithinInterval } from 'date-fns'

// Get available time slots for a specific date and staff member
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')
    const staffId = searchParams.get('staffId')
    const serviceId = searchParams.get('serviceId')
    
    if (!date || !staffId || !serviceId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }
    
    // Get service duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true }
    })
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }
    
    // Get staff member's schedule
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: {
        startTime: true,
        endTime: true,
        breakStart: true,
        breakEnd: true,
        workingDays: true
      }
    })
    
    if (!staff) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      )
    }    
    // Check if the requested date is a working day
    const requestedDate = new Date(date)
    const dayOfWeek = format(requestedDate, 'EEEE').toLowerCase()
    
    if (!staff.workingDays.includes(dayOfWeek)) {
      return NextResponse.json({
        available: false,
        message: 'Staff member does not work on this day',
        slots: []
      })
    }
    
    // Get existing bookings for the day
    const dayStart = startOfDay(requestedDate)
    const dayEnd = endOfDay(requestedDate)
    
    const existingBookings = await prisma.booking.findMany({
      where: {
        staffId,
        date: {
          gte: dayStart,
          lte: dayEnd
        },
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS']
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
    
    // Generate time slots
    const slots = []
    const slotDuration = 15 // 15-minute intervals
    const serviceDuration = service.duration    
    // Parse staff working hours
    const workStart = parse(staff.startTime, 'HH:mm', requestedDate)
    const workEnd = parse(staff.endTime, 'HH:mm', requestedDate)
    const breakStart = staff.breakStart ? parse(staff.breakStart, 'HH:mm', requestedDate) : null
    const breakEnd = staff.breakEnd ? parse(staff.breakEnd, 'HH:mm', requestedDate) : null
    
    // Generate slots from start to end time
    let currentSlot = workStart
    
    while (currentSlot <= workEnd) {
      const slotEnd = addMinutes(currentSlot, serviceDuration)
      
      // Check if slot extends beyond working hours
      if (slotEnd > workEnd) {
        break
      }
      
      // Check if slot overlaps with break time
      const overlapsBreak = breakStart && breakEnd && (
        isWithinInterval(currentSlot, { start: breakStart, end: breakEnd }) ||
        isWithinInterval(slotEnd, { start: breakStart, end: breakEnd }) ||
        (currentSlot <= breakStart && slotEnd >= breakEnd)
      )
      
      // Check if slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.date)
        const bookingEnd = addMinutes(bookingStart, booking.duration || 30)
        
        return (
          isWithinInterval(currentSlot, { start: bookingStart, end: bookingEnd }) ||
          isWithinInterval(slotEnd, { start: bookingStart, end: bookingEnd }) ||
          (currentSlot <= bookingStart && slotEnd >= bookingEnd)
        )
      })      
      // Add slot if it's available
      if (!overlapsBreak && !hasConflict) {
        slots.push({
          time: format(currentSlot, 'HH:mm'),
          datetime: currentSlot.toISOString(),
          available: true
        })
      }
      
      // Move to next slot
      currentSlot = addMinutes(currentSlot, slotDuration)
    }
    
    return NextResponse.json({
      available: slots.length > 0,
      date: date,
      staffId: staffId,
      serviceId: serviceId,
      slots: slots
    })
    
  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}