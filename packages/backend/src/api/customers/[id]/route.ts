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
  const customerId = params.id

  try {
    const customer = await payload.findByID({
      collection: 'customers',
      id: customerId,
      depth: 2 // Include related data
    })

    if (!customer) {
      throw APIErrorFactory.notFound('Customer', customerId)
    }

    // Access control
    const user = session.user
    if (user.role === 'customer' && customer.id !== user.id) {
      throw APIErrorFactory.forbidden('You can only view your own customer data')
    }

    // Get related appointments
    const appointments = await payload.find({
      collection: 'appointments',
      where: { customer: { equals: customerId } },
      sort: '-dateTime',
      limit: 10,
      depth: 1
    })

    // Get loyalty rewards history
    const loyaltyRewards = await payload.find({
      collection: 'loyalty-rewards',
      where: { customer: { equals: customerId } },
      sort: '-createdAt',
      limit: 20,
      depth: 1
    })

    return createEnhancedSuccessResponse({
      customer: {
        ...customer,
        appointments: appointments.docs,
        loyaltyRewards: loyaltyRewards.docs,
        nextAppointment: appointments.docs.find(apt =>
          new Date(apt.dateTime) > new Date() &&
          ['confirmed', 'pending'].includes(apt.status)
        )
      }
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw APIErrorFactory.notFound('Customer', customerId)
    }
    console.error('Error fetching customer:', error)
    throw APIErrorFactory.internalError('Failed to fetch customer')
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
  const customerId = params.id
  const body = await request.json()

  try {
    // Check if customer exists
    const existingCustomer = await payload.findByID({
      collection: 'customers',
      id: customerId
    })

    if (!existingCustomer) {
      throw APIErrorFactory.notFound('Customer', customerId)
    }

    // Access control
    const user = session.user
    if (user.role === 'customer' && existingCustomer.id !== user.id) {
      throw APIErrorFactory.forbidden('You can only update your own customer data')
    }

    // If email is being updated, check for conflicts
    if (body.email && body.email !== existingCustomer.email) {
      const emailConflict = await payload.find({
        collection: 'customers',
        where: {
          email: { equals: body.email },
          id: { not_equals: customerId }
        }
      })

      if (emailConflict.docs.length > 0) {
        throw APIErrorFactory.alreadyExists('Customer', body.email)
      }
    }

    const updatedCustomer = await payload.update({
      collection: 'customers',
      id: customerId,
      data: body,
      depth: 1
    })

    return createEnhancedSuccessResponse(
      { customer: updatedCustomer },
      'Customer updated successfully'
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw APIErrorFactory.notFound('Customer', customerId)
    }
    console.error('Error updating customer:', error)
    throw APIErrorFactory.internalError('Failed to update customer')
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
  const customerId = params.id

  // Access control - only admins can delete customers
  const user = session.user
  if (!['admin', 'manager'].includes(user.role || '')) {
    throw APIErrorFactory.forbidden('Only administrators can delete customers')
  }

  try {
    // Check if customer exists
    const existingCustomer = await payload.findByID({
      collection: 'customers',
      id: customerId
    })

    if (!existingCustomer) {
      throw APIErrorFactory.notFound('Customer', customerId)
    }

    // Soft delete by setting isActive to false instead of actual deletion
    const deletedCustomer = await payload.update({
      collection: 'customers',
      id: customerId,
      data: { isActive: false },
      depth: 1
    })

    return createEnhancedSuccessResponse(
      { customer: deletedCustomer },
      'Customer deactivated successfully'
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw APIErrorFactory.notFound('Customer', customerId)
    }
    console.error('Error deleting customer:', error)
    throw APIErrorFactory.internalError('Failed to delete customer')
  }
})
