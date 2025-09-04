'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface TimeSlot {
  time: string
  available: boolean
  barberId?: string
  tentativelyBooked?: boolean
  expiresAt?: Date
}

interface RealtimeBookingState {
  availableSlots: TimeSlot[]
  loading: boolean
  error: string | null
  tentativeBooking: {
    slotTime: string | null
    expiresAt: Date | null
    timer: number
  } | null
}

interface UseRealtimeBookingProps {
  date: string
  barberId: string
  serviceDuration: number
}

export function useRealtimeBooking({ date, barberId, serviceDuration }: UseRealtimeBookingProps) {
  const [state, setState] = useState<RealtimeBookingState>({
    availableSlots: [],
    loading: false,
    error: null,
    tentativeBooking: null
  })

  const channelRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load available time slots
  const loadAvailableSlots = useCallback(async () => {
    if (!date || !barberId) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase
        .from('available_time_slots')
        .select('*')
        .eq('barber_id', barberId)
        .eq('date', date)
        .eq('available', true)

      if (error) throw error

      const slots: TimeSlot[] = data.map(slot => ({
        time: slot.time,
        available: slot.available && !slot.tentatively_booked,
        barberId: slot.barber_id,
        tentativelyBooked: slot.tentatively_booked,
        expiresAt: slot.tentative_expires_at ? new Date(slot.tentative_expires_at) : undefined
      }))

      setState(prev => ({ 
        ...prev, 
        availableSlots: slots,
        loading: false 
      }))

    } catch (error) {
      console.error('Error loading available slots:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load available time slots',
        loading: false 
      }))
      toast.error('Failed to load available time slots')
    }
  }, [date, barberId])

  // Start countdown timer for tentative booking
  const startCountdownTimer = useCallback((expiresAt: Date) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      const now = new Date()
      const secondsLeft = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000))

      setState(prev => ({
        ...prev,
        tentativeBooking: prev.tentativeBooking ? {
          ...prev.tentativeBooking,
          timer: secondsLeft
        } : null
      }))

      if (secondsLeft <= 0) {
        clearInterval(timerRef.current!)
        setState(prev => ({ ...prev, tentativeBooking: null }))
        toast.error('Time slot reservation expired')
        loadAvailableSlots()
      }
    }, 1000)
  }, [loadAvailableSlots])

  // Create tentative booking (holds slot for 10 minutes)
  const createTentativeBooking = useCallback(async (time: string) => {
    try {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      const { error } = await supabase
        .from('tentative_bookings')
        .insert({
          barber_id: barberId,
          date,
          time,
          expires_at: expiresAt.toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id
        })

      if (error) throw error

      setState(prev => ({
        ...prev,
        tentativeBooking: {
          slotTime: time,
          expiresAt,
          timer: 600 // 10 minutes in seconds
        }
      }))

      // Start countdown timer
      startCountdownTimer(expiresAt)

      toast.success(`Time slot reserved for 10 minutes`)
      return true

    } catch (error) {
      console.error('Error creating tentative booking:', error)
      toast.error('Failed to reserve time slot')
      return false
    }
  }, [barberId, date, startCountdownTimer])

  // Cancel tentative booking
  const cancelTentativeBooking = useCallback(async () => {
    if (!state.tentativeBooking?.slotTime) return

    try {
      const { error } = await supabase
        .from('tentative_bookings')
        .delete()
        .eq('barber_id', barberId)
        .eq('date', date)
        .eq('time', state.tentativeBooking.slotTime)

      if (error) throw error

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      setState(prev => ({ ...prev, tentativeBooking: null }))
      toast.success('Time slot released')
      loadAvailableSlots()

    } catch (error) {
      console.error('Error canceling tentative booking:', error)
      toast.error('Failed to cancel reservation')
    }
  }, [barberId, date, state.tentativeBooking?.slotTime, loadAvailableSlots])

  // Confirm booking (converts tentative to actual)
  const confirmBooking = useCallback(async (bookingData: {
    serviceId: string
    customerId: string
    notes?: string
  }) => {
    if (!state.tentativeBooking?.slotTime) return false

    try {
      // Create the actual appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: bookingData.customerId,
          service_id: bookingData.serviceId,
          staff_id: barberId,
          appointment_date: date,
          start_time: state.tentativeBooking.slotTime,
          duration: serviceDuration,
          status: 'confirmed',
          notes: bookingData.notes
        })
        .select()
        .single()

      if (appointmentError) throw appointmentError

      // Remove tentative booking
      const { error: deleteError } = await supabase
        .from('tentative_bookings')
        .delete()
        .eq('barber_id', barberId)
        .eq('date', date)
        .eq('time', state.tentativeBooking.slotTime)

      if (deleteError) throw deleteError

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      setState(prev => ({ ...prev, tentativeBooking: null }))
      loadAvailableSlots()

      return appointment

    } catch (error) {
      console.error('Error confirming booking:', error)
      toast.error('Failed to confirm booking')
      return false
    }
  }, [barberId, date, serviceDuration, state.tentativeBooking?.slotTime, loadAvailableSlots])

  // Set up real-time subscription
  useEffect(() => {
    if (!date || !barberId) return

    loadAvailableSlots()

    // Subscribe to real-time changes
    const channelName = `bookings:${barberId}:${date}`
    
    channelRef.current = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `staff_id=eq.${barberId}`
      }, (payload) => {
        console.log('Real-time booking update:', payload)
        
        // Show notification for new bookings by other users
        if (payload.eventType === 'INSERT') {
          const appointment = payload.new
          if (appointment.appointment_date === date) {
            toast.info(`Time slot ${appointment.start_time} was just booked by another customer`)
            loadAvailableSlots()
          }
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tentative_bookings',
        filter: `barber_id=eq.${barberId}`
      }, (payload) => {
        console.log('Tentative booking update:', payload)
        loadAvailableSlots()
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to real-time updates for ${channelName}`)
        }
      })

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [date, barberId, loadAvailableSlots])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return {
    ...state,
    createTentativeBooking,
    cancelTentativeBooking,
    confirmBooking,
    refreshSlots: loadAvailableSlots
  }
}