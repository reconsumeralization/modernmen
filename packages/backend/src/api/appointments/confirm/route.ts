import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { sendAppointmentNotification } from '@/lib/emailService'
import { sendAppointmentConfirmation } from '@/lib/smsService'
import { notificationService } from '@/lib/notificationService'

export async function POST(request: NextRequest) {
  try {
    const { appointmentId, sendEmail = true, sendSMS = false } = await request.json()

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

    // Send email confirmation
    if (sendEmail && customer.email) {
      try {
        await sendAppointmentNotification(
          customer.email,
          `${customer.firstName} ${customer.lastName}`,
          stylist ? `${stylist.firstName} ${stylist.lastName}` : 'Our Team',
          appointmentDetails
        )
      } catch (emailError) {
        console.error('Email confirmation failed:', emailError)
      }
    }

    // Send SMS confirmation
    if (sendSMS && customer.phone) {
      try {
        await sendAppointmentConfirmation(
          customer.phone,
          `${customer.firstName} ${customer.lastName}`,
          stylist ? `${stylist.firstName} ${stylist.lastName}` : 'Our Team',
          appointmentDetails.date,
          appointmentDetails.time
        )
      } catch (smsError) {
        console.error('SMS confirmation failed:', smsError)
      }
    }

    // Send in-app notification
    await notificationService.sendToUser({
      userId: customer.id,
      type: 'appointment_confirmed',
      title: 'Appointment Confirmed',
      message: `Your appointment for ${appointmentDetails.service} on ${appointmentDetails.date} at ${appointmentDetails.time} has been confirmed.`,
      data: {
        appointmentId,
        service: appointmentDetails.service,
        date: appointmentDetails.date,
        time: appointmentDetails.time
      },
      priority: 'medium'
    })

    // Update appointment status if needed
    if (appointment.status !== 'confirmed') {
      await payload.update({
        collection: 'appointments',
        id: appointmentId,
        data: { status: 'confirmed' }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment confirmation sent successfully',
      sent: {
        email: sendEmail && !!customer.email,
        sms: sendSMS && !!customer.phone
      }
    })

  } catch (error) {
    console.error('Appointment confirmation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send appointment confirmation' },
      { status: 500 }
    )
  }
}
