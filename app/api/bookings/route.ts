import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const booking = await request.json()
    
    // Enhanced validation
    const requiredFields = ['name', 'phone', 'email', 'service']
    const missingFields = requiredFields.filter(field => !booking[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields,
          success: false 
        },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(booking.email)) {
      return NextResponse.json(
        { error: 'Invalid email format', success: false },
        { status: 400 }
      )
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/
    if (!phoneRegex.test(booking.phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format', success: false },
        { status: 400 }
      )
    }

    // 1. Find or create client
    let client = await prisma.client.findUnique({ where: { email: booking.email } })
    if (!client) {
      const [firstName, ...rest] = booking.name.split(' ')
      const lastName = rest.join(' ') || ''
      client = await prisma.client.create({
        data: {
          firstName,
          lastName,
          email: booking.email,
          phone: booking.phone
        }
      })
    }
    // 2. Find service
    const service = await prisma.service.findFirst({ where: { name: booking.service } })
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found', success: false },
        { status: 400 }
      )
    }
    // 3. Find staff (if provided)
    let staff = null
    if (booking.staff) {
      // Try to find by full name
      const [firstName, ...rest] = booking.staff.split(' ')
      const lastName = rest.join(' ') || ''
      staff = await prisma.staff.findFirst({ where: { firstName, lastName } })
      if (!staff) {
        return NextResponse.json(
          { error: 'Staff not found', success: false },
          { status: 400 }
        )
      }
    } else {
      // Optionally: assign any available staff (for now, just pick the first active)
      staff = await prisma.staff.findFirst({ where: { isActive: true } })
      if (!staff) {
        return NextResponse.json(
          { error: 'No staff available', success: false },
          { status: 400 }
        )
      }
    }
    // 4. Parse date/time
    if (!booking.date || !booking.time) {
      return NextResponse.json(
        { error: 'Date and time are required', success: false },
        { status: 400 }
      )
    }
    const dateObj = new Date(`${booking.date}T${booking.time}:00`)
    // Calculate end time
    const [startHour, startMinute] = booking.time.split(':').map(Number)
    const endMinute = (startMinute + service.duration) % 60
    const endHour = startHour + Math.floor((startMinute + service.duration) / 60)
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
    // 5. Create booking
    const newBooking = await prisma.booking.create({
      data: {
        clientId: client.id,
        staffId: staff.id,
        serviceId: service.id,
        date: dateObj,
        startTime: booking.time,
        endTime,
        duration: service.duration,
        status: 'PENDING',
        notes: booking.message || null,
        totalPrice: service.price,
        paymentStatus: 'UNPAID',
        paymentMethod: null
      }
    })

    // Simulate email/SMS/staff notification
    const enhancedBooking = {
      ...booking,
      bookingId: newBooking.id,
      timestamp: newBooking.createdAt,
      status: 'pending',
      source: 'website',
      salon: {
        name: 'Modern Men Hair Salon',
        phone: '(306) 522-4111',
        address: '#4 - 425 Victoria Ave East, Regina, SK S4N 0N8'
      }
    }
    const emailSent = await sendBookingConfirmation(enhancedBooking)
    const smsSent = await sendBookingSMS(enhancedBooking)
    const staffNotified = await notifyStaff(enhancedBooking)

    return NextResponse.json({
      success: true,
      message: 'Booking request received successfully!',
      bookingId: newBooking.id,
      timestamp: newBooking.createdAt,
      confirmations: {
        email: emailSent,
        sms: smsSent,
        staff: staffNotified
      },
      nextSteps: [
        'We will contact you within 24 hours to confirm your appointment',
        'Check your email for booking confirmation',
        'Call (306) 522-4111 for immediate scheduling'
      ]
    })
  } catch (error) {
    console.error('❌ BOOKING ERROR:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process booking request',
        success: false,
        message: 'Please try again or call us directly at (306) 522-4111'
      },
      { status: 500 }
    )
  }
}

