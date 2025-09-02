import { CollectionConfig } from 'ModernMen/types'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `
          <div>
            <h1>Verify your email</h1>
            <p>Click the link below to verify your email:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}">Verify Email</a>
          </div>
        `
      },
    },
    forgotPassword: {
      generateEmailHTML: ({ token }) => {
        return `
          <div>
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">Reset Password</a>
          </div>
        `
      },
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Barber', value: 'barber' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: ({ req: { user } }) => {
          return user?.role === 'admin'
        },
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'loyaltyPoints',
      type: 'number',
      defaultValue: 0,
      admin: {
        condition: (data) => data.role === 'customer',
      },
    },
    {
      name: 'specialties',
      type: 'array',
      admin: {
        condition: (data) => data.role === 'barber',
      },
      fields: [
        {
          name: 'specialty',
          type: 'text',
        },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        condition: (data) => data.role === 'barber',
      },
    },
    {
      name: 'availability',
      type: 'array',
      admin: {
        condition: (data) => data.role === 'barber',
      },
      fields: [
        {
          name: 'day',
          type: 'select',
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
          label: 'Start Time (HH:MM)',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time (HH:MM)',
        },
      ],
    },
  ],
}
