import { CollectionConfig } from 'payload'

const Suppliers: CollectionConfig = {
  slug: 'suppliers',
  admin: {
    useAsTitle: 'name',
    group: 'Business Management',
    defaultColumns: ['name', 'contactPerson', 'email', 'phone', 'status']
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return ['admin', 'manager'].includes(req.user.role)
    },
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'manager',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'manager',
    delete: ({ req }) => req.user?.role === 'admin'
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.createdAt = new Date().toISOString()
        }
        data.lastUpdated = new Date().toISOString()
        return data
      }
    ]
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Supplier company name'
      }
    },
    {
      name: 'contactPerson',
      type: 'text',
      admin: {
        description: 'Primary contact person'
      }
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Primary email address'
      }
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Primary phone number'
      }
    },
    {
      name: 'address',
      type: 'group',
      admin: {
        description: 'Supplier address'
      },
      fields: [
        {
          name: 'street',
          type: 'text'
        },
        {
          name: 'city',
          type: 'text'
        },
        {
          name: 'state',
          type: 'text'
        },
        {
          name: 'zipCode',
          type: 'text'
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'USA'
        }
      ]
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Supplier website URL'
      }
    },
    {
      name: 'supplierType',
      type: 'select',
      required: true,
      options: [
        { label: 'Hair Products', value: 'hair_products' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'Consumables', value: 'consumables' },
        { label: 'Cleaning Supplies', value: 'cleaning_supplies' },
        { label: 'Uniforms', value: 'uniforms' },
        { label: 'Marketing Materials', value: 'marketing_materials' },
        { label: 'General', value: 'general' }
      ],
      admin: {
        description: 'Type of products/services supplied'
      }
    },
    {
      name: 'paymentTerms',
      type: 'select',
      options: [
        { label: 'Net 30', value: 'net_30' },
        { label: 'Net 60', value: 'net_60' },
        { label: 'Net 90', value: 'net_90' },
        { label: 'Due on Receipt', value: 'due_on_receipt' },
        { label: 'Cash on Delivery', value: 'cod' },
        { label: 'Prepaid', value: 'prepaid' }
      ],
      admin: {
        description: 'Payment terms with this supplier'
      }
    },
    {
      name: 'leadTime',
      type: 'number',
      min: 1,
      admin: {
        description: 'Average lead time in days for deliveries'
      }
    },
    {
      name: 'minimumOrder',
      type: 'number',
      min: 0,
      admin: {
        description: 'Minimum order value',
        step: 0.01
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
        { label: 'Pending', value: 'pending' },
        { label: 'Blacklisted', value: 'blacklisted' }
      ],
      admin: {
        description: 'Current status of supplier relationship'
      }
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        description: 'Supplier rating (1-5 stars)'
      }
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about the supplier'
      }
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'inventory',
      hasMany: true,
      admin: {
        description: 'Products supplied by this vendor'
      }
    },
    {
      name: 'accountNumber',
      type: 'text',
      admin: {
        description: 'Supplier account number'
      }
    },
    {
      name: 'taxId',
      type: 'text',
      admin: {
        description: 'Supplier tax ID or EIN'
      }
    },
    {
      name: 'lastOrderDate',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Date of last order placed'
      }
    },
    {
      name: 'totalOrders',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total number of orders placed'
      }
    },
    {
      name: 'totalSpent',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total amount spent with this supplier',
        step: 0.01
      }
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Date supplier was added'
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

export default Suppliers
