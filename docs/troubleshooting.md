# 🆘 Troubleshooting Guide - Modern Men Hair Salon

Comprehensive troubleshooting guide for the Modern Men Hair Salon management system. This guide covers common issues, debugging techniques, and step-by-step solutions.

## 🚀 Quick Diagnosis

### System Health Check
Run this command to check overall system health:
```bash
pnpm run system:health
```

Expected output:
```
✅ Database connection: OK
✅ Authentication: OK
✅ Payload CMS: OK
✅ File uploads: OK
✅ Email system: OK
✅ Payment processing: OK
```

### Quick Fix Commands
```bash
# Clear all caches and restart
pnpm run clean && pnpm run dev:all

# Reset database and restart
pnpm run db:reset && pnpm run db:migrate && pnpm run dev

# Check all services
pnpm run system:check
```

## 🔧 Development Issues

### Application Won't Start

#### Issue: Port 3000 Already in Use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm run dev
```

#### Issue: Node.js Version Issues
```bash
# Check Node.js version
node --version  # Should be 18+

# Update Node.js (using nvm)
nvm install 18
nvm use 18
nvm alias default 18
```

#### Issue: Dependencies Not Installing
```bash
# Clear npm/pnpm cache
pnpm store prune
rm -rf node_modules pnpm-lock.yaml

# Reinstall dependencies
pnpm install

# Check for conflicting versions
pnpm why <package-name>
```

### Build Errors

#### Issue: TypeScript Errors
```bash
# Check TypeScript configuration
pnpm run type-check

# Generate missing types
pnpm run types:generate

# Clear TypeScript cache
rm -rf .next/cache
```

#### Issue: Build Fails with Module Not Found
```bash
# Check import paths
find src -name "*.ts" -o -name "*.tsx" | xargs grep "import.*from.*@/"

# Verify path aliases in tsconfig.json
cat tsconfig.json | grep -A 10 "paths"
```

#### Issue: Payload CMS Build Errors
```bash
# Clear Payload cache
rm -rf .next/cache
rm -rf payload-build

# Rebuild Payload types
pnpm run payload:generate-types

# Check Payload configuration
cat payload.config.ts | grep -v "^//"
```

## 🗄️ Database Issues

### Connection Problems

#### Issue: Database Connection Failed
```bash
# Test database connection
psql "$DATABASE_URL" -c "SELECT version();"

# Check environment variables
echo $DATABASE_URL

# Verify database is running
pg_isready -h localhost -p 5432
```

#### Issue: Supabase Connection Issues
```bash
# Test Supabase connection
curl -H "apikey: $SUPABASE_ANON_KEY" \
     "$SUPABASE_URL/rest/v1/"

# Check Supabase project status
# Visit: https://supabase.com/dashboard/project/YOUR_PROJECT
```

#### Issue: Migration Errors
```bash
# Check migration status
pnpm run db:migrate:status

# Reset and migrate
pnpm run db:reset
pnpm run db:migrate

# Manual migration
npx payload migrate
```

### Data Issues

#### Issue: Missing Seed Data
```bash
# Seed the database
pnpm run db:seed

# Check seeded data
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;"
```

#### Issue: Data Corruption
```bash
# Create backup
pg_dump "$DATABASE_URL" > backup.sql

# Reset database
pnpm run db:reset
pnpm run db:migrate
pnpm run db:seed
```

## 🔐 Authentication Issues

### Login Problems

#### Issue: Cannot Sign In
```bash
# Check NextAuth configuration
cat .env.local | grep NEXTAUTH

# Test authentication endpoint
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

#### Issue: Invalid NEXTAUTH_SECRET
```bash
# Generate new secret
openssl rand -base64 32

# Update environment
echo "NEXTAUTH_SECRET=your-new-secret" >> .env.local
```

#### Issue: Redirect URI Mismatch
```bash
# Check configured URLs
echo $NEXTAUTH_URL

# Update for your environment
# Development: http://localhost:3000
# Production: https://yourdomain.com
```

### Session Issues

#### Issue: Sessions Not Persisting
```bash
# Check session configuration
cat src/lib/auth.ts | grep -A 10 "session"

# Clear browser cookies
# Browser DevTools → Application → Cookies → Clear all
```

#### Issue: JWT Token Errors
```bash
# Check JWT configuration
cat .env.local | grep JWT

# Generate new JWT secret
openssl rand -base64 32
```

