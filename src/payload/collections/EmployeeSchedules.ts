import { CollectionConfig } from 'payload/types'

const EmployeeSchedules: CollectionConfig = {
  slug: 'employee-schedules',
  admin: {
    useAsTitle: 'employee',
    defaultColumns: ['employee', 'date', 'startTime', 'endTime', 'status'],
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'manager',
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'manager',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'manager',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'startTime',
      type: 'text',
      required: true,
      validate: (value: string) => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(value)) {
          return 'Please enter a valid time in HH:MM format'
        }
        return true
      },
    },
    {
      name: 'endTime',
      type: 'text',
      required: true,
      validate: (value: string) => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(value)) {
          return 'Please enter a valid time in HH:MM format'
        }
        return true
      },
    },
    {
      name: 'breakTime',
      type: 'number',
      min: 0,
      max: 120,
      admin: {
        description: 'Break time in minutes',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No Show', value: 'no-show' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about the schedule',
      },
    },
    {
      name: 'assignedServices',
      type: 'array',
      fields: [
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          required: true,
        },
        {
          name: 'duration',
          type: 'number',
          min: 15,
          max: 480,
          admin: {
            description: 'Duration in minutes',
          },
        },
      ],
    },
  ],
}

export default EmployeeSchedules
