# 🤝 Contributing Guide - Modern Men Hair Salon

Welcome to the Modern Men Hair Salon project! We're excited to have you contribute to our mission of transforming salon management. This guide will help you get started with contributing to the codebase.

## 🎯 Ways to Contribute

### Code Contributions
- **🐛 Bug Fixes** - Fix issues and improve stability
- **✨ New Features** - Add functionality and enhancements
- **🔧 Improvements** - Optimize performance and user experience
- **📚 Documentation** - Improve guides and documentation

### Non-Code Contributions
- **🎨 Design** - UI/UX improvements and design systems
- **🧪 Testing** - Write and maintain test suites
- **📖 Documentation** - Create and update documentation
- **🌐 Translation** - Help with internationalization
- **📢 Community** - Help other users and contributors

## 🚀 Getting Started

### Prerequisites
```bash
# Required software
Node.js 18+              # JavaScript runtime
pnpm 8+                  # Package manager
Git                      # Version control
VS Code                  # Recommended editor
PostgreSQL               # Database (local or cloud)
```

### Development Setup
```bash
# 1. Fork the repository
# Click "Fork" button on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/modernmen-hair-BarberShop.git
cd modernmen-hair-BarberShop

# 3. Set up upstream remote
git remote add upstream https://github.com/modernmen/modernmen-hair-BarberShop.git

# 4. Install dependencies
pnpm install

# 5. Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# 6. Set up database
pnpm run db:migrate
pnpm run db:seed

# 7. Start development
pnpm run dev:all
```

### Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make your changes
# Write code, tests, and documentation

# 3. Run quality checks
pnpm run lint
pnpm run type-check
pnpm run test

# 4. Commit your changes
git add .
git commit -m "feat: add your feature description"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Create Pull Request
# Go to GitHub and create PR from your branch
```

## 📋 Development Standards

### Code Style
```typescript
// ✅ Good: Consistent formatting and naming
interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export function createUser(userData: CreateUserInput): Promise<User> {
  // Implementation
}

// ❌ Bad: Inconsistent formatting
interface User{id:string;name:string;email:string;role:UserRole}
export function createUser(userData:CreateUserInput):Promise<User>{/*code*/}
```

### Commit Messages
```bash
# Format: type(scope): description
git commit -m "feat(auth): add Google OAuth login"
git commit -m "fix(booking): resolve timezone bug"
git commit -m "docs(api): update authentication guide"
git commit -m "test(appointments): add integration tests"
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code style changes
- **refactor**: Code refactoring
- **test**: Testing
- **chore**: Maintenance

## 🧪 Testing Guidelines

### Test Structure
```typescript
// Unit tests in __tests__/unit/
describe('UserService', () => {
  it('should create user successfully', async () => {
    // Test implementation
  })

  it('should validate user input', async () => {
    // Test implementation
  })
})

// Integration tests in __tests__/integration/
describe('Booking Flow', () => {
  it('should complete full booking process', async () => {
    // Test implementation
  })
})

// E2E tests in __tests__/e2e/
describe('User Journey', () => {
  it('should allow user to book appointment', async () => {
    // Test implementation
  })
})
```

### Testing Commands
```bash
# Run all tests
pnpm run test

# Run specific test types
pnpm run test:unit
pnpm run test:integration
pnpm run test:e2e

# Run with coverage
pnpm run test:coverage

# Run tests in watch mode
pnpm run test:watch

# Run specific test file
pnpm run test -- userService.test.ts
```

### Test Coverage Requirements
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

## 🎨 Design Guidelines

### UI Components
```typescript
// Component structure
interface ButtonProps {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Click handler */
  onClick?: () => void
  /** Button content */
  children: React.ReactNode
  /** Additional classes */
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  className
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### Color Palette
```css
/* Primary colors */
--primary: 222 47% 11%     /* Dark blue */
--primary-foreground: 0 0% 100%  /* White */

/* Secondary colors */
--secondary: 210 40% 96%   /* Light gray */
--secondary-foreground: 222 47% 11%  /* Dark blue */

/* Status colors */
--success: 142 76% 36%     /* Green */
--error: 0 84% 60%         /* Red */
--warning: 38 92% 50%      /* Orange */
```

### Typography Scale
```css
/* Font sizes */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem   /* 30px */
--text-4xl: 2.25rem    /* 36px */
```

## 🔧 API Guidelines

### REST API Design
```typescript
// GET /api/users - List users
export async function GET(request: NextRequest) {
  try {
    const users = await getUsers()
    return NextResponse.json({
      success: true,
      data: users,
      meta: { /* pagination info */ }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch users'
    }, { status: 500 })
  }
}

