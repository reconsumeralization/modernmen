import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { sendAppointmentNotification } from '@/lib/emailService'
import { sendAppointmentReminder } from '@/lib/smsService'
import { notificationService } from '@/lib/notificationService'

export async function POST(request: NextRequest) {
  try {
    const { appointmentId, reminderType = 'email', hoursBefore = 24 } = await request.json()

    const payload = await getPayloadClient()

    // Get appointment details
    const appointment = await payload.findByID({
      collection: 'appointments',
      id: appointmentId
    })

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Get customer details
    const customer = await payload.findByID({
      collection: 'customers',
      id: appointment.customer
    })

    // Get stylist details
    const stylist = await payload.findByID({
      collection: 'stylists',
      id: appointment.stylist
    })

    // Get service details
    const service = appointment.service ? await payload.findByID({
      collection: 'services',
      id: appointment.service
    }) : null

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    const appointmentDetails = {
      service: service?.name || 'Service',
      date: new Date(appointment.date).toLocaleDateString(),
      time: appointment.time || 'TBD',
      duration: service?.duration || 60,
      price: appointment.price || service?.price || 0
    }

    const reminderMessage = hoursBefore === 24
      ? `This is a reminder about your appointment tomorrow at ${appointmentDetails.time}.`
      : `This is a reminder about your appointment in ${hoursBefore} hours.`

    // Send email reminder
    if ((reminderType === 'email' || reminderType === 'both') && customer.email) {
      try {
        await sendAppointmentNotification(
          customer.email,
          `${customer.firstName} ${customer.lastName}`,
          stylist ? `${stylist.firstName} ${stylist.lastName}` : 'Our Team',
          {
            ...appointmentDetails,
            service: `${appointmentDetails.service} - ${reminderMessage}`
          }
        )
      } catch (emailError) {
        console.error('Email reminder failed:', emailError)
      }
    }

    // Send SMS reminder
    if ((reminderType === 'sms' || reminderType === 'both') && customer.phone) {
      try {
        await sendAppointmentReminder(
          customer.phone,
          `${customer.firstName} ${customer.lastName}`,
          stylist ? `${stylist.firstName} ${stylist.lastName}` : 'Our Team',
          appointmentDetails.date,
          appointmentDetails.time
        )
      } catch (smsError) {
        console.error('SMS reminder failed:', smsError)
      }
    }

    // Send in-app notification
    await notificationService.sendToUser({
      userId: customer.id,
      type: 'appointment_reminder',
      title: `Appointment Reminder${hoursBefore === 24 ? ' - Tomorrow' : ` - ${hoursBefore} hours`}`,
      message: `Don't forget your ${appointmentDetails.service} appointment on ${appointmentDetails.date} at ${appointmentDetails.time}.`,
      data: {
        appointmentId,
        service: appointmentDetails.service,
        date: appointmentDetails.date,
        time: appointmentDetails.time,
        hoursBefore
      },
      priority: 'high'
    })

    return NextResponse.json({
      success: true,
      message: 'Appointment reminder sent successfully',
      sent: {
        email: (reminderType === 'email' || reminderType === 'both') && !!customer.email,
        sms: (reminderType === 'sms' || reminderType === 'both') && !!customer.phone
      }
    })

  } catch (error) {
    console.error('Appointment reminder error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send appointment reminder' },
      { status: 500 }
    )
  }
}

// GET endpoint to get upcoming appointments that need reminders
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const hoursFromNow = parseInt(url.searchParams.get('hoursFromNow') || '24')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const payload = await getPayloadClient()

    // Calculate target time
    const targetTime = new Date()
    targetTime.setHours(targetTime.getHours() + hoursFromNow)

    // Get appointments within the time window (allow 30 minute buffer)
    const startTime = new Date(targetTime.getTime() - 30 * 60 * 1000) // 30 minutes before
    const endTime = new Date(targetTime.getTime() + 30 * 60 * 1000) // 30 minutes after

    const appointments = await payload.find({
      collection: 'appointments',
      where: {
        and: [
          { status: { not_equals: 'cancelled' } },
          { date: { greater_than_equal: startTime.toISOString().split('T')[0] } },
          { date: { less_than_equal: endTime.toISOString().split('T')[0] } }
        ]
      },
      limit,
      sort: 'date'
    })

    // Filter by exact time match and get customer details
    const appointmentsWithCustomers = await Promise.all(
      appointments.docs.map(async (appointment: any) => {
        const customer = await payload.findByID({
          collection: 'customers',
          id: appointment.customer
        })

        const appointmentDateTime = new Date(`${appointment.date}T${appointment.time || '00:00'}:00`)
        const timeDiff = Math.abs(appointmentDateTime.getTime() - targetTime.getTime())
        const hoursDiff = timeDiff / (1000 * 60 * 60)

        return {
          ...appointment,
          customer,
          hoursUntilAppointment: hoursDiff,
          needsReminder: hoursDiff <= hoursFromNow + 0.5 // Within 30 minutes of target
        }
      })
    )

    const appointmentsNeedingReminders = appointmentsWithCustomers.filter(apt => apt.needsReminder)

    return NextResponse.json({
      success: true,
      appointments: appointmentsNeedingReminders,
      total: appointmentsNeedingReminders.length,
      targetTime: targetTime.toISOString(),
      hoursFromNow
    })

  } catch (error) {
    console.error('Get appointments for reminders error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments for reminders' },
      { status: 500 }
    )
  }
}
