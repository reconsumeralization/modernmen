import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'modernmen-barbershop-secret-key-2025'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$8il0Z3XtGuRZrOZwHGG3IuaRR7.Ea.6lsMfF0wfg1gcYvZwo44bOm'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' }, 
        { status: 400 }
      )
    }

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin'
    
    if (username === expectedUsername) {
      // For demo purposes, accept both the hashed password and plain text 'admin123'
      const isValid = password === 'admin123' || await bcryptjs.compare(password, ADMIN_PASSWORD_HASH)
      
      if (isValid) {
        const token = jwt.sign(
          { 
            id: 'admin-1',
            email: 'admin@modernmen.com',
            name: 'Administrator',
            role: 'admin'
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        )

        const response = NextResponse.json({ 
          success: true,
          token,
          user: {
            id: 'admin-1',
            name: 'Administrator',
            email: 'admin@modernmen.com',
            role: 'admin'
          }
        })

        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response
      }
    }
    
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    )

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}