import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { withEnhancedErrorHandler, createEnhancedSuccessResponse, APIErrorFactory } from '@/lib/enhanced-api-errors'

export const GET = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const { searchParams } = new URL(request.url)

  // Parse query parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const status = searchParams.get('status')
  const stylist = searchParams.get('stylist')
  const customer = searchParams.get('customer')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const sort = searchParams.get('sort') || '-dateTime'

  // Build where clause
  const where: any = {}

  // Status filter
  if (status && status !== 'all') {
    if (status === 'upcoming') {
      where.dateTime = { greater_than: new Date() }
      where.status = { in: ['confirmed', 'pending'] }
    } else if (status === 'past') {
      where.dateTime = { less_than: new Date() }
    } else {
      where.status = { equals: status }
    }
  }

  // Stylist filter
  if (stylist) {
    where.stylist = { equals: stylist }
  }

  // Customer filter
  if (customer) {
    where.customer = { equals: customer }
  }

  // Date range filter
  if (startDate || endDate) {
    where.dateTime = {}
    if (startDate) {
      where.dateTime.greater_than_equal = new Date(startDate)
    }
    if (endDate) {
      where.dateTime.less_than_equal = new Date(endDate)
    }
  }

  // Access control based on user role
  const user = session.user
  if (user.role === 'customer') {
    // Customers can only see their own appointments
    where.customer = { equals: user.id }
  } else if (user.role === 'stylist') {
    // Stylists can only see their assigned appointments
    where.stylist = { equals: user.id }
  }

  try {
    const appointments = await payload.find({
      collection: 'appointments',
      where,
      sort,
      page,
      limit,
      depth: 2 // Include customer and stylist data
    })

    // Calculate summary statistics
    const totalRevenue = appointments.docs.reduce((sum, apt) => sum + (apt.pricing?.total || 0), 0)
    const statusBreakdown = {
      confirmed: appointments.docs.filter(apt => apt.status === 'confirmed').length,
      pending: appointments.docs.filter(apt => apt.status === 'pending').length,
      completed: appointments.docs.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.docs.filter(apt => apt.status === 'cancelled').length,
      'no-show': appointments.docs.filter(apt => apt.status === 'no-show').length
    }

    return createEnhancedSuccessResponse({
      appointments: appointments.docs,
      totalDocs: appointments.totalDocs,
      totalPages: appointments.totalPages,
      page: appointments.page,
      hasNextPage: appointments.hasNextPage,
      hasPrevPage: appointments.hasPrevPage,
      summary: {
        totalRevenue,
        averageRevenue: appointments.docs.length > 0 ? totalRevenue / appointments.docs.length : 0,
        statusBreakdown,
        upcomingCount: appointments.docs.filter(apt =>
          new Date(apt.dateTime) > new Date() &&
          ['confirmed', 'pending'].includes(apt.status)
        ).length
      }
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    throw APIErrorFactory.internalError('Failed to fetch appointments')
  }
})

export const POST = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const body = await request.json()

  // Basic validation
  if (!body.customer || !body.stylist || !body.services || !body.dateTime) {
    const missing = []
    if (!body.customer) missing.push('customer')
    if (!body.stylist) missing.push('stylist')
    if (!body.services) missing.push('services')
    if (!body.dateTime) missing.push('dateTime')

    throw APIErrorFactory.validationFailed(
      missing.map(field => ({ field, message: `${field} is required` }))
    )
  }

  // Validate date is in the future
  const appointmentDate = new Date(body.dateTime)
  if (appointmentDate <= new Date()) {
    throw APIErrorFactory.validationFailed([
      { field: 'dateTime', message: 'Appointment must be scheduled for a future date and time' }
    ])
  }

  try {
    // Check for scheduling conflicts
    const stylist = await payload.findByID({
      collection: 'stylists',
      id: body.stylist
    })

    if (!stylist) {
      throw APIErrorFactory.notFound('Stylist', body.stylist)
    }

    // Create the appointment (Payload hooks will handle conflict checking and calculations)
    const appointment = await payload.create({
      collection: 'appointments',
      data: {
        ...body,
        status: body.status || 'pending',
        source: 'online'
      },
      depth: 2
    })

    return createEnhancedSuccessResponse(
      { appointment },
      'Appointment created successfully',
      201
    )
  } catch (error: any) {
    // Handle specific Payload errors
    if (error.message?.includes('not available')) {
      throw APIErrorFactory.businessRuleViolation('Stylist is not available at this time')
    }
    if (error.message?.includes('not found')) {
      throw APIErrorFactory.notFound('Required resource not found')
    }

    console.error('Error creating appointment:', error)
    throw APIErrorFactory.internalError('Failed to create appointment')
  }
})
