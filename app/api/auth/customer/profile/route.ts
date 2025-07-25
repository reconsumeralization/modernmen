import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

// Direct Prisma instance
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'modernmen-barbershop-secret-key-2025'

function getTokenFromRequest(request: NextRequest): string | null {
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

function verifyToken(token: string): any | null {
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

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    
    if (!user || user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Invalid token or insufficient permissions' },
        { status: 401 }
      )
    }

    // Fetch user profile from database
    const profile = await prisma.client.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        totalVisits: true,
        totalSpent: true,
        lastVisit: true,
        preferredStylist: true,
        hairType: true,
        skinSensitivity: true,
        allergies: true,
        notes: true,
        createdAt: true
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}