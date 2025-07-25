import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Direct Prisma instance
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'modernmen-barbershop-secret-key-2025'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.client.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        password: true,
        totalVisits: true,
        totalSpent: true,
        lastVisit: true
      }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: 'customer'
    }, JWT_SECRET, { expiresIn: '7d' })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Set cookie and return user data
    const response = NextResponse.json({
      user: userWithoutPassword,
      token
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Customer login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}