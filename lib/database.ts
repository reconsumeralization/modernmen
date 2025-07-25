import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

// Global Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Legacy executeQuery function for backward compatibility
export async function executeQuery(query: string, params: any[] = []) {
  throw new Error('executeQuery is deprecated. Use Prisma Client directly.')
}

// Database connection test
export async function testConnection() {
  try {
    await prisma.$connect()
    const result = await prisma.$executeRaw`SELECT NOW() as current_time`
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Client operations
export async function createClient(clientData: {
  firstName: string
  lastName: string
  email: string
  phone: string
  password?: string
  dateOfBirth?: Date
  address?: string
  city?: string
  province?: string
  postalCode?: string
  notes?: string
}) {
  return await prisma.client.create({
    data: clientData
  })
}

export async function getClientByEmail(email: string) {
  return await prisma.client.findUnique({
    where: { email }
  })
}

export async function getAllClients() {
  return await prisma.client.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      totalVisits: true,
      totalSpent: true,
      lastVisit: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Service operations
export async function getAllServices() {
  return await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }]
  })
}

export async function createService(serviceData: {
  name: string
  description?: string
  duration: number
  price: number
  category: string
}) {
  return await prisma.service.create({
    data: serviceData
  })
}

// Staff operations
export async function getAllStaff() {
  return await prisma.staff.findMany({
    where: { isActive: true },
    orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
  })
}

export async function createStaff(staffData: {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  specialties: string[]
  workingDays: string[]
  startTime: string
  endTime: string
}) {
  return await prisma.staff.create({
    data: {
      ...staffData,
      role: staffData.role as any // Cast to enum
    }
  })
}
// Booking operations
export async function createBooking(bookingData: {
  clientId: string
  staffId: string
  serviceId: string
  date: Date
  startTime: string
  endTime: string
  duration: number
  totalPrice: number
  notes?: string
}) {
  return await prisma.booking.create({
    data: {
      ...bookingData,
      status: 'PENDING',
      paymentStatus: 'UNPAID'
    }
  })
}

export async function getBookingsByDate(date: string) {
  return await prisma.booking.findMany({
    where: {
      date: new Date(date)
    },
    include: {
      client: {
        select: {
          firstName: true,
          lastName: true,
          phone: true
        }
      },
      staff: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      service: {
        select: {
          name: true
        }
      }
    },
    orderBy: { startTime: 'asc' }
  })
}

export async function getUpcomingBookings(limit = 10) {
  return await prisma.booking.findMany({
    where: {
      date: {
        gte: new Date()
      },
      status: {
        in: ['PENDING', 'CONFIRMED']
      }
    },
    include: {
      client: {
        select: {
          firstName: true,
          lastName: true,
          phone: true
        }
      },
      staff: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      service: {
        select: {
          name: true
        }
      }
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    take: limit
  })
}

// Product operations
export async function getAllProducts() {
  return await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }]
  })
}

export async function createProduct(productData: {
  name: string
  brand: string
  description?: string
  price: number
  cost?: number
  category: string
  inStock: number
  sku: string
  imageUrls: string[]
}) {
  return await prisma.product.create({
    data: productData
  })
}

export async function updateProductStock(productId: string, newStock: number) {
  return await prisma.product.update({
    where: { id: productId },
    data: { 
      inStock: newStock,
      updatedAt: new Date()
    }
  })
}
// Order operations
export async function createOrder(orderData: {
  clientId: string
  orderNumber: string
  subtotal: number
  tax: number
  discount: number
  total: number
  isPickup: boolean
  shippingAddress?: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
}) {
  return await prisma.order.create({
    data: {
      clientId: orderData.clientId,
      orderNumber: orderData.orderNumber,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      discount: orderData.discount,
      total: orderData.total,
      isPickup: orderData.isPickup,
      shippingAddress: orderData.shippingAddress,
      status: 'PENDING',
      items: {
        create: orderData.items
      }
    },
    include: {
      items: true
    }
  })
}

// Analytics operations
export async function getDashboardStats() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const [totalClients, monthlyBookings, monthlyRevenue, todayBookings] = await Promise.all([
    prisma.client.count(),
    prisma.booking.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    }),
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        total: true
      }
    }),
    prisma.booking.count({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })
  ])

  return {
    totalClients,
    monthlyBookings,
    monthlyRevenue: monthlyRevenue._sum.total || 0,
    todayBookings
  }
}

export async function getRevenueByDay(days = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startDate
      }
    },
    _sum: {
      total: true
    },
    _count: {
      id: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
}