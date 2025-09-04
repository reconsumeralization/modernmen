import getPayloadClient from '../payload'
import { logger } from './logger'

export async function seedComprehensiveData() {
  try {
    const payload = await getPayloadClient()
    logger.info('🌱 Starting comprehensive data seeding...')

    // 1. Create Admin Users
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@modernmen.com',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        isActive: true,
        phone: '555-0001',
        preferences: {
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
          theme: 'dark',
          language: 'en',
        }
      }
    })

    const managerUser = await payload.create({
      collection: 'users',
      data: {
        email: 'manager@modernmen.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'manager',
        isActive: true,
        phone: '555-0002',
      }
    })

    logger.info('✅ Admin users created')

    // 2. Create Stylists
    const stylists = await Promise.all([
      payload.create({
        collection: 'stylists',
        data: {
          firstName: 'Marcus',
          lastName: 'Rodriguez',
          email: 'marcus@modernmen.com',
          phone: '555-0101',
          specialty: ['haircuts', 'beard-styling', 'color'],
          experience: 8,
          bio: 'Master stylist with 8+ years experience specializing in modern cuts and classic styles.',
          commissionRate: 45,
          isActive: true,
          schedule: {
            monday: { start: '09:00', end: '18:00', available: true },
            tuesday: { start: '09:00', end: '18:00', available: true },
            wednesday: { start: '10:00', end: '19:00', available: true },
            thursday: { start: '09:00', end: '18:00', available: true },
            friday: { start: '09:00', end: '20:00', available: true },
            saturday: { start: '08:00', end: '17:00', available: true },
            sunday: { available: false }
          },
          skills: [
            { name: 'Precision Cuts', level: 95 },
            { name: 'Color Techniques', level: 85 },
            { name: 'Beard Styling', level: 90 },
            { name: 'Customer Service', level: 92 }
          ]
        }
      }),
      payload.create({
        collection: 'stylists',
        data: {
          firstName: 'James',
          lastName: 'Thompson',
          email: 'james@modernmen.com',
          phone: '555-0102',
          specialty: ['classic-cuts', 'hot-towel-shave'],
          experience: 12,
          bio: 'Traditional barber specializing in classic cuts and hot towel shaves.',
          commissionRate: 50,
          isActive: true,
          schedule: {
            monday: { start: '08:00', end: '17:00', available: true },
            tuesday: { start: '08:00', end: '17:00', available: true },
            wednesday: { start: '08:00', end: '17:00', available: true },
            thursday: { start: '08:00', end: '17:00', available: true },
            friday: { start: '08:00', end: '18:00', available: true },
            saturday: { start: '07:00', end: '15:00', available: true },
            sunday: { available: false }
          }
        }
      }),
      payload.create({
        collection: 'stylists',
        data: {
          firstName: 'Alex',
          lastName: 'Chen',
          email: 'alex@modernmen.com',
          phone: '555-0103',
          specialty: ['modern-styles', 'texture-work'],
          experience: 5,
          bio: 'Creative stylist focused on modern trends and innovative styling techniques.',
          commissionRate: 40,
          isActive: true,
          schedule: {
            monday: { available: false },
            tuesday: { start: '11:00', end: '20:00', available: true },
            wednesday: { start: '11:00', end: '20:00', available: true },
            thursday: { start: '11:00', end: '20:00', available: true },
            friday: { start: '11:00', end: '21:00', available: true },
            saturday: { start: '09:00', end: '18:00', available: true },
            sunday: { start: '12:00', end: '17:00', available: true }
          }
        }
      })
    ])

    logger.info('✅ Stylists created')

    // 3. Create Comprehensive Services
    const services = await Promise.all([
      payload.create({
        collection: 'services',
        data: {
          name: 'Signature Cut & Style',
          description: 'Our premium haircut service with consultation, precision cutting, and professional styling.',
          category: 'haircut',
          price: 45,
          duration: 45,
          isActive: true,
          pointsEarned: 45,
          tags: ['premium', 'styling', 'consultation'],
          requirements: ['Hair wash included', 'Style consultation']
        }
      }),
      payload.create({
        collection: 'services',
        data: {
          name: 'Classic Gentleman\'s Cut',
          description: 'Traditional barbering with scissors and clippers for a timeless look.',
          category: 'haircut',
          price: 35,
          duration: 30,
          isActive: true,
          pointsEarned: 35
        }
      }),
      payload.create({
        collection: 'services',
        data: {
          name: 'Hot Towel Straight Razor Shave',
          description: 'Traditional straight razor shave with hot towel treatment and aftercare.',
          category: 'beard',
          price: 55,
          duration: 40,
          isActive: true,
          pointsEarned: 55
        }
      }),
      payload.create({
        collection: 'services',
        data: {
          name: 'Beard Trim & Shape',
          description: 'Professional beard trimming and shaping to complement your style.',
          category: 'beard',
          price: 25,
          duration: 20,
          isActive: true,
          pointsEarned: 25
        }
      }),
      payload.create({
        collection: 'services',
        data: {
          name: 'Color & Highlights',
          description: 'Professional hair coloring service with premium products.',
          category: 'color',
          price: 85,
          duration: 90,
          isActive: true,
          pointsEarned: 85
        }
      }),
      payload.create({
        collection: 'services',
        data: {
          name: 'Deep Conditioning Treatment',
          description: 'Restorative treatment for damaged or dry hair.',
          category: 'treatment',
          price: 35,
          duration: 30,
          isActive: true,
          pointsEarned: 35
        }
      })
    ])

    logger.info('✅ Services created')

    // 4. Create Sample Customers
    const customers = await Promise.all([
      payload.create({
        collection: 'customers',
        data: {
          firstName: 'Michael',
          lastName: 'Davis',
          email: 'michael.davis@email.com',
          phone: '555-1001',
          dateOfBirth: '1985-06-15',
          preferredStylist: stylists[0].id,
          visitCount: 12,
          totalSpent: 540,
          loyaltyPoints: 120,
          notes: 'Prefers shorter cuts, usually books monthly appointments.',
          preferences: {
            reminderDays: 2,
            preferredTime: 'morning',
            communicationMethod: 'email'
          }
        }
      }),
      payload.create({
        collection: 'customers',
        data: {
          firstName: 'Robert',
          lastName: 'Wilson',
          email: 'robert.wilson@email.com',
          phone: '555-1002',
          dateOfBirth: '1978-03-22',
          preferredStylist: stylists[1].id,
          visitCount: 24,
          totalSpent: 1200,
          loyaltyPoints: 200,
          notes: 'Regular customer, always books hot towel shaves.'
        }
      }),
      payload.create({
        collection: 'customers',
        data: {
          firstName: 'David',
          lastName: 'Lee',
          email: 'david.lee@email.com',
          phone: '555-1003',
          dateOfBirth: '1992-11-08',
          preferredStylist: stylists[2].id,
          visitCount: 8,
          totalSpent: 360,
          loyaltyPoints: 80,
          notes: 'Likes trying new styles, interested in color services.'
        }
      })
    ])

    logger.info('✅ Customers created')

    // 5. Create Appointments (Recent and Upcoming)
    const appointments = []
    
    // Create past appointments for commission calculation
    for (let i = 0; i < 15; i++) {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30) - 1)
      
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)]
      const randomService = services[Math.floor(Math.random() * services.length)]
      const randomStylist = stylists[Math.floor(Math.random() * stylists.length)]

      const appointment = await payload.create({
        collection: 'appointments',
        data: {
          customer: randomCustomer.id,
          stylist: randomStylist.id,
          service: randomService.id,
          dateTime: pastDate.toISOString(),
          status: 'completed',
          duration: randomService.duration,
          price: randomService.price,
          paymentStatus: 'paid',
          notes: 'Completed appointment - customer satisfied with service.'
        }
      })
      appointments.push(appointment)
    }

    // Create future appointments
    for (let i = 0; i < 10; i++) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 14) + 1)
      futureDate.setHours(9 + Math.floor(Math.random() * 9), 0, 0, 0)

      const randomCustomer = customers[Math.floor(Math.random() * customers.length)]
      const randomService = services[Math.floor(Math.random() * services.length)]
      const randomStylist = stylists[Math.floor(Math.random() * stylists.length)]

      await payload.create({
        collection: 'appointments',
        data: {
          customer: randomCustomer.id,
          stylist: randomStylist.id,
          service: randomService.id,
          dateTime: futureDate.toISOString(),
          status: 'confirmed',
          duration: randomService.duration,
          price: randomService.price,
          paymentStatus: 'pending'
        }
      })
    }

    logger.info('✅ Appointments created')

    // 6. Create Commission Records
    const commissionPeriodStart = new Date()
    commissionPeriodStart.setDate(1) // First of current month
    const commissionPeriodEnd = new Date()
    commissionPeriodEnd.setMonth(commissionPeriodEnd.getMonth() + 1, 0) // Last day of current month

    for (const stylist of stylists) {
      // Get completed appointments for this stylist in the period
      const stylistAppointments = appointments
        .filter(apt => apt.stylist === stylist.id && apt.status === 'completed')
        .slice(0, 5) // Take first 5 for demo

      const appointmentData = stylistAppointments.map(apt => ({
        appointment: apt.id,
        service: apt.service,
        saleAmount: apt.price * 100, // Convert to cents
        commissionRate: stylist.commissionRate || 45
      }))

      await payload.create({
        collection: 'commissions',
        data: {
          stylist: stylist.id,
          period: {
            startDate: commissionPeriodStart,
            endDate: commissionPeriodEnd
          },
          appointments: appointmentData,
          deductions: [
            {
              type: 'product-usage',
              amount: 500, // $5.00 in cents
              reason: 'Premium product usage adjustment',
              date: new Date()
            }
          ],
          adjustments: [
            {
              type: 'performance-bonus',
              amount: 2000, // $20.00 bonus in cents
              reason: 'Exceeded monthly targets',
              date: new Date()
            }
          ],
          payment: {
            status: 'calculated'
          }
        }
      })
    }

    logger.info('✅ Commission records created')

    // 7. Create Service Packages
    await payload.create({
      collection: 'service-packages',
      data: {
        name: 'The Gentleman\'s Package',
        description: 'Complete grooming experience with cut, shave, and treatment.',
        services: [services[0].id, services[2].id, services[5].id],
        originalPrice: 135,
        packagePrice: 115,
        validityDays: 90,
        isActive: true,
        pointsEarned: 115
      }
    })

    await payload.create({
      collection: 'service-packages',
      data: {
        name: 'Monthly Maintenance',
        description: 'Perfect for regular customers - includes cut and trim.',
        services: [services[1].id, services[3].id],
        originalPrice: 60,
        packagePrice: 50,
        validityDays: 30,
        isActive: true,
        pointsEarned: 50
      }
    })

    logger.info('✅ Service packages created')

    // 8. Create Inventory Items
    const inventoryItems = [
      {
        name: 'Premium Hair Pomade',
        description: 'High-quality styling pomade for all hair types.',
        category: 'styling-products',
        currentStock: 24,
        minStock: 5,
        maxStock: 50,
        unitCost: 12.50,
        retailPrice: 25.00,
        supplier: 'Premium Hair Co.',
        isActive: true
      },
      {
        name: 'Professional Scissors',
        description: 'Japanese steel precision cutting scissors.',
        category: 'tools',
        currentStock: 6,
        minStock: 2,
        maxStock: 10,
        unitCost: 120.00,
        retailPrice: 0, // Not for sale
        supplier: 'Professional Tools Ltd.',
        isActive: true
      },
      {
        name: 'Beard Oil - Sandalwood',
        description: 'Natural beard oil with sandalwood scent.',
        category: 'beard-care',
        currentStock: 15,
        minStock: 3,
        maxStock: 30,
        unitCost: 8.00,
        retailPrice: 18.00,
        supplier: 'Natural Grooming Co.',
        isActive: true
      }
    ]

    for (const item of inventoryItems) {
      await payload.create({
        collection: 'inventory',
        data: item
      })
    }

    logger.info('✅ Inventory created')

    // 9. Create Wait List Entries
    await payload.create({
      collection: 'wait-list',
      data: {
        customer: customers[0].id,
        customerName: `${customers[0].firstName} ${customers[0].lastName}`,
        service: services[0].id,
        stylist: stylists[0].id,
        dateTimeRequested: new Date(Date.now() + 86400000 * 3), // 3 days from now
        contactPreferredMethod: 'email',
        priority: 'high',
        status: 'waiting',
        source: 'website',
        notes: 'Customer specifically requested this stylist for important event.'
      }
    })

    logger.info('✅ Wait list entries created')

    // 10. Create Notifications
    await payload.create({
      collection: 'notifications',
      data: {
        type: 'appointment-reminder',
        recipient: customers[0].id,
        title: 'Appointment Reminder',
        message: 'Your appointment with Marcus is tomorrow at 2:00 PM.',
        status: 'pending',
        priority: 'normal',
        scheduledFor: new Date(Date.now() + 86400000), // Tomorrow
        channels: ['email', 'sms']
      }
    })

    await payload.create({
      collection: 'notifications',
      data: {
        type: 'system-alert',
        recipient: adminUser.id,
        title: 'Low Inventory Alert',
        message: 'Premium Hair Pomade is running low (5 units remaining).',
        status: 'sent',
        priority: 'high',
        scheduledFor: new Date(),
        channels: ['email', 'push']
      }
    })

    logger.info('✅ Notifications created')

    logger.info('🎉 Comprehensive data seeding completed successfully!')
    
    return {
      message: 'Comprehensive seeding completed',
      counts: {
        users: 2,
        stylists: 3,
        services: 6,
        customers: 3,
        appointments: 25,
        commissions: 3,
        packages: 2,
        inventory: 3,
        waitList: 1,
        notifications: 2
      }
    }

  } catch (error) {
    logger.error('❌ Comprehensive seeding failed:', { operation: 'comprehensive_seed' }, error instanceof Error ? error : undefined)
    throw error
  }
}