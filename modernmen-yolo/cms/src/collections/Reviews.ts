import { CollectionConfig } from 'payload/types'
import BusinessIcons from '../admin/customIcons'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'customer',
    defaultColumns: ['customer', 'barber', 'rating', 'createdAt', 'published'],
    icon: BusinessIcons.Reviews,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'appointment',
      type: 'relationship',
      relationTo: 'appointments',
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
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'helpful',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'response',
      type: 'group',
      admin: {
        condition: (data) => data.published,
      },
      fields: [
        {
          name: 'responder',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'Staff member responding to this review',
          },
        },
        {
          name: 'responseText',
          type: 'textarea',
          maxLength: 500,
        },
        {
          name: 'respondedAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'ipAddress',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'userAgent',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'Website', value: 'website' },
            { label: 'Mobile App', value: 'mobile' },
            { label: 'Email', value: 'email' },
            { label: 'SMS', value: 'sms' },
          ],
        },
      ],
    },
  ],
}
