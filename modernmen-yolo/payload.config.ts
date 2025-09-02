// =============================================================================
// ModernMen CMS CONFIGURATION
// =============================================================================

import { buildConfig } from 'ModernMen/config'
import path from 'path'

// Import collections
import { Users } from './src/collections/Users'
import { Appointments } from './src/collections/Appointments'
import { Services } from './src/collections/Services'
import { Settings } from './src/collections/Settings'
import { Barbers } from './src/collections/Barbers'
import { Gallery } from './src/collections/Gallery'
import { Reviews } from './src/collections/Reviews'

// Import globals
import { SiteSettings } from './src/globals/SiteSettings'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_ModernMen_URL || 'http://localhost:3001',
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
    outputFile: path.resolve(__dirname, 'ModernMen-types.ts'),
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