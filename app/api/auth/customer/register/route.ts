import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Direct Prisma instance to avoid import issues
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'modernmen-barbershop-secret-key-2025'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password } = await request.json()

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.client.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12)

    // Create new user
    const newUser = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        totalVisits: 0,
        totalSpent: 0
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        totalVisits: true,
        totalSpent: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = jwt.sign({
      id: newUser.id,
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      role: 'customer'
    }, JWT_SECRET, { expiresIn: '7d' })

    // Set cookie and return user data
    const response = NextResponse.json({
      user: newUser,
      token,
      message: 'Account created successfully!'
    }, { status: 201 })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}