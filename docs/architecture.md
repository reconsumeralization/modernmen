# 🏗️ System Architecture - Modern Men Hair Salon

This document provides a comprehensive overview of the Modern Men Hair Salon management system's architecture, design patterns, and technical implementation.

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    🎯 MODERN MEN SYSTEM                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Page Builder│ │ CRM System │ │ Booking     │           │
│  │ (Drag&Drop) │ │ (Payload)   │ │ Engine      │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Auth System │ │ Payment     │ │ Analytics   │           │
│  │ (NextAuth)  │ │ (Stripe)    │ │ Dashboard   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐                           │
│  │ Payload CMS │ │ Supabase DB │                           │
│  │ (Admin)     │ │ (Real-time) │                           │
│  └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## 🏛️ Core Architecture Principles

### 1. **Dual Database Strategy**
- **Payload CMS**: Content management, admin interface, structured data
- **Supabase**: Real-time features, user data, high-frequency operations
- **Synchronization**: Automated data sync between systems

### 2. **Micro-Frontend Architecture**
- **Modular Components**: Independent, reusable UI components
- **Feature Isolation**: Each feature in separate modules
- **Lazy Loading**: Components loaded on-demand

### 3. **API-First Design**
- **RESTful APIs**: Consistent API design patterns
- **GraphQL Support**: Flexible data fetching
- **Type Safety**: Full TypeScript integration

### 4. **Real-Time Capabilities**
- **Live Updates**: Real-time data synchronization
- **WebSocket Support**: Bidirectional communication
- **Event-Driven**: Reactive UI updates

## 📁 Project Structure

```
modernmen-hair-BarberShop/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Admin interface routes
│   │   ├── api/               # API endpoints
│   │   ├── builder/           # Page builder interface
│   │   └── dashboard/         # Customer dashboard
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components (shadcn)
│   │   ├── features/          # Feature-specific components
│   │   ├── layout/            # Layout components
│   │   └── builder/           # Page builder components
│   ├── lib/                   # Utilities and configurations
│   │   ├── auth/              # Authentication utilities
│   │   ├── supabase/          # Supabase client
│   │   ├── stripe/            # Payment processing
│   │   └── builder-engine.ts  # Page builder core
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Helper functions
│   └── payload/               # Payload CMS configuration
├── supabase/
│   ├── migrations/           # Database migrations
│   ├── seed/                # Seed data
│   └── config.toml          # Supabase configuration
├── docs/                    # Documentation
├── scripts/                 # Build and utility scripts
└── public/                  # Static assets
```

## 🔧 Technology Stack

### Frontend Layer
```typescript
// Core Framework
Next.js 15.5.2          // React framework with App Router
React 18.2.0           // UI library
TypeScript 5.2.0       // Type safety

// UI & Styling
Tailwind CSS 4.1.12    // Utility-first CSS
shadcn/ui              // Component library
Framer Motion 12.23.12 // Animations
Radix UI               // Accessible components

// State Management
Zustand 5.0.8         // Lightweight state management
TanStack Query 5.85.6 // Server state management
```

### Backend Layer
```typescript
// CMS & Database
Payload CMS 3.54.0    // Headless CMS
Supabase 2.56.0       // PostgreSQL with real-time
PostgreSQL 15+        // Primary database

// Authentication
NextAuth.js 4.24.0    // Authentication framework
bcryptjs 3.0.2       // Password hashing

// API & Communication
tRPC (optional)       // Type-safe APIs
WebSocket             // Real-time communication
```

### DevOps & Tools
```typescript
// Development
ESLint 9.34.0         // Code linting
Prettier              // Code formatting
Husky                 // Git hooks
Jest 30.1.1          // Testing framework
Playwright 1.40.0    // E2E testing

// Build & Deployment
Vercel                // Hosting platform
Docker                // Containerization
GitHub Actions        // CI/CD
```

## 🎨 Component Architecture

### Atomic Design Pattern

