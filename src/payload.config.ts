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
    Media
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
  ],
  globals: [
    // Global configurations can be added here
  ],
  plugins: [
    // Additional plugins can be added here
  ],
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
