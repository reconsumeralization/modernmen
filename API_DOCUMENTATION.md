# 🚀 **MODERN MEN HAIR SALON - COMPLETE API DOCUMENTATION**

## **📊 API Overview**

### **Base Configuration**
- **CMS**: Payload CMS v2.x
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Authentication**: JWT + NextAuth.js
- **Base URL**: `/api` (Frontend) | `/api/v1` (Backend)

---

## **🔐 AUTHENTICATION ENDPOINTS**

### **NextAuth.js Integration**
```typescript
// Authentication Routes (Handled by NextAuth.js)
POST   /api/auth/signin              # Sign in with credentials
POST   /api/auth/signout             # Sign out user
GET    /api/auth/session             # Get current session
GET    /api/auth/providers           # Get available providers

// OAuth Providers
POST   /api/auth/signin/google       # Google OAuth
POST   /api/auth/signin/github       # GitHub OAuth
POST   /api/auth/signin/facebook     # Facebook OAuth
```

### **Custom Auth Endpoints**
```typescript
POST   /api/auth/register            # User registration
POST   /api/auth/forgot-password     # Password reset request
POST   /api/auth/reset-password      # Password reset confirmation
POST   /api/auth/verify-email        # Email verification
POST   /api/auth/refresh-token       # Token refresh
```

---

## **👥 USER MANAGEMENT API**

### **Users Collection**
```typescript
# CRUD Operations
GET    /api/users                   # List users (Admin only)
GET    /api/users/:id               # Get user by ID
POST   /api/users                   # Create user (Admin only)
PUT    /api/users/:id               # Update user
DELETE /api/users/:id               # Delete user (Admin only)

# User Profile
GET    /api/users/me                # Get current user profile
PUT    /api/users/me                # Update current user profile
PUT    /api/users/me/preferences    # Update user preferences

# User Roles & Permissions
GET    /api/users/roles             # Get available roles
PUT    /api/users/:id/role          # Update user role (Admin only)
```

### **User Fields**
```json
{
  "id": "string",
  "email": "string (required)",
  "name": "string",
  "role": "admin|customer|staff|manager|barber|client",
  "tenant": "relationship",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## **🏢 TENANT MANAGEMENT API**

### **Tenants Collection**
```typescript
GET    /api/tenants                 # List tenants (Admin only)
GET    /api/tenants/:id             # Get tenant by ID
POST   /api/tenants                 # Create tenant (Admin only)
PUT    /api/tenants/:id             # Update tenant
DELETE /api/tenants/:id             # Delete tenant (Admin only)

