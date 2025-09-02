import { CollectionConfig } from 'ModernMen/types'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'duration', 'active'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Haircuts', value: 'haircuts' },
        { label: 'Beard Grooming', value: 'beard' },
        { label: 'Hair & Beard Combo', value: 'combo' },
        { label: 'Special Treatments', value: 'special' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
        },
      ],
    },
    {
      name: 'preparationInstructions',
      type: 'textarea',
      label: 'Preparation Instructions',
      admin: {
        description: 'Instructions for customers to prepare for this service',
        position: 'sidebar',
      },
      maxLength: 1000,
    },
    {
      name: 'aftercareInstructions',
      type: 'textarea',
      label: 'Aftercare Instructions',
      admin: {
        description: 'Instructions for customers after the service is completed',
        position: 'sidebar',
      },
      maxLength: 1000,
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
        },
      ],
    },
  ],
}
