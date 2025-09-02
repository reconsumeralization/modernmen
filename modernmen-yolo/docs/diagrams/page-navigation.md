# 🗺️ PAGE NAVIGATION FLOW

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PAGE NAVIGATION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   HOMEPAGE      │
│   (/)           │
└─────────────────┘
        │
        ├─────────────────┬─────────────────┬─────────────────┐
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   SERVICES   │   │    ABOUT    │   │    TEAM     │   │   CONTACT   │
│   (/services)│   │  (/about)   │   │  (/team)    │   │ (/contact)  │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
        │                 │                 │                 │
        └─────────────────┼─────────────────┼─────────────────┘
                          │                 │
                          ▼                 ▼
                  ┌─────────────┐   ┌─────────────┐
                  │   BOOKING   │   │   GALLERY   │
                  │   (/book)   │   │ (/gallery)  │
                  └─────────────┘   └─────────────┘
                          │                 │
                          └─────────────────┘
                                  │
                                  ▼
                          ┌─────────────┐
                          │   PORTAL    │
                          │ (/portal)   │
                          └─────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │   LOGIN     │ │   BOOK      │ │   PROFILE   │
            │ (/portal/login)│ │(/portal/book)│ │(/portal/profile)│
            └─────────────┘ └─────────────┘ └─────────────┘
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                                  ▼
                          ┌─────────────┐
                          │   DASHBOARD │
                          │ (/portal)   │
                          └─────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ APPOINTMENTS│ │  SERVICES   │ │   ACCOUNT   │
            └─────────────┘ └─────────────┘ └─────────────┘

NAVIGATION: 🏠 Public → 🔐 Auth → 👤 Portal → ⚙️ Admin
```

## 🧭 Navigation Architecture

### Public Pages (No Authentication Required)
| Route | Purpose | Components | SEO Priority |
|-------|---------|------------|--------------|
| `/` | Homepage | Hero, Services, About, Testimonials | High |
| `/services` | Service catalog | Service cards, pricing, booking CTA | High |
| `/about` | Company story | Team, mission, values | Medium |
| `/team` | Staff profiles | Stylist cards, specialties | Medium |
| `/contact` | Contact form | Form, map, hours | Medium |
| `/book` | Quick booking | Booking wizard, calendar | High |
| `/gallery` | Portfolio | Image gallery, filters | Medium |

### Customer Portal (Authentication Required)
| Route | Purpose | Features | Access Level |
|-------|---------|----------|--------------|
| `/portal` | Dashboard | Overview, recent bookings | Customer |
| `/portal/login` | Authentication | Login, register, forgot password | Public |
| `/portal/book` | Booking flow | Service selection, stylist choice | Customer |
| `/portal/profile` | Account management | Profile edit, preferences | Customer |
| `/portal/history` | Booking history | Past appointments, reviews | Customer |
| `/portal/loyalty` | Rewards program | Points, rewards, referrals | Customer |

### Admin Dashboard (Staff/Owner Access)
| Route | Purpose | Features | Access Level |
|-------|---------|----------|--------------|
| `/admin` | Admin dashboard | Analytics, quick actions | Admin |
| `/admin/appointments` | Appointment management | Calendar, bookings, conflicts | Staff |
| `/admin/customers` | Customer database | Profiles, history, communications | Staff |
| `/admin/services` | Service management | CRUD operations, pricing | Admin |
| `/admin/staff` | Team management | Scheduling, permissions | Owner |
| `/admin/reports` | Business analytics | Charts, exports, insights | Admin |
| `/admin/settings` | System configuration | Business settings, integrations | Owner |

## 🔄 User Journey Navigation

### New Customer Journey
```
Discovery (/) → Interest (/services) → Consideration (/team) → Conversion (/book)
```

### Returning Customer Journey
```
Portal Login (/portal/login) → Dashboard (/portal) → Book Again (/portal/book)
```

### Admin Workflow Journey
```
Login (/admin/login) → Dashboard (/admin) → Appointments (/admin/appointments)
```

## 🎯 Navigation Patterns

### Breadcrumb Navigation
```typescript
// Breadcrumb structure for deep pages
const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Haircut', href: '/services/haircut' },
  { label: 'Book Appointment', href: '/book' }
]
```

### Tab Navigation
```typescript
// Dashboard tab structure
const dashboardTabs = [
  { id: 'overview', label: 'Overview', href: '/portal' },
  { id: 'appointments', label: 'Appointments', href: '/portal/appointments' },
  { id: 'profile', label: 'Profile', href: '/portal/profile' },
  { id: 'loyalty', label: 'Loyalty', href: '/portal/loyalty' }
]
```

### Sidebar Navigation
```typescript
// Admin sidebar structure
const adminNavigation = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Overview', href: '/admin', icon: 'dashboard' },
      { label: 'Analytics', href: '/admin/analytics', icon: 'analytics' }
    ]
  },
  {
    title: 'Management',
    items: [
      { label: 'Appointments', href: '/admin/appointments', icon: 'calendar' },
      { label: 'Customers', href: '/admin/customers', icon: 'users' },
      { label: 'Services', href: '/admin/services', icon: 'scissors' }
    ]
  }
]
```

## 🔐 Authentication Guards

### Route Protection
```typescript
// Route protection middleware
const requireAuth = (Component) => {
  return (props) => {
    const { user, loading } = useAuth()

    if (loading) return <LoadingSpinner />

    if (!user) {
      redirect('/portal/login')
      return null
    }

    return <Component {...props} />
  }
}

