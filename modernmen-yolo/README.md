# Modern Men Hair Salon

A comprehensive hair salon management system built with Next.js 15, ModernMen CMS, Supabase, and modern web technologies.

## 🚀 Features

### Core Functionality
- **Online Booking System**: Complete appointment scheduling with real-time availability
- **Customer Portal**: Self-service booking, appointment management, and loyalty program
- **Staff Dashboard**: Employee scheduling, appointment management, and performance tracking
- **Admin Panel**: Full CMS for content management and business analytics
- **Payment Processing**: Stripe integration for secure payments
- **Communication**: Email and SMS notifications for appointments and marketing

### Technical Features
- **Modern Stack**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Supabase for real-time features
- **CMS**: ModernMen CMS for content management
- **Authentication**: Secure user authentication and role-based access
- **API**: RESTful APIs with GraphQL support
- **Responsive**: Mobile-first design with PWA capabilities
- **SEO**: Optimized for search engines and social sharing

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                NEXT.JS FRONTEND                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │  Customer   │ │   Staff     │ │   Admin     │ │
│  │   Portal    │ │ Dashboard   │ │   Panel     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────┘
                      │
           ┌──────────┴──────────┐
           │                     │
┌──────────▼─────────┐ ┌──────────▼─────────┐
│   ModernMen CMS      │ │   SUPABASE DB      │
│  Content & API     │ │ Real-time & Auth   │
└────────────────────┘ └────────────────────┘
           │
           └──────────┐
                      │
           ┌──────────▼──────────┐
           │                     │
┌──────────▼─────────┐ ┌──────────▼─────────┐
│     STRIPE         │ │   SENDGRID &       │
│   Payments         │ │    TWILIO          │
└────────────────────┘ └────────────────────┘
```

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase)
- Stripe account for payments
- SendGrid account for emails
- Twilio account for SMS

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/modernmen-yolo.git
   cd modernmen-yolo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```

   Configure your environment variables:
   ```env
   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe
   STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # SendGrid
   SENDGRID_API_KEY=SG.your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@modernmen.com

   # Twilio
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890

   # ModernMen CMS
   ModernMen_SECRET=your_ModernMen_secret_key
   DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
   ```

4. **Database Setup**
   ```bash
   # Push database schema to Supabase
   npm run db:push

   # Generate TypeScript types
   npm run db:generate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Start ModernMen CMS**
   ```bash
   npm run cms:dev
   ```

## 📁 Project Structure

```
modernmen-yolo/
├── 📁 src/
│   ├── 📁 app/                    # Next.js app router
│   │   ├── 📁 admin/             # Admin dashboard pages
│   │   ├── 📁 customer/          # Customer portal pages
│   │   ├── 📁 api/               # API routes
│   │   └── 📄 layout.tsx         # Root layout
│   ├── 📁 components/            # React components
│   │   ├── 📁 ui/               # Reusable UI components
│   │   └── 📁 layout/           # Layout components
│   ├── 📁 collections/           # ModernMen CMS collections
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 lib/                  # Utility functions
│   ├── 📁 services/             # API service functions
│   └── 📁 types/                # TypeScript definitions
├── 📁 docs/                     # Documentation
│   └── 📁 diagrams/             # Architecture diagrams
├── 📄 ModernMen.config.ts         # ModernMen CMS configuration
├── 📄 next.config.js           # Next.js configuration
└── 📄 tailwind.config.js       # Tailwind CSS configuration
```

## 🎯 Key Features

### Customer Experience
- **Online Booking**: Intuitive booking flow with real-time availability
- **Appointment Management**: View, modify, and cancel appointments
- **Loyalty Program**: Earn points for discounts and rewards
- **Service Reviews**: Rate and review completed services
- **Profile Management**: Update personal information and preferences

### Business Management
- **Staff Scheduling**: Automated scheduling with conflict resolution
- **Appointment Tracking**: Real-time appointment status and history
- **Revenue Analytics**: Comprehensive business metrics and reporting
- **Customer Insights**: Customer behavior and preference analysis
- **Inventory Management**: Track products and supplies

### Communication
- **Email Notifications**: Automated booking confirmations and reminders
- **SMS Alerts**: Text message reminders and updates
- **Marketing Campaigns**: Targeted email and SMS campaigns
- **Customer Support**: Integrated support ticketing system

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   - Set production values for all environment variables
   - Configure production database URL
   - Set up production Stripe webhooks

2. **Build Application**
   ```bash
   npm run build
   npm run cms:build
   ```

3. **Database Migration**
   ```bash
   npm run db:push
   ```

4. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npx playwright test

# Generate test coverage
npm run test:coverage
```

## 📊 Monitoring & Analytics

- **Performance Monitoring**: Real-time performance metrics
- **Error Tracking**: Automatic error reporting and alerting
- **User Analytics**: Customer behavior and conversion tracking
- **Business Metrics**: Revenue, appointment, and customer KPIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

For support, email support@modernmen.com or join our Slack community.

## 🎯 Roadmap

- [x] Core booking system
- [x] Customer portal
- [x] Staff dashboard
- [x] Admin CMS
- [ ] Mobile PWA
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Multi-location support

---

Built with ❤️ for the modern gentleman
