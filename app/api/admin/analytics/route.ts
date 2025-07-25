import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Example: Get total bookings
    const totalBookings = await prisma.booking.count()

    // Example: Get total clients
    const totalClients = await prisma.client.count()

    // Example: Get total services
    const totalServices = await prisma.service.count()

    return NextResponse.json({
      totalBookings,
      totalClients,
      totalServices,
      // Add more analytics data here
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ message: 'Error fetching analytics' }, { status: 500 })
  }
}