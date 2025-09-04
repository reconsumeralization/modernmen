# 🔗 API Reference - Modern Men Hair Salon

Complete API documentation for the Modern Men Hair Salon management system. This document covers all REST endpoints, authentication, and integration patterns.

## 📋 API Overview

The Modern Men API follows RESTful conventions with consistent response formats, comprehensive error handling, and TypeScript support.

### Base URL
```
Production: https://yourdomain.com/api
Development: http://localhost:3000/api
```

### Authentication
All API endpoints require authentication except public routes. Use Bearer token authentication:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://yourdomain.com/api/users
```

### Response Format
```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
    timestamp: string
  }
}
```

### Error Responses
```typescript
interface ApiError {
  success: false
  error: string        // Error code
  message: string      // Human-readable message
  details?: any       // Additional error details
  meta: {
    timestamp: string
  }
}
```

## 🔐 Authentication Endpoints

### POST /api/auth/signin
Sign in with email and password.

**Request:**
```typescript
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2024-12-31T23:59:59Z"
  },
  "message": "Sign in successful"
}
```

### POST /api/auth/signup
Create a new user account.

**Request:**
```typescript
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1-555-0123"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer"
    }
  },
  "message": "Account created successfully"
}
```

### POST /api/auth/signout
Sign out the current user.

**Response:**
```typescript
{
  "success": true,
  "message": "Sign out successful"
}
```

### GET /api/auth/session
Get current session information.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer"
    },
    "expires": "2024-12-31T23:59:59Z"
  }
}
```

## 👥 User Management

### GET /api/users
Get list of users (Admin only).

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `role` (string): Filter by role
- `search` (string): Search by name or email

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "phone": "+1-555-0123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/users/[id]
Get user details by ID.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "phone": "+1-555-0123",
    "profile": {
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Regular customer",
      "preferences": {
        "notifications": true,
        "marketing": false
      }
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/users/[id]
Update user information.

**Request:**
```typescript
{
  "name": "John Smith",
  "phone": "+1-555-0124",
  "profile": {
    "bio": "Updated bio",
    "preferences": {
      "notifications": false
    }
  }
}
```

### DELETE /api/users/[id]
Delete user account (Admin only).

**Response:**
```typescript
{
  "success": true,
  "message": "User deleted successfully"
}
```

## 💇 Services Management

### GET /api/services
Get all services.

**Query Parameters:**
- `category` (string): Filter by category
- `active` (boolean): Filter by active status
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "service_123",
      "name": "Haircut & Style",
      "description": "Professional haircut with styling",
      "price": 45.00,
      "duration": 60,
      "category": "hair",
      "isActive": true,
      "image": "https://example.com/service.jpg",
      "features": [
        "Consultation",
        "Wash & cut",
        "Styling",
        "Aftercare advice"
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/services
Create a new service (Admin only).

**Request:**
```typescript
{
  "name": "Beard Trim",
  "description": "Professional beard trimming and shaping",
  "price": 25.00,
  "duration": 30,
  "category": "beard",
  "isActive": true,
  "features": [
    "Consultation",
    "Trimming",
    "Shaping",
    "Styling"
  ]
}
```

### GET /api/services/[id]
Get service details.

### PUT /api/services/[id]
Update service (Admin only).

### DELETE /api/services/[id]
Delete service (Admin only).

## 📅 Appointment Management

### GET /api/appointments
Get appointments with filtering.

**Query Parameters:**
- `date` (string): Filter by date (YYYY-MM-DD)
- `status` (string): Filter by status (pending, confirmed, completed, cancelled)
- `customerId` (string): Filter by customer
- `stylistId` (string): Filter by stylist
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "appt_123",
      "customerId": "user_123",
      "serviceId": "service_123",
      "stylistId": "stylist_123",
      "date": "2024-01-15",
      "startTime": "10:00",
      "endTime": "11:00",
      "status": "confirmed",
      "notes": "Customer prefers fade",
      "price": 45.00,
      "customer": {
        "id": "user_123",
        "name": "John Doe",
        "phone": "+1-555-0123"
      },
      "service": {
        "id": "service_123",
        "name": "Haircut & Style",
        "duration": 60
      },
      "stylist": {
        "id": "stylist_123",
        "name": "Sarah Johnson"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/appointments
Create a new appointment.

**Request:**
```typescript
{
  "serviceId": "service_123",
  "stylistId": "stylist_123",
  "date": "2024-01-15",
  "startTime": "14:00",
  "notes": "Please be gentle with the styling"
}
```

### GET /api/appointments/[id]
Get appointment details.

### PUT /api/appointments/[id]
Update appointment.

**Request:**
```typescript
{
  "status": "completed",
  "notes": "Great service, customer very happy"
}
```

### DELETE /api/appointments/[id]
Cancel appointment.

### POST /api/appointments/[id]/cancel
Cancel appointment with reason.

**Request:**
```typescript
{
  "reason": "Customer requested cancellation",
  "notifyCustomer": true
}
```

## 👨‍💼 Staff Management

### GET /api/stylists
Get all stylists.

**Query Parameters:**
- `active` (boolean): Filter by active status
- `specialty` (string): Filter by specialty

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "stylist_123",
      "name": "Sarah Johnson",
      "email": "sarah@modernmen.com",
      "phone": "+1-555-0124",
      "specialties": ["haircut", "styling", "color"],
      "isActive": true,
      "bio": "5+ years experience in men's grooming",
      "avatar": "https://example.com/avatar.jpg",
      "schedule": {
        "monday": { "start": "09:00", "end": "17:00" },
        "tuesday": { "start": "09:00", "end": "17:00" },
        // ... other days
      },
      "rating": 4.8,
      "totalReviews": 45
    }
  ]
}
```

### GET /api/stylists/[id]/availability
Get stylist availability for a date.

**Query Parameters:**
- `date` (string): Date to check (YYYY-MM-DD)

**Response:**
```typescript
{
  "success": true,
  "data": {
    "stylistId": "stylist_123",
    "date": "2024-01-15",
    "availableSlots": [
      "09:00", "09:30", "10:00", "10:30", "11:00",
      "14:00", "14:30", "15:00", "15:30", "16:00"
    ],
    "bookedSlots": [
      "12:00", "12:30", "13:00"
    ]
  }
}
```

## 💳 Payment Processing

### POST /api/payments/create-session
Create Stripe payment session.

**Request:**
```typescript
{
  "appointmentId": "appt_123",
  "amount": 45.00,
  "currency": "usd",
  "successUrl": "https://yourdomain.com/payment/success",
  "cancelUrl": "https://yourdomain.com/payment/cancel"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/pay/cs_test_...",
    "expiresAt": "2024-01-01T01:00:00Z"
  }
}
```

### GET /api/payments/[id]
Get payment details.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "pay_123",
    "appointmentId": "appt_123",
    "amount": 45.00,
    "currency": "usd",
    "status": "completed",
    "stripePaymentIntentId": "pi_...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## 📊 Analytics & Reporting

### GET /api/analytics/overview
Get business overview metrics.

**Query Parameters:**
- `startDate` (string): Start date (YYYY-MM-DD)
- `endDate` (string): End date (YYYY-MM-DD)

**Response:**
```typescript
{
  "success": true,
  "data": {
    "revenue": {
      "total": 15420.50,
      "monthly": 1285.00,
      "growth": 12.5
    },
    "appointments": {
      "total": 342,
      "completed": 328,
      "cancelled": 14,
      "noShow": 8
    },
    "customers": {
      "total": 156,
      "new": 23,
      "returning": 133,
      "retentionRate": 85.2
    },
    "services": {
      "topService": "Haircut & Style",
      "averagePrice": 45.00,
      "totalServices": 18
    }
  }
}
```

### GET /api/analytics/revenue
Get detailed revenue analytics.

### GET /api/analytics/appointments
Get appointment analytics.

### GET /api/analytics/customers
Get customer analytics.

## 🔔 Notifications

### POST /api/notifications/send
Send notification to user.

**Request:**
```typescript
{
  "userId": "user_123",
  "type": "email", // or "sms"
  "subject": "Appointment Reminder",
  "message": "Your appointment is tomorrow at 2:00 PM",
  "template": "appointment_reminder"
}
```

### GET /api/notifications
Get user notifications.

**Query Parameters:**
- `read` (boolean): Filter by read status
- `type` (string): Filter by notification type

## 🔍 Search & Filtering

### GET /api/search
Global search across entities.

**Query Parameters:**
- `q` (string): Search query (required)
- `type` (string): Entity type (users, services, appointments)
- `limit` (number): Maximum results

**Response:**
```typescript
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "type": "customer"
      }
    ],
    "services": [
      {
        "id": "service_123",
        "name": "Haircut & Style",
        "category": "hair"
      }
    ],
    "appointments": []
  },
  "meta": {
    "query": "john",
    "totalResults": 2,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## ⚙️ System Management

### GET /api/health
System health check.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": "healthy",
      "cache": "healthy",
      "email": "healthy",
      "payments": "healthy"
    },
    "uptime": "2 days, 4 hours",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/backup
