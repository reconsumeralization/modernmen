import { CollectionConfig } from 'payload'

export const Employees: CollectionConfig = {
  slug: 'employees',
  admin: {
    useAsTitle: 'fullName',
    description: 'Employee HR and payroll information',
    group: 'Human Resources',
    defaultColumns: ['fullName', 'employeeId', 'department', 'position', 'hireDate', 'isActive'],
  },
  fields: [
    // Link to user account
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      admin: {
        description: 'Linked user account',
      },
    },

    // Basic Information
    {
      name: 'employeeId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique employee ID (e.g., EMP001)',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        description: 'Auto-populated from user account',
        readOnly: true,
      },
    },
    {
      name: 'department',
      type: 'select',
      required: true,
      options: [
        { label: 'Management', value: 'management' },
        { label: 'Styling', value: 'styling' },
        { label: 'Reception', value: 'reception' },
        { label: 'Cleaning', value: 'cleaning' },
        { label: 'Administration', value: 'administration' },
        { label: 'Marketing', value: 'marketing' },
      ],
      admin: {
        description: 'Department assignment',
      },
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title/position',
      },
    },

    // Employment Information
    {
      name: 'employment',
      type: 'group',
      admin: {
        description: 'Employment details',
      },
      fields: [
        {
          name: 'hireDate',
          type: 'date',
          required: true,
          admin: {
            description: 'Date of hire',
          },
        },
        {
          name: 'terminationDate',
          type: 'date',
          admin: {
            description: 'Date of termination (if applicable)',
            condition: (data) => !data.employment?.isActive,
          },
        },
        {
          name: 'employmentType',
          type: 'select',
          required: true,
          defaultValue: 'full-time',
          options: [
            { label: 'Full-time', value: 'full-time' },
            { label: 'Part-time', value: 'part-time' },
            { label: 'Contract', value: 'contract' },
            { label: 'Seasonal', value: 'seasonal' },
          ],
        },
        {
          name: 'workLocation',
          type: 'select',
          required: true,
          defaultValue: 'main-salon',
          options: [
            { label: 'Main Salon', value: 'main-salon' },
            { label: 'Branch Location 1', value: 'branch-1' },
            { label: 'Branch Location 2', value: 'branch-2' },
            { label: 'Remote', value: 'remote' },
          ],
        },
      ],
    },

    // Compensation
    {
      name: 'compensation',
      type: 'group',
      admin: {
        description: 'Salary and compensation details',
      },
      fields: [
        {
          name: 'hourlyRate',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Hourly wage in cents (e.g., 1500 = $15.00)',
            step: 1,
          },
        },
        {
          name: 'annualSalary',
          type: 'number',
          admin: {
            description: 'Annual salary in cents (alternative to hourly rate)',
            condition: (data) => data.compensation?.compensationType === 'salary',
          },
        },
        {
          name: 'compensationType',
          type: 'select',
          required: true,
          defaultValue: 'hourly',
          options: [
            { label: 'Hourly', value: 'hourly' },
            { label: 'Salary', value: 'salary' },
            { label: 'Commission', value: 'commission' },
            { label: 'Hybrid', value: 'hybrid' },
          ],
        },
        {
          name: 'commissionRate',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Commission percentage (0-100)',
            condition: (data) => ['commission', 'hybrid'].includes(data.compensation?.compensationType),
          },
        },
        {
          name: 'overtimeRate',
          type: 'number',
          min: 1,
          max: 2,
          defaultValue: 1.5,
          admin: {
            description: 'Overtime multiplier (e.g., 1.5 = time and a half)',
          },
        },
        {
          name: 'lastPayIncrease',
          type: 'date',
          admin: {
            description: 'Date of last pay increase',
          },
        },
        {
          name: 'nextPayReview',
          type: 'date',
          admin: {
            description: 'Next scheduled pay review date',
          },
        },
      ],
    },

    // Benefits & Deductions
    {
      name: 'benefits',
      type: 'group',
      admin: {
        description: 'Benefits and deductions',
      },
      fields: [
        {
          name: 'healthInsurance',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Has health insurance coverage',
          },
        },
        {
          name: 'dentalInsurance',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Has dental insurance coverage',
          },
        },
        {
          name: 'paidTimeOff',
          type: 'number',
          min: 0,
          defaultValue: 10,
          admin: {
            description: 'Paid time off days per year',
          },
        },
        {
          name: 'sickDays',
          type: 'number',
          min: 0,
          defaultValue: 5,
          admin: {
            description: 'Sick days per year',
          },
        },
        {
          name: 'taxDeductions',
          type: 'array',
          admin: {
            description: 'Tax withholding information',
          },
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Federal Income Tax', value: 'federal-income' },
                { label: 'State Income Tax', value: 'state-income' },
                { label: 'Social Security', value: 'social-security' },
                { label: 'Medicare', value: 'medicare' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'rate',
              type: 'number',
              min: 0,
              max: 100,
              admin: {
                description: 'Percentage rate (0-100)',
              },
            },
            {
              name: 'amount',
              type: 'number',
              min: 0,
              admin: {
                description: 'Fixed amount in cents',
              },
            },
          ],
        },
      ],
    },

    // Contact Information
    {
      name: 'contact',
      type: 'group',
      admin: {
        description: 'Emergency and additional contact information',
      },
      fields: [
        {
          name: 'emergencyContact',
          type: 'group',
          admin: {
            description: 'Emergency contact details',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Emergency contact name',
              },
            },
            {
              name: 'relationship',
              type: 'text',
              required: true,
              admin: {
                description: 'Relationship to employee',
              },
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              admin: {
                description: 'Emergency contact phone number',
              },
            },
          ],
        },
        {
          name: 'address',
          type: 'group',
          admin: {
            description: 'Home address',
          },
          fields: [
            {
              name: 'street',
              type: 'text',
              required: true,
            },
            {
              name: 'city',
              type: 'text',
              required: true,
            },
            {
              name: 'state',
              type: 'text',
              required: true,
            },
            {
              name: 'zipCode',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    // Performance & Reviews
    {
      name: 'performance',
      type: 'group',
      admin: {
        description: 'Performance tracking and reviews',
      },
      fields: [
        {
          name: 'performanceReviews',
          type: 'array',
          admin: {
            description: 'Performance review history',
          },
          fields: [
            {
              name: 'reviewDate',
              type: 'date',
              required: true,
            },
            {
              name: 'reviewer',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              admin: {
                description: 'Person conducting the review',
              },
            },
            {
              name: 'rating',
              type: 'number',
              min: 1,
              max: 5,
              required: true,
              admin: {
                description: 'Overall rating (1-5)',
              },
            },
            {
              name: 'comments',
              type: 'textarea',
              admin: {
                description: 'Review comments and feedback',
              },
            },
            {
              name: 'goals',
              type: 'textarea',
              admin: {
                description: 'Goals and objectives for next period',
              },
            },
          ],
        },
        {
          name: 'warnings',
          type: 'array',
          admin: {
            description: 'Performance warnings and disciplinary actions',
          },
          fields: [
            {
              name: 'date',
              type: 'date',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Verbal Warning', value: 'verbal' },
                { label: 'Written Warning', value: 'written' },
                { label: 'Final Warning', value: 'final' },
                { label: 'Suspension', value: 'suspension' },
              ],
            },
            {
              name: 'reason',
              type: 'textarea',
              required: true,
            },
            {
              name: 'issuedBy',
              type: 'relationship',
              relationTo: 'users',
              required: true,
            },
          ],
        },
      ],
    },

    // Status Flags
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Currently active employee',
        position: 'sidebar',
      },
    },
    {
      name: 'isClockedIn',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Currently clocked in',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'lastClockInTime',
      type: 'date',
      admin: {
        description: 'Last clock in timestamp',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional HR notes',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Auto-populate fullName from linked user
        if (data.user && !data.fullName) {
          const user = await req.payload.findByID({
            collection: 'users',
            id: data.user,
          })
          if (user) {
            data.fullName = user.name
          }
        }

        // Auto-generate employee ID if not provided
        if (!data.employeeId) {
          const count = await req.payload.count({
            collection: 'employees',
          })
          data.employeeId = `EMP${String(count.total + 1).padStart(3, '0')}`
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          console.log(`New employee created: ${doc.fullName} (${doc.employeeId})`)

          // Create initial payroll record
          await req.payload.create({
            collection: 'payroll',
            data: {
              employee: doc.id,
              periodStart: new Date(),
              status: 'active',
            },
          })
        }
      },
    ],
  },
  access: {
    read: ({ req }) => {
      const user = req.user
      if (!user) return false
      if (['admin', 'manager'].includes(user.role)) return true
      // Employees can read their own records
      return { user: { equals: user.id } }
    },
    create: ({ req }) => {
      const user = req.user
      if (!user) return false
      return ['admin', 'manager'].includes(user.role)
    },
    update: ({ req }) => {
      const user = req.user
      if (!user) return false
      if (['admin', 'manager'].includes(user.role)) return true
      // Employees can update limited fields on their own records
      return { user: { equals: user.id } }
    },
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === 'admin'
    },
  },
  timestamps: true,
}
