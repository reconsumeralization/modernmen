# 🗺️ BUSINESS NAVIGATION FLOW (Whitelabel)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL BUSINESS NAVIGATION FLOW                          │
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
│ SERVICES/   │   │    ABOUT    │   │ TEAM/STAFF  │   │   CONTACT   │
│ PRODUCTS    │   │  (/about)   │   │  (/team)    │   │ (/contact)  │
│ (/services) │   │             │   │             │   │             │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
        │                 │                 │                 │
        └─────────────────┼─────────────────┼─────────────────┘
                          │                 │
                          ▼                 ▼
                  ┌─────────────┐   ┌─────────────┐
                  │ BOOKING/    │   │   GALLERY/  │
                  │ APPOINTMENT │   │  PORTFOLIO  │
                  │   (/book)   │   │ (/gallery)  │
                  └─────────────┘   └─────────────┘
                          │                 │
                          └─────────────────┘
                                  │
                                  ▼
                          ┌─────────────┐
                          │CLIENT PORTAL│
                          │ (/portal)   │
                          └─────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │   LOGIN     │ │ BOOK/ORDER  │ │   PROFILE   │
            │(/portal/login)│ │(/portal/book)│ │(/portal/profile)│
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
            │APPOINTMENTS │ │ SERVICES/   │ │   ACCOUNT   │
            │   /ORDERS   │ │  PRODUCTS   │ │             │
            └─────────────┘ └─────────────┘ └─────────────┘

