import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { DocumentationrchService } from '@/lib/rch-service'
import { getUserRoleFromSession } from '@/lib/documentation-permissions'
import { rchQuery, rchConfig } from '@/types/rch'

// Initialize rch service
const rchConfig: rchConfig = {
  provider: 'local',
  indexName: 'documentation',
  maxResults: 50,
  enableFacets: true,
  enableSuggestions: true,
  enableAnalytics: true,
  enableHighlighting: true,
  enableTypoTolerance: true,
  enableSynonyms: true,
  rankingConfig: {
    roleBasedBoost: {
      guest: 1,
      salon_customer: 1.1,
      salon_employee: 1.2,
      salon_owner: 1.3,
      developer: 1.4,
      system_admin: 1.5
    },
    recencyBoost: 0.01,
    popularityBoost: 0.001,
    accuracyBoost: 1.5,
    completionRateBoost: 0.5,
    ratingBoost: 0.3,
    viewsBoost: 0.0001,
    titleBoost: 3,
    descriptionBoost: 2,
    contentBoost: 1,
    tagsBoost: 2
  }
}

const rchService = new DocumentationrchService(rchConfig)

export async function GET(request: NextRequest) {
  try {
    const { rchParams } = new URL(request.url)
    const query = rchParams.get('q') || ''
    const page = parseInt(rchParams.get('page') || '1')
    const limit = parseInt(rchParams.get('limit') || '20')
    const sortField = rchParams.get('sort') || 'relevance'
    const sortDirection = rchParams.get('order') || 'desc'
    
    // Parse filters from query parameters
    const categories = rchParams.get('categories')?.split(',').filter(Boolean) || []
    const contentTypes = rchParams.get('types')?.split(',').filter(Boolean) || []
    const tags = rchParams.get('tags')?.split(',').filter(Boolean) || []
    const difficulty = rchParams.get('difficulty')?.split(',').filter(Boolean) || []
    const authors = rchParams.get('authors')?.split(',').filter(Boolean) || []
    const sections = rchParams.get('sections')?.split(',').filter(Boolean) || []

    // Get user session and role
    const session = await getServerSession()
    const userRole = getUserRoleFromSession(session)

    // Build rch query
    const rchQuery: rchQuery = {
      query,
      filters: {
        categories,
        contentTypes: contentTypes as any[],
        tags,
        difficulty: difficulty as any[],
        authors,
        sections,
        roles: [] // Will be handled by role-based filtering in service
      },
      pagination: {
        page,
        limit,
        offset: (page - 1) * limit
      },
      sorting: {
        field: sortField as any,
        direction: sortDirection as 'asc' | 'desc'
      }
    }

    // Perform rch
    const rchResponse = await rchService.rch(rchQuery, userRole)

    return NextResponse.json(rchResponse)
  } catch (error) {
    console.error('rch API error:', error)
    return NextResponse.json(
      { error: 'rch service unavailable' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, filters, pagination, sorting } = body

    // Get user session and role
    const session = await getServerSession()
    const userRole = getUserRoleFromSession(session)

    // Build rch query
    const rchQuery: rchQuery = {
      query: query || '',
      filters: filters || {},
      pagination: pagination || { page: 1, limit: 20, offset: 0 },
      sorting: sorting || { field: 'relevance', direction: 'desc' }
    }

    // Perform rch
    const rchResponse = await rchService.rch(rchQuery, userRole)

    return NextResponse.json(rchResponse)
  } catch (error) {
    console.error('rch API error:', error)
    return NextResponse.json(
      { error: 'rch service unavailable' },
      { status: 500 }
    )
  }
}