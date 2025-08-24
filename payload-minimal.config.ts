import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    meta: {
      title: 'Modern Men Salon - Admin',
      description: 'Hair salon management system',
    },
  },
  collections: [
    // Minimal user collection
    {
      slug: 'users',
      auth: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'staff',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Manager', value: 'manager' },
            { label: 'Staff', value: 'staff' },
            { label: 'Stylist', value: 'stylist' },
          ],
        },
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  typescript: {
    outputFile: './payload-types.ts',
  },
})