Trigger system backup (Admin only).

**Response:**
```typescript
{
  "success": true,
  "data": {
    "backupId": "backup_123",
    "status": "in_progress",
    "estimatedCompletion": "2024-01-01T00:05:00Z"
  },
  "message": "Backup initiated successfully"
}
```

## 📋 Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Invalid input data | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT` | Resource conflict | 409 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

## 🔧 Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **Payment endpoints**: 50 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1638360000
```

## 📝 Webhooks

### Appointment Webhooks
Receive real-time updates about appointments.

**Endpoint:** `POST /api/webhooks/appointments`

**Events:**
- `appointment.created`
- `appointment.updated`
- `appointment.cancelled`
- `appointment.completed`

**Payload:**
```typescript
{
  "event": "appointment.created",
  "data": {
    "id": "appt_123",
    "customerId": "user_123",
    "serviceId": "service_123",
    "date": "2024-01-15",
    "startTime": "10:00",
    "status": "confirmed"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Payment Webhooks
Receive Stripe payment updates.

**Endpoint:** `POST /api/webhooks/payments`

**Events:**
- `payment.succeeded`
- `payment.failed`
- `payment.refunded`

## 🔗 SDK & Integration

### JavaScript SDK
```javascript
import { ModernMenAPI } from '@modernmen/api'

const api = new ModernMenAPI({
  baseURL: 'https://yourdomain.com/api',
  apiKey: 'your-api-key'
})

// Get services
const services = await api.services.list()

// Create appointment
const appointment = await api.appointments.create({
  serviceId: 'service_123',
  date: '2024-01-15',
  startTime: '10:00'
})
```

### Mobile Integration
```typescript
// React Native example
import { ModernMenMobile } from '@modernmen/mobile'

const client = new ModernMenMobile({
  apiUrl: 'https://yourdomain.com/api'
})

// Authenticate
await client.auth.signIn('user@example.com', 'password')

// Book appointment
await client.appointments.book({
  serviceId: 'service_123',
  date: '2024-01-15',
  time: '10:00'
})
```

## 🧪 Testing

### Test Environment
Use the staging environment for testing:
```
Base URL: https://staging.yourdomain.com/api
```

### Test Data
Pre-populated test data is available:
- Test customers: `test_customer_1@example.com`
- Test services: Various service types
- Test appointments: Past and future dates

### API Testing Tools
- **Postman Collection**: Available in `/docs/postman/`
- **Insomnia Workspace**: Available in `/docs/insomnia/`
- **Swagger UI**: Available at `/api/docs`

## 📞 Support

### Getting Help
- **API Issues**: Check [troubleshooting guide](troubleshooting.md)
- **Integration Help**: Visit [integration docs](integration.md)
- **Community Support**: Join [Discord Server](https://discord.gg/modernmen)
- **Professional Support**: Contact support@modernmen.com

### API Status
- **Status Page**: https://status.modernmen.com
- **Uptime**: 99.9% SLA
- **Response Time**: <200ms average

---

**🎯 Need help with integration?** Check our [integration guide](integration.md) or contact our developer support team.
