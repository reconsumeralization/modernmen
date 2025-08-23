/* @ts-ignore: Payload types may not be resolvable in this context */
type CollectionConfig = any;

export const DocumentationWorkflows: CollectionConfig = {
  slug: 'documentation-workflows',
  admin: {
    usTitle: 'name',
    defaultColumns: ['name', 'isDefault', 'isActive', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage approval workflows for documentation',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the workflow',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of this workflow',
      },
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        {
          name: 'step',
          type: 'select',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Content Review', value: 'content-review' },
            { label: 'Technical Review', value: 'technical-review' },
            { label: 'Compliance Review', value: 'compliance-review' },
            { label: 'Final Approval', value: 'final-approval' },
            { label: 'Published', value: 'published' },
          ],
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'requiredRoles',
          type: 'array',
          fields: [
            {
              name: 'role',
              type: 'select',
              options: [
                { label: 'Salon Employee', value: 'salon_employee' },
                { label: 'Salon Owner', value: 'salon_owner' },
                { label: 'Developer', value: 'developer' },
                { label: 'System Admin', value: 'system_admin' },
              ],
            },
          ],
        },
        {
          name: 'isOptional',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'estimatedDuration',
          type: 'number',
          admin: {
            description: 'Estimated duration in hours',
          },
        },
        {
          name: 'autoAdvance',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Automatically advance to next step when conditions are met',
          },
        },
      ],
      required: true,
      admin: {
        description: 'Steps in this workflow',
      },
    },
    {
      name: 'applicableTypes',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Guide', value: 'guide' },
            { label: 'Procedure', value: 'procedure' },
            { label: 'Policy', value: 'policy' },
            { label: 'Training Material', value: 'training' },
            { label: 'FAQ', value: 'faq' },
            { label: 'Troubleshooting', value: 'troubleshooting' },
            { label: 'Announcement', value: 'announcement' },
            { label: 'Tutorial', value: 'tutorial' },
            { label: 'Checklist', value: 'checklist' },
            { label: 'Template', value: 'template' },
          ],
        },
      ],
      admin: {
        description: 'Documentation types this workflow applies to',
      },
    },
    {
      name: 'applicableCategories',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Salon Operations', value: 'salon-operations' },
            { label: 'Customer Service', value: 'customer-service' },
            { label: 'Booking Management', value: 'booking-management' },
            { label: 'Staff Training', value: 'staff-training' },
            { label: 'Safety Procedures', value: 'safety-procedures' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Financial Management', value: 'financial-management' },
            { label: 'Inventory Management', value: 'inventory-management' },
            { label: 'Compliance', value: 'compliance' },
            { label: 'Technology Setup', value: 'technology-setup' },
            { label: 'Emergency Procedures', value: 'emergency-procedures' },
            { label: 'Quality Assurance', value: 'quality-assurance' },
          ],
        },
      ],
      admin: {
        description: 'Documentation categories this workflow applies to',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Use as default workflow',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Workflow is active and available for use',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
  timestamps: true,
  access: {
    read: ({ req: { user } }) => ['system_admin', 'salon_owner', 'developer'].includes(user?.role || ''),
    create: ({ req: { user } }) => ['system_admin', 'salon_owner'].includes(user?.role || ''),
    update: ({ req: { user } }) => ['system_admin', 'salon_owner'].includes(user?.role || ''),
    delete: ({ req: { user } }) => ['system_admin'].includes(user?.role || ''),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id;
        }
        return data;
      },
    ],
  },
};