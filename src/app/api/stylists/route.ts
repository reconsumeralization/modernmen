import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '../../../payload'

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
    const transformedStylists = stylists.docs.map(stylist => ({
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
