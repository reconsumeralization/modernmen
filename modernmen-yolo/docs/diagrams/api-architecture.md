# 🌐 API ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         API ARCHITECTURE DIAGRAM                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│   FRONTEND      │           │   NEXT.JS API   │           │   DATABASE      │
│   REQUESTS      │           │     ROUTES      │           │   (ModernMen)     │
└─────────────────┘           └─────────────────┘           └─────────────────┘
        │                               │                               │
        │ ┌─────────────────────────────┼─────────────────────────────┤ │
        │ │                             │                             │ │
        ▼ ▼                             ▼                             ▼ ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │   CLIENT    │◄────────────────►│   ROUTE     │◄────────────────►│   QUERY     │
    │   FETCH     │                 │  HANDLER    │                 │   BUILDER   │
    └─────────────┘                 └─────────────┘                 └─────────────┘
        │                               │                               │
        ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │   AXIOS/    │◄───────────────►│ VALIDATION  │◄───────────────►│   ModernMen   │
    │   FETCH     │                 │   MIDDLEWARE│                 │   FIND()    │
    └─────────────┘                 └─────────────┘                 └─────────────┘
        │                               │                               │
        ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │   HEADERS   │◄───────────────►│ AUTH CHECK  │◄───────────────►│   CREATE    │
    │   & TOKENS  │                 │   (JWT)     │                 │   RECORD    │
    └─────────────┘                 └─────────────┘                 └─────────────┘
        │                               │                               │
        ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │ RESPONSE    │◄───────────────►│ ERROR       │◄───────────────►│   UPDATE    │
    │   DATA      │                 │ HANDLING    │                 │   RECORD    │
    └─────────────┘                 └─────────────┘                 └─────────────┘

API TYPES: 🔵 GET │ 🟢 POST │ 🟡 PUT │ 🔴 DELETE │ 🟠 PATCH
```

## 🚀 API Architecture Overview

### Frontend Layer (React/Next.js)
| Component | Purpose | API Calls | Error Handling |
|-----------|---------|-----------|----------------|
| **Pages** | Route handlers | Page data fetching | Error boundaries |
| **Components** | UI rendering | Component data | Retry mechanisms |
| **Hooks** | State management | Custom API hooks | Loading states |
| **Services** | Data operations | HTTP requests | Response parsing |

### API Routes Layer (Next.js API)
| Route Type | Purpose | Middleware | Response Format |
|------------|---------|------------|-----------------|
| **/api/appointments** | Booking operations | Auth, validation | JSON |
| **/api/customers** | Customer management | Auth, rate limit | JSON |
| **/api/services** | Service catalog | Cache, CORS | JSON |
| **/api/auth** | Authentication | Security, sessions | JWT |

### Database Layer (ModernMen CMS)
| Operation | Purpose | Indexing | Caching |
|-----------|---------|----------|---------|
| **Queries** | Data retrieval | Compound indexes | Redis cache |
| **Mutations** | Data modification | Foreign keys | Invalidation |
| **Subscriptions** | Real-time updates | Connection pooling | WebSocket |

## 🔗 API Endpoint Architecture

### RESTful API Design
```
HTTP Methods: GET │ POST │ PUT │ DELETE │ PATCH
Status Codes: 200 OK │ 201 Created │ 400 Bad Request │ 401 Unauthorized │ 404 Not Found │ 500 Internal Server Error
```

### Appointments API
```typescript
// GET /api/appointments - List appointments
// Query parameters: date, stylist, status, customer
// Response: Paginated appointment list
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// POST /api/appointments - Create appointment
// Request body: customer, service, stylist, date, time
// Response: Created appointment object
{
  "id": 123,
  "customerId": 456,
  "serviceId": 789,
  "stylistId": 101,
  "date": "2024-01-15",
  "time": "14:30",
  "status": "confirmed"
}

// PUT /api/appointments/[id] - Update appointment
// Request body: Partial appointment data
// Response: Updated appointment object

