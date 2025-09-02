# 🎨 ModernMen Form Builder - Complete Theme System

## ✨ Overview

The ModernMen Form Builder is a powerful, themeable form creation system that integrates seamlessly with your ModernMen CMS. It provides 5 professionally designed themes, drag-and-drop functionality, and complete customization options while maintaining your brand identity.

## 🎯 Available Themes

### 1. **ModernMen Professional** (Default)
- **Style**: Clean, professional styling with ModernMen brand colors
- **Colors**: Dark grays (#1f2937, #374151) with blue accents (#60a5fa)
- **Best For**: Business forms, contact forms, professional applications
- **Features**: Subtle shadows, rounded corners, smooth transitions

### 2. **ModernMen Elegant**
- **Style**: Sophisticated styling with refined typography and spacing
- **Colors**: Deep blues (#2d3748, #4a5568) with purple accents (#805ad5)
- **Best For**: Premium services, luxury brands, sophisticated applications
- **Features**: Enhanced spacing, refined typography, smooth animations

### 3. **ModernMen Minimal**
- **Style**: Clean, minimal design with focus on content
- **Colors**: Black and white with minimal accents
- **Best For**: Content-focused forms, simple applications, clean aesthetics
- **Features**: No shadows, clean borders, maximum readability

### 4. **ModernMen Bold**
- **Style**: High contrast, bold styling for maximum impact
- **Colors**: Black and white with orange accents (#ff6b35)
- **Best For**: High-impact forms, call-to-action forms, bold branding
- **Features**: Strong borders, bold typography, dramatic shadows

### 5. **ModernMen Warm**
- **Style**: Warm, inviting colors with comfortable spacing
- **Colors**: Earth tones (#8b4513, #a0522d) with orange accents (#ff8c00)
- **Best For**: Hospitality, personal services, warm brand experiences
- **Features**: Warm backgrounds, comfortable spacing, inviting aesthetics

## 🚀 Features

### **Theme System**
- **5 Professional Themes**: Each with unique color schemes and styling
- **Real-time Preview**: See theme changes instantly
- **CSS Variables**: Easy customization and extension
- **Responsive Design**: Works perfectly on all devices

### **Form Builder**
- **Drag & Drop**: Intuitive field arrangement
- **12 Field Types**: Text, email, textarea, select, checkbox, radio, number, date, time, url, password
- **Field Validation**: Built-in validation rules
- **Layout Options**: Full, half, third, quarter width options
- **Field Grouping**: Organize related fields together

### **Customization**
- **Field Labels**: Customizable field names and descriptions
- **Placeholders**: Custom placeholder text for all fields
- **Required Fields**: Mark fields as required with visual indicators
- **Help Text**: Add helpful information below fields
- **Submit Button**: Custom submit button text
- **Success/Error Messages**: Customize form response messages

## 🎨 Theme Customization

### **CSS Variables**
Each theme uses CSS custom properties for easy customization:

```css
:root {
  --form-primary-color: #1f2937;        /* Main brand color */
  --form-secondary-color: #374151;      /* Secondary brand color */
  --form-accent-color: #60a5fa;        /* Accent color */
  --form-success-color: #22c55e;        /* Success states */
  --form-error-color: #ef4444;          /* Error states */
  --form-warning-color: #f59e0b;        /* Warning states */
  --form-text-color: #1f2937;           /* Text color */
  --form-text-light: #6b7280;           /* Light text color */
  --form-border-color: #d1d5db;         /* Border color */
  --form-border-focus: #3b82f6;         /* Focus border color */
  --form-bg-color: #ffffff;             /* Background color */
  --form-bg-hover: #f9fafb;             /* Hover background */
  --form-input-bg: #fafafa;             /* Input background */
  --form-input-border: #a9a9a9;         /* Input border */
  --form-button-bg: #1f2937;            /* Button background */
  --form-button-hover: #111827;         /* Button hover */
  --form-button-text: #ffffff;          /* Button text */
  --form-shadow: 0 1px 3px rgba(0,0,0,0.1); /* Default shadow */
  --form-shadow-hover: 0 4px 12px rgba(0,0,0,0.15); /* Hover shadow */
  --form-radius: 0.5rem;                /* Border radius */
  --form-transition: all 0.2s ease;     /* Transition timing */
}
```

### **CSS Classes**
Each theme provides consistent CSS classes:

```css
.modernmen-form-container    /* Form wrapper */
.modernmen-form-field       /* Individual field container */
.modernmen-form-input       /* Text inputs */
.modernmen-form-textarea    /* Textarea fields */
.modernmen-form-select      /* Select dropdowns */
.modernmen-form-checkbox    /* Checkbox containers */
.modernmen-form-radio       /* Radio button containers */
.modernmen-form-button      /* Button base styles */
.modernmen-form-button-primary    /* Primary button */
.modernmen-form-button-secondary  /* Secondary button */
.modernmen-form-error       /* Error messages */
.modernmen-form-success     /* Success messages */
.modernmen-form-help        /* Help text */
.modernmen-form-group       /* Field grouping */
.modernmen-form-row         /* Row layout */
.modernmen-form-col         /* Column layout */
```

## 🔧 Implementation

### **Basic Usage**

```tsx
import { FormBuilder } from './FormBuilder';

function MyFormBuilder() {
  const handleSave = (config) => {
    console.log('Form saved:', config);
  };

  const handlePreview = (config) => {
    console.log('Form preview:', config);
  };

  return (
    <FormBuilder
      onSave={handleSave}
      onPreview={handlePreview}
    />
  );
}
```

### **With Initial Configuration**

```tsx
const initialConfig = {
  name: 'Contact Form',
  description: 'Customer contact form',
  theme: 'modernmen-elegant',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true
    }
  ],
  submitText: 'Send Message'
};

<FormBuilder
  initialConfig={initialConfig}
  onSave={handleSave}
  onPreview={handlePreview}
/>
```

### **Theme Integration**

```tsx
import { getFormTheme, getFormThemeCSS } from './formBuilderThemes';

// Get theme configuration
const theme = getFormTheme('modernmen-elegant');

// Generate CSS for theme
const themeCSS = getFormThemeCSS(theme);

// Apply theme to form
<div className="modernmen-form-builder" data-theme={theme.id}>
  {/* Form content */}
</div>
```

## 📱 Responsive Design

### **Mobile Optimization**
- Responsive field layouts
- Touch-friendly buttons and inputs
- Optimized spacing for small screens
- Mobile-first design approach

### **Breakpoint System**
```css
@media (max-width: 768px) {
  .modernmen-form-builder {
    padding: 1rem;
  }
  
  .modernmen-form-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .modernmen-form-col {
    width: 100%;
  }
}
```

## 🎯 Field Types

### **Text Inputs**
- **text**: Single line text input
- **email**: Email address with validation
- **tel**: Phone number input
- **url**: Website URL input
- **password**: Secure password input
- **number**: Numeric input with min/max
- **date**: Date picker
- **time**: Time picker

### **Multi-line Inputs**
- **textarea**: Multi-line text input
- **select**: Dropdown selection
- **checkbox**: Multiple choice checkboxes
- **radio**: Single choice radio buttons

### **Field Properties**
```typescript
interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  help?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  layout?: {
    width?: 'full' | 'half' | 'third' | 'quarter';
    group?: string;
  };
}
```

## 🎨 Custom Theme Creation

### **Creating a New Theme**

```typescript
export const myCustomTheme: FormBuilderTheme = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  description: 'A custom theme for my brand',
  cssVariables: {
    '--form-primary-color': '#your-color',
    '--form-secondary-color': '#your-secondary',
    // ... other variables
  },
  cssClasses: {
    'form-container': 'my-form-container',
    'form-field': 'my-form-field',
    // ... other classes
  }
};
```

### **Adding to Theme System**

```typescript
// Add to themes array
export const formBuilderThemes: FormBuilderTheme[] = [
  modernmenProfessional,
  modernmenElegant,
  modernmenMinimal,
  modernmenBold,
  modernmenWarm,
  myCustomTheme  // Add your custom theme
];
```

## 🔒 Security & Validation

### **Built-in Validation**
- Required field validation
- Email format validation
- URL format validation
- Number range validation
- Custom pattern validation

### **Security Features**
- XSS protection
- CSRF protection
- Input sanitization
- Secure form submission

## 📊 Performance

### **Optimization Features**
- Lazy loading of theme assets
- Efficient CSS variable usage
- Minimal JavaScript footprint
- Optimized rendering
- Memory-efficient state management

### **Best Practices**
- Use theme CSS variables for consistency
- Minimize custom CSS overrides
- Leverage built-in responsive classes
- Use appropriate field types for data

## 🚀 Advanced Features

### **Form Templates**
- Pre-built form templates
- Industry-specific layouts
- Custom template creation
- Template sharing and export

### **Integration Options**
- API endpoint configuration
- Email service integration
- Database storage options
- Third-party service hooks

### **Analytics & Tracking**
- Form submission tracking
- Field completion analytics
- User behavior insights
- Conversion optimization

## 📚 API Reference

### **FormBuilder Component Props**
```typescript
interface FormBuilderProps {
  initialConfig?: Partial<FormConfig>;
  onSave?: (config: FormConfig) => void;
  onPreview?: (config: FormConfig) => void;
  isPreview?: boolean;
}
```

### **FormConfig Interface**
```typescript
interface FormConfig {
  id: string;
  name: string;
  description?: string;
  theme: string;
  fields: FormField[];
  submitText?: string;
  successMessage?: string;
  errorMessage?: string;
  redirectUrl?: string;
}
```

### **Theme Utilities**
```typescript
// Get theme by ID
getFormTheme(themeId: string): FormBuilderTheme

// Generate CSS for theme
getFormThemeCSS(theme: FormBuilderTheme): string

// Get default theme
defaultFormTheme: FormBuilderTheme

// All available themes
formBuilderThemes: FormBuilderTheme[]
```

## 🎯 Getting Started

### **1. Install Dependencies**
```bash
npm install @modernmen/form-builder
```

### **2. Import Components**
```tsx
import { FormBuilder } from '@modernmen/form-builder';
import '@modernmen/form-builder/styles.css';
```

### **3. Basic Implementation**
```tsx
function App() {
  return (
    <div className="app">
      <FormBuilder
        onSave={(config) => console.log('Saved:', config)}
        onPreview={(config) => console.log('Preview:', config)}
      />
    </div>
  );
}
```

### **4. Customize Theme**
```tsx
// Use a specific theme
<FormBuilder
  initialConfig={{ theme: 'modernmen-elegant' }}
  onSave={handleSave}
/>
```

## 🔧 Troubleshooting

### **Common Issues**

**Theme not applying?**
- Check that `data-theme` attribute is set correctly
- Verify CSS file is loaded
- Ensure theme ID matches available themes

**Fields not rendering?**
- Check field configuration object
- Verify field type is supported
- Ensure required properties are set

**Styling issues?**
- Check CSS variable values
- Verify theme CSS is loaded
- Check for CSS conflicts

### **Debug Mode**
```tsx
// Enable debug logging
<FormBuilder
  debug={true}
  onSave={handleSave}
/>
```

## 📈 Future Enhancements

### **Planned Features**
- **Advanced Field Types**: File uploads, signature fields, rating systems
- **Conditional Logic**: Show/hide fields based on user input
- **Multi-step Forms**: Wizard-style form progression
- **Real-time Validation**: Instant feedback on field input
- **Form Analytics**: Detailed submission and user behavior data
- **Template Library**: Pre-built form templates for common use cases
- **Export Options**: PDF, CSV, and other export formats
- **Integration Hub**: Connect with popular services and platforms

### **Customization Options**
- **Custom Field Types**: Create your own field components
- **Advanced Theming**: CSS-in-JS support, dynamic themes
- **Plugin System**: Extend functionality with custom plugins
- **API Extensions**: Custom validation and submission logic

---

**ModernMen Form Builder provides a complete, professional form creation solution with 5 beautiful themes, drag-and-drop functionality, and extensive customization options. Perfect for creating branded forms that match your salon's professional image!** 🎨✨
