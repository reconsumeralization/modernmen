import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Seed data functions
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Check if data already exists
    const existingClients = await prisma.client.count()
    if (existingClients > 0) {
      console.log('📋 Database already has data, skipping seed')
      return
    }

    // Seed Services
    const services = await prisma.service.createMany({
      data: [
        {
          name: 'Classic Haircut',
          description: 'Traditional haircut with styling',
          duration: 45,
          price: 35,
          category: 'Haircuts',
          addOns: ['beard trim', 'hot towel']
        },
        {
          name: 'Skin Fade',
          description: 'Modern fade haircut',
          duration: 60,
          price: 45,
          category: 'Haircuts',
          addOns: ['beard trim', 'hot towel', 'hair wash']
        },
        {
          name: 'Beard Trim',
          description: 'Professional beard trimming and shaping',
          duration: 30,
          price: 25,
          category: 'Beard Care',
          addOns: ['hot towel', 'beard oil']
        },
        {
          name: 'Hot Towel Shave',
          description: 'Traditional hot towel straight razor shave',
          duration: 45,
          price: 40,
          category: 'Shaving',
          addOns: ['aftershave', 'face moisturizer']
        },
        {
          name: 'Hair Wash & Style',
          description: 'Professional hair washing and styling',
          duration: 30,
          price: 20,
          category: 'Styling',
          addOns: ['scalp massage', 'hair treatment']
        }
      ]
    })

    // Seed Staff
    const staff = await prisma.staff.createMany({
      data: [
        {
          firstName: 'Hicham',
          lastName: 'Mellouli',
          email: 'hicham@modernmen.ca',
          phone: '(306) 555-0101',
          role: 'OWNER',
          specialties: ['All Cuts', 'Beard Styling', 'Classic Styles'],
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          startTime: '09:00',
          endTime: '18:00',
          breakStart: '12:00',
          breakEnd: '13:00',
          rating: 4.9
        },
        {
          firstName: 'Ella',
          lastName: 'Forestal',
          email: 'ella@modernmen.ca',
          phone: '(306) 555-0102',
          role: 'STYLIST',
          specialties: ['Modern Cuts', 'Fades', 'Styling'],
          workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          startTime: '10:00',
          endTime: '17:00',
          breakStart: '12:30',
          breakEnd: '13:30',
          rating: 4.8
        },
        {
          firstName: 'Tri',
          lastName: 'Ha',
          email: 'tri@modernmen.ca',
          phone: '(306) 555-0103',
          role: 'BARBER',
          specialties: ['Classic Cuts', 'Shaves', 'Beard Care'],
          workingDays: ['monday', 'wednesday', 'thursday', 'friday', 'saturday'],
          startTime: '09:30',
          endTime: '17:30',
          breakStart: '12:00',
          breakEnd: '13:00',
          rating: 4.7
        }
      ]
    })

    console.log(`✅ Seeded ${services.count} services`)
    console.log(`✅ Seeded ${staff.count} staff members`)
    console.log('🌱 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  }
}
