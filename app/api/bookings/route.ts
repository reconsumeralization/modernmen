import { NextRequest, NextResponse } from 'next/server'

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

    // Generate booking ID and timestamp
    const bookingId = 'MM' + Date.now().toString(36).toUpperCase()
    const timestamp = new Date().toISOString()
    
    // Enhanced booking object
    const enhancedBooking = {
      ...booking,
      bookingId,
      timestamp,
      status: 'pending',
      source: 'website',
      salon: {
        name: 'Modern Men Hair Salon',
        phone: '(306) 522-4111',
        address: '#4 - 425 Victoria Ave East, Regina, SK S4N 0N8'
      }
    }

    // In production, this would:
    // 1. Save to database (PostgreSQL, MongoDB, etc.)
    // 2. Send confirmation email via SendGrid/Resend
    // 3. Send SMS confirmation via Twilio
    // 4. Create calendar event
    // 5. Notify staff via Slack/email
    
    console.log('📅 NEW BOOKING RECEIVED:', enhancedBooking)
    
    // Simulate email sending
    const emailSent = await sendBookingConfirmation(enhancedBooking)
    
    // Simulate SMS sending  
    const smsSent = await sendBookingSMS(enhancedBooking)
    
    // Simulate staff notification
    const staffNotified = await notifyStaff(enhancedBooking)

    return NextResponse.json({
      success: true,
      message: 'Booking request received successfully!',
      bookingId,
      timestamp,
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
