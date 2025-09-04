# 🚀 Collection Builder Integration Guide

## Overview

The **Collection Builder** is a powerful drag-and-drop interface that allows users to create collections that automatically generate:
- **Database tables** with proper schemas and indexes
- **RESTful API endpoints** with full CRUD operations
- **TypeScript types** and validation schemas
- **Admin interfaces** for content management
- **Real-time subscriptions** for live updates

This guide shows how to integrate the Collection Builder into your application and use it to create dynamic, production-ready collections.

---

## 📦 Installation & Setup

### 1. Required Dependencies

```bash
npm install react-dnd react-dnd-html5-backend @supabase/supabase-js zod
```

### 2. Import Components

```typescript
import { CollectionBuilder } from '@/components/builder/collection-builder'
import { DeploymentManager } from '@/lib/collection-deployer'
import { ServiceFactory } from '@/lib/dynamic-service-generator'
```

### 3. Basic Integration

```tsx
// In your admin panel or builder interface
import { CollectionBuilder } from '@/components/builder/collection-builder'

export function AdminCollectionsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Collection Builder</h1>
      <CollectionBuilder
        onCollectionCreated={handleCollectionCreated}
        existingCollections={existingCollections}
      />
    </div>
  )
}
```

---

## 🎨 Using the Collection Builder

### 1. Building Collections

The Collection Builder provides an intuitive drag-and-drop interface:

#### **Field Types Available:**
- **Text** - Single line text input
- **Textarea** - Multi-line text input
- **Number** - Numeric input with validation
- **Email** - Email input with validation
- **Date** - Date picker input
- **Checkbox** - Boolean toggle
- **Select** - Dropdown selection
- **Relationship** - Link to other collections
- **Array** - List of items
- **Upload** - File upload field

#### **Field Configuration:**
- **Name** - Database column name
- **Label** - Display label
- **Required** - Makes field mandatory
- **Unique** - Ensures unique values
- **Validation** - Custom validation rules

### 2. Collection Settings

Configure your collection with:
- **Basic Info** - Name, slug, description
- **Access Control** - Create, read, update, delete permissions
- **Admin Settings** - Default columns, grouping
- **Timestamps** - Automatic created/updated fields

### 3. Code Generation

The builder generates:
```typescript
// Payload CMS Collection
export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description'
    }
  ],
  // ... additional configuration
}
```

---

## 🚀 Deployment & API Generation

### 1. Automatic Deployment

```typescript
import { DeploymentManager } from '@/lib/collection-deployer'

const handleCollectionCreated = async (collection) => {
  const deploymentManager = new DeploymentManager()

  // Deploy to development environment
  const results = await deploymentManager.deployCollections([collection], 'development')

  if (results[0].success) {
    console.log('✅ Collection deployed successfully!')
    console.log('Database table:', results[0].databaseTable)
    console.log('API endpoints:', results[0].apiEndpoints)
    console.log('Admin URL:', results[0].adminUrl)
  } else {
    console.error('❌ Deployment failed:', results[0].errors)
  }
}
```

### 2. What Gets Created

#### **Database Layer:**
- PostgreSQL table with proper schema
- Indexes for performance optimization
- Row Level Security (RLS) policies
- Foreign key relationships
- Audit triggers (created/updated)

#### **API Layer:**
```
GET    /api/my-collection       # List items
POST   /api/my-collection       # Create item
GET    /api/my-collection/[id]  # Get single item
PUT    /api/my-collection/[id]  # Update item
DELETE /api/my-collection/[id]  # Delete item
```

#### **Type Safety:**
```typescript
// Auto-generated types
interface MyCollection {
  id: string
  title: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

interface CreateMyCollectionInput {
  title: string
  description?: string
}

interface UpdateMyCollectionInput {
  title?: string
  description?: string
}
```

#### **Validation:**
```typescript
// Auto-generated Zod schemas
export const createMyCollectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
})

export const updateMyCollectionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional()
})
```

---

## 💻 Using Generated Collections

### 1. Frontend Integration

