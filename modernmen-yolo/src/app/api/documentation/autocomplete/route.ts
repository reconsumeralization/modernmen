import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { DocumentationrchService } from '@/lib/rch-service'
import { getUserRoleFromSession } from '@/lib/documentation-permissions'
import { rchConfig } from '@/types/rch'

// Initialize rch service (same config as rch route)
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

    // Get user session and role
    const session = await getServerSession()
    const userRole = getUserRoleFromSession(session)

    // Get autocomplete suggestions
    const autocompleteResult = await rchService.autocomplete(query, userRole)

    return NextResponse.json(autocompleteResult)
  } catch (error) {
    console.error('Autocomplete API error:', error)
    return NextResponse.json(
      { error: 'Autocomplete service unavailable' },
      { status: 500 }
    )
  }
}