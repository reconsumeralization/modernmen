# 🚀 Deployment Guide - Modern Men Hair Salon

Complete deployment guide for the Modern Men Hair Salon management system. Choose from multiple deployment options based on your infrastructure preferences and scaling needs.

## 📋 Deployment Options

### Quick Reference Table

| Option | Ease | Cost | Scaling | Best For |
|--------|------|------|---------|----------|
| **Vercel** | ⭐⭐⭐⭐⭐ | 💰💰 | ⭐⭐⭐⭐⭐ | Quick MVP, Prototyping |
| **Railway** | ⭐⭐⭐⭐ | 💰💰💰 | ⭐⭐⭐⭐ | Full-stack apps |
| **AWS** | ⭐⭐ | 💰💰💰💰💰 | ⭐⭐⭐⭐⭐ | Enterprise, Custom infra |
| **DigitalOcean** | ⭐⭐⭐ | 💰💰💰 | ⭐⭐⭐⭐ | Cost-effective scaling |
| **Docker** | ⭐⭐⭐ | 💰💰 | ⭐⭐⭐⭐⭐ | Containerized deployments |

## ⚡ Quick Deployment (Vercel - Recommended)

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/modernmen-hair-BarberShop)

### Option 2: Manual Vercel Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 3: Automated Script (Windows)
```bash
# Use the automated deployment script
deploy-to-vercel.bat
```

## 🔧 Environment Setup

### 1. Environment Variables
Create production environment variables in your deployment platform:

```env
# ===========================================
# MODERN MEN PRODUCTION ENVIRONMENT
# ===========================================

# Database Configuration
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-32-chars"
NEXTAUTH_URL="https://yourdomain.com"

# Payload CMS
PAYLOAD_SECRET="your-payload-secret-32-chars"
PAYLOAD_PUBLIC_SERVER_URL="https://yourdomain.com"

# Payment Processing (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"
FROM_NAME="Modern Men Hair Salon"

# Analytics & Monitoring
NEXT_PUBLIC_GA_ID="GA-XXXXXXXXX"
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project"

# File Storage (Optional)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_S3_BUCKET="your-bucket-name"

# Redis (Optional - for caching)
REDIS_URL="redis://your-redis-url"
UPSTASH_REDIS_REST_URL="https://your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Security
ENCRYPTION_KEY="your-32-char-encryption-key"
```

### 2. Database Setup

#### Option A: Supabase (Recommended)
1. Create project at [supabase.com](https://supabase.com)
2. Get connection details from project settings
3. Run migrations: `pnpm run supabase:migrate`

#### Option B: PostgreSQL
```sql
-- Create production database
CREATE DATABASE modernmen_prod;

-- Set up user and permissions
CREATE USER modernmen_user WITH PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE modernmen_prod TO modernmen_user;
```

### 3. Domain Configuration
```bash
# Add custom domain to Vercel
vercel domains add yourdomain.com

# Configure DNS (point to Vercel nameservers)
# NS records should point to:
# ns1.vercel-dns.com
# ns2.vercel-dns.com
```

## 🌐 Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub repository
- Domain name (optional)

### Step-by-Step Deployment

1. **Connect Repository**
   ```bash
   # Push code to GitHub
   git add .
   git commit -m "feat: production ready"
   git push origin main
   ```

2. **Deploy on Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and deploy
   vercel login
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard → Project Settings → Environment Variables
   - Add all required variables from the list above

4. **Set Up Database**
   ```bash
   # Run database migrations
   vercel env pull .env.production
   pnpm run db:migrate
   pnpm run db:seed
   ```

5. **Configure Domain** (Optional)
   ```bash
   # Add custom domain
   vercel domains add yourdomain.com
   ```

### Vercel-Specific Configuration

Create `vercel.json` in your project root:
```json
{
  "buildCommand": "pnpm run build:all",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🐳 Docker Deployment

### Docker Compose Setup

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  app:
    image: modernmen-hair-BarberShop:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}
    depends_on:
      - postgres
    volumes:
      - ./uploads:/app/uploads

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=modernmen_prod
      - POSTGRES_USER=modernmen_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Docker Deployment Commands
```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d

# Build only
docker build -t modernmen-hair-BarberShop .

# Run migrations in container
docker-compose exec app pnpm run db:migrate
```

## ☁️ AWS Deployment

### EC2 + RDS Setup

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 22.04 LTS, t3.medium or larger
   aws ec2 run-instances \
     --image-id ami-0abcdef1234567890 \
     --instance-type t3.medium \
     --key-name your-key-pair \
     --security-groups sg-your-security-group
   ```

2. **Set Up RDS PostgreSQL**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier modernmen-prod \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username modernmen_user \
     --master-user-password your-password \
     --allocated-storage 20
   ```

3. **Deploy Application**
   ```bash
   # Connect to EC2
   ssh -i your-key.pem ubuntu@your-ec2-ip

   # Install Node.js and PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2 pnpm

   # Clone and deploy
   git clone https://github.com/your-repo/modernmen-hair-BarberShop.git
   cd modernmen-hair-BarberShop
   pnpm install
   pnpm run build

   # Start with PM2
   pm2 start ecosystem.config.js --env production
   pm2 startup
   pm2 save
   ```

### AWS-Specific Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'modernmen-app',
    script: 'npm start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

## 🌊 Railway Deployment

### Quick Railway Deploy
1. Connect GitHub repository to Railway
2. Add environment variables
3. Deploy automatically

### Railway Configuration
```bash
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

## 🌐 DigitalOcean Deployment

### App Platform (Easiest)
1. Connect GitHub repository
2. Choose Node.js runtime
3. Configure environment variables
4. Set up database (DigitalOcean Managed DB)

### Droplet Setup
```bash
# Create Droplet
doctl compute droplet create modernmen-prod \
  --image ubuntu-22-04-x64 \
  --size s-2vcpu-4gb \
  --region nyc1

# Configure domain
doctl compute domain create yourdomain.com
doctl compute domain records create yourdomain.com \
  --record-type A \
  --record-name @ \
  --record-data your-droplet-ip
```

## 🔒 Security Configuration

### SSL/TLS Setup
```bash
# Automatic SSL with Vercel
# Just add your domain - SSL is automatic

# Manual SSL with Certbot (Linux)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Security Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}
```

## 📊 Monitoring & Analytics

### Application Monitoring
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to _app.tsx
import { Analytics } from '@vercel/analytics/react'
```

### Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
})
```

### Performance Monitoring
```bash
# Install Speed Insights
npm install @vercel/speed-insights

# Add to _app.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
```

## 🔄 Database Migration

### Production Database Setup
```bash
# Run migrations
pnpm run db:migrate

# Seed initial data
pnpm run db:seed

# Validate data integrity
pnpm run db:validate
```

### Backup Strategy
```bash
# Automated backups with Supabase
# Daily backups are automatic

# Manual backup
pg_dump "your-connection-string" > backup.sql

# Restore backup
psql "your-connection-string" < backup.sql
```

## 🚀 Post-Deployment Checklist

### Pre-Launch
- [ ] Environment variables configured
- [ ] Database connected and migrated
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Email service tested
- [ ] Payment processing verified

### Testing
- [ ] User registration/login works
- [ ] Appointment booking functions
- [ ] Payment processing successful
- [ ] Email notifications sent
- [ ] Mobile responsiveness verified
- [ ] Admin panel accessible

### Monitoring
- [ ] Analytics tracking configured
- [ ] Error monitoring active
- [ ] Performance monitoring enabled
- [ ] Backup system operational

### Security
- [ ] SSL certificate valid
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Authentication working
- [ ] Sensitive data encrypted

## 🆘 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear build cache
rm -rf .next node_modules/.cache

# Check build logs
npm run build 2>&1 | tee build.log

# Verify Node.js version
node --version
```

#### Database Connection Issues
```bash
# Test database connection
pnpm run db:health

# Check connection string format
echo $DATABASE_URL

# Verify database credentials
psql "your-connection-string" -c "SELECT version();"
```

#### Environment Variable Issues
```bash
# List all environment variables
env | grep -E "(NEXTAUTH|PAYLOAD|DATABASE|STRIPE)"

# Check for missing variables
node -e "console.log(process.env)"
```

### Performance Issues
```bash
# Check memory usage
pm2 monit

# Monitor response times
curl -w "@curl-format.txt" -o /dev/null -s "https://yourdomain.com"

# Database query performance
EXPLAIN ANALYZE SELECT * FROM appointments LIMIT 10;
```

## 📈 Scaling Strategies

### Horizontal Scaling
```javascript
// PM2 cluster mode
pm2 start app.js -i max

// Load balancer configuration
upstream modernmen_app {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}
```

### Database Scaling
```sql
-- Read replicas for better performance
CREATE PUBLICATION modernmen_pub FOR ALL TABLES;
CREATE SUBSCRIPTION modernmen_sub
    CONNECTION 'host=primary-host dbname=modernmen'
    PUBLICATION modernmen_pub;
```

### CDN Integration
```javascript
// Image optimization with CDN
import { getImageProps } from 'next/image'

const { props: { src, ...rest } } = getImageProps({
  src: '/image.jpg',
  width: 800,
  height: 600,
  loader: 'custom'
})
```

## 📞 Support & Resources

### Getting Help
- **Deployment Issues**: Check [troubleshooting guide](troubleshooting.md)
- **Platform Support**: Visit Vercel/Railway/AWS documentation
- **Community Help**: Join [Discord Server](https://discord.gg/modernmen)
- **Professional Support**: Contact deployment@modernmen.com

### Useful Links
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **AWS Docs**: https://aws.amazon.com/documentation
- **Next.js Deploy**: https://nextjs.org/docs/deployment

---

## 🎯 Deployment Summary

| Platform | Setup Time | Cost/Month | Best For |
|----------|------------|------------|----------|
| **Vercel** | 5 minutes | $0-20 | Quick deployment, auto-scaling |
| **Railway** | 10 minutes | $5-15 | Full-stack apps, PostgreSQL included |
| **AWS** | 2-4 hours | $20-200+ | Enterprise, custom infrastructure |
| **DigitalOcean** | 30 minutes | $12-50 | Cost-effective, easy scaling |
| **Docker** | 1-2 hours | Variable | Containerized, portable |

**🎉 Ready to deploy?** Choose your platform and follow the corresponding section above!

*Need help choosing a deployment option? Check our [comparison guide](deployment-comparison.md).*
