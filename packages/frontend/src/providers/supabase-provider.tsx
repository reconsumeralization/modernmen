'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

interface SupabaseContextType {
  supabase: SupabaseClient | null
  isConnected: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  isConnected: false
})

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          console.warn('Supabase environment variables not found')
          return
        }

        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        })

        setSupabase(client)
        setIsConnected(true)

        // Test connection
        const { error } = await client.from('users').select('count').limit(1).single()
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.warn('Supabase connection test failed:', error.message)
        }
      } catch (error) {
        console.error('Failed to initialize Supabase:', error)
      }
    }

    initSupabase()
  }, [])

  return (
    <SupabaseContext.Provider value={{ supabase, isConnected }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
