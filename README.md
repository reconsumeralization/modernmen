# Modern Men Hair Salon - Enterprise Management System

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

## 🚀 Overview

A complete, enterprise-grade salon management system for Modern Men Hair Salon in Regina, Saskatchewan. Features include real-time booking, customer portal, admin dashboard, inventory management, and comprehensive business analytics.

## ✨ Key Features

### Customer Features
- **Enhanced Online Booking** - Real-time availability with calendar view
- **Customer Portal** - Personal dashboard with booking history
- **Loyalty Program** - Points tracking and rewards
- **Service History** - Complete appointment records
- **Secure Authentication** - JWT-based login system

### Admin Features
- **Comprehensive Dashboard** - Real-time metrics and analytics
- **Client Management** - Complete CRM functionality
- **Booking Management** - Approve, reschedule, cancel appointments
- **Staff Management** - Schedules, performance, commissions
- **Inventory Tracking** - Products with low-stock alerts
- **Revenue Analytics** - Detailed business insights
- **Multi-location Ready** - Scalable architecture

### Technical Features
- **Type-Safe** - Full TypeScript implementation
- **Secure API** - JWT authentication & middleware protection
- **Real-time Updates** - Live availability checking
- **Mobile Responsive** - Works on all devices
- **Performance Optimized** - Fast loading times
- **SEO Friendly** - Optimized for search engines

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT, bcrypt
- **Styling:** TailwindCSS, Framer Motion
- **Deployment:** Vercel-ready

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/modernmen.git
   cd modernmen
   ```

2. **Run complete setup (Windows)**
   ```bash
   complete-admin-setup.bat
   ```
   
   This will:
   - Install all dependencies
   - Set up authentication
   - Generate secure credentials
   - Update database schema
   - Clean up project files

3. **Configure environment**
   
   Copy the generated configuration to `.env.local`:
   ```env
   DATABASE_URL="your-postgresql-url"
   JWT_SECRET=generated-secret
   ADMIN_EMAIL=admin@modernmen.ca
   ADMIN_PASSWORD_HASH=generated-hash
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Customer portal: http://localhost:3000/portal/login

## 🔐 Default Credentials

**Admin Panel:**
- Email: admin@modernmen.ca
- Password: admin123

**Important:** Change the password after first login!

## 📚 Documentation

- **[Admin Setup Guide](./ADMIN-SETUP-GUIDE.md)** - Complete admin system documentation
- **[Feature Summary](./FEATURE-ENHANCEMENT-SUMMARY.md)** - New features overview
- **[Testing Guide](./TESTING-GUIDE.md)** - Comprehensive testing instructions

## 🗂️ Project Structure

```
modernmen/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── portal/            # Customer portal
│   └── components/        # React components
├── lib/                   # Utilities and helpers
├── prisma/                # Database schema
├── public/                # Static assets
└── scripts/               # Setup and utility scripts
```

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### Environment Variables

Required for production:
```env
DATABASE_URL=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Update database schema
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed sample data
```

## 📊 API Endpoints

### Public Endpoints
- `POST /api/bookings` - Submit booking
- `GET /api/services` - List services
- `GET /api/availability` - Check availability

### Protected Admin Endpoints
- `/api/clients/*` - Client management
- `/api/admin/*` - Admin operations
- `/api/staff/*` - Staff management
- `/api/analytics/*` - Business analytics

### Protected Customer Endpoints
- `/api/customers/bookings` - Customer bookings
- `/api/customers/loyalty` - Loyalty points

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

Built with ❤️ for Modern Men Hair Salon by the development team.

---

