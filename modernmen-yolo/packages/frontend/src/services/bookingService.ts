import { supabase } from '@/lib/supabase/client'

export interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  duration: number
  image?: string
  active: boolean
  featured: boolean
}

export interface Barber {
  id: string
  name: string
  email: string
  bio?: string
  specialties: string[]
  avatar?: string
  availability: {
    days: string[]
    hours: {
      start: string
      end: string
    }
  }
}

export interface Appointment {
  id: string
  customer: string
  service: string
  barber: string
  date: string
  time: string
  duration: number
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  price: number
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
  updatedAt: string
}

export interface BookingRequest {
  serviceId: string
  barberId: string
  date: string
  time: string
  customerId: string
  notes?: string
}

export interface TimeSlot {
  time: string
  available: boolean
  conflictingAppointments?: string[]
}

export class BookingService {
  // Get all active services
  static async getServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('name')

    if (error) throw error
    return data || []
  }

  // Get all available barbers
  static async getBarbers(): Promise<Barber[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'barber')
      .order('name')

    if (error) throw error
    return data || []
  }

  // Get available time slots for a specific date and barber
  static async getAvailableTimeSlots(
    date: string,
    barberId: string,
    serviceDuration: number
  ): Promise<TimeSlot[]> {
    // Get barber's working hours
    const { data: barber } = await supabase
      .from('users')
      .select('availability')
      .eq('id', barberId)
      .single()

    if (!barber?.availability) {
      throw new Error('Barber availability not found')
    }

    // Get existing appointments for this date and barber
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('time, duration')
      .eq('date', date)
      .eq('barber', barberId)
      .in('status', ['pending', 'confirmed'])

    // Generate time slots
    const timeSlots: TimeSlot[] = []
    const startHour = 9 // 9 AM
    const endHour = 19 // 7 PM
    const interval = 30 // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        
        // Check if this time slot conflicts with existing appointments
        const conflicts = existingAppointments?.filter(apt => {
          const aptStart = new Date(`2000-01-01T${apt.time}`)
          const slotStart = new Date(`2000-01-01T${time}`)
          const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000)
          
          return aptStart < slotEnd && 
                 new Date(aptStart.getTime() + apt.duration * 60000) > slotStart
        }) || []

        timeSlots.push({
          time,
          available: conflicts.length === 0,
          conflictingAppointments: conflicts.map(c => c.time)
        })
      }
    }

    return timeSlots
  }

  // Create a new appointment
  static async createAppointment(booking: BookingRequest): Promise<Appointment> {
    // Get service details
    const { data: service } = await supabase
      .from('services')
      .select('*')
      .eq('id', booking.serviceId)
      .single()

    if (!service) {
      throw new Error('Service not found')
    }

    // Create appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        customer: booking.customerId,
        service: booking.serviceId,
        barber: booking.barberId,
        date: booking.date,
        time: booking.time,
        duration: service.duration,
        status: 'pending',
        notes: booking.notes,
        price: service.price,
        paymentStatus: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get customer's appointments
  static async getCustomerAppointments(customerId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services:service(name, description, category),
        barbers:barber(name, email)
      `)
      .eq('customer', customerId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Update appointment status
  static async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment['status']
  ): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)

    if (error) throw error
  }

  // Cancel appointment
  static async cancelAppointment(appointmentId: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      })
      .eq('id', appointmentId)

    if (error) throw error
  }

  // Get appointment by ID
  static async getAppointment(id: string): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services:service(name, description, category, price),
        barbers:barber(name, email, bio),
        customers:customer(name, email, phone)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Check if time slot is available
  static async isTimeSlotAvailable(
    date: string,
    time: string,
    barberId: string,
    serviceDuration: number,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id, time, duration')
      .eq('date', date)
      .eq('barber', barberId)
      .in('status', ['pending', 'confirmed'])
      .neq('id', excludeAppointmentId || '')

    if (!conflicts) return true

    const slotStart = new Date(`2000-01-01T${time}`)
    const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000)

    return !conflicts.some(apt => {
      const aptStart = new Date(`2000-01-01T${apt.time}`)
      const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000)
      
      return aptStart < slotEnd && aptEnd > slotStart
    })
  }
}
