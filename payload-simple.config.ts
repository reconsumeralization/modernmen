import { buildConfig } from 'payload'
import { Users } from './src/collections/Users'
import { Services } from './src/collections/Services'
import { Media } from './src/collections/Media'

export default buildConfig({
  admin: {
    meta: {
      title: 'Modern Men Salon - Admin',
    },
  },
  collections: [Users, Services, Media],
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-key',
  typescript: {
    outputFile: './payload-types.ts',
  },
})