// Usage in routes
const ProtectedRoute = requireAuth(DashboardPage)
```

### Role-Based Access
```typescript
// Role-based route protection
const requireRole = (roles: string[]) => (Component) => {
  return (props) => {
    const { user } = useAuth()

    if (!user || !roles.includes(user.role)) {
      return <AccessDenied />
    }

    return <Component {...props} />
  }
}

// Usage
const AdminRoute = requireRole(['admin', 'owner'])(AdminDashboard)
```

## 📱 Mobile Navigation

### Mobile Menu Structure
```typescript
const mobileNavigation = [
  {
    label: 'Home',
    href: '/',
    icon: 'home'
  },
  {
    label: 'Services',
    href: '/services',
    icon: 'scissors'
  },
  {
    label: 'Book',
    href: '/book',
    icon: 'calendar',
    primary: true // Highlighted CTA
  },
  {
    label: 'About',
    href: '/about',
    icon: 'info'
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: 'phone'
  }
]
```

### Bottom Tab Navigation (Mobile)
```typescript
// Mobile app-style navigation
const mobileTabs = [
  { label: 'Home', icon: 'home', href: '/' },
  { label: 'Search', icon: 'search', href: '/search' },
  { label: 'Book', icon: 'plus', href: '/book', highlighted: true },
  { label: 'Profile', icon: 'user', href: '/portal' },
  { label: 'More', icon: 'menu', href: '/more' }
]
```

## 🎨 Navigation Design System

### Navigation States
- **Default**: Normal state
- **Hover**: Interactive feedback
- **Active**: Current page indication
- **Disabled**: Unavailable state
- **Loading**: Async operation state

### Navigation Components
```typescript
// Reusable navigation components
const NavigationLink = ({ href, children, variant = 'default' }) => {
  const isActive = useIsActive(href)

  return (
    <Link
      href={href}
      className={cn(
        'navigation-link',
        variant,
        { active: isActive }
      )}
    >
      {children}
    </Link>
  )
}
```

## 📊 Analytics & Tracking

### Page View Tracking
```typescript
// Track page views for analytics
useEffect(() => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    gtag('config', GA_TRACKING_ID, {
      page_path: router.pathname,
    })

    // Custom analytics
    trackPageView({
      page: router.pathname,
      userId: user?.id,
      timestamp: new Date(),
      referrer: document.referrer
    })
  }
}, [router.pathname])
```

### Navigation Flow Tracking
```typescript
// Track user navigation patterns
const trackNavigation = (from, to, method) => {
  analytics.track('navigation', {
    from_page: from,
    to_page: to,
    navigation_method: method, // 'link', 'button', 'redirect'
    user_id: user?.id,
    timestamp: new Date()
  })
}
```

## 🚀 Performance Optimization

### Code Splitting by Route
```typescript
// Dynamic imports for route-based code splitting
const ServicesPage = dynamic(() => import('../pages/services'))
const BookingPage = dynamic(() => import('../pages/book'))
const AdminDashboard = dynamic(() => import('../pages/admin/dashboard'), {
  loading: () => <AdminSkeleton />
})
```

### Preloading Critical Routes
```typescript
// Preload important routes
useEffect(() => {
  // Preload booking page on homepage
  router.prefetch('/book')

  // Preload admin routes for admin users
  if (user?.role === 'admin') {
    router.prefetch('/admin')
    router.prefetch('/admin/appointments')
  }
}, [user])
```

## 🛡️ Security Considerations

### Route Security
- **Authentication**: Protect sensitive routes
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize route parameters

### Secure Navigation
```typescript
// Secure navigation with validation
const secureNavigate = (path: string) => {
  // Validate path is allowed
  if (!isValidRoute(path)) {
    console.error('Invalid navigation attempt:', path)
    return
  }

  // Check user permissions
  if (!hasPermission(path)) {
    redirect('/unauthorized')
    return
  }

  router.push(path)
}
```

## 📱 Progressive Web App (PWA)

### Offline Navigation
```typescript
// Service worker for offline navigation
const offlineRoutes = [
  '/',
  '/services',
  '/about',
  '/contact',
  '/portal/login'
]

// Cache strategy for navigation
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
)
```
