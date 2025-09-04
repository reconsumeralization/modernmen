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

  // Only allow staff and admins to view analytics
  const user = session.user
  if (!['admin', 'manager', 'staff'].includes(user.role || '')) {
    throw APIErrorFactory.forbidden('Access denied to customer analytics')
  }

  const payload = await getPayloadClient()
  const { searchParams } = new URL(request.url)

  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  try {
    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.greater_than_equal = new Date(startDate)
    }
    if (endDate) {
      dateFilter.less_than_equal = new Date(endDate)
    }

    // Get all customers
    const allCustomers = await payload.find({
      collection: 'customers',
      limit: 10000, // Get all for analytics
      depth: 1
    })

    // Get appointments for date range
    const appointmentsFilter: any = {}
    if (Object.keys(dateFilter).length > 0) {
      appointmentsFilter.dateTime = dateFilter
    }

    const appointments = await payload.find({
      collection: 'appointments',
      where: appointmentsFilter,
      limit: 10000,
      depth: 1
    })

    // Calculate analytics
    const customers = allCustomers.docs
    const activeCustomers = customers.filter(c => c.isActive !== false)
    const inactiveCustomers = customers.filter(c => c.isActive === false)

    // Loyalty tier breakdown
    const loyaltyBreakdown = {
      bronze: customers.filter(c => c.loyaltyTier === 'bronze').length,
      silver: customers.filter(c => c.loyaltyTier === 'silver').length,
      gold: customers.filter(c => c.loyaltyTier === 'gold').length,
      platinum: customers.filter(c => c.loyaltyTier === 'platinum').length
    }

    // Revenue analytics
    const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
    const averageSpent = customers.length > 0 ? totalSpent / customers.length : 0

    // Appointment analytics
    const completedAppointments = appointments.docs.filter(apt => apt.status === 'completed')
    const totalRevenue = appointments.docs.reduce((sum, apt) => sum + (apt.pricing?.total || 0), 0)

    // Customer growth (new customers in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newCustomers = customers.filter(c =>
      c.createdAt && new Date(c.createdAt) >= thirtyDaysAgo
    ).length

    // Top spenders
    const topSpenders = customers
      .filter(c => c.totalSpent > 0)
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        totalSpent: c.totalSpent,
        tier: c.loyaltyTier,
        memberSince: c.memberSince
      }))

    // Visit frequency analysis
    const visitFrequency = {
      oneTime: customers.filter(c => c.visitCount === 1).length,
      regular: customers.filter(c => c.visitCount && c.visitCount >= 2 && c.visitCount <= 5).length,
      frequent: customers.filter(c => c.visitCount && c.visitCount > 5).length
    }

    // Retention analysis (customers with recent visits)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const retainedCustomers = customers.filter(c =>
      c.lastVisit && new Date(c.lastVisit) >= ninetyDaysAgo
    ).length

    const retentionRate = customers.length > 0 ? (retainedCustomers / customers.length) * 100 : 0

    const analytics = {
      overview: {
        totalCustomers: customers.length,
        activeCustomers: activeCustomers.length,
        inactiveCustomers: inactiveCustomers.length,
        newCustomers,
        growthRate: customers.length > 0 ? (newCustomers / customers.length) * 100 : 0,
        retentionRate
      },
      loyalty: {
        tiers: loyaltyBreakdown,
        totalPoints: customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0),
        totalSpent,
        averageSpentPerCustomer: averageSpent,
        topSpenders
      },
      appointments: {
        totalAppointments: appointments.docs.length,
        completedAppointments: completedAppointments.length,
        totalRevenue,
        averageRevenuePerAppointment: appointments.docs.length > 0 ? totalRevenue / appointments.docs.length : 0
      },
      engagement: {
        visitFrequency,
        averageVisitsPerCustomer: customers.length > 0
          ? customers.reduce((sum, c) => sum + (c.visitCount || 0), 0) / customers.length
          : 0
      },
      dateRange: {
        startDate,
        endDate
      }
    }

    return createEnhancedSuccessResponse(analytics)
  } catch (error) {
    console.error('Error fetching customer analytics:', error)
    throw APIErrorFactory.internalError('Failed to fetch customer analytics')
  }
})
