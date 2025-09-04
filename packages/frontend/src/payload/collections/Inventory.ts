import type { CollectionConfig } from 'payload'

const Inventory: CollectionConfig = {
  slug: 'inventory',
  admin: {
    useAsTitle: 'name',
    group: 'Business Management',
    defaultColumns: ['name', 'category', 'currentStock', 'minStock', 'unitPrice', 'status']
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
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-calculate status based on stock levels
        if (data.currentStock !== undefined && data.minStock !== undefined) {
          if (data.currentStock <= 0) {
            data.status = 'out_of_stock'
          } else if (data.currentStock <= data.minStock) {
            data.status = 'low_stock'
          } else {
            data.status = 'in_stock'
          }
        }

        // Set lastUpdated
        data.lastUpdated = new Date().toISOString()

        if (operation === 'create') {
          data.createdAt = new Date().toISOString()
        }

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
        description: 'Product or supply name'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description of the item'
      }
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stock Keeping Unit - unique identifier'
      }
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Hair Products', value: 'hair_products' },
        { label: 'Styling Tools', value: 'styling_tools' },
        { label: 'Skin Care', value: 'skin_care' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'Consumables', value: 'consumables' },
        { label: 'Cleaning Supplies', value: 'cleaning_supplies' },
        { label: 'Uniforms', value: 'uniforms' },
        { label: 'Marketing Materials', value: 'marketing_materials' },
        { label: 'Other', value: 'other' }
      ],
      admin: {
        description: 'Product category for organization'
      }
    },
    {
      name: 'brand',
      type: 'text',
      admin: {
        description: 'Brand or manufacturer name'
      }
    },
    {
      name: 'supplier',
      type: 'relationship',
      relationTo: 'suppliers',
      admin: {
        description: 'Primary supplier for this item'
      }
    },
    {
      name: 'unitPrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Cost per unit',
        step: 0.01
      }
    },
    {
      name: 'retailPrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'Selling price per unit (leave empty if not for sale)',
        step: 0.01
      }
    },
    {
      name: 'currentStock',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Current quantity in stock'
      }
    },
    {
      name: 'minStock',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Minimum stock level before reorder alert'
      }
    },
    {
      name: 'maxStock',
      type: 'number',
      min: 0,
      admin: {
        description: 'Maximum stock level for storage planning'
      }
    },
    {
      name: 'unitOfMeasure',
      type: 'select',
      required: true,
      options: [
        { label: 'Each', value: 'each' },
        { label: 'Pack', value: 'pack' },
        { label: 'Box', value: 'box' },
        { label: 'Case', value: 'case' },
        { label: 'Bottle', value: 'bottle' },
        { label: 'Tube', value: 'tube' },
        { label: 'Can', value: 'can' },
        { label: 'Roll', value: 'roll' },
        { label: 'Set', value: 'set' },
        { label: 'Kit', value: 'kit' }
      ],
      admin: {
        description: 'Unit of measurement'
      }
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Storage location in the shop'
      }
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'In Stock', value: 'in_stock' },
        { label: 'Low Stock', value: 'low_stock' },
        { label: 'Out of Stock', value: 'out_of_stock' },
        { label: 'Discontinued', value: 'discontinued' }
      ],
      admin: {
        description: 'Current stock status (auto-calculated)'
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this item is currently active for sale/use'
      }
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description: 'Product images'
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
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for searching and filtering'
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true
        }
      ]
    },
    {
      name: 'reorderPoint',
      type: 'number',
      min: 0,
      admin: {
        description: 'Quantity at which to trigger reorder (usually same as minStock)'
      }
    },
    {
      name: 'leadTime',
      type: 'number',
      min: 0,
      admin: {
        description: 'Lead time in days for reordering'
      }
    },
    {
      name: 'lastRestocked',
      type: 'date',
      admin: {
        description: 'Date when stock was last restocked'
      }
    },
    {
      name: 'expiryDate',
      type: 'date',
      admin: {
        description: 'Expiry date (for perishable items)'
      }
    },
    {
      name: 'batchNumber',
      type: 'text',
      admin: {
        description: 'Batch or lot number'
      }
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about the item'
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

export default Inventory