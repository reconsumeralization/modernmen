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
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'name'

  // Build where clause
  const where: any = {}

  // Search filter
  if (search) {
    where.or = [
      { name: { contains: search } },
      { description: { contains: search } },
      { category: { contains: search } }
    ]
  }

  // Category filter
  if (category && category !== 'all') {
    where.category = { equals: category }
  }

  try {
    const services = await payload.find({
      collection: 'services',
      where,
      page,
      limit,
      sort
    })

    return createEnhancedSuccessResponse(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    throw APIErrorFactory.internal('Failed to fetch services')
  }
})

export const POST = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['admin', 'manager', 'barber'].includes(session.user.role)) {
    throw APIErrorFactory.forbidden()
  }

  const payload = await getPayloadClient()
  const body = await request.json()

  // Validate required fields
  const { name, price, duration } = body
  if (!name || !price || !duration) {
    throw APIErrorFactory.badRequest('Name, price, and duration are required')
  }

  try {
    const service = await payload.create({
      collection: 'services',
      data: {
        name: body.name,
        description: body.description || '',
        price: parseFloat(body.price),
        duration: parseInt(body.duration),
        category: body.category || ''
      }
    })

    return createEnhancedSuccessResponse(service, 'Service created successfully')
  } catch (error) {
    console.error('Error creating service:', error)
    throw APIErrorFactory.internal('Failed to create service')
  }
})