```
┌─────────────────────────────────────┐
│           🧩 COMPONENTS             │
├─────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │  Atoms  │ │Molecules│ │Organisms│ │
│  │         │ │         │ │         │ │
│  │ Buttons │ │  Forms  │ │  Cards  │ │
│  │  Icons  │ │  Lists  │ │ Headers │ │
│  │  Inputs │ │         │ │         │ │
│  └─────────┘ └─────────┘ └─────────┘ │
├─────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐             │
│  │ Templates│ │  Pages  │            │
│  │          │ │          │            │
│  │  Layouts │ │Dashboard │            │
│  │  Grids   │ │  Auth    │            │
│  └─────────┘ └─────────┘             │
└─────────────────────────────────────┘
```

### Component Organization

```typescript
// src/components/
├── ui/                    // Base UI components (shadcn)
│   ├── button.tsx        // Reusable button component
│   ├── input.tsx         // Form input component
│   ├── card.tsx          // Card container
│   └── dialog.tsx        // Modal dialog
├── features/             // Feature-specific components
│   ├── auth/            // Authentication components
│   ├── booking/         // Booking-related components
│   ├── dashboard/       // Dashboard widgets
│   └── admin/           // Admin interface components
├── layout/              // Layout components
│   ├── header.tsx       // Site header
│   ├── sidebar.tsx      // Navigation sidebar
│   └── footer.tsx       // Site footer
└── shared/              // Shared/reusable components
    ├── loading.tsx      // Loading indicators
    ├── error-boundary.tsx // Error handling
    └── empty-state.tsx  // Empty state displays
```

## 🔄 Data Flow Architecture

### Unidirectional Data Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Actions   │───▶│  Reducers   │───▶│    Store    │
│             │    │             │    │             │
│ User Events │    │ State Logic │    │ App State   │
│ API Calls   │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                                        │
                                        ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Components  │◀───│ Selectors  │◀───│    UI       │
│             │    │             │    │             │
│ React       │    │ Computed    │    │ Updates     │
│ Components  │    │ Values      │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

### State Management Strategy

```typescript
// Global State (Zustand)
interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  notifications: Notification[]
}

interface AppActions {
  setUser: (user: User) => void
  toggleTheme: () => void
  addNotification: (notification: Notification) => void
}

// Server State (TanStack Query)
const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/api/users'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Local State (React Hooks)
const useBookingForm = () => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  // ... form logic
}
```

## 🗄️ Database Architecture

### Dual Database Design

```
┌─────────────────────────────────────┐
│         📊 DATABASE LAYER           │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐    │
│  │ Payload CMS │ │  Supabase   │    │
│  │             │ │             │    │
│  │ • Admin UI  │ │ • Real-time │    │
│  │ • Content   │ │ • Auth      │    │
│  │ • Structure │ │ • API       │    │
│  │ • Relations │ │ • Functions │    │
│  └─────────────┘ └─────────────┘    │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐ │
│  │     PostgreSQL Database         │ │
│  │                                 │ │
│  │  Shared Tables + Sync Layer     │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Data Synchronization

```typescript
// Synchronization Strategy
interface SyncConfig {
  source: 'payload' | 'supabase'
  target: 'payload' | 'supabase'
  tables: string[]
  syncInterval: number
  conflictResolution: 'source-wins' | 'target-wins' | 'manual'
}

// Example: Sync customers from Payload to Supabase
const customerSync: SyncConfig = {
  source: 'payload',
  target: 'supabase',
  tables: ['customers'],
  syncInterval: 300000, // 5 minutes
  conflictResolution: 'source-wins'
}
```

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│ NextAuth.js │───▶│  Database   │
│             │    │             │    │             │
│ • Login     │    │ • JWT       │    │ • Users     │
│ • Register  │    │ • Sessions  │    │ • Roles     │
│ • Logout    │    │ • Refresh   │    │ • Permissions│
└─────────────┘    └─────────────┘    └─────────────┘
```

### Security Layers

