# 🧩 COMPONENT HIERARCHY MAP

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT HIERARCHY MAP                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ROOT LAYOUT                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   NAVBAR    │  │   HEADER    │  │   FOOTER    │  │   SIDEBAR   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        PAGE CONTENT                                     │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                    │   │
│  │  │   HERO      │  │   SERVICES  │  │   ABOUT     │                    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                    │   │
│  │                                                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                    FEATURED CONTENT                            │   │   │
│  │  ├─────────────────────────────────────────────────────────────────┤   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │   │   │
│  │  │  │   TEAM      │  │   TESTIMONIAL│  │   GALLERY  │            │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘            │   │   │
│  │  │                                                                 │   │   │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │   │   │
│  │  │  │                 INTERACTIVE COMPONENTS                  │   │   │   │
│  │  │  ├─────────────────────────────────────────────────────────┤   │   │   │
│  │  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │   │   │
│  │  │  │  │   BOOKING   │  │   CONTACT   │  │   CHATBOT   │    │   │   │   │
│  │  │  │  └─────────────┘  └─────────────┘  └─────────────┘    │   │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │   │
│  └─────────────────────────────────────────────────────────────────┘   │   │
└─────────────────────────────────────────────────────────────────────────┘   │
                                                                            │
┌─────────────────────────────────────────────────────────────────────────────┘
│                          SHARED COMPONENTS
├──────────────────────────────────────────────────────────────────────────────
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  │   BUTTONS   │  │   CARDS     │  │   FORMS     │  │   MODALS    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
│
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  │   ICONS     │  │   TOASTS    │  │   LOADERS   │  │   CHARTS    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
└──────────────────────────────────────────────────────────────────────────────
```

## 🏗️ Component Architecture Overview

### Root Layout Components
| Component | Purpose | Location | Reusability |
|-----------|---------|----------|-------------|
| **Navbar** | Main navigation, logo, auth links | `src/components/layout/` | High |
| **Header** | Page headers with breadcrumbs | `src/components/layout/` | Medium |
| **Footer** | Site footer with links and info | `src/components/layout/` | High |
| **Sidebar** | Admin dashboard navigation | `src/components/layout/` | Low |

### Page Content Components
| Component | Purpose | Location | Reusability |
|-----------|---------|----------|-------------|
| **Hero** | Landing page hero section | `src/components/sections/` | Medium |
| **Services** | Service listing and details | `src/components/sections/` | High |
| **About** | Company information section | `src/components/sections/` | Medium |
| **Team** | Staff member profiles | `src/components/sections/` | High |
| **Testimonials** | Customer reviews display | `src/components/sections/` | High |
| **Gallery** | Portfolio image gallery | `src/components/sections/` | High |
| **Booking** | Appointment booking widget | `src/components/booking/` | Low |
| **Contact** | Contact form and information | `src/components/contact/` | Medium |
| **Chatbot** | Customer support chat | `src/components/support/` | Low |

### Shared Components Library
| Component | Purpose | Location | Reusability |
|-----------|---------|----------|-------------|
| **Buttons** | Action buttons with variants | `src/components/ui/` | Very High |
| **Cards** | Content containers | `src/components/ui/` | Very High |
| **Forms** | Input controls and forms | `src/components/ui/` | High |
| **Modals** | Overlay dialogs | `src/components/ui/` | High |
| **Icons** | Icon library and components | `src/components/ui/` | Very High |
| **Toasts** | Notification messages | `src/components/ui/` | High |
| **Loaders** | Loading states and spinners | `src/components/ui/` | High |
| **Charts** | Data visualization | `src/components/ui/` | Medium |

## 📁 Component Organization Structure

```
src/
├── components/
│   ├── layout/           # Layout-specific components
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── header.tsx
│   ├── sections/         # Page section components
│   │   ├── hero.tsx
│   │   ├── services.tsx
│   │   ├── about.tsx
│   │   └── team.tsx
│   ├── ui/              # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── modal.tsx
│   ├── booking/         # Booking-related components
│   │   ├── booking-form.tsx
│   │   ├── calendar.tsx
│   │   └── time-slots.tsx
│   ├── dashboard/       # Dashboard-specific components
│   │   ├── stats-cards.tsx
│   │   ├── data-table.tsx
│   │   └── charts.tsx
│   └── forms/           # Form-specific components
│       ├── contact-form.tsx
│       ├── booking-form.tsx
│       └── profile-form.tsx
```

## 🔄 Component Communication Flow

### Props Down, Events Up Pattern
```
Parent Component
    │
    │ (props)
    ▼
Child Component
    │
    │ (events/callbacks)
    ▼
Parent Component
```

### State Management Pattern
```
Global State (Zustand/Redux)
    │
    ├── Component A (read/write)
    ├── Component B (read-only)
    └── Component C (read/write)
```

### Context Pattern for Theming
```
ThemeProvider (Context)
    │
    ├── Layout Components
    ├── UI Components
    └── Page Components
```

## 🎨 Component Design Principles

### 1. Single Responsibility
- Each component has one clear purpose
- Components are focused and not overloaded
- Complex components are broken down into smaller pieces

### 2. Reusability
- Components are designed to be reusable across the app
- Props allow for customization and flexibility
- Variants support different use cases

### 3. Composability
- Components can be easily combined
- Higher-order components for shared functionality
- Compound components for related functionality

### 4. Accessibility
- ARIA attributes and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### 5. Performance
- Lazy loading for large components
- Memoization for expensive computations
- Efficient re-rendering strategies

## 📊 Component Metrics

### Complexity Distribution
- **Simple Components** (1-5 props): 60%
- **Medium Components** (6-15 props): 30%
- **Complex Components** (15+ props): 10%

### Reusability Index
- **Very High** (>10 uses): Buttons, Icons, Cards
- **High** (5-10 uses): Forms, Modals, Tables
- **Medium** (2-5 uses): Section components
- **Low** (1 use): Page-specific components

### Maintenance Cost
- **Low**: Simple, well-tested components
- **Medium**: Moderately complex components
- **High**: Complex, tightly coupled components

## 🧪 Component Testing Strategy

### Unit Tests
```typescript
// Component rendering and interactions
describe('Button', () => {
  it('renders with correct text', () => {})
  it('handles click events', () => {})
  it('applies correct variants', () => {})
})
```

### Integration Tests
```typescript
// Component interactions and data flow
describe('BookingForm', () => {
  it('submits form data correctly', () => {})
  it('validates required fields', () => {})
  it('handles API errors gracefully', () => {})
})
```

### Visual Regression Tests
```typescript
// Component appearance consistency
describe('Card Component', () => {
  it('matches design specifications', () => {})
  it('handles responsive breakpoints', () => {})
})
```
