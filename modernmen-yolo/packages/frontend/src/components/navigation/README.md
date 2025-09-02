# Navigation & UX System

A comprehensive navigation and user experience system for the Modern Men Hair Salon application.

## 🎯 Overview

This navigation system provides:
- **Multi-level navigation** for different user roles
- **Responsive design** that works on all devices
- **User flows** for complex interactions
- **UX patterns** for consistent interactions
- **State management** for navigation context
- **Smooth transitions** and loading states

## 📁 File Structure

```
src/components/navigation/
├── header.tsx              # Main header component
├── footer.tsx              # Footer with navigation
├── breadcrumb.tsx          # Breadcrumb navigation
├── mobile-navigation.tsx   # Mobile-specific navigation
├── page-transition.tsx     # Loading and transition states
├── navigation-provider.tsx # Navigation context and hooks
├── user-flows.tsx          # Multi-step user journeys
├── ux-patterns.tsx         # Reusable UX components
├── index.ts               # Main exports
└── README.md              # This file
```

## 🚀 Quick Start

### Basic Setup

```tsx
import { MainLayout } from '@/components/navigation'

export default function Page() {
  return (
    <MainLayout
      user={{
        name: "John Doe",
        email: "john@example.com",
        role: "customer"
      }}
      onAuthAction={(action) => {
        // Handle login, register, logout
        console.log('Auth action:', action)
      }}
    >
      <div>Your page content here</div>
    </MainLayout>
  )
}
```

### Dashboard Setup

```tsx
import { DashboardLayout } from '@/components/navigation'

export default function AdminDashboard() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Manage your business"
      user={{
        name: "Admin User",
        email: "admin@modernmen.com",
        role: "admin"
      }}
    >
      <div>Dashboard content</div>
    </DashboardLayout>
  )
}
```

## 🧭 Navigation Components

### Header Component

The main header with navigation menu, user authentication, and mobile menu.

```tsx
import { Header } from '@/components/navigation'

<Header
  user={user}
  onAuthAction={handleAuthAction}
/>
```

**Props:**
- `user` - Current user object
- `onAuthAction` - Authentication action handler
- `className` - Additional CSS classes

### Footer Component

Comprehensive footer with navigation links and contact information.

```tsx
import { Footer, DashboardFooter } from '@/components/navigation'

<Footer /> // Public footer
<DashboardFooter /> // Simplified dashboard footer
```

### Breadcrumb Navigation

Shows the current page location and navigation path.

```tsx
import { Breadcrumb, PageHeader } from '@/components/navigation'

<Breadcrumb showHome />

<PageHeader
  title="Page Title"
  description="Page description"
  breadcrumb
  actions={<Button>Action</Button>}
/>
```

### Mobile Navigation

Mobile-optimized navigation with bottom tabs and floating action buttons.

```tsx
import { MobileNavigation, MobileBottomNav, MobileFAB } from '@/components/navigation'

<MobileNavigation
  items={navigationItems}
  user={user}
  onAuthAction={handleAuthAction}
/>

<MobileBottomNav items={bottomNavItems} />

<MobileFAB
  icon={Plus}
  onClick={() => setShowBooking(true)}
  label="Book Now"
/>
```

## 🔄 User Flows

Multi-step user journeys for complex interactions.

```tsx
import { UserFlow, useUserFlow } from '@/components/navigation'

function BookingPage() {
  const flow = useUserFlow('booking')

  return (
    <UserFlow
      type="booking"
      currentStep={flow.currentStep}
      onStepChange={flow.goToStep}
      onComplete={(data) => {
        console.log('Booking completed:', data)
      }}
      data={flow.flowData}
    />
  )
}
```

**Available Flow Types:**
- `booking` - Appointment booking process
- `onboarding` - User registration and setup
- `support` - Customer support requests
- `loyalty` - Loyalty program interactions

## 🎨 UX Patterns

Reusable components for consistent user interactions.

### Status Messages

```tsx
import { StatusMessage } from '@/components/navigation'

<StatusMessage
  type="success"
  title="Appointment Booked!"
  message="Your appointment has been confirmed."
  action={{
    label: "View Details",
    onClick: () => router.push('/appointments')
  }}
  dismissible
/>
```

### Confirmation Dialogs

```tsx
import { ConfirmDialog } from '@/components/navigation'

<ConfirmDialog
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="Cancel Appointment"
  description="Are you sure you want to cancel this appointment?"
  confirmLabel="Yes, Cancel"
  variant="destructive"
  onConfirm={handleCancel}
/>
```

### Filter Controls

```tsx
import { FilterControls } from '@/components/navigation'

<FilterControls
  searchValue={search}
  onSearchChange={setSearch}
  filters={[
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'pending', label: 'Pending' }
      ],
      value: statusFilter,
      onChange: setStatusFilter
    }
  ]}
  sortOptions={[
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Name' }
  ]}
  sortValue={sortBy}
  onSortChange={setSortBy}
/>
```

### Data Cards

```tsx
import { DataCard } from '@/components/navigation'

<DataCard
  title="Total Revenue"
  value="$12,345"
  change={{
    value: 12.5,
    type: "increase",
    label: "from last month"
  }}
  icon={DollarSign}
/>
```

