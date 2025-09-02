import { CollectionConfig } from 'ModernMen/types'

export const Settings: CollectionConfig = {
  slug: 'settings',
  admin: {
    useAsTitle: 'siteName',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Modern Men Hair Salon',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Professional grooming services for the modern gentleman',
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          defaultValue: 'info@modernmen.com',
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          defaultValue: '(555) 123-4567',
        },
        {
          name: 'address',
          type: 'textarea',
          defaultValue: '123 Main Street\nDowntown District\nCity, State 12345',
        },
        {
          name: 'businessHours',
          type: 'array',
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
              name: 'openTime',
              type: 'text',
              admin: {
                description: 'Opening time (HH:MM)',
              },
            },
            {
              name: 'closeTime',
              type: 'text',
              admin: {
                description: 'Closing time (HH:MM)',
              },
            },
            {
              name: 'isClosed',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
        {
          name: 'youtube',
          type: 'text',
        },
      ],
    },
    {
      name: 'bookingSettings',
      type: 'group',
      fields: [
        {
          name: 'maxAdvanceBooking',
          type: 'number',
          defaultValue: 90,
          admin: {
            description: 'Maximum days in advance customers can book',
          },
        },
        {
          name: 'minAdvanceBooking',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'Minimum hours in advance customers must book',
          },
        },
        {
          name: 'cancellationHours',
          type: 'number',
          defaultValue: 24,
          admin: {
            description: 'Hours before appointment when cancellation is free',
          },
        },
        {
          name: 'reminderHours',
          type: 'number',
          defaultValue: 24,
          admin: {
            description: 'Hours before appointment to send reminder',
          },
        },
      ],
    },
    {
      name: 'loyaltySettings',
      type: 'group',
      fields: [
        {
          name: 'pointsPerDollar',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'Loyalty points earned per dollar spent',
          },
        },
        {
          name: 'pointsForReferral',
          type: 'number',
          defaultValue: 100,
          admin: {
            description: 'Points earned for successful referral',
          },
        },
        {
          name: 'redemptionRate',
          type: 'number',
          defaultValue: 100,
          admin: {
            description: 'Points needed for $1 discount',
          },
        },
      ],
    },
    {
      name: 'paymentSettings',
      type: 'group',
      fields: [
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'USD',
        },
        {
          name: 'taxRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Tax rate as percentage (e.g., 8.25 for 8.25%)',
          },
        },
        {
          name: 'depositRequired',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'depositPercentage',
          type: 'number',
          defaultValue: 50,
          admin: {
            condition: (data) => data.depositRequired,
            description: 'Deposit percentage required',
          },
        },
      ],
    },
    {
      name: 'seoSettings',
      type: 'group',
      fields: [
        {
          name: 'defaultMetaTitle',
          type: 'text',
          defaultValue: 'Modern Men Hair Salon - Professional Grooming Services',
        },
        {
          name: 'defaultMetaDescription',
          type: 'textarea',
          maxLength: 160,
          defaultValue: 'Experience exceptional hair care and beard grooming services in a sophisticated environment designed for discerning men.',
        },
        {
          name: 'googleAnalyticsId',
          type: 'text',
        },
        {
          name: 'facebookPixelId',
          type: 'text',
        },
      ],
    },
  ],
}