```typescript
// API Security Middleware
export async function apiAuthMiddleware(request: NextRequest) {
  // 1. Authentication check
  const session = await getServerSession(authOptions)

  // 2. Authorization check
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 3. Role-based access control
  const userRole = session.user.role
  const requiredRole = getRequiredRole(request.nextUrl.pathname)

  if (!hasPermission(userRole, requiredRole)) {
    return new Response('Forbidden', { status: 403 })
  }

  // 4. Rate limiting
  const rateLimit = await checkRateLimit(request)
  if (rateLimit.exceeded) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  return NextResponse.next()
}
```

## 🚀 Performance Architecture

### Optimization Strategies

```typescript
// Code Splitting
const AdminPanel = dynamic(
  () => import('@/components/admin/AdminPanel'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
)

// Image Optimization
import Image from 'next/image'

<Image
  src={service.image}
  alt={service.name}
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Caching Strategy
const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/api/services'),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  })
}
```

### CDN & Asset Optimization

```
┌─────────────────────────────────────┐
│        🚀 PERFORMANCE LAYER         │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐    │
│  │   Vercel    │ │   Image    │    │
│  │    CDN      │ │Optimization│    │
│  │             │ │            │    │
│  │ • Global    │ │ • WebP     │    │
│  │ • Edge      │ │ • Lazy     │    │
│  │ • Caching   │ │ • Responsive│    │
│  └─────────────┘ └─────────────┘    │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐    │
│  │   Bundle    │ │   Code     │    │
│  │Optimization │ │ Splitting  │    │
│  │             │ │            │    │
│  │ • Tree      │ │ • Dynamic  │    │
│  │ • Shaking   │ │ • Imports  │    │
│  │ • Minification│ │ • Lazy     │    │
│  └─────────────┘ └─────────────┘    │
└─────────────────────────────────────┘
```

## 🔧 Development Architecture

### Development Workflow

```
┌─────────────────────────────────────┐
│      🛠️ DEVELOPMENT WORKFLOW        │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐    │
│  │  Feature    │ │   Branch   │    │
│  │Development │ │ Management │    │
│  │             │ │            │    │
│  │ • Planning  │ │ • Git Flow │    │
│  │ • Coding    │ │ • PR Review│    │
│  │ • Testing   │ │ • Merge    │    │
│  └─────────────┘ └─────────────┘    │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐    │
│  │   Testing   │ │ Deployment  │    │
│  │   Pipeline  │ │   Pipeline  │    │
│  │             │ │            │    │
│  │ • Unit      │ │ • Build     │    │
│  │ • Integration│ │ • Test      │    │
│  │ • E2E       │ │ • Deploy    │    │
│  └─────────────┘ └─────────────┘    │
└─────────────────────────────────────┘
```

### Quality Assurance

```typescript
// Testing Strategy
├── Unit Tests (Jest)
│   ├── Component testing
│   ├── Hook testing
│   └── Utility testing
├── Integration Tests
│   ├── API endpoint testing
│   ├── Database operations
│   └── Component integration
├── E2E Tests (Playwright)
│   ├── User journey testing
│   ├── Critical path testing
│   └── Cross-browser testing
└── Performance Tests
    ├── Load testing
    ├── Lighthouse audits
    └── Bundle analysis
```

## 📊 Monitoring & Observability

### Application Monitoring

```typescript
// Error Tracking
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})

// Performance Monitoring
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <>
      <SpeedInsights />
      {children}
    </>
  )
}

// Analytics
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  )
}
```

## 🚢 Deployment Architecture

### Production Infrastructure

