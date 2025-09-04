import { CollectionConfig } from 'payload'

export const TimeClock: CollectionConfig = {
  slug: 'time-clock',
  admin: {
    useAsTitle: 'employeeName',
    description: 'Employee time clock records',
    group: 'Human Resources',
    defaultColumns: ['employeeName', 'date', 'clockInTime', 'clockOutTime', 'totalHours', 'status'],
  },
  fields: [
    // Employee reference
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
      admin: {
        description: 'Employee who clocked in/out',
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

    // Date and time tracking
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Work date',
      },
    },
    {
      name: 'clockInTime',
      type: 'date',
      required: true,
      admin: {
        description: 'Clock in timestamp',
      },
    },
    {
      name: 'clockOutTime',
      type: 'date',
      admin: {
        description: 'Clock out timestamp',
      },
    },

    // Calculated fields
    {
      name: 'totalHours',
      type: 'number',
      min: 0,
      admin: {
        description: 'Total hours worked (auto-calculated)',
        readOnly: true,
        step: 0.01,
      },
    },
    {
      name: 'regularHours',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Regular hours (up to 8 hours)',
        readOnly: true,
        step: 0.01,
      },
    },
    {
      name: 'overtimeHours',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Overtime hours (over 8 hours)',
        readOnly: true,
        step: 0.01,
      },
    },
    {
      name: 'breakDuration',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Break time in hours',
        step: 0.01,
      },
    },

    // Shift information
    {
      name: 'shift',
      type: 'group',
      admin: {
        description: 'Scheduled shift information',
      },
      fields: [
        {
          name: 'scheduledStart',
          type: 'date',
          admin: {
            description: 'Scheduled start time',
          },
        },
        {
          name: 'scheduledEnd',
          type: 'date',
          admin: {
            description: 'Scheduled end time',
          },
        },
        {
          name: 'isLate',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Employee arrived late',
          },
        },
        {
          name: 'isEarlyDeparture',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Employee left early',
          },
        },
      ],
    },

    // Status and notes
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'completed',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Incomplete', value: 'incomplete' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Edited', value: 'edited' },
      ],
      admin: {
        description: 'Time clock entry status',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about the time entry',
      },
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Manager who approved this time entry',
        condition: (data) => ['approved', 'edited'].includes(data.status),
      },
    },
    {
      name: 'approvedAt',
      type: 'date',
      admin: {
        description: 'Approval timestamp',
        readOnly: true,
        condition: (data) => ['approved', 'edited'].includes(data.status),
      },
    },

    // Edits and adjustments
    {
      name: 'edits',
      type: 'array',
      admin: {
        description: 'History of edits to this time entry',
      },
      fields: [
        {
          name: 'editedBy',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'editedAt',
          type: 'date',
          required: true,
        },
        {
          name: 'originalClockIn',
          type: 'date',
        },
        {
          name: 'originalClockOut',
          type: 'date',
        },
        {
          name: 'reason',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Reason for the edit',
          },
        },
      ],
    },

    // Location tracking (if applicable)
    {
      name: 'location',
      type: 'group',
      admin: {
        description: 'Location information',
      },
      fields: [
        {
          name: 'clockInLocation',
          type: 'text',
          admin: {
            description: 'Location where employee clocked in',
          },
        },
        {
          name: 'clockOutLocation',
          type: 'text',
          admin: {
            description: 'Location where employee clocked out',
          },
        },
        {
          name: 'ipAddress',
          type: 'text',
          admin: {
            description: 'IP address of clock in/out device',
          },
        },
      ],
    },

    // Integration flags
    {
      name: 'isAutoClockOut',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Automatically clocked out by system',
        position: 'sidebar',
      },
    },
    {
      name: 'isManualEntry',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Manually entered by manager',
        position: 'sidebar',
      },
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

        // Calculate hours when both clock in and out times are provided
        if (data.clockInTime && data.clockOutTime) {
          const clockIn = new Date(data.clockInTime)
          const clockOut = new Date(data.clockOutTime)

          // Calculate total hours (including breaks)
          const totalMilliseconds = clockOut.getTime() - clockIn.getTime()
          const totalHours = totalMilliseconds / (1000 * 60 * 60)

          // Subtract break time
          const breakHours = data.breakDuration || 0
          const netHours = Math.max(0, totalHours - breakHours)

          data.totalHours = Math.round(netHours * 100) / 100 // Round to 2 decimal places

          // Calculate regular vs overtime hours
          const regularHours = Math.min(netHours, 8)
          const overtimeHours = Math.max(0, netHours - 8)

          data.regularHours = Math.round(regularHours * 100) / 100
          data.overtimeHours = Math.round(overtimeHours * 100) / 100
        }

        // Set default date if not provided
        if (!data.date && data.clockInTime) {
          data.date = new Date(data.clockInTime).toISOString().split('T')[0]
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          console.log(`Time clock entry created for ${doc.employeeName}: ${doc.totalHours} hours`)

          // Update employee's last clock in time and status
          if (doc.employee) {
            const updateData: any = {
              lastClockInTime: doc.clockInTime,
            }

            // If this is a clock-in without clock-out, mark as clocked in
            if (doc.clockInTime && !doc.clockOutTime) {
              updateData.isClockedIn = true
            }
            // If this is a complete shift, mark as not clocked in
            else if (doc.clockInTime && doc.clockOutTime) {
              updateData.isClockedIn = false
            }

            await req.payload.update({
              collection: 'employees',
              id: doc.employee,
              data: updateData,
            })
          }
        }

        if (operation === 'update' && doc.status === 'approved') {
          // Log approval
          console.log(`Time entry approved for ${doc.employeeName}`)
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
      // Allow employees to create their own time entries, managers/admins can create for anyone
      return ['admin', 'manager', 'staff', 'stylist'].includes(user.role)
    },
    update: ({ req }) => {
      const user = req.user
      if (!user) return false
      if (['admin', 'manager'].includes(user.role)) return true

      // Employees can only update their own incomplete entries
      return {
        employee: {
          user: {
            equals: user.id,
          },
        },
        status: {
          not_equals: 'approved',
        },
      }
    },
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return ['admin', 'manager'].includes(user.role)
    },
  },
  timestamps: true,
}
