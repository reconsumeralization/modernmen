import { NextRequest } from 'next/server'
import getPayloadClient from '../../../../payload'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)

    // Extract the path from the URL
    const path = request.url.split('/api/admin/')[1] || ''

    // Handle Payload admin requests
    const response = await payload.send({
      method: 'GET',
      url: `/${path}`,
      query: Object.fromEntries(searchParams),
    })

    return Response.json(response)
  } catch (error) {
    console.error('Payload API GET error:', error)
    return Response.json(
      { error: 'Failed to retrieve data from Payload CMS' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)

    // Extract the path from the URL
    const path = request.url.split('/api/admin/')[1] || ''

    // Get request body
    const body = await request.json()

    // Handle Payload admin requests
    const response = await payload.send({
      method: 'POST',
      url: `/${path}`,
      data: body,
      query: Object.fromEntries(searchParams),
    })

    return Response.json(response)
  } catch (error) {
    console.error('Payload API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)

    // Extract the path from the URL
    const path = request.url.split('/api/admin/')[1] || ''

    // Get request body
    const body = await request.json()

    // Handle Payload admin requests
    const response = await payload.send({
      method: 'PUT',
      url: `/${path}`,
      data: body,
      query: Object.fromEntries(searchParams),
    })

    return Response.json(response)
  } catch (error) {
    console.error('Payload API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)

    // Extract the path from the URL
    const path = request.url.split('/api/admin/')[1] || ''

    // Handle Payload admin requests
    const response = await payload.send({
      method: 'DELETE',
      url: `/${path}`,
      query: Object.fromEntries(searchParams),
    })

    return Response.json(response)
  } catch (error) {
    console.error('Payload API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
