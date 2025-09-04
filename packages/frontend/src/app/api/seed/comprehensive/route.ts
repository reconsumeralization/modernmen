import { NextRequest, NextResponse } from 'next/server'
import { seedComprehensiveData } from '@/lib/comprehensive-seeding'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    logger.info('🚀 Starting comprehensive data seeding via API...')
    
    const result = await seedComprehensiveData()
    
    logger.info('✅ Comprehensive seeding API completed successfully')
    return NextResponse.json({
      success: true,
      ...result
    })
    
  } catch (error) {
    logger.error('❌ Comprehensive seeding API failed:', { operation: 'comprehensive_seed_api' }, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Comprehensive seeding failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Comprehensive Seeding API',
    description: 'POST to this endpoint to seed the database with comprehensive business data',
    endpoints: {
      'POST /api/seed/comprehensive': 'Seed all collections with realistic business data'
    }
  })
}