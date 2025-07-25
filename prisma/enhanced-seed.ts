import { PrismaClient, StaffRole, BookingStatus, OrderStatus, PaymentStatus } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import bcryptjs from 'bcryptjs'

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') })
config({ path: resolve(__dirname, '../.env') })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive database seeding with authentication...')

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
        description: 'Traditional scissor cut with professional styling and consultation',
        duration: 30,
        price: 35,
        category: 'Haircuts',
        addOns: ['Beard Trim', 'Hot Towel', 'Scalp Massage']
      }
    }),
    prisma.service.create({
      data: {
        name: 'Signature Fade',
        description: 'Modern fade cut with precise blending and razor work',
        duration: 45,
        price: 45,
        category: 'Haircuts',
        addOns: ['Beard Line Up', 'Hot Towel Finish']
      }
    }),
    prisma.service.create({
      data: {
        name: 'Professional Beard Trim',
        description: 'Expert beard shaping, trimming, and conditioning treatment',
        duration: 20,
        price: 25,
        category: 'Grooming',
        addOns: ['Mustache Trim', 'Beard Oil Treatment']
      }
    }),
    prisma.service.create({
      data: {
        name: 'Traditional Hot Towel Shave',
        description: 'Luxury straight razor shave with hot towel treatment and aftercare',
        duration: 40,
        price: 50,
        category: 'Shaving',
        addOns: ['Face Moisturizing', 'Aftershave Balm']
      }
    }),
    prisma.service.create({
      data: {
        name: 'Deluxe Hair Treatment',
        description: 'Deep cleanse, conditioning treatment, and premium styling',
        duration: 25,
        price: 30,
        category: 'Treatments',
        addOns: ['Scalp Massage', 'Hair Mask']
      }
    }),
    prisma.service.create({
      data: {
        name: 'The Complete Gentleman',
        description: 'Full service package: haircut, beard trim, hot towel shave, and styling',
        duration: 90,
        price: 120,
        category: 'Packages',
        addOns: ['Premium Products', 'Relaxation Package']
      }
    })
  ]);

  // Seed Staff with enhanced profiles
  console.log('👨‍💼 Seeding expert staff...')
  const staff = await Promise.all([
    prisma.staff.create({
      data: {
        firstName: 'Marcus',
        lastName: 'Johnson',
        email: 'marcus@modernmen.com',
        phone: '555-0101',
        role: StaffRole.BARBER,
        specialties: ['Modern Fades', 'Creative Cuts', 'Beard Artistry'],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '09:00',
        endTime: '17:00',
        totalBookings: 156,
        rating: 4.9
      }
    }),    prisma.staff.create({
      data: {
        firstName: 'David',
        lastName: 'Rodriguez',
        email: 'david@modernmen.com',
        phone: '555-0102',
        role: StaffRole.BARBER,
        specialties: ['Classic Cuts', 'Traditional Shaves', 'Vintage Styling'],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '09:00',
        endTime: '17:00',
        totalBookings: 142,
        rating: 4.8
      }
    }),
    prisma.staff.create({
      data: {
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james@modernmen.com',
        phone: '555-0103',
        role: StaffRole.STYLIST,
        specialties: ['Beard Design', 'Grooming Consultation', 'Product Specialist'],
        workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        startTime: '10:00',
        endTime: '18:00',
        totalBookings: 98,
        rating: 4.7
      }
    }),
    prisma.staff.create({
      data: {
        firstName: 'Antonio',
        lastName: 'Garcia',
        email: 'antonio@modernmen.com',
        phone: '555-0104',
        role: StaffRole.MANAGER,
        specialties: ['Complete Packages', 'VIP Services', 'Consultation'],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        startTime: '08:00',
        endTime: '19:00',
        totalBookings: 203,
        rating: 5.0
      }
    })
  ]);

  // Seed Clients with authentication
  console.log('👥 Seeding clients with secure authentication...')
  const hashedPassword = await bcryptjs.hash('password123', 12)
  
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '555-1001',
        password: hashedPassword,
        address: '123 Main Street',
        city: 'Regina',
        province: 'SK',
        postalCode: 'S4N 1A1',
        notes: 'Prefers modern cuts and fades, regular customer',
        preferredStylist: 'Marcus Johnson',
        hairType: 'Thick',
        totalVisits: 15,
        totalSpent: 675,
        lastVisit: new Date('2025-07-20')
      }
    }),
    prisma.client.create({
      data: {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'mike.brown@email.com',
        phone: '555-1002',
        password: hashedPassword,
        address: '456 Oak Avenue',
        city: 'Regina',
        province: 'SK',
        postalCode: 'S4N 2B2',
        notes: 'Classic cuts only, very particular about length',
        hairType: 'Fine',
        totalVisits: 12,
        totalSpent: 420,
        lastVisit: new Date('2025-07-18')
      }
    }),    prisma.client.create({
      data: {
        firstName: 'Robert',
        lastName: 'Davis',
        email: 'rob.davis@email.com',
        phone: '555-1003',
        password: hashedPassword,
        address: '789 Pine Street',
        city: 'Regina',
        province: 'SK',
        postalCode: 'S4N 3C3',
        notes: 'Beard specialist, monthly maintenance appointments',
        preferredStylist: 'James Wilson',
        hairType: 'Curly',
        skinSensitivity: 'Sensitive',
        totalVisits: 18,
        totalSpent: 900,
        lastVisit: new Date('2025-07-22')
      }
    }),
    prisma.client.create({
      data: {
        firstName: 'William',
        lastName: 'Miller',
        email: 'will.miller@email.com',
        phone: '555-1004',
        password: hashedPassword,
        address: '321 Elm Drive',
        city: 'Regina',
        province: 'SK',
        postalCode: 'S4N 4D4',
        notes: 'Executive client, prefers complete packages',
        preferredStylist: 'Antonio Garcia',
        hairType: 'Normal',
        totalVisits: 8,
        totalSpent: 960,
        lastVisit: new Date('2025-07-15')
      }
    }),
    prisma.client.create({
      data: {
        firstName: 'Christopher',
        lastName: 'Wilson',
        email: 'chris.wilson@email.com',
        phone: '555-1005',
        password: hashedPassword,
        address: '654 Maple Court',
        city: 'Regina',
        province: 'SK',
        postalCode: 'S4N 5E5',
        notes: 'Quick service preferred, busy professional',
        hairType: 'Thin',
        totalVisits: 6,
        totalSpent: 210,
        lastVisit: new Date('2025-07-19')
      }
    }),
    prisma.client.create({
      data: {
        firstName: 'Matthew',
        lastName: 'Taylor',
        email: 'matt.taylor@email.com',
        phone: '555-1006',
        password: hashedPassword,
        address: '987 Cedar Lane',
        city: 'Regina',
        province: 'SK',
        postalCode: 'S4N 6F6',
        notes: 'Traditional shave enthusiast, collector of vintage grooming',
        preferredStylist: 'David Rodriguez',
        hairType: 'Coarse',
        totalVisits: 14,
        totalSpent: 700,
        lastVisit: new Date('2025-07-21')
      }
    })
  ]);
  // Enhanced Products with better descriptions and branding
  console.log('🧴 Seeding premium products...')
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Modern Men Signature Pomade',
        brand: 'Modern Men Collection',
        description: 'Premium water-based pomade with strong hold and natural shine. Perfect for classic and modern styles.',
        price: 28,
        cost: 14,
        inStock: 45,
        category: 'Hair Styling',
        sku: 'MM-POM-SIG',
        imageUrls: ['/products/signature-pomade.jpg'],
        isFeatured: true
      }
    }),
    prisma.product.create({
      data: {
        name: 'Gentleman\'s Beard Oil',
        brand: 'Vintage Grooming Co',
        description: 'Handcrafted beard oil with cedarwood and sandalwood. Nourishes and conditions for a healthy beard.',
        price: 24,
        cost: 12,
        inStock: 38,
        category: 'Beard Care',
        sku: 'VGC-OIL-GEN',
        imageUrls: ['/products/gentleman-beard-oil.jpg'],
        isFeatured: true
      }
    }),
    prisma.product.create({
      data: {
        name: 'Texturizing Clay Wax',
        brand: 'Urban Style Labs',
        description: 'Matte finish clay with strong hold. Creates texture and volume without shine.',
        price: 26,
        cost: 13,
        inStock: 42,
        category: 'Hair Styling',
        sku: 'USL-CLAY-TEX',
        imageUrls: ['/products/clay-wax.jpg']
      }
    }),
    prisma.product.create({
      data: {
        name: 'Luxury Aftershave Balm',
        brand: 'Classic Shave Society',
        description: 'Alcohol-free aftershave balm with aloe vera and vitamin E. Soothes and moisturizes after shaving.',
        price: 22,
        cost: 11,
        inStock: 35,
        category: 'Shave Care',
        sku: 'CSS-BALM-LUX',
        imageUrls: ['/products/aftershave-balm.jpg']
      }
    }),
    prisma.product.create({
      data: {
        name: 'Natural Shampoo Bar',
        brand: 'Eco Grooming',
        description: 'Solid shampoo bar with natural ingredients. Sulfate-free, long-lasting, and eco-friendly.',
        price: 18,
        cost: 8,
        inStock: 55,
        category: 'Hair Care',
        sku: 'ECO-SHP-NAT',
        imageUrls: ['/products/shampoo-bar.jpg']
      }
    }),
    prisma.product.create({
      data: {
        name: 'Professional Beard Brush',
        brand: 'Heritage Tools',
        description: 'Handcrafted boar bristle brush with wooden handle. Perfect for beard grooming and styling.',
        price: 35,
        cost: 18,
        inStock: 25,
        category: 'Grooming Tools',
        sku: 'HT-BRUSH-PRO',
        imageUrls: ['/products/beard-brush.jpg']
      }
    }),
    prisma.product.create({
      data: {
        name: 'Cordless Hair Trimmer Pro',
        brand: 'BarberTech',
        description: 'Professional cordless trimmer with ceramic blades. 8-hour battery life and precision cutting.',
        price: 120,
        cost: 65,
        inStock: 15,
        category: 'Professional Tools',
        sku: 'BT-TRIM-PRO',
        imageUrls: ['/products/trimmer-pro.jpg'],
        isFeatured: true
      }
    }),
    prisma.product.create({
      data: {
        name: 'Moisturizing Face Cream',
        brand: 'Gentlemen\'s Skincare',
        description: 'Daily moisturizing cream for men. Non-greasy formula with SPF 15 protection.',
        price: 32,
        cost: 16,
        inStock: 28,
        category: 'Skin Care',
        sku: 'GS-CREAM-MOIST',
        imageUrls: ['/products/face-cream.jpg']
      }
    })
  ]);
  console.log('✅ Enhanced database seeding completed successfully!')
  console.log('📊 Comprehensive data summary:')
  console.log('  - Enhanced Services: 6 (with add-ons)')
  console.log('  - Expert Staff: 4 (with ratings and specialties)')
  console.log('  - Authenticated Clients: 6 (with full profiles)')
  console.log('  - Premium Products: 8 (with detailed descriptions)')
  console.log('')
  console.log('🔐 Authentication Details:')
  console.log('  - Admin: admin / admin123')
  console.log('  - Customer Password: password123')
  console.log('  - All passwords properly hashed')
  console.log('')
  console.log('🎯 Ready for comprehensive testing!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })