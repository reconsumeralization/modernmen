# Vercel Deployment Checklist

## 🚀 **Pre-Deployment Steps**

### 1. **Database Setup** (Required)
- [ ] Set up PostgreSQL database (recommended: Railway, Supabase, or PlanetScale)
- [ ] Get DATABASE_URL connection string
- [ ] Test database connection locally

### 2. **Environment Variables** (Required)
Add these to Vercel Dashboard → Project → Settings → Environment Variables:

**Required:**
- [ ] `DATABASE_URL` - Your PostgreSQL connection string
- [ ] `ADMIN_API_KEY` - Secure random string for admin access
- [ ] `NEXT_PUBLIC_API_URL` - Your Vercel app URL

**Optional:**
- [ ] `SENDGRID_API_KEY` - For email confirmations
- [ ] `TWILIO_ACCOUNT_SID` & `TWILIO_AUTH_TOKEN` - For SMS

### 3. **Build Configuration**
- [ ] Ensure `postinstall` script generates Prisma client
- [ ] Verify `vercel.json` is configured
- [ ] Check `next.config.js` Prisma settings

## 🌐 **Deployment Steps**

### Option 1: Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 2: GitHub Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

## ✅ **Post-Deployment**

### 1. **Database Migration**
After first deployment, run database setup:
- Visit: `https://your-app.vercel.app/api/init`
- This will initialize your database with sample data

### 2. **Test Core Functions**
- [ ] Website loads: `https://your-app.vercel.app`
- [ ] API works: `https://your-app.vercel.app/api/docs`
- [ ] Admin panel: `https://your-app.vercel.app/admin`
- [ ] Booking form: Submit test booking
- [ ] Database: Check `/api/init` for status

### 3. **Admin Access**
- Use the `ADMIN_API_KEY` you set for admin authentication
- Or access admin panel directly (dev mode allows this)

## 🔧 **Common Issues**

**Build Fails:**
- Check all imports use correct paths
- Ensure Prisma client is generated in postinstall

**Database Connection:**
- Verify DATABASE_URL format
- Check database is accessible from Vercel
- Ensure database allows external connections

**API Routes 500 Error:**
- Check environment variables are set
- Verify Prisma client is working
- Check Vercel function logs

## 📊 **Database Providers**

**Railway (Recommended):**
- Easy PostgreSQL setup
- Free tier available
- Built for Vercel deployments

**Supabase:**
- PostgreSQL with admin interface
- Free tier with good limits
- Real-time features

**PlanetScale:**
- MySQL-based (adjust Prisma schema)
- Excellent scaling
- Free tier available

## 🎯 **Success Indicators**

After deployment, you should have:
- ✅ Live website at your Vercel URL
- ✅ Working API endpoints
- ✅ Functional admin dashboard
- ✅ Database with sample data
- ✅ Booking system operational

Your Modern Men Hair Salon is now live and ready for business! 🎉
