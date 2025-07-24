// API utility functions for frontend components

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

// Generic API request function
async function apiRequest(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE}/api${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const config = { ...defaultOptions, ...options }
  
  // Add auth header for admin endpoints
  if (endpoint.startsWith('/admin')) {
    const token = localStorage.getItem('admin_token') || process.env.NEXT_PUBLIC_ADMIN_TOKEN
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      }
    }
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

// Client API functions
export const clientsAPI = {
  // Get all clients with optional filters
  getAll: async (params?: {
    search?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)
    
    const query = searchParams.toString()
    return apiRequest(`/clients${query ? `?${query}` : ''}`)
  },

  // Get single client by ID
  getById: async (id: string) => {
    return apiRequest(`/clients/${id}`)
  },

  // Create new client
  create: async (clientData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth?: string
    address?: string
    city?: string
    province?: string
    postalCode?: string
    notes?: string
    preferredStylist?: string
    allergies?: string
    hairType?: string
    skinSensitivity?: string
  }) => {
    return apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    })
  },

  // Update client
  update: async (id: string, clientData: Partial<{
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth?: string
    address?: string
    city?: string
    province?: string
    postalCode?: string
    notes?: string
    preferredStylist?: string
    allergies?: string
    hairType?: string
    skinSensitivity?: string
  }>) => {
    return apiRequest(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData)
    })
  },

  // Delete client
  delete: async (id: string) => {
    return apiRequest(`/clients/${id}`, {
      method: 'DELETE'
    })
  }
}

// Booking API functions
export const bookingsAPI = {
  // Public booking submission
  submitBooking: async (bookingData: {
    name: string
    phone: string
    email: string
    service: string
    staff?: string
    date?: string
    time?: string
    message?: string
  }) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })
  },

  // Check booking status
  getStatus: async (bookingId: string) => {
    return apiRequest(`/bookings?bookingId=${bookingId}`)
  },

  // Admin: Get all bookings
  getAll: async (params?: {
    date?: string
    status?: string
    staffId?: string
    clientId?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.date) searchParams.set('date', params.date)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.staffId) searchParams.set('staffId', params.staffId)
    if (params?.clientId) searchParams.set('clientId', params.clientId)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString()
    return apiRequest(`/admin/bookings${query ? `?${query}` : ''}`)
  },

  // Admin: Create booking
  create: async (bookingData: {
    clientId: string
    staffId: string
    serviceId: string
    date: string
    startTime: string
    status?: string
    notes?: string
    paymentStatus?: string
  }) => {
    return apiRequest('/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })
  }
}

// Services API functions
export const servicesAPI = {
  // Get all services
  getAll: async (params?: {
    category?: string
    active?: boolean
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.active !== undefined) searchParams.set('active', params.active.toString())
    
    const query = searchParams.toString()
    return apiRequest(`/services${query ? `?${query}` : ''}`)
  },

  // Create service
  create: async (serviceData: {
    name: string
    description?: string
    duration: number
    price: number
    category: string
    addOns?: string[]
    isActive?: boolean
  }) => {
    return apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    })
  },

  // Update service
  update: async (id: string, serviceData: Partial<{
    name: string
    description?: string
    duration: number
    price: number
    category: string
    addOns?: string[]
    isActive?: boolean
  }>) => {
    return apiRequest(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData)
    })
  },

  // Delete service
  delete: async (id: string) => {
    return apiRequest(`/services/${id}`, {
      method: 'DELETE'
    })
  }
}

// Staff API functions
export const staffAPI = {
  // Get all staff
  getAll: async (params?: {
    role?: string
    active?: boolean
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.role) searchParams.set('role', params.role)
    if (params?.active !== undefined) searchParams.set('active', params.active.toString())
    
    const query = searchParams.toString()
    return apiRequest(`/staff${query ? `?${query}` : ''}`)
  },

  // Create staff
  create: async (staffData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    specialties?: string[]
    workingDays?: string[]
    startTime?: string
    endTime?: string
    breakStart?: string
    breakEnd?: string
    isActive?: boolean
  }) => {
    return apiRequest('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    })
  },

  // Update staff
  update: async (id: string, staffData: Partial<{
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    specialties?: string[]
    workingDays?: string[]
    startTime?: string
    endTime?: string
    breakStart?: string
    breakEnd?: string
    isActive?: boolean
  }>) => {
    return apiRequest(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData)
    })
  },

  // Delete staff
  delete: async (id: string) => {
    return apiRequest(`/staff/${id}`, {
      method: 'DELETE'
    })
  }
}

// Products API functions
export const productsAPI = {
  // Get all products
  getAll: async (params?: {
    search?: string
    category?: string
    brand?: string
    inStock?: boolean
    featured?: boolean
    active?: boolean
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set('search', params.search)
    if (params?.category) searchParams.set('category', params.category)
    if (params?.brand) searchParams.set('brand', params.brand)
    if (params?.inStock !== undefined) searchParams.set('inStock', params.inStock.toString())
    if (params?.featured !== undefined) searchParams.set('featured', params.featured.toString())
    if (params?.active !== undefined) searchParams.set('active', params.active.toString())
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString()
    return apiRequest(`/products${query ? `?${query}` : ''}`)
  },

  // Create product
  create: async (productData: {
    name: string
    brand: string
    description?: string
    price: number
    cost?: number
    category: string
    inStock: number
    minStock: number
    sku: string
    barcode?: string
    imageUrls?: string[]
    isActive?: boolean
    isFeatured?: boolean
  }) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  },

  // Update product
  update: async (id: string, productData: Partial<{
    name: string
    brand: string
    description?: string
    price: number
    cost?: number
    category: string
    inStock: number
    minStock: number
    sku: string
    barcode?: string
    imageUrls?: string[]
    isActive?: boolean
    isFeatured?: boolean
  }>) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
  },

  // Delete product
  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE'
    })
  }
}

// Analytics API functions
export const analyticsAPI = {
  // Get analytics data
  get: async (period: number = 30) => {
    return apiRequest(`/analytics?period=${period}`)
  },

  // Get dashboard data
  getDashboard: async (period: number = 30) => {
    return apiRequest(`/admin/dashboard?period=${period}`)
  }
}

// Orders API functions
export const ordersAPI = {
  // Get all orders
  getAll: async (params?: {
    status?: string
    clientId?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.clientId) searchParams.set('clientId', params.clientId)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString()
    return apiRequest(`/orders${query ? `?${query}` : ''}`)
  },

  // Create order
  create: async (orderData: {
    clientId: string
    orderNumber: string
    subtotal: number
    tax: number
    discount?: number
    total: number
    status?: string
    paymentStatus?: string
    paymentMethod?: string
    isPickup?: boolean
    shippingAddress?: string
    items: { productId: string; quantity: number; price: number }[]
  }) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  },

  // Update order
  update: async (id: string, orderData: Partial<{
    clientId: string
    orderNumber: string
    subtotal: number
    tax: number
    discount?: number
    total: number
    status?: string
    paymentStatus?: string
    paymentMethod?: string
    isPickup?: boolean
    shippingAddress?: string
    items: { productId: string; quantity: number; price: number }[]
  }>) => {
    return apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData)
    })
  },

  // Delete order
  delete: async (id: string) => {
    return apiRequest(`/orders/${id}`, {
      method: 'DELETE'
    })
  }
}

// System API functions
export const systemAPI = {
  // Check database status
  getStatus: async () => {
    return apiRequest('/init')
  },

  // Initialize database (dev only)
  initialize: async () => {
    return apiRequest('/init', {
      method: 'POST'
    })
  }
}
