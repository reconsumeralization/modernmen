import { CollectionConfig } from 'payload/types'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    description: 'Media files for the salon management system',
    group: 'Content',
  },
  upload: {
    staticDir: '../public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1200,
        height: 800,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption for the image',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Service Images', value: 'services' },
        { label: 'Portfolio', value: 'portfolio' },
        { label: 'Team Photos', value: 'team' },
        { label: 'Customer Photos', value: 'customers' },
        { label: 'Logo & Branding', value: 'branding' },
        { label: 'General', value: 'general' },
      ],
      admin: {
        description: 'Media category for organization',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for better organization',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photo credit or photographer name',
      },
    },
    {
      name: 'usage',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Social Media', value: 'social' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Portfolio', value: 'portfolio' },
        { label: 'Internal', value: 'internal' },
      ],
      admin: {
        description: 'Where this media can be used',
      },
    },
  ],
  access: {
    read: () => true, // Public read access for media files
    create: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'manager' || user?.role === 'staff'
    },
    update: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'manager'
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
}