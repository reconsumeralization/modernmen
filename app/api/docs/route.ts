import { NextResponse } from 'next/server'

export async function GET() {
  const apiDocs = {
    info: {
      title: 'Modern Men Hair Salon API',
      version: '1.0.0',
      description: 'API documentation for the Modern Men Hair Salon application.'
    },
    paths: {
      // Client Management
      clients: {
        'GET /api/clients': {
          description: 'Get all clients with optional filters',
          parameters: {
            search: 'string - Search by name, email, or phone',
            page: 'number - Page number',
            limit: 'number - Items per page',
            sortBy: 'string - Field to sort by',
            sortOrder: 'asc | desc - Sort order'
          },
          response: 'Array of clients with pagination'
        },
        'POST /api/clients': {
          description: 'Create new client',
          body: {
            firstName: 'string (required)',
            lastName: 'string (required)',
            email: 'string (required)',
            phone: 'string (required)',
            dateOfBirth: 'string (optional)',
            address: 'string (optional)',
            city: 'string (optional)',
            province: 'string (optional)',
            postalCode: 'string (optional)',
            notes: 'string (optional)',
            preferredStylist: 'string (optional)',
            allergies: 'string (optional)',
            hairType: 'string (optional)',
            skinSensitivity: 'string (optional)'
          },
          response: 'Created client object'
        },
        'GET /api/clients/[id]': {
          description: 'Get single client with full details',
          response: 'Client object with bookings, orders, loyalty points, and notes'
        },
        'PUT /api/clients/[id]': {
          description: 'Update client information',
          body: 'Same as POST but all fields optional',
          response: 'Updated client object'
        },
        'DELETE /api/clients/[id]': {
          description: 'Delete client (only if no active bookings/orders)',
          response: 'Success message'
        }
      },

      // Booking Management
      bookings: {
        'GET /api/bookings': {
          description: 'Get booking status (public endpoint)',
          parameters: {
            bookingId: 'string - Booking ID to check status'
          },
          response: 'Booking status information'
        },
        'POST /api/bookings': {
          description: 'Create booking request (public endpoint)',
          body: {
            name: 'string (required)',
            phone: 'string (required)',
            email: 'string (required)',
            service: 'string (required)',
            staff: 'string (optional)',
            date: 'string (optional)',
            time: 'string (optional)',
            message: 'string (optional)'
          },
          response: 'Booking confirmation with ID'
        },
        'GET /api/admin/bookings': {
          description: 'Get all bookings with filters (admin)',
          parameters: {
            date: 'string - Filter by specific date',
            status: 'string - Filter by booking status',
            staffId: 'string - Filter by staff member',
            clientId: 'string - Filter by client',
            page: 'number - Page number',
            limit: 'number - Items per page'
          },
          response: 'Array of bookings with pagination'
        },
        'POST /api/admin/bookings': {
          description: 'Create new booking (admin)',
          body: {
            clientId: 'string (required)',
            staffId: 'string (required)',
            serviceId: 'string (required)',
            date: 'string (required)',
            startTime: 'string (required)',
            status: 'string (optional)',
            notes: 'string (optional)',
            paymentStatus: 'string (optional)'
          },
          response: 'Created booking object'
        }
      },

      // Services
      services: {
        'GET /api/services': {
          description: 'Get all services',
          parameters: {
            category: 'string - Filter by category',
            active: 'boolean - Filter by active status'
          },
          response: 'Array of services grouped by category'
        },
        'POST /api/services': {
          description: 'Create new service',
          body: {
            name: 'string (required)',
            description: 'string (optional)',
            duration: 'number (required) - minutes',
            price: 'number (required)',
            category: 'string (required)',
            addOns: 'array (optional)',
            isActive: 'boolean (optional)'
          },
          response: 'Created service object'
        }
      },

      // Staff Management
      staff: {
        'GET /api/staff': {
          description: 'Get all staff members',
          parameters: {
            role: 'string - Filter by role',
            active: 'boolean - Filter by active status'
          },
          response: 'Array of staff with performance metrics'
        }
      },

      // Products
      products: {
        'GET /api/products': {
          description: 'Get all products with filters',
          parameters: {
            search: 'string - Search by name, brand, description, SKU',
            category: 'string - Filter by category',
            brand: 'string - Filter by brand',
            inStock: 'boolean - Filter by stock status',
            featured: 'boolean - Filter by featured status',
            active: 'boolean - Filter by active status',
            page: 'number - Page number',
            limit: 'number - Items per page'
          },
          response: 'Array of products with pagination and filter options'
        }
      },

      // Orders
      orders: {
        'GET /api/orders': {
          description: 'Get all orders with filters',
          parameters: {
            status: 'string - Filter by order status',
            clientId: 'string - Filter by client',
            page: 'number - Page number',
            limit: 'number - Items per page'
          },
          response: 'Array of orders with items and client info'
        }
      },

      // Analytics
      analytics: {
        'GET /api/analytics': {
          description: 'Get comprehensive business analytics',
          parameters: {
            period: 'number - Days to analyze (default: 30)'
          },
          response: 'Revenue, client, service, and staff analytics'
        },
        'GET /api/admin/dashboard': {
          description: 'Get dashboard summary data',
          parameters: {
            period: 'number - Days to analyze (default: 30)'
          },
          response: 'Overview stats, recent bookings, trends, and alerts'
        }
      },

      // System
      system: {
        'GET /api/init': {
          description: 'Check database initialization status',
          response: 'Database statistics and initialization status'
        },
        'POST /api/init': {
          description: 'Initialize database with seed data (dev only)',
          response: 'Initialization confirmation'
        },
        'GET /api/docs': {
          description: 'This API documentation',
          response: 'Complete API documentation'
        }
      }
    },

    // Data Models
    models: {
      Client: {
        id: 'string (UUID)',
        firstName: 'string',
        lastName: 'string',
        email: 'string (unique)',
        phone: 'string',
        dateOfBirth: 'Date (optional)',
        address: 'string (optional)',
        city: 'string (optional)',
        province: 'string (optional)',
        postalCode: 'string (optional)',
        notes: 'string (optional)',
        preferredStylist: 'string (optional)',
        allergies: 'string (optional)',
        hairType: 'string (optional)',
        skinSensitivity: 'string (optional)',
        totalVisits: 'number',
        totalSpent: 'decimal',
        lastVisit: 'Date (optional)',
        createdAt: 'Date',
        updatedAt: 'Date'
      },

      Staff: {
        id: 'string (UUID)',
        firstName: 'string',
        lastName: 'string',
        email: 'string (unique)',
        phone: 'string',
        role: 'enum (OWNER, MANAGER, STYLIST, BARBER, RECEPTIONIST)',
        specialties: 'string[]',
        workingDays: 'string[]',
        startTime: 'string',
        endTime: 'string',
        breakStart: 'string (optional)',
        breakEnd: 'string (optional)',
        totalBookings: 'number',
        rating: 'decimal (optional)',
        isActive: 'boolean',
        createdAt: 'Date',
        updatedAt: 'Date'
      },

      Service: {
        id: 'string (UUID)',
        name: 'string',
        description: 'string (optional)',
        duration: 'number (minutes)',
        price: 'decimal',
        category: 'string',
        addOns: 'string[]',
        isActive: 'boolean',
        createdAt: 'Date',
        updatedAt: 'Date'
      },

      Booking: {
        id: 'string (UUID)',
        clientId: 'string',
        staffId: 'string',
        serviceId: 'string',
        date: 'Date',
        startTime: 'string',
        endTime: 'string',
        duration: 'number (minutes)',
        status: 'enum (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW)',
        notes: 'string (optional)',
        totalPrice: 'decimal',
        paymentStatus: 'enum (UNPAID, PAID, PARTIAL, REFUNDED)',
        paymentMethod: 'string (optional)',
        createdAt: 'Date',
        updatedAt: 'Date'
      },

      Product: {
        id: 'string (UUID)',
        name: 'string',
        brand: 'string',
        description: 'string (optional)',
        price: 'decimal',
        cost: 'decimal (optional)',
        category: 'string',
        inStock: 'number',
        minStock: 'number',
        sku: 'string (unique)',
        barcode: 'string (optional)',
        imageUrls: 'string[]',
        isActive: 'boolean',
        isFeatured: 'boolean',
        createdAt: 'Date',
        updatedAt: 'Date'
      }
    },

    // Status Codes
    statusCodes: {
      200: 'Success',
      201: 'Created',
      400: 'Bad Request - Invalid data or missing required fields',
      401: 'Unauthorized - Authentication required',
      403: 'Forbidden - Access denied',
      404: 'Not Found - Resource does not exist',
      409: 'Conflict - Resource already exists or constraint violation',
      500: 'Internal Server Error - Server-side error'
    },

    // Example Requests
    examples: {
      'Create Client': {
        method: 'POST',
        url: '/api/clients',
        body: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '(306) 555-0123',
          dateOfBirth: '1985-03-15',
          preferredStylist: 'Hicham Mellouli',
          notes: 'Prefers short sides'
        }
      },
      'Book Appointment': {
        method: 'POST',
        url: '/api/bookings',
        body: {
          name: 'John Smith',
          phone: '(306) 555-0123',
          email: 'john.smith@email.com',
          service: 'Classic Haircut',
          staff: 'Hicham Mellouli',
          date: '2025-01-25',
          time: '14:00',
          message: 'First time client'
        }
      },
      'Create Admin Booking': {
        method: 'POST',
        url: '/api/admin/bookings',
        body: {
          clientId: 'cuid_client_123',
          staffId: 'cuid_staff_456',
          serviceId: 'cuid_service_789',
          date: '2025-01-25',
          startTime: '14:00',
          status: 'CONFIRMED',
          notes: 'Regular client'
        }
      }
    }
  }

  return NextResponse.json(apiDocs, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}