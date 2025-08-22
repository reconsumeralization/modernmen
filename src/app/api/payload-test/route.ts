import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '../../../payload'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Test basic connectivity
    const services = await payload.find({
      collection: 'services',
      limit: 5,
    })

    return NextResponse.json({
      success: true,
      message: 'Payload CMS connected successfully',
      data: {
        servicesCount: services.docs.length,
        totalDocs: services.totalDocs,
      },
    })
  } catch (error) {
    console.error('Payload test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to Payload CMS',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
