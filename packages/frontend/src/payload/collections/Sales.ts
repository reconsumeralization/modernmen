import { CollectionConfig } from 'payload/types'
import { withDefaultHooks } from '../hooks/withDefaultHooks'

const Sales: CollectionConfig = {
  slug: 'sales',
  admin: {
    useAsTitle: 'receiptNumber',
    group: 'Commerce',
    defaultColumns: ['receiptNumber', 'customer', 'totalAmount', 'paymentMethod', 'status', 'createdAt']
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return ['admin', 'manager', 'barber'].includes(req.user.role)
    },
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'manager' || req.user?.role === 'barber',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'manager',
    delete: ({ req }) => req.user?.role === 'admin'
  },
  hooks: withDefaultHooks({
    beforeChange: [
      ({ data, operation }) => {
        // Auto-generate receipt number
        if (operation === 'create' && !data.receiptNumber) {
          const timestamp = new Date().getTime()
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
          data.receiptNumber = `RCP-${timestamp}-${random}`
        }

        // Calculate totals
        if (data.items && Array.isArray(data.items)) {
          let subtotal = 0
          let taxAmount = 0

          data.items.forEach((item: any) => {
            const itemTotal = item.quantity * item.unitPrice
            subtotal += itemTotal
          })

          // Apply tax rate
          taxAmount = subtotal * (data.taxRate || 0.08) // Default 8% tax

          data.subtotal = subtotal
          data.taxAmount = taxAmount
          data.totalAmount = subtotal + taxAmount - (data.discountAmount || 0)
        }

        // Set timestamps
        data.lastUpdated = new Date().toISOString()
        if (operation === 'create') {
          data.createdAt = new Date().toISOString()
        }

        return data
      }
    ]
  }),
  fields: [
    {
      name: 'receiptNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated receipt number'
      }
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: {
        description: 'Customer who made the purchase (optional for walk-ins)'
      }
    },
    {
      name: 'cashier',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Staff member who processed the sale'
      }
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: {
        description: 'Items included in this sale'
      },
      fields: [
        {
          name: 'inventoryItem',
          type: 'relationship',
          relationTo: 'inventory',
          required: true,
          admin: {
            description: 'Product from inventory'
          }
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'Quantity sold'
          }
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Price per unit at time of sale'
          }
        },
        {
          name: 'discount',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Discount percentage for this item'
          }
        },
        {
          name: 'lineTotal',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Calculated line total'
          }
        }
      ]
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Subtotal before tax and discounts'
      }
    },
    {
      name: 'taxRate',
      type: 'number',
      min: 0,
      max: 1,
      defaultValue: 0.08,
      admin: {
        description: 'Tax rate (e.g., 0.08 for 8%)'
      }
    },
    {
      name: 'taxAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Calculated tax amount'
      }
    },
    {
      name: 'discountAmount',
      type: 'number',
      min: 0,
      admin: {
        description: 'Total discount amount'
      }
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Final total amount'
      }
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'Credit Card', value: 'credit_card' },
        { label: 'Debit Card', value: 'debit_card' },
        { label: 'Gift Card', value: 'gift_card' },
        { label: 'Check', value: 'check' },
        { label: 'Digital Wallet', value: 'digital_wallet' },
        { label: 'Split Payment', value: 'split' }
      ],
      admin: {
        description: 'Payment method used'
      }
    },
    {
      name: 'paymentDetails',
      type: 'group',
      admin: {
        description: 'Additional payment information'
      },
      fields: [
        {
          name: 'cardLastFour',
          type: 'text',
          admin: {
            description: 'Last 4 digits of card (for card payments)'
          }
        },
        {
          name: 'transactionId',
          type: 'text',
          admin: {
            description: 'Payment processor transaction ID'
          }
        },
        {
          name: 'giftCardCode',
          type: 'text',
          admin: {
            description: 'Gift card code (for gift card payments)'
          }
        }
      ]
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'completed',
      options: [
        { label: 'Completed', value: 'completed' },
        { label: 'Pending', value: 'pending' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Voided', value: 'voided' },
        { label: 'Partially Refunded', value: 'partially_refunded' }
      ],
      admin: {
        description: 'Sale status'
      }
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about the sale'
      }
    },
    {
      name: 'loyaltyPointsEarned',
      type: 'number',
      min: 0,
      admin: {
        description: 'Loyalty points earned from this purchase'
      }
    },
    {
      name: 'loyaltyPointsUsed',
      type: 'number',
      min: 0,
      admin: {
        description: 'Loyalty points used in this purchase'
      }
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Date and time of sale'
      }
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Last updated'
      }
    }
  ]
}

export default Sales
