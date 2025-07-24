import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/analytics - Get comprehensive business analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Revenue Analytics
    const revenueAnalytics = await prisma.booking.aggregate({
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED'
      },
      _sum: { totalPrice: true },
      _avg: { totalPrice: true },
      _count: { id: true }
    })

    // Monthly Revenue Trends (last 12 months)
    const monthlyRevenue = await Promise.all(
      Array.from({ length: 12 }, async (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        const monthData = await prisma.booking.aggregate({
          where: {
            date: {
              gte: startOfMonth,
              lte: endOfMonth
            },
            status: 'COMPLETED'
          },
          _sum: { totalPrice: true },
          _count: { id: true }
        })

        return {
          month: startOfMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: Number(monthData._sum?.totalPrice) || 0,
          bookings: monthData._count?.id || 0
        }
      })
    )

    // Client Analytics
    const clientGrowth = await prisma.client.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: { id: true }
    })

    // Top Clients by Revenue
    const topClients = await prisma.client.findMany({
      orderBy: { totalSpent: 'desc' },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        totalSpent: true,
        totalVisits: true,
        lastVisit: true
      }
    })

    // Service Performance
    const servicePerformance = await prisma.booking.groupBy({
      by: ['serviceId'],
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED'
      },
      _count: { serviceId: true },
      _sum: { totalPrice: true },
      orderBy: { _count: { serviceId: 'desc' } }
    })

    // Get service details
    const serviceIds = servicePerformance.map(sp => sp.serviceId)
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true, category: true, price: true }
    })

    const servicePerformanceWithDetails = servicePerformance.map(sp => {
      const service = services.find(s => s.id === sp.serviceId)
      return {
        serviceName: service?.name || 'Unknown',
        category: service?.category || 'Unknown',
        basePrice: Number(service?.price) || 0,
        bookingCount: sp._count.serviceId,
        totalRevenue: Number(sp._sum?.totalPrice) || 0,
        averageRevenue: Number(sp._sum?.totalPrice) / (sp._count?.serviceId || 1) || 0
      }
    })

    // Staff Performance
    const staffStats = await prisma.staff.findMany({
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    const staffRevenue = await Promise.all(
      staffStats.map(async (staff) => {
        const revenue = await prisma.booking.aggregate({
          where: {
            staffId: staff.id,
            createdAt: { gte: startDate },
            status: 'COMPLETED'
          },
          _sum: { totalPrice: true }
        })

        return {
          staffId: staff.id,
          name: `${staff.firstName} ${staff.lastName}`,
          role: staff.role,
          totalBookings: staff._count?.bookings || 0,
          revenue: Number(revenue._sum?.totalPrice) || 0,
          rating: Number(staff.rating) || 0
        }
      })
    )

    return NextResponse.json({
      period: parseInt(period),
      revenue: {
        total: Number(revenueAnalytics._sum.totalPrice) || 0,
        average: Number(revenueAnalytics._avg.totalPrice) || 0,
        bookings: revenueAnalytics._count.id,
        monthlyTrends: monthlyRevenue.reverse()
      },
      clients: {
        newClients: clientGrowth.length,
        topClients: topClients.map(client => ({
          ...client,
          totalSpent: Number(client.totalSpent)
        }))
      },
      services: {
        performance: servicePerformanceWithDetails
      },
      staff: {
        performance: staffRevenue.sort((a, b) => b.revenue - a.revenue)
      }
    })

  } catch (error) {
    console.error('❌ ANALYTICS ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
