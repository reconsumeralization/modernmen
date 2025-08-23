import { webpackBundler } from '@payloadcms/bundler-webpack'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import type { Config } from 'payload'
import type { Request } from 'express'
import type { Configuration } from 'webpack'
import path from 'path'
import { fileURLToPath } from 'url'

// Import collections
import { Users } from './collections/Users'
import { Services } from './collections/Services'
import { Customers } from './collections/Customers'
import { Appointments } from './collections/Appointments'
import { Stylists } from './collections/Stylists'
import { Media } from './collections/Media'
import { Commissions } from './payload/collections/Commissions'
import { ServicePackages } from './payload/collections/ServicePackages'
import { Inventory } from './payload/collections/Inventory'
import { WaitList } from './payload/collections/WaitList'
import { Notifications } from './payload/collections/Notifications'
import { Documentation } from './payload/collections/Documentation'
import { DocumentationTemplates } from './payload/collections/DocumentationTemplates'
import { DocumentationWorkflows } from './payload/collections/DocumentationWorkflows'

// Import components
import { ModernMenBranding } from './payload/components/ModernMenBranding'
import getPayloadClient from './payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    meta: {
      title: 'Modern Men Salon - Management System',
      description: 'Professional salon management system for Modern Men Hair Salon',
    },
    components: {
      beforeDashboard: ['@/payload/components/ModernMenBranding'],
    },
  },
  collections: [
    Users,
    Services,
    Customers,
    Appointments,
    Stylists,
    Media,
    Commissions,
    ServicePackages,
    Inventory,
    WaitList,
    Notifications,
    Documentation,
    DocumentationTemplates,
    DocumentationWorkflows
  ],
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ].filter(Boolean),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
    },
  }),
  editor: lexicalEditor({}),

  endpoints: [
    // Custom endpoints for integration with existing auth system
    {
      path: '/api/auth/check',
      method: 'get',
      handler: async (req: any) => {
        // Check if user is authenticated via our existing system
        const session = req.headers?.get?.('x-user-id') || req.headers?.['x-user-id']
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          })
        }
        return new Response(JSON.stringify({ userId: session }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      },
    },
    // Search endpoint for integration with search functionality
    {
      path: '/api/search',
      method: 'get',
      handler: async (req: any) => {
        try {
          const payload = await getPayloadClient()
          const { searchParams } = new URL(req.url)

          const query = searchParams.get('q') || ''
          const collection = searchParams.get('collection') || 'all'
          const limit = parseInt(searchParams.get('limit') || '20')

          let results = []

          if (collection === 'all' || collection === 'services') {
            const services = await payload.find({
              collection: 'services',
              where: {
                or: [
                  { name: { contains: query } },
                  { description: { contains: query } }
                ]
              },
              limit: collection === 'services' ? limit : Math.ceil(limit / 3)
            })
            results.push(...services.docs.map(doc => ({ ...doc, type: 'service' })))
          }

          if (collection === 'all' || collection === 'stylists') {
            const stylists = await payload.find({
              collection: 'stylists',
              where: {
                or: [
                  { firstName: { contains: query } },
                  { lastName: { contains: query } },
                  { bio: { contains: query } }
                ]
              },
              limit: collection === 'stylists' ? limit : Math.ceil(limit / 3)
            })
            results.push(...stylists.docs.map(doc => ({ ...doc, type: 'stylist' })))
          }

          if (collection === 'all' || collection === 'customers') {
            const customers = await payload.find({
              collection: 'customers',
              where: {
                or: [
                  { firstName: { contains: query } },
                  { lastName: { contains: query } },
                  { email: { contains: query } }
                ]
              },
              limit: collection === 'customers' ? limit : Math.ceil(limit / 3)
            })
            results.push(...customers.docs.map(doc => ({ ...doc, type: 'customer' })))
          }

          return new Response(JSON.stringify({
            results,
            total: results.length,
            query,
            collection
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error) {
          console.error('Payload search error:', error)
          return new Response(JSON.stringify({ error: 'Search failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      },
    },
    // Analytics endpoint
    {
      path: '/api/analytics',
      method: 'get',
      handler: async (req: any) => {
        try {
          const payload = await getPayloadClient()

          const servicesCount = await payload.count({ collection: 'services' })
          const customersCount = await payload.count({ collection: 'customers' })
          const appointmentsCount = await payload.count({ collection: 'appointments' })
          const stylistsCount = await payload.count({ collection: 'stylists' })

          return new Response(JSON.stringify({
            services: servicesCount.totalDocs,
            customers: customersCount.totalDocs,
            appointments: appointmentsCount.totalDocs,
            stylists: stylistsCount.totalDocs
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error) {
          console.error('Analytics error:', error)
          return new Response(JSON.stringify({ error: 'Analytics failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      },
    }
  ],
  globals: [
    // Global configurations can be added here
  ],
  plugins: [
    // Additional plugins can be added here
  ],
  hooks: {
    afterRead: [
      ({ doc, collection }) => {
        // Add any post-read processing here
        return doc
      }
    ],
    beforeChange: [
      ({ data, collection, operation }) => {
        // Add validation or data processing before save
        if (collection === 'users' && operation === 'create') {
          // Add user creation logic
        }
        return data
      }
    ]
  },
  localization: {
    locales: ['en'],
    defaultLocale: 'en',
    fallback: false,
  },
  rateLimit: {
    window: 900000, // 15 minutes
    max: 1000, // 1000 requests per window
  },
  secret: process.env.PAYLOAD_SECRET || 'your-payload-secret-here',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, adjust as needed
    },
  },

} satisfies Config)
