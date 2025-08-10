import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, addMinutes, format, parse, isWithinInterval, isAfter, isBefore } from 'date-fns'

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
    
    // Helper to compute slots for one staff
    const buildStaffSlots = async (staff: any) => {
      const requestedDate = new Date(date)
      const dayOfWeek = format(requestedDate, 'EEEE').toLowerCase()
      if (!staff.workingDays.includes(dayOfWeek)) return [] as any[]

      const dayStart = startOfDay(requestedDate)
      const dayEnd = endOfDay(requestedDate)
      const existingBookings = await prisma.booking.findMany({
        where: {
          staffId: staff.id,
          date: { gte: dayStart, lte: dayEnd },
          status: { in: ['CONFIRMED', 'IN_PROGRESS'] }
        },
        orderBy: { date: 'asc' }
      })

      const slots: any[] = []
      const slotDuration = 15
      const serviceDuration = service.duration
      const workStart = parse(staff.startTime, 'HH:mm', requestedDate)
      const workEnd = parse(staff.endTime, 'HH:mm', requestedDate)
      const breakStart = staff.breakStart ? parse(staff.breakStart, 'HH:mm', requestedDate) : null
      const breakEnd = staff.breakEnd ? parse(staff.breakEnd, 'HH:mm', requestedDate) : null

      let currentSlot = workStart
      while (currentSlot <= workEnd) {
        const slotEnd = addMinutes(currentSlot, serviceDuration)
        if (isAfter(slotEnd, workEnd)) break

        const overlapsBreak = breakStart && breakEnd && (
          isWithinInterval(currentSlot, { start: breakStart, end: breakEnd }) ||
          isWithinInterval(slotEnd, { start: breakStart, end: breakEnd }) ||
          (isBefore(currentSlot, breakStart) && isAfter(slotEnd, breakEnd))
        )

        const hasConflict = existingBookings.some(booking => {
          const bookingStart = new Date(booking.date)
          const bookingEnd = addMinutes(bookingStart, booking.duration || 30)
          return (
            isWithinInterval(currentSlot, { start: bookingStart, end: bookingEnd }) ||
            isWithinInterval(slotEnd, { start: bookingStart, end: bookingEnd }) ||
            (isBefore(currentSlot, bookingStart) && isAfter(slotEnd, bookingEnd))
          )
        })

        if (!overlapsBreak && !hasConflict) {
          slots.push({
            time: format(currentSlot, 'HH:mm'),
            datetime: currentSlot.toISOString(),
            available: true
          })
        }

        currentSlot = addMinutes(currentSlot, slotDuration)
      }
      return slots
    }

    const requestedDate = new Date(date)
    if (staffId !== 'any') {
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          startTime: true,
          endTime: true,
          breakStart: true,
          breakEnd: true,
          workingDays: true
        }
      })
      if (!staff) {
        return NextResponse.json({ error: 'Staff member not found' }, { status: 404 })
      }
      const staffSlots = await buildStaffSlots(staff)
      return NextResponse.json({
        available: staffSlots.length > 0,
        date,
        staffId,
        serviceId,
        slots: staffSlots
      })
    }

    // Aggregate availability for all active staff when 'any'
    const activeStaff = await prisma.staff.findMany({
      where: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        startTime: true,
        endTime: true,
        breakStart: true,
        breakEnd: true,
        workingDays: true
      }
    })

    const availabilityByTime: Record<string, { datetime: string; staff: { id: string; name: string }[] }> = {}
    for (const s of activeStaff) {
      const sSlots = await buildStaffSlots(s)
      for (const slot of sSlots) {
        if (!availabilityByTime[slot.time]) {
          availabilityByTime[slot.time] = { datetime: slot.datetime, staff: [] }
        }
        availabilityByTime[slot.time].staff.push({ id: s.id, name: `${s.firstName} ${s.lastName}`.trim() })
      }
    }
    const slots = Object.keys(availabilityByTime)
      .sort()
      .map((t) => ({
        time: t,
        datetime: availabilityByTime[t].datetime,
        available: availabilityByTime[t].staff.length > 0,
        availableStaff: availabilityByTime[t].staff
      }))

    return NextResponse.json({
      available: slots.length > 0,
      date,
      staffId,
      serviceId,
      slots
    })
    
  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}