// POST /api/users - Create user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const user = await createUser(body)
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    }, { status: 201 })
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: error.errors
      }, { status: 400 })
    }
    // Handle other errors
  }
}
```

### Error Handling
```typescript
// Consistent error responses
const errorCodes = {
  VALIDATION_ERROR: 'Invalid input data',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Insufficient permissions',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource conflict',
  INTERNAL_ERROR: 'Internal server error'
} as const

export function createErrorResponse(
  code: keyof typeof errorCodes,
  message?: string,
  status = 500
) {
  return NextResponse.json({
    success: false,
    error: code,
    message: message || errorCodes[code]
  }, { status })
}
```

## 📱 Mobile Responsiveness

### Breakpoints
```css
/* Mobile-first approach */
--breakpoint-sm: 640px   /* Small devices */
--breakpoint-md: 768px   /* Medium devices */
--breakpoint-lg: 1024px  /* Large devices */
--breakpoint-xl: 1280px  /* Extra large devices */
```

### Responsive Components
```typescript
export function ResponsiveCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      w-full                    /* Mobile: full width */
      sm:w-1/2 sm:mr-4         /* Small+: half width with margin */
      lg:w-1/3                 /* Large: third width */
      xl:w-1/4                 /* Extra large: quarter width */
    ">
      {children}
    </div>
  )
}
```

## 🔒 Security Guidelines

### Authentication
```typescript
// Secure password validation
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character')
```

### Input Validation
```typescript
// Sanitize user input
import DOMPurify from 'dompurify'

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],  // No HTML tags allowed
    ALLOWED_ATTR: []   // No attributes allowed
  })
}
```

### Rate Limiting
```typescript
// API rate limiting
export async function rateLimit(
  identifier: string,
  limit = 100,
  window = 60 * 1000 // 1 minute
) {
  // Implementation using Redis or Upstash
}
```

## 📊 Performance Guidelines

### Code Splitting
```typescript
// Dynamic imports for large components
const AdminDashboard = dynamic(
  () => import('@/components/admin/Dashboard'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
)

// Route-based splitting
const BookingPage = dynamic(() => import('@/app/booking/page'))
```

### Database Optimization
```sql
-- Use indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_appointments_date_status
ON appointments (appointment_date, status);

CREATE INDEX CONCURRENTLY idx_appointments_customer
ON appointments (customer_id);

-- Use EXPLAIN to analyze queries
EXPLAIN ANALYZE SELECT * FROM appointments
WHERE customer_id = $1 AND date >= $2;
```

### Image Optimization
```typescript
// Next.js Image component
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
```

## 📚 Documentation Standards

### Code Documentation
```typescript
/**
 * Creates a new user account
 * @param userData - User registration data
 * @returns Promise<User> - Created user object
 * @throws {ValidationError} When input data is invalid
 * @throws {ConflictError} When email already exists
 * @example
 * ```typescript
 * const user = await createUser({
 *   email: 'john@example.com',
 *   name: 'John Doe',
 *   password: 'securePass123!'
 * })
 * ```
 */
export async function createUser(userData: CreateUserInput): Promise<User> {
  // Implementation
}
```

### Component Documentation
```typescript
interface BookingFormProps {
  /** Initial form values */
  initialValues?: Partial<BookingFormData>
  /** Callback when booking is submitted */
  onSubmit?: (data: BookingFormData) => void
  /** Whether the form is in loading state */
  loading?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Booking form component for scheduling appointments
 *
 * @example
 * ```tsx
 * <BookingForm
 *   initialValues={{ serviceId: 'haircut' }}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export function BookingForm({
  initialValues,
  onSubmit,
  loading = false,
  className
}: BookingFormProps) {
  // Implementation
}
```

## 🧪 Pull Request Process

### Before Submitting
```bash
# 1. Update your fork
git fetch upstream
git rebase upstream/main

# 2. Run quality checks
pnpm run lint
pnpm run type-check
pnpm run test
pnpm run build

# 3. Update documentation if needed
# Edit relevant docs in /docs folder

# 4. Test your changes
pnpm run dev
# Manual testing of new features
```

### Creating a Pull Request
1. **Title**: Use conventional commit format
   ```
   feat: add Google OAuth integration
   fix: resolve booking timezone bug
   docs: update API documentation
   ```

2. **Description**: Include detailed information
   ```
   ## What does this PR do?
   - Adds Google OAuth login functionality
   - Updates authentication flow

   ## How was this tested?
   - Unit tests for OAuth service
   - Integration tests for login flow
   - Manual testing with Google accounts

   ## Screenshots (if applicable)
   [Attach screenshots of UI changes]

   ## Related Issues
   Closes #123
   ```

3. **Checklist**:
   - [ ] Tests pass
   - [ ] Code is linted
   - [ ] Types are checked
   - [ ] Documentation updated
   - [ ] Breaking changes documented

### After Submitting
- **Address Review Comments**: Make requested changes
- **Rebase if Needed**: Keep PR up to date with main branch
- **Test in Staging**: Verify changes work in staging environment
- **Merge**: Use "Squash and merge" for clean history

## 🎯 Branching Strategy

### Branch Naming
```bash
# Feature branches
feature/add-google-oauth
feature/booking-calendar
feature/payment-integration

# Bug fix branches
fix/booking-timezone-bug
fix/email-template-error
fix/mobile-layout-issue

# Documentation branches
docs/api-reference
docs/setup-guide
docs/troubleshooting

# Release branches
release/v1.2.0
hotfix/security-patch
```

### Branch Workflow
```bash
# Start from main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/new-feature

# Make commits
git commit -m "feat: implement new feature"
git commit -m "test: add tests for new feature"

# Push to your fork
git push origin feature/new-feature

# Create PR and get it merged
# Delete branch after merge
git branch -d feature/new-feature
```

## 🏷️ Issue Management

### Issue Labels
- **bug**: Something isn't working
- **enhancement**: New feature or improvement
- **documentation**: Documentation needed
- **good first issue**: Good for newcomers
- **help wanted**: Community contribution welcome
- **priority-high**: High priority issue
- **priority-low**: Low priority issue

### Issue Templates
When creating issues, use these templates:
- **Bug Report**: For reporting bugs
- **Feature Request**: For requesting new features
- **Documentation**: For documentation issues
- **Question**: For general questions

## 📈 Code Review Guidelines

### Reviewer Checklist
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Breaking changes documented

### Review Comments
```markdown
<!-- Good feedback -->
✅ Great use of TypeScript generics here!
✅ Tests cover edge cases well
✅ Documentation is clear and helpful

<!-- Constructive feedback -->
🤔 Consider using a more descriptive variable name
💡 This could be optimized with memoization
🔒 Add input validation for security
```

## 🎉 Recognition

### Contributor Recognition
- **Contributors**: Listed in CONTRIBUTORS.md
- **Top Contributors**: Featured in README
- **Hall of Fame**: Outstanding contributions highlighted
- **Swag**: Digital badges and recognition

### Monthly Recognition
- **Most Valuable Contributor**: Based on impact and quality
- **Rising Star**: New contributor with great potential
- **Community Champion**: Exceptional community support

## 📞 Getting Help

### Community Resources
- **GitHub Discussions**: Ask questions and get help
- **Discord Server**: Real-time chat with community
- **Stack Overflow**: Tag questions with `modernmen-hair-salon`
- **Twitter**: Follow [@ModernMenDev](https://twitter.com/ModernMenDev)

### Professional Support
- **Enterprise Support**: Priority support for organizations
- **Consulting Services**: Custom development and integration
- **Training**: Workshops and onboarding sessions
- **Documentation**: Comprehensive guides and tutorials

## 📋 Code of Conduct

### Our Standards
- **Respect**: Be respectful to all contributors
- **Inclusivity**: Welcome people from all backgrounds
- **Collaboration**: Work together constructively
- **Quality**: Maintain high standards in all contributions
- **Transparency**: Be open and honest in communications

### Reporting Issues
- **Contact**: conduct@modernmen.com
- **Anonymous**: Anonymous reporting available
- **Confidential**: All reports handled confidentially
- **Action**: Swift action on valid reports

---

## 🚀 Let's Build Together!

We're excited to have you join our community of contributors. Whether you're fixing bugs, adding features, improving documentation, or helping other users, your contributions make a real difference.

**Ready to contribute?** Check out our [issue tracker](https://github.com/modernmen/issues) to find something to work on, or create your own feature request.

*Happy coding! 🎉*

---

**🎯 Quick Links:**
- [📖 Documentation](README.md)
- [🐛 Issue Tracker](https://github.com/modernmen/issues)
- [💬 Discord Community](https://discord.gg/modernmen)
- [📧 Support](mailto:support@modernmen.com)
