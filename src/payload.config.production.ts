import { buildConfig } from 'payload'
import postgresAdapter from '@payloadcms/db-postgres'
import path from 'path'

// Production Payload configuration optimized for Vercel
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_APP_URL!,
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- ModernMen Admin',
    },
    disable: process.env.NODE_ENV === 'production' && process.env.DISABLE_PAYLOAD_ADMIN === 'true',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
        group: 'Admin',
      },
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'name', type: 'text' },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Customer', value: 'customer' },
            { label: 'Staff', value: 'staff' },
            { label: 'Manager', value: 'manager' },
            { label: 'Barber', value: 'barber' },
          ],
          defaultValue: 'customer',
          required: true
        },
      ],
    },
    {
      slug: 'customers',
      admin: {
        useAsTitle: 'email',
        group: 'CRM',
      },
      fields: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      slug: 'services',
      admin: {
        useAsTitle: 'name',
        group: 'Services',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'price', type: 'number', required: true },
        { name: 'duration', type: 'number', required: true },
        { name: 'category', type: 'text' },
      ],
    },
    {
      slug: 'stylists',
      admin: {
        useAsTitle: 'name',
        group: 'Staff',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
        { name: 'bio', type: 'textarea' },
        { name: 'isActive', type: 'checkbox', defaultValue: true },
        { name: 'rating', type: 'number', min: 0, max: 5 },
        { name: 'reviewCount', type: 'number', defaultValue: 0 },
        { name: 'experience', type: 'number' },
        { name: 'specialties', type: 'text' },
      ],
    },
    {
      slug: 'appointments',
      admin: {
        useAsTitle: 'id',
        group: 'CRM',
      },
      fields: [
        { name: 'customer', type: 'relationship', relationTo: 'customers' },
        { name: 'service', type: 'relationship', relationTo: 'services' },
        { name: 'stylist', type: 'relationship', relationTo: 'stylists' },
        { name: 'date', type: 'date', required: true },
        { name: 'status', type: 'select', options: [
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' }
        ]},
      ],
    },
  ],
  endpoints: [],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      // Vercel serverless optimizations
      min: 0, // Minimum connections in pool
      max: 5, // Maximum connections (Vercel limit)
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 10000, // Connection timeout
      acquireTimeoutMillis: 30000, // Acquire connection timeout
      allowExitOnIdle: true, // Allow pool to close when idle
      // Connection retry logic for serverless cold starts
      retryOnExit: true,
    },
    // Additional serverless optimizations
    migrationDir: './src/migrations', // Custom migrations directory
    push: false, // Disable schema push in production
  }),
  typescript: {
    outputFile: './src/payload-types.ts',
  },
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
  cors: [
    process.env.NEXT_PUBLIC_APP_URL!,
    ...(process.env.PAYLOAD_PUBLIC_SERVER_URL ? [process.env.PAYLOAD_PUBLIC_SERVER_URL] : []),
  ].filter(Boolean),
  csrf: [
    process.env.NEXT_PUBLIC_APP_URL!,
    ...(process.env.PAYLOAD_PUBLIC_SERVER_URL ? [process.env.PAYLOAD_PUBLIC_SERVER_URL] : []),
  ].filter(Boolean),
  plugins: [],
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    admin: {
      disable: process.env.DISABLE_PAYLOAD_ADMIN?.toLowerCase() === 'true',
    },
  }),
})
