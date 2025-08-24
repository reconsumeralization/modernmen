import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Import collections
import { Users } from './src/collections/Users'
import { Services } from './src/collections/Services'
import { Customers } from './src/collections/Customers'
import { Appointments } from './src/collections/Appointments'
import { Stylists } from './src/collections/Stylists'
import { Media } from './src/collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    meta: {
      title: 'Modern Men Salon - YOLO Mode',
      description: 'Hair salon management system - Ready to ROCK!',
    },
  },
  collections: [
    Users,
    Services,
    Customers,  
    Appointments,
    Stylists,
    Media,
  ],
  cors: [
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  csrf: [
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  // Use SQLite for instant setup - NO EXTERNAL DEPENDENCIES!
  db: {
    type: 'sqlite',
    url: path.resolve(dirname, 'modernmen.db'),
  },
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '7123e2f9f8d024b9b4d19a6a39d435df094467136305c2d54aa81246fbd3360f',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
})