import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '@/payload'
import { logger } from '@/lib/logger'

export interface LoyaltyTransaction {
  customerId: string
  type: 'earn' | 'redeem' | 'expire' | 'bonus' | 'adjustment'
  points: number
  reason: string
  serviceId?: string
  appointmentId?: string
  rewardId?: string
  expirationDate?: Date
  metadata?: Record<string, any>
}

export interface RewardTier {
  name: string
  minPoints: number
  maxPoints?: number
  benefits: string[]
  multiplier: number
  color: string
  icon: string
}

export interface LoyaltyReward {
  id?: string
  name: string
  description: string
  pointsCost: number
  type: 'service_discount' | 'product_discount' | 'free_service' | 'gift_card' | 'merchandise'
  value: number
  isActive: boolean
  expirationDays?: number
  limitations?: {
    maxRedemptions?: number
    validServices?: string[]
    minSpend?: number
    validUntil?: Date
  }
}

const LOYALTY_TIERS: RewardTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 199,
    benefits: ['Basic appointment reminders', '1x points earning'],
    multiplier: 1.0,
    color: '#CD7F32',
    icon: '🥉'
  },
  {
    name: 'Silver',
    minPoints: 200,
    maxPoints: 499,
    benefits: ['Priority booking', '1.25x points earning', '5% service discount'],
    multiplier: 1.25,
    color: '#C0C0C0',
    icon: '🥈'
  },
  {
    name: 'Gold',
    minPoints: 500,
    maxPoints: 999,
    benefits: ['VIP treatment', '1.5x points earning', '10% service discount', 'Free beverage'],
    multiplier: 1.5,
    color: '#FFD700',
    icon: '🥇'
  },
  {
    name: 'Platinum',
    minPoints: 1000,
    benefits: ['Exclusive services', '2x points earning', '15% service discount', 'Priority support'],
    multiplier: 2.0,
    color: '#E5E4E2',
    icon: '💎'
  }
]

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { action, ...data } = await request.json()

    logger.info('🏆 Loyalty rewards action initiated', { action })

    switch (action) {
      case 'earn_points':
        return await earnPoints(payload, data)
      
      case 'redeem_points':
        return await redeemPoints(payload, data)
      
      case 'get_customer_loyalty':
        return await getCustomerLoyalty(payload, data.customerId)
      
      case 'create_reward':
        return await createReward(payload, data)
      
      case 'list_rewards':
        return await listRewards(payload, data)
      
      case 'calculate_tier':
        return await calculateTier(data.points)
      
      case 'get_loyalty_analytics':
        return await getLoyaltyAnalytics(payload)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    logger.error('❌ Loyalty rewards error:', { operation: 'loyalty_rewards' }, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Loyalty system error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')
  const customerId = url.searchParams.get('customerId')

  try {
    const payload = await getPayloadClient()

    switch (action) {
      case 'customer':
        if (!customerId) {
          return NextResponse.json(
            { success: false, error: 'Customer ID required' },
            { status: 400 }
          )
        }
        return await getCustomerLoyalty(payload, customerId)
      
      case 'rewards':
        return await listRewards(payload)
      
      case 'tiers':
        return NextResponse.json({
          success: true,
          tiers: LOYALTY_TIERS
        })
      
      case 'analytics':
        return await getLoyaltyAnalytics(payload)
      
      default:
        return NextResponse.json({
          message: 'Loyalty & Rewards System API',
          description: 'Comprehensive customer loyalty program with points, tiers, and rewards',
          endpoints: {
            'POST / with action=earn_points': 'Award points to customer',
            'POST / with action=redeem_points': 'Redeem points for rewards',
            'GET /?action=customer&customerId=ID': 'Get customer loyalty status',
            'GET /?action=rewards': 'List available rewards',
            'GET /?action=tiers': 'Get loyalty tier information',
            'GET /?action=analytics': 'Get loyalty program analytics'
          },
          features: {
            pointsSystem: 'Earn and redeem points',
            tierSystem: '4-tier loyalty program (Bronze, Silver, Gold, Platinum)',
            rewards: 'Service discounts, free services, merchandise',
            analytics: 'Comprehensive loyalty program insights',
            automation: 'Automatic tier upgrades and point expiration'
          }
        })
    }

  } catch (error) {
    logger.error('❌ Loyalty GET error:', { operation: 'loyalty_get' }, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      { success: false, error: 'Loyalty system error' },
      { status: 500 }
    )
  }
}

// Award points to customer
async function earnPoints(payload: any, data: LoyaltyTransaction) {
  const { customerId, points, reason, serviceId, appointmentId, metadata } = data

  // Get customer
  const customer = await payload.findByID({
    collection: 'customers',
    id: customerId
  })

  if (!customer) {
    return NextResponse.json(
      { success: false, error: 'Customer not found' },
      { status: 404 }
    )
  }

  // Calculate current tier and multiplier
  const currentTier = calculateCustomerTier(customer.loyaltyPoints || 0)
  const adjustedPoints = Math.round(points * currentTier.multiplier)

  // Update customer points
  const newTotalPoints = (customer.loyaltyPoints || 0) + adjustedPoints
  const newTier = calculateCustomerTier(newTotalPoints)
  const tierUpgraded = newTier.name !== currentTier.name

  await payload.update({
    collection: 'customers',
    id: customerId,
    data: {
      loyaltyPoints: newTotalPoints,
      loyaltyTier: newTier.name
    }
  })

  // Create loyalty transaction record
  const transaction = await payload.create({
    collection: 'loyalty-transactions',
    data: {
      customer: customerId,
      type: 'earn',
      points: adjustedPoints,
      reason,
      service: serviceId,
      appointment: appointmentId,
      balanceAfter: newTotalPoints,
      tierAfter: newTier.name,
      metadata: {
        originalPoints: points,
        multiplier: currentTier.multiplier,
        ...metadata
      }
    }
  })

  // Send tier upgrade notification if applicable
  if (tierUpgraded) {
    await sendTierUpgradeNotification(payload, customer, newTier)
  }

  logger.info('✅ Points earned successfully', {
    customerId,
    pointsEarned: adjustedPoints,
    newTotal: newTotalPoints,
    tier: newTier.name,
    tierUpgraded
  })

  return NextResponse.json({
    success: true,
    transaction: {
      id: transaction.id,
      pointsEarned: adjustedPoints,
      newBalance: newTotalPoints,
      tier: newTier,
      tierUpgraded
    },
    message: tierUpgraded 
      ? `Congratulations! You've been upgraded to ${newTier.name} tier!`
      : `${adjustedPoints} points earned!`
  })
}

// Redeem points for rewards
async function redeemPoints(payload: any, data: { customerId: string; rewardId: string; quantity?: number }) {
  const { customerId, rewardId, quantity = 1 } = data

  // Get customer and reward
  const [customer, reward] = await Promise.all([
    payload.findByID({ collection: 'customers', id: customerId }),
    payload.findByID({ collection: 'loyalty-rewards', id: rewardId })
  ])

  if (!customer) {
    return NextResponse.json(
      { success: false, error: 'Customer not found' },
      { status: 404 }
    )
  }

  if (!reward) {
    return NextResponse.json(
      { success: false, error: 'Reward not found' },
      { status: 404 }
    )
  }

  if (!reward.isActive) {
    return NextResponse.json(
      { success: false, error: 'Reward is no longer available' },
      { status: 400 }
    )
  }

  const totalCost = reward.pointsCost * quantity
  const customerPoints = customer.loyaltyPoints || 0

  if (customerPoints < totalCost) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Insufficient points',
        required: totalCost,
        available: customerPoints
      },
      { status: 400 }
    )
  }

  // Check reward limitations
  if (reward.limitations) {
    const limitCheck = await checkRewardLimitations(payload, customerId, reward, quantity)
    if (!limitCheck.valid) {
      return NextResponse.json(
        { success: false, error: limitCheck.error },
        { status: 400 }
      )
    }
  }

  // Process redemption
  const newBalance = customerPoints - totalCost
  const newTier = calculateCustomerTier(newBalance)

  await payload.update({
    collection: 'customers',
    id: customerId,
    data: {
      loyaltyPoints: newBalance,
      loyaltyTier: newTier.name
    }
  })

  // Create redemption record
  const redemption = await payload.create({
    collection: 'loyalty-transactions',
    data: {
      customer: customerId,
      type: 'redeem',
      points: -totalCost,
      reason: `Redeemed ${quantity}x ${reward.name}`,
      reward: rewardId,
      balanceAfter: newBalance,
      tierAfter: newTier.name,
      quantity,
      metadata: {
        rewardType: reward.type,
        rewardValue: reward.value
      }
    }
  })

  // Generate reward voucher/code if needed
  const voucher = await generateRewardVoucher(payload, customer, reward, quantity)

  logger.info('✅ Points redeemed successfully', {
    customerId,
    rewardId,
    pointsUsed: totalCost,
    newBalance,
    quantity
  })

  return NextResponse.json({
    success: true,
    redemption: {
      id: redemption.id,
      pointsUsed: totalCost,
      newBalance,
      tier: newTier,
      voucher
    },
    message: `Successfully redeemed ${quantity}x ${reward.name}!`
  })
}

