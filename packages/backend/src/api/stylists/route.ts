import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { withEnhancedErrorHandler, createEnhancedSuccessResponse, APIErrorFactory } from '@/lib/enhanced-api-errors'
import { cachedPayload } from '@/lib/payload-cache'

function generateSampleInstagramPosts() {
  const samplePosts = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      caption: '✂ Fresh cut for our amazing client! #barber #haircut #modernmen',
      likes: Math.floor(Math.random() * 200) + 50,
      comments: Math.floor(Math.random() * 20) + 5,
      timestamp: '2h ago',
      link: '#'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      caption: 'Classic fade with a modern twist ✨ #fadedhair #barberlife',
      likes: Math.floor(Math.random() * 150) + 30,
      comments: Math.floor(Math.random() * 15) + 3,
      timestamp: '5h ago',
      link: '#'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      caption: 'Before and after transformation! 💀➡️✨ #hairtransformation #barbershop',
      likes: Math.floor(Math.random() * 300) + 100,
      comments: Math.floor(Math.random() * 25) + 10,
      timestamp: '1d ago',
      link: '#'
    }
  ]

  return samplePosts
}

export const GET = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)

  // Parse query parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const search = searchParams.get('search') || ''
  const isActive = searchParams.get('active')
  const sort = searchParams.get('sort') || '-rating'

  // Build where clause
  const where: any = {}

  // Search filter
  if (search) {
    where.or = [
      { name: { contains: search } },
      { bio: { contains: search } },
      { specialties: { contains: search } }
    ]
  }

  // Active status filter
  if (isActive !== null) {
    where.isActive = { equals: isActive === 'true' }
  }

  try {
    // Use cached version for better performance
    const stylists = await cachedPayload.getStylists({
      limit,
      active: isActive !== null ? (isActive === 'true') : undefined
    });

    return createEnhancedSuccessResponse(stylists)
  } catch (error) {
    console.error('Error fetching stylists:', error)
    throw APIErrorFactory.internal('Failed to fetch stylists')
  }
})

export const POST = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['admin', 'manager'].includes(session.user.role)) {
    throw APIErrorFactory.forbidden()
  }

  const payload = await getPayloadClient()
  const body = await request.json()

  // Validate required fields
  const { name, email } = body
  if (!name || !email) {
    throw APIErrorFactory.badRequest('Name and email are required')
  }

  try {
    const result = await payload.create({
      collection: 'stylists',
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        bio: body.bio || '',
        isActive: body.isActive !== undefined ? body.isActive : true,
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        experience: body.experience || 0,
        specialties: body.specialties || ''
      }
    })

    // Invalidate cache after creating new record
    cachedPayload.invalidate('stylists');

    return createEnhancedSuccessResponse(result, 'Stylist created successfully')
  } catch (error) {
    console.error('Error creating stylist:', error)
    throw APIErrorFactory.internal('Failed to create stylist')
  }
})
