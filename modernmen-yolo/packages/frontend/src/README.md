# Project Organization Guide

This document outlines the organized structure of the codebase for better maintainability, scalability, and developer experience.

## 📁 Folder Structure

```
src/
├── app/                    # Next.js app directory
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── index.ts       # Organized exports by category
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
│   ├── index.ts          # Hook exports
│   ├── use-builder.ts
│   ├── use-component-selection.ts
│   └── use-notifications.ts
├── services/             # Data services and API clients
│   ├── index.ts         # Service exports
│   ├── appointments.ts
│   ├── stats.ts
│   └── notifications.ts
├── lib/                  # Utility libraries
│   ├── index.ts         # Library exports
│   ├── utils.ts
│   ├── error-handling.ts
│   └── builder/
├── types/                # TypeScript type definitions
│   ├── index.ts         # Type exports
│   ├── common.ts
│   ├── dashboard.ts
│   └── builder.ts
├── data/                 # Mock data and data utilities
│   ├── index.ts         # Data exports
│   ├── mock-stats.ts
│   ├── mock-appointments.ts
│   └── mock-notifications.ts
├── config/               # Configuration management
│   ├── index.ts         # Config exports
└── constants/            # Application constants
    ├── index.ts         # Constants exports
```

## 🏗️ Architecture Principles

### 1. Separation of Concerns
- **Components**: Pure UI rendering
- **Hooks**: State management and side effects
- **Services**: Data fetching and API calls
- **Utils**: Pure utility functions
- **Types**: TypeScript definitions
- **Constants**: Application-wide constants

### 2. Single Responsibility
- Each file has one clear purpose
- Large files are split into focused modules
- Components are broken down into smaller, reusable pieces

### 3. Easy Imports/Exports
- Centralized index files for each major directory
- Organized exports by category
- Clear naming conventions

## 📦 Import/Export Patterns

### Centralized Exports
```typescript
// Instead of individual imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Use organized imports
import { Button, Input } from '@/components/ui'
```

### Category-Based Organization
```typescript
// UI components organized by purpose
import {
  // Form components
  Button, Input, Textarea, Checkbox,
  // Layout components
  Card, Badge, Separator,
  // Data display
  DataTable, Progress,
  // Custom components
  NotificationCenter, StatsCard
} from '@/components/ui'
```

### Service Layer Pattern
```typescript
// Clean service usage
import { appointmentsService, statsService } from '@/services'

const appointments = await appointmentsService.getAppointments()
const stats = await statsService.getDashboardStats()
```

## 🔧 Development Guidelines

### 1. Adding New Components
1. Place in appropriate `components/ui/` subdirectory
2. Export from `components/ui/index.ts` in the correct category
3. Add TypeScript types to `types/` directory
4. Create tests in `__tests__/` directory

### 2. Adding New Services
1. Create service file in `services/` directory
2. Export from `services/index.ts`
3. Use consistent error handling with `handleApiError`
4. Add TypeScript types to `types/` directory

### 3. Adding New Hooks
1. Create hook file in `hooks/` directory
2. Export from `hooks/index.ts`
3. Follow naming convention: `use[Feature]`
4. Include proper TypeScript types

### 4. Adding New Types
1. Add to appropriate `types/` file or create new one
2. Export from `types/index.ts`
3. Use consistent naming conventions
4. Document complex types with JSDoc

## 🚀 Benefits

### For Developers
- **Faster Development**: Clear structure reduces decision fatigue
- **Better DX**: Easy imports and organized code
- **Type Safety**: Centralized types prevent inconsistencies
- **Maintainability**: Single responsibility makes changes easier

### For the Project
- **Scalability**: Organized structure supports growth
- **Consistency**: Standardized patterns across codebase
- **Reusability**: Modular components and services
- **Testing**: Clear separation makes testing easier

## 📋 File Organization Checklist

- [x] Folder structure created
- [x] Mock data extracted
- [x] Large files split into modules
- [x] Types centralized
- [x] Service layer implemented
- [x] Error handling standardized
- [x] UI exports organized
- [x] Configuration management added
- [x] Index files created for easy imports
- [x] Documentation updated

## 🔄 Maintenance

When adding new features:
1. Follow the established patterns
2. Update relevant index files
3. Add proper TypeScript types
4. Update this documentation if needed
5. Ensure consistent error handling

This organization provides a solid foundation for scalable development and maintains high code quality standards.
