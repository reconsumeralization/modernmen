import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

export interface InventoryItem {
  id: string
  name: string
  description?: string
  sku: string
  category: string
  brand?: string
  supplier?: string
  unitPrice: number
  retailPrice?: number
  currentStock: number
  minStock: number
  maxStock?: number
  unitOfMeasure: string
  location?: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  isActive: boolean
  images?: Array<{ image: string; alt?: string }>
  tags?: Array<{ tag: string }>
  reorderPoint?: number
  leadTime?: number
  lastRestocked?: string
  expiryDate?: string
  batchNumber?: string
  notes?: string
  createdAt?: string
  lastUpdated?: string
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchItems = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/inventory', {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch inventory items')
      }

      const data = await response.json()
      setItems(data.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [user])

  const createItem = useCallback(async (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'lastUpdated'>) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(itemData)
      })

      if (!response.ok) {
        throw new Error('Failed to create inventory item')
      }

      const data = await response.json()
      setItems(prev => [...prev, data.item])
      return data.item
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateItem = useCallback(async (id: string, updates: Partial<InventoryItem>) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update inventory item')
      }

      const data = await response.json()
      setItems(prev => prev.map(item =>
        item.id === id ? data.item : item
      ))
      return data.item
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateStock = useCallback(async (id: string, newStock: number) => {
    if (!user) throw new Error('User not authenticated')

    try {
      await updateItem(id, { currentStock: newStock })
    } catch (err) {
      throw err
    }
  }, [user, updateItem])

  const deleteItem = useCallback(async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete inventory item')
      }

      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const getLowStockItems = useCallback(() => {
    return items.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock')
  }, [items])

  const getItemsByCategory = useCallback((category: string) => {
    return items.filter(item => item.category === category)
  }, [items])

  const getTotalValue = useCallback(() => {
    return items.reduce((total, item) => total + (item.unitPrice * item.currentStock), 0)
  }, [items])

  const getInventoryStats = useCallback(() => {
    const totalItems = items.length
    const inStock = items.filter(item => item.status === 'in_stock').length
    const lowStock = items.filter(item => item.status === 'low_stock').length
    const outOfStock = items.filter(item => item.status === 'out_of_stock').length
    const totalValue = getTotalValue()

    return {
      totalItems,
      inStock,
      lowStock,
      outOfStock,
      totalValue
    }
  }, [items, getTotalValue])

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    updateStock,
    deleteItem,
    getLowStockItems,
    getItemsByCategory,
    getTotalValue,
    getInventoryStats
  }
}