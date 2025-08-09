import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // Clear existing data (optional - be careful in production)
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
    const services = [
      { name: 'Classic Haircut', description: 'Traditional scissor cut with styling', duration: 30, price: 35, category: 'Haircuts' },
      { name: 'Fade Cut', description: 'Modern fade with precise blending', duration: 45, price: 45, category: 'Haircuts' },
      { name: 'Beard Trim', description: 'Professional beard shaping and styling', duration: 20, price: 25, category: 'Grooming' },
      { name: 'Hot Towel Shave', description: 'Traditional straight razor shave with hot towel', duration: 40, price: 50, category: 'Shaving' },
      { name: 'Hair Wash & Style', description: 'Deep cleanse with premium styling', duration: 25, price: 20, category: 'Styling' },
      { name: 'Deluxe Package', description: 'Haircut, beard trim, and hot towel treatment', duration: 75, price: 90, category: 'Packages' }
    ];

    for (const service of services) {
      await prisma.service.create({
        data: {
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          category: service.category,
          addOns: [],
          isActive: true
        }
      })
    }

    // Seed Staff
    console.log('👨‍💼 Seeding staff...')
    const staff = [
      { 
        firstName: 'Marcus', 
        lastName: 'Johnson', 
        email: 'marcus@modernmen.com',
        phone: '(306) 555-0101', 
        role: 'BARBER',
        specialties: ['Fades', 'Modern Cuts'],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '09:00',
        endTime: '17:00'
      },
      { 
        firstName: 'David', 
        lastName: 'Rodriguez', 
        email: 'david@modernmen.com',
        phone: '(306) 555-0102', 
        role: 'BARBER',
        specialties: ['Classic Cuts', 'Shaves'],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '09:00',
        endTime: '17:00'
      },
      { 
        firstName: 'James', 
        lastName: 'Wilson', 
        email: 'james@modernmen.com',
        phone: '(306) 555-0103', 
        role: 'STYLIST',
        specialties: ['Beard Styling', 'Grooming'],
        workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        startTime: '10:00',
        endTime: '18:00'
      },
      { 
        firstName: 'Antonio', 
        lastName: 'Garcia', 
        email: 'antonio@modernmen.com',
        phone: '(306) 555-0104', 
        role: 'MANAGER',
        specialties: ['All Services'],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        startTime: '08:00',
        endTime: '19:00'
      }
    ];

    for (const member of staff) {
      await prisma.staff.create({
        data: {
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phone,
          role: member.role as any,
          specialties: member.specialties,
          workingDays: member.workingDays,
          startTime: member.startTime,
          endTime: member.endTime,
          totalBookings: 0,
          rating: 0,
          isActive: true
        }
      })
    }

    // Seed Clients
    console.log('👥 Seeding clients...')
    const clients = [
      { 
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(306) 555-1001',
        notes: 'Likes fade cuts, prefers Marcus',
        preferredStylist: 'Marcus Johnson',
        totalVisits: 12,
        totalSpent: 420,
        lastVisit: new Date('2025-07-20')
      },
      { 
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'mike.brown@email.com',
        phone: '(306) 555-1002',
        notes: 'Regular customer, classic cuts only',
        totalVisits: 8,
        totalSpent: 280,
        lastVisit: new Date('2025-07-15')
      },
      { 
        firstName: 'Robert',
        lastName: 'Davis',
        email: 'rob.davis@email.com',
        phone: '(306) 555-1003',
        notes: 'Beard maintenance specialist',
        preferredStylist: 'James Wilson',
        totalVisits: 15,
        totalSpent: 375,
        lastVisit: new Date('2025-07-18')
      },
      { 
        firstName: 'William',
        lastName: 'Miller',
        email: 'will.miller@email.com',
        phone: '(306) 555-1004',
        notes: 'Monthly deluxe package',
        totalVisits: 6,
        totalSpent: 540,
        lastVisit: new Date('2025-07-10')
      },
      { 
        firstName: 'Christopher',
        lastName: 'Wilson',
        email: 'chris.wilson@email.com',
        phone: '(306) 555-1005',
        notes: 'Quick cuts, busy schedule',
        totalVisits: 4,
        totalSpent: 140,
        lastVisit: new Date('2025-07-12')
      },
      { 
        firstName: 'Matthew',
        lastName: 'Taylor',
        email: 'matt.taylor@email.com',
        phone: '(306) 555-1006',
        notes: 'Traditional shaves preferred',
        preferredStylist: 'David Rodriguez',
        totalVisits: 10,
        totalSpent: 500,
        lastVisit: new Date('2025-07-16')
      }
    ];

    for (const client of clients) {
      await prisma.client.create({
        data: {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          notes: client.notes,
          preferredStylist: client.preferredStylist,
          totalVisits: client.totalVisits,
          totalSpent: client.totalSpent,
          lastVisit: client.lastVisit
        }
      })
    }

    // Seed Products
    console.log('🧴 Seeding products...')
    const products = [
      { 
        name: 'Premium Pomade', 
        brand: 'Modern Men Co',
        description: 'High-hold styling pomade with natural shine', 
        price: 25, 
        cost: 12,
        inStock: 50, 
        category: 'Hair Products',
        sku: 'MM-POM-001',
        imageUrls: ['/products/pomade.jpg']
      },
      { 
        name: 'Beard Oil', 
        brand: 'Grooming Essentials',
        description: 'Nourishing beard conditioning oil with argan', 
        price: 18, 
        cost: 8,
        inStock: 35, 
        category: 'Beard Care',
        sku: 'MM-OIL-001',
        imageUrls: ['/products/beard-oil.jpg']
      },
      { 
        name: 'Clay Wax', 
        brand: 'Style Masters',
        description: 'Matte finish styling clay for texture', 
        price: 22, 
        cost: 10,
        inStock: 40, 
        category: 'Hair Products',
        sku: 'MM-WAX-001',
        imageUrls: ['/products/clay-wax.jpg']
      },
      { 
        name: 'Aftershave Balm', 
        brand: 'Gentleman\'s Choice',
        description: 'Soothing post-shave treatment with aloe', 
        price: 20, 
        cost: 9,
        inStock: 25, 
        category: 'Shaving',
        sku: 'MM-ASB-001',
        imageUrls: ['/products/aftershave.jpg']
      },
      { 
        name: 'Shampoo Bar', 
        brand: 'Natural Grooming',
        description: 'Natural ingredients, sulfate-free formula', 
        price: 15, 
        cost: 6,
        inStock: 60, 
        category: 'Hair Care',
        sku: 'MM-SHP-001',
        imageUrls: ['/products/shampoo-bar.jpg']
      },
      { 
        name: 'Beard Brush', 
        brand: 'Premium Tools',
        description: 'Boar bristle beard brush for grooming', 
        price: 30, 
        cost: 15,
        inStock: 20, 
        category: 'Tools',
        sku: 'MM-BRU-001',
        imageUrls: ['/products/beard-brush.jpg']
      },
      { 
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
    ];

    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          brand: product.brand,
          description: product.description,
          price: product.price,
          cost: product.cost,
          category: product.category,
          inStock: product.inStock,
          minStock: 5,
          sku: product.sku,
          imageUrls: product.imageUrls,
          isActive: true,
          isFeatured: false
        }
      })
    }

    console.log('✅ Database seeding completed successfully!')
    console.log('📊 Seeded data summary:')
    console.log('  - Services: 6')
    console.log('  - Staff: 4')
    console.log('  - Clients: 6') 
    console.log('  - Products: 7')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Main execution
async function main() {
  try {
    await seedDatabase()
    console.log('🎉 Seeding process completed!')
  } catch (error) {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeder if called directly
if (require.main === module) {
  main()
}

export default seedDatabase