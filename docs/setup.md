# 🚀 Setup Guide - Modern Men Hair Salon

This comprehensive setup guide will get you up and running with the Modern Men Hair Salon management system in minutes.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **pnpm** - Package manager (`npm install -g pnpm`)
- **Git** - Version control system
- **PostgreSQL** - Database (local or cloud)

### Recommended Tools
- **VS Code** - Recommended IDE with TypeScript support
- **GitHub Desktop** - Optional GUI for Git
- **Postman** - API testing (optional)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

## ⚡ Quick Start (5 Minutes)

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd modernmen-hair-BarberShop

# Install dependencies
pnpm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables (see section below)
code .env.local  # or your preferred editor
```

### 3. Database Setup
```bash
# Start Supabase (if using local)
pnpm run supabase:start

# Run database migrations
pnpm run db:migrate

# Seed with sample data
pnpm run db:seed
```

### 4. Start Development
```bash
# Start all services
pnpm run dev:all

# Or start individually
pnpm run cms:dev      # Payload CMS Admin
pnpm run dev          # Next.js Frontend
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Page Builder**: http://localhost:3000/builder
- **Payload CMS**: http://localhost:3000/admin/payload

## 🔧 Detailed Setup

### Environment Variables Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# ===========================================
# MODERN MEN HAIR SALON - ENVIRONMENT CONFIG
# ===========================================

# ------------------------------
# DATABASE CONFIGURATION
# ------------------------------
# PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/modernmen_db"

# Supabase Configuration (for real-time features)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# ------------------------------
# AUTHENTICATION
# ------------------------------
# NextAuth.js Configuration
NEXTAUTH_SECRET="your-nextauth-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# JWT Secret (optional, defaults to NEXTAUTH_SECRET)
JWT_SECRET="your-jwt-secret"

# ------------------------------
# PAYLOAD CMS
# ------------------------------
# Payload CMS Secret (min 32 characters)
PAYLOAD_SECRET="your-payload-secret-min-32-chars"

# Payload Public Server URL
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"

# ------------------------------
# PAYMENT PROCESSING (Stripe)
# ------------------------------
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ------------------------------
# EMAIL CONFIGURATION
# ------------------------------
# SMTP Configuration (for email notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@modernmen.com"
FROM_NAME="Modern Men Hair Salon"

# ------------------------------
# EXTERNAL SERVICES
# ------------------------------
# Google Analytics (optional)
NEXT_PUBLIC_GA_ID="GA-XXXXXXXXX"

# Social Media Links (optional)
NEXT_PUBLIC_FACEBOOK_URL="https://facebook.com/modernmen"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/modernmen"
NEXT_PUBLIC_TWITTER_URL="https://twitter.com/modernmen"

# ------------------------------
# DEVELOPMENT SETTINGS
# ------------------------------
# Development mode
NODE_ENV="development"

# Debug logging
DEBUG="true"
NEXT_PUBLIC_DEBUG="true"

# Hot reload
NEXT_PUBLIC_HOT_RELOAD="true"
```

### Generating Secure Secrets

#### NextAuth Secret
```bash
# Generate a secure random string
openssl rand -base64 32
# Or use online generator: https://generate-secret.vercel.app/32
```

#### Payload Secret
```bash
# Generate another secure random string
openssl rand -base64 32
```

#### JWT Secret (Optional)
```bash
# Generate JWT secret
openssl rand -base64 32
```

## 🗄️ Database Setup Options

### Option 1: Supabase (Recommended)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Configure Environment**
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   DATABASE_URL="postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres"
   ```

3. **Run Migrations**
   ```bash
   pnpm run supabase:migrate
   ```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Ubuntu
   sudo apt-get install postgresql
   sudo systemctl start postgresql

   # Windows - use installer from postgresql.org
   ```

2. **Create Database**
   ```bash
   createdb modernmen_db
   ```

3. **Configure Environment**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/modernmen_db"
   ```

