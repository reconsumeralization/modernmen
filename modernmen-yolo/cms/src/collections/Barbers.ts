import { CollectionConfig } from '../../payload-types'
import BusinessIcons from '../admin/customIcons'

// Explicitly type the icon to avoid TypeScript inference issues
const BarbersIcon = (BusinessIcons as any).Barbers;

export const Barbers: CollectionConfig = {
  slug: 'barbers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialties', 'rating', 'active'],
    icon: BarbersIcon,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      admin: {
        description: 'Link to the user account for this barber',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'specialties',
      type: 'array',
      fields: [
        {
          name: 'specialty',
          type: 'text',
        },
      ],
    },
    {
      name: 'experience',
      type: 'number',
      admin: {
        description: 'Years of experience',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalReviews',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'schedule',
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
          name: 'startTime',
          type: 'text',
          admin: {
            description: 'Start time in HH:MM format',
          },
        },
        {
          name: 'endTime',
          type: 'text',
          admin: {
            description: 'End time in HH:MM format',
          },
        },
        {
          name: 'isAvailable',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'portfolio',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'totalAppointments',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'monthlyAppointments',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'averageRating',
          type: 'number',
          min: 0,
          max: 5,
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
}
// End of Selection
