import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Database connection test
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Client operations
export async function createClient(clientData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
}) {
  const query = `
    INSERT INTO clients (
      firstName, lastName, email, phone, password, 
      dateOfBirth, address, city, province, postalCode, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;
  
  return await executeQuery(query, [
    clientData.firstName,
    clientData.lastName,
    clientData.email,
    clientData.phone,
    clientData.password,
    clientData.dateOfBirth,
    clientData.address,
    clientData.city,
    clientData.province,
    clientData.postalCode,
    clientData.notes
  ]);
}

export async function getClientByEmail(email: string) {
  const query = `SELECT * FROM clients WHERE email = $1`;
  const result = await executeQuery(query, [email]);
  return result[0] || null;
}

export async function getAllClients() {
  const query = `
    SELECT 
      id, firstName, lastName, email, phone, 
      totalVisits, totalSpent, lastVisit, createdAt
    FROM clients 
    ORDER BY createdAt DESC
  `;
  return await executeQuery(query);
}

// Service operations
export async function getAllServices() {
  const query = `
    SELECT * FROM services 
    WHERE isActive = true 
    ORDER BY category, name
  `;
  return await executeQuery(query);
}

export async function createService(serviceData: {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category: string;
}) {
  const query = `
    INSERT INTO services (name, description, duration, price, category)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  
  return await executeQuery(query, [
    serviceData.name,
    serviceData.description,
    serviceData.duration,
    serviceData.price,
    serviceData.category
  ]);
}

// Staff operations
export async function getAllStaff() {
  const query = `
    SELECT * FROM staff 
    WHERE isActive = true 
    ORDER BY firstName, lastName
  `;
  return await executeQuery(query);
}

export async function createStaff(staffData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialties: string[];
  workingDays: string[];
  startTime: string;
  endTime: string;
}) {
  const query = `
    INSERT INTO staff (
      firstName, lastName, email, phone, role, 
      specialties, workingDays, startTime, endTime
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  
  return await executeQuery(query, [
    staffData.firstName,
    staffData.lastName,
    staffData.email,
    staffData.phone,
    staffData.role,
    staffData.specialties,
    staffData.workingDays,
    staffData.startTime,
    staffData.endTime
  ]);
}

// Booking operations
export async function createBooking(bookingData: {
  clientId: string;
  staffId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  notes?: string;
}) {
  const query = `
    INSERT INTO bookings (
      clientId, staffId, serviceId, date, startTime, 
      endTime, duration, totalPrice, notes, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING')
    RETURNING *
  `;
  
  return await executeQuery(query, [
    bookingData.clientId,
    bookingData.staffId,
    bookingData.serviceId,
    bookingData.date,
    bookingData.startTime,
    bookingData.endTime,
    bookingData.duration,
    bookingData.totalPrice,
    bookingData.notes
  ]);
}

export async function getBookingsByDate(date: string) {
  const query = `
    SELECT 
      b.*,
      c.firstName || ' ' || c.lastName as clientName,
      c.phone as clientPhone,
      s.firstName || ' ' || s.lastName as staffName,
      srv.name as serviceName
    FROM bookings b
    JOIN clients c ON b.clientId = c.id
    JOIN staff s ON b.staffId = s.id
    JOIN services srv ON b.serviceId = srv.id
    WHERE DATE(b.date) = $1
    ORDER BY b.startTime
  `;
  return await executeQuery(query, [date]);
}

export async function getUpcomingBookings(limit = 10) {
  const query = `
    SELECT 
      b.*,
      c.firstName || ' ' || c.lastName as clientName,
      c.phone as clientPhone,
      s.firstName || ' ' || s.lastName as staffName,
      srv.name as serviceName
    FROM bookings b
    JOIN clients c ON b.clientId = c.id
    JOIN staff s ON b.staffId = s.id
    JOIN services srv ON b.serviceId = srv.id
    WHERE b.date >= CURRENT_DATE
    AND b.status IN ('PENDING', 'CONFIRMED')
    ORDER BY b.date, b.startTime
    LIMIT $1
  `;
  return await executeQuery(query, [limit]);
}

// Product operations
export async function getAllProducts() {
  const query = `
    SELECT * FROM products 
    WHERE isActive = true 
    ORDER BY category, name
  `;
  return await executeQuery(query);
}

export async function createProduct(productData: {
  name: string;
  brand: string;
  description?: string;
  price: number;
  cost?: number;
  category: string;
  inStock: number;
  sku: string;
  imageUrls: string[];
}) {
  const query = `
    INSERT INTO products (
      name, brand, description, price, cost, 
      category, inStock, sku, imageUrls
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  
  return await executeQuery(query, [
    productData.name,
    productData.brand,
    productData.description,
    productData.price,
    productData.cost,
    productData.category,
    productData.inStock,
    productData.sku,
    productData.imageUrls
  ]);
}

export async function updateProductStock(productId: string, newStock: number) {
  const query = `
    UPDATE products 
    SET inStock = $2, updatedAt = NOW()
    WHERE id = $1
    RETURNING *
  `;
  return await executeQuery(query, [productId, newStock]);
}

// Order operations
export async function createOrder(orderData: {
  clientId: string;
  orderNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  isPickup: boolean;
  shippingAddress?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}) {
  // Start transaction
  const orderQuery = `
    INSERT INTO orders (
      clientId, orderNumber, subtotal, tax, discount, 
      total, isPickup, shippingAddress, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
    RETURNING *
  `;
  
  const order = await executeQuery(orderQuery, [
    orderData.clientId,
    orderData.orderNumber,
    orderData.subtotal,
    orderData.tax,
    orderData.discount,
    orderData.total,
    orderData.isPickup,
    orderData.shippingAddress
  ]);

  // Add order items
  for (const item of orderData.items) {
    const itemQuery = `
      INSERT INTO order_items (orderId, productId, quantity, price)
      VALUES ($1, $2, $3, $4)
    `;
    await executeQuery(itemQuery, [
      order[0].id,
      item.productId,
      item.quantity,
      item.price
    ]);
  }

  return order[0];
}

// Analytics operations
export async function getDashboardStats() {
  const queries = {
    totalClients: `SELECT COUNT(*) as count FROM clients`,
    totalBookings: `SELECT COUNT(*) as count FROM bookings WHERE date >= CURRENT_DATE - INTERVAL '30 days'`,
    totalRevenue: `SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE createdAt >= CURRENT_DATE - INTERVAL '30 days'`,
    todayBookings: `SELECT COUNT(*) as count FROM bookings WHERE DATE(date) = CURRENT_DATE`,
  };

  const [clients, bookings, revenue, today] = await Promise.all([
    executeQuery(queries.totalClients),
    executeQuery(queries.totalBookings),
    executeQuery(queries.totalRevenue),
    executeQuery(queries.todayBookings)
  ]);

  return {
    totalClients: clients[0]?.count || 0,
    monthlyBookings: bookings[0]?.count || 0,
    monthlyRevenue: revenue[0]?.total || 0,
    todayBookings: today[0]?.count || 0
  };
}

export async function getRevenueByDay(days = 30) {
  const query = `
    SELECT 
      DATE(createdAt) as date,
      COALESCE(SUM(total), 0) as revenue,
      COUNT(*) as orders
    FROM orders 
    WHERE createdAt >= CURRENT_DATE - INTERVAL '${days} days'
    GROUP BY DATE(createdAt)
    ORDER BY date
  `;
  return await executeQuery(query);
}
