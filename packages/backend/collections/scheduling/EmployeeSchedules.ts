import { CollectionConfig } from 'payload'

export const EmployeeSchedules: CollectionConfig = {
  slug: 'employee-schedules',
  admin: {
    useAsTitle: 'employeeName',
    description: 'Employee shift schedules and availability',
    group: 'Human Resources',
    defaultColumns: ['employeeName', 'date', 'startTime', 'endTime', 'position', 'status'],
  },
  fields: [
    // Employee reference
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
      admin: {
        description: 'Employee for this schedule',
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

    // Schedule details
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Scheduled date',
      },
    },
    {
      name: 'startTime',
      type: 'text',
      required: true,
      admin: {
        description: 'Shift start time (HH:MM format)',
      },
    },
    {
      name: 'endTime',
      type: 'text',
      required: true,
      admin: {
        description: 'Shift end time (HH:MM format)',
      },
    },

    // Shift information
    {
      name: 'position',
      type: 'select',
      required: true,
      options: [
        { label: 'Stylist', value: 'stylist' },
        { label: 'Receptionist', value: 'receptionist' },
        { label: 'Manager', value: 'manager' },
        { label: 'Cleaning Staff', value: 'cleaning' },
        { label: 'Assistant', value: 'assistant' },
      ],
      admin: {
        description: 'Position/role for this shift',
      },
    },
    {
      name: 'location',
      type: 'select',
      required: true,
      defaultValue: 'main-salon',
      options: [
        { label: 'Main Salon', value: 'main-salon' },
        { label: 'Branch Location 1', value: 'branch-1' },
        { label: 'Branch Location 2', value: 'branch-2' },
      ],
      admin: {
        description: 'Work location for this shift',
      },
    },

    // Shift details
    {
      name: 'shiftType',
      type: 'select',
      required: true,
      defaultValue: 'regular',
      options: [
        { label: 'Regular', value: 'regular' },
        { label: 'Overtime', value: 'overtime' },
        { label: 'Training', value: 'training' },
        { label: 'Special Event', value: 'special-event' },
        { label: 'On-Call', value: 'on-call' },
      ],
      admin: {
        description: 'Type of shift',
      },
    },
    {
      name: 'breakDuration',
      type: 'number',
      min: 0,
      defaultValue: 30,
      admin: {
        description: 'Break duration in minutes',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Shift-specific notes or instructions',
      },
    },

    // Recurring schedule
    {
      name: 'isRecurring',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'This is a recurring shift',
      },
    },
    {
      name: 'recurrence',
      type: 'group',
      admin: {
        description: 'Recurrence settings',
        condition: (data) => data.isRecurring,
      },
      fields: [
        {
          name: 'frequency',
          type: 'select',
          required: true,
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Bi-weekly', value: 'bi-weekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            description: 'End date for recurring schedule',
          },
        },
        {
          name: 'daysOfWeek',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
          admin: {
            description: 'Days of the week for weekly recurrence',
            condition: (data) => data.frequency === 'weekly',
          },
        },
      ],
    },

    // Status and approval
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No Show', value: 'no-show' },
        { label: 'Swapped', value: 'swapped' },
      ],
      admin: {
        description: 'Schedule status',
        position: 'sidebar',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who created this schedule',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Manager who approved this schedule',
        condition: (data) => ['confirmed', 'completed'].includes(data.status),
      },
    },

    // Shift swaps and coverage
    {
      name: 'shiftSwaps',
      type: 'array',
      admin: {
        description: 'Shift swap requests and history',
      },
      fields: [
        {
          name: 'requestedBy',
          type: 'relationship',
          relationTo: 'employees',
          required: true,
        },
        {
          name: 'requestedWith',
          type: 'relationship',
          relationTo: 'employees',
          admin: {
            description: 'Employee to swap with',
          },
        },
        {
          name: 'requestDate',
          type: 'date',
          required: true,
        },
        {
          name: 'reason',
          type: 'textarea',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
        },
        {
          name: 'approvedBy',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'approvedAt',
          type: 'date',
        },
      ],
    },

    // Time off conflicts
    {
      name: 'conflicts',
      type: 'array',
      admin: {
        description: 'Schedule conflicts or issues',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Time Off', value: 'time-off' },
            { label: 'Double Booking', value: 'double-booking' },
            { label: 'Availability', value: 'availability' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'severity',
          type: 'select',
          required: true,
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Critical', value: 'critical' },
          ],
        },
        {
          name: 'resolved',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'resolvedBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            condition: (data) => data.resolved,
          },
        },
        {
          name: 'resolvedAt',
          type: 'date',
          admin: {
            condition: (data) => data.resolved,
          },
        },
      ],
    },

    // Performance metrics
    {
      name: 'performance',
      type: 'group',
      admin: {
        description: 'Shift performance metrics',
        condition: (data) => data.status === 'completed',
      },
      fields: [
        {
          name: 'actualStartTime',
          type: 'date',
          admin: {
            description: 'Actual clock-in time',
          },
        },
        {
          name: 'actualEndTime',
          type: 'date',
          admin: {
            description: 'Actual clock-out time',
          },
        },
        {
          name: 'hoursWorked',
          type: 'number',
          min: 0,
          admin: {
            description: 'Total hours worked',
            step: 0.01,
          },
        },
        {
          name: 'productivityScore',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Productivity score (0-100)',
          },
        },
        {
          name: 'customerSatisfaction',
          type: 'number',
          min: 0,
          max: 5,
          admin: {
            description: 'Average customer satisfaction (0-5 stars)',
            step: 0.1,
          },
        },
      ],
    },

    // Notifications
    {
      name: 'notificationsSent',
      type: 'array',
      admin: {
        description: 'Notifications sent for this schedule',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Shift Reminder', value: 'shift-reminder' },
            { label: 'Schedule Change', value: 'schedule-change' },
            { label: 'Conflict Alert', value: 'conflict-alert' },
            { label: 'Swap Request', value: 'swap-request' },
          ],
        },
        {
          name: 'sentAt',
          type: 'date',
          required: true,
        },
        {
          name: 'sentTo',
          type: 'text',
          admin: {
            description: 'Recipient (email or phone)',
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

        // Set created by
        if (!data.createdBy && req.user) {
          data.createdBy = req.user.id
        }

        // Validate shift times
        if (data.startTime && data.endTime) {
          const startTime = new Date(`1970-01-01T${data.startTime}:00`)
          const endTime = new Date(`1970-01-01T${data.endTime}:00`)

          if (startTime >= endTime) {
            throw new Error('End time must be after start time')
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          console.log(`Schedule created for ${doc.employeeName} on ${doc.date}`)

          // Check for conflicts
          await checkScheduleConflicts(doc, req)
        }

        if (operation === 'update' && doc.status === 'confirmed') {
          console.log(`Schedule confirmed for ${doc.employeeName}`)

          // Send confirmation notification
          await sendScheduleNotification(doc, 'confirmed', req)
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

      // Employees can update limited fields on their own schedules
      return {
        employee: {
          user: {
            equals: user.id,
          },
        },
        status: {
          in: ['scheduled', 'confirmed'],
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

// Helper functions
async function checkScheduleConflicts(schedule: any, req: any) {
  // Check for time off conflicts
  const employee = await req.payload.findByID({
    collection: 'employees',
    id: schedule.employee,
  })

  if (employee?.schedule?.timeOff) {
    const scheduleDate = new Date(schedule.date)
    const hasConflict = employee.schedule.timeOff.some((timeOff: any) => {
      const startDate = new Date(timeOff.startDate)
      const endDate = new Date(timeOff.endDate)
      return scheduleDate >= startDate && scheduleDate <= endDate
    })

    if (hasConflict) {
      // Create conflict record
      await req.payload.update({
        collection: 'employee-schedules',
        id: schedule.id,
        data: {
          conflicts: [
            ...(schedule.conflicts || []),
            {
              type: 'time-off',
              description: 'Employee has requested time off on this date',
              severity: 'high',
              resolved: false,
            },
          ],
        },
      })
    }
  }

  // Check for double booking
  const existingSchedules = await req.payload.find({
    collection: 'employee-schedules',
    where: {
      employee: { equals: schedule.employee },
      date: { equals: schedule.date },
      id: { not_equals: schedule.id },
      status: { not_in: ['cancelled', 'no-show'] },
    },
  })

  if (existingSchedules.docs.length > 0) {
    await req.payload.update({
      collection: 'employee-schedules',
      id: schedule.id,
      data: {
        conflicts: [
          ...(schedule.conflicts || []),
          {
            type: 'double-booking',
            description: 'Employee is already scheduled for this date',
            severity: 'critical',
            resolved: false,
          },
        ],
      },
    })
  }
}

async function sendScheduleNotification(schedule: any, type: string, req: any) {
  // Implementation for sending notifications
  // This would integrate with your notification system
  console.log(`Sending ${type} notification for schedule ${schedule.id}`)
}