```typescript
// Import generated service
import { myCollectionService } from '@/services/my-collection'

// Create new item
const newItem = await myCollectionService.create({
  title: 'My First Item',
  description: 'This is a test item'
})

// Fetch items with filtering
const items = await myCollectionService.findMany({
  filters: [{ field: 'title', operator: 'contains', value: 'test' }],
  sorting: [{ field: 'createdAt', direction: 'desc' }],
  pagination: { page: 1, limit: 10 }
})

// Real-time subscriptions
const subscription = myCollectionService.subscribeToChanges((payload) => {
  console.log('Item changed:', payload)
  // Update UI automatically
})
```

### 2. Admin Interface

The generated admin interface provides:
- **Data Tables** - Sortable, filterable tables
- **Create/Edit Forms** - Generated forms with validation
- **Bulk Operations** - Select multiple items for actions
- **Export/Import** - CSV and JSON support
- **Search & Filter** - Advanced filtering options

### 3. API Usage

```typescript
// REST API endpoints
const API_BASE = '/api/my-collection'

// List items
const response = await fetch(API_BASE)
const items = await response.json()

// Create item
const newItem = await fetch(API_BASE, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Item',
    description: 'Item description'
  })
})

// Update item
await fetch(`${API_BASE}/${itemId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Updated Title' })
})
```

---

## 🎯 Advanced Features

### 1. Relationships

```typescript
// Create collection with relationships
const blogCollection = {
  name: 'Blog Posts',
  slug: 'blog-posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'textarea', required: true },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true
    }
  ]
}

// Auto-generates relationship handling
const posts = await blogPostService.findMany({
  include: ['author', 'categories'], // Automatically joins related data
  filters: [
    { field: 'author.name', operator: 'eq', value: 'John Doe' }
  ]
})
```

### 2. Custom Validation

```typescript
// Add custom validation rules
const collectionWithValidation = {
  name: 'User Profiles',
  slug: 'user-profiles',
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        customMessage: 'Please enter a valid email address'
      }
    },
    {
      name: 'age',
      type: 'number',
      validation: {
        min: 13,
        max: 120,
        customMessage: 'Age must be between 13 and 120'
      }
    }
  ]
}
```

### 3. Real-time Features

```typescript
// Enable real-time subscriptions
const realtimeCollection = {
  name: 'Live Updates',
  slug: 'live-updates',
  realtime: true,
  fields: [
    { name: 'message', type: 'text', required: true },
    { name: 'priority', type: 'select', options: ['low', 'medium', 'high'] }
  ]
}

// Subscribe to changes
const subscription = liveUpdateService.subscribeToChanges((payload) => {
  switch (payload.eventType) {
    case 'INSERT':
      showNotification('New update received')
      break
    case 'UPDATE':
      updateUI(payload.new)
      break
  }
})
```

### 4. File Uploads

```typescript
// Collection with file uploads
const mediaCollection = {
  name: 'Media Library',
  slug: 'media',
  fields: [
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alt text for accessibility'
      }
    },
    {
      name: 'caption',
      type: 'textarea'
    }
  ]
}

