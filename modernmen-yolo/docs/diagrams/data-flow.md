# 🔄 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW DIAGRAM                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│   FRONTEND      │           │   API ROUTES    │           │   DATABASE      │
│   COMPONENTS    │           │   (Next.js)     │           │   (ModernMen)     │
└─────────────────┘           └─────────────────┘           └─────────────────┘
        │                               │                               │
        │ ┌─────────────────────────────┼─────────────────────────────┤ │
        │ │                             │                             │ │
        ▼ ▼                             ▼                             ▼ ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │ USER INPUT  │◄────────────────►│ VALIDATION  │◄────────────────►│   SAVE     │
    │ (Forms)     │                 │   LOGIC     │                 │   DATA      │
    └─────────────┘                 └─────────────┘                 └─────────────┘
        │                               │                               │
        ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │ STATE       │◄───────────────►│ BUSINESS    │◄───────────────►│ SYNC TO     │
    │ MANAGEMENT  │                 │   LOGIC     │                 │ SUPABASE    │
    └─────────────┘                 └─────────────┘                 └─────────────┘
        │                               │                               │
        ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │ UI UPDATE   │◄───────────────►│ RESPONSE    │◄───────────────►│ REAL-TIME   │
    │ (Re-render) │                 │ FORMATTING  │                 │ UPDATES     │
    └─────────────┘                 └─────────────┘                 └─────────────┘
        │                               │                               │
        ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │ VISUAL      │◄───────────────►│ CACHE       │◄───────────────►│ EXTERNAL    │
    │ FEEDBACK    │                 │ MANAGEMENT  │                 │ SERVICES    │
    └─────────────┘                 └─────────────┘                 └─────────────┘

DATA FLOW: 🔄 Request → 🛡️ Validation → 💾 Storage → 🔄 Sync → 📤 Response → 🎨 UI
```

## 📊 Data Flow Architecture

### Frontend Layer (React Components)
| Component | Purpose | Data Handling |
|-----------|---------|---------------|
| **Forms** | User input collection | State management, validation |
| **Buttons** | Action triggers | Event handling, loading states |
| **Tables** | Data display | Sorting, filtering, pagination |
| **Charts** | Data visualization | Real-time updates, caching |

### API Routes Layer (Next.js)
| Route Type | Purpose | Data Processing |
|------------|---------|-----------------|
| **GET** | Data retrieval | Query parameters, filtering |
| **POST** | Data creation | Request body validation |
| **PUT** | Data updates | Partial updates, validation |
| **DELETE** | Data removal | Cascade operations |

### Database Layer (ModernMen CMS)
| Operation | Purpose | Data Consistency |
|-----------|---------|------------------|
| **Create** | New records | Unique constraints, defaults |
| **Read** | Data retrieval | Access control, relationships |
| **Update** | Record modification | Validation, audit trails |
| **Delete** | Record removal | Foreign key constraints |

## 🔄 Request-Response Cycle

### 1. User Interaction
```typescript
// User clicks "Book Appointment" button
const handleBooking = async (appointmentData) => {
  // Step 1: Update local state (optimistic update)
  setBookingState({ ...appointmentData, status: 'pending' })

  try {
    // Step 2: Send API request
    const response = await fetch('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    })

    // Step 3: Update state with server response
    const result = await response.json()
    setBookingState(result)

    // Step 4: Show success feedback
    showToast('Appointment booked successfully!')
  } catch (error) {
    // Step 5: Handle errors and rollback
    setBookingState(null)
    showToast('Booking failed. Please try again.')
  }
}
```

### 2. API Route Processing
```typescript
// /api/appointments/route.ts
export async function POST(request: Request) {
  try {
    // Step 1: Parse request body
    const body = await request.json()

    // Step 2: Validate input data
    const validatedData = await validateAppointmentData(body)

    // Step 3: Check business rules
    await checkAppointmentAvailability(validatedData)

    // Step 4: Save to database
    const appointment = await createAppointment(validatedData)

    // Step 5: Send confirmation email
    await sendConfirmationEmail(appointment)

    // Step 6: Return success response
    return Response.json(appointment)
  } catch (error) {
    // Step 7: Handle errors appropriately
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}
```

### 3. Database Operations
```typescript
// ModernMen CMS Collection Operation
export const Appointments: CollectionConfig = {
  slug: 'appointments',
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      validate: validateFutureDate
    }
  ],
  hooks: {
    beforeChange: [validateAppointmentRules],
    afterChange: [sendNotifications]
  }
}
```

## 📡 Real-time Data Synchronization

### WebSocket Connections
```typescript
// Client-side real-time updates
useEffect(() => {
  const socket = io('/appointments')

  socket.on('appointment:created', (appointment) => {
    // Update local state
    setAppointments(prev => [...prev, appointment])
  })

  socket.on('appointment:updated', (updatedAppointment) => {
    // Update existing appointment
    setAppointments(prev =>
      prev.map(app =>
        app.id === updatedAppointment.id ? updatedAppointment : app
      )
    )
  })

  return () => socket.disconnect()
}, [])
```

### Optimistic Updates
```typescript
// Optimistic UI updates for better UX
const optimisticUpdate = (id, updates) => {
  // Step 1: Update UI immediately
  setAppointments(prev =>
    prev.map(app =>
      app.id === id ? { ...app, ...updates } : app
    )
  )

  try {
    // Step 2: Send update to server
    await updateAppointment(id, updates)
  } catch (error) {
    // Step 3: Rollback on failure
    setAppointments(prev =>
      prev.map(app =>
        app.id === id ? originalData : app
      )
    )
  }
}
```

## 🗄️ Data Caching Strategy

### Multi-layer Caching
```typescript
// 1. Browser Cache (Service Worker)
const cacheFirst = async (request) => {
  const cached = await caches.match(request)
  if (cached) return cached

  const response = await fetch(request)
  caches.put(request, response.clone())
  return response
}

