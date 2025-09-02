# 🚀 Modern Men Hair Salon - Developer Installation & Run Manual

## 📖 Overview

Welcome to the Modern Men Hair Salon platform! This comprehensive guide will walk you through setting up, configuring, and running the full-stack application for development and production environments.

---

## 🎯 Table of Contents

- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Detailed Installation](#-detailed-installation)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Development Workflow](#-development-workflow)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## 🛠️ Prerequisites

### System Requirements
```bash
# Minimum Requirements
Node.js: 18.0.0 or higher
npm: 8.0.0 or higher
PostgreSQL: 15.0 or higher
Git: 2.30.0 or higher

# Recommended
Node.js: 20.x LTS
npm: 10.x
PostgreSQL: 15.x
Git: Latest
```

### Required Accounts & Services
- **Supabase Account**: [supabase.com](https://supabase.com) - Database & Auth
- **Stripe Account**: [stripe.com](https://stripe.com) - Payment Processing
- **SendGrid Account**: [sendgrid.com](https://sendgrid.com) - Email Service
- **Twilio Account**: [twilio.com](https://twilio.com) - SMS Service
- **Vercel Account**: [vercel.com](https://vercel.com) - Deployment (optional)

---

## ⚡ Quick Start

### Automated Setup (Recommended)
```bash
# For Linux/Mac
./setup-dev.sh

# For Windows
setup-dev.bat
```

### Manual Setup

#### 1. Clone & Install
```bash
git clone https://github.com/yourusername/modernmen-yolo.git
cd modernmen-yolo
npm install
```

#### 2. Setup Environment
```bash
# Create environment file
touch packages/frontend/.env.local

# Edit with your configuration (see Environment Configuration section)
```

#### 3. Start Development
```bash
# Start all services at once
npm run dev:all

# Or start individually:
npm run dev          # Frontend
npx supabase start   # Database
npm run cms:dev      # CMS (if using)
```

#### 4. Open Browser
- **Frontend**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323
- **ModernMen CMS**: http://localhost:3001 (if running)
- **Email Testing**: http://localhost:54324

---

## 📦 Detailed Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/modernmen-yolo.git
cd modernmen-yolo
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd packages/frontend
npm install

# Install backend dependencies (if separate)
cd ../backend
npm install

# Return to root
cd ../..
```

### Step 3: Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check installed packages
npm list --depth=0
```

---

## 🔧 Environment Configuration

### Frontend Environment Variables

Create `packages/frontend/.env.local`:

```env
# ===========================================
# MODERN MEN HAIR SALON - ENVIRONMENT CONFIG
# ===========================================

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Modern Men Hair Salon"
NEXT_PUBLIC_APP_DESCRIPTION="Premium hair salon management system"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID_BASIC=price_basic_membership
STRIPE_PRICE_ID_PREMIUM=price_premium_membership

# Email Configuration (SendGrid)
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@modernmen.com
SENDGRID_FROM_NAME="Modern Men Hair Salon"
SENDGRID_TEMPLATE_ID_WELCOME=d-template-id
SENDGRID_TEMPLATE_ID_BOOKING=d-template-id

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ModernMen CMS Configuration
ModernMen_SECRET=your-ModernMen-secret-key
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
ModernMen_PUBLIC_SERVER_URL=http://localhost:3001
ModernMen_SERVER_URL=http://localhost:3001

# Analytics & Monitoring
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id

# Feature Flags
NEXT_PUBLIC_ENABLE_BOOKING=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CMS=true

# Development
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

### Supabase Configuration

Update `supabase/config.toml`:

```toml
# Project Configuration
project_id = "modernmen-yolo"

[api]
enabled = true
port = 54321
schemas = ["public", "storage", "graphql_public"]
max_rows = 1000

[auth]
enabled = true
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://localhost:3000"]
jwt_expiry = 3600
enable_signup = true

[auth.email]
enable_signup = true
enable_confirmations = false

[db]
port = 54322
major_version = 15

[studio]
enabled = true
port = 54323
api_url = "http://localhost:54321"
```

---

## 🗄️ Database Setup

### 1. Start Supabase Local
```bash
# Start Supabase services
npx supabase start

# This will start:
# - PostgreSQL database on port 54322
# - Supabase API on port 54321
# - Supabase Studio on port 54323
# - Inbucket (email testing) on port 54324
```

### 2. Initialize Database Schema
```bash
# Push database migrations
npm run db:push

# Generate TypeScript types
npm run db:generate
```

### 3. Seed Database (Optional)
```bash
# Run database seeds
npx supabase db reset

# Or manually seed data
npx supabase db push
```

### 4. Verify Database Connection
```bash
# Check Supabase status
npx supabase status

# Open Supabase Studio
open http://localhost:54323
```

---

## 🚀 Development Workflow

### Starting Development Servers

#### Option 1: Using npm scripts (Recommended)
```bash
# Start all services
npm run dev:all

# Or start individually:
npm run dev          # Frontend
npm run db:start     # Database
npm run cms:dev      # CMS (if used)
```

#### Option 2: Manual startup
```bash
# Terminal 1: Frontend
cd packages/frontend
npm run dev

# Terminal 2: Supabase
npx supabase start

# Terminal 3: ModernMen CMS (if used)
npm run cms:dev
```

### Development URLs
- **Frontend**: http://localhost:3000
- **API**: http://localhost:54321
- **Supabase Studio**: http://localhost:54323
- **ModernMen CMS**: http://localhost:3001
- **Email Testing**: http://localhost:54324

### Code Quality Checks

#### Linting
```bash
# Lint all code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Lint specific package
cd packages/frontend && npm run lint
```

#### Type Checking
```bash
# Type check all packages
npm run type-check

# Type check specific package
cd packages/frontend && npm run type-check
```

#### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:coverage

# Run E2E tests
npx playwright test
```

### Development Commands

```bash
# Build for production
npm run build

# Start production server
npm run start

# Clean build artifacts
npm run clean

# Generate database types
npm run db:generate

# Push database changes
npm run db:push
```

---

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm run test

# Run specific test file
npm run test -- components/ui/Button.test.tsx

# Run tests with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Run API integration tests
npm run test:integration

# Test database connections
npm run test:db
```

### End-to-End Tests
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run specific test
npx playwright test tests/booking.spec.ts

# Generate test report
npx playwright show-report
```

### Performance Testing
```bash
# Lighthouse performance audit
npm run lighthouse

# Bundle analyzer
npm run build:analyze

# Performance profiling
npm run build:profile
```

---

## 🚀 Deployment

### Vercel Deployment

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy to Production
```bash
# Link project (first time only)
vercel link

# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

#### 4. Configure Environment Variables
```bash
# Set environment variables in Vercel dashboard
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add all required variables
```

### Manual Deployment

#### 1. Build Application
```bash
npm run build
npm run build:analyze  # Optional: analyze bundle
```

#### 2. Start Production Server
```bash
npm run start
```

#### 3. Configure Reverse Proxy (nginx example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using ports
lsof -i :3000
lsof -i :54321

# Kill process using port
kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check Supabase status
npx supabase status

# Restart Supabase
npx supabase stop
npx supabase start

# Reset database
npx supabase db reset
```

#### 3. Build Failures
```bash
# Clear Next.js cache
rm -rf packages/frontend/.next
rm -rf packages/frontend/node_modules/.cache

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors
```bash
# Check TypeScript configuration
npm run type-check

# Generate fresh types
npm run db:generate

# Clear TypeScript cache
rm -rf packages/frontend/tsconfig.tsbuildinfo
```

#### 5. Environment Variable Issues
```bash
# Check environment variables
printenv | grep NEXT_PUBLIC

# Validate .env.local syntax
node -e "require('dotenv').config({path: 'packages/frontend/.env.local'}); console.log('Environment loaded successfully')"
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=*
export NEXT_PUBLIC_DEBUG=true

# Start with verbose output
npm run dev -- --verbose
```

---

## 📚 API Documentation

### REST API Endpoints

#### Authentication
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

#### Appointments
```typescript
GET    /api/appointments          # List appointments
POST   /api/appointments          # Create appointment
GET    /api/appointments/:id      # Get appointment
PUT    /api/appointments/:id      # Update appointment
DELETE /api/appointments/:id      # Cancel appointment
```

#### Services
```typescript
GET    /api/services             # List services
POST   /api/services             # Create service
GET    /api/services/:id         # Get service
PUT    /api/services/:id         # Update service
DELETE /api/services/:id         # Delete service
```

#### Customers
```typescript
GET    /api/customers            # List customers
POST   /api/customers            # Create customer
GET    /api/customers/:id        # Get customer
PUT    /api/customers/:id        # Update customer
```

### GraphQL API (if enabled)
```graphql
query GetAppointments {
  appointments {
    id
    date
    time
    service {
      name
      price
    }
    customer {
      name
      email
    }
    barber {
      name
      rating
    }
  }
}
```

---

## 🤝 Contributing

### Development Guidelines

#### 1. Code Style
```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

#### 2. Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to branch
git push origin feature/your-feature-name

# Create Pull Request
# Use GitHub interface or CLI
```

#### 3. Commit Message Format
```bash
# Format: type(scope): description
feat(auth): add OAuth login support
fix(booking): resolve double booking issue
docs(readme): update installation instructions
test(appointments): add unit tests for booking logic
```

#### 4. Testing Requirements
```bash
# All new features must include:
# - Unit tests (Jest)
# - Integration tests (if applicable)
# - E2E tests for critical flows
# - Minimum 80% test coverage
```

### Code Review Process

1. **Create PR** with clear description
2. **Automated Checks** run (lint, test, build)
3. **Peer Review** by at least 1 team member
4. **Approval** and merge to main branch
5. **Deploy** to staging for final testing

---

## 📊 Performance Monitoring

### Key Metrics to Monitor

#### Frontend Performance
- **Core Web Vitals**: LCP, FID, CLS
- **Bundle Size**: Keep under 500KB gzipped
- **First Paint**: Under 2 seconds
- **Time to Interactive**: Under 3 seconds

#### Backend Performance
- **API Response Time**: Under 200ms average
- **Database Query Time**: Under 50ms average
- **Error Rate**: Under 1%
- **Uptime**: 99.9% SLA

#### Database Performance
- **Connection Pool**: Monitor active connections
- **Query Performance**: Identify slow queries
- **Index Usage**: Ensure proper indexing
- **Backup Status**: Automated daily backups

### Monitoring Tools

```bash
# Bundle analyzer
npm run build:analyze

# Lighthouse audit
npm run lighthouse

# Performance profiling
npm run build:profile
```

---

## 🔒 Security Guidelines

### Environment Variables
- Never commit secrets to version control
- Use different keys for development/production
- Rotate keys regularly
- Use environment-specific configurations

### Authentication
- Implement proper session management
- Use HTTPS in production
- Enable CSRF protection
- Implement rate limiting

### Data Protection
- Encrypt sensitive data at rest
- Use parameterized queries
- Implement proper access controls
- Regular security audits

---

## 📞 Support & Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Community Support
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time community support
- **Stack Overflow**: Technical questions
- **Documentation Wiki**: Internal knowledge base

### Contact Information
- **Technical Support**: dev@modernmen.com
- **Business Support**: support@modernmen.com
- **Security Issues**: security@modernmen.com

---

## 🎯 Project Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and authorization
- [x] Appointment booking system
- [x] Staff management
- [x] Basic customer portal

### Phase 2: Advanced Features 🚧
- [x] Advanced analytics dashboard
- [x] Tutorial system for staff/customers
- [ ] AI-powered recommendations
- [ ] Mobile PWA
- [ ] Multi-location support

### Phase 3: Enterprise Features 📋
- [ ] Advanced reporting and insights
- [ ] Marketing automation
- [ ] Inventory management
- [ ] Loyalty program enhancements

---

## 🏆 Success Metrics

### Development KPIs
- **Build Time**: Under 3 minutes
- **Test Coverage**: 80%+ code coverage
- **Performance Score**: 90+ Lighthouse score
- **Zero Critical Bugs**: Production stability

### Business KPIs
- **User Satisfaction**: 4.8+ star rating
- **Conversion Rate**: 15%+ booking conversion
- **Retention Rate**: 80%+ customer retention
- **Revenue Growth**: 25%+ monthly growth

---

## 🎉 Conclusion

You've successfully set up the Modern Men Hair Salon platform! This comprehensive system includes:

- ✅ **Full-Stack Application** with modern web technologies
- ✅ **Scalable Architecture** with microservices design
- ✅ **Production-Ready** deployment configurations
- ✅ **Comprehensive Testing** and quality assurance
- ✅ **Developer-Friendly** tooling and documentation

The platform is now ready for development, testing, and production deployment. Happy coding! 🚀

---

*Built with ❤️ for the modern gentleman*

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: Modern Men Development Team
