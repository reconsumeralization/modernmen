import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, action } = await request.json()
    
    if (action === 'login') {
      // Find customer by email or phone
      const client = await prisma.client.findFirst({
        where: {
          OR: [
            { email: email || '' },
            { phone: phone || '' }
          ]
        }
      })
      
      if (!client) {
        return NextResponse.json(
          { error: 'No account found with this email or phone' },
          { status: 404 }
        )
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: client.id, 
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      
      // Update last login
      await prisma.client.update({
        where: { id: client.id },
        data: { lastVisit: new Date() }
      })
      
      return NextResponse.json({
        success: true,
        token,
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone
        }
      })
    }    
    if (action === 'register') {
      const { firstName, lastName, password } = await request.json()
      
      // Check if client already exists
      const existingClient = await prisma.client.findFirst({
        where: {
          OR: [
            { email: email || '' },
            { phone: phone || '' }
          ]
        }
      })
      
      if (existingClient) {
        return NextResponse.json(
          { error: 'An account already exists with this email or phone' },
          { status: 400 }
        )
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Create new client
      const newClient = await prisma.client.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword
        }
      })
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: newClient.id, 
          email: newClient.email,
          firstName: newClient.firstName,
          lastName: newClient.lastName
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      
      return NextResponse.json({
        success: true,
        token,
        client: {
          id: newClient.id,
          firstName: newClient.firstName,
          lastName: newClient.lastName,
          email: newClient.email,
          phone: newClient.phone
        }
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
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