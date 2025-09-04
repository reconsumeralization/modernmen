# 🔧 Environment Configuration - Modern Men Hair Salon

Complete guide to configuring environment variables for the Modern Men Hair Salon management system. This document covers all required and optional environment variables, their purposes, and how to generate secure values.

## 📋 Quick Setup

### 1. Copy Template
```bash
cp .env.example .env.local
```

### 2. Generate Secrets
```bash
# Generate NextAuth secret (32 characters)
openssl rand -base64 32

# Generate Payload secret (32 characters)
openssl rand -base64 32

# Generate JWT secret (32 characters)
openssl rand -base64 32
```

### 3. Configure Services
- **Supabase**: Create project at [supabase.com](https://supabase.com)
- **Stripe**: Create account at [stripe.com](https://stripe.com)
- **SMTP**: Set up email service (Gmail, SendGrid, etc.)

## 🔐 Core Configuration

### Authentication Secrets
```env
# NextAuth.js Configuration
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-32-character-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT Configuration (Optional)
JWT_SECRET="your-32-character-jwt-secret"
JWT_EXPIRES_IN="7d"
```

### Payload CMS Configuration
```env
# Payload CMS Secret
# Generate with: openssl rand -base64 32
PAYLOAD_SECRET="your-32-character-payload-secret"

# Payload Server Configuration
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"
PAYLOAD_ADMIN_PATH="/admin"
PAYLOAD_USER_SLUG="users"
```

### Database Configuration
```env
# PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@localhost:5432/modernmen_db"

# Alternative format for cloud databases
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Connection Pool Settings
DB_MAX_CONNECTIONS="20"
DB_IDLE_TIMEOUT="30000"
DB_CONNECTION_TIMEOUT="2000"
```

## 🗄️ Supabase Configuration

### Project Setup
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for setup completion (~2 minutes)
4. Get credentials from Settings → API

### Environment Variables
```env
# Supabase Project Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Optional: Custom Supabase settings
SUPABASE_AUTH_EXTERNAL_REDIRECT_URL="http://localhost:3000/auth/callback"
SUPABASE_AUTH_EXTERNAL_PROVIDERS="google,facebook"
```

### Supabase URL Structure
```
Development: https://your-project-id.supabase.co
Production:  https://your-project-id.supabase.co
Staging:     https://your-project-id-staging.supabase.co
```

## 💳 Stripe Payment Configuration

### Account Setup
1. Go to [stripe.com](https://stripe.com)
2. Create account (use test mode for development)
3. Get API keys from Dashboard → Developers → API keys

### Environment Variables
```env
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Configuration
STRIPE_WEBHOOK_TOLERANCE="300"
STRIPE_API_VERSION="2023-10-16"
```

### Test vs Production Keys
```env
# Test Mode (Development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51..."
STRIPE_SECRET_KEY="sk_test_51..."

# Live Mode (Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_51..."
STRIPE_SECRET_KEY="sk_live_51..."
```

## 📧 Email Configuration

### Gmail SMTP Setup
```env
# Gmail SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"
FROM_NAME="Modern Men Hair Salon"
```

### SendGrid Setup
```env
# SendGrid Configuration
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
FROM_EMAIL="noreply@yourdomain.com"
FROM_NAME="Modern Men Hair Salon"
```

### Other Email Providers
```env
# AWS SES
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-ses-smtp-username"
SMTP_PASS="your-ses-smtp-password"

# Mailgun
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="your-mailgun-smtp-username"
SMTP_PASS="your-mailgun-smtp-password"
```

## 📊 Analytics & Monitoring

### Google Analytics
```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID="GA-XXXXXXXXXX"
GA_DEBUG_MODE="false"
```

### Sentry Error Tracking
```env
# Sentry Configuration
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_ENVIRONMENT="development"
SENTRY_RELEASE="1.0.0"
SENTRY_TRACES_SAMPLE_RATE="1.0"
```

### LogRocket Session Recording
```env
# LogRocket Configuration
NEXT_PUBLIC_LOGROCKET_APP_ID="your-app-id"
LOGROCKET_ENVIRONMENT="development"
```

## 🔒 Security Configuration

### Encryption Keys
```env
# Application Encryption Key
ENCRYPTION_KEY="your-32-character-encryption-key"

# File Upload Encryption
FILE_ENCRYPTION_KEY="your-32-character-file-key"

# Session Encryption
SESSION_SECRET="your-32-character-session-key"
```

### Security Headers
```env
# Content Security Policy
CSP_DEFAULT_SRC="'self'"
CSP_SCRIPT_SRC="'self' 'unsafe-inline'"
CSP_STYLE_SRC="'self' 'unsafe-inline'"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"
CORS_CREDENTIALS="true"
```

### Rate Limiting
```env
# Rate Limiting Configuration
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"  # 15 minutes in milliseconds
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS="false"
```

## ☁️ Cloud Storage Configuration

### AWS S3 Setup
```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
AWS_S3_PUBLIC_URL="https://your-bucket-name.s3.amazonaws.com"

# S3 Upload Configuration
S3_UPLOAD_MAX_SIZE="10485760"  # 10MB in bytes
S3_UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/webp"
```

### Cloudinary Setup
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="modernmen-uploads"
```

## ⚡ Performance & Caching

### Redis Configuration
```env
# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD="your-redis-password"
REDIS_DB="0"

# Upstash Redis (Serverless)
UPSTASH_REDIS_REST_URL="https://your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

### CDN Configuration
```env
# CDN Configuration
CDN_URL="https://cdn.yourdomain.com"
CDN_ENABLED="true"
CDN_INVALIDATION_ENABLED="true"
```

## 🔧 Development Configuration

### Development Settings
```env
# Development Mode
NODE_ENV="development"
NEXT_PUBLIC_DEBUG="true"
DEBUG="modernmen:*"

# Hot Reload
NEXT_PUBLIC_HOT_RELOAD="true"
WATCHMAN_DISABLED="false"

# Development Database
DEV_DATABASE_URL="postgresql://localhost:5432/modernmen_dev"
```

### Testing Configuration
```env
# Test Environment
NODE_ENV="test"
TEST_DATABASE_URL="postgresql://localhost:5432/modernmen_test"
JEST_TIMEOUT="10000"
TEST_HEADLESS="true"
```

## 🌐 Domain & URL Configuration

### Base URLs
```env
# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Admin URLs
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3000/admin"
```

### Social Media & External Links
```env
# Social Media Links
NEXT_PUBLIC_FACEBOOK_URL="https://facebook.com/modernmen"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/modernmen"
NEXT_PUBLIC_TWITTER_URL="https://twitter.com/modernmen"

# External Services
NEXT_PUBLIC_BOOKING_WIDGET_URL="https://book.modernmen.com"
NEXT_PUBLIC_SUPPORT_URL="https://support.modernmen.com"
```

## 📱 Mobile & PWA Configuration

### PWA Settings
```env
# PWA Configuration
NEXT_PUBLIC_PWA_ENABLED="true"
PWA_SW_PATH="/sw.js"
PWA_SCOPE="/"
```

### Mobile-Specific Settings
```env
# Mobile Configuration
MOBILE_BREAKPOINT="768px"
TOUCH_ENABLED="true"
GESTURE_RECOGNITION="true"
```

## 🔧 Build & Deployment Configuration

### Build Settings
```env
# Build Configuration
NEXT_PUBLIC_BUILD_ID="1.0.0"
BUILD_TIME="2024-01-01T00:00:00Z"
BUILD_COMMIT="abc123def"

# Bundle Analysis
ANALYZE_BUNDLE="false"
BUNDLE_ANALYZER_PORT="8888"
```

### Deployment Settings
```env
# Deployment Configuration
DEPLOY_ENV="development"
DEPLOY_BRANCH="main"
DEPLOY_COMMIT="abc123def"

# CI/CD Settings
CI="false"
CONTINUOUS_DEPLOYMENT="false"
```

## 📋 Complete Environment Template

Here's a complete `.env.local` template with all variables:

```env
# ===========================================
# MODERN MEN HAIR SALON - ENVIRONMENT CONFIG
# ===========================================

# ------------------------------
# CORE APPLICATION
# ------------------------------
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_DEBUG="true"

# ------------------------------
# AUTHENTICATION
# ------------------------------
NEXTAUTH_SECRET="your-nextauth-secret-32-chars"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-32-chars"
JWT_EXPIRES_IN="7d"

# ------------------------------
# PAYLOAD CMS
# ------------------------------
PAYLOAD_SECRET="your-payload-secret-32-chars"
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"
PAYLOAD_ADMIN_PATH="/admin"

# ------------------------------
# DATABASE
# ------------------------------
DATABASE_URL="postgresql://username:password@localhost:5432/modernmen_db"
DB_MAX_CONNECTIONS="20"
DB_IDLE_TIMEOUT="30000"
DB_CONNECTION_TIMEOUT="2000"

# ------------------------------
# SUPABASE
# ------------------------------
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# ------------------------------
# PAYMENT PROCESSING
# ------------------------------
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ------------------------------
# EMAIL CONFIGURATION
# ------------------------------
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"
FROM_NAME="Modern Men Hair Salon"

# ------------------------------
# ANALYTICS & MONITORING
# ------------------------------
NEXT_PUBLIC_GA_ID="GA-XXXXXXXXXX"
SENTRY_DSN="https://your-dsn@sentry.io/project"
NEXT_PUBLIC_LOGROCKET_APP_ID="your-app-id"

# ------------------------------
# SECURITY
# ------------------------------
ENCRYPTION_KEY="your-32-char-encryption-key"
SESSION_SECRET="your-32-char-session-key"
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"

# ------------------------------
# FILE STORAGE
# ------------------------------
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket"

# ------------------------------
# CACHING & PERFORMANCE
# ------------------------------
REDIS_URL="redis://localhost:6379"
UPSTASH_REDIS_REST_URL="https://your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
CDN_URL="https://cdn.yourdomain.com"

# ------------------------------
# SOCIAL MEDIA
# ------------------------------
NEXT_PUBLIC_FACEBOOK_URL="https://facebook.com/modernmen"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/modernmen"
NEXT_PUBLIC_TWITTER_URL="https://twitter.com/modernmen"

# ------------------------------
# DEVELOPMENT
# ------------------------------
DEBUG="modernmen:*"
WATCHMAN_DISABLED="false"
TEST_DATABASE_URL="postgresql://localhost:5432/modernmen_test"
```

## 🔑 Generating Secure Secrets

### Method 1: OpenSSL (Recommended)
```bash
# Generate 32-character secret
openssl rand -base64 32

# Generate 64-character secret
openssl rand -base64 64

# Generate hex secret
openssl rand -hex 32
```

### Method 2: Node.js
```bash
# Generate secrets programmatically
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Method 3: Online Generators
- [Random.org](https://www.random.org/strings/)
- [Vercel Secret Generator](https://generate-secret.vercel.app/)
- [Password Generator](https://passwordsgenerator.net/)

## ✅ Validation Checklist

### Required Variables
- [ ] `NEXTAUTH_SECRET` - 32+ characters
- [ ] `PAYLOAD_SECRET` - 32+ characters
- [ ] `DATABASE_URL` - Valid PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Valid URL for your environment

### Optional but Recommended
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - For real-time features
- [ ] `STRIPE_SECRET_KEY` - For payment processing
- [ ] `SMTP_USER` & `SMTP_PASS` - For email notifications
- [ ] `SENTRY_DSN` - For error tracking
- [ ] `NEXT_PUBLIC_GA_ID` - For analytics

### Environment-Specific
- [ ] **Development**: Local URLs and test keys
- [ ] **Staging**: Staging URLs and test keys
- [ ] **Production**: Live URLs and production keys

## 🔧 Environment Switching

### Development Environment
```bash
# .env.local (automatically loaded)
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://localhost:5432/modernmen_dev"
```

### Production Environment
```bash
# .env.production
NODE_ENV="production"
NEXTAUTH_URL="https://yourdomain.com"
DATABASE_URL="postgresql://prod-host:5432/modernmen_prod"
```

### Staging Environment
```bash
# .env.staging
NODE_ENV="production"
NEXTAUTH_URL="https://staging.yourdomain.com"
DATABASE_URL="postgresql://staging-host:5432/modernmen_staging"
```

## 🆘 Troubleshooting

### Common Issues

#### Secrets Not Working
```bash
# Check secret length
echo -n "your-secret" | wc -c  # Should be 32+

# Verify base64 encoding
echo "your-secret" | base64 -d  # Should not error
```

#### Database Connection Failed
```bash
# Test connection
psql "$DATABASE_URL" -c "SELECT version();"

# Check connection string format
# postgresql://user:pass@host:port/database
```

#### Authentication Issues
```bash
# Check NextAuth configuration
curl -X GET http://localhost:3000/api/auth/session

# Verify NEXTAUTH_URL
echo $NEXTAUTH_URL
```

#### Environment Variables Not Loading
```bash
# List all environment variables
env | grep -E "(NEXTAUTH|PAYLOAD|DATABASE)"

# Check .env file syntax
cat .env.local | grep -v '^#' | grep -v '^$'
```

## 📚 Additional Resources

- [NextAuth.js Environment Variables](https://next-auth.js.org/configuration/options)
- [Payload CMS Configuration](https://payloadcms.com/docs/configuration/overview)
- [Supabase Environment Setup](https://supabase.com/docs/guides/local-development)
- [Stripe Environment Variables](https://stripe.com/docs/keys)

---

**🎯 Pro Tips:**
- **Never commit secrets** to version control
- **Use different secrets** for each environment
- **Rotate secrets regularly** for security
- **Test configuration** before deploying
- **Document custom variables** in your team wiki

*Need help with configuration? Check the [troubleshooting guide](troubleshooting.md) or join our [Discord community](https://discord.gg/modernmen).*
