import { PrismaClient, StaffRole, BookingStatus, OrderStatus, PaymentStatus } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') })
config({ path: resolve(__dirname, '../.env') })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.product.deleteMany()
  await prisma.service.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.client.deleteMany()

  // Seed Services
  console.log('✂️ Seeding services...')
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Classic Haircut',
        description: 'Traditional scissor cut with styling',
        duration: 30,
        price: 35,
        category: 'Haircuts'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Fade Cut',
        description: 'Modern fade with precise blending',
        duration: 45,
        price: 45,
        category: 'Haircuts'
      }
    }),    prisma.service.create({
      data: {
        name: 'Beard Trim',
        description: 'Professional beard shaping and styling',
        duration: 20,
        price: 25,
        category: 'Grooming'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Hot Towel Shave',
        description: 'Traditional straight razor shave with hot towel',
        duration: 40,
        price: 50,
        category: 'Shaving'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Hair Wash & Style',
        description: 'Deep cleanse with premium styling',
        duration: 25,
        price: 20,
        category: 'Styling'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Deluxe Package',
        description: 'Haircut, beard trim, and hot towel treatment',
        duration: 75,
        price: 90,
        category: 'Packages'
      }
    })
  ]);

  // Seed Staff
  console.log('👨‍💼 Seeding staff...')
  const staff = await Promise.all([
    prisma.staff.create({
      data: {
        firstName: 'Marcus',
        lastName: 'Johnson',
        email: 'marcus@modernmen.com',
        phone: '555-0101',
        role: StaffRole.BARBER,
        specialties: ['Fades', 'Modern Cuts'],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '09:00',
        endTime: '17:00'
      }
    }),    prisma.staff.create({
      data: {
        firstName: 'David',
        lastName: 'Rodriguez',
        email: 'david@modernmen.com',
        phone: '555-0102',
        role: StaffRole.BARBER,
        specialties: ['Classic Cuts', 'Shaves'],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '09:00',
        endTime: '17:00'
      }
    }),
    prisma.staff.create({
      data: {
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james@modernmen.com',
        phone: '555-0103',
        role: StaffRole.STYLIST,
        specialties: ['Beard Styling', 'Grooming'],
        workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        startTime: '10:00',
        endTime: '18:00'
      }
    }),
    prisma.staff.create({
      data: {
        firstName: 'Antonio',
        lastName: 'Garcia',
        email: 'antonio@modernmen.com',
        phone: '555-0104',
        role: StaffRole.MANAGER,
        specialties: ['All Services'],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        startTime: '08:00',
        endTime: '19:00'
      }
    })
  ]);

  // Seed Clients
  console.log('👥 Seeding clients...')
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '555-1001',
        notes: 'Likes fade cuts, prefers Marcus',
        preferredStylist: 'Marcus Johnson',
        totalVisits: 12,
        totalSpent: 420,
        lastVisit: new Date('2025-07-20')
      }
    }),    prisma.client.create({
      data: {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'mike.brown@email.com',
        phone: '555-1002',
        notes: 'Regular customer, classic cuts only',
        totalVisits: 8,
        totalSpent: 280,
        lastVisit: new Date('2025-07-15')
      }
    }),
    prisma.client.create({
      data: {
        firstName: 'Robert',
        lastName: 'Davis',
        email: 'rob.davis@email.com',
        phone: '555-1003',
        notes: 'Beard maintenance specialist',
        preferredStylist: 'James Wilson',
        totalVisits: 15,
        totalSpent: 375,
        lastVisit: new Date('2025-07-18')
      }
    }),
    prisma.client.create({
      data: {
        firstName: 'William',
        lastName: 'Miller',
        email: 'will.miller@email.com',
        phone: '555-1004',
        notes: 'Monthly deluxe package',
        totalVisits: 6,
        totalSpent: 540,
        lastVisit: new Date('2025-07-10')
      }
    }),
    prisma.client.create({
      data: {
        firstName: 'Christopher',
        lastName: 'Wilson',
        email: 'chris.wilson@email.com',
        phone: '555-1005',
        notes: 'Quick cuts, busy schedule',
        totalVisits: 4,
        totalSpent: 140,
        lastVisit: new Date('2025-07-12')
      }
    }),
    prisma.client.create({
      data: {
        firstName: 'Matthew',
        lastName: 'Taylor',
        email: 'matt.taylor@email.com',
        phone: '555-1006',
        notes: 'Traditional shaves preferred',
        preferredStylist: 'David Rodriguez',
        totalVisits: 10,
        totalSpent: 500,
        lastVisit: new Date('2025-07-16')
      }
    })
  ]);
  // Seed Products
  console.log('🧴 Seeding products...')
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Premium Pomade',
        brand: 'Modern Men Co',
        description: 'High-hold styling pomade with natural shine',
        price: 25,
        cost: 12,
        inStock: 50,
        category: 'Hair Products',
        sku: 'MM-POM-001',
        imageUrls: ['/products/pomade.jpg']
      }
    }),
    prisma.product.create({
      data: {
        name: 'Beard Oil',
        brand: 'Grooming Essentials',
        description: 'Nourishing beard conditioning oil with argan',
        price: 18,
        cost: 8,
        inStock: 35,
        category: 'Beard Care',
        sku: 'MM-OIL-001',
        imageUrls: ['/products/beard-oil.jpg']
      }
    }),
    prisma.product.create({
      data: {
        name: 'Clay Wax',
        brand: 'Style Masters',
        description: 'Matte finish styling clay for texture',
        price: 22,
        cost: 10,
        inStock: 40,
        category: 'Hair Products',
        sku: 'MM-WAX-001',
        imageUrls: ['/products/clay-wax.jpg']
      }
    }),    prisma.product.create({
      data: {
        name: 'Aftershave Balm',
        brand: 'Gentlemans Choice',
        description: 'Soothing post-shave treatment with aloe',
        price: 20,
        cost: 9,
        inStock: 25,
        category: 'Shaving',
        sku: 'MM-ASB-001',
        imageUrls: ['/products/aftershave.jpg']
      }
    }),
    prisma.product.create({
      data: {
        name: 'Shampoo Bar',
        brand: 'Natural Grooming',
        description: 'Natural ingredients, sulfate-free formula',
        price: 15,
        cost: 6,
        inStock: 60,
        category: 'Hair Care',
        sku: 'MM-SHP-001',
        imageUrls: ['/products/shampoo-bar.jpg']
      }
    }),
    prisma.product.create({
      data: {
        name: 'Beard Brush',
        brand: 'Premium Tools',
        description: 'Boar bristle beard brush for grooming',
        price: 30,
        cost: 15,
        inStock: 20,
        category: 'Tools',
        sku: 'MM-BRU-001',
        imageUrls: ['/products/beard-brush.jpg']
      }
    }),
    prisma.product.create({
      data: {
        name: 'Hair Trimmer',
        brand: 'Pro Cut',
        description: 'Professional grade home trimmer',
        price: 85,
        cost: 45,
        inStock: 10,
        category: 'Tools',
        sku: 'MM-TRM-001',
        imageUrls: ['/products/trimmer.jpg']
      }
    })
  ]);
  console.log('✅ Database seeding completed successfully!')
  console.log('📊 Seeded data summary:')
  console.log('  - Services: 6')
  console.log('  - Staff: 4')
  console.log('  - Clients: 6')
  console.log('  - Products: 7')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })