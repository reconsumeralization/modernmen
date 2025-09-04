# Modern Men Hair Salon - Icon System

## Overview

The Modern Men Hair Salon project uses a unified icon system built on top of [Lucide React](https://lucide.dev/) icons. This system provides consistent, accessible, and easily maintainable icons throughout the application.

## Architecture

### Core Files

- **`src/lib/icons.ts`** - Main icon definitions and exports
- **`src/lib/icon-mapping.ts`** - Icon mapping utilities and aliases
- **`src/lib/icons-index.ts`** - Convenient exports and aliases
- **`src/lib/icon-examples.ts`** - Usage examples and patterns

## Usage

### 1. Direct Import (Recommended)

```tsx
import { MapPin, Search, Settings, User } from '@/lib/icons-index'

const MyComponent = () => (
  <div>
    <MapPin size={24} />
    <Search size={20} />
    <Settings size={16} color="#ff6b6b" />
  </div>
)
```

### 2. Dynamic Icon Selection

```tsx
import { getIcon } from '@/lib/icons-index'

const DynamicIcon = ({ iconName, size = 24 }) => {
  const IconComponent = getIcon(iconName)
  return <IconComponent size={size} />
}

// Usage
<DynamicIcon iconName="mapPin" size={32} />
```

### 3. Icon Mapping Object

```tsx
import { iconMapping } from '@/lib/icons-index'

const MappedIcon = ({ iconName }) => {
  const IconComponent = iconMapping[iconName] || iconMapping.mapPin
  return <IconComponent size={24} />
}
```

## Available Icons

### Core Navigation Icons
- `MapPin` - Location/map pin
- `Search` - Search/magnifying glass
- `Settings` - Gear/cog
- `User` - User profile
- `Home` - Home
- `Menu` - Hamburger menu
- `X` - Close/X button

### Hair Salon Specific Icons
- `Scissors` - Hair cutting scissors
- `Brush` - Hair brush
- `Award` - Awards/certifications
- `Zap` - Fast service
- `Star` - Ratings/reviews
- `Calendar` - Appointments
- `Clock` - Time/scheduling
- `Phone` - Contact
- `Mail` - Email

### Business & UI Icons
- `Bell` - Notifications
- `Heart` - Favorites
- `CheckCircle` - Success/confirmation
- `AlertTriangle` - Warnings
- `Info` - Information
- `Shield` - Security/trust
- `Database` - Data/system

## Icon Props

All icons accept standard Lucide React props:

```tsx
<MapPin
  size={24}           // Size in pixels (default: 24)
  color="#ff6b6b"     // Color (default: currentColor)
  strokeWidth={2}    // Stroke width (default: 2)
  className="..."     // CSS classes
  onClick={...}      // Click handler
/>
```

## Salon-Specific Helper

```tsx
import { getSalonIcon } from '@/lib/icon-examples'

const SalonIcon = ({ iconName }) => {
  const IconComponent = getSalonIcon(iconName)
  return <IconComponent size={24} />
}

// Available salon icons: scissors, brush, award, zap, star, calendar, phone, mapPin, clock, user, mail
<SalonIcon iconName="scissors" />
```

## Migration Guide

### From Old System

**Before:**
```tsx
import * as Icons from './icons' // Old placeholder system
const icon = Icons.MapPin
```

**After:**
```tsx
import { MapPin } from '@/lib/icons-index'
const icon = MapPin
```

### From Direct Lucide Imports

**Before:**
```tsx
import { MapPin as LucideMapPin } from 'lucide-react'
```

**After:**
```tsx
import { MapPin } from '@/lib/icons-index'
```

## Best Practices

1. **Use Direct Imports** when you know the icon at build time
2. **Use `getIcon()`** for dynamic icon selection
3. **Use `getSalonIcon()`** for salon-specific icons
4. **Always provide size prop** for consistency
5. **Use semantic color names** or CSS custom properties
6. **Test icon accessibility** with screen readers

## Accessibility

Icons should be used with appropriate accessibility considerations:

```tsx
// Good: Icon with aria-label
<MapPin aria-label="Location" size={24} />

// Better: Icon with screen reader context
<button aria-label="Find location">
  <MapPin size={24} />
</button>

// Best: Icon with hidden label for screen readers
<button>
  <MapPin size={24} aria-hidden="true" />
  <span className="sr-only">Find location</span>
</button>
```

## Performance

The icon system is optimized for performance:

- **Tree shaking**: Only imported icons are included in the bundle
- **Lazy loading**: Icons are loaded only when needed
- **Caching**: Icon components are cached for reuse

## Troubleshooting

### Icon Not Found
```tsx
// Check if icon exists
import { getIcon } from '@/lib/icons-index'
console.log(getIcon('nonexistent')) // Returns HelpCircle fallback
```

### Wrong Icon Size
```tsx
// Always specify size
<MapPin size={24} /> // Good
<MapPin />          // Uses default 24px
```

### Import Errors
```tsx
// Correct import path
import { MapPin } from '@/lib/icons-index' // ✅ Correct
import { MapPin } from '@/lib/icons'       // ✅ Also works
import MapPin from '@/lib/icons'          // ❌ Wrong
```

## Contributing

When adding new icons:

1. Add to `src/lib/icons.ts`
2. Update `src/lib/icon-mapping.ts` if needed
3. Add to `src/lib/icons-index.ts` aliases
4. Update this documentation
5. Add tests in `src/__tests__/icons.test.ts`

## Testing

Run icon tests:
```bash
npm run test -- src/__tests__/icons.test.ts
```

Test coverage includes:
- Icon exports
- `getIcon()` function
- Icon mapping
- Fallback behavior
- Type checking
