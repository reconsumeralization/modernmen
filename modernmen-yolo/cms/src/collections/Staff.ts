import { CollectionConfig } from 'payload/types';
import BusinessIcons from '../admin/customIcons';

export const Staff: CollectionConfig = {
  slug: 'staff',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'position', 'department', 'status', 'hourlyRate', 'totalHoursThisWeek'],
    group: 'Staff Management',
    icon: BusinessIcons.Staff,
  },
  fields: [
    // Personal Information
    {
      name: 'personalInfo',
      type: 'group',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'fullName',
          type: 'text',
          admin: {
            readOnly: true,
            description: 'Auto-generated from first and last name',
          },
        },
        {
          name: 'profilePhoto',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Professional headshot',
          },
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
          required: true,
        },
        {
          name: 'emergencyContact',
          type: 'group',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
            },
            {
              name: 'relationship',
              type: 'text',
            },
          ],
        },
        {
          name: 'dateOfBirth',
          type: 'date',
        },
      ],
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Barber', value: 'barber' },
        { label: 'Stylist', value: 'stylist' },
        { label: 'Manager', value: 'manager' },
        { label: 'Receptionist', value: 'receptionist' },
        { label: 'Apprentice', value: 'apprentice' },
      ],
    },
    {
      name: 'specialties',
      type: 'array',
      fields: [
        {
          name: 'specialty',
          type: 'select',
          required: true,
          options: [
            { label: 'Haircuts', value: 'haircuts' },
            { label: 'Hair Color', value: 'hair-color' },
            { label: 'Beard Grooming', value: 'beard-grooming' },
            { label: 'Facial Treatments', value: 'facial-treatments' },
            { label: 'Massage', value: 'massage' },
            { label: 'Consultations', value: 'consultations' },
          ],
        },
      ],
      admin: {
        description: 'Areas of expertise',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Staff member biography for website',
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
      name: 'hireDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'hourlyRate',
      type: 'number',
      admin: {
        description: 'Hourly rate in cents',
        position: 'sidebar',
      },
    },
    {
      name: 'commissionRate',
      type: 'number',
      admin: {
        description: 'Commission rate as percentage (e.g., 25 for 25%)',
        position: 'sidebar',
      },
    },
    {
      name: 'workingHours',
      type: 'group',
      fields: [
        {
          name: 'monday',
          type: 'group',
          fields: [
            { name: 'start', type: 'text', defaultValue: '09:00' },
            { name: 'end', type: 'text', defaultValue: '17:00' },
            { name: 'isWorking', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          name: 'tuesday',
          type: 'group',
          fields: [
            { name: 'start', type: 'text', defaultValue: '09:00' },
            { name: 'end', type: 'text', defaultValue: '17:00' },
            { name: 'isWorking', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          name: 'wednesday',
          type: 'group',
          fields: [
            { name: 'start', type: 'text', defaultValue: '09:00' },
            { name: 'end', type: 'text', defaultValue: '17:00' },
            { name: 'isWorking', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          name: 'thursday',
          type: 'group',
          fields: [
            { name: 'start', type: 'text', defaultValue: '09:00' },
            { name: 'end', type: 'text', defaultValue: '17:00' },
            { name: 'isWorking', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          name: 'friday',
          type: 'group',
          fields: [
            { name: 'start', type: 'text', defaultValue: '09:00' },
            { name: 'end', type: 'text', defaultValue: '17:00' },
            { name: 'isWorking', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          name: 'saturday',
          type: 'group',
          fields: [
            { name: 'start', type: 'text', defaultValue: '09:00' },
            { name: 'end', type: 'text', defaultValue: '17:00' },
            { name: 'isWorking', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          name: 'sunday',
          type: 'group',
          fields: [
            { name: 'start', type: 'text', defaultValue: '09:00' },
            { name: 'end', type: 'text', defaultValue: '17:00' },
            { name: 'isWorking', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'vacation',
      type: 'array',
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
          type: 'select',
          options: [
            { label: 'Vacation', value: 'vacation' },
            { label: 'Sick Leave', value: 'sick' },
            { label: 'Personal', value: 'personal' },
            { label: 'Training', value: 'training' },
          ],
        },
        {
          name: 'approved',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      admin: {
        description: 'Time off and vacation periods',
      },
    },
    {
      name: 'performance',
      type: 'group',
      fields: [
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Overall performance rating (1-5)',
            position: 'sidebar',
          },
        },
        {
          name: 'totalBookings',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Total appointments completed',
          },
        },
        {
          name: 'averageRating',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Average customer rating',
          },
        },
        {
          name: 'revenueGenerated',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Total revenue generated',
          },
        },
      ],
    },
    {
      name: 'emergencyContact',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'relationship',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
};