// DELETE /api/appointments/[id] - Cancel appointment
// Response: Success confirmation
```

### Authentication API
```typescript
// POST /api/auth/login
// Request: { email, password }
// Response: { user, token, refreshToken }

// POST /api/auth/register
// Request: { name, email, password, phone }
// Response: { user, token, verificationRequired }

// POST /api/auth/refresh
// Request: { refreshToken }
// Response: { token, refreshToken }

// POST /api/auth/logout
// Request: { token }
// Response: Success message
```

## 🛡️ API Security Architecture

### Authentication Flow
```typescript
// JWT Token Flow
Client Request ──► Server Validation ──► Database Check ──► Response
      │                     │                       │
      ▼                     ▼                       ▼
  Attach JWT         Verify Signature        Check User
  in Headers          Check Expiry           Permissions
```

### Authorization Middleware
```typescript
// Role-based access control
const requireRole = (roles: string[]) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserModernMen

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      req.user = decoded
      return next()
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}
```

### Rate Limiting
```typescript
// API rate limiting configuration
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}

// Apply to sensitive routes
app.use('/api/appointments', rateLimit)
app.use('/api/auth', stricterRateLimit)
```

## 📊 API Performance Optimization

### Caching Strategy
```typescript
// Multi-layer caching
const CACHE_LAYERS = {
  BROWSER: 'browser',      // Service Worker
  CDN: 'cdn',             // Vercel Edge Network
  API: 'api',             // Next.js ISR/SSR
  DATABASE: 'database'    // Redis/Supabase
}

// Cache TTL by data type
const CACHE_TTL = {
  STATIC: 86400,          // 24 hours for services
  DYNAMIC: 300,           // 5 minutes for availability
  PERSONAL: 60,           // 1 minute for user data
  REAL_TIME: 0            // No cache for live bookings
}
```

### Database Query Optimization
```typescript
// Optimized queries with proper indexing
const getAppointmentsWithDetails = async (filters) => {
  const query = `
    SELECT
      a.*,
      c.first_name, c.last_name, c.email,
      s.name as service_name, s.duration_minutes, s.price,
      st.first_name as stylist_first_name, st.last_name as stylist_last_name
    FROM appointments a
    JOIN customers c ON a.customer_id = c.id
    JOIN services s ON a.service_id = s.id
    JOIN stylists st ON a.stylist_id = st.id
    WHERE a.appointment_date >= $1
    AND a.status = $2
    ORDER BY a.appointment_date, a.appointment_time
    LIMIT $3 OFFSET $4
  `

  const params = [
    filters.startDate,
    filters.status || 'confirmed',
    filters.limit || 20,
    filters.offset || 0
  ]

  return await db.query(query, params)
}
```

## 🔄 Real-time API Architecture

### WebSocket Implementation
```typescript
// Real-time appointment updates
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws, request) => {
  // Authenticate connection
  const token = request.headers.authorization
  const user = authenticateToken(token)

  if (!user) {
    ws.close(1008, 'Authentication failed')
    return
  }

  // Subscribe to user-specific updates
  subscribeToUserUpdates(user.id, (update) => {
    ws.send(JSON.stringify(update))
  })

  // Handle client messages
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString())

    switch (message.type) {
      case 'PING':
        ws.send(JSON.stringify({ type: 'PONG' }))
        break
      case 'SUBSCRIBE':
        subscribeToChannel(message.channel, ws)
        break
    }
  })
})
```

### Server-Sent Events (SSE)
```typescript
// Real-time notifications via SSE
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  })

  // Send initial connection
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)

  // Set up notification listener
  const unsubscribe = onNotification((notification) => {
    res.write(`data: ${JSON.stringify(notification)}\n\n`)
  })

  // Clean up on client disconnect
  req.on('close', () => {
    unsubscribe()
    res.end()
  })
}
```

## 📋 API Documentation

### OpenAPI Specification
```yaml
openapi: 3.0.3
info:
  title: Modern Men Hair Salon API
  version: 1.0.0
  description: RESTful API for hair salon management system