**Modern Men Hair Salon**  
📍 #4 - 425 Victoria Ave East, Regina, SK S4N 0N8  
📞 (306) 522-4111  
🌐 [modernmen.ca](https://modernmen.ca) booking/            # Customer booking flow
│   └── (public pages)        # Landing, about, contact
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── lib/
│   ├── auth.ts              # Authentication utilities
│   ├── db.ts                # Database connection
│   └── utils.ts             # Helper functions
├── types/
│   └── index.ts             # TypeScript definitions
└── public/                  # Static assets
```

## 🔧 Development

### Database Commands
```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Create migration
npx prisma migrate dev --name description

# Generate Prisma client
npx prisma generate
```

### Admin Management
```bash
# Change admin password
.\setup-admin-auth.bat

# Clean up project files
.\cleanup-project.bat

# Setup backend services
.\setup-backend.bat
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
.\deploy-vercel.bat

# Or manually
vercel --prod
```

### Docker
```bash
# Build image
docker build -t modernmen-barbershop .

# Run container
docker run -p 3000:3000 modernmen-barbershop
```

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Bcrypt Password Hashing** with salt rounds
- **Route Protection** via middleware
- **API Authorization** with Bearer tokens
- **Input Validation** on all forms
- **SQL Injection Prevention** with Prisma ORM
- **XSS Protection** with proper escaping

## 📊 Admin Dashboard

### Key Features
- **Real-time Statistics**: Revenue, bookings, clients
- **Client Management**: Full CRUD with search/filter
- **Booking Calendar**: Day/week/month views
- **Staff Scheduling**: Availability and assignments
- **Inventory Tracking**: Products and supplies
- **Financial Reports**: Revenue analysis and trends
- **Customer Analytics**: Retention and preferences

### Navigation Sections
- **Dashboard**: Overview and quick stats
- **Clients**: Customer database management
- **Bookings**: Appointment scheduling system
- **Staff**: Employee profiles and schedules
- **Services**: Service catalog and pricing
- **Products**: Retail inventory management
- **Orders**: Product sale tracking
- **Analytics**: Business intelligence reports
- **Settings**: System configuration

## 💰 Business Features

### Revenue Management
- Service pricing and packages
- Product sales tracking
- Commission calculations
- Payment processing integration
- Financial reporting and analytics

### Customer Relationship
- Client profiles with visit history
- Loyalty program integration
- Automated appointment reminders
- Customer feedback collection
- Personalized service recommendations

### Staff Management
- Employee profiles and credentials
- Schedule management and availability
- Performance tracking and analytics
- Commission and tip tracking
- Role-based access control

## 🎨 Design System

### Styling
- **Modern Design**: Clean, professional interface
- **Mobile-First**: Responsive across all devices
- **Accessibility**: WCAG compliant components
- **Brand Consistency**: Cohesive color scheme and typography
- **Loading States**: Smooth transitions and feedback

### Components
- Reusable UI components with TypeScript
- Form validation with error handling
- Modal dialogs and confirmation prompts
- Data tables with sorting and pagination
- Charts and analytics visualizations

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET="your-secure-secret"
ADMIN_PASSWORD_HASH="$2b$10$..."

# External Services (optional)
TWILIO_SID="your-twilio-sid"
TWILIO_TOKEN="your-twilio-token"
SENDGRID_API_KEY="your-sendgrid-key"
```

### Customization
- Modify `tailwind.config.js` for brand colors
- Update `prisma/schema.prisma` for data model changes
- Customize `app/admin/components/AdminLayout.tsx` for navigation
- Configure `middleware.ts` for additional route protection

## 📱 Mobile Experience

### Responsive Design
- Touch-friendly interface elements
- Optimized table layouts for small screens
- Swipe gestures for navigation
- Offline capability for critical features

### Progressive Web App
- Service worker for offline functionality
- App-like experience on mobile devices
- Push notifications for appointments
- Background sync for data updates

## 🧪 Testing

### Test Commands
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test ClientManager
```

### Test Coverage
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for UI interactions
- E2E tests for critical user flows

## 📞 Support & Documentation

### Getting Help
- **Setup Issues**: See `ADMIN-SETUP-GUIDE.md`
- **API Reference**: Check `/api` route files
- **Component Docs**: See component JSDoc comments
- **Database Schema**: View `prisma/schema.prisma`

### Common Issues
- **Login Problems**: Verify JWT_SECRET and password hash
- **Database Errors**: Check DATABASE_URL and run migrations
- **Build Failures**: Clear `.next` cache and reinstall dependencies
- **Permission Issues**: Ensure middleware is properly configured

## 🚀 Future Enhancements

### Planned Features
- Multi-location support
- Advanced scheduling algorithms
- Inventory management system
- Customer mobile app
- Point-of-sale integration
- Marketing automation tools

### Technical Improvements
- Real-time updates with WebSockets
- Advanced caching strategies
- Microservices architecture
- AI-powered scheduling optimization
- Enhanced analytics and reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Modern Men Barbershop** - Bringing traditional barbering into the digital age with style and efficiency.
