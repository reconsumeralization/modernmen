import { CollectionConfig } from 'payload/types'
import BusinessIcons from '../admin/customIcons'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'published'],
    icon: BusinessIcons.Gallery,
    description: 'Manage gallery images showcasing haircuts, styles, and salon atmosphere',
    group: 'Content',
    listSearchableFields: ['title', 'description', 'altText'],
    pagination: {
      defaultLimit: 20,
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'barber'
    },
    update: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'barber'
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.createdAt = new Date()
        }
        data.updatedAt = new Date()
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title for this gallery image',
      },
      validate: (val) => {
        if (!val || val.length < 3) {
          return 'Title must be at least 3 characters long'
        }
        return true
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly version of the title',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation, value }) => {
            if (operation === 'create' && !value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the image content',
        rows: 3,
      },
      maxLength: 500,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main gallery image',
      },
      filterOptions: {
        mimeType: {
          contains: 'image',
        },
      },
    },
    {
      name: 'thumbnailImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional thumbnail image (if different from main image)',
        condition: (data) => Boolean(data?.image),
      },
      filterOptions: {
        mimeType: {
          contains: 'image',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Haircuts & Styles', value: 'haircuts' },
        { label: 'Beard Grooming', value: 'beard' },
        { label: 'Before & After', value: 'before-after' },
        { label: 'Salon Atmosphere', value: 'salon' },
        { label: 'Team & Events', value: 'team' },
        { label: 'Products & Tools', value: 'products' },
        { label: 'Client Testimonials', value: 'testimonials' },
        { label: 'Seasonal Specials', value: 'specials' },
      ],
      admin: {
        description: 'Category for organizing gallery images',
      },
    },
    {
      name: 'subcategory',
      type: 'text',
      admin: {
        description: 'Optional subcategory for more specific organization',
        condition: (data) => Boolean(data?.category),
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for better searchability and organization',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'Enter a tag',
          },
        },
      ],
      maxRows: 10,
    },
    {
      name: 'barber',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'barber',
        },
      },
      admin: {
        description: 'Barber who performed this work (optional)',
        allowCreate: false,
      },
    },
    {
      name: 'client',
      type: 'group',
      admin: {
        description: 'Client information (optional, for testimonials)',
        condition: (data) => data?.category === 'testimonials',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Client name (first name only for privacy)',
          },
        },
        {
          name: 'testimonial',
          type: 'textarea',
          admin: {
            description: 'Client testimonial or review',
            rows: 3,
          },
          maxLength: 300,
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Client rating (1-5 stars)',
            step: 1,
          },
        },
      ],
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      admin: {
        description: 'Service featured in this image (optional)',
        allowCreate: false,
      },
    },
    {
      name: 'beforeAfter',
      type: 'group',
      admin: {
        description: 'Before and after images',
        condition: (data) => data?.category === 'before-after',
      },
      fields: [
        {
          name: 'beforeImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Before image',
          },
          filterOptions: {
            mimeType: {
              contains: 'image',
            },
          },
        },
        {
          name: 'afterImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'After image',
          },
          filterOptions: {
            mimeType: {
              contains: 'image',
            },
          },
        },
        {
          name: 'transformation',
          type: 'textarea',
          admin: {
            description: 'Description of the transformation',
            rows: 2,
          },
          maxLength: 200,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this image on homepage and promotional materials',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Make this image visible to the public',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'When this image should be published',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Display order (higher numbers appear first)',
        step: 1,
      },
    },
    {
      name: 'altText',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility (required for SEO)',
      },
      validate: (val) => {
        if (!val || val.length < 10) {
          return 'Alt text must be at least 10 characters long for accessibility'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption to display with the image',
      },
      maxLength: 200,
    },
    {
      name: 'location',
      type: 'group',
      admin: {
        description: 'Location information (if applicable)',
        collapsed: true,
      },
      fields: [
        {
          name: 'salon',
          type: 'text',
          admin: {
            description: 'Salon location where photo was taken',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'City',
          },
        },
        {
          name: 'coordinates',
          type: 'point',
          admin: {
            description: 'GPS coordinates (optional)',
          },
        },
      ],
    },
    {
      name: 'technical',
      type: 'group',
      admin: {
        description: 'Technical image information',
        collapsed: true,
        position: 'sidebar',
      },
      fields: [
        {
          name: 'photographer',
          type: 'text',
          admin: {
            description: 'Photographer credit',
          },
        },
        {
          name: 'camera',
          type: 'text',
          admin: {
            description: 'Camera/equipment used',
          },
        },
        {
          name: 'lighting',
          type: 'select',
          options: [
            { label: 'Natural Light', value: 'natural' },
            { label: 'Studio Lighting', value: 'studio' },
            { label: 'Mixed Lighting', value: 'mixed' },
            { label: 'Ring Light', value: 'ring' },
          ],
          admin: {
            description: 'Lighting setup used',
          },
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      admin: {
        description: 'Social media settings',
        collapsed: true,
        position: 'sidebar',
      },
      fields: [
        {
          name: 'shareOnInstagram',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Share this image on Instagram',
          },
        },
        {
          name: 'shareOnFacebook',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Share this image on Facebook',
          },
        },
        {
          name: 'instagramCaption',
          type: 'textarea',
          admin: {
            description: 'Custom Instagram caption',
            condition: (data, siblingData) => siblingData?.shareOnInstagram,
            rows: 3,
          },
          maxLength: 2200,
        },
        {
          name: 'hashtags',
          type: 'array',
          admin: {
            description: 'Social media hashtags',
            condition: (data, siblingData) => siblingData?.shareOnInstagram || siblingData?.shareOnFacebook,
          },
          fields: [
            {
              name: 'hashtag',
              type: 'text',
              admin: {
                placeholder: '#hashtag',
              },
              validate: (val) => {
                if (val && !val.startsWith('#')) {
                  return 'Hashtag must start with #'
                }
                return true
              },
            },
          ],
          maxRows: 20,
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      admin: {
        description: 'Analytics and performance data',
        collapsed: true,
        position: 'sidebar',
        readOnly: true,
      },
      fields: [
        {
          name: 'views',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of views',
            readOnly: true,
          },
        },
        {
          name: 'likes',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of likes',
            readOnly: true,
          },
        },
        {
          name: 'shares',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of shares',
            readOnly: true,
          },
        },
        {
          name: 'lastViewed',
          type: 'date',
          admin: {
            description: 'Last viewed date',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        position: 'sidebar',
        description: 'Search Engine Optimization settings',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title for this image (max 60 characters)',
          },
          maxLength: 60,
          validate: (val) => {
            if (val && val.length > 60) {
              return 'SEO title should be 60 characters or less for optimal display'
            }
            return true
          },
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description: 'SEO description for this image (max 160 characters)',
            rows: 3,
          },
          validate: (val) => {
            if (val && val.length > 160) {
              return 'SEO description should be 160 characters or less'
            }
            return true
          },
        },
        {
          name: 'keywords',
          type: 'array',
          admin: {
            description: 'SEO keywords for this image',
          },
          fields: [
            {
              name: 'keyword',
              type: 'text',
              admin: {
                placeholder: 'Enter keyword',
              },
            },
          ],
          maxRows: 10,
        },
        {
          name: 'canonicalUrl',
          type: 'text',
          admin: {
            description: 'Canonical URL (if different from default)',
          },
          validate: (val) => {
            if (val && !val.startsWith('http')) {
              return 'Canonical URL must be a complete URL starting with http:// or https://'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: 'Additional metadata',
        collapsed: true,
        position: 'sidebar',
      },
      fields: [
        {
          name: 'createdAt',
          type: 'date',
          admin: {
            description: 'Creation date',
            readOnly: true,
          },
        },
        {
          name: 'updatedAt',
          type: 'date',
          admin: {
            description: 'Last updated date',
            readOnly: true,
          },
        },
        {
          name: 'createdBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'User who created this entry',
            readOnly: true,
          },
        },
        {
          name: 'lastModifiedBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'User who last modified this entry',
            readOnly: true,
          },
        },
        {
          name: 'version',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'Version number',
            readOnly: true,
          },
        },
      ],
    },
  ],
  timestamps: true,
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
}
