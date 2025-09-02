import { CollectionConfig } from 'ModernMen/types'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  admin: {
    useAsTitle: 'customer',
    defaultColumns: ['customer', 'service', 'barber', 'date', 'time', 'status'],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: {
        role: {
          equals: 'customer',
        },
      },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    {
      name: 'barber',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: {
        role: {
          equals: 'barber',
        },
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM dd, yyyy',
        },
      },
    },
    {
      name: 'time',
      type: 'text',
      required: true,
      admin: {
        description: 'Time in HH:MM format (24-hour)',
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      min: 15,
      max: 180,
      admin: {
        description: 'Duration in minutes',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No Show', value: 'no-show' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Special requests or notes from customer',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'Card', value: 'card' },
        { label: 'Online', value: 'online' },
      ],
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        condition: (data) => data.status === 'completed',
      },
    },
    {
      name: 'review',
      type: 'textarea',
      admin: {
        condition: (data) => data.status === 'completed',
      },
    },
    {
      name: 'remindersSent',
      type: 'array',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Email', value: 'email' },
            { label: 'SMS', value: 'sms' },
            { label: 'Push', value: 'push' },
          ],
        },
        {
          name: 'sentAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
  ],
}
