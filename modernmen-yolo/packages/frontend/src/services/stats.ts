// =============================================================================
// STATS SERVICE - Handles statistics and analytics data operations
// =============================================================================

import { DashboardStats, ApiResponse } from '@/types'
import { mockStats } from '@/data'

export class StatsService {
  private baseUrl: string

  constructor(baseUrl: string = '/api/stats') {
    this.baseUrl = baseUrl
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      // In a real app, this would aggregate data from multiple sources
      // For now, return mock data
      return {
        success: true,
        data: mockStats
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
      }
    }
  }

  // Get revenue statistics for a date range
  async getRevenueStats(
    startDate?: Date,
    endDate?: Date
  ): Promise<ApiResponse<{ revenue: number; growth: number }>> {
    try {
      // In a real app, this would query the database for revenue data
      const currentRevenue = mockStats.revenue
      const previousRevenue = mockStats.previousRevenue
      const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100

      return {
        success: true,
        data: {
          revenue: currentRevenue,
          growth: Math.round(growth * 100) / 100
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch revenue stats'
      }
    }
  }

  // Get appointment statistics
  async getAppointmentStats(
    period: 'day' | 'week' | 'month' = 'month'
  ): Promise<ApiResponse<{ total: number; growth: number; byStatus: Record<string, number> }>> {
    try {
      const total = mockStats.appointments
      const previous = mockStats.previousAppointments
      const growth = ((total - previous) / previous) * 100

      // Mock status breakdown
      const byStatus = {
        confirmed: Math.floor(total * 0.7),
        pending: Math.floor(total * 0.2),
        cancelled: Math.floor(total * 0.1)
      }

      return {
        success: true,
        data: {
          total,
          growth: Math.round(growth * 100) / 100,
          byStatus
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointment stats'
      }
    }
  }

  // Get customer statistics
  async getCustomerStats(): Promise<ApiResponse<{ total: number; growth: number; newThisMonth: number }>> {
    try {
      const total = mockStats.customers
      const previous = mockStats.previousCustomers
      const growth = ((total - previous) / previous) * 100
      const newThisMonth = Math.floor(total * 0.15) // Mock new customers this month

      return {
        success: true,
        data: {
          total,
          growth: Math.round(growth * 100) / 100,
          newThisMonth
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch customer stats'
      }
    }
  }

  // Get popular services statistics
  async getPopularServices(): Promise<ApiResponse<Array<{ name: string; count: number; percentage: number }>>> {
    try {
      // In a real app, this would query service usage data
      const services = [
        { name: "Classic Haircut", count: 45, percentage: 35 },
        { name: "Beard Grooming", count: 32, percentage: 25 },
        { name: "Hair & Beard Combo", count: 28, percentage: 22 },
        { name: "Hot Towel Shave", count: 22, percentage: 18 },
      ]

      return {
        success: true,
        data: services
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch popular services'
      }
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<ApiResponse<{
    averageServiceTime: number
    customerSatisfaction: number
    revenuePerCustomer: number
  }>> {
    try {
      return {
        success: true,
        data: {
          averageServiceTime: 42, // minutes
          customerSatisfaction: 4.8, // out of 5
          revenuePerCustomer: 125 // dollars
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch performance metrics'
      }
    }
  }
}

// Export a singleton instance
export const statsService = new StatsService()

// Export factory function for custom configuration
export const createStatsService = (baseUrl?: string) => {
  return new StatsService(baseUrl)
}
