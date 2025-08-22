import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '../../../../payload'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient()
    const { id } = params

    const stylist = await payload.findByID({
      collection: 'stylists',
      id,
      depth: 3, // Include deep related data
    })

    if (!stylist) {
      return NextResponse.json({
        error: 'Stylist not found'
      }, { status: 404 })
    }

    // Transform for frontend
    const transformedStylist = {
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
      schedule: stylist.schedule,
      pricing: stylist.pricing,
    }

    return NextResponse.json(transformedStylist)

  } catch (error) {
    console.error('Stylist detail API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch stylist details',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
