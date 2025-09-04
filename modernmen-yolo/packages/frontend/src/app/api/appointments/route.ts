import { NextRequest, NextResponse } from 'next/server'
import { appointmentsService } from '@/services/appointments'
import { smsService } from '@/services/smsService'
import { Appointment } from '@/types'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any
    const barber = searchParams.get('barber') || undefined
    const date = searchParams.get('date') || undefined
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    const result = await appointmentsService.getAppointments(
      { status, barber, date },
      { page, limit }
    )

    if (result.success) {
      return NextResponse.json(result, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('API Error - GET /api/appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.customer_id || !body.service_id || !body.staff_id || !body.appointment_date) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_id, service_id, staff_id, appointment_date' },
        { status: 400 }
      )
    }

    const appointmentData = {
      customer_id: body.customer_id,
      service_id: body.service_id,
      staff_id: body.staff_id,
      appointment_date: body.appointment_date,
      start_time: body.start_time,
      duration: body.duration,
      price: body.price,
      notes: body.notes,
      customer_notes: body.customer_notes
    }

    const result = await appointmentsService.createAppointment(appointmentData)

    if (result.success) {
      // Send SMS confirmation if phone number is provided
      if (body.customer_phone && smsService.isConfigured()) {
        try {
          const smsData = {
            id: result.data.id,
            customerName: body.customer_name || 'Valued Customer',
            serviceName: body.service_name || 'Hair Service',
            barberName: body.staff_name || 'Your Stylist',
            date: new Date(body.appointment_date).toLocaleDateString(),
            time: body.start_time || 'TBD',
            duration: body.duration || 60,
            price: body.price || 0,
            salonName: 'Modern Men Hair Salon',
            salonPhone: '+15551234567'
          }

          // Send SMS confirmation asynchronously (don't block response)
          smsService.sendAppointmentConfirmation(body.customer_phone, smsData)
            .then(() => {
              // SMS sent successfully - could add metrics tracking here
            })
            .catch((error) => {
              // SMS failure - log but don't throw to avoid breaking appointment creation
              console.error('SMS confirmation failed:', error)
            })

        } catch (error) {
          console.error('SMS setup error:', error)
          // Don't fail the appointment creation if SMS fails
        }
      }

      return NextResponse.json(result.data, { status: 201 })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error('API Error - POST /api/appointments:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}