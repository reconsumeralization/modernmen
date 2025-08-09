# Modern Men Hair Salon - Management System

![Modern Men Logo](https://modernmen.ca/logo.png)

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 🏆 Enterprise Salon Management System

A comprehensive, full-featured salon management platform built for Modern Men Hair Salon in Regina, Saskatchewan. This system replaces multiple SaaS subscriptions with a single, integrated solution.

### ✨ Live Demo
- **Website**: [modernmen.ca](https://modernmen.ca)
- **Admin Demo**: Contact for access
- **Customer Portal**: Available for registered clients

## 🚀 Features

### Customer Experience
- **Smart Booking System** - Real-time availability with conflict detection
- **Customer Portal** - Personal dashboard for clients
- **Loyalty Program** - Points tracking and rewards
- **Booking History** - Complete service records
- **Mobile Responsive** - Works perfectly on all devices

### Business Management
- **Admin Dashboard** - Comprehensive business overview
- **Client CRM** - Complete customer relationship management
- **Staff Management** - Schedules, performance, commissions
- **Service Catalog** - Dynamic pricing and duration management
- **Inventory Tracking** - Product management with alerts
- **Analytics Suite** - Revenue, trends, and insights
- **Multi-location Ready** - Scalable architecture

### Technical Excellence
- **Type-Safe** - 100% TypeScript
- **Secure** - JWT authentication, bcrypt hashing
- **Fast** - Optimized performance
- **SEO Friendly** - Server-side rendering
- **API First** - RESTful endpoints
- **Real-time** - Live updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Styling**: TailwindCSS, Framer Motion
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/reconsumeralization/modernmen.git
   cd modernmen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Set up database**
   ```bash
   npm run db:push
   npm run db:seed  # Optional: Add sample data
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Customer portal: http://localhost:3000/portal

### Windows Users
Run the complete setup script:
```bash
complete-admin-setup.bat
```

## 🔐 Default Credentials

**Admin Panel**
- Email: `admin@modernmen.ca`
- Password: `admin123`

⚠️ **Change these immediately in production!**

## 📚 Documentation

- [Admin Setup Guide](./ADMIN-SETUP-GUIDE.md) - Complete admin documentation
- [Features Overview](./FEATURE-ENHANCEMENT-SUMMARY.md) - Detailed feature list
- [Testing Guide](./TESTING-GUIDE.md) - Testing procedures
- [API Documentation](./docs/API.md) - API endpoint reference

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/reconsumeralization/modernmen&env=DATABASE_URL,JWT_SECRET,ADMIN_EMAIL,ADMIN_PASSWORD_HASH)

### Manual Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Build the application:
   ```bash
   npm run build
   ```
4. Start production server:
   ```bash
   npm start
   ```

### Environment Variables

Required for production:
```env
DATABASE_URL=          # PostgreSQL connection string
JWT_SECRET=           # Secure random string
ADMIN_EMAIL=          # Admin login email
ADMIN_PASSWORD_HASH=  # Bcrypt hashed password
```

## 🗂️ Project Structure

```
modernmen/
├── app/              # Next.js 14 app directory
│   ├── admin/       # Admin panel
│   ├── api/         # API routes
│   ├── portal/      # Customer portal
│   └── components/  # Shared components
├── lib/             # Utilities
├── prisma/          # Database schema
├── public/          # Static assets
└── docs/            # Documentation
```

## 📊 API Endpoints

### Public Endpoints
- `GET /api/services` - List all services
- `GET /api/availability` - Check booking availability
- `POST /api/bookings` - Create booking
- `POST /api/auth/customer` - Customer authentication

### Protected Admin Endpoints
- `GET/POST /api/clients` - Client management
- `GET/POST /api/staff` - Staff management
- `GET/POST /api/analytics` - Business analytics
- All require Bearer token authentication

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📈 Roadmap

- [ ] Email/SMS notifications
- [ ] Online payments
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Automated marketing
- [ ] Video consultations

## 💰 Business Value

This system replaces:
- Booking software ($100/month)
- CRM system ($50/month)
- Analytics tools ($200/month)
- Inventory management ($75/month)
- **Total savings: $425/month**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Modern Men Hair Salon team
- Next.js team for the amazing framework
- Vercel for hosting
- All our contributors

## 📞 Support

- **Email**: support@modernmen.ca
- **Phone**: (306) 522-4111
- **Issues**: [GitHub Issues](https://github.com/reconsumeralization/modernmen/issues)

---

Built with ❤️ by [Your Name] for Modern Men Hair Salon

⭐ If you find this project useful, please consider giving it a star!