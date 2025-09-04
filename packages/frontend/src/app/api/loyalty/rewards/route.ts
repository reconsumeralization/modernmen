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

  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const category = searchParams.get('category')
  const type = searchParams.get('type')
  const isActive = searchParams.get('isActive')

  const where: any = {}

  if (category && category !== 'all') {
    where.category = { equals: category }
  }

  if (type && type !== 'all') {
    where.type = { equals: type }
  }

  if (isActive !== null) {
    where.isActive = isActive === 'true'
  }

  try {
    const rewards = await payload.find({
      collection: 'loyaltyRewards',
      where,
      sort: '-createdAt',
      page,
      limit,
      depth: 2
    })

    return createEnhancedSuccessResponse({
      rewards: rewards.docs,
      totalDocs: rewards.totalDocs,
      totalPages: rewards.totalPages,
      page: rewards.page,
      hasNextPage: rewards.hasNextPage,
      hasPrevPage: rewards.hasPrevPage
    })
  } catch (error) {
    console.error('Error fetching loyalty rewards:', error)
    throw APIErrorFactory.internalError('Failed to fetch loyalty rewards')
  }
})

export const POST = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const user = session.user
  if (!['admin', 'manager'].includes(user.role || '')) {
    throw APIErrorFactory.forbidden('Only administrators can create loyalty rewards')
  }

  const payload = await getPayloadClient()
  const body = await request.json()

  if (!body.name || !body.type || !body.pointsRequired) {
    throw APIErrorFactory.validationFailed([
      { field: 'name', message: 'Reward name is required' },
      { field: 'type', message: 'Reward type is required' },
      { field: 'pointsRequired', message: 'Points required is required' }
    ])
  }

  try {
    const reward = await payload.create({
      collection: 'loyaltyRewards',
      data: {
        ...body,
        redemptionsUsed: 0,
        isActive: body.isActive !== false,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      depth: 1
    })

    return createEnhancedSuccessResponse(
      { reward },
      'Loyalty reward created successfully',
      201
    )
  } catch (error) {
    console.error('Error creating loyalty reward:', error)
    throw APIErrorFactory.internalError('Failed to create loyalty reward')
  }
})