import { buildConfig } from 'payload'
import postgresAdapter from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  serverURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- ModernMen Admin',
    },
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
  db: process.env.NODE_ENV === 'production'
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
        },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || 'file:./dev.db',
        },
      }),
  typescript: {
    outputFile: './src/payload-types.ts',
  },
  plugins: [],
})