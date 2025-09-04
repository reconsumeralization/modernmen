import { NextRequest } from 'next/server'
import { getPayloadClient } from '@/payload'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const url = new URL(request.url)
    const searchParams = url.searchParams

    // Extract the path from the URL
    const path = request.url.split('/api/admin/')[1]?.split('?')[0] || ''
    const cleanPath = path.replace(/^\//, '') // Remove leading slash

    // Validate path to prevent security issues
    if (cleanPath.includes('..') || cleanPath.startsWith('/')) {
      return Response.json(
        { error: 'Invalid path' },
        { status: 400 }
      )
    }

    // Handle Payload admin requests using proper Payload client methods
    if (cleanPath === '' || cleanPath === 'dashboard') {
      // Return admin dashboard data
      const [users, customers, appointments] = await Promise.all([
        payload.find({ collection: 'users', limit: 1 }),
        payload.find({ collection: 'customers', limit: 1 }),
        payload.find({ collection: 'appointments', limit: 1 })
      ])

      return Response.json({
        dashboard: {
          usersCount: users.totalDocs,
          customersCount: customers.totalDocs,
          appointmentsCount: appointments.totalDocs,
          recentActivity: []
        }
      })
    }

    // Handle collection-specific requests
    if (['users', 'customers', 'services', 'stylists', 'appointments'].includes(cleanPath)) {
      const collection = cleanPath
      const page = parseInt(searchParams.get('page') || '1')
      const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)

      const result = await payload.find({
        collection,
        page,
        limit,
        sort: '-createdAt'
      })

      return Response.json(result)
    }

    return Response.json(
      { error: 'Endpoint not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Payload API GET error:', error)
    return Response.json(
      { error: 'Failed to retrieve data from Payload CMS', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const url = new URL(request.url)
    const searchParams = url.searchParams

    // Extract the path from the URL
    const path = request.url.split('/api/admin/')[1]?.split('?')[0] || ''
    const cleanPath = path.replace(/^\//, '')

    // Get request body
    const body = await request.json()

    // Validate collection
    if (!['users', 'customers', 'services', 'stylists', 'appointments'].includes(cleanPath)) {
      return Response.json(
        { error: 'Invalid collection' },
        { status: 400 }
      )
    }

    // Validate required fields based on collection
    const collection = cleanPath
    if (collection === 'users' && (!body.email || !body.password)) {
      return Response.json(
        { error: 'Email and password are required for users' },
        { status: 400 }
      )
    }

    if (collection === 'customers' && !body.email) {
      return Response.json(
        { error: 'Email is required for customers' },
        { status: 400 }
      )
    }

    if (collection === 'services' && (!body.name || !body.price)) {
      return Response.json(
        { error: 'Name and price are required for services' },
        { status: 400 }
      )
    }

    // Create record
    const result = await payload.create({
      collection,
      data: body
    })

    return Response.json(result)
  } catch (error) {
    console.error('Payload API POST error:', error)
    return Response.json(
      { error: 'Failed to create record', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const url = new URL(request.url)

    // Extract the path and ID from the URL
    const pathParts = request.url.split('/api/admin/')[1]?.split('?')[0]?.split('/') || []
    const collection = pathParts[0]
    const id = pathParts[1]

    if (!collection || !id || !['users', 'customers', 'services', 'stylists', 'appointments'].includes(collection)) {
      return Response.json(
        { error: 'Invalid collection or ID' },
        { status: 400 }
      )
    }

    // Get request body
    const body = await request.json()

    // Update record
    const result = await payload.update({
      collection,
      id,
      data: body
    })

    return Response.json(result)
  } catch (error) {
    console.error('Payload API PUT error:', error)
    return Response.json(
      { error: 'Failed to update record', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const url = new URL(request.url)

    // Extract the path and ID from the URL
    const pathParts = request.url.split('/api/admin/')[1]?.split('?')[0]?.split('/') || []
    const collection = pathParts[0]
    const id = pathParts[1]

    if (!collection || !id || !['users', 'customers', 'services', 'stylists', 'appointments'].includes(collection)) {
      return Response.json(
        { error: 'Invalid collection or ID' },
        { status: 400 }
      )
    }

    // Delete record
    await payload.delete({
      collection,
      id
    })

    return Response.json({ message: 'Record deleted successfully' })
  } catch (error) {
    console.error('Payload API DELETE error:', error)
    return Response.json(
      { error: 'Failed to delete record', details: error.message },
      { status: 500 }
    )
  }
}
