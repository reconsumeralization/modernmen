import { buildConfig } from 'payload'
import postgresAdapter from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import path from 'path'
import { withLexicalEditor } from './utils/withLexicalEditor'

// Additional business collections
import { Commissions } from './payload/collections/Commissions'
import Inventory from './payload/collections/Inventory'
import Suppliers from './payload/collections/Suppliers'
import { ServicePackages } from './payload/collections/ServicePackages'
import { WaitList } from './payload/collections/WaitList'
import { Documentation } from './payload/collections/Documentation'
import { DocumentationTemplates } from './payload/collections/DocumentationTemplates'
import { DocumentationWorkflows } from './payload/collections/DocumentationWorkflows'
import { Notifications } from './payload/collections/Notifications'

// HR Collections
import { Employees } from '../collections/Employees'
import { TimeClock } from '../collections/TimeClock'
import { Payroll } from '../collections/Payroll'
import { EmployeeSchedules } from '../collections/EmployeeSchedules'

// Builder Collections
import { Animations } from './payload/collections/builder/Animations'
import { BlockRevisions } from './payload/collections/builder/BlockRevisions'
import { Blocks } from './payload/collections/builder/Blocks'
import { ConditionalRules } from './payload/collections/builder/ConditionalRules'
import { Drafts } from './payload/collections/builder/Drafts'
import { DynamicData } from './payload/collections/builder/DynamicData'
import { Forms } from './payload/collections/builder/Forms'
import { GlobalStyles } from './payload/collections/builder/GlobalStyles'
import { Integrations } from './payload/collections/builder/Integrations'
import { Layouts } from './payload/collections/builder/Layouts'
import { PageRevisions } from './payload/collections/builder/PageRevisions'
import { Pages } from './payload/collections/builder/Pages'
import { PublishQueue } from './payload/collections/builder/PublishQueue'
import { ReusableComponents } from './payload/collections/builder/ReusableComponents'
import { Sections } from './payload/collections/builder/Sections'
import { SEO } from './payload/collections/builder/SEO'
import { Templates } from './payload/collections/builder/Templates'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  serverURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- ModernMen Admin',
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
        group: 'Admin',
      },
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'name', type: 'text' },
        { 
          name: 'role', 
          type: 'select', 
          options: [
            { label: 'Admin', value: 'admin' }, 
            { label: 'Customer', value: 'customer' }, 
            { label: 'Staff', value: 'staff' },
            { label: 'Manager', value: 'manager' },
            { label: 'Barber', value: 'barber' },
            { label: 'Client', value: 'client' }
          ], 
          defaultValue: 'customer', 
          required: true 
        },
        { 
          name: 'tenant', 
          type: 'relationship', 
          relationTo: 'tenants' 
        },
      ],
    },
    {
      slug: 'tenants',
      admin: {
        useAsTitle: 'name',
        group: 'Admin',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'status', type: 'select', options: [
          { label: 'Active', value: 'active' },
          { label: 'Suspended', value: 'suspended' },
          { label: 'Pending', value: 'pending' },
          { label: 'Deactivated', value: 'deactivated' }
        ], defaultValue: 'pending', required: true },
      ],
    },
    {
      slug: 'media',
      admin: {
        useAsTitle: 'filename',
        group: 'Content',
      },
      upload: {
        staticDir: 'media',
        mimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
      },
      fields: [
        { name: 'alt', type: 'text' },
        { name: 'caption', type: 'text' },
        { name: 'seoTitle', type: 'text' },
        { name: 'seoDescription', type: 'textarea' },
        { name: 'keywords', type: 'text' },
      ],
    },
    {
      slug: 'settings',
      admin: {
        useAsTitle: 'name',
        group: 'Admin',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'value', type: 'json' },
        { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
      ],
    },
    {
      slug: 'customers',
      admin: {
        useAsTitle: 'email',
        group: 'CRM',
      },
      fields: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
        { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
      ],
    },
    {
      slug: 'services',
      admin: {
        useAsTitle: 'name',
        group: 'Services',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'price', type: 'number', required: true },
        { name: 'duration', type: 'number', required: true },
        { name: 'category', type: 'text' },
        { name: 'image', type: 'relationship', relationTo: 'media' },
      ],
    },
    {
      slug: 'stylists',
      admin: {
        useAsTitle: 'name',
        group: 'Staff',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
        { name: 'bio', type: 'textarea' },
        { name: 'profileImage', type: 'relationship', relationTo: 'media' },
        { name: 'user', type: 'relationship', relationTo: 'users' },
        { name: 'isActive', type: 'checkbox', defaultValue: true },
        { name: 'rating', type: 'number', min: 0, max: 5 },
        { name: 'reviewCount', type: 'number', defaultValue: 0 },
        { name: 'experience', type: 'number' },
        { name: 'specialties', type: 'text' }, // Simple text field instead of relationship
      ],
    },
    {
      slug: 'appointments',
      admin: {
        useAsTitle: 'id',
        group: 'CRM',
      },
      fields: [
        { name: 'customer', type: 'relationship', relationTo: 'customers' },
        { name: 'service', type: 'relationship', relationTo: 'services' },
        { name: 'stylist', type: 'relationship', relationTo: 'stylists' },
        { name: 'date', type: 'date', required: true },
        { name: 'status', type: 'select', options: [
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' }
        ]},
      ],
    },
    {
      slug: 'products',
      admin: {
        useAsTitle: 'name',
        group: 'Commerce',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'price', type: 'number', required: true },
        { name: 'category', type: 'text' },
        { name: 'brand', type: 'text' },
        { name: 'sku', type: 'text' },
        { name: 'image', type: 'relationship', relationTo: 'media' },
        { name: 'inStock', type: 'checkbox', defaultValue: true },
        { name: 'featured', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      slug: 'locations',
      admin: {
        useAsTitle: 'name',
        group: 'System',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'address', type: 'textarea' },
        { name: 'phone', type: 'text' },
        { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
        { name: 'active', type: 'checkbox', defaultValue: true },
      ],
    },
    withLexicalEditor({
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
        group: 'Content',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'content', type: 'richText' },
        { name: 'excerpt', type: 'textarea' },
        { name: 'featuredImage', type: 'relationship', relationTo: 'media' },
        { name: 'status', type: 'select', options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' }
        ], defaultValue: 'draft' },
        { name: 'author', type: 'relationship', relationTo: 'users' },
        { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
      ],
    }),

    // Additional business collections
    Commissions,
    Inventory,
    Suppliers,
    ServicePackages,
    WaitList,
    Documentation,
    DocumentationTemplates,
    DocumentationWorkflows,
    Notifications,

    // HR Collections
    Employees,
    TimeClock,
    Payroll,
    EmployeeSchedules,

    // Builder Collections
    Animations,
    BlockRevisions,
    Blocks,
    ConditionalRules,
    Drafts,
    DynamicData,
    Forms,
    GlobalStyles,
    Integrations,
    Layouts,
    PageRevisions,
    Pages,
    PublishQueue,
    ReusableComponents,
    Sections,
    SEO,
    Templates,
  ],
  endpoints: [],
  db: process.env.NODE_ENV === 'production'
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
        },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || 'file:./dev.db',
        },
      }),
  typescript: {
    outputFile: path.resolve(process.cwd(), 'src/payload-types.ts'),
  },
  plugins: [],
})
// End of Selection