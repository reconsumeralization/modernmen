import { CollectionConfig } from 'payload/types'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  admin: {
    useAsTitle: 'appointmentTitle',
    description: 'Customer appointments and bookings',
    group: 'Appointments',
    defaultColumns: ['appointmentTitle', 'customer', 'stylist', 'dateTime', 'status'],
    listSearchableFields: ['customer.firstName', 'customer.lastName', 'customer.email'],
  },
  fields: [
    {
      name: 'appointmentTitle',
      type: 'text',
      admin: {
        description: 'Auto-generated appointment title',
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
      admin: {
        description: 'Customer booking the appointment',
      },
    },
    {
      name: 'stylist',
      type: 'relationship',
      relationTo: 'stylists',
      required: true,
      index: true,
      admin: {
        description: 'Assigned stylist',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      required: true,
      admin: {
        description: 'Services requested',
      },
    },
    {
      name: 'dateTime',
      type: 'date',
      required: true,
      index: true,
      admin: {
        description: 'Appointment date and time',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'MMM dd, yyyy hh:mm a',
        },
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      min: 5,
      max: 480,
      admin: {
        description: 'Total duration in minutes (auto-calculated)',
        readOnly: true,
      },
    },
    {
      name: 'endTime',
      type: 'date',
      admin: {
        description: 'Auto-calculated end time',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'confirmed',
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No Show', value: 'no-show' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      admin: {
        description: 'Pricing and payment information',
      },
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          min: 0,
          admin: {
            description: 'Subtotal before discounts (in cents)',
            readOnly: true,
          },
        },
        {
          name: 'discount',
          type: 'group',
          fields: [
            {
              name: 'amount',
              type: 'number',
              defaultValue: 0,
              min: 0,
              admin: {
                description: 'Discount amount in cents',
              },
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Fixed Amount', value: 'fixed' },
                { label: 'Percentage', value: 'percentage' },
              ],
            },
            {
              name: 'reason',
              type: 'text',
              admin: {
                description: 'Reason for discount',
              },
            },
          ],
        },
        {
          name: 'tax',
          type: 'number',
          min: 0,
          admin: {
            description: 'Tax amount in cents',
            readOnly: true,
          },
        },
        {
          name: 'total',
          type: 'number',
          min: 0,
          admin: {
            description: 'Total amount in cents',
            readOnly: true,
          },
        },
        {
          name: 'deposit',
          type: 'group',
          fields: [
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'amount',
              type: 'number',
              min: 0,
              admin: {
                description: 'Deposit amount in cents',
              },
            },
            {
              name: 'paid',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'paymentMethod',
              type: 'select',
              options: [
                { label: 'Cash', value: 'cash' },
                { label: 'Card', value: 'card' },
                { label: 'Online', value: 'online' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'notes',
      type: 'richText',
      admin: {
        description: 'Internal notes and instructions',
      },
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      admin: {
        description: 'Notes from customer',
      },
    },
    {
      name: 'reminders',
      type: 'group',
      admin: {
        description: 'Reminder settings',
      },
      fields: [
        {
          name: 'emailReminder',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'smsReminder',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'reminderTime',
          type: 'number',
          defaultValue: 24,
          admin: {
            description: 'Hours before appointment to send reminder',
          },
        },
        {
          name: 'reminderSent',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'checkIn',
      type: 'group',
      admin: {
        description: 'Check-in information',
      },
      fields: [
        {
          name: 'checkedIn',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'checkInTime',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'waitTime',
          type: 'number',
          admin: {
            description: 'Wait time in minutes',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'followUp',
      type: 'group',
      admin: {
        description: 'Post-appointment follow-up',
      },
      fields: [
        {
          name: 'satisfaction',
          type: 'select',
          options: [
            { label: 'Very Satisfied', value: 'very-satisfied' },
            { label: 'Satisfied', value: 'satisfied' },
            { label: 'Neutral', value: 'neutral' },
            { label: 'Unsatisfied', value: 'unsatisfied' },
            { label: 'Very Unsatisfied', value: 'very-unsatisfied' },
          ],
        },
        {
          name: 'feedback',
          type: 'textarea',
          admin: {
            description: 'Customer feedback',
          },
        },
        {
          name: 'nextAppointment',
          type: 'date',
          admin: {
            description: 'Suggested next appointment date',
          },
        },
        {
          name: 'followUpSent',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'loyalty',
      type: 'group',
      admin: {
        description: 'Loyalty program integration',
      },
      fields: [
        {
          name: 'pointsEarned',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'pointsApplied',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'Loyalty points used for discount',
          },
        },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'online',
      options: [
        { label: 'Online Booking', value: 'online' },
        { label: 'Phone', value: 'phone' },
        { label: 'Walk-in', value: 'walk-in' },
        { label: 'Referral', value: 'referral' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Calculate duration from services
        if (data.services && data.services.length > 0) {
          const services = await req.payload.find({
            collection: 'services',
            where: {
              id: { in: data.services },
            },
          })

          const totalDuration = services.docs.reduce((total, service) => {
            return total + (service.duration || 0) + (service.bufferTime || 0)
          }, 0)

          data.duration = totalDuration
          data.endTime = new Date(new Date(data.dateTime).getTime() + totalDuration * 60000)
        }

        // Generate appointment title
        if (data.customer && data.dateTime) {
          const customer = await req.payload.findByID({
            collection: 'customers',
            id: data.customer,
          })
          if (customer) {
            const date = new Date(data.dateTime).toLocaleDateString()
            data.appointmentTitle = `${customer.firstName} ${customer.lastName} - ${date}`
          }
        }

        // Calculate pricing
        if (data.services && data.services.length > 0) {
          const services = await req.payload.find({
            collection: 'services',
            where: {
              id: { in: data.services },
            },
          })

          const subtotal = services.docs.reduce((total, service) => {
            return total + (service.price || 0)
          }, 0)

          data.pricing.subtotal = subtotal
          data.pricing.tax = Math.round(subtotal * 0.08) // 8% tax
          data.pricing.total = subtotal + data.pricing.tax - (data.pricing.discount?.amount || 0)
        }

        // Conflict prevention
        if (data.stylist && data.dateTime && data.duration && operation === 'create') {
          const conflicts = await req.payload.find({
            collection: 'appointments',
            where: {
              stylist: { equals: data.stylist },
              status: { not_in: ['cancelled', 'no-show'] },
              dateTime: {
                greater_than_equal: new Date(data.dateTime),
                less_than: new Date(new Date(data.dateTime).getTime() + data.duration * 60000),
              },
            },
          })

          if (conflicts.docs.length > 0) {
            throw new Error('Stylist is not available at this time')
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          // Update customer's loyalty points
          if (doc.customer && doc.pricing?.pointsEarned) {
            await req.payload.update({
              collection: 'customers',
              id: doc.customer,
              data: {
                loyaltyPoints: {
                  $inc: doc.pricing.pointsEarned,
                },
                totalSpent: {
                  $inc: doc.pricing.total,
                },
                visitCount: {
                  $inc: 1,
                },
                lastVisit: new Date(),
              },
            })
          }

          console.log(`Appointment created: ${doc.appointmentTitle}`)
        }
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'manager') return true
      // Customers can see their own appointments
      if (user.role === 'customer') {
        return { customer: { equals: user.id } }
      }
      // Stylists can see their assigned appointments
      if (user.role === 'stylist') {
        return { stylist: { equals: user.id } }
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Allow authenticated users to create appointments
      return !!user
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'manager') return true
      // Only allow updates to pending/confirmed appointments
      return {
        status: { in: ['pending', 'confirmed'] },
      }
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'manager'
    },
  },
  timestamps: true,
}