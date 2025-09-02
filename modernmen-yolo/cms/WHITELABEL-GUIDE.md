# Payload CMS Whitelabel System

This Payload CMS setup has been designed to be completely brand-agnostic and easily customizable for any business type. The system supports environment-based configuration and dynamic branding.

## Quick Start

1. Copy `.env.example` to `.env`
2. Configure your brand settings in `.env`
3. Restart the CMS server
4. Your branded admin interface will be ready!

## Core Features

### ✅ Complete Brand Independence
- No hardcoded business names or branding
- Environment-driven configuration
- Dynamic admin UI theming
- Customizable logos and colors

### ✅ Multi-Business Support
- Hair salons, beauty studios, law firms, restaurants, etc.
- Industry-agnostic data models
- Flexible service/product management
- Universal customer/client management

### ✅ Environment-Aware Styling
- Development: Blue theme
- Staging: Amber theme  
- Production: Green theme
- Custom brand themes supported

## Environment Configuration

### Required Variables

```bash
# Core Payload Settings
PAYLOAD_SECRET=your-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
MONGODB_URI=mongodb://localhost:27017/your-business-cms

# Brand Identity
BRAND_NAME=Your Business Name
DEFAULT_BUSINESS_NAME=Your Business Name
DEFAULT_BUSINESS_TAGLINE=Your business tagline
```

### Brand-Specific Examples

#### Hair Salon Configuration
```bash
BRAND_NAME=Modern Men Hair Salon
DEFAULT_BUSINESS_NAME=Modern Men Hair Salon
DEFAULT_BUSINESS_TAGLINE=Premium grooming services for the modern gentleman
DEFAULT_META_DESCRIPTION=Experience premium grooming services at Modern Men Hair Salon.
DEFAULT_KEYWORDS=hair salon, barber, grooming, haircuts, beard grooming
BRAND_THEME=modernmen
```

#### Law Firm Configuration  
```bash
BRAND_NAME=Smith & Associates Law
DEFAULT_BUSINESS_NAME=Smith & Associates Law Firm
DEFAULT_BUSINESS_TAGLINE=Professional legal services you can trust
DEFAULT_META_DESCRIPTION=Smith & Associates provides comprehensive legal services.
DEFAULT_KEYWORDS=law firm, legal services, attorney, lawyer, consultation
BRAND_THEME=generic
```

#### Restaurant Configuration
```bash
BRAND_NAME=Bella's Italian Kitchen  
DEFAULT_BUSINESS_NAME=Bella's Italian Kitchen
DEFAULT_BUSINESS_TAGLINE=Authentic Italian cuisine in the heart of downtown
DEFAULT_META_DESCRIPTION=Experience authentic Italian flavors at Bella's Kitchen.
DEFAULT_KEYWORDS=italian restaurant, authentic cuisine, pizza, pasta, dining
BRAND_THEME=generic
```

## Visual Customization

### Logo Customization

The system uses CSS custom properties for flexible logo management:

```css
/* Set custom logos via CSS variables */
:root {
  --custom-login-logo: url('path/to/your-login-logo.svg');
  --custom-header-logo: url('path/to/your-header-logo.svg');
  --custom-primary-color: #your-brand-color;
}
```

### Brand-Specific CSS

Add brand-specific styling in `src/admin/customAdminStyles.css`:

```css
[data-brand="your-brand-name"] {
  --custom-login-logo: url('your-logo.svg');
  --custom-primary-color: #your-color;
  --custom-brand-text: 'Your Brand Name';
}
```

### Environment-Based Theming

The admin UI automatically adapts colors based on environment:

- **Development**: Blue (#3b82f6) - Easy identification of dev environment
- **Staging**: Amber (#f59e0b) - Warning color for staging
- **Production**: Green (#10b981) - Professional production color

## Collection Customization

### Universal Data Models

All collections are designed to be business-agnostic:

- **Customers/Clients**: Universal customer management
- **Services/Products**: Flexible service/product catalog  
- **Staff/Team**: Employee/team member management
- **Appointments/Bookings**: Universal scheduling system
- **Reviews**: Customer feedback system

### Customizing Field Labels

Collections can be easily customized by modifying the admin display:

```typescript
// Example: Customizing for a law firm
export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'caseType', 'retainerStatus'],
    group: 'Clients', // Changed from 'Customers' to 'Clients'
  },
  // ... rest of config
};
```

## Deployment Configurations

### Multi-Tenant Setup

For multiple business deployments:

```bash
# Business A Environment
BRAND_NAME=Business A
DB_NAME=business-a-cms
PAYLOAD_PUBLIC_SERVER_URL=https://business-a-admin.com

# Business B Environment  
BRAND_NAME=Business B
DB_NAME=business-b-cms
PAYLOAD_PUBLIC_SERVER_URL=https://business-b-admin.com
```

### White-Label SaaS Configuration

For SaaS deployments with dynamic tenant switching:

```typescript
// Dynamic configuration based on subdomain/domain
const getBrandConfig = (domain: string) => {
  const brandConfigs = {
    'modernmen.com': {
      brandName: 'Modern Men Hair Salon',
      theme: 'modernmen',
      primaryColor: '#1f2937'
    },
    'bellabeauty.com': {
      brandName: 'Bella Beauty Studio', 
      theme: 'generic',
      primaryColor: '#ec4899'
    }
  };
  
  return brandConfigs[domain] || brandConfigs.default;
};
```

## Advanced Customizations

### Custom Icons

Replace the generic business icons with industry-specific ones:

```typescript
// In src/admin/customIcons.ts
const RestaurantIcons = {
  Customers: () => <ChefHatIcon />,
  Services: () => <MenuIcon />,
  Staff: () => <CookIcon />,
  // ... custom restaurant-specific icons
};
```

### Industry-Specific Fields

Add industry-specific fields to collections:

```typescript
// Example: Restaurant-specific customer fields
{
  name: 'dietaryRestrictions',
  type: 'select', 
  hasMany: true,
  options: [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-Free', value: 'gluten-free' },
    { label: 'Nut Allergy', value: 'nut-allergy' },
  ],
}
```

### Custom Admin Components

Create industry-specific admin components:

```typescript
// Custom dashboard for restaurants
import RestaurantDashboard from '../components/admin/RestaurantDashboard';

// In payload.config.ts
admin: {
  components: {
    views: {
      Dashboard: RestaurantDashboard,
    },
  },
}
```

## Business Type Templates

### Hair Salon/Barber Shop
- Collections: Customers, Services, Staff, Appointments, Gallery
- Key Features: Service packages, staff specialties, before/after photos
- Integrations: Online booking, SMS reminders, loyalty program

### Law Firm
- Collections: Clients, Cases, Staff, Documents, Billing
- Key Features: Case management, document storage, time tracking
- Integrations: Legal document templates, billing systems

### Restaurant
- Collections: Customers, Menu Items, Staff, Reservations, Orders
- Key Features: Menu management, table reservations, delivery tracking
- Integrations: POS systems, delivery platforms, inventory management

### Medical Practice
- Collections: Patients, Appointments, Staff, Medical Records
- Key Features: HIPAA compliance, appointment scheduling, patient portal
- Integrations: EHR systems, insurance verification, telemedicine

## Migration from Branded Version

If migrating from a branded version (like ModernMen):

1. **Update imports**: Change from `ModernMen/types` to `payload/types`
2. **Update environment variables**: Use new whitelabel variable names
3. **Update branding**: Replace hardcoded brand references
4. **Test configurations**: Verify all customizations work with new system

## Troubleshooting

### Common Issues

**Logo not displaying**: Check CSS custom property syntax and file paths
**Environment variables not loading**: Ensure `.env` file is in root directory  
**Brand theme not applying**: Verify `BRAND_THEME` environment variable
**Database connection issues**: Check `MONGODB_URI` and database permissions

### Debug Mode

Enable debug logging:

```bash
DEBUG=payload:* npm run dev
```

## Support and Customization

This whitelabel system is designed to be flexible and extensible. For specific industry requirements or advanced customizations, the modular architecture allows for easy extension without breaking core functionality.

### Adding New Business Types

1. Create industry-specific icon set
2. Add business-specific fields to existing collections  
3. Create custom admin components if needed
4. Add brand theme in CSS
5. Document configuration in this guide

The system is built to scale from single business deployments to multi-tenant SaaS platforms while maintaining complete brand independence and professional appearance.