# 📱 MOBILE RESPONSIVE BREAKPOINTS

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    MOBILE RESPONSIVE BREAKPOINTS                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BREAKPOINT SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                          DESKTOP (1200px+)                             │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │  │
│  │  │  SIDEBAR    │  │   CONTENT   │  │  SIDEBAR   │  │  DETAILS    │    │  │
│  │  │  (300px)    │  │  (800px)    │  │  (300px)   │  │  (400px)    │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         TABLET (768px-1199px)                          │  │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────┐      │  │
│  │  │        CONTENT              │  │         SIDEBAR              │      │  │
│  │  │        (70%)                │  │         (30%)                │      │  │
│  │  └─────────────────────────────┘  └─────────────────────────────┘      │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                        MOBILE (320px-767px)                           │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │  │                     FULL WIDTH                                │    │  │
│  │  │                  STACKED LAYOUT                              │    │  │
│  │  └─────────────────────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                        COMPONENT SCALING                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │  │
│  │  │   BUTTONS   │  │   CARDS     │  │   FORMS     │  │   TEXT       │    │  │
│  │  │   (44px+)   │  │   (100% W)  │  │   (Full W)  │  │   (16px+)    │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘

BREAKPOINTS: 📱 320px │ 📲 768px │ 💻 1024px │ 🖥️ 1200px │ 📺 1440px
```

## 📱 Responsive Design System

### Breakpoint Definitions
```scss
// Mobile-first breakpoint system
$breakpoints: (
  xs: 0,      // Extra small devices (portrait phones)
  sm: 576px,  // Small devices (landscape phones)
  md: 768px,  // Medium devices (tablets)
  lg: 992px,  // Large devices (desktops)
  xl: 1200px, // Extra large devices (large desktops)
  xxl: 1400px // Extra extra large devices
);

// Usage in SCSS
@media (min-width: map-get($breakpoints, md)) {
  .container {
    max-width: 720px;
  }
}

// Usage in CSS
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}
```

### Tailwind CSS Breakpoints
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}

// Usage in JSX
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## 📐 Component Scaling Strategy

### Typography Scale
```scss
// Mobile-first typography scale
$text-sizes: (
  xs: (
    mobile: 12px,
    tablet: 13px,
    desktop: 14px
  ),
  sm: (
    mobile: 14px,
    tablet: 15px,
    desktop: 16px
  ),
  base: (
    mobile: 16px,
    tablet: 17px,
    desktop: 18px
  ),
  lg: (
    mobile: 18px,
    tablet: 20px,
    desktop: 22px
  ),
  xl: (
    mobile: 20px,
    tablet: 24px,
    desktop: 28px
  )
);
```

### Spacing Scale
```scss
// Consistent spacing system
$spacing: (
  xs: (
    mobile: 4px,
    tablet: 6px,
    desktop: 8px
  ),
  sm: (
    mobile: 8px,
    tablet: 12px,
    desktop: 16px
  ),
  md: (
    mobile: 16px,
    tablet: 20px,
    desktop: 24px
  ),
  lg: (
    mobile: 24px,
    tablet: 32px,
    desktop: 40px
  ),
  xl: (
    mobile: 32px,
    tablet: 48px,
    desktop: 64px
  )
);
```

## 📱 Mobile-Specific Optimizations

### Touch Targets
```scss
// Minimum touch target sizes
$touch-targets: (
  minimum: 44px,    // iOS Human Interface Guidelines
  comfortable: 48px, // Material Design
  spacious: 56px     // Large touch targets
);

// Touch-friendly button styles
.touch-target {
  min-height: map-get($touch-targets, minimum);
  min-width: map-get($touch-targets, minimum);

  // Add padding for better touch area
  padding: map-get($spacing, sm);

  // Prevent text selection on touch
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

### Mobile Navigation Patterns
```jsx
// Mobile-first navigation
const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger menu button */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <nav className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
            {/* Navigation items */}
          </nav>
        </div>
      )}
    </>
  )
}
```

## 📊 Layout Patterns

### Container System
```scss
// Responsive container system
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 map-get($spacing, md);

  @media (min-width: map-get($breakpoints, md)) {
    padding: 0 map-get($spacing, lg);
  }

  @media (min-width: map-get($breakpoints, lg)) {
    padding: 0 map-get($spacing, xl);
  }
}
```

### Grid System
```scss
// 12-column responsive grid
.grid {
  display: grid;
  gap: map-get($spacing, md);
  grid-template-columns: repeat(12, 1fr);

  // Mobile: single column
  .grid-item {
    grid-column: span 12;
  }

  // Tablet: 2 columns
  @media (min-width: map-get($breakpoints, md)) {
    .grid-item {
      grid-column: span 6;
    }
  }

  // Desktop: 3 columns
  @media (min-width: map-get($breakpoints, lg)) {
    .grid-item {
      grid-column: span 4;
    }
  }
}
```

## 🎨 Responsive Component Library

### Responsive Card Component
```jsx
const ResponsiveCard = ({ children, className = '' }) => (
  <div className={cn(
    // Base mobile styles
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    // Mobile padding
    'p-4',
    // Tablet padding
    'md:p-6',
    // Desktop padding
    'lg:p-8',
    className
  )}>
    {children}
  </div>
)
```

### Responsive Button Component
```jsx
const ResponsiveButton = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}) => (
  <button
    className={cn(
      // Base button styles
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',

      // Responsive sizing
      {
        // Small
        'h-8 px-3 text-xs md:h-9 md:px-4 md:text-sm': size === 'sm',
        // Default
        'h-10 px-4 text-sm md:h-11 md:px-6 md:text-base': size === 'default',
        // Large
        'h-12 px-6 text-base md:h-14 md:px-8 md:text-lg': size === 'lg',
      },

      // Variant styles
      {
        'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
        'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
        'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
      },

      className
    )}
    {...props}
  >
    {children}
  </button>
)
```

## 📱 Mobile-First Development Strategy

### Progressive Enhancement
```scss
// Mobile-first CSS approach
.mobile-first-component {
  // Base mobile styles
  font-size: 14px;
  padding: 8px;

  // Tablet enhancement
  @media (min-width: 768px) {
    font-size: 16px;
    padding: 12px;
  }

  // Desktop enhancement
  @media (min-width: 1024px) {
    font-size: 18px;
    padding: 16px;
  }
}
```

### Responsive Images
```jsx
const ResponsiveImage = ({ src, alt, className = '' }) => (
  <picture>
    {/* Mobile image */}
    <source media="(max-width: 767px)" srcSet={`${src}-mobile.jpg`} />
    {/* Tablet image */}
    <source media="(min-width: 768px)" srcSet={`${src}-tablet.jpg`} />
    {/* Desktop image */}
    <source media="(min-width: 1024px)" srcSet={`${src}.jpg`} />

    {/* Fallback */}
    <img
      src={`${src}.jpg`}
      alt={alt}
      className={cn('w-full h-auto', className)}
      loading="lazy"
    />
  </picture>
)
```

## 📊 Performance Considerations

### Critical CSS
```scss
// Critical CSS for above-the-fold content
.critical-css {
  // Only load critical styles initially
  .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-title {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-align: center;
  }

  // Load remaining styles asynchronously
  @media (min-width: 768px) {
    .hero-title {
      font-size: 3rem;
    }
  }
}
```

### Lazy Loading
```jsx
// Lazy load non-critical components
const LazyBookingForm = lazy(() => import('./BookingForm'))
const LazyTestimonials = lazy(() => import('./Testimonials'))

const HomePage = () => (
  <Suspense fallback={<Skeleton />}>
    {/* Critical content loads immediately */}
    <HeroSection />

    {/* Non-critical content loads lazily */}
    <Suspense fallback={<Skeleton />}>
      <LazyBookingForm />
    </Suspense>

    <Suspense fallback={<Skeleton />}>
      <LazyTestimonials />
    </Suspense>
  </Suspense>
)
```

## 🧪 Testing Responsive Design

### Visual Regression Testing
```javascript
// Playwright visual testing
test('homepage looks correct on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
  await page.goto('/')

  // Take screenshot for comparison
  await expect(page).toHaveScreenshot('homepage-mobile.png')
})

test('homepage looks correct on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')

  await expect(page).toHaveScreenshot('homepage-desktop.png')
})
```

### Responsive Unit Tests
```javascript
// Jest responsive testing
describe('ResponsiveButton', () => {
  it('has correct mobile styles', () => {
    render(<ResponsiveButton>Mobile Button</ResponsiveButton>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'px-4', 'text-sm')
  })

  it('has correct desktop styles', () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    })

    render(<ResponsiveButton>Desktop Button</ResponsiveButton>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('md:h-11', 'md:px-6', 'md:text-base')
  })
})
```

## 📋 Responsive Design Checklist

### Layout & Grid
- [x] Mobile-first approach
- [x] Flexible grid system
- [x] Responsive containers
- [x] Touch-friendly spacing

### Typography
- [x] Responsive font sizes
- [x] Readable line heights
- [x] Proper contrast ratios
- [x] Scalable text hierarchy

### Navigation
- [x] Mobile-friendly menu
- [x] Touch targets ≥ 44px
- [x] Swipe gestures
- [x] Accessible navigation

### Images & Media
- [x] Responsive images
- [x] Lazy loading
- [x] Proper aspect ratios
- [x] Optimized file sizes

### Performance
- [x] Critical CSS
- [x] Code splitting
- [x] Progressive enhancement
- [x] Fast loading times

## 📊 Device Coverage Matrix

| Device Category | Screen Size | Pixel Density | Touch Support | Priority |
|----------------|-------------|---------------|---------------|----------|
| Mobile Phones | 320px - 414px | 2x - 3x | Yes | High |
| Tablets | 768px - 1024px | 1x - 2x | Yes | High |
| Small Laptops | 1024px - 1366px | 1x - 1.5x | No | Medium |
| Large Desktops | 1366px+ | 1x - 2x | No | Medium |
| Ultra-wide | 2560px+ | 1x | No | Low |

## 🎯 Accessibility in Responsive Design

### Touch Accessibility
```scss
// Enhanced touch targets for accessibility
.accessible-touch {
  min-height: 44px;
  min-width: 44px;

  // Add visual focus indicator
  &:focus-visible {
    outline: 2px solid #007acc;
    outline-offset: 2px;
  }

  // Increase hit area without changing visual size
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
  }
}
```

### Responsive Text Scaling
```scss
// Fluid typography system
.fluid-text {
  font-size: clamp(1rem, 2.5vw, 2rem);

  @supports not (font-size: clamp(1rem, 2.5vw, 2rem)) {
    // Fallback for browsers without clamp support
    font-size: 1rem;

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }

    @media (min-width: 1024px) {
      font-size: 2rem;
    }
  }
}
```
