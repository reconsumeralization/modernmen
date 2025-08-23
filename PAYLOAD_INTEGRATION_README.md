# Payload CMS Integration Guide

## Overview

Modern Men Salon Management System now includes a fully integrated Payload CMS backend that provides:

- **Content Management**: Manage services, stylists, customers, and appointments
- **Media Management**: Upload and organize images and documents
- **User Management**: Role-based access control for admin, stylists, and customers
- **API Integration**: RESTful APIs for all frontend functionality
- **Admin Interface**: User-friendly admin panel at `/admin`

## Features

### Core Collections
- **Users**: Customer and admin user management
- **Services**: Haircut services, pricing, and descriptions
- **Customers**: Customer profiles and appointment history
- **Appointments**: Booking management and scheduling
- **Stylists**: Staff profiles, schedules, and commissions
- **Media**: File uploads and media library
- **Commissions**: Stylist commission tracking
- **Service Packages**: Bundled services and pricing
- **Inventory**: Product and supply management
- **Wait List**: Customer waitlist management
- **Notifications**: System notifications and alerts
- **Documentation**: Integrated documentation system

### API Endpoints
- `/api/admin/[...payload]` - Admin panel API
- `/api/payload/init` - Initialization and health checks
- `/api/payload/rch` - rch across collections
- `/api/payload/analytics` - Analytics and reporting

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Payload CMS Configuration
PAYLOAD_SECRET=your-super-secret-payload-key-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@localhost:5432/modernmen_db
```

### 2. Database Setup

Ensure you have PostgreSQL running and create a database:

```bash
createdb modernmen_db
```

### 3. Initialize Payload

Run the setup commands:

```bash
# Initialize Payload CMS
npm run payload:setup

# Or run individually:
npm run payload:init    # Initialize CMS
npm run payload:seed    # Seed initial data
```

### 4. Generate Types

Generate TypeScript types for your collections:

```bash
npm run payload:generate-types
```

### 5. Access Admin Panel

Visit `/admin` in your browser to access the Payload admin interface.

Default admin credentials:
- Email: `admin@modernmen.com`
- Password: Set during initialization

## Configuration

### Payload Config Location
- Main config: `src/payload.config.ts`
- Collections: `src/collections/` and `src/payload/collections/`
- Components: `src/payload/components/`

### Key Configuration Features

1. **Modern Men Branding**: Custom admin interface with brand colors
2. **Authentication Integration**: Works with existing Next.js auth
3. **Rate Limiting**: Built-in rate limiting for API endpoints
4. **Localization**: Ready for multi-language support
5. **Hooks**: Custom hooks for data processing and validation

## API Integration

### rch Integration

The Payload rch endpoint is integrated with the main rch functionality:

```typescript
// Example rch request
const response = await fetch('/api/payload/rch?q=haircut&collection=services')
const results = await response.json()
```

### Analytics Integration

Get analytics data from Payload:

```typescript
const response = await fetch('/api/payload/analytics')
const analytics = await response.json()
// Returns: { services: number, customers: number, appointments: number, stylists: number }
```

## Development Workflow

### Running in Development

```bash
# Start Next.js dev server (includes Payload)
npm run dev

# Or run Payload separately for admin development
npm run payload:dev
```

### Database Migrations

Payload handles database migrations automatically when you modify collections.

### Adding New Collections

1. Create collection file in `src/collections/` or `src/payload/collections/`
2. Import and add to `src/payload.config.ts`
3. Run `npm run payload:generate-types`

## Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PAYLOAD_SECRET=your-production-secret-key
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.com
DATABASE_URL=your-production-database-url
```

### Build Process

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Health Checks

Monitor Payload health:

```bash
npm run payload:health
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **Type Errors**: Run `npm run payload:generate-types` after collection changes
3. **Admin Access**: Check that admin user exists in database
4. **CORS Issues**: Verify `PAYLOAD_PUBLIC_SERVER_URL` matches your domain

### Debug Mode

Enable debug logging:

```typescript
// In payload.config.ts
export default buildConfig({
  // ... other config
  debug: process.env.NODE_ENV === 'development',
})
```

## Advanced Features

### Custom Hooks

Add custom logic before/after database operations:

```typescript
hooks: {
  beforeChange: [
    ({ data, collection }) => {
      // Custom validation or data processing
      return data
    }
  ],
  afterRead: [
    ({ doc }) => {
      // Post-processing of retrieved data
      return doc
    }
  ]
}
```

### Custom Endpoints

Add custom API endpoints in the config:

```typescript
endpoints: [
  {
    path: '/api/custom-endpoint',
    method: 'get',
    handler: async (req) => {
      // Custom endpoint logic
      return new Response(JSON.stringify({ data: 'custom' }))
    }
  }
]
```

## Support

For Payload CMS documentation, visit: https://payloadcms.com/docs

For Modern Men specific integration help, check the documentation at `/documentation`.
