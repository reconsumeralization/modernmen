// =============================================================================
// ModernMen CMS CONFIGURATION
// =============================================================================

// Temporary buildConfig function until Payload CMS is properly installed
const buildConfig = (config: any) => config;

import path from 'path'

// Import collections
import { Users } from './cms/src/collections/Users'
import { Appointments } from './cms/src/collections/Appointments'
import { Services } from './cms/src/collections/Services'
import { Settings } from './cms/src/collections/Settings'
import { Barbers } from './cms/src/collections/Barbers'
import { Gallery } from './cms/src/collections/Gallery'
import { Reviews } from './cms/src/collections/Reviews'

// Import globals
import { SiteSettings } from './cms/src/globals/SiteSettings'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Modern Men Admin',
      ogImage: '/og-image.png',
    },
  },
  collections: [
    Users,
    Appointments,
    Services,
    Settings,
    Barbers,
    Gallery,
    Reviews,
  ],
  globals: [
    SiteSettings,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'http://localhost:3001',
  ],
  csrf: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'http://localhost:3001',
  ],
})