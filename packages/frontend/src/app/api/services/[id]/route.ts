import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { withEnhancedErrorHandler, createEnhancedSuccessResponse, APIErrorFactory } from '@/lib/enhanced-api-errors'

interface RouteParams {
  params: {
    id: string
  }
}

export const GET = withEnhancedErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const { id } = params

  try {
    const service = await payload.findByID({
      collection: 'services',
      id
    })

    if (!service) {
      throw APIErrorFactory.notFound('Service not found')
    }

    return createEnhancedSuccessResponse(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    throw APIErrorFactory.internal('Failed to fetch service')
  }
})

export const PUT = withEnhancedErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['admin', 'manager'].includes(session.user.role)) {
    throw APIErrorFactory.forbidden()
  }

  const payload = await getPayloadClient()
  const { id } = params
  const body = await request.json()

  try {
    const service = await payload.update({
      collection: 'services',
      id,
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price && { price: parseFloat(body.price) }),
        ...(body.duration && { duration: parseInt(body.duration) }),
        ...(body.category !== undefined && { category: body.category })
      }
    })

    return createEnhancedSuccessResponse(service, 'Service updated successfully')
  } catch (error) {
    console.error('Error updating service:', error)
    throw APIErrorFactory.internal('Failed to update service')
  }
})

export const DELETE = withEnhancedErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['admin'].includes(session.user.role)) {
    throw APIErrorFactory.forbidden()
  }

  const payload = await getPayloadClient()
  const { id } = params

  try {
    await payload.delete({
      collection: 'services',
      id
    })

    return createEnhancedSuccessResponse({ id }, 'Service deleted successfully')
  } catch (error) {
    console.error('Error deleting service:', error)
    throw APIErrorFactory.internal('Failed to delete service')
  }
})
