import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Get current date ranges
    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    const endOfToday = new Date(today.setHours(23, 59, 59, 999))
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Basic stats
    const totalClients = await prisma.client.count()
    
    const todayBookings = await prisma.booking.count({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    })

    const completedBookingsToday = await prisma.booking.count({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday
        },
        status: 'COMPLETED'
      }
    })

    const monthlyRevenueResult = await prisma.booking.aggregate({
      where: {
        date: { gte: startOfMonth },
        status: 'COMPLETED'
      },
      _sum: { totalPrice: true }
    })

    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    })

    const newClientsThisMonth = await prisma.client.count({
      where: { createdAt: { gte: startOfMonth } }
    })

    // Recent activity - simplified
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { firstName: true, lastName: true } },
        service: { select: { name: true } }
      }
    })

    const recentActivity = recentBookings.map((booking, index) => ({
      id: `${booking.id}-${index}`,
      type: 'booking' as const,
      description: `${booking.client.firstName} ${booking.client.lastName} booked ${booking.service.name}`,
      time: booking.createdAt.toLocaleString(),
      status: booking.status.toLowerCase() as 'pending' | 'completed' | 'cancelled'
    }))

    const stats = {
      totalClients,
      todayBookings,
      monthlyRevenue: Number(monthlyRevenueResult._sum.totalPrice) || 0,
      pendingOrders,
      newClientsThisMonth,
      completedBookingsToday
    }

    return NextResponse.json({
      stats,
      recentActivity
    })

  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { 
        stats: {
          totalClients: 0,
          todayBookings: 0,
          monthlyRevenue: 0,
          pendingOrders: 0,
          newClientsThisMonth: 0,
          completedBookingsToday: 0
        },
        recentActivity: [],
        error: 'Failed to load dashboard data'
      },
      { status: 500 }
    )
  }
}