# Tenant Settings
GET    /api/tenants/:id/settings    # Get tenant settings
PUT    /api/tenants/:id/settings    # Update tenant settings
```

### **Tenant Fields**
```json
{
  "id": "string",
  "name": "string (required)",
  "email": "string (required)",
  "status": "active|suspended|pending|deactivated",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## **📝 CONTENT MANAGEMENT API**

### **Pages Collection**
```typescript
GET    /api/pages                   # List pages
GET    /api/pages/:id               # Get page by ID
GET    /api/pages?slug=:slug        # Get page by slug
POST   /api/pages                   # Create page (Editor+)
PUT    /api/pages/:id               # Update page
DELETE /api/pages/:id               # Delete page (Editor+)

# Page Revisions
GET    /api/pages/:id/revisions     # Get page revisions
POST   /api/pages/:id/revisions     # Create page revision
PUT    /api/pages/:id/publish       # Publish page
```

### **Posts Collection**
```typescript
GET    /api/posts                   # List posts
GET    /api/posts/:id               # Get post by ID
GET    /api/posts?category=:cat     # Get posts by category
GET    /api/posts?author=:id        # Get posts by author
POST   /api/posts                   # Create post (Editor+)
PUT    /api/posts/:id               # Update post
DELETE /api/posts/:id               # Delete post (Editor+)

# Post Meta
GET    /api/posts/:id/meta          # Get post metadata
PUT    /api/posts/:id/meta          # Update post metadata
```

### **Projects Collection**
```typescript
GET    /api/projects                # List projects
GET    /api/projects/:id            # Get project by ID
GET    /api/projects?category=:cat  # Get projects by category
POST   /api/projects                # Create project (Editor+)
PUT    /api/projects/:id            # Update project
DELETE /api/projects/:id            # Delete project (Editor+)
```

---

## **👤 CUSTOMER RELATIONSHIP MANAGEMENT (CRM) API**

### **Customers Collection**
```typescript
GET    /api/customers               # List customers (Staff+)
GET    /api/customers/:id           # Get customer by ID
GET    /api/customers?email=:email  # Search by email
POST   /api/customers               # Create customer
PUT    /api/customers/:id           # Update customer
DELETE /api/customers/:id           # Delete customer (Admin only)

# Customer History
GET    /api/customers/:id/history   # Get customer history
GET    /api/customers/:id/loyalty   # Get loyalty points
PUT    /api/customers/:id/loyalty   # Update loyalty points
```

### **Appointments Collection**
```typescript
GET    /api/appointments            # List appointments
GET    /api/appointments/:id        # Get appointment by ID
GET    /api/appointments?date=:date # Get appointments by date
GET    /api/appointments?stylist=:id # Get appointments by stylist
POST   /api/appointments            # Create appointment
PUT    /api/appointments/:id        # Update appointment
PUT    /api/appointments/:id/cancel # Cancel appointment
DELETE /api/appointments/:id        # Delete appointment (Admin only)

# Appointment Actions
PUT    /api/appointments/:id/checkin    # Check-in appointment
PUT    /api/appointments/:id/complete   # Complete appointment
PUT    /api/appointments/:id/reschedule # Reschedule appointment
```

### **Services Collection**
```typescript
GET    /api/services                # List services
GET    /api/services/:id            # Get service by ID
GET    /api/services?category=:cat  # Get services by category
POST   /api/services                # Create service (Manager+)
PUT    /api/services/:id            # Update service
DELETE /api/services/:id            # Delete service (Manager+)

# Service Analytics
GET    /api/services/:id/analytics  # Get service analytics
GET    /api/services/popular        # Get popular services
```

---

## **✂️ STAFF MANAGEMENT API**

### **Stylists Collection**
```typescript
GET    /api/stylists                # List stylists
GET    /api/stylists/:id            # Get stylist by ID
GET    /api/stylists?specialty=:spec # Get stylists by specialty
POST   /api/stylists                # Create stylist (Manager+)
PUT    /api/stylists/:id            # Update stylist
DELETE /api/stylists/:id            # Delete stylist (Manager+)

# Stylist Schedule
GET    /api/stylists/:id/schedule   # Get stylist schedule
PUT    /api/stylists/:id/schedule   # Update stylist schedule
GET    /api/stylists/:id/availability # Get stylist availability
```

### **Employees Collection**
```typescript
GET    /api/employees               # List employees (Manager+)
GET    /api/employees/:id           # Get employee by ID
POST   /api/employees               # Create employee (Manager+)
PUT    /api/employees/:id           # Update employee
DELETE /api/employees/:id           # Delete employee (Manager+)

# Employee Management
GET    /api/employees/:id/schedule  # Get employee schedule
PUT    /api/employees/:id/schedule  # Update employee schedule
GET    /api/employees/:id/performance # Get employee performance
```

### **Time Clock Collection**
```typescript
GET    /api/time-clock              # List time entries
GET    /api/time-clock/:id          # Get time entry by ID
POST   /api/time-clock              # Clock in/out
PUT    /api/time-clock/:id          # Update time entry (Manager+)
DELETE /api/time-clock/:id          # Delete time entry (Manager+)

# Time Tracking
GET    /api/time-clock/report       # Get time reports
GET    /api/time-clock/today        # Get today's entries
GET    /api/time-clock/week         # Get weekly entries
```

### **Payroll Collection**
```typescript
GET    /api/payroll                 # List payroll entries (Manager+)
GET    /api/payroll/:id             # Get payroll entry by ID
POST   /api/payroll                 # Create payroll entry (Manager+)
PUT    /api/payroll/:id             # Update payroll entry
DELETE /api/payroll/:id             # Delete payroll entry (Manager+)

# Payroll Processing
POST   /api/payroll/process         # Process payroll
GET    /api/payroll/pending         # Get pending payroll
PUT    /api/payroll/:id/approve     # Approve payroll entry
```

---

## **📦 INVENTORY MANAGEMENT API**

### **Products Collection**
```typescript
GET    /api/products                # List products
GET    /api/products/:id            # Get product by ID
GET    /api/products?category=:cat  # Get products by category
GET    /api/products?brand=:brand   # Get products by brand
POST   /api/products                # Create product (Manager+)
PUT    /api/products/:id            # Update product
DELETE /api/products/:id            # Delete product (Manager+)

# Inventory Management
GET    /api/products/:id/inventory  # Get product inventory
PUT    /api/products/:id/inventory  # Update product inventory
GET    /api/products/low-stock      # Get low stock products
```

### **Inventory Collection**
```typescript
GET    /api/inventory               # List inventory items
GET    /api/inventory/:id           # Get inventory item by ID
POST   /api/inventory               # Add inventory item
PUT    /api/inventory/:id           # Update inventory item
DELETE /api/inventory/:id           # Remove inventory item

# Inventory Tracking
GET    /api/inventory/low-stock     # Get low stock items
GET    /api/inventory/expiring      # Get expiring items
PUT    /api/inventory/:id/adjust    # Adjust inventory quantity
```

### **Suppliers Collection**
```typescript
GET    /api/suppliers               # List suppliers
GET    /api/suppliers/:id           # Get supplier by ID
POST   /api/suppliers               # Create supplier
PUT    /api/suppliers/:id           # Update supplier
DELETE /api/suppliers/:id           # Delete supplier

# Supplier Management
GET    /api/suppliers/:id/orders    # Get supplier orders
POST   /api/suppliers/:id/order     # Create supplier order
GET    /api/suppliers/:id/products  # Get supplier products
```

---

## **💰 COMMERCE & PAYMENT API**

### **Orders Collection**
```typescript
GET    /api/orders                  # List orders
GET    /api/orders/:id              # Get order by ID
GET    /api/orders?status=:status   # Get orders by status
POST   /api/orders                  # Create order
PUT    /api/orders/:id              # Update order
DELETE /api/orders/:id              # Cancel order

# Order Processing
PUT    /api/orders/:id/process      # Process order
PUT    /api/orders/:id/ship         # Ship order
PUT    /api/orders/:id/deliver      # Mark as delivered
PUT    /api/orders/:id/refund       # Process refund
```

### **Payments Integration (Stripe)**
```typescript
POST   /api/payments/create-session # Create payment session
GET    /api/payments/session/:id    # Get payment session
POST   /api/payments/webhook        # Stripe webhook
GET    /api/payments/methods        # Get payment methods
POST   /api/payments/method         # Add payment method
DELETE /api/payments/method/:id     # Remove payment method
```

---

## **📊 ANALYTICS & REPORTING API**

### **Analytics Endpoints**
```typescript
GET    /api/analytics/overview      # Get overview metrics
GET    /api/analytics/revenue       # Get revenue analytics
GET    /api/analytics/appointments  # Get appointment analytics
GET    /api/analytics/customers     # Get customer analytics
GET    /api/analytics/services      # Get service analytics
GET    /api/analytics/staff         # Get staff performance

# Date Range Filtering
GET    /api/analytics/overview?start=2024-01-01&end=2024-12-31
```

### **Reports Endpoints**
```typescript
GET    /api/reports/daily           # Daily report
GET    /api/reports/weekly          # Weekly report
GET    /api/reports/monthly         # Monthly report
GET    /api/reports/custom          # Custom date range report

# Export Options
GET    /api/reports/daily?format=pdf
GET    /api/reports/daily?format=csv
GET    /api/reports/daily?format=excel
```

---

## **📧 COMMUNICATION API**

### **Email Integration**
```typescript
POST   /api/email/send              # Send email
GET    /api/email/templates         # Get email templates
POST   /api/email/template          # Create email template
PUT    /api/email/template/:id      # Update email template
DELETE /api/email/template/:id      # Delete email template
```

### **SMS Integration**
```typescript
POST   /api/sms/send                # Send SMS
GET    /api/sms/templates           # Get SMS templates
POST   /api/sms/template            # Create SMS template
PUT    /api/sms/template/:id        # Update SMS template
DELETE /api/sms/template/:id        # Delete SMS template
```

### **Notifications Collection**
```typescript
GET    /api/notifications           # List notifications
GET    /api/notifications/:id       # Get notification by ID
POST   /api/notifications           # Create notification
PUT    /api/notifications/:id       # Update notification
DELETE /api/notifications/:id       # Delete notification

# User Notifications
GET    /api/notifications/me        # Get my notifications
PUT    /api/notifications/:id/read  # Mark as read
PUT    /api/notifications/read-all  # Mark all as read
```

---

## **⚙️ SYSTEM MANAGEMENT API**

### **Settings Collection**
```typescript
GET    /api/settings                # Get system settings
PUT    /api/settings                # Update system settings
GET    /api/settings/:key           # Get specific setting
PUT    /api/settings/:key           # Update specific setting
```

### **Locations Collection**
```typescript
GET    /api/locations               # List locations
GET    /api/locations/:id           # Get location by ID
POST   /api/locations               # Create location (Admin only)
PUT    /api/locations/:id           # Update location
DELETE /api/locations/:id           # Delete location (Admin only)

# Location Management
GET    /api/locations/:id/staff     # Get location staff
PUT    /api/locations/:id/staff     # Update location staff
GET    /api/locations/:id/services  # Get location services
```

### **Media Collection**
```typescript
GET    /api/media                   # List media files
GET    /api/media/:id               # Get media file by ID
POST   /api/media                   # Upload media file
PUT    /api/media/:id               # Update media file
DELETE /api/media/:id               # Delete media file

# Media Operations
GET    /api/media/search?q=:query   # Search media files
GET    /api/media/:id/download      # Download media file
PUT    /api/media/:id/tags          # Update media tags
```

---

## **🌐 GLOBAL CONFIGURATION API**

### **Header Global**
```typescript
GET    /api/globals/header          # Get header configuration
PUT    /api/globals/header          # Update header configuration
```

**Header Global Fields:**
```json
{
  "navItems": [
    {
      "link": {
        "type": "reference",
        "reference": {
          "relationTo": "pages",
          "value": "page_id"
        }
      },
      "label": "string"
    }
  ]
}
```

### **Settings Global**
```typescript
GET    /api/globals/settings        # Get site settings
PUT    /api/globals/settings        # Update site settings
```

**Settings Global Fields:**
```json
{
  "postsPage": {
    "id": "string",
    "title": "string",
    "slug": "string",
    "layout": [...],
    "meta": {...}
  },
  "projectsPage": {
    "id": "string",
    "title": "string",
    "slug": "string",
    "layout": [...],
    "meta": {...}
  }
}
```

### **Footer Global**
```typescript
GET    /api/globals/footer          # Get footer configuration
PUT    /api/globals/footer          # Update footer configuration
```

---

## **🔍 SEARCH & DISCOVERY API**

### **Search Plugin Integration**
```typescript
GET    /api/search                 # Global search
GET    /api/search/posts           # Search posts
GET    /api/search/projects        # Search projects
GET    /api/search/customers       # Search customers
GET    /api/search/services        # Search services

# Search Parameters
GET    /api/search?q=:query&limit=:limit&offset=:offset
GET    /api/search?collection=:collection&q=:query
```

### **SEO Plugin Integration**
```typescript
GET    /api/seo/meta               # Get SEO metadata
POST   /api/seo/generate           # Generate SEO metadata
PUT    /api/seo/update             # Update SEO settings
GET    /api/seo/sitemap            # Get sitemap
```

---

## **📋 FORM BUILDER API**

### **Form Builder Plugin Integration**
```typescript
GET    /api/forms                  # List forms
GET    /api/forms/:id              # Get form by ID
POST   /api/forms                  # Create form
PUT    /api/forms/:id              # Update form
DELETE /api/forms/:id              # Delete form

# Form Submissions
GET    /api/forms/:id/submissions  # Get form submissions
POST   /api/forms/:id/submit       # Submit form
GET    /api/forms/:id/export       # Export form submissions
```

---

## **🔄 WEBHOOKS & INTEGRATIONS API**

### **Webhook Endpoints**
```typescript
GET    /api/webhooks                # List webhooks
GET    /api/webhooks/:id            # Get webhook by ID
POST   /api/webhooks                # Create webhook
PUT    /api/webhooks/:id            # Update webhook
DELETE /api/webhooks/:id            # Delete webhook

# Webhook Logs
GET    /api/webhooks/:id/logs       # Get webhook logs
POST   /api/webhooks/:id/test       # Test webhook
```

### **Third-Party Integrations**
```typescript
# Stripe Webhooks
POST   /api/webhooks/stripe

# Email Service Webhooks
POST   /api/webhooks/email

# SMS Service Webhooks
POST   /api/webhooks/sms

# Calendar Integration
GET    /api/integrations/calendar
POST   /api/integrations/calendar/sync
```

---

## **📈 MONITORING & HEALTH CHECKS API**

### **Health Check Endpoints**
```typescript
GET    /api/health                  # Overall system health
GET    /api/health/database         # Database health
GET    /api/health/cache            # Cache health
GET    /api/health/external         # External services health
```

### **Metrics & Monitoring**
```typescript
GET    /api/metrics                 # System metrics
GET    /api/metrics/performance     # Performance metrics
GET    /api/metrics/errors          # Error metrics
GET    /api/metrics/usage           # Usage metrics
```

---

## **🔒 AUTHENTICATION & PERMISSIONS**

### **Role-Based Access Control**
```typescript
# Available Roles
- admin: Full system access
- manager: Staff and business management
- staff: Customer and appointment management
- barber: Appointment and customer access
- customer: Personal account access
- client: Limited access (guests)
```

### **Permission Matrix**
```typescript
# Collections Access
GET    /api/users          # admin, manager
GET    /api/customers      # admin, manager, staff, barber
GET    /api/appointments   # admin, manager, staff, barber
GET    /api/services       # all authenticated users
GET    /api/products       # all authenticated users

# Administrative Actions
POST   /api/users          # admin only
PUT    /api/settings       # admin, manager
DELETE /api/appointments   # admin, manager
```

---

## **📝 API RESPONSE FORMAT**

### **Success Response**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### **Error Response**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {...}
  }
}
```

---

## **🔧 API CONFIGURATION**

### **Rate Limiting**
```typescript
# Applied to all endpoints
- Authenticated users: 1000 requests/hour
- Unauthenticated users: 100 requests/hour
- Admin endpoints: 5000 requests/hour
```

### **Caching**
```typescript
# Response caching
- Public data: 5 minutes
- User data: 1 minute
- Dynamic content: No cache

