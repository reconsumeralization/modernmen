import { CollectionConfig, AccessArgs, PayloadRequest } from 'payload'

// Define types for better type safety
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff' | 'stylist'
  lastLogin?: Date
}

interface HookData {
  role?: string
  lastLogin?: Date
}

interface Request {
  user?: User
  // Add other properties as needed
}

interface HookContext {
  data: HookData
  req: Request
  operation: 'create' | 'update' | 'delete'
}

interface AfterChangeContext {
  doc: User
  req: Request
  operation: 'create' | 'update' | 'delete'
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    description: 'Salon staff and administrators',
    group: 'Administration',
  },
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: {
      generateEmailHTML: (args?: { req?: PayloadRequest; token?: string; user?: User }) => {
        const { token, user } = args || {}
        return `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb, #8b5cf6); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 2rem;">🌐 Webduh</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Web Designs Unite Humanity</p>
            </div>
            <h2>Welcome to Webduh CMS</h2>
            <p>Hi ${user?.name || 'there'},</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/verify?token=${token}"
               style="background: linear-gradient(135deg, #2563eb, #8b5cf6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0; font-weight: 600;">
              Verify Email
            </a>
            <p>This link will expire in 24 hours.</p>
            <p style="color: #6b7280; font-size: 0.9rem; margin-top: 30px;">
              Creating digital solutions that make a positive impact on humanity.
            </p>
          </div>
        `
      },
    },
    forgotPassword: {
      generateEmailHTML: (args?: { req?: PayloadRequest; token?: string; user?: User }) => {
        const { token, user } = args || {}
        return `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb, #8b5cf6); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 2rem;">🌐 Webduh</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Web Designs Unite Humanity</p>
            </div>
            <h2>Reset Your Password - Webduh CMS</h2>
            <p>Hi ${user?.name || 'there'},</p>
            <p>We received a request to reset your password. Click the link below:</p>
            <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/reset-password?token=${token}"
               style="background: linear-gradient(135deg, #2563eb, #8b5cf6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0; font-weight: 600;">
              Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
            <p style="color: #6b7280; font-size: 0.9rem; margin-top: 30px;">
              If you didn't request this password reset, please ignore this email.
            </p>
          </div>
        `
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Staff', value: 'staff' },
        { label: 'Stylist', value: 'stylist' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Contact phone number',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile picture',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      admin: {
        description: 'Brief biography for staff profiles',
      },
    },
    {
      name: 'specializations',
      type: 'array',
      admin: {
        description: 'Areas of expertise (for stylists)',
      },
      fields: [
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          required: true,
        },
        {
          name: 'yearsExperience',
          type: 'number',
          min: 0,
          max: 50,
        },
        {
          name: 'certifications',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'year',
              type: 'number',
              min: 1900,
              max: new Date().getFullYear(),
            },
          ],
        },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      admin: {
        description: 'Work schedule and availability',
      },
      fields: [
        {
          name: 'workDays',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        {
          name: 'startTime',
          type: 'text',
          defaultValue: '09:00',
          admin: {
            description: 'Format: HH:MM (24-hour)',
          },
        },
        {
          name: 'endTime',
          type: 'text',
          defaultValue: '17:00',
          admin: {
            description: 'Format: HH:MM (24-hour)',
          },
        },
        {
          name: 'timeOff',
          type: 'array',
          admin: {
            description: 'Planned time off or vacations',
          },
          fields: [
            {
              name: 'startDate',
              type: 'date',
              required: true,
            },
            {
              name: 'endDate',
              type: 'date',
              required: true,
            },
            {
              name: 'reason',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'permissions',
      type: 'group',
      admin: {
        description: 'System permissions',
        condition: (data: HookData) => data.role === 'admin' || data.role === 'manager',
      },
      fields: [
        {
          name: 'canManageUsers',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'canManageServices',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'canViewReports',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'canManageAppointments',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable/disable user account',
        position: 'sidebar',
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        description: 'Last login timestamp',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }: HookContext) => {
        if (operation === 'create') {
          // Set default role for new users
          if (!data.role) {
            data.role = 'staff'
          }
        }

        // Update lastLogin on login
        if (operation === 'update' && data.lastLogin) {
          data.lastLogin = new Date()
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, operation }: AfterChangeContext) => {
        if (operation === 'create') {
          // Send welcome email
          console.log(`New user created: ${doc.name} (${doc.email})`)
        }
      },
    ],
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }: AccessArgs) => {
      if (!user) return false
      return user.role === 'admin' || user.role === 'manager'
    },
    update: ({ req: { user } }: AccessArgs) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }: AccessArgs) => {
      if (!user) return false
      return user.role === 'admin'
    },
  },
  timestamps: true,
}