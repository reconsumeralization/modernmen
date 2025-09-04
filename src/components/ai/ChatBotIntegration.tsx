import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

interface BookingData {
  serviceId: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes?: string
}

interface AppointmentResult {
  success: boolean
  appointmentId?: string
  message: string
  confirmationDetails?: {
    appointmentId: string
    date: string
    time: string
    service: string
    price: number
    duration: number
  }
}

export function useChatBotIntegration() {
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const createAppointment = useCallback(async (bookingData: BookingData): Promise<AppointmentResult> => {
    setIsCreatingAppointment(true)

    try {
      const supabase = createClient()

      // First, check if customer exists, if not create them
      let { data: existingCustomer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', bookingData.customerEmail)
        .single()

      let customerId: string

      if (customerError || !existingCustomer) {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            name: bookingData.customerName,
            email: bookingData.customerEmail,
            phone: bookingData.customerPhone,
            status: 'new',
            created_at: new Date().toISOString()
          })
          .select('id')
          .single()

        if (createError) {
          throw new Error(`Failed to create customer: ${createError.message}`)
        }

        customerId = newCustomer.id
      } else {
        customerId = existingCustomer.id
      }

      // Get service details
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', bookingData.serviceId)
        .single()

      if (serviceError || !service) {
        throw new Error('Service not found')
      }

      // Combine date and time
      const appointmentDateTime = new Date(`${bookingData.date} ${bookingData.time}`)

      // Create appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          service_id: bookingData.serviceId,
          appointment_date: appointmentDateTime.toISOString(),
          status: 'pending',
          notes: bookingData.notes || 'Booked via chatbot',
          created_at: new Date().toISOString(),
          total_price: service.price
        })
        .select('id')
        .single()

      if (appointmentError) {
        throw new Error(`Failed to create appointment: ${appointmentError.message}`)
      }

      // Send confirmation email (you would implement this)
      await sendConfirmationEmail(bookingData, service, appointment.id)

      toast({
        title: "Appointment Booked!",
        description: `Your appointment has been scheduled for ${bookingData.date} at ${bookingData.time}`,
      })

      return {
        success: true,
        appointmentId: appointment.id,
        message: `✅ Appointment booked successfully!\n\n📅 Date: ${bookingData.date}\n🕐 Time: ${bookingData.time}\n💇‍♂️ Service: ${service.name}\n💰 Price: $${service.price}\n\nYou'll receive a confirmation email shortly.`,
        confirmationDetails: {
          appointmentId: appointment.id,
          date: bookingData.date,
          time: bookingData.time,
          service: service.name,
          price: service.price,
          duration: service.duration
        }
      }

    } catch (error) {
      console.error('Error creating appointment:', error)

      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive"
      })

      return {
        success: false,
        message: `❌ Sorry, I couldn't book your appointment. ${error instanceof Error ? error.message : 'Please try again or contact us directly.'}`
      }
    } finally {
      setIsCreatingAppointment(false)
    }
  }, [toast])

  const sendConfirmationEmail = async (bookingData: BookingData, service: any, appointmentId: string) => {
    // This would integrate with your email service (e.g., SendGrid, Mailgun, etc.)
    // For now, we'll just log it
    console.log('Sending confirmation email to:', bookingData.customerEmail, {
      appointmentId,
      service: service.name,
      date: bookingData.date,
      time: bookingData.time,
      price: service.price
    })

    // Example email service integration:
    /*
    const emailData = {
      to: bookingData.customerEmail,
      subject: `Appointment Confirmed - Modern Men Salon`,
      template: 'appointment-confirmation',
      data: {
        customerName: bookingData.customerName,
        serviceName: service.name,
        date: bookingData.date,
        time: bookingData.time,
        price: service.price,
        appointmentId: appointmentId
      }
    }

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    })
    */
  }

  const checkAvailability = useCallback(async (date: string, time: string, serviceId: string): Promise<boolean> => {
    try {
      const supabase = createClient()
      const appointmentDateTime = new Date(`${date} ${time}`)

      // Get service duration
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('duration')
        .eq('id', serviceId)
        .single()

      if (serviceError || !service) {
        return false
      }

      const endTime = new Date(appointmentDateTime.getTime() + service.duration * 60000)

      // Check for conflicting appointments
      const { data: conflicts, error: conflictError } = await supabase
        .from('appointments')
        .select('id, appointment_date, services(duration)')
        .eq('status', 'confirmed')
        .gte('appointment_date', appointmentDateTime.toISOString())
        .lt('appointment_date', endTime.toISOString())

      if (conflictError) {
        console.error('Error checking availability:', conflictError)
        return false
      }

      return conflicts.length === 0
    } catch (error) {
      console.error('Error in checkAvailability:', error)
      return false
    }
  }, [])

  const getAvailableTimes = useCallback(async (date: string, serviceId: string): Promise<string[]> => {
    const allTimes = [
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
      '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
      '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
    ]

    const availableTimes: string[] = []

    for (const time of allTimes) {
      const isAvailable = await checkAvailability(date, time, serviceId)
      if (isAvailable) {
        availableTimes.push(time)
      }
    }

    return availableTimes
  }, [checkAvailability])

  const getServices = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('Error fetching services:', error)
        return []
      }

      return services || []
    } catch (error) {
      console.error('Error in getServices:', error)
      return []
    }
  }, [])

  const rescheduleAppointment = useCallback(async (
    appointmentId: string,
    newDate: string,
    newTime: string
  ): Promise<AppointmentResult> => {
    try {
      const supabase = createClient()
      const newDateTime = new Date(`${newDate} ${newTime}`)

      const { data: appointment, error } = await supabase
        .from('appointments')
        .update({
          appointment_date: newDateTime.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .select('*, services(*)')
        .single()

      if (error) {
        throw new Error(`Failed to reschedule: ${error.message}`)
      }

      return {
        success: true,
        appointmentId: appointment.id,
        message: `✅ Appointment rescheduled successfully!\n\n📅 New Date: ${newDate}\n🕐 New Time: ${newTime}\n💇‍♂️ Service: ${appointment.services.name}`,
        confirmationDetails: {
          appointmentId: appointment.id,
          date: newDate,
          time: newTime,
          service: appointment.services.name,
          price: appointment.services.price,
          duration: appointment.services.duration
        }
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
      return {
        success: false,
        message: `❌ Failed to reschedule appointment. ${error instanceof Error ? error.message : 'Please try again.'}`
      }
    }
  }, [])

  const cancelAppointment = useCallback(async (appointmentId: string): Promise<AppointmentResult> => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)

      if (error) {
        throw new Error(`Failed to cancel: ${error.message}`)
      }

      return {
        success: true,
        message: `✅ Appointment cancelled successfully!\n\nIf you need to reschedule, feel free to book a new appointment anytime.`
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      return {
        success: false,
        message: `❌ Failed to cancel appointment. ${error instanceof Error ? error.message : 'Please try again or contact us directly.'}`
      }
    }
  }, [])

  return {
    createAppointment,
    checkAvailability,
    getAvailableTimes,
    getServices,
    rescheduleAppointment,
    cancelAppointment,
    isCreatingAppointment
  }
}
