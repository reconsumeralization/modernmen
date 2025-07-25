import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verify JWT and get customer ID
function getCustomerId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.id
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const customerId = getCustomerId(request)
    if (!customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const loyaltyPoints = await prisma.loyaltyPoint.findMany({
      where: { clientId: customerId },
      orderBy: { createdAt: 'desc' }
    })

    const totalPoints = loyaltyPoints.reduce((sum, point) => sum + point.points, 0)

    return NextResponse.json({
      points: loyaltyPoints,
      totalPoints
    })
  } catch (error) {
    console.error('Error fetching loyalty points:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loyalty points' },
      { status: 500 }
    )
  }
}