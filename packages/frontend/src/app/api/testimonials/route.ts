import { NextRequest, NextResponse } from 'next/server'

interface Testimonial {
  id: string
  clientName: string
  clientImage?: string
  service: string
  rating: number
  review: string
  date: string
  verified?: boolean
  stylistId?: string
}

const sampleTestimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    clientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    service: 'Hair Cut & Style',
    rating: 5,
    review: 'Absolutely incredible experience! The attention to detail was amazing and my hair has never looked better.',
    date: '2024-08-15',
    verified: true,
    stylistId: 'stylist-1'
  },
  {
    id: '2',
    clientName: 'Mike Chen',
    clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    service: 'Beard Trim & Shape',
    rating: 5,
    review: 'Best beard trim I\'ve ever had! Professional, quick, and the results were perfect.',
    date: '2024-08-10',
    verified: true,
    stylistId: 'stylist-2'
  },
  {
    id: '3',
    clientName: 'Emma Davis',
    clientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    service: 'Color Treatment',
    rating: 4.5,
    review: 'The color turned out exactly as I envisioned! Very happy with the service and attention to detail.',
    date: '2024-08-08',
    verified: true,
    stylistId: 'stylist-1'
  },
  {
    id: '4',
    clientName: 'David Wilson',
    clientImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    service: 'Full Service Package',
    rating: 5,
    review: 'From start to finish, an outstanding experience. The team is incredibly skilled and professional.',
    date: '2024-08-05',
    verified: true,
    stylistId: 'stylist-3'
  },
  {
    id: '5',
    clientName: 'Jennifer Martinez',
    clientImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    service: 'Wedding Styling',
    rating: 5,
    review: 'Made my wedding day perfect! The styling was absolutely beautiful and lasted all day.',
    date: '2024-08-01',
    verified: true,
    stylistId: 'stylist-2'
  },
  {
    id: '6',
    clientName: 'Alex Rodriguez',
    clientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    service: 'Men\'s Haircut',
    rating: 4.5,
    review: 'Great cut and friendly service. Will definitely be coming back!',
    date: '2024-07-28',
    verified: true,
    stylistId: 'stylist-1'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { rchParams } = new URL(request.url)
    const stylistId = rchParams.get('stylistId')
    const limit = parseInt(rchParams.get('limit') || '10')
    const page = parseInt(rchParams.get('page') || '1')

    let filteredTestimonials = sampleTestimonials

    // Filter by stylist if specified
    if (stylistId) {
      filteredTestimonials = filteredTestimonials.filter(t => t.stylistId === stylistId)
    }

    // Sort by date (newest first)
    filteredTestimonials = filteredTestimonials.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTestimonials = filteredTestimonials.slice(startIndex, endIndex)

    return NextResponse.json({
      testimonials: paginatedTestimonials,
      total: filteredTestimonials.length,
      page,
      totalPages: Math.ceil(filteredTestimonials.length / limit),
      hasNext: endIndex < filteredTestimonials.length,
      hasPrev: page > 1,
      averageRating: filteredTestimonials.reduce((acc, t) => acc + t.rating, 0) / filteredTestimonials.length
    })

  } catch (error) {
    console.error('Testimonials API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch testimonials',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientName, service, rating, review, stylistId } = body

    if (!clientName || !service || !rating || !review || !stylistId) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const newTestimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      clientName,
      service,
      rating,
      review,
      date: new Date().toISOString().split('T')[0],
      verified: false, // New testimonials need verification
      stylistId
    }

    // In a real app, this would save to database
    sampleTestimonials.push(newTestimonial)

    return NextResponse.json({
      success: true,
      testimonial: newTestimonial,
      message: 'Thank you for your review! It will be published after verification.'
    })

  } catch (error) {
    console.error('Submit testimonial error:', error)
    return NextResponse.json({
      error: 'Failed to submit testimonial',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
