import { CollectionConfig } from 'payload/types'
import { withDefaultHooks } from '../hooks/withDefaultHooks'

const LoyaltyRewards: CollectionConfig = {
  slug: 'loyaltyRewards',
  admin: {
    useAsTitle: 'name',
    group: 'Customer Management',
    defaultColumns: ['name', 'pointsRequired', 'type', 'isActive']
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return ['admin', 'manager', 'barber'].includes(req.user.role)
    },
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'manager',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'manager',
    delete: ({ req }) => req.user?.role === 'admin'
  },
  hooks: withDefaultHooks({
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.createdAt = new Date().toISOString()
        }
        data.lastUpdated = new Date().toISOString()
        return data
      }
    ]
  }),
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Reward name (e.g., "Free Haircut", "$10 Off")'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description of the reward'
      }
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Discount Amount', value: 'discount_amount' },
        { label: 'Discount Percentage', value: 'discount_percentage' },
        { label: 'Free Service', value: 'free_service' },
        { label: 'Free Product', value: 'free_product' },
        { label: 'Bonus Points', value: 'bonus_points' },
        { label: 'Custom', value: 'custom' }
      ],
      admin: {
        description: 'Type of reward'
      }
    },
    {
      name: 'pointsRequired',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Points required to redeem this reward'
      }
    },
    {
      name: 'value',
      type: 'number',
      min: 0,
      admin: {
        description: 'Reward value (amount, percentage, or quantity)',
        step: 0.01
      }
    },
    {
      name: 'maxRedemptions',
      type: 'number',
      min: 0,
      admin: {
        description: 'Maximum number of redemptions allowed (0 = unlimited)'
      }
    },
    {
      name: 'redemptionsUsed',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this reward has been redeemed'
      }
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Services', value: 'services' },
        { label: 'Products', value: 'products' },
        { label: 'General', value: 'general' }
      ],
      admin: {
        description: 'Reward category for organization'
      }
    },
    {
      name: 'serviceType',
      type: 'relationship',
      relationTo: 'services',
      admin: {
        description: 'Specific service for free service rewards',
        condition: (data) => data.type === 'free_service'
      }
    },
    {
      name: 'productType',
      type: 'relationship',
      relationTo: 'inventory',
      admin: {
        description: 'Specific product for free product rewards',
        condition: (data) => data.type === 'free_product'
      }
    },
    {
      name: 'terms',
      type: 'textarea',
      admin: {
        description: 'Terms and conditions for this reward'
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this reward is currently available'
      }
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'Date when this reward becomes available'
      }
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'Date when this reward expires'
      }
    },
    {
      name: 'loyaltyPrograms',
      type: 'relationship',
      relationTo: 'loyaltyPrograms',
      hasMany: true,
      admin: {
        description: 'Loyalty programs this reward is available for'
      }
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description: 'Reward images or icons'
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Alt text for accessibility'
          }
        }
      ]
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Date created'
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

export default LoyaltyRewards