NAVIGATION: 🏠 Public → 🔐 Auth → 👤 Portal → ⚙️ Admin
```

## 🧭 Universal Navigation Architecture

### Public Pages (No Authentication Required)
| Route | Purpose | Components | Business Types | SEO Priority |
|-------|---------|------------|----------------|--------------|
| `/` | Homepage | Hero, Services/Products, About, Testimonials | All | High |
| `/services` | Service/Product catalog | Cards, pricing, booking/order CTA | All | High |
| `/about` | Company story | Team, mission, values, history | All | Medium |
| `/team` | Staff/Team profiles | Professional cards, specialties, bios | Service-based | Medium |
| `/contact` | Contact information | Form, map, hours, location | All | Medium |
| `/book` | Booking/Ordering | Wizard, calendar, cart | All | High |
| `/gallery` | Portfolio/Showcase | Image gallery, filters, categories | Visual businesses | Medium |

### Client Portal (Authentication Required)
| Route | Purpose | Features | Business Context | Access Level |
|-------|---------|----------|------------------|--------------|
| `/portal` | Dashboard | Overview, recent activity | All businesses | Client/Customer |
| `/portal/login` | Authentication | Login, register, password reset | All businesses | Public |
| `/portal/book` | Booking/Ordering flow | Service selection, staff choice, scheduling | All businesses | Client/Customer |
| `/portal/profile` | Account management | Profile edit, preferences, billing | All businesses | Client/Customer |
| `/portal/history` | Activity history | Past bookings, orders, invoices | All businesses | Client/Customer |
| `/portal/loyalty` | Rewards program | Points, rewards, referrals | Applicable businesses | Client/Customer |

### Admin Dashboard (Staff/Owner Access)
| Route | Purpose | Features | Business Context | Access Level |
|-------|---------|----------|------------------|--------------|
| `/admin` | Admin dashboard | Analytics, quick actions, overview | All businesses | Admin |
| `/admin/appointments` | Appointment management | Calendar, bookings, scheduling | Service businesses | Staff |
| `/admin/orders` | Order management | Orders, fulfillment, tracking | Retail/Restaurant | Staff |
| `/admin/customers` | Client database | Profiles, history, communications | All businesses | Staff |
| `/admin/services` | Service/Product management | CRUD operations, pricing, inventory | All businesses | Admin |
| `/admin/staff` | Team management | Scheduling, permissions, payroll | All businesses | Owner |
| `/admin/reports` | Business analytics | Charts, exports, insights, KPIs | All businesses | Admin |
| `/admin/settings` | System configuration | Business settings, integrations | All businesses | Owner |

## 🏢 Business Type Adaptations

### Service-Based Businesses (Hair Salons, Law Firms, Medical)
```
Discovery → Services → Team → Booking → Portal (Appointments/History)
```
**Key Features:**
- Staff profiles with specialties
- Appointment scheduling
- Service packages
- Client history tracking

### Retail/E-commerce Businesses
```
Discovery → Products → Gallery → Cart → Portal (Orders/Account)
```
**Key Features:**
- Product catalog
- Shopping cart
- Order tracking
- Inventory management

### Restaurant/Food Service
```
Discovery → Menu → Location → Order → Portal (Orders/Loyalty)
```
**Key Features:**
- Menu management
- Location/hours
- Online ordering
- Delivery tracking

### Professional Services (Consulting, Accounting)
```
Discovery → Services → About → Contact → Portal (Projects/Billing)
```
**Key Features:**
- Service descriptions
- Case studies
- Client portal
- Document management

## 🔄 Universal User Journey Navigation

### New Client Journey (All Business Types)
```
Discovery (/) → Interest (/services) → Trust Building (/about, /team) → Conversion (/book)
```

### Returning Client Journey (All Business Types)
```
Portal Login (/portal/login) → Dashboard (/portal) → Action (/portal/book, /portal/order)
```

### Admin Workflow Journey (All Business Types)
```
Login (/admin/login) → Dashboard (/admin) → Management (/admin/[module])
```

## 🎯 Adaptive Navigation Patterns

### Dynamic Breadcrumb Navigation
```typescript
// Business-agnostic breadcrumb structure
const generateBreadcrumbs = (path: string, businessType: string) => {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs = [{ label: 'Home', href: '/' }]
  
  const businessLabels = {
    'hair-salon': {
      'services': 'Services',
      'team': 'Stylists',
      'book': 'Book Appointment'
    },
    'restaurant': {
      'services': 'Menu',
      'team': 'Chef Team', 
      'book': 'Order Now'
    },
    'law-firm': {
      'services': 'Practice Areas',
      'team': 'Attorneys',
      'book': 'Schedule Consultation'
    }
  }
  
  const labels = businessLabels[businessType] || businessLabels['default']
  
  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    breadcrumbs.push({
      label: labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href
    })
  })
  
  return breadcrumbs
}
```

### Business-Adaptive Tab Navigation
```typescript
// Dashboard tabs that adapt to business type
const getDashboardTabs = (businessType: string, userRole: string) => {
  const baseTabs = [
    { id: 'overview', label: 'Overview', href: '/portal' }
  ]
  
  const businessSpecificTabs = {
    'hair-salon': [
      { id: 'appointments', label: 'Appointments', href: '/portal/appointments' },
      { id: 'loyalty', label: 'Loyalty Points', href: '/portal/loyalty' }
    ],
    'restaurant': [
      { id: 'orders', label: 'Orders', href: '/portal/orders' },
      { id: 'favorites', label: 'Favorites', href: '/portal/favorites' }
    ],
    'law-firm': [
      { id: 'cases', label: 'Cases', href: '/portal/cases' },
      { id: 'documents', label: 'Documents', href: '/portal/documents' }
    ]
  }
  
  return [
    ...baseTabs,
    ...(businessSpecificTabs[businessType] || []),
    { id: 'profile', label: 'Profile', href: '/portal/profile' }
  ]
}
```

### Universal Admin Sidebar
```typescript
// Admin navigation that adapts to business type
const getAdminNavigation = (businessType: string) => {
  const baseNavigation = [
    {
      title: 'Dashboard',
      items: [
        { label: 'Overview', href: '/admin', icon: 'dashboard' },
        { label: 'Analytics', href: '/admin/analytics', icon: 'chart' }
      ]
    }
  ]
  
  const businessNavigation = {
    'hair-salon': {
      title: 'Salon Management',
      items: [
        { label: 'Appointments', href: '/admin/appointments', icon: 'calendar' },
        { label: 'Customers', href: '/admin/customers', icon: 'users' },
        { label: 'Services', href: '/admin/services', icon: 'scissors' },
        { label: 'Stylists', href: '/admin/staff', icon: 'user-check' }
      ]
    },
    'restaurant': {
      title: 'Restaurant Management', 
      items: [
        { label: 'Orders', href: '/admin/orders', icon: 'shopping-bag' },
        { label: 'Customers', href: '/admin/customers', icon: 'users' },
        { label: 'Menu', href: '/admin/menu', icon: 'menu' },
        { label: 'Staff', href: '/admin/staff', icon: 'chef-hat' }
      ]
    },
    'law-firm': {
      title: 'Practice Management',
      items: [
        { label: 'Cases', href: '/admin/cases', icon: 'briefcase' },
        { label: 'Clients', href: '/admin/clients', icon: 'users' },
        { label: 'Services', href: '/admin/services', icon: 'scales' },
        { label: 'Attorneys', href: '/admin/attorneys', icon: 'user-tie' }
      ]
    }
  }
  
  return [
    ...baseNavigation,
    businessNavigation[businessType] || businessNavigation['default']
  ]
}
```

## 🔐 Universal Authentication Guards

### Business-Agnostic Route Protection
```typescript
// Universal authentication middleware
const createAuthGuard = (businessType: string) => {
  const getRedirectPath = (userRole: string) => {
    const redirects = {
      'customer': '/portal',
      'client': '/portal',
      'staff': '/admin/appointments',
      'admin': '/admin',
      'owner': '/admin'
    }
    return redirects[userRole] || '/portal'
  }
  
  return (Component: React.ComponentType) => {
    return (props: any) => {
      const { user, loading } = useAuth()
      
      if (loading) return <LoadingSpinner businessType={businessType} />
      
      if (!user) {
        redirect('/portal/login')
        return null
      }
      
      return <Component {...props} user={user} />
    }
  }
}
```

### Role-Based Access Control
```typescript
// Universal role-based protection
const createRoleGuard = (allowedRoles: string[], businessType: string) => {
  return (Component: React.ComponentType) => {
    return (props: any) => {
      const { user } = useAuth()
      
      if (!user || !allowedRoles.includes(user.role)) {
        return <AccessDenied businessType={businessType} />
      }
      
      return <Component {...props} />
    }
  }
}

