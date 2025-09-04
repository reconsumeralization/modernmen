import { CollectionConfig } from 'payload/types'

const Payroll: CollectionConfig = {
  slug: 'payroll',
  admin: {
    useAsTitle: 'employee',
    defaultColumns: ['employee', 'period', 'grossPay', 'netPay', 'status'],
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
      name: 'period',
      type: 'group',
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
      ],
    },
    {
      name: 'hoursWorked',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'hourlyRate',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'grossPay',
      type: 'number',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData.hoursWorked && siblingData.hourlyRate) {
              return siblingData.hoursWorked * siblingData.hourlyRate
            }
            return 0
          },
        ],
      },
    },
    {
      name: 'deductions',
      type: 'group',
      fields: [
        {
          name: 'taxes',
          type: 'number',
          min: 0,
        },
        {
          name: 'insurance',
          type: 'number',
          min: 0,
        },
        {
          name: 'other',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      name: 'totalDeductions',
      type: 'number',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const deductions = siblingData.deductions || {}
            return (deductions.taxes || 0) + (deductions.insurance || 0) + (deductions.other || 0)
          },
        ],
      },
    },
    {
      name: 'netPay',
      type: 'number',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return (siblingData.grossPay || 0) - (siblingData.totalDeductions || 0)
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processed', value: 'processed' },
        { label: 'Paid', value: 'paid' },
      ],
    },
    {
      name: 'paymentDate',
      type: 'date',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}

export default Payroll
