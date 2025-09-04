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

  // Only allow staff and admins to view CRM dashboard
  const user = session.user
  if (!['admin', 'manager', 'staff'].includes(user.role || '')) {
    throw APIErrorFactory.forbidden('Access denied to CRM dashboard')
  }

  const payload = await getPayloadClient()
  const { searchParams } = new URL(request.url)

  const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  try {
    // Calculate date range
    const now = new Date()
    let start: Date
    let end: Date = now

    if (startDate && endDate) {
      start = new Date(startDate)
      end = new Date(endDate)
    } else {
      switch (period) {
        case '7d':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '90d':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case '1y':
          start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        case '30d':
        default:
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
      }
    }

    // Get customers data
    const customers = await payload.find({
      collection: 'customers',
      limit: 10000,
      depth: 1
    })

    // Get appointments data
    const appointments = await payload.find({
      collection: 'appointments',
      where: {
        dateTime: {
          greater_than_equal: start,
          less_than_equal: end
        }
      },
      limit: 10000,
      depth: 1
    })

    // Get services data
    const services = await payload.find({
      collection: 'services',
      limit: 1000,
      depth: 1
    })

    // Calculate key metrics
    const totalCustomers = customers.docs.length
    const activeCustomers = customers.docs.filter(c => c.isActive !== false).length
    const totalAppointments = appointments.docs.length
    const completedAppointments = appointments.docs.filter(a => a.status === 'completed').length
    const totalRevenue = appointments.docs.reduce((sum, a) => sum + (a.pricing?.total || 0), 0)
    const averageRevenue = totalAppointments > 0 ? totalRevenue / totalAppointments : 0

    // Customer metrics
    const newCustomers = customers.docs.filter(c =>
      c.createdAt && new Date(c.createdAt) >= start
    ).length

    const returningCustomers = customers.docs.filter(c =>
      (c.visitCount || 0) > 1
    ).length

    // Appointment status breakdown
    const appointmentStatus = {
      confirmed: appointments.docs.filter(a => a.status === 'confirmed').length,
      pending: appointments.docs.filter(a => a.status === 'pending').length,
      completed: appointments.docs.filter(a => a.status === 'completed').length,
      cancelled: appointments.docs.filter(a => a.status === 'cancelled').length,
      'no-show': appointments.docs.filter(a => a.status === 'no-show').length
    }

    // Revenue by service
    const revenueByService = services.docs.map(service => {
      const serviceAppointments = appointments.docs.filter(a =>
        a.services?.some(s => (typeof s === 'string' ? s : s.id) === service.id)
      )
      const revenue = serviceAppointments.reduce((sum, a) => sum + (a.pricing?.total || 0), 0)

      return {
        serviceId: service.id,
        serviceName: service.name,
        appointments: serviceAppointments.length,
        revenue
      }
    }).sort((a, b) => b.revenue - a.revenue)

    // Top customers by spending
    const topCustomers = customers.docs
      .filter(c => c.totalSpent > 0)
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        totalSpent: c.totalSpent,
        loyaltyTier: c.loyaltyTier,
        lastVisit: c.lastVisit
      }))

    // Upcoming appointments (next 7 days)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const upcomingAppointments = appointments.docs
      .filter(a =>
        new Date(a.dateTime) >= now &&
        new Date(a.dateTime) <= nextWeek &&
        ['confirmed', 'pending'].includes(a.status)
      )
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .slice(0, 20)
      .map(a => ({
        id: a.id,
        customerName: typeof a.customer === 'string' ? 'Unknown' : `${a.customer?.firstName} ${a.customer?.lastName}`,
        stylistName: typeof a.stylist === 'string' ? 'Unknown' : `${a.stylist?.firstName} ${a.stylist?.lastName}`,
        dateTime: a.dateTime,
        services: Array.isArray(a.services)
          ? a.services.map(s => typeof s === 'string' ? s : s.name).join(', ')
          : 'No services',
        status: a.status
      }))

    // Loyalty program metrics
    const loyaltyMetrics = {
      totalPoints: customers.docs.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0),
      tierBreakdown: {
        bronze: customers.docs.filter(c => c.loyaltyTier === 'bronze').length,
        silver: customers.docs.filter(c => c.loyaltyTier === 'silver').length,
        gold: customers.docs.filter(c => c.loyaltyTier === 'gold').length,
        platinum: customers.docs.filter(c => c.loyaltyTier === 'platinum').length
      },
      averagePointsPerCustomer: totalCustomers > 0
        ? customers.docs.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0) / totalCustomers
        : 0
    }

    // Performance indicators
    const performanceIndicators = {
      customerRetentionRate: totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0,
      appointmentCompletionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
      averageAppointmentsPerCustomer: activeCustomers > 0 ? totalAppointments / activeCustomers : 0,
      revenuePerCustomer: activeCustomers > 0 ? totalRevenue / activeCustomers : 0
    }

    const dashboard = {
      summary: {
        totalCustomers,
        activeCustomers,
        totalAppointments,
        completedAppointments,
        totalRevenue,
        averageRevenue,
        customerRetentionRate: performanceIndicators.customerRetentionRate,
        appointmentCompletionRate: performanceIndicators.appointmentCompletionRate
      },
      customers: {
        newCustomers,
        returningCustomers,
        topCustomers,
        loyaltyMetrics
      },
      appointments: {
        statusBreakdown: appointmentStatus,
        upcomingAppointments,
        revenueByService: revenueByService.slice(0, 10)
      },
      performance: performanceIndicators,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        period
      }
    }

    return createEnhancedSuccessResponse(dashboard)
  } catch (error) {
    console.error('Error fetching CRM dashboard data:', error)
    throw APIErrorFactory.internalError('Failed to fetch CRM dashboard data')
  }
})
