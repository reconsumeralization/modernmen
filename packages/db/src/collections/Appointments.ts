import { CollectionConfig } from 'payload'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  admin: {
    useAsTitle: 'customer',
    description: 'Customer appointment bookings and scheduling',
    group: 'CRM',
    defaultColumns: ['customer', 'service', 'stylist', 'date', 'time', 'status'],
  },
  fields: [
    // Customer relationship
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      admin: {
        description: 'Customer booking the appointment',
      },
    },

    // Service relationship
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      admin: {
        description: 'Service being booked',
      },
    },

    // Stylist relationship
    {
      name: 'stylist',
      type: 'relationship',
      relationTo: 'stylists',
      required: true,
      admin: {
        description: 'Assigned stylist',
      },
    },

    // Date and Time
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Appointment date',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'startTime',
      type: 'text',
      required: true,
      admin: {
        description: 'Start time (HH:MM format)',
      },
    },
    {
      name: 'endTime',
      type: 'text',
      admin: {
        description: 'End time (HH:MM format) - auto-calculated from service duration',
        readOnly: true,
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      min: 15,
      max: 480, // 8 hours
      admin: {
        description: 'Appointment duration in minutes',
        step: 15,
      },
    },

    // Status and Workflow
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Checked In', value: 'checked_in' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'No Show', value: 'no_show' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Rescheduled', value: 'rescheduled' },
      ],
      admin: {
        description: 'Current appointment status',
        position: 'sidebar',
      },
    },

    // Pricing and Payment
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Service price in cents (auto-populated from service)',
        step: 1,
      },
    },
    {
      name: 'discountAmount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Discount amount in cents',
        step: 1,
      },
    },
    {
      name: 'taxAmount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Tax amount in cents',
        step: 1,
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      admin: {
        description: 'Total amount including tax and discounts',
        readOnly: true,
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Partially Paid', value: 'partial' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Payment status',
      },
    },

    // Booking Information
    {
      name: 'bookingSource',
      type: 'select',
      defaultValue: 'website',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Phone', value: 'phone' },
        { label: 'Walk-in', value: 'walk_in' },
        { label: 'Mobile App', value: 'mobile_app' },
        { label: 'Referral', value: 'referral' },
        { label: 'Social Media', value: 'social_media' },
      ],
      admin: {
        description: 'How the appointment was booked',
      },
    },
    {
      name: 'bookingReference',
      type: 'text',
      admin: {
        description: 'External booking reference number',
      },
    },

    // Special Requests and Notes
    {
      name: 'specialRequests',
      type: 'textarea',
      admin: {
        description: 'Customer special requests or notes',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal staff notes',
      },
    },

    // Follow-up and Communication
    {
      name: 'reminderSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Reminder notification sent',
        readOnly: true,
      },
    },
    {
      name: 'followUpRequired',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Follow-up appointment required',
      },
    },
    {
      name: 'followUpNotes',
      type: 'textarea',
      admin: {
        description: 'Notes for follow-up appointment',
        condition: (data) => data.followUpRequired,
      },
    },

    // Cancellation and Rescheduling
    {
      name: 'cancellationReason',
      type: 'select',
      options: [
        { label: 'Customer Request', value: 'customer_request' },
        { label: 'No Show', value: 'no_show' },
        { label: 'Emergency', value: 'emergency' },
        { label: 'Staff Unavailable', value: 'staff_unavailable' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Reason for cancellation',
        condition: (data) => data.status === 'cancelled',
      },
    },
    {
      name: 'cancellationNotes',
      type: 'textarea',
      admin: {
        description: 'Additional cancellation details',
        condition: (data) => data.status === 'cancelled',
      },
    },

    // Audit Trail
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who created the appointment',
        readOnly: true,
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who last updated the appointment',
        readOnly: true,
      },
    },

    // Status History (for tracking changes)
    {
      name: 'statusHistory',
      type: 'array',
      admin: {
        description: 'Appointment status change history',
        readOnly: true,
      },
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          options: [
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Checked In', value: 'checked_in' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'No Show', value: 'no_show' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Rescheduled', value: 'rescheduled' },
          ],
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        },
        {
          name: 'changedBy',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Optional notes about the status change',
          },
        },
      ],
    },

    // Tenant relationship (for multi-tenant support)
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: {
        description: 'Associated tenant (for multi-tenant deployments)',
        position: 'sidebar',
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-populate price from service
        if (data.service && !data.price) {
          try {
            const service = await req.payload.findByID({
              collection: 'services',
              id: data.service,
            })
            if (service && service.price) {
              data.price = service.price
            }
          } catch (error) {
            console.warn('Could not auto-populate service price:', error.message)
          }
        }

        // Auto-calculate end time from duration
        if (data.startTime && data.duration && !data.endTime) {
          try {
            const [hours, minutes] = data.startTime.split(':').map(Number)
            const startDate = new Date()
            startDate.setHours(hours, minutes, 0, 0)

            const endDate = new Date(startDate.getTime() + (data.duration * 60000))
            data.endTime = endDate.toTimeString().substring(0, 5)
          } catch (error) {
            console.warn('Could not calculate end time:', error.message)
          }
        }

        // Calculate total amount
        const subtotal = data.price || 0
        const discount = data.discountAmount || 0
        const tax = data.taxAmount || 0
        data.totalAmount = subtotal - discount + tax

        // Set audit fields
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }

        if (req.user) {
          data.updatedBy = req.user.id
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation, previousDoc }) => {
        // Track status changes in history
        if (operation === 'update' && previousDoc && previousDoc.status !== doc.status) {
          const statusHistory = doc.statusHistory || []

          statusHistory.push({
            status: doc.status,
            timestamp: new Date().toISOString(),
            changedBy: req.user?.id,
            notes: `Status changed from ${previousDoc.status} to ${doc.status}`,
          })

          // Update the document with new status history
          await req.payload.update({
            collection: 'appointments',
            id: doc.id,
            data: {
              statusHistory,
            },
          })
        }

        if (operation === 'create') {
          console.log(`New appointment created: ${doc.id} for ${new Date(doc.date).toDateString()} at ${doc.startTime}`)

          // Could trigger confirmation email, calendar sync, etc.
        }
      },
    ],
  },

  access: {
    read: ({ req }) => {
      if (!req.user) return false

      // Admins and managers can see all appointments
      if (['admin', 'manager'].includes(req.user.role)) {
        return true
      }

      // Stylists can see their own appointments
      if (req.user.role === 'stylist') {
        return { stylist: { equals: req.user.id } }
      }

      // Customers can see their own appointments
      return { customer: { equals: req.user.id } }
    },
    create: ({ req }) => {
      if (!req.user) return false
      // Allow customers, stylists, and admins to create appointments
      return ['admin', 'manager', 'stylist'].includes(req.user.role)
    },
    update: ({ req }) => {
      if (!req.user) return false

      if (['admin', 'manager'].includes(req.user.role)) {
        return true
      }

      // Stylists can update their assigned appointments
      if (req.user.role === 'stylist') {
        return { stylist: { equals: req.user.id } }
      }

      // Customers can update their own appointments (limited fields)
      return { customer: { equals: req.user.id } }
    },
    delete: ({ req }) => {
      if (!req.user) return false
      return ['admin', 'manager'].includes(req.user.role)
    },
  },

  timestamps: true,
}