## 💳 Payment Issues

### Stripe Configuration

#### Issue: Payment Processing Failed
```bash
# Check Stripe keys
echo $STRIPE_SECRET_KEY | cut -c 1-10  # Should start with sk_

# Test Stripe connection
curl -u $STRIPE_SECRET_KEY: https://api.stripe.com/v1/charges \
  -d amount=100 \
  -d currency=usd \
  -d source=tok_visa
```

#### Issue: Webhook Not Working
```bash
# Check webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded"}'

# Verify webhook secret
echo $STRIPE_WEBHOOK_SECRET
```

#### Issue: Test Payments Not Working
```bash
# Use Stripe test card numbers
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002

# Check Stripe dashboard
# https://dashboard.stripe.com/test/payments
```

## 📧 Email Issues

### SMTP Configuration

#### Issue: Emails Not Sending
```bash
# Test SMTP connection
telnet smtp.gmail.com 587

# Check email configuration
cat .env.local | grep SMTP

# Test email sending
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'
```

#### Issue: Gmail Authentication Failed
```bash
# Generate App Password (not regular password)
# Gmail → Settings → Security → App passwords

# Update SMTP_PASS with app password
echo "SMTP_PASS=your-app-password" >> .env.local
```

#### Issue: Emails Going to Spam
```bash
# Configure SPF/DKIM records
# Add to DNS: v=spf1 include:_spf.google.com ~all

# Use verified sender email
echo "FROM_EMAIL=noreply@yourdomain.com" >> .env.local
```

## 🔄 Synchronization Issues

### Payload ↔ Supabase Sync

#### Issue: Data Not Syncing
```bash
# Check sync status
pnpm run sync:health

# Manual sync
pnpm run sync:all

# Check sync logs
tail -f logs/sync.log
```

#### Issue: Sync Conflicts
```bash
# Resolve conflicts manually
pnpm run sync:resolve-conflicts

# Reset sync state
pnpm run sync:reset
```

#### Issue: Real-time Updates Not Working
```bash
# Check Supabase real-time
curl "$SUPABASE_URL/rest/v1/" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Prefer: listen=*" \
  -d '{"event":"*","schema":"public","table":"users"}'
```

## 🚀 Performance Issues

### Slow Loading

#### Issue: Slow Page Loads
```bash
# Check bundle size
pnpm run build:analyze

# Optimize images
# Use next/image component
# Enable image optimization in next.config.js
```

#### Issue: Database Queries Slow
```bash
# Enable query logging
echo "DEBUG=prisma:*" >> .env.local

# Check slow queries
EXPLAIN ANALYZE SELECT * FROM appointments WHERE date > NOW();
```

#### Issue: Memory Usage High
```bash
# Check memory usage
pm2 monit

# Optimize bundle
# Enable code splitting
# Use dynamic imports
```

### Caching Issues

#### Issue: Cache Not Working
```bash
# Check Redis connection
redis-cli ping

# Clear cache
redis-cli FLUSHALL

# Check cache configuration
cat .env.local | grep REDIS
```

## 🌐 Network Issues

### CORS Problems

#### Issue: CORS Errors in Browser
```bash
# Check CORS configuration
cat next.config.js | grep -A 10 "cors"

# Add allowed origins
# next.config.js
headers: [
  {
    key: 'Access-Control-Allow-Origin',
    value: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://yourdomain.com'
  }
]
```

### API Connection Issues

#### Issue: API Calls Failing
```bash
# Test API endpoint
curl http://localhost:3000/api/health

# Check API logs
tail -f logs/api.log

# Verify API routes
find src/app/api -name "route.ts"
```

## 📱 Mobile Issues

### PWA Problems

#### Issue: PWA Not Installing
```bash
# Check manifest.json
cat public/manifest.json

# Verify service worker
cat public/sw.js

# Check HTTPS (required for PWA)
curl -I https://yourdomain.com
```

### Responsive Design Issues

#### Issue: Mobile Layout Broken
```bash
# Check responsive breakpoints
cat tailwind.config.js | grep -A 10 "screens"

# Test with browser dev tools
# Chrome DevTools → Device toolbar
```

## 🔧 File Upload Issues

### Upload Configuration

#### Issue: File Uploads Failing
```bash
# Check upload configuration
cat payload.config.ts | grep -A 10 "upload"

# Verify file permissions
ls -la uploads/

# Check file size limits
cat .env.local | grep UPLOAD
```

#### Issue: Image Optimization Not Working
```bash
# Check Sharp installation
pnpm list sharp

# Reinstall Sharp
pnpm add sharp

# Check image optimization config
cat next.config.js | grep -A 10 "images"
```

## 🔒 Security Issues

### SSL/HTTPS Problems

#### Issue: SSL Certificate Issues
```bash
# Check SSL certificate
openssl s_client -connect yourdomain.com:443

# Renew certificate (Let's Encrypt)
certbot renew

# Force HTTPS redirect
cat next.config.js | grep -A 10 "redirects"
```

### Authentication Security

#### Issue: Security Headers Missing
```bash
# Check security headers
curl -I https://yourdomain.com

# Add security headers in next.config.js
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]
```

## 📊 Monitoring Issues

### Error Tracking

#### Issue: Errors Not Being Tracked
```bash
# Check Sentry configuration
cat .env.local | grep SENTRY

# Test Sentry integration
curl -X POST http://localhost:3000/api/test-sentry \
  -H "Content-Type: application/json" \
  -d '{"message":"Test error"}'
```

### Performance Monitoring

#### Issue: Performance Data Not Collecting
```bash
# Check Vercel Analytics
cat .env.local | grep VERCEL

# Verify Speed Insights
cat src/app/layout.tsx | grep SpeedInsights
```

## 🐛 Debugging Techniques

### Development Debugging

#### Enable Debug Mode
```bash
# Enable debug logging
echo "DEBUG=*" >> .env.local
echo "NEXT_PUBLIC_DEBUG=true" >> .env.local

# Restart application
pnpm run dev
```

#### Browser Developer Tools
```javascript
// Console debugging
console.log('Debug info:', data)
console.error('Error:', error)
console.table(data) // For arrays/objects

// Network debugging
// Check Network tab for failed requests
// Look at Response/Request headers

// React DevTools
// Inspect component state and props
// Check component hierarchy
```

#### Database Debugging
```sql
-- Enable query logging
SET log_statement = 'all';

-- Check slow queries
SELECT * FROM pg_stat_activity;

-- Analyze table performance
EXPLAIN ANALYZE SELECT * FROM appointments;
```

### Production Debugging

#### Log Analysis
```bash
# Check application logs
pm2 logs modernmen-app

# Check system logs
tail -f /var/log/nginx/error.log

# Check database logs
tail -f /var/log/postgresql/postgresql.log
```

#### Performance Profiling
```bash
# Use Chrome DevTools Profiler
# 1. Open DevTools → Performance
# 2. Start recording
# 3. Perform actions
# 4. Stop recording and analyze

# Memory leak detection
# Chrome DevTools → Memory → Take heap snapshot
```

## 🆘 Getting Help

### Community Support
- **GitHub Issues**: [Report bugs](https://github.com/modernmen/issues)
- **Discord Community**: [Join chat](https://discord.gg/modernmen)
- **Stack Overflow**: Tag with `modernmen-hair-salon`

### Professional Support
- **Email Support**: support@modernmen.com
- **Phone Support**: 1-800-MODERN-MEN
- **Priority Support**: Available for enterprise customers

### Diagnostic Information
When reporting issues, please include:
```bash
# System information
uname -a
node --version
pnpm --version

# Environment check
cat .env.local | grep -v "SECRET\|KEY\|PASS" | head -20

# Recent logs
tail -n 50 logs/app.log

# Database status
psql "$DATABASE_URL" -c "SELECT version();"
```

---

## 🎯 Prevention Best Practices

### Development
- ✅ Run tests before committing
- ✅ Use TypeScript for type safety
- ✅ Follow ESLint rules
- ✅ Keep dependencies updated

### Deployment
- ✅ Test in staging environment first
- ✅ Use environment-specific configurations
- ✅ Monitor error rates and performance
- ✅ Keep backup of production data

### Monitoring
- ✅ Set up error tracking (Sentry)
- ✅ Monitor performance metrics
- ✅ Configure alerts for critical issues
- ✅ Regular security audits

**🚀 Still having issues?** Don't worry! Our support team is here to help. Check the [FAQ](faq.md) or contact us directly.

---

*This troubleshooting guide is continuously updated. Last updated: January 2025*