# Database query caching
- Static data: 1 hour
- User preferences: 24 hours
- Analytics data: 15 minutes
```

### **CORS Configuration**
```typescript
# Allowed origins
- https://modernmen.ca
- https://*.modernmen.ca
- http://localhost:3000 (development)

# Allowed methods
- GET, POST, PUT, DELETE, OPTIONS

# Allowed headers
- Content-Type, Authorization, X-Requested-With
```

---

## **🧪 TESTING ENDPOINTS**

### **API Testing**
```typescript
GET    /api/test/health             # API connectivity test
GET    /api/test/auth               # Authentication test
GET    /api/test/database           # Database connectivity test
GET    /api/test/cache              # Cache functionality test
```

### **Load Testing**
```typescript
POST   /api/test/load/appointments  # Load test appointments API
POST   /api/test/load/search        # Load test search functionality
POST   /api/test/load/auth          # Load test authentication
```

---

## **📚 ADDITIONAL RESOURCES**

### **API Documentation**
- [OpenAPI/Swagger Documentation](./docs/api/openapi.yaml)
- [Postman Collection](./docs/api/postman_collection.json)
- [GraphQL Schema](./docs/api/graphql_schema.graphql)

### **Integration Guides**
- [Frontend Integration](./docs/integrations/frontend.md)
- [Mobile App Integration](./docs/integrations/mobile.md)
- [Third-Party Integrations](./docs/integrations/third-party.md)

### **Developer Resources**
- [API Changelog](./docs/api/changelog.md)
- [Migration Guide](./docs/api/migrations.md)
- [Best Practices](./docs/api/best-practices.md)

---

## **🎯 QUICK START GUIDE**

### **1. Authentication**
```bash
# Get authentication token
curl -X POST /api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### **2. Basic CRUD Operations**
```bash
# List customers
curl -X GET /api/customers \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create appointment
curl -X POST /api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customer":"customer_id","service":"service_id","date":"2024-12-25"}'
```

### **3. Advanced Queries**
```bash
# Search with filters
curl -X GET "/api/appointments?date=2024-12-25&status=confirmed" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Pagination
curl -X GET "/api/customers?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## **🚨 IMPORTANT NOTES**

### **Versioning**
- Current API version: `v1`
- All endpoints are prefixed with `/api/v1/`
- Backward compatibility maintained for 12 months

### **Deprecation Policy**
- Deprecated endpoints marked in response headers
- Deprecation warnings sent 30 days before removal
- Migration guides provided for breaking changes

### **Support**
- **Primary Contact**: API Support Team
- **Documentation**: api@modernmen.ca
- **Issues**: GitHub Issues with `api` label
- **Response Time**: 24 hours for critical issues

---

**🎉 This comprehensive API documentation covers all endpoints, authentication methods, data structures, and integration patterns for the Modern Men Hair Salon management system.**

**For the latest updates and additional endpoints, please refer to the [API Changelog](./docs/api/changelog.md).**
