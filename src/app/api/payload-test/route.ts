import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '../../../payload'

export async function GET(request: NextRequest) {
  try {
    // Check if required environment variables are set
    const requiredEnvVars = [
      'PAYLOAD_SECRET',
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY'
    ]

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

    if (missingEnvVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required environment variables: ${missingEnvVars.join(', ')}`,
        message: 'Please configure your environment variables in Vercel dashboard'
      })
    }

    // Test Payload client initialization
    const payload = await getPayloadClient()

    // Test basic Payload functionality
    const testResult = await payload.send({
      method: 'GET',
      url: '/api/users',
      query: { limit: 1 }
    })

    return NextResponse.json({
      success: true,
      message: 'Payload CMS is connected and working properly',
      data: {
        version: '3.x',
        collections: ['Users', 'Customers', 'Appointments', 'Services', 'Stylists', 'Commissions', 'ServicePackages', 'Inventory', 'WaitList', 'Media'],
        status: 'active'
      }
    })

  } catch (error) {
    console.error('Payload test error:', error)
    return NextResponse.json({
      success: false,
      error: `Payload CMS connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      message: 'Please check your Payload configuration and environment variables'
    }, { status: 500 })
  }
}