// 2. Application Cache (React Query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  }
})

// 3. API Cache (Redis)
const redisCache = async (key, ttl = 3600) => {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  const data = await fetchData()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}
```

## 🔒 Data Validation Pipeline

### Client-side Validation
```typescript
const appointmentSchema = z.object({
  customerName: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone'),
  service: z.string().min(1, 'Service required'),
  date: z.date().refine(isFutureDate, 'Date must be in future'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time')
})
```

### Server-side Validation
```typescript
const validateAppointment = async (data) => {
  // Step 1: Schema validation
  const validated = appointmentSchema.parse(data)

  // Step 2: Business rule validation
  const conflicts = await checkTimeConflicts(validated)
  if (conflicts.length > 0) {
    throw new ValidationError('Time slot unavailable')
  }

  // Step 3: Availability validation
  const available = await checkStylistAvailability(validated)
  if (!available) {
    throw new ValidationError('Stylist not available')
  }

  return validated
}
```

## 📊 Error Handling Flow

### Error Boundary Pattern
```typescript
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    logError(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />
    }

    return this.props.children
  }
}
```

## 🚀 Performance Optimization

### Data Fetching Strategies
```typescript
// Parallel data fetching
const [appointments, services, stylists] = await Promise.all([
  fetchAppointments(),
  fetchServices(),
  fetchStylists()
])

// Incremental loading
const loadMoreAppointments = async () => {
  const nextPage = await fetchAppointments({
    page: currentPage + 1,
    limit: 20
  })
  setAppointments(prev => [...prev, ...nextPage])
}

// Prefetching
const prefetchAppointment = (id) => {
  queryClient.prefetchQuery(['appointment', id], () =>
    fetchAppointment(id)
  )
}
```

### Memory Management
```typescript
// Cleanup subscriptions
useEffect(() => {
  const subscription = appointments$.subscribe(setAppointments)
  return () => subscription.unsubscribe()
}, [])

// Debounced updates
const debouncedUpdate = useMemo(
  () => debounce(updateAppointment, 500),
  []
)

// Virtual scrolling for large lists
const VirtualizedList = ({ items, itemHeight }) => {
  const [scrollTop, setScrollTop] = useState(0)
  const visibleItems = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = start + Math.ceil(window.innerHeight / itemHeight)
    return items.slice(start, end)
  }, [scrollTop, items, itemHeight])
}
```
