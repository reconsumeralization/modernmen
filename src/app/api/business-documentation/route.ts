import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { BusinessDocumentationService } from '@/lib/business-documentation-service'
import { BusinessDocumentationFilter } from '@/types/business-documentation'
import { getUserFromSession } from '@/lib/documentation-auth'

const docService = new BusinessDocumentationService({
  payloadApiUrl: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000/api',
  payloadApiKey: process.env.PAYLOAD_SECRET,
  enableWorkflowAutomation: true,
  enableNotifications: true,
  enableAnalytics: true
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    const user = getUserFromSession(session)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Parse filter parameters
    const filter: BusinessDocumentationFilter = {
      type: searchParams.get('type')?.split(',') as any,
      category: searchParams.get('category')?.split(',') as any,
      status: searchParams.get('status')?.split(',') as any,
      difficulty: searchParams.get('difficulty')?.split(',') as any,
      priority: searchParams.get('priority')?.split(',') as any,
      tags: searchParams.get('tags')?.split(','),
      author: searchParams.get('author')?.split(','),
      searchQuery: searchParams.get('q') || undefined,
      dateRange: searchParams.get('startDate') && searchParams.get('endDate') ? {
        start: new Date(searchParams.get('startDate')!),
        end: new Date(searchParams.get('endDate')!)
      } : undefined
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const result = await docService.searchDocumentation(filter, user.role, page, limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching business documentation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documentation' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    const user = getUserFromSession(session)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user can create documentation
    if (!['system_admin', 'salon_owner', 'developer'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content || !body.type || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, type, category' },
        { status: 400 }
      )
    }

    const documentation = await docService.createDocumentation(body, user.id)

    return NextResponse.json(documentation, { status: 201 })
  } catch (error) {
    console.error('Error creating business documentation:', error)
    return NextResponse.json(
      { error: 'Failed to create documentation' },
      { status: 500 }
    )
  }
}