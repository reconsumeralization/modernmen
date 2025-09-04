import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { withEnhancedErrorHandler, createEnhancedSuccessResponse, APIErrorFactory } from '@/lib/enhanced-api-errors'

interface RouteParams {
  params: { id: string }
}

export const GET = withEnhancedErrorHandler(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const appointmentId = params.id

  try {
    const appointment = await payload.findByID({
      collection: 'appointments',
      id: appointmentId,
      depth: 3 // Include all related data
    })

    if (!appointment) {
      throw APIErrorFactory.notFound('Appointment', appointmentId)
    }

    // Access control
    const user = session.user
    if (user.role === 'customer' && appointment.customer?.id !== user.id) {
      throw APIErrorFactory.forbidden('You can only view your own appointments')
    }
    if (user.role === 'stylist' && appointment.stylist?.id !== user.id) {
      throw APIErrorFactory.forbidden('You can only view your assigned appointments')
    }

    // Get related services details
    if (appointment.services && Array.isArray(appointment.services)) {
      const services = await payload.find({
        collection: 'services',
        where: { id: { in: appointment.services.map(s => typeof s === 'string' ? s : s.id) } },
        depth: 1
      })
      appointment.services = services.docs
    }

    return createEnhancedSuccessResponse({ appointment })
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw APIErrorFactory.notFound('Appointment', appointmentId)
    }
    console.error('Error fetching appointment:', error)
    throw APIErrorFactory.internalError('Failed to fetch appointment')
  }
})

export const PUT = withEnhancedErrorHandler(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const appointmentId = params.id
  const body = await request.json()

  try {
    // Check if appointment exists
    const existingAppointment = await payload.findByID({
      collection: 'appointments',
      id: appointmentId
    })

    if (!existingAppointment) {
      throw APIErrorFactory.notFound('Appointment', appointmentId)
    }

    // Access control
    const user = session.user
    if (user.role === 'customer' && existingAppointment.customer?.id !== user.id) {
      throw APIErrorFactory.forbidden('You can only update your own appointments')
    }
    if (user.role === 'stylist' && existingAppointment.stylist?.id !== user.id) {
      throw APIErrorFactory.forbidden('You can only update your assigned appointments')
    }

    // Prevent updates to completed/cancelled appointments (except by admins)
    if (!['admin', 'manager'].includes(user.role || '') &&
        ['completed', 'cancelled', 'no-show'].includes(existingAppointment.status)) {
      throw APIErrorFactory.businessRuleViolation('Cannot update completed or cancelled appointments')
    }

    // Validate date changes
    if (body.dateTime) {
      const newDate = new Date(body.dateTime)
      if (newDate <= new Date() && existingAppointment.status !== 'completed') {
        throw APIErrorFactory.validationFailed([
          { field: 'dateTime', message: 'Cannot schedule appointments in the past' }
        ])
      }
    }

    const updatedAppointment = await payload.update({
      collection: 'appointments',
      id: appointmentId,
      data: body,
      depth: 2
    })

    return createEnhancedSuccessResponse(
      { appointment: updatedAppointment },
      'Appointment updated successfully'
    )
  } catch (error: any) {
    if (error.message?.includes('not available')) {
      throw APIErrorFactory.businessRuleViolation('Time slot is no longer available')
    }
    if (error.message?.includes('not found')) {
      throw APIErrorFactory.notFound('Appointment', appointmentId)
    }
    console.error('Error updating appointment:', error)
    throw APIErrorFactory.internalError('Failed to update appointment')
  }
})

export const DELETE = withEnhancedErrorHandler(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const appointmentId = params.id

  try {
    // Check if appointment exists
    const existingAppointment = await payload.findByID({
      collection: 'appointments',
      id: appointmentId
    })

    if (!existingAppointment) {
      throw APIErrorFactory.notFound('Appointment', appointmentId)
    }

    // Access control
    const user = session.user
    if (user.role === 'customer' && existingAppointment.customer?.id !== user.id) {
      throw APIErrorFactory.forbidden('You can only cancel your own appointments')
    }
    if (user.role === 'stylist' && existingAppointment.stylist?.id !== user.id) {
      throw APIErrorFactory.forbidden('You can only cancel your assigned appointments')
    }

    // Only allow cancellation, not deletion
    if (existingAppointment.status === 'completed') {
      throw APIErrorFactory.businessRuleViolation('Cannot cancel completed appointments')
    }

    const cancelledAppointment = await payload.update({
      collection: 'appointments',
      id: appointmentId,
      data: { status: 'cancelled' },
      depth: 1
    })

    return createEnhancedSuccessResponse(
      { appointment: cancelledAppointment },
      'Appointment cancelled successfully'
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw APIErrorFactory.notFound('Appointment', appointmentId)
    }
    console.error('Error cancelling appointment:', error)
    throw APIErrorFactory.internalError('Failed to cancel appointment')
  }
})
