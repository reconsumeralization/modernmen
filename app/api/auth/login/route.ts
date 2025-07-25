import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@modernmen.ca'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 10)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Check if email matches admin email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        email: ADMIN_EMAIL,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    })
    
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}