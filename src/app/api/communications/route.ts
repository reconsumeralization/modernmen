import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { withEnhancedErrorHandler, createEnhancedSuccessResponse, APIErrorFactory } from '@/lib/enhanced-api-errors'

export const GET = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const { searchParams } = new URL(request.url)

  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const type = searchParams.get('type')
  const status = searchParams.get('status')

  try {
    // For now, we'll simulate communications data since we don't have a communications collection yet
    // In a real implementation, you'd query a communications collection
    const communications = [
      {
        id: '1',
        type: 'email',
        subject: 'Appointment Reminder',
        message: 'Your appointment is tomorrow at 2:00 PM',
        recipients: [], // Would be populated with customer data
        status: 'sent',
        sentAt: new Date().toISOString(),
        scheduledAt: null,
        createdAt: new Date().toISOString(),
        createdBy: session.user.id,
        deliveryStats: {
          sent: 1,
          delivered: 1,
          failed: 0,
          opened: 1,
          clicked: 0
        }
      }
    ]

    return createEnhancedSuccessResponse({
      communications,
      totalDocs: communications.length,
      totalPages: Math.ceil(communications.length / limit),
      page,
      hasNextPage: page < Math.ceil(communications.length / limit),
      hasPrevPage: page > 1
    })
  } catch (error) {
    console.error('Error fetching communications:', error)
    throw APIErrorFactory.internalError('Failed to fetch communications')
  }
})

export const POST = withEnhancedErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const payload = await getPayloadClient()
  const body = await request.json()

  if (!body.type || !body.message || !body.recipientIds || body.recipientIds.length === 0) {
    throw APIErrorFactory.validationFailed([
      { field: 'type', message: 'Communication type is required' },
      { field: 'message', message: 'Message is required' },
      { field: 'recipientIds', message: 'At least one recipient is required' }
    ])
  }

  try {
    // Get recipient customers
    const recipients = await payload.find({
      collection: 'customers',
      where: { id: { in: body.recipientIds } },
      limit: 1000
    })

    // Simulate sending communication (in real implementation, this would integrate with email/SMS services)
    const communication = {
      id: Date.now().toString(),
      type: body.type,
      subject: body.subject,
      message: body.message,
      recipients: recipients.docs,
      status: body.scheduledAt ? 'scheduled' : 'sent',
      sentAt: body.scheduledAt ? null : new Date().toISOString(),
      scheduledAt: body.scheduledAt || null,
      createdAt: new Date().toISOString(),
      createdBy: session.user.id,
      deliveryStats: {
        sent: recipients.docs.length,
        delivered: recipients.docs.length,
        failed: 0,
        opened: 0,
        clicked: 0
      }
    }

    return createEnhancedSuccessResponse(
      { communication },
      'Communication sent successfully',
      201
    )
  } catch (error) {
    console.error('Error sending communication:', error)
    throw APIErrorFactory.internalError('Failed to send communication')
  }
})
