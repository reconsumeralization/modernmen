import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password are required' }, { status: 400 })
  }

  // In a real application, you would fetch the admin user from a database
  // For this example, we'll use a hardcoded admin user
  const adminUser = {
    id: 1,
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('adminpassword', 10), // Hash 'adminpassword'
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash)

  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  // Generate JWT token
  const token = jwt.sign({ userId: adminUser.id, username: adminUser.username, role: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '1h' })

  return NextResponse.json({ token })
}