// Usage examples
const AdminRoute = createRoleGuard(['admin', 'owner'], businessType)
const StaffRoute = createRoleGuard(['staff', 'admin', 'owner'], businessType)
```

## 📱 Business-Adaptive Mobile Navigation

### Universal Mobile Menu
```typescript
const getMobileNavigation = (businessType: string) => {
  const baseNav = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'About', href: '/about', icon: 'info' },
    { label: 'Contact', href: '/contact', icon: 'phone' }
  ]
  
  const businessSpecificNav = {
    'hair-salon': [
      { label: 'Services', href: '/services', icon: 'scissors' },
      { label: 'Stylists', href: '/team', icon: 'users' },
      { label: 'Book Now', href: '/book', icon: 'calendar', primary: true },
      { label: 'Gallery', href: '/gallery', icon: 'image' }
    ],
    'restaurant': [
      { label: 'Menu', href: '/menu', icon: 'menu' },
      { label: 'Chefs', href: '/team', icon: 'chef-hat' },
      { label: 'Order Now', href: '/order', icon: 'shopping-bag', primary: true },
      { label: 'Location', href: '/location', icon: 'map-pin' }
    ],
    'law-firm': [
      { label: 'Practice Areas', href: '/services', icon: 'scales' },
      { label: 'Attorneys', href: '/team', icon: 'user-tie' },
      { label: 'Consultation', href: '/book', icon: 'calendar-check', primary: true },
      { label: 'Resources', href: '/resources', icon: 'book-open' }
    ]
  }
  
  return [
    baseNav[0], // Home
    ...(businessSpecificNav[businessType] || businessSpecificNav['default']),
    ...baseNav.slice(1) // About, Contact
  ]
}
```

## 🎨 Business Brand Integration

### Environment-Based Navigation Styling
```typescript
// Navigation styling that adapts to business brand
const getNavigationStyles = (businessType: string, environment: string) => {
  const envColors = {
    development: '#3b82f6',
    staging: '#f59e0b', 
    production: '#10b981'
  }
  
  const businessColors = {
    'hair-salon': '#1f2937',
    'restaurant': '#dc2626',
    'law-firm': '#1e40af',
    'medical': '#059669'
  }
  
  return {
    primaryColor: businessColors[businessType] || envColors[environment],
    // Additional styling based on business type
  }
}
```

### Dynamic Logo and Branding
```typescript
// Dynamic logo component for navigation
const NavigationLogo = ({ businessType, size = 'default' }) => {
  const logoConfig = {
    'hair-salon': {
      icon: 'scissors',
      fallbackText: process.env.BRAND_NAME || 'Hair Salon'
    },
    'restaurant': {
      icon: 'chef-hat',
      fallbackText: process.env.BRAND_NAME || 'Restaurant'
    },
    'law-firm': {
      icon: 'scales',
      fallbackText: process.env.BRAND_NAME || 'Law Firm'
    }
  }
  
  const config = logoConfig[businessType] || { icon: 'building', fallbackText: 'Business' }
  
  return (
    <div className={`navigation-logo ${size}`}>
      {process.env.CUSTOM_LOGO_URL ? (
        <img src={process.env.CUSTOM_LOGO_URL} alt={config.fallbackText} />
      ) : (
        <>
          <Icon name={config.icon} />
          <span>{config.fallbackText}</span>
        </>
      )}
    </div>
  )
}
```

## 🚀 Performance & SEO Optimization

### Business-Specific Route Preloading
```typescript
// Preload routes based on business type and user behavior
const useBusinessRoutePreloading = (businessType: string, user: any) => {
  const router = useRouter()
  
  useEffect(() => {
    // Common critical routes for all businesses
    router.prefetch('/book')
    router.prefetch('/contact')
    
    // Business-specific preloading
    const businessRoutes = {
      'hair-salon': ['/services', '/gallery', '/team'],
      'restaurant': ['/menu', '/location'],
      'law-firm': ['/services', '/attorneys']
    }
    
    const routes = businessRoutes[businessType] || []
    routes.forEach(route => router.prefetch(route))
    
    // User role-based preloading
    if (user?.role === 'admin') {
      router.prefetch('/admin')
      router.prefetch('/admin/analytics')
    }
  }, [businessType, user, router])
}
```

This universal navigation system can be configured for any business type while maintaining consistent user experience patterns and professional appearance. The system automatically adapts terminology, icons, and flows based on the business type configuration.