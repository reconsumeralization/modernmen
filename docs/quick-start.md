# ⚡ Quick Start Guide - Modern Men Hair Salon

Get your Modern Men Hair Salon system up and running in **5 minutes** with this streamlined guide.

## 🚀 One-Command Setup

### For Experienced Developers
```bash
# Clone, install, and start everything
git clone <repository-url> && cd modernmen-hair-BarberShop && pnpm install && cp .env.example .env.local && pnpm run dev:all
```

That's it! Your system will be running at:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Page Builder**: http://localhost:3000/builder

## 📋 Step-by-Step Setup (5 Minutes)

### 1. Get the Code
```bash
git clone <repository-url>
cd modernmen-hair-BarberShop
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment
```bash
cp .env.example .env.local
```

**Edit `.env.local`** with your values:
```env
# Required for basic functionality
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
PAYLOAD_SECRET="your-payload-secret-here"
DATABASE_URL="postgresql://user:pass@localhost:5432/modernmen"

# Optional (can use defaults for testing)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-key"
```

### 4. Start the System
```bash
# Start everything at once
pnpm run dev:all

# Or start services individually
pnpm run cms:dev      # Payload CMS Admin
pnpm run dev          # Next.js Frontend
pnpm run sync:full    # Database sync
```

### 5. Access Your Application
Open these URLs in your browser:
- **🏠 Frontend**: http://localhost:3000
- **⚙️ Admin Panel**: http://localhost:3000/admin
- **🎨 Page Builder**: http://localhost:3000/builder
- **📊 Payload CMS**: http://localhost:3000/admin/payload

## 🎯 What You Get

### Immediately Available Features
- ✅ **Modern Homepage** - Professional salon website
- ✅ **Admin Dashboard** - Manage customers, services, appointments
- ✅ **Page Builder** - Drag-and-drop website customization
- ✅ **User Authentication** - Login/signup system
- ✅ **Responsive Design** - Works on all devices

### Ready-to-Use Components
- 🎨 **Hero Section** - Eye-catching landing area
- 💇 **Services Grid** - Display salon services
- ⭐ **Testimonials** - Customer reviews carousel
- 📞 **Contact Form** - Lead generation
- 💰 **Pricing Cards** - Service packages

## 🧪 Test the System

### 1. Create Your First Admin User
1. Visit http://localhost:3000/admin
2. Click "Create Account" or "Sign Up"
3. Fill in your details
4. You'll be logged in as an admin

### 2. Explore the Page Builder
1. Go to http://localhost:3000/builder
2. Drag components onto the canvas
3. Customize styles and content
4. See changes instantly

### 3. Add Your First Service
1. In the admin panel, go to "Services"
2. Click "Create New"
3. Add service details (name, price, duration)
4. Save and publish

### 4. Customize the Homepage
1. Visit the page builder
2. Update the hero section with your salon info
3. Add your services to the services grid
4. Customize colors and branding

## 🚀 Advanced Quick Setup

### With Supabase (Recommended)
```bash
# 1. Create Supabase project at supabase.com
# 2. Get your project URL and anon key
# 3. Update .env.local:
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# 4. Run migrations
pnpm run supabase:migrate

# 5. Start with real-time features
pnpm run dev:all
```

### With Local PostgreSQL
```bash
# 1. Install PostgreSQL locally
# 2. Create database: createdb modernmen_db
# 3. Update .env.local:
DATABASE_URL="postgresql://username:password@localhost:5432/modernmen_db"

# 4. Run migrations
pnpm run db:migrate

# 5. Start the system
pnpm run dev:all
```

## 📊 System Health Check

Run this to verify everything is working:

```bash
# Check system health
pnpm run system:health

# Expected output:
✅ Database connection: OK
✅ Authentication: OK
✅ Payload CMS: OK
✅ File uploads: OK
✅ Email system: OK (if configured)
```

## 🎨 Customization Quick Start

### Change Branding
1. **Colors**: Edit `tailwind.config.js`
2. **Logo**: Replace files in `public/` directory
3. **Fonts**: Update `src/app/layout.tsx`
4. **Content**: Use page builder or edit components

### Add New Pages
1. Create file in `src/app/your-page/page.tsx`
2. Add navigation in header component
3. Style with Tailwind CSS

### Customize Components
1. Find component in `src/components/`
2. Edit the JSX/TSX file
3. See changes hot-reload instantly

## 🆘 Quick Troubleshooting

### System Won't Start
```bash
# Clear cache and try again
pnpm run clean
pnpm run dev:all
```

### Database Issues
```bash
# Reset and migrate database
pnpm run db:reset
pnpm run db:migrate
```

### Authentication Problems
```bash
# Check NextAuth configuration
cat .env.local | grep NEXTAUTH
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
pnpm run build
```

## 🎯 Next Steps

### For Salon Owners
1. **Customize Branding** - Add your logo and colors
2. **Add Services** - Input your service menu and pricing
3. **Set Business Hours** - Configure availability
4. **Import Customer Data** - Migrate existing customers
5. **Test Booking Flow** - Ensure everything works end-to-end

### For Developers
1. **Review Architecture** - See [architecture.md](architecture.md)
2. **Explore APIs** - Check [api.md](api.md)
3. **Run Tests** - Execute `pnpm run test`
4. **Contribute** - Follow [contributing.md](contributing.md)

### For Business Growth
1. **Enable Payments** - Set up Stripe integration
2. **Configure Email** - Set up SMTP for notifications
3. **Add Analytics** - Enable Google Analytics
4. **Deploy to Production** - Follow [deployment.md](deployment.md)

## 📞 Need Help?

- **📖 Full Setup Guide**: [setup.md](setup.md)
- **🐛 Report Issues**: [GitHub Issues](https://github.com/modernmen/issues)
- **💬 Community Chat**: [Discord Server](https://discord.gg/modernmen)
- **📧 Professional Support**: [Email Support](mailto:support@modernmen.com)

## 🎉 You're All Set!

Your Modern Men Hair Salon system is now running with:
- ✅ Professional website ready for customers
- ✅ Powerful admin panel for management
- ✅ Visual page builder for customization
- ✅ Scalable architecture for growth
- ✅ Modern tech stack for reliability

**Welcome to the future of salon management! 🚀**
