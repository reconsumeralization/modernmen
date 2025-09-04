import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { withEnhancedErrorHandler, createEnhancedSuccessResponse, APIErrorFactory } from '@/lib/enhanced-api-errors'

interface RouteParams {
  params: { id: string }
}

export const DELETE = withEnhancedErrorHandler(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw APIErrorFactory.unauthorized()
  }

  const user = session.user
  if (!['admin', 'manager', 'staff'].includes(user.role || '')) {
    throw APIErrorFactory.forbidden('Only staff members can delete communications')
  }

  try {
    // In a real implementation, you would delete from a communications collection
    // For now, we'll simulate the deletion
    const communicationId = params.id

    return createEnhancedSuccessResponse(
      { success: true },
      'Communication deleted successfully'
    )
  } catch (error) {
    console.error('Error deleting communication:', error)
    throw APIErrorFactory.internalError('Failed to delete communication')
  }
})
