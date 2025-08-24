import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '@/payload'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    logger.info('🌱 Starting minimal seeding...')

    // 1. Create Admin User (using correct field structure)
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@modernmen.com',
        name: 'System Administrator', // Single name field
        role: 'admin',
        phone: '555-0001',
        password: 'admin123'
      }
    })
    logger.info('✅ Admin user created')

    // 2. Create a Simple Service (using correct structure)
    const service1 = await payload.create({
      collection: 'services',
      data: {
        name: 'Mens Haircut',
        description: 'Professional mens haircut',
        category: 'haircut',
        price: 35,
        duration: 30,
        isActive: true
      }
    })
    logger.info('✅ Service created')

    // 3. Create a Stylist
    const stylist1 = await payload.create({
      collection: 'stylists',
      data: {
        firstName: 'Marcus',
        lastName: 'Rodriguez',
        email: 'marcus@modernmen.com',
        phone: '555-0101',
        specialty: 'haircuts',
        experience: 8,
        bio: 'Master stylist with 8+ years experience.',
        commissionRate: 45,
        isActive: true
      }
    })
    logger.info('✅ Stylist created')

    // 4. Create a Customer
    const customer1 = await payload.create({
      collection: 'customers',
      data: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '555-1001',
        visitCount: 5,
        totalSpent: 175,
        loyaltyPoints: 50
      }
    })
    logger.info('✅ Customer created')

    // 5. Create an Appointment
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    futureDate.setHours(14, 0, 0, 0)

    await payload.create({
      collection: 'appointments',
      data: {
        customer: customer1.id,
        stylist: stylist1.id,
        service: service1.id,
        dateTime: futureDate.toISOString(),
        status: 'confirmed',
        duration: service1.duration,
        price: service1.price,
        paymentStatus: 'pending'
      }
    })
    logger.info('✅ Appointment created')

    logger.info('🎉 Minimal seeding completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Minimal seeding completed',
      created: {
        users: 1,
        services: 1,
        stylists: 1,
        customers: 1,
        appointments: 1
      }
    })

  } catch (error) {
    logger.error('❌ Minimal seeding failed:', { operation: 'minimal_seed' }, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Minimal seeding failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Minimal Seeding API',
    description: 'POST to seed basic data to get started quickly'
  })
}