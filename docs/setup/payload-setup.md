# Payload CMS Setup Guide

## Overview

This guide walks you through setting up Payload CMS for the Modern Men Hair Salon management system. Payload CMS provides a powerful admin interface for managing salon data including customers, appointments, services, and staff.

## Prerequisites

1. **Node.js 18+** installed
2. **PostgreSQL database** (recommended) or any Payload-supported database
3. **Environment variables** configured in `.env.local`

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update the following variables:

```env
# Database - Use your actual PostgreSQL connection string
DATABASE_URL=postgresql://username:password@localhost:5432/modernmen

# Payload CMS
PAYLOAD_SECRET=your-secure-random-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### 3. Run Setup Script

```bash
npm run setup:payload
```

This script will:
- Generate secure secrets if needed
- Install/update dependencies
- Generate Payload TypeScript types
- Run database migrations
- Create seed data

### 4. Start Development Server

```bash
npm run dev:cms
```

This starts both Next.js and Payload CMS on port 3000.

## Manual Setup (Alternative)

If the automated setup doesn't work, follow these steps:

### 1. Generate Secrets

```bash
node -e "console.log('PAYLOAD_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Initialize Database

```bash
npx payload migrate
```

### 3. Generate Types

```bash
npm run payload:generate-types
```

### 4. Create Admin User

Visit `http://localhost:3000/admin` and create your first admin user.

## Collections Overview

The Modern Men Hair Salon system includes these Payload collections:

### Core Collections
- **Users** - System users (admins, managers, staff, stylists)
- **Customers** - Client profiles and hair history
- **Services** - Hair salon services and pricing
- **Appointments** - Booking management
- **Stylists** - Staff profiles and schedules

### Extended Collections
- **Media** - File and image management
- **Service Packages** - Bundled service offerings
- **Commissions** - Staff commission tracking
- **Inventory** - Product inventory management
- **Wait List** - Appointment wait list
- **Notifications** - System notifications
- **Documentation** - Business documentation

## Accessing the Admin Panel

1. Start the development server: `npm run dev:cms`
2. Open your browser to `http://localhost:3000/admin`
3. Log in with your admin credentials
4. Begin managing your salon data!

## API Endpoints

Payload CMS provides REST and GraphQL APIs:

### REST API
- `GET /api/users` - List users
- `GET /api/appointments` - List appointments
- `GET /api/services` - List services
- `POST /api/customers` - Create customer

### Custom Endpoints
- `GET /api/payload/init?action=health` - Health check
- `GET /api/payload/init?action=init` - Initialize Payload
- `POST /api/payload/init` - Full setup

### Search Endpoint
- `GET /api/search?q=query&collections=services,customers` - Global search

## Integration with Next.js

The salon application integrates Payload CMS with:

1. **Authentication** - Shared user system with NextAuth.js
2. **API Routes** - Custom endpoints for business logic
3. **Components** - React components for admin dashboard
4. **Types** - Auto-generated TypeScript types

## Development Commands

```bash
# Start all services
npm run dev:full

# Start just CMS
npm run dev:cms

# Check service status
npm run dev:status

# Generate types
npm run payload:generate-types

# Health check
npm run payload:health

# Full setup (API)
npm run payload:setup
```

## Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env.local`
3. Ensure database exists and is accessible

### Type Errors
1. Run `npm run payload:generate-types`
2. Restart your IDE/TypeScript server
3. Check for any breaking changes in collections

### Admin Panel Not Loading
1. Verify `PAYLOAD_SECRET` is set
2. Check browser console for errors
3. Ensure no port conflicts (default: 3000)

### Migration Errors
1. Check database permissions
2. Verify schema compatibility
3. Run migrations manually: `npx payload migrate`

## Production Deployment

For production deployment:

1. **Environment Variables**: Set all production environment variables
2. **Database**: Use a production PostgreSQL instance
3. **Secrets**: Use secure, random secrets (not the defaults)
4. **SSL**: Enable SSL for database connections
5. **File Storage**: Configure cloud file storage (AWS S3, etc.)

## Security Considerations

1. **Secrets**: Never commit secrets to version control
2. **Database**: Use strong database credentials
3. **Admin Access**: Limit admin user creation
4. **Rate Limiting**: Enable rate limiting for API endpoints
5. **CORS**: Configure CORS for production domains

## Support

- **Payload CMS Docs**: https://payloadcms.com/docs
- **Modern Men Repo**: Check the project's GitHub issues
- **Development**: Use the integrated documentation system at `/documentation`

---

## Modern Men Hair Salon - Specific Features

### Business Logic
- **Appointment Conflict Prevention**: Automatic scheduling conflict detection
- **Loyalty Program**: Points-based customer loyalty system  
- **Commission Tracking**: Staff commission calculation
- **Inventory Management**: Product usage tracking

### Integrations
- **Email Templates**: Branded email notifications
- **SMS Reminders**: Appointment reminder system
- **Analytics**: Business performance metrics
- **File Management**: Professional photo galleries

### Admin Features
- **Dashboard**: Real-time business metrics
- **Search**: Global search across all collections  
- **Reporting**: Custom business reports
- **User Management**: Role-based access control

Ready to manage your Modern Men Hair Salon with Payload CMS! 💇‍♂️✂️