import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { withEnhancedErrorHandler, createEnhancedSuccessResponse, APIErrorFactory } from '@/lib/enhanced-api-errors'
import { safeGet, safeMap, safeFilter } from '@/lib/safe-access'

export const GET = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const { searchParams } = new URL(request.url)

  // Parse query parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status')
  const loyaltyTier = searchParams.get('loyaltyTier')
  const sort = searchParams.get('sort') || '-createdAt'

  // Build where clause
  const where: any = {}

  // Search filter
  if (search) {
    where.or = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } }
    ]
  }

  // Status filter
  if (status && status !== 'all') {
    where.isActive = status === 'active'
  }

  // Loyalty tier filter
  if (loyaltyTier && loyaltyTier !== 'all') {
    where.loyaltyTier = { equals: loyaltyTier }
  }

  // Access control based on user role
  const user = session.user
  if (user.role === 'customer') {
    // Customers can only see their own data
    where.id = { equals: user.id }
  }

  try {
    const customers = await payload.find({
      collection: 'customers',
      where,
      sort,
      page,
      limit,
      depth: 1
    })

    // Calculate analytics
    const analytics = {
      totalActive: customers.docs.filter(c => c.isActive).length,
      totalInactive: customers.docs.filter(c => !c.isActive).length,
      loyaltyBreakdown: {
        bronze: customers.docs.filter(c => c.loyaltyTier === 'bronze').length,
        silver: customers.docs.filter(c => c.loyaltyTier === 'silver').length,
        gold: customers.docs.filter(c => c.loyaltyTier === 'gold').length,
        platinum: customers.docs.filter(c => c.loyaltyTier === 'platinum').length
      },
      averageSpent: customers.docs.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.docs.length || 0
    }

    return createEnhancedSuccessResponse({
      customers: customers.docs,
      totalDocs: customers.totalDocs,
      totalPages: customers.totalPages,
      page: customers.page,
      hasNextPage: customers.hasNextPage,
      hasPrevPage: customers.hasPrevPage,
      analytics
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw APIErrorFactory.internalError('Failed to fetch customers')
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
  if (!body.firstName || !body.lastName || !body.email) {
    throw APIErrorFactory.validationFailed([
      { field: 'firstName', message: 'First name is required' },
      { field: 'lastName', message: 'Last name is required' },
      { field: 'email', message: 'Email is required' }
    ])
  }

  // Check for existing customer with same email
  const existingCustomer = await payload.find({
    collection: 'customers',
    where: { email: { equals: body.email } }
  })

  if (existingCustomer.docs.length > 0) {
    throw APIErrorFactory.alreadyExists('Customer', body.email)
  }

  try {
    const customer = await payload.create({
      collection: 'customers',
      data: {
        ...body,
        memberSince: new Date(),
        isActive: true
      },
      depth: 1
    })

    return createEnhancedSuccessResponse(
      { customer },
      'Customer created successfully',
      201
    )
  } catch (error) {
    console.error('Error creating customer:', error)
    throw APIErrorFactory.internalError('Failed to create customer')
  }
})