// Get customer loyalty status
async function getCustomerLoyalty(payload: any, customerId: string) {
  const customer = await payload.findByID({
    collection: 'customers',
    id: customerId
  })

  if (!customer) {
    return NextResponse.json(
      { success: false, error: 'Customer not found' },
      { status: 404 }
    )
  }

  const points = customer.loyaltyPoints || 0
  const tier = calculateCustomerTier(points)
  const nextTier = getNextTier(tier)

  // Get recent transactions
  const transactions = await payload.find({
    collection: 'loyalty-transactions',
    where: { customer: { equals: customerId } },
    sort: '-createdAt',
    limit: 10
  })

  // Calculate points earned this month
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const monthlyTransactions = await payload.find({
    collection: 'loyalty-transactions',
    where: {
      and: [
        { customer: { equals: customerId } },
        { createdAt: { gte: thisMonth.toISOString() } },
        { type: { equals: 'earn' } }
      ]
    }
  })

  const monthlyPoints = monthlyTransactions.docs.reduce((sum: number, t: any) => sum + (t.points || 0), 0)

  return NextResponse.json({
    success: true,
    loyalty: {
      customerId,
      points,
      tier,
      nextTier,
      pointsToNextTier: nextTier ? nextTier.minPoints - points : 0,
      monthlyPoints,
      recentTransactions: transactions.docs,
      benefits: tier.benefits,
      multiplier: tier.multiplier
    }
  })
}

// Create new reward
async function createReward(payload: any, rewardData: LoyaltyReward) {
  const reward = await payload.create({
    collection: 'loyalty-rewards',
    data: rewardData
  })

  logger.info('✅ New reward created', { rewardId: reward.id, name: rewardData.name })

  return NextResponse.json({
    success: true,
    reward,
    message: 'Reward created successfully'
  })
}

// List available rewards
async function listRewards(payload: any, filters?: { type?: string; maxPoints?: number }) {
  const where: any = { isActive: { equals: true } }

  if (filters?.type) {
    where.type = { equals: filters.type }
  }

  if (filters?.maxPoints) {
    where.pointsCost = { lte: filters.maxPoints }
  }

  const rewards = await payload.find({
    collection: 'loyalty-rewards',
    where,
    sort: 'pointsCost'
  })

  return NextResponse.json({
    success: true,
    rewards: rewards.docs,
    total: rewards.totalDocs
  })
}

// Calculate tier from points
async function calculateTier(points: number) {
  const tier = calculateCustomerTier(points)
  const nextTier = getNextTier(tier)

  return NextResponse.json({
    success: true,
    tier,
    nextTier,
    pointsToNextTier: nextTier ? nextTier.minPoints - points : 0,
    progress: nextTier ? ((points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100 : 100
  })
}

// Get loyalty program analytics
async function getLoyaltyAnalytics(payload: any) {
  // Get customer distribution by tier
  const customers = await payload.find({
    collection: 'customers',
    limit: 1000
  })

  const tierDistribution = LOYALTY_TIERS.reduce((dist, tier) => {
    dist[tier.name] = customers.docs.filter((c: any) => {
      const points = c.loyaltyPoints || 0
      return points >= tier.minPoints && (!tier.maxPoints || points <= tier.maxPoints)
    }).length
    return dist
  }, {} as Record<string, number>)

  // Get recent transactions
  const recentTransactions = await payload.find({
    collection: 'loyalty-transactions',
    sort: '-createdAt',
    limit: 100
  })

  const transactionsByType = recentTransactions.docs.reduce((types: any, t: any) => {
    types[t.type] = (types[t.type] || 0) + 1
    return types
  }, {})

  // Calculate average points per customer
  const totalPoints = customers.docs.reduce((sum: number, c: any) => sum + (c.loyaltyPoints || 0), 0)
  const averagePoints = customers.docs.length > 0 ? totalPoints / customers.docs.length : 0

  // Top customers by points
  const topCustomers = customers.docs
    .sort((a: any, b: any) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0))
    .slice(0, 10)
    .map((c: any) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      points: c.loyaltyPoints || 0,
      tier: calculateCustomerTier(c.loyaltyPoints || 0).name
    }))

  return NextResponse.json({
    success: true,
    analytics: {
      totalCustomers: customers.docs.length,
      tierDistribution,
      totalPointsIssued: totalPoints,
      averagePointsPerCustomer: Math.round(averagePoints),
      recentTransactions: transactionsByType,
      topCustomers,
      programHealth: {
        activeRewards: await payload.count({ collection: 'loyalty-rewards', where: { isActive: { equals: true } } }),
        monthlyRedemptions: recentTransactions.docs.filter((t: any) => t.type === 'redeem').length,
        monthlyEarnings: recentTransactions.docs.filter((t: any) => t.type === 'earn').length
      }
    }
  })
}

