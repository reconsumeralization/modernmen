import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

export interface LoyaltyProgram {
  id: string
  name: string
  description?: string
  pointsPerDollar: number
  pointsValue: number
  minimumPoints?: number
  maximumPointsPerTransaction?: number
  pointsExpiryMonths?: number
  tiers?: Array<{
    name: string
    minPoints: number
    benefits?: Array<{
      type: string
      value?: number
      description?: string
    }>
  }>
  rewards?: string[]
  status: 'active' | 'inactive' | 'draft'
  isDefault: boolean
  welcomeBonus?: number
  birthdayBonus?: number
  referralBonus?: number
  activeMembers?: number
  totalPointsIssued?: number
  totalPointsRedeemed?: number
  createdAt?: string
  lastUpdated?: string
}

export function useLoyaltyPrograms() {
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchPrograms = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/loyalty/programs', {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch loyalty programs')
      }

      const data = await response.json()
      setPrograms(data.programs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [user])

  const createProgram = useCallback(async (programData: Omit<LoyaltyProgram, 'id' | 'createdAt' | 'lastUpdated'>) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/loyalty/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(programData)
      })

      if (!response.ok) {
        throw new Error('Failed to create loyalty program')
      }

      const data = await response.json()
      setPrograms(prev => [...prev, data.program])
      return data.program
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateProgram = useCallback(async (id: string, updates: Partial<LoyaltyProgram>) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/loyalty/programs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update loyalty program')
      }

      const data = await response.json()
      setPrograms(prev => prev.map(program =>
        program.id === id ? data.program : program
      ))
      return data.program
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const deleteProgram = useCallback(async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/loyalty/programs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete loyalty program')
      }

      setPrograms(prev => prev.filter(program => program.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const getDefaultProgram = useCallback(() => {
    return programs.find(program => program.isDefault)
  }, [programs])

  const getActivePrograms = useCallback(() => {
    return programs.filter(program => program.status === 'active')
  }, [programs])

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    getDefaultProgram,
    getActivePrograms
  }
}
