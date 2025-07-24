import { prisma } from '@/lib/prisma'

async function main() {
  console.log('🌱 Starting database seeding...')

  // Check if data already exists
  const existingClients = await prisma.client.count()
  if (existingClients > 0) {
    console.log('📋 Database already has data, skipping seed')
    return
  }

  // Seed Services
  console.log('🔧 Seeding services...')
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
        name: 'Buzz Cut',
        description: 'Short all-over haircut',
        duration: 30,
        price: 25,
        category: 'Haircuts',
        addOns: ['beard trim']
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
        name: 'Full Beard Styling',
        description: 'Complete beard grooming service',
        duration: 45,
        price: 35,
        category: 'Beard Care',
        addOns: ['hot towel', 'beard oil', 'mustache wax']
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
        name: 'Head Shave',
        description: 'Complete head shaving service',
        duration: 30,
        price: 30,
        category: 'Shaving',
        addOns: ['hot towel', 'scalp moisturizer']
      },
      {
        name: 'Hair Wash & Style',
        description: 'Professional hair washing and styling',
        duration: 30,
        price: 20,
        category: 'Styling',
        addOns: ['scalp massage', 'hair treatment']
      },
      {
        name: 'Hair Treatment',
        description: 'Deep conditioning hair treatment',
        duration: 45,
        price: 40,
        category: 'Treatments',
        addOns: ['scalp massage', 'styling']
      },
      {
        name: 'Father & Son Package',
        description: 'Haircut package for father and child',
        duration: 90,
        price: 60,
        category: 'Packages',
        addOns: ['styling', 'photos']
      }
    ]
  })

  // Seed Staff
  console.log('👥 Seeding staff...')
  const staff = await prisma.staff.createMany({
    data: [
      {
        firstName: 'Hicham',
        lastName: 'Mellouli',
        email: 'hicham@modernmen.ca',
        phone: '(306) 555-0101',
        role: 'OWNER',
        specialties: ['All Cuts', 'Beard Styling', 'Classic Styles', 'Fades'],
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
        specialties: ['Modern Cuts', 'Fades', 'Styling', 'Color'],
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
        specialties: ['Classic Cuts', 'Shaves', 'Beard Care', 'Traditional Styles'],
        workingDays: ['monday', 'wednesday', 'thursday', 'friday', 'saturday'],
        startTime: '09:30',
        endTime: '17:30',
        breakStart: '12:00',
        breakEnd: '13:00',
        rating: 4.7
      }
    ]
  })

  // Seed some sample products
  console.log('🧴 Seeding products...')
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Premium Pomade',
        brand: 'ModernMen',
        description: 'High-hold, low-shine styling pomade',
        price: 25.99,
        cost: 12.50,
        category: 'Hair Care',
        inStock: 50,
        minStock: 10,
        sku: 'MM-POMADE-001',
        imageUrls: [],
        isFeatured: true
      },
      {
        name: 'Beard Oil - Sandalwood',
        brand: 'ModernMen',
        description: 'Nourishing beard oil with sandalwood scent',
        price: 19.99,
        cost: 8.00,
        category: 'Beard Care',
        inStock: 30,
        minStock: 5,
        sku: 'MM-BEARD-OIL-001',
        imageUrls: [],
        isFeatured: true
      },
      {
        name: 'Hair Wax - Strong Hold',
        brand: 'ModernMen',
        description: 'Strong hold hair wax for all-day styling',
        price: 22.99,
        cost: 10.00,
        category: 'Hair Care',
        inStock: 25,
        minStock: 8,
        sku: 'MM-WAX-001',
        imageUrls: []
      },
      {
        name: 'Aftershave Balm',
        brand: 'ModernMen',
        description: 'Soothing aftershave balm for sensitive skin',
        price: 18.99,
        cost: 7.50,
        category: 'Shaving',
        inStock: 40,
        minStock: 10,
        sku: 'MM-AFTERSHAVE-001',
        imageUrls: []
      },
      {
        name: 'Styling Gel',
        brand: 'ModernMen',
        description: 'Medium hold styling gel with natural finish',
        price: 16.99,
        cost: 6.50,
        category: 'Hair Care',
        inStock: 35,
        minStock: 12,
        sku: 'MM-GEL-001',
        imageUrls: []
      }
    ]
  })

  console.log(`✅ Seeded ${services.count} services`)
  console.log(`✅ Seeded ${staff.count} staff members`) 
  console.log(`✅ Seeded ${products.count} products`)
  console.log('🌱 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Database seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