async function sendBookingConfirmation(booking: any): Promise<boolean> {
  // Production implementation would use SendGrid, Resend, or similar
  const emailData = {
    to: booking.email,
    from: 'bookings@modernmen.ca',
    subject: `Booking Confirmation - Modern Men Hair Salon (${booking.bookingId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; color: #d4af37; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">MM MODERN MEN HAIR SALON</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #1a1a1a;">Booking Request Received!</h2>
          <p>Hi ${booking.name},</p>
          <p>Thank you for your booking request. Here are the details:</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #d4af37;">Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Service:</strong> ${booking.service}</p>
            ${booking.staff ? `<p><strong>Preferred Stylist:</strong> ${booking.staff}</p>` : ''}
            ${booking.date ? `<p><strong>Requested Date:</strong> ${booking.date}</p>` : ''}
            ${booking.time ? `<p><strong>Requested Time:</strong> ${booking.time}</p>` : ''}
            <p><strong>Phone:</strong> ${booking.phone}</p>
            ${booking.message ? `<p><strong>Notes:</strong> ${booking.message}</p>` : ''}
          </div>
          
          <div style="background: #1a1a1a; color: white; padding: 15px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #d4af37;">Next Steps</h3>
            <p>• We'll contact you within 24 hours to confirm your appointment</p>
            <p>• For immediate booking, call us at (306) 522-4111</p>
            <p>• Text us at (306) 541-5511</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <p><strong>Modern Men Hair Salon</strong></p>
            <p>#4 - 425 Victoria Ave East<br>Regina, SK S4N 0N8</p>
            <p>Phone: (306) 522-4111 | Email: info@modernmen.ca</p>
          </div>
        </div>
      </div>
    `
  }
  
  console.log('📧 EMAIL CONFIRMATION SENT:', emailData)
  return true // Simulate successful email
}

async function sendBookingSMS(booking: any): Promise<boolean> {
  // Production implementation would use Twilio
  const smsData = {
    to: booking.phone,
    from: '+1306MODERNMEN', // Example number
    message: `Hi ${booking.name}! Your booking request (${booking.bookingId}) for ${booking.service} at Modern Men Hair Salon has been received. We'll contact you within 24 hours to confirm. Call (306) 522-4111 for immediate booking.`
  }
  
  console.log('📱 SMS CONFIRMATION SENT:', smsData)
  return true // Simulate successful SMS
}

async function notifyStaff(booking: any): Promise<boolean> {
  // Production implementation would use Slack webhook, email, or push notifications
  const staffNotification = {
    channel: '#bookings',
    message: `🆕 NEW BOOKING REQUEST
    
**Customer:** ${booking.name}
**Service:** ${booking.service}
**Stylist:** ${booking.staff || 'No preference'}
**Phone:** ${booking.phone}
**Email:** ${booking.email}
**Booking ID:** ${booking.bookingId}
${booking.message ? `**Notes:** ${booking.message}` : ''}

Please contact within 24 hours to confirm appointment.`
  }
  
  console.log('👥 STAFF NOTIFIED:', staffNotification)
  return true // Simulate successful notification
}

export async function PUT(request: NextRequest) {
  try {
    const { bookingId, status, notes, date, time, staff, service } = await request.json()
    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required' }, { status: 400 })
    }
    // Find the booking
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    // Prepare update data
    const updateData: any = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (date && time) {
      updateData.date = new Date(`${date}T${time}:00`)
      updateData.startTime = time
      // Update endTime if service is provided or use existing
      let serviceObj = null
      if (service) {
        serviceObj = await prisma.service.findFirst({ where: { name: service } })
        if (!serviceObj) {
          return NextResponse.json({ error: 'Service not found' }, { status: 400 })
        }
        updateData.serviceId = serviceObj.id
        updateData.duration = serviceObj.duration
        updateData.totalPrice = serviceObj.price
      } else {
        serviceObj = await prisma.service.findUnique({ where: { id: booking.serviceId } })
      }
      const [startHour, startMinute] = time.split(':').map(Number)
      const endMinute = (startMinute + (serviceObj?.duration || booking.duration)) % 60
      const endHour = startHour + Math.floor((startMinute + (serviceObj?.duration || booking.duration)) / 60)
      updateData.endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
    }
    if (staff) {
      const [firstName, ...rest] = staff.split(' ')
      const lastName = rest.join(' ') || ''
      const staffObj = await prisma.staff.findFirst({ where: { firstName, lastName } })
      if (!staffObj) {
        return NextResponse.json({ error: 'Staff not found' }, { status: 400 })
      }
      updateData.staffId = staffObj.id
    }
    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData
    })
    return NextResponse.json({ success: true, booking: updatedBooking })
  } catch (error) {
    console.error('❌ UPDATE BOOKING ERROR:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { bookingId } = await request.json()
    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required' }, { status: 400 })
    }
    // Find the booking
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    // Soft delete: set status to CANCELLED
    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    })
    return NextResponse.json({ success: true, booking: cancelledBooking })
  } catch (error) {
    console.error('❌ DELETE BOOKING ERROR:', error)
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }
}

// GET endpoint for booking status (optional)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get('bookingId')
  
  if (!bookingId) {
    return NextResponse.json(
      { error: 'Booking ID required' },
      { status: 400 }
    )
  }
  
  // In production, this would query the database
  return NextResponse.json({
    bookingId,
    status: 'pending',
    message: 'Your booking is being processed. We will contact you soon!'
  })
}
