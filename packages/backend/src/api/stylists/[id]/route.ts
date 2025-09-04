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
    const stylist = await payload.findByID({
      collection: 'stylists',
      id,
      populate: ['profileImage']
    })

    if (!stylist) {
      throw APIErrorFactory.notFound('Stylist not found')
    }

    return createEnhancedSuccessResponse(stylist)
  } catch (error) {
    console.error('Error fetching stylist:', error)
    throw APIErrorFactory.internal('Failed to fetch stylist')
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
    const stylist = await payload.update({
      collection: 'stylists',
      id,
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.rating !== undefined && { rating: parseFloat(body.rating) }),
        ...(body.reviewCount !== undefined && { reviewCount: parseInt(body.reviewCount) }),
        ...(body.experience !== undefined && { experience: parseInt(body.experience) }),
        ...(body.specialties !== undefined && { specialties: body.specialties })
      }
    })

    return createEnhancedSuccessResponse(stylist, 'Stylist updated successfully')
  } catch (error) {
    console.error('Error updating stylist:', error)
    throw APIErrorFactory.internal('Failed to update stylist')
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
      collection: 'stylists',
      id
    })

    return createEnhancedSuccessResponse({ id }, 'Stylist deleted successfully')
  } catch (error) {
    console.error('Error deleting stylist:', error)
    throw APIErrorFactory.internal('Failed to delete stylist')
  }
})
