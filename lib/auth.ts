import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'modernmen-barbershop-secret-key'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$8il0Z3XtGuRZrOZwHGG3IuaRR7.Ea.6lsMfF0wfg1gcYvZwo44bOm'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'customer'
}

export async function hashPassword(password: string): Promise<string> {
  return await bcryptjs.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcryptjs.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check cookies
  const tokenCookie = request.cookies.get('auth-token')
  if (tokenCookie) {
    return tokenCookie.value
  }

  return null
}

export async function authenticateAdmin(username: string, password: string): Promise<AuthUser | null> {
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin'
  
  if (username === expectedUsername) {
    const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH)
    if (isValid) {
      return {
        id: 'admin-1',
        email: 'admin@modernmen.com',
        name: 'Administrator',
        role: 'admin'
      }
    }
  }
  
  return null
}

export function requireAuth(role?: 'admin' | 'customer') {
  return (handler: Function) => {
    return async (request: NextRequest, context: any) => {
      const token = getTokenFromRequest(request)
      
      if (!token) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const user = verifyToken(token)
      
      if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      if (role && user.role !== role) {
        return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Add user to request context
      (request as any).user = user
      
      return handler(request, context)
    }
  }
}