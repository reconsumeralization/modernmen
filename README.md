# Modern Men Hair Salon - Complete Management System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/modernmen-salon)

## 🏆 **Enterprise-Grade Salon Management System**

A complete, modern salon management platform built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Features a full admin CMS, client management, booking system, analytics dashboard, and more.

## ✨ **Features**

### 🎯 **Core Business Features**
- **Client Management** - Complete customer database with loyalty points
- **Online Booking System** - Automated scheduling with conflict detection
- **Staff Performance Tracking** - Individual metrics and analytics
- **Service Catalog Management** - Dynamic pricing and categories
- **Real-time Analytics Dashboard** - Revenue trends and business insights
- **Inventory Management** - Product tracking with low stock alerts

### 🔧 **Technical Features**
- **15+ RESTful API Endpoints** - Complete CRUD operations
- **Admin CMS Dashboard** - Responsive, mobile-friendly interface
- **Database Integration** - PostgreSQL with Prisma ORM
- **Authentication System** - Secure admin access
- **Type Safety** - Full TypeScript coverage
- **Mobile Responsive** - Perfect on all devices

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/modernmen-salon.git
cd modernmen-salon
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Add your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/modernmen"
ADMIN_API_KEY="your-secure-admin-key"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Development
```bash
npm run dev
```

Visit:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Docs**: http://localhost:3000/api/docs

## 📦 **Deployment**

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/modernmen-salon)

1. **One-Click Deploy**: Click the deploy button above
2. **Set Environment Variables**: Add `DATABASE_URL` and `ADMIN_API_KEY`
3. **Initialize Database**: Visit `/api/init` after deployment

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

See [DEPLOYMENT-FINAL.md](./DEPLOYMENT-FINAL.md) for detailed deployment instructions.

## 🗃️ **Database Schema**

### Core Models
- **Client** - Customer management with preferences
- **Staff** - Team management with schedules
- **Service** - Service catalog with pricing
- **Booking** - Appointment system with status tracking
- **Product** - Inventory management
- **LoyaltyPoint** - Customer rewards program

See [prisma/schema.prisma](./prisma/schema.prisma) for complete schema.

## 🔌 **API Reference**

### Public Endpoints
- `POST /api/bookings` - Submit booking request
- `GET /api/services` - Get service catalog
- `GET /api/docs` - API documentation

### Admin Endpoints
- `/api/clients/*` - Client management
- `/api/admin/bookings/*` - Booking management
- `/api/staff/*` - Staff management
- `/api/analytics/*` - Business analytics

Complete API documentation available at `/api/docs`

## 📱 **Screenshots**

### Admin Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

### Client Management
![Clients](./docs/screenshots/clients.png)

### Booking System
![Bookings](./docs/screenshots/bookings.png)

## 🛠️ **Tech Stack**

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Heroicons** - Icon library

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Production database
- **Authentication** - Custom admin system

### Deployment
- **Vercel** - Serverless hosting
- **Railway/Supabase** - Database hosting

## 📊 **Business Value**

This system replaces multiple SaaS subscriptions:

| Feature | Typical SaaS Cost | Status |
|---------|------------------|---------|
| Client Database | $50/month | ✅ Included |
| Online Booking | $100/month | ✅ Included |
| Analytics Dashboard | $200/month | ✅ Included |
| Inventory Management | $75/month | ✅ Included |
| Staff Performance | $150/month | ✅ Included |
| **Total Value** | **$575/month** | **$0/month** |

## 🔐 **Security**

- **API Authentication** - Bearer token system
- **Input Validation** - Comprehensive sanitization
- **SQL Injection Protection** - Prisma ORM safety
- **CORS Configuration** - Cross-origin security
- **Environment Variables** - Secure configuration

## 📖 **Documentation**

- [Complete System Review](./COMPLETE-SYSTEM-REVIEW.md)
- [Deployment Guide](./DEPLOYMENT-FINAL.md)
- [Backend Documentation](./BACKEND-COMPLETE.md)
- [API Reference](./app/api/docs/route.ts)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Modern Men Hair Salon team for requirements and testing
- Next.js team for the amazing framework
- Vercel for seamless deployment
- Prisma for excellent database tooling

## 📞 **Support**

For support and questions:
- Create an [Issue](https://github.com/yourusername/modernmen-salon/issues)
- Email: support@modernmen.ca
- Website: [modernmen.ca](https://modernmen.ca)

---

**Built with ❤️ for Modern Men Hair Salon in Regina, Saskatchewan**

*Professional salon management made simple.*
