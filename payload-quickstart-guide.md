# 🚀 Payload CMS Quick Start Guide

## Step 1: Install Payload (5 minutes)

```bash
# Create a new Payload project in your existing Next.js app
cd /path/to/your/modern-men-project

# Install Payload dependencies
npm install payload @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/next
```

## Step 2: Create Payload Configuration (15 minutes)

```typescript
// src/payload/payload.config.ts
import { buildConfig } from 'payload/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Customers, Appointments, Services, Stylists } from './collections'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    }
  }),

  // Disable Payload auth - use your existing system
  auth: false,

  admin: {
    user: 'customers',
    meta: {
      title: 'Modern Men CRM',
      description: 'Hair Salon Management System'
    }
  },

  collections: [Customers, Appointments, Services, Stylists],

  editor: lexicalEditor(),

  typescript: {
    outputFile: './payload-types.ts'
  }
})
```

## Step 3: Create Collections (20 minutes)

```typescript
// src/payload/collections/index.ts
export { Customers } from './customers'
export { Appointments } from './appointments'
export { Services } from './services'
export { Stylists } from './stylists'
```

```typescript
// src/payload/collections/customers.ts
import { CollectionConfig } from 'payload/types'

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: false,
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'phone', type: 'text' },
    {
      name: 'hairType',
      type: 'select',
      options: [
        { label: 'Straight', value: 'straight' },
        { label: 'Wavy', value: 'wavy' },
        { label: 'Curly', value: 'curly' },
        { label: 'Kinky/Coily', value: 'kinky' }
      ]
    },
    { name: 'loyaltyPoints', type: 'number', defaultValue: 0 },
    { name: 'lastVisit', type: 'date' },
    { name: 'nextAppointment', type: 'date' }
  ]
}
```

## Step 4: Create API Routes (10 minutes)

```typescript
// src/app/api/crm/[...payload]/route.ts
import { handlers } from '@/payload/payload.config'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Add your user context to the request
  const payloadRequest = new Request(request.url, {
    method: request.method,
    headers: {
      ...request.headers,
      'x-user-id': session.user.id,
      'x-user-role': session.user.role
    },
    body: request.body
  })

  return handlers.GET(payloadRequest)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payloadRequest = new Request(request.url, {
    method: request.method,
    headers: {
      ...request.headers,
      'x-user-id': session.user.id,
      'x-user-role': session.user.role
    },
    body: request.body
  })

  return handlers.POST(payloadRequest)
}
```

## Step 5: Access Payload Admin (2 minutes)

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/crm/admin`
3. Sign in with your existing authentication system
4. Start managing your salon data!

## Step 6: Basic Usage Examples

```typescript
// Create a customer
const customer = await payload.create({
  collection: 'customers',
  data: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    hairType: 'wavy',
    loyaltyPoints: 100
  }
})

// Book an appointment
const appointment = await payload.create({
  collection: 'appointments',
  data: {
    customer: customer.id,
    stylist: 'stylist-id',
    services: ['haircut-service-id'],
    dateTime: new Date('2025-01-15T14:00:00Z'),
    status: 'scheduled'
  }
})

// Query customers
const customers = await payload.find({
  collection: 'customers',
  where: {
    loyaltyPoints: {
      greater_than: 50
    }
  }
})
```

## Step 7: White-Label Styling (Optional)

```css
/* src/app/styles/payload-custom.css */
:root {
  --primary-color: #1a365d;
  --secondary-color: #2d3748;
  --accent-color: #ed8936;
}

.admin-panel {
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
  color: white;
}

.admin-panel .btn-primary {
  background-color: #ed8936;
  border-color: #ed8936;
}
```

## Step 8: Next Steps

1. **Explore Collections**: Add more fields specific to your salon
2. **Custom Fields**: Create hair-type specific fields and treatments
3. **Relationships**: Link customers to stylists and services
4. **Business Logic**: Add appointment validation and availability checking
5. **Email Integration**: Set up appointment reminders and confirmations
6. **Reporting**: Create dashboards for business insights

## 🎯 Success Checklist

- [ ] Payload installed and configured
- [ ] Basic collections created (customers, appointments, services, stylists)
- [ ] API routes working with your existing authentication
- [ ] Admin panel accessible at `/api/crm/admin`
- [ ] Can create and manage salon data
- [ ] Ready for white-label customization

## 🚨 Common Issues & Solutions

**Issue**: "Missing required environment variable: DATABASE_URL"
**Solution**: Set `DATABASE_URL` to your Supabase connection string

**Issue**: "Unauthorized" when accessing admin
**Solution**: Ensure your user has `role: 'admin'` in your auth system

**Issue**: Collections not showing in admin
**Solution**: Check that collections are properly exported and imported

## 📚 Resources

- [Payload Documentation](https://payloadcms.com/docs)
- [Payload GitHub Examples](https://github.com/payloadcms/payload/tree/main/examples)
- [Next.js Integration Guide](https://payloadcms.com/docs/getting-started/installation)
- [White-labeling Guide](https://payloadcms.com/docs/admin/components)

**Estimated Time to Working CRM**: 2-4 hours for basic setup, 2-3 weeks for full customization.
