import { PrismaClient, StaffRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Dummy Staff Data
  const staffData = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@modernmen.ca',
      phone: '555-111-2222',
      role: StaffRole.STYLIST,
      specialties: ['Classic Cuts', 'Modern Styles', 'Beard Trims'],
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      isActive: true,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@modernmen.ca',
      phone: '555-333-4444',
      role: StaffRole.BARBER,
      specialties: ['Hot Shaves', 'Fades', 'Traditional Cuts'],
      workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      startTime: '10:00',
      endTime: '18:00',
      breakStart: '13:00',
      breakEnd: '14:00',
      isActive: true,
    },
    {
      firstName: 'Peter',
      lastName: 'Jones',
      email: 'peter.jones@modernmen.ca',
      phone: '555-555-6666',
      role: StaffRole.STYLIST,
      specialties: ['Long Hair Styles', 'Coloring', 'Hair Treatments'],
      workingDays: ['monday', 'wednesday', 'friday'],
      startTime: '09:30',
      endTime: '17:30',
      breakStart: '12:30',
      breakEnd: '13:30',
      isActive: true,
    },
  ]

  for (const staff of staffData) {
    await prisma.staff.upsert({
      where: { email: staff.email },
      update: {},
      create: staff,
    })
  }
  console.log('Staff seeding completed.')

  // Dummy Client Data
  const hashedPassword = await bcrypt.hash('password123', 10)
  const clientData = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '555-777-8888',
      password: hashedPassword,
    },
    {
      firstName: 'Mike',
      lastName: 'Brown',
      email: 'mike.brown@email.com',
      phone: '555-999-0000',
      password: hashedPassword,
    },
    {
      firstName: 'Rob',
      lastName: 'Davis',
      email: 'rob.davis@email.com',
      phone: '555-222-1111',
      password: hashedPassword,
    },
  ]

  for (const client of clientData) {
    await prisma.client.upsert({
      where: { email: client.email },
      update: {},
      create: client,
    })
  }
  console.log('Client seeding completed.')

  // Dummy Product Data
  const productData = [
    {
      name: 'Classic Pomade',
      brand: 'Modern Man Grooming',
      description: 'A water-based pomade for a strong hold and natural finish. Perfect for classic styles.',
      price: 25.00,
      cost: 10.00,
      category: 'Hair Care',
      inStock: 150,
      minStock: 20,
      sku: 'MMG-POM-001',
      barcode: '1234567890123',
      imageUrls: ['/images/sample.png'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Luxury Shaving Cream',
      brand: 'Smooth Glide',
      description: 'Rich, moisturizing shaving cream for a close and comfortable shave. Infused with essential oils.',
      price: 18.50,
      cost: 7.50,
      category: 'Shaving',
      inStock: 100,
      minStock: 15,
      sku: 'SG-SHV-002',
      barcode: '1234567890124',
      imageUrls: ['/images/sample.png'],
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Beard Oil - Cedarwood',
      brand: 'Forest & Field',
      description: 'Nourishing beard oil with a masculine cedarwood scent. Tames and conditions your beard.',
      price: 22.00,
      cost: 9.00,
      category: 'Beard Care',
      inStock: 80,
      minStock: 10,
      sku: 'FF-BRD-003',
      barcode: '1234567890125',
      imageUrls: ['/images/sample.png'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Matte Hair Clay',
      brand: 'Urban Style',
      description: 'Provides a strong, pliable hold with a natural matte finish. Ideal for textured looks.',
      price: 20.00,
      cost: 8.00,
      category: 'Hair Care',
      inStock: 120,
      minStock: 18,
      sku: 'US-HCL-004',
      barcode: '1234567890126',
      imageUrls: ['/images/sample.png'],
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Aftershave Balm - Cooling Mint',
      brand: 'Fresh Start',
      description: 'Soothes and refreshes skin after shaving. Non-greasy formula with a cooling mint sensation.',
      price: 15.00,
      cost: 6.00,
      category: 'Shaving',
      inStock: 90,
      minStock: 12,
      sku: 'FS-ASB-005',
      barcode: '1234567890127',
      imageUrls: ['/images/sample.png'],
      isActive: true,
      isFeatured: false,
    },
  ]

  for (const product of productData) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    })
  }
  console.log('Product seeding completed.')

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })