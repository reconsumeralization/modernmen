import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30'

    const periodInDays = parseInt(period)
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() - periodInDays)

    // Overview stats
    const totalClients = await prisma.client.count()
    const totalBookings = await prisma.booking.count()
    const totalRevenue = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'COMPLETED' },
    })
    const newClientsThisPeriod = await prisma.client.count({
      where: { createdAt: { gte: dateLimit } },
    })
    const completedBookingsThisPeriod = await prisma.booking.count({
      where: { status: 'COMPLETED', date: { gte: dateLimit } },
    })

    // Recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { firstName: true, lastName: true } },
        service: { select: { name: true } },
        staff: { select: { firstName: true, lastName: true } },
      },
    })

    // Popular services
    const popularServices = await prisma.booking.groupBy({
      by: ['serviceId'],
      _count: { serviceId: true },
      _sum: { totalPrice: true },
      where: { date: { gte: dateLimit } },
      orderBy: {
        _count: {
          serviceId: 'desc',
        },
      },
      take: 5,
    })

    const serviceIds = popularServices.map(s => s.serviceId)
    const services = await prisma.service.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true, name: true }
    })

    const popularServicesWithDetails = popularServices.map(ps => {
        const service = services.find(s => s.id === ps.serviceId)
        return {
            ...ps,
            serviceName: service?.name || 'Unknown',
            bookingCount: ps._count.serviceId,
            totalRevenue: Number(ps._sum.totalPrice) || 0
        }
    })

    // Staff performance
    const staffPerformance = await prisma.booking.groupBy({
      by: ['staffId'],
      _count: { staffId: true },
      _sum: { totalPrice: true },
      where: { date: { gte: dateLimit }, status: 'COMPLETED' },
      orderBy: {
        _sum: {
          totalPrice: 'desc',
        },
      },
      take: 5,
    })
    
    const staffIds = staffPerformance.map(s => s.staffId)
    const staffMembers = await prisma.staff.findMany({
        where: { id: { in: staffIds } },
        select: {
        id: true, 
        firstName: true, 
        lastName: true, 
        role: true 
      }
    })

    const staffPerformanceWithDetails = staffPerformance.map(sp => {
      const staff = staffMembers.find(s => s.id === sp.staffId)
      return {
        ...sp,
        staffName: staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown',
        staffRole: staff?.role || 'Unknown',
        totalRevenue: Number(sp._sum.totalPrice) || 0,
        totalBookings: sp._count.staffId
      }
    })

    // Calculate revenue trends (last 7 days)
    const revenueTrends = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const startOfDay = new Date(date.setHours(0, 0, 0, 0))
        const endOfDay = new Date(date.setHours(23, 59, 59, 999))

        const dayRevenue = await prisma.booking.aggregate({
          where: {
            date: {
              gte: startOfDay,
              lte: endOfDay
            },
            status: 'COMPLETED'
          },
          _sum: { totalPrice: true }
        })

        const dayBookings = await prisma.booking.count({
          where: {
            date: {
              gte: startOfDay,
              lte: endOfDay
            },
            status: 'COMPLETED'
          }
        })

        return {
          date: startOfDay.toISOString().split('T')[0],
          revenue: Number(dayRevenue._sum.totalPrice) || 0,
          bookings: dayBookings
        }
      })
    )

    // Get upcoming appointments for today
    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    const endOfToday = new Date(today.setHours(23, 59, 59, 999))

    const todayAppointments = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday
        },
        status: { in: ['CONFIRMED', 'PENDING'] }
      },
      include: {
        client: {
          select: { firstName: true, lastName: true, phone: true }
        },
        service: {
          select: { name: true, duration: true }
        },
        staff: {
          select: { firstName: true, lastName: true }
        }
      },
      
    orderBy: { startTime: 'asc' }
    })

    // Low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        inStock: { lte: prisma.product.fields.minStock },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        brand: true,
        inStock: true,
        minStock: true,
        sku: true,
      },
      take: 5,
    })

    return NextResponse.json({
      overview: {
        totalClients,
        totalBookings,
        totalRevenue: Number(totalRevenue._sum.totalPrice) || 0,
        newClientsThisPeriod,
        completedBookingsThisPeriod,
        period: parseInt(period)
      },
      recentBookings: recentBookings.map(booking => ({
        id: booking.id,
        clientName: `${booking.client.firstName} ${booking.client.lastName}`,
        serviceName: booking.service.name,
        staffName: `${booking.staff.firstName} ${booking.staff.lastName}`,
        date: booking.date,
        time: booking.startTime,
        status: booking.status,
        totalPrice: Number(booking.totalPrice)
      })),
      popularServices: popularServicesWithDetails,
      staffPerformance: staffPerformanceWithDetails,
      revenueTrends: revenueTrends.reverse(), // Most recent first
      todayAppointments: todayAppointments.map(apt => ({
        id: apt.id,
        clientName: `${apt.client.firstName} ${apt.client.lastName}`,
        clientPhone: apt.client.phone,
        serviceName: apt.service.name,
        duration: apt.service.duration,
        staffName: `${apt.staff.firstName} ${apt.staff.lastName}`,
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
        totalPrice: Number(apt.totalPrice)
      })),
      lowStockProducts: lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        currentStock: product.inStock,
        minStock: product.minStock,
        sku: product.sku
      }))
    })

  } catch (error) {
    console.error('❌ DASHBOARD ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}