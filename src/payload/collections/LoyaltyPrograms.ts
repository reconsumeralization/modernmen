import { CollectionConfig } from 'payload/types'
import { withDefaultHooks } from '../hooks/withDefaultHooks'

const LoyaltyPrograms: CollectionConfig = {
  slug: 'loyaltyPrograms',
  admin: {
    useAsTitle: 'name',
    group: 'Customer Management',
    defaultColumns: ['name', 'pointsPerDollar', 'status', 'activeMembers']
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return ['admin', 'manager', 'barber'].includes(req.user.role)
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
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
        description: 'Program name (e.g., "VIP Customer Rewards")'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description of the loyalty program'
      }
    },
    {
      name: 'pointsPerDollar',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      admin: {
        description: 'Points earned per dollar spent',
        step: 0.1
      }
    },
    {
      name: 'pointsValue',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Dollar value of each point (e.g., 0.01 = $0.01 per point)',
        step: 0.01
      }
    },
    {
      name: 'minimumPoints',
      type: 'number',
      min: 0,
      admin: {
        description: 'Minimum points required to redeem rewards'
      }
    },
    {
      name: 'maximumPointsPerTransaction',
      type: 'number',
      min: 0,
      admin: {
        description: 'Maximum points that can be earned per transaction'
      }
    },
    {
      name: 'pointsExpiryMonths',
      type: 'number',
      min: 0,
      admin: {
        description: 'Months until points expire (0 = never expires)'
      }
    },
    {
      name: 'tiers',
      type: 'array',
      admin: {
        description: 'Membership tiers with different benefits'
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Tier name (e.g., "Bronze", "Silver", "Gold")'
          }
        },
        {
          name: 'minPoints',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Minimum points required for this tier'
          }
        },
        {
          name: 'benefits',
          type: 'array',
          admin: {
            description: 'Benefits for this tier'
          },
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Discount Percentage', value: 'discount_percentage' },
                { label: 'Discount Amount', value: 'discount_amount' },
                { label: 'Bonus Points', value: 'bonus_points' },
                { label: 'Free Service', value: 'free_service' },
                { label: 'Priority Booking', value: 'priority_booking' }
              ]
            },
            {
              name: 'value',
              type: 'number',
              min: 0,
              admin: {
                description: 'Benefit value (percentage, amount, or quantity)'
              }
            },
            {
              name: 'description',
              type: 'text',
              admin: {
                description: 'Description of the benefit'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'rewards',
      type: 'relationship',
      relationTo: 'loyaltyRewards',
      hasMany: true,
      admin: {
        description: 'Available rewards for this program'
      }
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Draft', value: 'draft' }
      ],
      admin: {
        description: 'Program status'
      }
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Set as default loyalty program for new customers'
      }
    },
    {
      name: 'welcomeBonus',
      type: 'number',
      min: 0,
      admin: {
        description: 'Bonus points given to new members'
      }
    },
    {
      name: 'birthdayBonus',
      type: 'number',
      min: 0,
      admin: {
        description: 'Bonus points given on customer birthday'
      }
    },
    {
      name: 'referralBonus',
      type: 'number',
      min: 0,
      admin: {
        description: 'Bonus points for successful referrals'
      }
    },
    {
      name: 'activeMembers',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of active members in this program'
      }
    },
    {
      name: 'totalPointsIssued',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total points issued to members'
      }
    },
    {
      name: 'totalPointsRedeemed',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total points redeemed by members'
      }
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

export default LoyaltyPrograms
