import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

export interface SaleItem {
  inventoryItem: string
  quantity: number
  unitPrice: number
  discount: number
  lineTotal: number
}

export interface Sale {
  id: string
  receiptNumber: string
  customer?: string
  cashier: string
  items: SaleItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paymentMethod: string
  status: 'completed' | 'pending' | 'refunded' | 'voided' | 'partially_refunded'
  notes?: string
  loyaltyPointsEarned?: number
  loyaltyPointsUsed?: number
  createdAt?: string
  lastUpdated?: string
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchSales = useCallback(async (filters?: {
    customer?: string
    cashier?: string
    status?: string
    dateFrom?: string
    dateTo?: string
    limit?: number
    page?: number
  }) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value.toString())
        })
      }

      const response = await fetch(`/api/sales?${params}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sales')
      }

      const data = await response.json()
      setSales(data.sales || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [user])

  const createSale = useCallback(async (saleData: Omit<Sale, 'id' | 'receiptNumber' | 'createdAt' | 'lastUpdated'>) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(saleData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create sale')
      }

      const data = await response.json()
      setSales(prev => [data.sale, ...prev])
      return data.sale
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateSale = useCallback(async (id: string, updates: Partial<Sale>) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/sales/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update sale')
      }

      const data = await response.json()
      setSales(prev => prev.map(sale =>
        sale.id === id ? data.sale : sale
      ))
      return data.sale
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const refundSale = useCallback(async (id: string, refundAmount?: number, reason?: string) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/sales/${id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({ refundAmount, reason })
      })

      if (!response.ok) {
        throw new Error('Failed to process refund')
      }

      const data = await response.json()
      setSales(prev => prev.map(sale =>
        sale.id === id ? data.sale : sale
      ))
      return data.sale
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const getSalesByDateRange = useCallback((startDate: string, endDate: string) => {
    return sales.filter(sale => {
      if (!sale.createdAt) return false
      const saleDate = new Date(sale.createdAt).toISOString().split('T')[0]
      return saleDate >= startDate && saleDate <= endDate
    })
  }, [sales])

  const getSalesByCashier = useCallback((cashierId: string) => {
    return sales.filter(sale => sale.cashier === cashierId)
  }, [sales])

  const getSalesByCustomer = useCallback((customerId: string) => {
    return sales.filter(sale => sale.customer === customerId)
  }, [sales])

  const getTotalRevenue = useCallback((dateRange?: { start: string; end: string }) => {
    let filteredSales = sales
    if (dateRange) {
      filteredSales = getSalesByDateRange(dateRange.start, dateRange.end)
    }
    return filteredSales
      .filter(sale => sale.status === 'completed')
      .reduce((total, sale) => total + sale.totalAmount, 0)
  }, [sales, getSalesByDateRange])

  const getSalesStats = useCallback((dateRange?: { start: string; end: string }) => {
    let filteredSales = sales
    if (dateRange) {
      filteredSales = getSalesByDateRange(dateRange.start, dateRange.end)
    }

    const completedSales = filteredSales.filter(sale => sale.status === 'completed')
    const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const totalTransactions = completedSales.length
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

    return {
      totalRevenue,
      totalTransactions,
      averageTransaction,
      salesByPaymentMethod: {
        cash: completedSales.filter(s => s.paymentMethod === 'cash').length,
        credit_card: completedSales.filter(s => s.paymentMethod === 'credit_card').length,
        debit_card: completedSales.filter(s => s.paymentMethod === 'debit_card').length,
        gift_card: completedSales.filter(s => s.paymentMethod === 'gift_card').length
      }
    }
  }, [sales, getSalesByDateRange])

  return {
    sales,
    loading,
    error,
    fetchSales,
    createSale,
    updateSale,
    refundSale,
    getSalesByDateRange,
    getSalesByCashier,
    getSalesByCustomer,
    getTotalRevenue,
    getSalesStats
  }
}
