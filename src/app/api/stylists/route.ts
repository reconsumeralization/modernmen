import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '../../../payload'

// Sample data generators
function generateSampleTestimonials(stylistName: string) {
  const sampleClients = [
    { name: 'Sarah Johnson', service: 'Hair Cut & Style', rating: 5 },
    { name: 'Mike Chen', service: 'Beard Trim', rating: 5 },
    { name: 'Emma Davis', service: 'Color Treatment', rating: 4.5 },
    { name: 'David Wilson', service: 'Full Service', rating: 5 },
  ]

  const sampleReviews = [
    `Amazing experience with ${stylistName}! The attention to detail was incredible.`,
    `${stylistName} is incredibly talented. My hair has never looked better!`,
    `Professional, friendly, and extremely skilled. Highly recommend ${stylistName}!`,
    `Best haircut I've ever had. ${stylistName} really knows what they're doing.`,
    `Outstanding service! ${stylistName} made me feel comfortable throughout the entire process.`
  ]

  return sampleClients.map((client, index) => ({
    id: `testimonial-${index}`,
    clientName: client.name,
    clientImage: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`,
    service: client.service,
    rating: client.rating,
    review: sampleReviews[index % sampleReviews.length],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    verified: Math.random() > 0.3
  }))
}

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

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)

    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const featured = searchParams.get('featured') === 'true'
    const active = searchParams.get('active') !== 'false'

    // Build query filters
    const filters: any = {
      and: []
    }

    if (featured) {
      filters.and.push({ featured: { equals: true } })
    }

    if (active) {
      filters.and.push({ isActive: { equals: true } })
    }

    // If no filters, remove the and array
    if (filters.and.length === 0) {
      delete filters.and
    }

    const stylists = await payload.find({
      collection: 'stylists',
      limit,
      page,
      where: filters,
      sort: 'displayOrder',
      depth: 2, // Include related data
    })

    // Transform the data for frontend consumption
    const transformedStylists = stylists.docs.map((stylist: any) => ({
      id: stylist.id,
      name: stylist.name,
      bio: stylist.bio,
      profileImage: stylist.profileImage,
      specializations: stylist.specializations,
      experience: stylist.experience,
      performance: stylist.performance,
      socialMedia: stylist.socialMedia,
      featured: stylist.featured,
      isActive: stylist.isActive,
      portfolio: stylist.portfolio || [],
      testimonials: stylist.testimonials || generateSampleTestimonials(stylist.name),
      instagramPosts: stylist.instagramPosts || generateSampleInstagramPosts(),
    }))

    return NextResponse.json({
      stylists: transformedStylists,
      total: stylists.totalDocs,
      page: stylists.page,
      totalPages: stylists.totalPages,
      hasNext: stylists.hasNextPage,
      hasPrev: stylists.hasPrevPage,
    })

  } catch (error) {
    console.error('Stylists API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch stylists',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
