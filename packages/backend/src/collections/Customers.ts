import { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    description: 'Customer profiles and contact information',
    group: 'CRM',
    defaultColumns: ['email', 'firstName', 'lastName', 'phone', 'loyaltyTier', 'createdAt'],
  },
  fields: [
    // Personal Information
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer first name',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer last name',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Primary email address',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Primary phone number',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        description: 'Customer date of birth',
      },
    },

    // Address Information
    {
      name: 'address',
      type: 'group',
      admin: {
        description: 'Customer address information',
      },
      fields: [
        {
          name: 'street',
          type: 'text',
          admin: {
            description: 'Street address',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'City',
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            description: 'State/Province',
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          admin: {
            description: 'ZIP/Postal code',
          },
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'USA',
          admin: {
            description: 'Country',
          },
        },
      ],
    },

    // Loyalty Program
    {
      name: 'loyaltyTier',
      type: 'select',
      defaultValue: 'bronze',
      options: [
        { label: 'Bronze', value: 'bronze' },
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' },
        { label: 'Platinum', value: 'platinum' },
        { label: 'Diamond', value: 'diamond' },
      ],
      admin: {
        description: 'Customer loyalty tier',
      },
    },
    {
      name: 'loyaltyPoints',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Total loyalty points accumulated',
      },
    },
    {
      name: 'totalSpent',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Total amount spent (in cents)',
        step: 1,
      },
    },
    {
      name: 'visitCount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Total number of visits',
      },
    },
    {
      name: 'lastVisit',
      type: 'date',
      admin: {
        description: 'Date of last visit',
      },
    },

    // Preferences
    {
      name: 'preferences',
      type: 'group',
      admin: {
        description: 'Customer preferences and settings',
      },
      fields: [
        {
          name: 'preferredStylist',
          type: 'relationship',
          relationTo: 'stylists',
          admin: {
            description: 'Preferred stylist',
          },
        },
        {
          name: 'preferredServices',
          type: 'relationship',
          relationTo: 'services',
          hasMany: true,
          admin: {
            description: 'Preferred services',
          },
        },
        {
          name: 'marketingOptIn',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Opt-in for marketing communications',
          },
        },
        {
          name: 'smsNotifications',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive SMS notifications',
          },
        },
        {
          name: 'emailNotifications',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive email notifications',
          },
        },
      ],
    },

    // Emergency Contact
    {
      name: 'emergencyContact',
      type: 'group',
      admin: {
        description: 'Emergency contact information',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Emergency contact name',
          },
        },
        {
          name: 'relationship',
          type: 'text',
          admin: {
            description: 'Relationship to customer',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Emergency contact phone',
          },
        },
      ],
    },

    // System Fields
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Active customer account',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about the customer',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Customer tags for segmentation',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
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
      ({ data, operation }) => {
        // Set created date on new customers
        if (operation === 'create') {
          data.createdAt = new Date().toISOString()
        }

        // Update last modified
        data.updatedAt = new Date().toISOString()

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          console.log(`New customer created: ${doc.firstName} ${doc.lastName} (${doc.email})`)

          // Could trigger welcome email or other onboarding here
        }
      },
    ],
  },

  access: {
    read: ({ req }) => {
      // Customers can read their own data, admins can read all
      if (!req.user) return false

      if (['admin', 'manager', 'stylist'].includes(req.user.role)) {
        return true
      }

      // Customers can only see their own data
      return { id: { equals: req.user.id } }
    },
    create: ({ req }) => {
      // Only admins and managers can create customers
      if (!req.user) return false
      return ['admin', 'manager'].includes(req.user.role)
    },
    update: ({ req }) => {
      if (!req.user) return false

      if (['admin', 'manager'].includes(req.user.role)) {
        return true
      }

      // Customers can update their own basic info
      return { id: { equals: req.user.id } }
    },
    delete: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admin'
    },
  },

  timestamps: true,
}
