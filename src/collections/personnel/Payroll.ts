import { CollectionConfig } from 'payload'

export const Payroll: CollectionConfig = {
  slug: 'payroll',
  admin: {
    useAsTitle: 'employeeName',
    description: 'Payroll periods and calculations',
    group: 'Human Resources',
    defaultColumns: ['employeeName', 'periodStart', 'periodEnd', 'grossPay', 'netPay', 'status'],
  },
  fields: [
    // Employee reference
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
      admin: {
        description: 'Employee for this payroll period',
      },
    },
    {
      name: 'employeeName',
      type: 'text',
      admin: {
        description: 'Auto-populated from employee record',
        readOnly: true,
      },
    },

    // Payroll period
    {
      name: 'periodStart',
      type: 'date',
      required: true,
      admin: {
        description: 'Start date of payroll period',
      },
    },
    {
      name: 'periodEnd',
      type: 'date',
      required: true,
      admin: {
        description: 'End date of payroll period',
      },
    },
    {
      name: 'payDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Scheduled pay date',
      },
    },

    // Earnings calculations
    {
      name: 'earnings',
      type: 'group',
      admin: {
        description: 'Earnings breakdown',
      },
      fields: [
        {
          name: 'regularHours',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Regular hours worked',
            step: 0.01,
          },
        },
        {
          name: 'overtimeHours',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Overtime hours worked',
            step: 0.01,
          },
        },
        {
          name: 'regularRate',
          type: 'number',
          min: 0,
          admin: {
            description: 'Regular hourly rate in cents',
            readOnly: true,
          },
        },
        {
          name: 'overtimeRate',
          type: 'number',
          min: 0,
          admin: {
            description: 'Overtime hourly rate in cents',
            readOnly: true,
          },
        },
        {
          name: 'regularPay',
          type: 'number',
          min: 0,
          admin: {
            description: 'Regular pay amount in cents',
            readOnly: true,
          },
        },
        {
          name: 'overtimePay',
          type: 'number',
          min: 0,
          admin: {
            description: 'Overtime pay amount in cents',
            readOnly: true,
          },
        },
        {
          name: 'commission',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Commission earnings in cents',
          },
        },
        {
          name: 'bonuses',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Bonus payments in cents',
          },
        },
        {
          name: 'otherEarnings',
          type: 'array',
          admin: {
            description: 'Additional earnings',
          },
          fields: [
            {
              name: 'description',
              type: 'text',
              required: true,
            },
            {
              name: 'amount',
              type: 'number',
              min: 0,
              required: true,
              admin: {
                description: 'Amount in cents',
              },
            },
          ],
        },
      ],
    },

    // Deductions
    {
      name: 'deductions',
      type: 'group',
      admin: {
        description: 'Tax and other deductions',
      },
      fields: [
        {
          name: 'federalIncomeTax',
          type: 'number',
          min: 0,
          admin: {
            description: 'Federal income tax in cents',
          },
        },
        {
          name: 'stateIncomeTax',
          type: 'number',
          min: 0,
          admin: {
            description: 'State income tax in cents',
          },
        },
        {
          name: 'socialSecurity',
          type: 'number',
          min: 0,
          admin: {
            description: 'Social Security tax in cents',
          },
        },
        {
          name: 'medicare',
          type: 'number',
          min: 0,
          admin: {
            description: 'Medicare tax in cents',
          },
        },
        {
          name: 'healthInsurance',
          type: 'number',
          min: 0,
          admin: {
            description: 'Health insurance deduction in cents',
          },
        },
        {
          name: 'dentalInsurance',
          type: 'number',
          min: 0,
          admin: {
            description: 'Dental insurance deduction in cents',
          },
        },
        {
          name: 'retirement401k',
          type: 'number',
          min: 0,
          admin: {
            description: '401(k) contribution in cents',
          },
        },
        {
          name: 'otherDeductions',
          type: 'array',
          admin: {
            description: 'Additional deductions',
          },
          fields: [
            {
              name: 'description',
              type: 'text',
              required: true,
            },
            {
              name: 'amount',
              type: 'number',
              min: 0,
              required: true,
              admin: {
                description: 'Amount in cents',
              },
            },
          ],
        },
      ],
    },

    // Summary calculations
    {
      name: 'grossPay',
      type: 'number',
      min: 0,
      admin: {
        description: 'Total gross pay in cents',
        readOnly: true,
      },
    },
    {
      name: 'totalDeductions',
      type: 'number',
      min: 0,
      admin: {
        description: 'Total deductions in cents',
        readOnly: true,
      },
    },
    {
      name: 'netPay',
      type: 'number',
      min: 0,
      admin: {
        description: 'Net pay (take-home) in cents',
        readOnly: true,
      },
    },

    // Status and processing
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Approved', value: 'approved' },
        { label: 'Paid', value: 'paid' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Voided', value: 'voided' },
      ],
      admin: {
        description: 'Payroll status',
        position: 'sidebar',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'Direct Deposit', value: 'direct-deposit' },
        { label: 'Check', value: 'check' },
        { label: 'Cash', value: 'cash' },
        { label: 'Payroll Card', value: 'payroll-card' },
      ],
      admin: {
        description: 'Payment delivery method',
      },
    },

    // Time entries reference
    {
      name: 'timeEntries',
      type: 'relationship',
      relationTo: 'time-clock',
      hasMany: true,
      admin: {
        description: 'Time clock entries for this payroll period',
      },
    },

    // Approval and processing
    {
      name: 'processedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who processed this payroll',
        condition: (data) => ['approved', 'paid'].includes(data.status),
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      admin: {
        description: 'Processing timestamp',
        readOnly: true,
      },
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Manager who approved this payroll',
        condition: (data) => ['approved', 'paid'].includes(data.status),
      },
    },
    {
      name: 'approvedAt',
      type: 'date',
      admin: {
        description: 'Approval timestamp',
        readOnly: true,
      },
    },

    // Notes and adjustments
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Payroll processing notes',
      },
    },
    {
      name: 'adjustments',
      type: 'array',
      admin: {
        description: 'Manual adjustments to payroll',
      },
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          admin: {
            description: 'Adjustment amount in cents (positive or negative)',
          },
        },
        {
          name: 'reason',
          type: 'textarea',
        },
        {
          name: 'approvedBy',
          type: 'relationship',
          relationTo: 'users',
        },
      ],
    },

    // Payment information
    {
      name: 'paymentDetails',
      type: 'group',
      admin: {
        description: 'Payment processing details',
      },
      fields: [
        {
          name: 'checkNumber',
          type: 'text',
          admin: {
            description: 'Check number (if applicable)',
            condition: (data) => data.paymentMethod === 'check',
          },
        },
        {
          name: 'bankAccount',
          type: 'text',
          admin: {
            description: 'Bank account number (last 4 digits)',
            condition: (data) => data.paymentMethod === 'direct-deposit',
          },
        },
        {
          name: 'transactionId',
          type: 'text',
          admin: {
            description: 'Payment transaction ID',
          },
        },
        {
          name: 'paidAt',
          type: 'date',
          admin: {
            description: 'Actual payment date',
            condition: (data) => data.status === 'paid',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Auto-populate employee name
        if (data.employee && !data.employeeName) {
          const employee = await req.payload.findByID({
            collection: 'employees',
            id: data.employee,
          })
          if (employee) {
            data.employeeName = employee.fullName
          }
        }

        // Auto-calculate pay amounts
        if (data.earnings) {
          const { regularHours = 0, overtimeHours = 0, regularRate = 0, overtimeRate = 0, commission = 0, bonuses = 0 } = data.earnings

          // Calculate regular and overtime pay
          data.earnings.regularPay = regularHours * regularRate
          data.earnings.overtimePay = overtimeHours * overtimeRate

          // Calculate total earnings
          const totalEarnings = data.earnings.regularPay + data.earnings.overtimePay + commission + bonuses

          // Add other earnings
          const otherEarningsTotal = (data.earnings.otherEarnings || []).reduce(
            (sum: number, earning: any) => sum + (earning.amount || 0),
            0
          )

          data.grossPay = totalEarnings + otherEarningsTotal
        }

        // Calculate total deductions
        if (data.deductions) {
          const {
            federalIncomeTax = 0,
            stateIncomeTax = 0,
            socialSecurity = 0,
            medicare = 0,
            healthInsurance = 0,
            dentalInsurance = 0,
            retirement401k = 0,
          } = data.deductions

          const taxDeductions = federalIncomeTax + stateIncomeTax + socialSecurity + medicare
          const benefitDeductions = healthInsurance + dentalInsurance + retirement401k

          // Add other deductions
          const otherDeductionsTotal = (data.deductions.otherDeductions || []).reduce(
            (sum: number, deduction: any) => sum + (deduction.amount || 0),
            0
          )

          data.totalDeductions = taxDeductions + benefitDeductions + otherDeductionsTotal
        }

        // Calculate net pay
        data.netPay = (data.grossPay || 0) - (data.totalDeductions || 0)

        // Add adjustments to net pay
        const adjustmentsTotal = (data.adjustments || []).reduce(
          (sum: number, adjustment: any) => sum + (adjustment.amount || 0),
          0
        )
        data.netPay += adjustmentsTotal

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          console.log(`Payroll record created for ${doc.employeeName}: $${(doc.grossPay || 0) / 100}`)
        }

        if (operation === 'update' && doc.status === 'approved') {
          console.log(`Payroll approved for ${doc.employeeName}: $${(doc.netPay || 0) / 100}`)
        }

        if (operation === 'update' && doc.status === 'paid') {
          console.log(`Payroll paid for ${doc.employeeName} on ${doc.paymentDetails?.paidAt || 'unknown date'}`)
        }
      },
    ],
  },
  access: {
    read: ({ req }) => {
      const user = req.user
      if (!user) return false
      if (['admin', 'manager'].includes(user.role)) return true

      // Get employee record for this user
      return {
        employee: {
          user: {
            equals: user.id,
          },
        },
      }
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

      // Employees can view but not edit their payroll
      return false
    },
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === 'admin'
    },
  },
  timestamps: true,
}