```
┌─────────────────────────────────────┐
│     🚢 PRODUCTION INFRASTRUCTURE    │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐    │
│  │   Vercel    │ │ PostgreSQL  │    │
│  │  Frontend   │ │  Database   │    │
│  │             │ │             │    │
│  │ • SSR/SSG   │ │ • Supabase  │    │
│  │ • CDN       │ │ • Payload   │    │
│  │ • Edge      │ │ • Backups   │    │
│  └─────────────┘ └─────────────┘    │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐    │
│  │   Redis     │ │  Storage   │    │
│  │   Cache     │ │   (S3)     │    │
│  │             │ │            │    │
│  │ • Sessions  │ │ • Images    │    │
│  │ • API Cache │ │ • Files     │    │
│  │ • Rate Limit│ │ • Backups   │    │
│  └─────────────┘ └─────────────┘    │
└─────────────────────────────────────┘
```

## 🔄 API Architecture

### RESTful API Design

```typescript
// API Route Structure
// src/app/api/
├── auth/
│   ├── signin/route.ts     // POST /api/auth/signin
│   ├── signup/route.ts     // POST /api/auth/signup
│   └── signout/route.ts    // POST /api/auth/signout
├── users/
│   ├── route.ts            // GET, POST /api/users
│   └── [id]/
│       └── route.ts        // GET, PUT, DELETE /api/users/[id]
├── services/
│   ├── route.ts            // GET, POST /api/services
│   └── [id]/
│       └── route.ts        // GET, PUT, DELETE /api/services/[id]
└── bookings/
    ├── route.ts            // GET, POST /api/bookings
    └── [id]/
        ├── route.ts        // GET, PUT, DELETE /api/bookings/[id]
        └── cancel/route.ts // POST /api/bookings/[id]/cancel
```

### API Response Format

```typescript
// Consistent API Response Structure
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    timestamp: string
  }
}

// Success Response
{
  "success": true,
  "data": { /* payload */ },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}

// Error Response
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🎯 Scalability Considerations

### Horizontal Scaling

```typescript
// Database Connection Pooling
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,          // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Redis for Caching
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

// CDN for Static Assets
// Automatic with Vercel deployment
// Custom CDN configuration for other providers
```

### Performance Optimization

```typescript
// Database Indexing Strategy
CREATE INDEX CONCURRENTLY idx_appointments_date_status
ON appointments (appointment_date, status);

CREATE INDEX CONCURRENTLY idx_appointments_customer
ON appointments (customer_id);

CREATE INDEX CONCURRENTLY idx_services_category_active
ON services (category, is_active);

// Query Optimization
const getUpcomingAppointments = async (customerId: string) => {
  return await db.appointment.findMany({
    where: {
      customerId,
      date: { gte: new Date() },
      status: 'confirmed'
    },
    include: {
      service: true,
      stylist: true
    },
    orderBy: { date: 'asc' },
    take: 10
  })
}
```

## 📈 Future Architecture Evolution

### Microservices Migration Path

```
Current: Monolithic Application
├── Frontend (Next.js)
├── API Routes
├── CMS (Payload)
└── Database (Supabase)

Future: Microservices Architecture
├── User Service (Authentication)
├── Booking Service (Appointments)
├── Content Service (CMS)
├── Payment Service (Stripe)
├── Notification Service (Email/SMS)
└── Analytics Service (Reporting)
```

### Technology Roadmap

```typescript
// Phase 1: Current Stack Enhancement
- Upgrade to Next.js 15 App Router ✅
- Implement tRPC for type-safe APIs
- Add Redis for advanced caching
- Implement GraphQL API layer

// Phase 2: Advanced Features
- Real-time collaboration features
- AI-powered recommendations
- Advanced analytics with ML
- Mobile app development

// Phase 3: Enterprise Features
- Multi-tenant architecture
- Advanced security features
- Compliance automation
- Global scalability
```

This architecture document provides the foundation for understanding, maintaining, and extending the Modern Men Hair Salon management system. The modular, scalable design ensures the system can grow with business needs while maintaining performance and reliability.

---

**🎯 Key Takeaways:**
- **Dual Database Strategy** for optimal performance
- **Component-Based Architecture** for maintainability
- **Type-Safe Development** with TypeScript
- **Real-Time Capabilities** for modern UX
- **Scalable Infrastructure** for business growth
- **Comprehensive Testing** for reliability
