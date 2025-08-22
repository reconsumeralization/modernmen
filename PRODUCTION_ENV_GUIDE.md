# Modern Men - Production Environment Variables Guide

## 🔐 Environment Variables for Vercel Production Deployment

### Required Environment Variables

Copy these to your Vercel Dashboard → Project Settings → Environment Variables:

#### Database & Authentication
```env
# Production Supabase (replace with your production Supabase instance)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Authentication (generate a new secret for production)
NEXTAUTH_SECRET=your-32-character-random-string-for-production
NEXTAUTH_URL=https://your-app-name.vercel.app

# OAuth Providers (production credentials)
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GITHUB_CLIENT_ID=your_production_github_client_id
GITHUB_CLIENT_SECRET=your_production_github_client_secret
```

#### API Keys & External Services
```env
# AI API Keys
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# Redis for Rate Limiting (optional but recommended)
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

#### Optional Services
```env
# Email (for transactional emails)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@your-domain.com

# File Storage (if using AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket

# Monitoring
SENTRY_DSN=your-sentry-dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```
## 🚀 How to Set Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your project
3. Click "Settings" → "Environment Variables"
4. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Variable value (e.g., `https://your-project.supabase.co`)
   - **Environment**: Select `Production`, `Preview`, and `Development` as needed
5. Click "Save"

### Method 2: Via Vercel CLI
```bash
# Set a single environment variable
vercel env add VARIABLE_NAME

# Import from .env file
vercel env pull .env.production
```

## 🔒 Security Best Practices

### Generate Strong Secrets
```bash
# Generate NEXTAUTH_SECRET (32 characters)
openssl rand -base64 32

# Or use online generator: https://generate-secret.vercel.app/32
```

### Environment-Specific Variables
- **Development**: Use local Supabase, test API keys
- **Preview**: Use staging database, test credentials  
- **Production**: Use production database, live API keys

## 📋 Pre-Deployment Checklist

- [ ] Production Supabase project created
- [ ] OAuth apps configured for production domain
- [ ] API keys generated for production use
- [ ] NEXTAUTH_SECRET generated (different from development)
- [ ] NEXTAUTH_URL set to production domain
- [ ] All environment variables added to Vercel
- [ ] Test database connectivity
- [ ] Verify OAuth flows work

## 🏗️ Database Setup (Supabase)

### Create Production Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down the URL and service role key
4. Run database migrations:
   ```sql
   -- Copy your local database schema to production
   -- Or use Supabase migrations
   ```

### Configure RLS (Row Level Security)
Ensure your production database has proper security policies enabled.

## 🔗 OAuth Configuration

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

### GitHub OAuth  
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-app.vercel.app/api/auth/callback/github`

## 🚨 Common Deployment Issues

### Build Failures
- Check TypeScript errors: `npm run typecheck`
- Verify all dependencies: `npm install`
- Test local build: `npm run build`

### Environment Variable Issues
- Ensure all required variables are set
- Check variable names (case-sensitive)
- Verify production values are different from development

### Database Connection Issues
- Confirm production Supabase URL is correct
- Check service role key permissions
- Verify network connectivity

## 📞 Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)