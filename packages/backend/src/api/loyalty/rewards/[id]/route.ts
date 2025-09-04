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
  const rewardId = params.id

  try {
    const reward = await payload.findByID({
      collection: 'loyaltyRewards',
      id: rewardId,
      depth: 2
    })

    if (!reward) {
      throw APIErrorFactory.notFound('Loyalty reward', rewardId)
    }

    return createEnhancedSuccessResponse({ reward })
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw APIErrorFactory.notFound('Loyalty reward', rewardId)
    }
    console.error('Error fetching loyalty reward:', error)
    throw APIErrorFactory.internalError('Failed to fetch loyalty reward')
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

  const user = session.user
  if (!['admin', 'manager'].includes(user.role || '')) {
    throw APIErrorFactory.forbidden('Only administrators can update loyalty rewards')
  }

  const payload = await getPayloadClient()
  const rewardId = params.id
  const body = await request.json()

  try {
    const existingReward = await payload.findByID({
      collection: 'loyaltyRewards',
      id: rewardId
    })

    if (!existingReward) {
      throw APIErrorFactory.notFound('Loyalty reward', rewardId)
    }

    const updatedReward = await payload.update({
      collection: 'loyaltyRewards',
      id: rewardId,
      data: {
        ...body,
        lastUpdated: new Date().toISOString()
      },
      depth: 1
    })

    return createEnhancedSuccessResponse(
      { reward: updatedReward },
      'Loyalty reward updated successfully'
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw APIErrorFactory.notFound('Loyalty reward', rewardId)
    }
    console.error('Error updating loyalty reward:', error)
    throw APIErrorFactory.internalError('Failed to update loyalty reward')
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

  const user = session.user
  if (user.role !== 'admin') {
    throw APIErrorFactory.forbidden('Only administrators can delete loyalty rewards')
  }

  const payload = await getPayloadClient()
  const rewardId = params.id

  try {
    const existingReward = await payload.findByID({
      collection: 'loyaltyRewards',
      id: rewardId
    })

    if (!existingReward) {
      throw APIErrorFactory.notFound('Loyalty reward', rewardId)
    }

    // Check if reward has been redeemed
    if (existingReward.redemptionsUsed > 0) {
      throw APIErrorFactory.businessRuleViolation('Cannot delete reward that has been redeemed')
    }

    await payload.delete({
      collection: 'loyaltyRewards',
      id: rewardId
    })

    return createEnhancedSuccessResponse(
      { success: true },
      'Loyalty reward deleted successfully'
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw APIErrorFactory.notFound('Loyalty reward', rewardId)
    }
    console.error('Error deleting loyalty reward:', error)
    throw APIErrorFactory.internalError('Failed to delete loyalty reward')
  }
})
