import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, password, action } = await request.json()
    
    if (action === 'login') {
      // Find customer by email
      const client = await prisma.client.findUnique({
        where: { email: email || '' }
      })
      
      if (!client || !client.password) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      // Verify password
      const isValidPassword = await verifyPassword(password, client.password)
      
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      // Generate JWT token
      const token = generateToken({
        id: client.id,
        email: client.email,
        name: `${client.firstName} ${client.lastName}`,
        role: 'customer'
      })
      
      // Update last login
      await prisma.client.update({
        where: { id: client.id },
        data: { lastVisit: new Date() }
      })
      
      const { password: _, ...clientWithoutPassword } = client
      
      return NextResponse.json({
        success: true,
        token,
        user: clientWithoutPassword
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use /api/auth/customer/login or /api/auth/customer/register' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}