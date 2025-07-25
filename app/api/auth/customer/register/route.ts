import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { hashPassword, generateToken } from '@/lib/auth'

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

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
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
    const hashedPassword = await hashPassword(password)

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
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      role: 'customer'
    })

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
  }
}