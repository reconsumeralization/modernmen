import { NextRequest, NextResponse } from 'next/server'
// Conditionally import ModernMen for production compatibility
let getModernMen: any = null
let config: any = null

try {
  const ModernMenModule = require('ModernMen')
  getModernMen = ModernMenModule.getModernMen
  config = require('../../../ModernMen.config').default
} catch (error) {
  // Mock functions for development/production without ModernMen
  getModernMen = async () => ({})
  config = {}
}

export async function GET(request: NextRequest) {
  try {
    // Check if ModernMen is available (disabled in production for Vercel)
    if (process.env.NODE_ENV === 'production') {
      // In production, redirect to Supabase or return mock data
      return NextResponse.json(
        { error: 'Admin services not available in production' },
        { status: 503 }
      )
    }

    const ModernMen = await getModernMen({ config })
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active') !== 'false'
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

    const where: any = {
      active: { equals: active },
    }

    if (category) {
      where.category = { equals: category }
    }

    if (featured === 'true') {
      where.featured = { equals: true }
    }

    const services = await ModernMen.find({
      collection: 'services',
      where,
      sort: 'name',
      limit,
    })

    return NextResponse.json(services, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Disable admin operations in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Admin operations not available in production' },
        { status: 403 }
      )
    }

    const ModernMen = await getModernMen({ config })
    const body = await request.json()

    // Basic validation
    if (!body.name || !body.category || typeof body.price !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price' },
        { status: 400 }
      )
    }

    const service = await ModernMen.create({
      collection: 'services',
      data: {
        ...body,
        active: body.active !== false, // Default to true
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