// Auto-generates upload handling
const uploadedFile = await mediaService.create({
  file: uploadedFileData,
  title: 'My Image',
  alt: 'Description for screen readers',
  caption: 'Optional caption'
})
```

---

## 🔧 Customization & Extensibility

### 1. Custom Field Types

```typescript
// Create custom field types
const CUSTOM_FIELD_TYPES = [
  {
    type: 'color',
    label: 'Color Picker',
    icon: Palette,
    component: ColorPickerField,
    validation: z.string().regex(/^#[0-9A-F]{6}$/)
  },
  {
    type: 'location',
    label: 'Location',
    icon: MapPin,
    component: LocationField,
    validation: z.object({
      lat: z.number(),
      lng: z.number(),
      address: z.string()
    })
  }
]

// Register custom field types
CollectionBuilder.registerFieldTypes(CUSTOM_FIELD_TYPES)
```

### 2. Custom Hooks

```typescript
// Add custom business logic hooks
const collectionWithHooks = {
  name: 'Orders',
  slug: 'orders',
  hooks: {
    beforeCreate: async (data) => {
      // Validate inventory
      const available = await checkInventory(data.productId, data.quantity)
      if (!available) {
        throw new Error('Insufficient inventory')
      }
      return data
    },
    afterCreate: async (order) => {
      // Send confirmation email
      await sendOrderConfirmation(order)
      // Update inventory
      await updateInventory(order.productId, -order.quantity)
    },
    beforeUpdate: async (data) => {
      // Prevent status changes for completed orders
      if (data.status === 'completed') {
        const current = await orderService.findById(data.id)
        if (current.status === 'shipped') {
          throw new Error('Cannot modify completed orders')
        }
      }
      return data
    }
  }
}
```

### 3. Custom Templates

```typescript
// Create custom code templates
const customTemplates = {
  service: `
import { DynamicService } from '@/lib/dynamic-service-generator'

export class {{collectionName}}Service extends DynamicService<{{collectionName}}> {
  constructor() {
    super({
      tableName: '{{collectionSlug}}',
      // Custom configuration
    })
  }

  // Custom methods
  async {{customMethod}}() {
    // Custom implementation
  }
}
`,
  component: `
export function {{collectionName}}Manager() {
  const [data, setData] = useState([])
  const service = {{collectionName}}Service()

  // Custom component logic
}
`
}

// Use custom templates
CollectionBuilder.setTemplates(customTemplates)
```

---

## 📊 Performance Optimization

### 1. Database Optimization

```typescript
// Auto-generated indexes
-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_{{collection_slug}}_{{field_name}}
ON public.{{collection_slug}}({{field_name}});

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_{{collection_slug}}_composite
ON public.{{collection_slug}}(status, created_at);
```

### 2. Query Optimization

```typescript
// Efficient queries with caching
const cachedService = ServiceFactory.create({
  tableName: 'products',
  cache: {
    enabled: true,
    ttl: 300000 // 5 minutes
  }
})

// Batch operations
await productService.createMany(products)
await productService.updateMany(updates)
await productService.deleteMany(ids)
```

### 3. Real-time Optimization

```typescript
// Selective real-time subscriptions
const selectiveSubscription = productService.subscribeToChanges(
  (payload) => handleUpdate(payload),
  { eventTypes: ['INSERT', 'UPDATE'] } // Only specific events
)

// Throttled updates
const throttledSubscription = productService.subscribeToChanges(
  throttle(handleUpdate, 1000), // Throttle updates
  { throttleMs: 1000 }
)
```

---

## 🔒 Security Features

### 1. Row Level Security (RLS)

```sql
-- Auto-generated RLS policies
ALTER TABLE public.{{collection_slug}} ENABLE ROW LEVEL SECURITY;

-- User can only see their own data
CREATE POLICY "{{collection_slug}}_user_access" ON public.{{collection_slug}}
FOR ALL USING (auth.uid() = user_id);

-- Admin can see all data
CREATE POLICY "{{collection_slug}}_admin_access" ON public.{{collection_slug}}
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 2. Input Validation

```typescript
// Comprehensive validation
const validatedData = await validateCreate{{collectionName}}(inputData)
if (!validatedData.success) {
  throw new Error(validatedData.errors.join(', '))
}
```

### 3. Rate Limiting

```typescript
// API rate limiting
const rateLimitedService = ServiceFactory.create({
  tableName: 'api_calls',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  }
})
```

---

## 📱 Mobile & PWA Support

### 1. Offline Capabilities

```typescript
// Offline data synchronization
const offlineService = ServiceFactory.create({
  tableName: 'user_data',
  offline: {
    enabled: true,
    syncInterval: 30000, // 30 seconds
    conflictResolution: 'last-write-wins'
  }
})

// Queue operations for offline
await offlineService.queueOperation('create', data)
await offlineService.syncPendingOperations()
```

### 2. Mobile Optimization

```typescript
// Mobile-optimized queries
const mobileService = ServiceFactory.create({
  tableName: 'content',
  mobile: {
    enabled: true,
    pageSize: 20,
    prefetch: true,
    compression: true
  }
})
```

---

## 🔄 Migration & Updates

### 1. Schema Migrations

```typescript
// Handle collection updates
const migrationManager = new MigrationManager()

// Add new field
await migrationManager.addField('products', {
  name: 'discount_percentage',
  type: 'number',
  defaultValue: 0
})

// Remove field
await migrationManager.removeField('products', 'old_field')

// Update field type
await migrationManager.updateField('products', 'price', {
  type: 'decimal',
  precision: 10,
  scale: 2
})
```

### 2. Data Migration

```typescript
// Migrate existing data
const dataMigration = new DataMigration()

// Transform data during migration
await dataMigration.migrateCollection('products', async (item) => {
  return {
    ...item,
    price_cents: item.price * 100, // Convert dollars to cents
    category: item.old_category || 'uncategorized'
  }
})
```

---

## 🎯 Best Practices

### 1. Collection Design

- **Use descriptive field names** that reflect business meaning
- **Keep collections focused** on specific business domains
- **Use relationships** instead of duplicating data
- **Add appropriate validation** rules
- **Plan for scalability** from the beginning

### 2. Performance

- **Enable caching** for frequently accessed data
- **Use appropriate indexes** for query patterns
- **Implement pagination** for large datasets
- **Optimize relationship queries** with selective loading
- **Monitor query performance** and optimize slow queries

### 3. Security

- **Configure proper access control** for sensitive data
- **Use Row Level Security** to enforce data access policies
- **Validate all input data** both client and server side
- **Implement rate limiting** for API endpoints
- **Regular security audits** of generated code

### 4. Maintenance

- **Version control** for collection schemas
- **Document business rules** and validation logic
- **Monitor system performance** and usage patterns
- **Plan for data migrations** when schema changes
- **Regular backup** of collection data

---

## 🚀 Production Deployment

### 1. Environment Setup

```typescript
// Production configuration
const productionConfig = {
  environment: 'production',
  database: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    connectionPool: 20
  },
  cache: {
    redis: process.env.REDIS_URL,
    ttl: 3600000 // 1 hour
  },
  cdn: {
    provider: 'cloudflare',
    baseUrl: process.env.CDN_URL
  }
}
```

### 2. Monitoring & Analytics

```typescript
// Production monitoring
const monitoringService = ServiceFactory.create({
  tableName: 'system_metrics',
  monitoring: {
    enabled: true,
    metrics: ['response_time', 'error_rate', 'throughput'],
    alerts: {
      errorThreshold: 5, // 5% error rate
      responseTimeThreshold: 1000 // 1 second
    }
  }
})
```

### 3. Backup & Recovery

```typescript
// Automated backups
const backupService = ServiceFactory.create({
  tableName: 'backups',
  backup: {
    enabled: true,
    schedule: '0 2 * * *', // Daily at 2 AM
    retention: 30, // Keep 30 days
    storage: 's3'
  }
})
```

---

## 📞 Support & Troubleshooting

### Common Issues

#### Collection Not Deploying
```typescript
// Check collection configuration
const validation = await validateCollection(collection)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
}
```

#### API Endpoints Not Working
```typescript
// Check API route generation
const routes = await generateAPIRoutes(collection)
console.log('Generated routes:', routes.endpoints)
```

#### Type Errors
```typescript
// Regenerate types after schema changes
await generateTypeScriptTypes(collection)
await updateTypeDefinitions()
```

#### Performance Issues
```typescript
// Enable query optimization
const optimizedService = ServiceFactory.create({
  tableName: 'data',
  optimization: {
    queryCaching: true,
    indexOptimization: true,
    connectionPooling: true
  }
})
```

---

## 🎉 Conclusion

The **Collection Builder Integration** provides a complete solution for creating dynamic, production-ready collections with:

- ✅ **Visual Collection Builder** - Drag-and-drop interface
- ✅ **Automatic API Generation** - RESTful endpoints with validation
- ✅ **Database Schema Creation** - Optimized PostgreSQL tables
- ✅ **TypeScript Integration** - Full type safety
- ✅ **Admin Interface Generation** - Content management UI
- ✅ **Real-time Capabilities** - Live data synchronization
- ✅ **Security & Validation** - Comprehensive protection
- ✅ **Performance Optimization** - Caching and indexing
- ✅ **Production Deployment** - Complete deployment pipeline

**Transform your application development with the power of dynamic collection generation!** 🚀

---

**Built with ❤️ for flexible, scalable application development**

*Collection Builder Integration Guide v1.0*