## 🔧 Navigation Hooks

### useNavigation

Access navigation state and methods.

```tsx
import { useNavigation } from '@/components/navigation'

function MyComponent() {
  const {
    currentPath,
    previousPath,
    isNavigating,
    navigate,
    goBack
  } = useNavigation()

  return (
    <div>
      <p>Current: {currentPath}</p>
      <button onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
      <button onClick={goBack}>Go Back</button>
    </div>
  )
}
```

### useNavigate

Simplified navigation hook.

```tsx
import { useNavigate } from '@/components/navigation'

function MyComponent() {
  const { push, replace, back } = useNavigate()

  return (
    <div>
      <button onClick={() => push('/profile')}>Go to Profile</button>
      <button onClick={() => replace('/dashboard')}>Replace with Dashboard</button>
      <button onClick={back}>Go Back</button>
    </div>
  )
}
```

### usePageTransition

Handle page transition states.

```tsx
import { usePageTransition } from '@/components/navigation'

function MyComponent() {
  const { isTransitioning, startTransition } = usePageTransition()

  const handleClick = () => {
    startTransition()
    // Perform async operation
    performAsyncAction().finally(() => {
      // Transition will end automatically
    })
  }

  return (
    <button onClick={handleClick} disabled={isTransitioning}>
      {isTransitioning ? 'Loading...' : 'Click me'}
    </button>
  )
}
```

## 📱 Responsive Design

The navigation system is fully responsive and provides different experiences for different screen sizes:

### Desktop (> 1024px)
- Full horizontal navigation
- Dropdown menus
- Complete header with all features

### Tablet (768px - 1024px)
- Condensed navigation
- Touch-friendly elements
- Simplified layouts

### Mobile (< 768px)
- Hamburger menu
- Bottom navigation tabs
- Floating action buttons
- Swipe gestures support

## 🎭 User Roles

Different navigation experiences for different user types:

### Public Users
- Basic navigation with service information
- Contact and booking access
- No authentication required

### Customers
- Dashboard access
- Appointment management
- Profile and loyalty features

### Staff
- Staff-specific dashboard
- Schedule management
- Customer information access

### Admin
- Full administrative access
- Business analytics
- Staff and customer management

## 🚀 Advanced Features

### Progressive Disclosure

```tsx
import { ProgressiveDisclosure } from '@/components/navigation'

<ProgressiveDisclosure title="Advanced Options">
  <div>Advanced content here</div>
</ProgressiveDisclosure>
```

### Empty States

```tsx
import { EmptyState } from '@/components/navigation'

<EmptyState
  icon={Calendar}
  title="No Appointments"
  description="You don't have any upcoming appointments."
  action={{
    label: "Book Now",
    onClick: () => setShowBooking(true)
  }}
/>
```

### Loading States

```tsx
import { LoadingState } from '@/components/navigation'

<LoadingState
  size="lg"
  text="Loading your appointments..."
/>
```

## 📊 Analytics & Tracking

The navigation system includes built-in analytics:

```tsx
import { useNavigationState } from '@/components/navigation'

function AnalyticsTracker() {
  const { currentPath, navigationHistory } = useNavigationState()

  React.useEffect(() => {
    // Track page views
    trackPageView(currentPath)

    // Track navigation patterns
    if (navigationHistory.length > 1) {
      trackNavigationFlow(navigationHistory)
    }
  }, [currentPath, navigationHistory])

  return null
}
```

## 🧪 Testing

Test navigation components with the provided utilities:

```tsx
import { NavigationProvider } from '@/components/navigation'

// Wrap your test components
<NavigationProvider>
  <YourTestComponent />
</NavigationProvider>
```

## 🎨 Customization

### Custom Themes

```tsx
// In your CSS or theme configuration
:root {
  --nav-background: #ffffff;
  --nav-text: #000000;
  --nav-hover: #f5f5f5;
  --nav-active: #007bff;
}
```

### Custom Navigation Items

```tsx
const customNavigation = [
  {
    name: 'Custom Page',
    href: '/custom',
    icon: 'CustomIcon',
    badge: 'New'
  }
]
```

## 📚 Best Practices

1. **Keep navigation simple** - Don't overwhelm users with too many options
2. **Use consistent patterns** - Apply the same interaction patterns throughout
3. **Provide feedback** - Show loading states and confirmations
4. **Mobile-first** - Design for mobile and enhance for larger screens
5. **Accessibility** - Ensure all navigation is keyboard accessible
6. **Performance** - Lazy load navigation components when possible

## 🐛 Troubleshooting

### Common Issues

**Navigation not updating**
- Ensure `NavigationProvider` wraps your app
- Check that route changes are handled properly

**Mobile menu not working**
- Verify viewport meta tag is set
- Check CSS z-index values

**Breadcrumbs not showing**
- Confirm route is in `breadcrumbConfig`
- Check `showBreadcrumbs` prop

## 📞 Support

For questions or issues with the navigation system:

1. Check this documentation first
2. Review the component source code
3. Create an issue with reproduction steps
4. Contact the development team

---

This navigation system provides a solid foundation for user experience in the Modern Men Hair Salon application. It handles complex navigation patterns, responsive design, and user flows while maintaining performance and accessibility standards.
