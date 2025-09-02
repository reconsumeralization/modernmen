import { CollectionConfig } from 'payload/types';
import BusinessIcons from '../admin/customIcons';

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'duration', 'isActive'],
    group: 'Catalog',
    icon: BusinessIcons.Services,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description of the service',
      },
    },
    {
      name: 'shortDescription',
      type: 'text',
      admin: {
        description: 'Brief description for listings (max 100 chars)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier for this service',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Haircuts', value: 'haircuts' },
        { label: 'Hair Color', value: 'hair-color' },
        { label: 'Hair Treatments', value: 'hair-treatments' },
        { label: 'Beard Grooming', value: 'beard-grooming' },
        { label: 'Facial Treatments', value: 'facial-treatments' },
        { label: 'Massage', value: 'massage' },
        { label: 'Packages', value: 'packages' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Price in cents (e.g., 5000 for $50.00)',
        step: 100,
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      defaultValue: 60,
      admin: {
        description: 'Duration in minutes',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this service prominently',
        position: 'sidebar',
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
      admin: {
        description: 'Service images for gallery and website',
      },
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [
        {
          name: 'benefit',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Key benefits of this service',
      },
    },
    {
      name: 'preparation',
      type: 'textarea',
      admin: {
        description: 'What customers should do before the service',
      },
    },
    {
      name: 'aftercare',
      type: 'textarea',
      admin: {
        description: 'Aftercare instructions for customers',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'keywords',
          type: 'text',
        },
      ],
      admin: {
        description: 'SEO optimization for this service',
      },
    },
    {
      name: 'bookingSettings',
      type: 'group',
      fields: [
        {
          name: 'advanceBookingDays',
          type: 'number',
          defaultValue: 30,
          admin: {
            description: 'How many days in advance can this be booked?',
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
          name: 'requiresDeposit',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Does this service require a deposit?',
          },
        },
        {
          name: 'depositAmount',
          type: 'number',
          admin: {
            description: 'Deposit amount in cents (if required)',
            condition: (data) => data.requiresDeposit,
          },
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'totalBookings',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Total number of bookings for this service',
          },
        },
        {
          name: 'averageRating',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Average customer rating (1-5)',
          },
        },
        {
          name: 'popularityScore',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Calculated popularity score',
          },
        },
      ],
      admin: {
        readOnly: true,
        description: 'Analytics data (auto-calculated)',
      },
    },
  ],
  timestamps: true,
};
