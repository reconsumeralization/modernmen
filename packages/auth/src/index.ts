import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional()
})

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'customer' | 'stylist' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */
export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  /**
   * Verify a password against its hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Generate JWT tokens for a user
   */
  static generateTokens(user: User): AuthTokens {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    })

    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '30d'
    })

    return {
      accessToken,
      refreshToken
    }
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  /**
   * Validate login credentials
   */
  static validateLogin(data: unknown) {
    return loginSchema.parse(data)
  }

  /**
   * Validate registration data
   */
  static validateRegistration(data: unknown) {
    return registerSchema.parse(data)
  }

  /**
   * Check if user has required role
   */
  static hasRole(user: User, requiredRole: string): boolean {
    const roleHierarchy = {
      customer: 1,
      stylist: 2,
      admin: 3
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy]
  }
}

/**
 * Session management utilities
 */
export class SessionManager {
  private static sessions = new Map<string, { user: User; expiresAt: Date }>()

  static createSession(user: User): string {
    const sessionId = this.generateSessionId()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    this.sessions.set(sessionId, { user, expiresAt })

    return sessionId
  }

  static getSession(sessionId: string): User | null {
    const session = this.sessions.get(sessionId)

    if (!session || session.expiresAt < new Date()) {
      this.sessions.delete(sessionId)
      return null
    }

    return session.user
  }

  static destroySession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }

  private static generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

export default AuthService