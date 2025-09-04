import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { withEnhancedErrorHandler, createEnhancedSuccessResponse, APIErrorFactory } from '@/lib/enhanced-api-errors'

export const POST = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const body = await request.json()

  // Only allow staff and admins to manage loyalty points
  const user = session.user
  if (!['admin', 'manager', 'staff'].includes(user.role || '')) {
    throw APIErrorFactory.forbidden('Access denied to loyalty point management')
  }

  if (!body.customerId || !body.points || !body.reason) {
    throw APIErrorFactory.validationFailed([
      { field: 'customerId', message: 'Customer ID is required' },
      { field: 'points', message: 'Points amount is required' },
      { field: 'reason', message: 'Reason is required' }
    ])
  }

  try {
    // Get customer
    const customer = await payload.findByID({
      collection: 'customers',
      id: body.customerId
    })

    if (!customer) {
      throw APIErrorFactory.notFound('Customer', body.customerId)
    }

    // Validate points
    const pointsChange = parseInt(body.points)
    if (isNaN(pointsChange)) {
      throw APIErrorFactory.validationFailed([
        { field: 'points', message: 'Points must be a valid number' }
      ])
    }

    // Calculate new points balance
    const currentPoints = customer.loyaltyPoints || 0
    const newPointsBalance = Math.max(0, currentPoints + pointsChange)

    // Update customer points
    const updatedCustomer = await payload.update({
      collection: 'customers',
      id: body.customerId,
      data: { loyaltyPoints: newPointsBalance },
      depth: 1
    })

    // Create loyalty transaction record
    const transaction = await payload.create({
      collection: 'loyalty-rewards',
      data: {
        customer: body.customerId,
        type: pointsChange > 0 ? 'earned' : 'redeemed',
        points: Math.abs(pointsChange),
        reason: body.reason,
        description: body.description || `${pointsChange > 0 ? 'Earned' : 'Redeemed'} ${Math.abs(pointsChange)} loyalty points`,
        balanceAfter: newPointsBalance,
        processedBy: user.id
      },
      depth: 1
    })

    return createEnhancedSuccessResponse(
      {
        customer: updatedCustomer,
        transaction,
        pointsChange,
        newBalance: newPointsBalance
      },
      `Loyalty points ${pointsChange > 0 ? 'added' : 'deducted'} successfully`
    )
  } catch (error) {
    console.error('Error managing loyalty points:', error)
    throw APIErrorFactory.internalError('Failed to manage loyalty points')
  }
})

export const GET = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const { searchParams } = new URL(request.url)

  const customerId = searchParams.get('customerId')
  const type = searchParams.get('type')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))

  // Build where clause
  const where: any = {}

  if (customerId) {
    where.customer = { equals: customerId }
  }

  if (type) {
    where.type = { equals: type }
  }

  // Date range filter
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) {
      where.createdAt.greater_than_equal = new Date(startDate)
    }
    if (endDate) {
      where.createdAt.less_than_equal = new Date(endDate)
    }
  }

  // Access control
  const user = session.user
  if (user.role === 'customer') {
    where.customer = { equals: user.id }
  }

  try {
    const transactions = await payload.find({
      collection: 'loyalty-rewards',
      where,
      sort: '-createdAt',
      page,
      limit,
      depth: 1
    })

    return createEnhancedSuccessResponse({
      transactions: transactions.docs,
      totalDocs: transactions.totalDocs,
      totalPages: transactions.totalPages,
      page: transactions.page,
      hasNextPage: transactions.hasNextPage,
      hasPrevPage: transactions.hasPrevPage
    })
  } catch (error) {
    console.error('Error fetching loyalty transactions:', error)
    throw APIErrorFactory.internalError('Failed to fetch loyalty transactions')
  }
})
