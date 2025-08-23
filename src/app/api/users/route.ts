import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payload'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface UserFilters {
  role?: string
  isActive?: boolean
  search?: string
  limit?: number
  page?: number
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filters: UserFilters = {
      role: searchParams.get('role') || undefined,
      isActive: searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      page: parseInt(searchParams.get('page') || '1')
    }

    const payload = await getPayloadClient()

    // Build where clause
    const where: any = {
      and: []
    }

    if (filters.role) {
      where.and.push({ role: { equals: filters.role } })
    }

    if (filters.isActive !== undefined) {
      where.and.push({ isActive: { equals: filters.isActive } })
    }

    if (filters.search) {
      where.and.push({
        or: [
          { name: { like: `%${filters.search}%` } },
          { email: { like: `%${filters.search}%` } }
        ]
      })
    }

    if (where.and.length === 0) {
      delete where.and
    }

    // Check permissions based on user role
    const canViewAllUsers = session.user?.role === 'admin' || session.user?.role === 'manager'

    if (!canViewAllUsers) {
      // Regular users can only see themselves
      where.id = { equals: session.user?.id }
    }

    const users = await payload.find({
      collection: 'users',
      where,
      limit: filters.limit,
      page: filters.page,
      sort: '-createdAt',
      depth: 2
    })

    return NextResponse.json({
      users: users.docs,
      total: users.totalDocs,
      page: users.page,
      totalPages: users.totalPages,
      hasNext: users.hasNextPage,
      hasPrev: users.hasPrevPage
    })

  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'manager')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, role, phone, password } = body

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()

    // Check if user already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: { email: { equals: email } }
    })

    if (existingUser.docs.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = await payload.create({
      collection: 'users',
      data: {
        name,
        email,
        role,
        phone: phone || '',
        isActive: true,
        password: password || Math.random().toString(36).slice(-12) // Generate temp password
      }
    })

    // Send welcome email (implement email service)
    console.log(`New user created: ${name} (${email})`)

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt
      },
      message: 'User created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