4. **Run Migrations**
   ```bash
   pnpm run db:migrate
   ```

## 🔐 Authentication Setup

### NextAuth.js Configuration

The project uses NextAuth.js for authentication. After setting up your environment variables:

1. **Configure Providers**
   - Edit `src/lib/auth.ts` for custom providers
   - Default providers: Email, Google, Facebook

2. **Database Adapter**
   - Uses Supabase adapter by default
   - Can be changed in `src/lib/auth.ts`

3. **Email Provider Setup**
   ```env
   # For Gmail
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"  # Not your regular password!
   ```

## 📧 Email Setup (Optional)

### Gmail SMTP Configuration

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA if not already enabled

2. **Generate App Password**
   - Go to Google Account → Security → App passwords
   - Generate password for "Mail"
   - Use this password in SMTP_PASS

3. **Environment Variables**
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-generated-app-password"
   FROM_EMAIL="noreply@modernmen.com"
   FROM_NAME="Modern Men Hair Salon"
   ```

## 💳 Payment Setup (Optional)

### Stripe Configuration

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Create account and get API keys

2. **Configure Webhooks**
   - Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

## 🧪 Testing Setup

### Running Tests
```bash
# Run all tests
pnpm run test

# Run specific test types
pnpm run test:unit       # Unit tests
pnpm run test:integration # Integration tests
pnpm run test:e2e        # End-to-end tests

# Run with coverage
pnpm run test:coverage

# Run in watch mode
pnpm run test:watch
```

### Test Configuration
- **Jest** - Unit and integration testing
- **Playwright** - E2E testing
- **Testing Library** - React component testing

## 🚢 Production Deployment

### Environment Checklist
- [ ] All secrets generated and configured
- [ ] Database connection tested
- [ ] Email service configured
- [ ] Payment processing set up
- [ ] Domain and SSL configured
- [ ] Monitoring and logging enabled

### Deployment Options
- **Vercel** (recommended): `pnpm run deploy:vercel`
- **Docker**: `docker-compose up -d`
- **Manual**: Follow [deployment guide](deployment.md)

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Test database connection
pnpm run db:health

# Reset database
pnpm run db:reset
pnpm run db:migrate
```

#### Authentication Not Working
```bash
# Check NextAuth configuration
pnpm run auth:test

# Verify environment variables
cat .env.local | grep NEXTAUTH
```

#### Build Errors
```bash
# Clear cache and rebuild
pnpm run clean
pnpm run build

# Check TypeScript errors
pnpm run type-check
```

### Getting Help

- **📖 Documentation**: Check [troubleshooting guide](troubleshooting.md)
- **🐛 Issues**: [GitHub Issues](https://github.com/modernmen/issues)
- **💬 Community**: [Discord Server](https://discord.gg/modernmen)
- **📧 Support**: [Email Support](mailto:support@modernmen.com)

## 🎯 Next Steps

After completing setup:

1. **Explore the Admin Panel**
   - Visit `/admin` to access Payload CMS
   - Create your first customer record
   - Set up services and pricing

2. **Customize the Website**
   - Use the page builder at `/builder`
   - Customize branding and content
   - Add your salon information

3. **Test Core Features**
   - Create a test appointment
   - Test the booking flow
   - Verify email notifications

4. **Deploy to Production**
   - Follow the [deployment guide](deployment.md)
   - Set up monitoring and backups
   - Configure domain and SSL

## 📚 Additional Resources

- **[Architecture Overview](architecture.md)** - System design and components
- **[API Reference](api.md)** - Complete API documentation
- **[Development Guide](development.md)** - Development best practices
- **[Security Guide](security.md)** - Security configuration and best practices

---

**🎉 Setup Complete!** Your Modern Men Hair Salon system is ready to go.

*Need help? Check the [troubleshooting guide](troubleshooting.md) or join our [Discord community](https://discord.gg/modernmen).*"