// Helper functions
function calculateCustomerTier(points: number): RewardTier {
  for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
    const tier = LOYALTY_TIERS[i]
    if (points >= tier.minPoints) {
      return tier
    }
  }
  return LOYALTY_TIERS[0] // Default to Bronze
}

function getNextTier(currentTier: RewardTier): RewardTier | null {
  const currentIndex = LOYALTY_TIERS.findIndex(t => t.name === currentTier.name)
  return currentIndex < LOYALTY_TIERS.length - 1 ? LOYALTY_TIERS[currentIndex + 1] : null
}

async function checkRewardLimitations(payload: any, customerId: string, reward: any, quantity: number) {
  if (!reward.limitations) return { valid: true }

  const { maxRedemptions, validServices, minSpend, validUntil } = reward.limitations

  // Check expiration
  if (validUntil && new Date() > new Date(validUntil)) {
    return { valid: false, error: 'Reward has expired' }
  }

  // Check max redemptions
  if (maxRedemptions) {
    const redemptions = await payload.find({
      collection: 'loyalty-transactions',
      where: {
        and: [
          { customer: { equals: customerId } },
          { reward: { equals: reward.id } },
          { type: { equals: 'redeem' } }
        ]
      }
    })

    const totalRedeemed = redemptions.docs.reduce((sum: number, t: any) => sum + (t.quantity || 1), 0)
    
    if (totalRedeemed + quantity > maxRedemptions) {
      return { valid: false, error: `Maximum ${maxRedemptions} redemptions allowed` }
    }
  }

  return { valid: true }
}

async function generateRewardVoucher(payload: any, customer: any, reward: any, quantity: number) {
  const voucherCode = `${reward.type.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  
  const expirationDate = reward.expirationDays 
    ? new Date(Date.now() + reward.expirationDays * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days default

  const voucher = await payload.create({
    collection: 'reward-vouchers',
    data: {
      code: voucherCode,
      customer: customer.id,
      reward: reward.id,
      quantity,
      type: reward.type,
      value: reward.value,
      status: 'active',
      expiresAt: expirationDate,
      metadata: {
        customerName: `${customer.firstName} ${customer.lastName}`,
        rewardName: reward.name,
        issuedAt: new Date()
      }
    }
  })

  return {
    code: voucherCode,
    expiresAt: expirationDate,
    instructions: generateVoucherInstructions(reward),
    id: voucher.id
  }
}

function generateVoucherInstructions(reward: any): string {
  switch (reward.type) {
    case 'service_discount':
      return `Present this code at checkout to receive ${reward.value}% off eligible services.`
    case 'free_service':
      return `Present this code to redeem your complimentary ${reward.name}.`
    case 'product_discount':
      return `Use this code to get ${reward.value}% off retail products.`
    case 'gift_card':
      return `This voucher is worth $${reward.value} and can be applied to any service.`
    default:
      return `Present this code to redeem your reward.`
  }
}

async function sendTierUpgradeNotification(payload: any, customer: any, newTier: RewardTier) {
  // This would integrate with the notification system
  logger.info('🎉 Tier upgrade notification', {
    customerId: customer.id,
    newTier: newTier.name,
    benefits: newTier.benefits
  })

  // Here you would send actual notification via email, SMS, or push notification
  // await notificationService.send({
  //   type: 'tier_upgrade',
  //   recipient: customer.id,
  //   title: `Welcome to ${newTier.name} Tier!`,
  //   message: `Congratulations! You've unlocked: ${newTier.benefits.join(', ')}`,
  //   priority: 'normal'
  // })
}