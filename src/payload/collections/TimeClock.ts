import { CollectionConfig } from 'payload/types'

const TimeClock: CollectionConfig = {
  slug: 'time-clock',
  admin: {
    useAsTitle: 'employee',
    defaultColumns: ['employee', 'clockIn', 'clockOut', 'totalHours'],
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'manager',
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'manager' || user?.role === 'employee',
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
      name: 'clockIn',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'clockOut',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'totalHours',
      type: 'number',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData.clockIn && siblingData.clockOut) {
              const clockIn = new Date(siblingData.clockIn)
              const clockOut = new Date(siblingData.clockOut)
              const diffMs = clockOut.getTime() - clockIn.getTime()
              const diffHours = diffMs / (1000 * 60 * 60)
              return Math.round(diffHours * 100) / 100
            }
            return 0
          },
        ],
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'completed',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Edited', value: 'edited' },
      ],
    },
  ],
}

export default TimeClock
