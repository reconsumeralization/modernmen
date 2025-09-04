// Example: Integrating Payload CMS with existing authentication system
// This shows how to use Payload as CRM data layer while keeping your auth

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Customer collection with salon-specific fields
const Customers = {
  slug: 'customers',
  auth: false, // We'll use your existing auth system
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'phone', type: 'text' },
    { name: 'dateOfBirth', type: 'date' },
    {
      name: 'hairType',
      type: 'select',
      options: [
        { label: 'Straight', value: 'straight' },
        { label: 'Wavy', value: 'wavy' },
        { label: 'Curly', value: 'curly' },
        { label: 'Kinky/Coily', value: 'kinky' }
      ]
    },
    { name: 'hairLength', type: 'text' },
    { name: 'preferredStylist', type: 'relationship', relationTo: 'stylists' },
    { name: 'loyaltyPoints', type: 'number', defaultValue: 0 },
    { name: 'lastVisit', type: 'date' },
    { name: 'nextAppointment', type: 'date' },
    {
      name: 'serviceHistory',
      type: 'array',
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'service', type: 'relationship', relationTo: 'services' },
        { name: 'stylist', type: 'relationship', relationTo: 'stylists' },
        { name: 'notes', type: 'textarea' },
        { name: 'photos', type: 'upload', relationTo: 'media' }
      ]
    },
    { name: 'notes', type: 'textarea', admin: { description: 'Internal notes about customer' } }
  ],
  timestamps: true
}

// Appointments collection
const Appointments = {
  slug: 'appointments',
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true },
    { name: 'stylist', type: 'relationship', relationTo: 'stylists', required: true },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'dateTime', type: 'date', required: true },
    { name: 'duration', type: 'number', required: true }, // minutes
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No Show', value: 'no_show' }
      ]
    },
    { name: 'totalPrice', type: 'number' },
    { name: 'deposit', type: 'number' },
    { name: 'notes', type: 'textarea' },
    { name: 'followUpDate', type: 'date' },
    {
      name: 'reminders',
      type: 'array',
      fields: [
        { name: 'type', type: 'select', options: ['email', 'sms', 'call'] },
        { name: 'sentAt', type: 'date' },
        { name: 'status', type: 'select', options: ['sent', 'delivered', 'failed'] }
      ]
    }
  ],
  timestamps: true
}

// Services collection
const Services = {
  slug: 'services',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Haircut', value: 'haircut' },
        { label: 'Color', value: 'color' },
        { label: 'Styling', value: 'styling' },
        { label: 'Treatment', value: 'treatment' },
        { label: 'Special Service', value: 'special' }
      ]
    },
    { name: 'duration', type: 'number', required: true }, // minutes
    { name: 'price', type: 'number', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'requiresDeposit', type: 'checkbox', defaultValue: false },
    { name: 'depositAmount', type: 'number' },
    { name: 'preparationTime', type: 'number', defaultValue: 15 }, // minutes
    { name: 'aftercare', type: 'textarea' }
  ],
  timestamps: true
}

// Stylists collection
const Stylists = {
  slug: 'stylists',
  auth: false, // We'll use your existing auth system
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'specialties',
      type: 'array',
      fields: [
        { name: 'service', type: 'relationship', relationTo: 'services' },
        { name: 'experience', type: 'select', options: ['Beginner', 'Intermediate', 'Expert'] }
      ]
    },
    {
      name: 'schedule',
      type: 'array',
      fields: [
        { name: 'day', type: 'select', options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
        { name: 'startTime', type: 'text', required: true }, // HH:MM format
        { name: 'endTime', type: 'text', required: true },
        { name: 'isAvailable', type: 'checkbox', defaultValue: true }
      ]
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'hireDate', type: 'date' },
    { name: 'hourlyRate', type: 'number' }
  ],
  timestamps: true
}

// Main Payload configuration
export default buildConfig({
  // Use same database as your existing system
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    }
  }),



  // Admin panel configuration
  admin: {
    // Use your existing auth system
    user: 'customers', // This will be populated by your auth system

    // Custom branding for Modern Men
    meta: {
         title: 'Modern Men CRM',
   description: 'Hair Salon Management System'
    },

    // Custom 
    
    


    // Custom components (you can override defaults)
    components: {
      // Add your custom components here
    }
  },

  // Collections for your CRM
  // collections: [
  //   Customers,
  //   Appointments,
  //   Services,
  //   Stylists,
  //   // Add more collections as needed
  // ],

  // Rich text editor
  editor: lexicalEditor(),

  // File uploads
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },

  // TypeScript configuration
  typescript: {
    outputFile: './payload-types.ts',
  },

  // GraphQL configuration
  graphQL: {
    schemaOutputFile: './graphql/schema.graphql',
  },

  // Plugins for additional functionality
  plugins: [
    // Add plugins as needed (calendar, email, etc.)
  ],

  // CORS configuration
  cors: [
    'http://localhost:3000',
    'https://modernmen.com',
    // Add your production domain
  ],

  // Security headers
  csrf: ['http://localhost:3000'],

  // Rate limiting
  rateLimit: {
    window: 900000, // 15 minutes
    max: 1000,
  },
})

// Example API route to integrate with your existing auth
// /app/api/crm/[...payload]/route.ts
export async function GET(request: Request) {
  // Your existing auth check
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 })
  }

  // Forward to Payload API with your auth context
  // This allows Payload to use your existing authentication
  const payloadRequest = new Request(request.url, {
    method: request.method,
    headers: {
      ...request.headers,
      'x-user-id': session.user.id,
      'x-user-role': session.user.role
    },
    body: request.body
  })

  return fetch(`${process.env.PAYLOAD_URL}/api${request.url.pathname}`, payloadRequest)
}
