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

  if (!body.rewardId) {
    throw APIErrorFactory.validationFailed([
      { field: 'rewardId', message: 'Reward ID is required' }
    ])
  }

  try {
    const user = session.user

    // Get customer data
    const customer = await payload.findByID({
      collection: 'customers',
      id: user.id
    })

    if (!customer) {
      throw APIErrorFactory.notFound('Customer', user.id)
    }

    // Get reward data
    const reward = await payload.findByID({
      collection: 'loyaltyRewards',
      id: body.rewardId
    })

    if (!reward) {
      throw APIErrorFactory.notFound('Loyalty reward', body.rewardId)
    }

    // Validate reward availability
    if (!reward.isActive) {
      throw APIErrorFactory.businessRuleViolation('This reward is not currently available')
    }

    // Check date validity
    const now = new Date()
    if (reward.startDate && new Date(reward.startDate) > now) {
      throw APIErrorFactory.businessRuleViolation('This reward is not yet available')
    }

    if (reward.endDate && new Date(reward.endDate) < now) {
      throw APIErrorFactory.businessRuleViolation('This reward has expired')
    }

    // Check customer's points
    const customerPoints = customer.loyaltyPoints || 0
    if (customerPoints < reward.pointsRequired) {
      throw APIErrorFactory.businessRuleViolation(
        `Insufficient points. You have ${customerPoints} points but need ${reward.pointsRequired} points.`
      )
    }

    // Check redemption limits
    if (reward.maxRedemptions > 0 && reward.redemptionsUsed >= reward.maxRedemptions) {
      throw APIErrorFactory.businessRuleViolation('This reward has reached its maximum redemption limit')
    }

    // Calculate new points balance
    const newPointsBalance = customerPoints - reward.pointsRequired

    // Update customer points
    const updatedCustomer = await payload.update({
      collection: 'customers',
      id: user.id,
      data: { loyaltyPoints: newPointsBalance },
      depth: 1
    })

    // Update reward redemptions
    const updatedReward = await payload.update({
      collection: 'loyaltyRewards',
      id: body.rewardId,
      data: { redemptionsUsed: (reward.redemptionsUsed || 0) + 1 },
      depth: 1
    })

    // Create redemption record
    const redemption = await payload.create({
      collection: 'loyaltyRedemptions',
      data: {
        customer: user.id,
        reward: body.rewardId,
        pointsUsed: reward.pointsRequired,
        pointsBalanceAfter: newPointsBalance,
        redeemedAt: new Date().toISOString(),
        status: 'pending' // Could be 'pending', 'approved', 'completed', 'cancelled'
      },
      depth: 1
    })

    return createEnhancedSuccessResponse(
      {
        redemption,
        customer: updatedCustomer,
        reward: updatedReward,
        pointsUsed: reward.pointsRequired,
        newBalance: newPointsBalance
      },
      'Loyalty reward redeemed successfully'
    )
  } catch (error) {
    console.error('Error redeeming loyalty reward:', error)
    throw APIErrorFactory.internalError('Failed to redeem loyalty reward')
  }
})

// Get customer's redemption history
export const GET = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const { searchParams } = new URL(request.url)

  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))

  try {
    const redemptions = await payload.find({
      collection: 'loyaltyRedemptions',
      where: { customer: { equals: session.user.id } },
      sort: '-redeemedAt',
      page,
      limit,
      depth: 2 // Include reward details
    })

    return createEnhancedSuccessResponse({
      redemptions: redemptions.docs,
      totalDocs: redemptions.totalDocs,
      totalPages: redemptions.totalPages,
      page: redemptions.page,
      hasNextPage: redemptions.hasNextPage,
      hasPrevPage: redemptions.hasPrevPage
    })
  } catch (error) {
    console.error('Error fetching redemption history:', error)
    throw APIErrorFactory.internalError('Failed to fetch redemption history')
  }
})
