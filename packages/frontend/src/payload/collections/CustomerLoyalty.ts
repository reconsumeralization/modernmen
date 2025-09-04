import { CollectionConfig } from 'payload/types'
import { withDefaultHooks } from '../hooks/withDefaultHooks'

const CustomerLoyalty: CollectionConfig = {
  slug: 'customerLoyalty',
  admin: {
    useAsTitle: 'customer',
    group: 'Customer Management',
    defaultColumns: ['customer', 'program', 'currentPoints', 'totalPointsEarned', 'tier']
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return ['admin', 'manager', 'barber'].includes(req.user.role)
    },
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'manager',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'manager' || req.user?.role === 'barber',
    delete: ({ req }) => req.user?.role === 'admin'
  },
  hooks: withDefaultHooks({
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.createdAt = new Date().toISOString()
          data.lastPointsUpdate = new Date().toISOString()
        }
        data.lastUpdated = new Date().toISOString()

        // Auto-determine tier based on current points
        if (data.program && data.currentPoints !== undefined) {
          // This would need to be calculated based on the program's tiers
          // For now, we'll set a default tier
          if (!data.tier) {
            if (data.currentPoints >= 1000) {
              data.tier = 'Gold'
            } else if (data.currentPoints >= 500) {
              data.tier = 'Silver'
            } else {
              data.tier = 'Bronze'
            }
          }
        }

        return data
      }
    ]
  }),
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      unique: true,
      admin: {
        description: 'Customer this loyalty record belongs to'
      }
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'loyaltyPrograms',
      required: true,
      admin: {
        description: 'Loyalty program the customer is enrolled in'
      }
    },
    {
      name: 'currentPoints',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Current available points balance'
      }
    },
    {
      name: 'totalPointsEarned',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total points earned since joining'
      }
    },
    {
      name: 'totalPointsRedeemed',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total points redeemed/spent'
      }
    },
    {
      name: 'tier',
      type: 'text',
      admin: {
        description: 'Current membership tier',
        readOnly: true
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
        { label: 'Suspended', value: 'suspended' }
      ],
      admin: {
        description: 'Loyalty membership status'
      }
    },
    {
      name: 'enrollmentDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        description: 'Date customer enrolled in the program'
      }
    },
    {
      name: 'lastPointsUpdate',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Last time points were updated'
      }
    },
    {
      name: 'pointsHistory',
      type: 'array',
      admin: {
        description: 'History of points earned and redeemed'
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Earned', value: 'earned' },
            { label: 'Redeemed', value: 'redeemed' },
            { label: 'Expired', value: 'expired' },
            { label: 'Bonus', value: 'bonus' },
            { label: 'Adjustment', value: 'adjustment' }
          ]
        },
        {
          name: 'points',
          type: 'number',
          required: true,
          admin: {
            description: 'Number of points (positive for earned, negative for redeemed)'
          }
        },
        {
          name: 'reason',
          type: 'text',
          required: true,
          admin: {
            description: 'Reason for the points change'
          }
        },
        {
          name: 'reference',
          type: 'text',
          admin: {
            description: 'Reference ID (sale, reward, etc.)'
          }
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          defaultValue: () => new Date(),
          admin: {
            description: 'Date of the points transaction'
          }
        }
      ]
    },
    {
      name: 'redemptions',
      type: 'array',
      admin: {
        description: 'Rewards redeemed by this customer'
      },
      fields: [
        {
          name: 'reward',
          type: 'relationship',
          relationTo: 'loyaltyRewards',
          required: true
        },
        {
          name: 'pointsUsed',
          type: 'number',
          required: true,
          min: 0
        },
        {
          name: 'dateRedeemed',
          type: 'date',
          required: true,
          defaultValue: () => new Date()
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'completed',
          options: [
            { label: 'Completed', value: 'completed' },
            { label: 'Pending', value: 'pending' },
            { label: 'Cancelled', value: 'cancelled' }
          ]
        }
      ]
    },
    {
      name: 'referrals',
      type: 'array',
      admin: {
        description: 'Customers referred by this member'
      },
      fields: [
        {
          name: 'referredCustomer',
          type: 'relationship',
          relationTo: 'customers',
          required: true
        },
        {
          name: 'referralDate',
          type: 'date',
          required: true,
          defaultValue: () => new Date()
        },
        {
          name: 'bonusEarned',
          type: 'number',
          min: 0,
          admin: {
            description: 'Bonus points earned for this referral'
          }
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Completed', value: 'completed' },
            { label: 'Expired', value: 'expired' }
          ]
        }
      ]
    },
    {
      name: 'preferences',
      type: 'group',
      admin: {
        description: 'Customer loyalty preferences'
      },
      fields: [
        {
          name: 'emailNotifications',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send email notifications about points and rewards'
          }
        },
        {
          name: 'smsNotifications',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Send SMS notifications about points and rewards'
          }
        },
        {
          name: 'birthdayReminders',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send birthday reminders and bonuses'
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

export default CustomerLoyalty
