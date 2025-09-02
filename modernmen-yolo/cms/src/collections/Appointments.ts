import { CollectionConfig } from 'payload/types';
import BusinessIcons from '../admin/customIcons';

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'customer', 'services', 'dateTime', 'status', 'staff', 'totalPrice'],
    group: 'Appointment Management',
    icon: BusinessIcons.Appointments,
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated display name',
      },
    },
    
    // Customer Information
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'walkIn',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this a walk-in appointment?',
      },
    },
    {
      name: 'walkInCustomer',
      type: 'group',
      admin: {
        condition: (data) => data.walkIn,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
      ],
    },

    // Services & Staff
    {
      name: 'services',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          required: true,
        },
        {
          name: 'staff',
          type: 'relationship',
          relationTo: 'staff',
          required: true,
        },
        {
          name: 'duration',
          type: 'number',
          required: true,
          defaultValue: 60,
          admin: {
            description: 'Duration in minutes',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: {
            description: 'Service price',
          },
        },
        {
          name: 'startTime',
          type: 'text',
          admin: {
            description: 'Start time for this service (HH:MM)',
          },
        },
        {
          name: 'endTime',
          type: 'text',
          admin: {
            readOnly: true,
            description: 'Auto-calculated end time',
          },
        },
      ],
      admin: {
        description: 'Services included in this appointment',
      },
    },

    // Scheduling Information
    {
      name: 'scheduling',
      type: 'group',
      fields: [
        {
          name: 'dateTime',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'totalDuration',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Total appointment duration (calculated)',
          },
        },
        {
          name: 'buffer',
          type: 'group',
          fields: [
            {
              name: 'beforeMinutes',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Buffer time before appointment',
              },
            },
            {
              name: 'afterMinutes',
              type: 'number',
              defaultValue: 15,
              admin: {
                description: 'Buffer time after appointment',
              },
            },
          ],
        },
        {
          name: 'location',
          type: 'relationship',
          relationTo: 'locations',
          required: true,
        },
        {
          name: 'room',
          type: 'text',
          admin: {
            description: 'Specific room/station number',
          },
        },
      ],
    },
    // Status & Progress
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
        { label: 'Service Complete', value: 'service_complete' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No Show', value: 'no_show' },
        { label: 'Rescheduled', value: 'rescheduled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'progress',
      type: 'group',
      fields: [
        {
          name: 'checkedInAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'serviceStartedAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'serviceCompletedAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'checkedOutAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    // Pricing & Payment
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Subtotal of all services',
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
          admin: {
            readOnly: true,
            description: 'Tax amount (calculated)',
          },
        },
        {
          name: 'tip',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'totalPrice',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Total price including tax and tip',
          },
        },
      ],
    },
    // Communication & Notes
    {
      name: 'communication',
      type: 'group',
      fields: [
        {
          name: 'customerNotes',
          type: 'textarea',
          admin: {
            description: 'Notes from the customer',
          },
        },
        {
          name: 'internalNotes',
          type: 'textarea',
          admin: {
            description: 'Internal staff notes',
          },
        },
        {
          name: 'specialInstructions',
          type: 'textarea',
          admin: {
            description: 'Special instructions for staff',
          },
        },
        {
          name: 'allergies',
          type: 'textarea',
          admin: {
            description: 'Customer allergies or sensitivities',
          },
        },
      ],
    },
    {
      name: 'notifications',
      type: 'group',
      fields: [
        {
          name: 'remindersSent',
          type: 'array',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Email', value: 'email' },
                { label: 'SMS', value: 'sms' },
                { label: 'Push Notification', value: 'push' },
                { label: 'Phone Call', value: 'call' },
              ],
            },
            {
              name: 'timing',
              type: 'select',
              options: [
                { label: '24 Hours Before', value: '24h' },
                { label: '2 Hours Before', value: '2h' },
                { label: '30 Minutes Before', value: '30m' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            {
              name: 'sentAt',
              type: 'date',
            },
            {
              name: 'status',
              type: 'select',
              options: [
                { label: 'Sent', value: 'sent' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Failed', value: 'failed' },
                { label: 'Read', value: 'read' },
              ],
            },
          ],
        },
        {
          name: 'confirmationRequested',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'confirmed',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'confirmedAt',
          type: 'date',
          admin: {
            condition: (data) => data.notifications?.confirmed,
          },
        },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Deposit Paid', value: 'deposit_paid' },
            { label: 'Paid in Full', value: 'paid_full' },
            { label: 'Partially Paid', value: 'partial' },
            { label: 'Refunded', value: 'refunded' },
            { label: 'Failed', value: 'failed' },
            { label: 'Disputed', value: 'disputed' },
          ],
        },
        {
          name: 'method',
          type: 'select',
          options: [
            { label: 'Cash', value: 'cash' },
            { label: 'Credit Card', value: 'credit_card' },
            { label: 'Debit Card', value: 'debit_card' },
            { label: 'Mobile Payment', value: 'mobile' },
            { label: 'Bank Transfer', value: 'bank_transfer' },
            { label: 'Gift Card', value: 'gift_card' },
            { label: 'Account Credit', value: 'credit' },
          ],
        },
        {
          name: 'depositRequired',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'depositAmount',
          type: 'number',
          admin: {
            condition: (data) => data.payment?.depositRequired,
          },
        },
        {
          name: 'paidAmount',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'remainingBalance',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Calculated remaining balance',
          },
        },
        {
          name: 'transactions',
          type: 'array',
          fields: [
            {
              name: 'amount',
              type: 'number',
              required: true,
            },
            {
              name: 'method',
              type: 'select',
              required: true,
              options: [
                { label: 'Cash', value: 'cash' },
                { label: 'Card', value: 'card' },
                { label: 'Mobile', value: 'mobile' },
                { label: 'Gift Card', value: 'gift_card' },
              ],
            },
            {
              name: 'transactionId',
              type: 'text',
            },
            {
              name: 'processedAt',
              type: 'date',
              defaultValue: () => new Date(),
            },
            {
              name: 'processedBy',
              type: 'relationship',
              relationTo: 'staff',
            },
          ],
        },
        {
          name: 'stripePaymentIntentId',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    // Post-Appointment
    {
      name: 'feedback',
      type: 'group',
      admin: {
        condition: (data) => data.status === 'completed',
      },
      fields: [
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Overall service rating (1-5 stars)',
          },
        },
        {
          name: 'review',
          type: 'textarea',
          admin: {
            description: 'Customer review',
          },
        },
        {
          name: 'staffRatings',
          type: 'array',
          fields: [
            {
              name: 'staff',
              type: 'relationship',
              relationTo: 'staff',
              required: true,
            },
            {
              name: 'rating',
              type: 'number',
              min: 1,
              max: 5,
              required: true,
            },
            {
              name: 'feedback',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'wouldRecommend',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'followUpNeeded',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'nextAppointmentSuggested',
          type: 'date',
          admin: {
            description: 'Suggested date for next appointment',
          },
        },
      ],
    },

    // Rescheduling History
    {
      name: 'rescheduleHistory',
      type: 'array',
      fields: [
        {
          name: 'originalDateTime',
          type: 'date',
          required: true,
        },
        {
          name: 'newDateTime',
          type: 'date',
          required: true,
        },
        {
          name: 'reason',
          type: 'textarea',
        },
        {
          name: 'initiatedBy',
          type: 'select',
          options: [
            { label: 'Customer', value: 'customer' },
            { label: 'Staff', value: 'staff' },
            { label: 'System', value: 'system' },
          ],
        },
        {
          name: 'rescheduledAt',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
      admin: {
        description: 'History of any reschedules',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Auto-generate display name
        if (data.customer && data.scheduling?.dateTime) {
          const customerName = data.customer.name || 'Walk-in Customer';
          const date = new Date(data.scheduling.dateTime).toLocaleDateString();
          const time = new Date(data.scheduling.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          data.displayName = `${customerName} - ${date} ${time}`;
        }

        // Calculate total duration from services
        if (data.services && data.services.length > 0) {
          data.scheduling = data.scheduling || {};
          data.scheduling.totalDuration = data.services.reduce((total, service) => {
            return total + (service.duration || 0);
          }, 0);
        }

        // Calculate pricing totals
        if (data.services && data.services.length > 0) {
          data.pricing = data.pricing || {};
          data.pricing.subtotal = data.services.reduce((total, service) => {
            return total + (service.price || 0);
          }, 0);

          // Apply discount
          let discountAmount = 0;
          if (data.pricing.discount?.amount) {
            if (data.pricing.discount.type === 'percentage') {
              discountAmount = (data.pricing.subtotal * data.pricing.discount.amount) / 100;
            } else {
              discountAmount = data.pricing.discount.amount;
            }
          }

          // Calculate tax (assuming 8.5% tax rate)
          const taxRate = 0.085;
          data.pricing.tax = Math.round((data.pricing.subtotal - discountAmount) * taxRate * 100) / 100;

          // Calculate total
          data.pricing.totalPrice = data.pricing.subtotal - discountAmount + data.pricing.tax + (data.pricing.tip || 0);

          // Calculate remaining balance
          if (data.payment) {
            data.payment.remainingBalance = data.pricing.totalPrice - (data.payment.paidAmount || 0);
          }
        }

        // Update progress timestamps based on status
        if (data.status) {
          data.progress = data.progress || {};
          const now = new Date();
          
          switch (data.status) {
            case 'checked_in':
              if (!data.progress.checkedInAt) {
                data.progress.checkedInAt = now;
              }
              break;
            case 'in_progress':
              if (!data.progress.serviceStartedAt) {
                data.progress.serviceStartedAt = now;
              }
              break;
            case 'service_complete':
              if (!data.progress.serviceCompletedAt) {
                data.progress.serviceCompletedAt = now;
              }
              break;
            case 'completed':
              if (!data.progress.checkedOutAt) {
                data.progress.checkedOutAt = now;
              }
              break;
          }
        }

        // Track user changes
        if (operation === 'create') {
          data.createdBy = req.user?.id;
        }
        if (operation === 'update') {
          data.updatedBy = req.user?.id;
        }
        
        return data;
      },
    ],
  },
};