servers:
  - url: https://api.modernmen.com
    description: Production server
  - url: https://staging-api.modernmen.com
    description: Staging server

paths:
  /api/appointments:
    get:
      summary: Get appointments
      parameters:
        - name: date
          in: query
          schema:
            type: string
            format: date
        - name: status
          in: query
          schema:
            type: string
            enum: [confirmed, pending, cancelled]
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AppointmentList'

components:
  schemas:
    Appointment:
      type: object
      properties:
        id:
          type: integer
        customerId:
          type: integer
        serviceId:
          type: integer
        stylistId:
          type: integer
        date:
          type: string
          format: date
        time:
          type: string
          format: time
        status:
          type: string
          enum: [confirmed, pending, cancelled, completed]
```

## 🧪 API Testing Strategy

### Unit Tests
```typescript
// API route unit tests
describe('/api/appointments', () => {
  it('should return appointments for authenticated user', async () => {
    const response = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
  })

  it('should create appointment with valid data', async () => {
    const appointmentData = {
      customerId: 1,
      serviceId: 2,
      stylistId: 3,
      date: '2024-01-15',
      time: '14:30'
    }

    const response = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(appointmentData)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })
})
```

### Integration Tests
```typescript
// End-to-end API testing
describe('Appointment Booking Flow', () => {
  it('should complete full booking process', async () => {
    // 1. Register customer
    const customer = await createCustomer(testCustomerData)

    // 2. Get available services
    const services = await getServices()

    // 3. Get available stylists
    const stylists = await getStylists()

    // 4. Check availability
    const availability = await checkAvailability({
      stylistId: stylists[0].id,
      date: '2024-01-15',
      serviceId: services[0].id
    })

    // 5. Create appointment
    const appointment = await createAppointment({
      customerId: customer.id,
      serviceId: services[0].id,
      stylistId: stylists[0].id,
      date: '2024-01-15',
      time: availability.availableSlots[0]
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.status).toBe('confirmed')
  })
})
```

## 📊 API Monitoring & Analytics

### Request Tracking
```typescript
// API request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString()
    }

    // Send to analytics service
    analytics.track('api_request', logData)
  })

  next()
}
```

### Performance Metrics
```typescript
// API performance monitoring
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const end = process.hrtime.bigint()
    const duration = Number(end - start) / 1e6 // Convert to milliseconds

    if (duration > 1000) { // Log slow requests (> 1 second)
      console.warn(`Slow API request: ${req.method} ${req.url} took ${duration}ms`)
    }

    // Record metrics
    metrics.record('api_response_time', duration, {
      method: req.method,
      endpoint: req.url,
      status: res.statusCode
    })
  })

  next()
}
```

## 🚀 API Versioning Strategy

### URL-based Versioning
```
/api/v1/appointments
/api/v1/customers
/api/v2/appointments (with new features)
```

### Header-based Versioning
```
Accept: application/vnd.modernmen.v1+json
Accept: application/vnd.modernmen.v2+json
```

### Deprecation Strategy
```typescript
// API version deprecation warnings
const deprecatedVersionMiddleware = (req, res, next) => {
  const version = req.headers['accept']?.match(/vnd\.modernmen\.v(\d+)/)?.[1]

  if (version === '1') {
    res.set('Warning', '299 - "API v1 is deprecated, please use v2"')
  }

  next()
}
```

## 🔧 API Maintenance & Upgrades

### Graceful Shutdown
```typescript
// Graceful API shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing server...')

  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err)
      process.exit(1)
    }

    console.log('Server closed successfully')
    process.exit(0)
  })

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 30000)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
```

### Health Check Endpoint
```typescript
// API health check
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: await checkDatabaseConnection(),
    cache: await checkRedisConnection()
  }

  const statusCode = health.database && health.cache ? 200 : 503
  res.status(statusCode).json(health)
})
```
