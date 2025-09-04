import { WebSocketMessage } from './websocket'
import { NLPAnalysis } from './nlp-engine'
import { conversationManager } from './conversation-context'

export interface AppointmentRequest {
  sessionId: string
  serviceId: string
  date: string
  time: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  preferences?: {
    stylist?: string
    notes?: string
    reminders?: boolean
  }
}

export interface AppointmentSlot {
  id: string
  date: string
  time: string
  available: boolean
  stylistId?: string
  stylistName?: string
  bookedBy?: string
}

export interface ServiceAvailability {
  serviceId: string
  serviceName: string
  duration: number
  availableSlots: AppointmentSlot[]
  nextAvailable: Date | null
  totalAvailableToday: number
  totalAvailableThisWeek: number
}

export interface BookingValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export interface BookingConfirmation {
  appointmentId: string
  confirmationNumber: string
  appointmentDetails: {
    service: string
    date: string
    time: string
    duration: number
    stylist?: string
    location: string
  }
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  reminders: {
    email: boolean
    sms: boolean
    dayBefore: boolean
    hourBefore: boolean
  }
  nextSteps: string[]
}

export class AppointmentBookingService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

  async processBookingRequest(
    message: WebSocketMessage,
    analysis: NLPAnalysis,
    sessionId: string
  ): Promise<WebSocketMessage> {
    const context = conversationManager.getContext(sessionId)
    if (!context) {
      throw new Error('Conversation context not found')
    }

    try {
      // Extract booking information from NLP analysis
      const bookingInfo = this.extractBookingInfo(analysis, context)

      if (!this.isBookingComplete(bookingInfo)) {
        return this.requestMissingInformation(bookingInfo, context)
      }

      // Validate booking
      const validation = await this.validateBooking(bookingInfo)
      if (!validation.isValid) {
        return this.createErrorResponse(validation.errors.join('\n'), sessionId)
      }

      // Create appointment
      const confirmation = await this.createAppointment(bookingInfo)

      // Update conversation context
      conversationManager.updateContext(sessionId, {
        conversationState: {
          ...context.conversationState,
          isComplete: true
        }
      })

      return this.createSuccessResponse(confirmation, sessionId)

    } catch (error) {
      console.error('Booking processing error:', error)
      return this.createErrorResponse(
        'Sorry, there was an error processing your booking. Please try again.',
        sessionId
      )
    }
  }

  private extractBookingInfo(analysis: NLPAnalysis, context: any): Partial<AppointmentRequest> {
    const entities = analysis.intent.entities
    const bookingInfo: Partial<AppointmentRequest> = {
      sessionId: context.sessionId,
      serviceId: entities.service?.value || context.entities.selectedService,
      date: entities.date?.value || context.entities.selectedDate,
      time: entities.time?.value || context.entities.selectedTime,
      customerInfo: {
        name: entities.name?.value || context.entities.customerName,
        email: entities.email?.value || context.entities.customerEmail,
        phone: entities.phone?.value || context.entities.customerPhone
      }
    }

    return bookingInfo
  }

  private isBookingComplete(bookingInfo: Partial<AppointmentRequest>): boolean {
    return !!(
      bookingInfo.serviceId &&
      bookingInfo.date &&
      bookingInfo.time &&
      bookingInfo.customerInfo?.name &&
      bookingInfo.customerInfo?.email &&
      bookingInfo.customerInfo?.phone
    )
  }

  private requestMissingInformation(
    bookingInfo: Partial<AppointmentRequest>,
    context: any
  ): WebSocketMessage {
    let missingInfo = ''

    if (!bookingInfo.serviceId) {
      missingInfo = 'Please select a service first.'
    } else if (!bookingInfo.date) {
      missingInfo = 'What date would you like to book for?'
    } else if (!bookingInfo.time) {
      missingInfo = 'What time would you prefer?'
    } else if (!bookingInfo.customerInfo?.name) {
      missingInfo = "What's your name?"
    } else if (!bookingInfo.customerInfo?.email) {
      missingInfo = "What's your email address?"
    } else if (!bookingInfo.customerInfo?.phone) {
      missingInfo = "What's your phone number?"
    }

    return {
      id: `response_${Date.now()}`,
      type: 'text',
      content: missingInfo,
      sender: 'assistant',
      timestamp: new Date()
    }
  }

  async validateBooking(bookingInfo: Partial<AppointmentRequest>): Promise<BookingValidation> {
    const validation: BookingValidation = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    }

    if (!bookingInfo.serviceId) {
      validation.isValid = false
      validation.errors.push('Service is required')
    }

    if (!bookingInfo.date) {
      validation.isValid = false
      validation.errors.push('Date is required')
    } else {
      // Validate date format and availability
      const dateValidation = this.validateDate(bookingInfo.date)
      if (!dateValidation.isValid) {
        validation.isValid = false
        validation.errors.push(dateValidation.error!)
      }
    }

    if (!bookingInfo.time) {
      validation.isValid = false
      validation.errors.push('Time is required')
    } else {
      // Validate time format and availability
      const timeValidation = this.validateTime(bookingInfo.time)
      if (!timeValidation.isValid) {
        validation.isValid = false
        validation.errors.push(timeValidation.error!)
      }
    }

    // Validate customer information
    if (!bookingInfo.customerInfo?.name) {
      validation.isValid = false
      validation.errors.push('Customer name is required')
    }

    if (!bookingInfo.customerInfo?.email) {
      validation.isValid = false
      validation.errors.push('Email is required')
    } else if (!this.isValidEmail(bookingInfo.customerInfo.email)) {
      validation.isValid = false
      validation.errors.push('Invalid email format')
    }

    if (!bookingInfo.customerInfo?.phone) {
      validation.isValid = false
      validation.errors.push('Phone number is required')
    } else if (!this.isValidPhone(bookingInfo.customerInfo.phone)) {
      validation.isValid = false
      validation.errors.push('Invalid phone number format')
    }

    // Check slot availability
    if (validation.isValid && bookingInfo.date && bookingInfo.time && bookingInfo.serviceId) {
      const availability = await this.checkSlotAvailability(
        bookingInfo.serviceId,
        bookingInfo.date,
        bookingInfo.time
      )

      if (!availability.available) {
        validation.isValid = false
        validation.errors.push('Selected time slot is not available')

        // Provide alternative suggestions
        const alternatives = await this.findAlternativeSlots(
          bookingInfo.serviceId,
          bookingInfo.date
        )
        validation.suggestions.push(...alternatives.map(slot =>
          `Alternative: ${slot.date} at ${slot.time}`
        ))
      }
    }

    return validation
  }

  private validateDate(date: string): { isValid: boolean; error?: string } {
    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    const match = date.match(datePattern)

    if (!match) {
      return { isValid: false, error: 'Date must be in MM/DD/YYYY format' }
    }

    const [, month, day, year] = match
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    if (dateObj < new Date()) {
      return { isValid: false, error: 'Date cannot be in the past' }
    }

    if (dateObj.getTime() - Date.now() > 90 * 24 * 60 * 60 * 1000) {
      return { isValid: false, error: 'Date cannot be more than 90 days in advance' }
    }

    return { isValid: true }
  }

  private validateTime(time: string): { isValid: boolean; error?: string } {
    const timePattern = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i
    const match = time.match(timePattern)

    if (!match) {
      return { isValid: false, error: 'Time must be in HH:MM AM/PM format' }
    }

    const [, hour, minute, period] = match
    const hourNum = parseInt(hour)
    const minuteNum = parseInt(minute)

    if (hourNum < 1 || hourNum > 12) {
      return { isValid: false, error: 'Hour must be between 1 and 12' }
    }

    if (minuteNum < 0 || minuteNum > 59) {
      return { isValid: false, error: 'Minute must be between 0 and 59' }
    }

    // Check business hours
    const businessStart = 9 // 9 AM
    const businessEnd = 20 // 8 PM

    let hour24 = hourNum
    if (period.toLowerCase() === 'pm' && hourNum !== 12) {
      hour24 += 12
    } else if (period.toLowerCase() === 'am' && hourNum === 12) {
      hour24 = 0
    }

    if (hour24 < businessStart || hour24 >= businessEnd) {
      return { isValid: false, error: 'Time must be between 9 AM and 8 PM' }
    }

    return { isValid: true }
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  private isValidPhone(phone: string): boolean {
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/
    return phonePattern.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  async checkSlotAvailability(serviceId: string, date: string, time: string): Promise<AppointmentSlot> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/appointments/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serviceId, date, time })
      })

      if (!response.ok) {
        throw new Error('Failed to check availability')
      }

      return await response.json()
    } catch (error) {
      console.error('Availability check error:', error)
      return {
        id: '',
        date,
        time,
        available: false
      }
    }
  }

  async findAlternativeSlots(serviceId: string, date: string): Promise<AppointmentSlot[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/appointments/alternatives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serviceId, date })
      })

      if (!response.ok) {
        throw new Error('Failed to find alternatives')
      }

      return await response.json()
    } catch (error) {
      console.error('Alternatives search error:', error)
      return []
    }
  }

  async createAppointment(bookingInfo: AppointmentRequest): Promise<BookingConfirmation> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingInfo)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create appointment')
      }

      return await response.json()
    } catch (error) {
      console.error('Appointment creation error:', error)
      throw error
    }
  }

  async getServiceAvailability(serviceId: string): Promise<ServiceAvailability> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/services/${serviceId}/availability`)

      if (!response.ok) {
        throw new Error('Failed to get service availability')
      }

      return await response.json()
    } catch (error) {
      console.error('Service availability error:', error)
      throw error
    }
  }

  private createSuccessResponse(confirmation: BookingConfirmation, sessionId: string): WebSocketMessage {
    const content = `🎉 **Appointment Confirmed!**\n\n` +
      `**Confirmation #: ${confirmation.confirmationNumber}**\n\n` +
      `📅 **${confirmation.appointmentDetails.service}**\n` +
      `📆 ${confirmation.appointmentDetails.date}\n` +
      `🕐 ${confirmation.appointmentDetails.time}\n` +
      `⏱️ ${confirmation.appointmentDetails.duration} minutes\n\n` +
      `📍 Location: ${confirmation.appointmentDetails.location}\n\n` +
      `👤 **Customer Details:**\n` +
      `${confirmation.customerInfo.name}\n` +
      `${confirmation.customerInfo.email}\n` +
      `${confirmation.customerInfo.phone}\n\n` +
      `✅ You'll receive confirmations via:\n` +
      `${confirmation.reminders.email ? '📧 Email' : ''} ` +
      `${confirmation.reminders.sms ? '📱 SMS' : ''}\n\n` +
      `**Next Steps:**\n` +
      confirmation.nextSteps.map(step => `• ${step}`).join('\n')

    return {
      id: `confirmation_${Date.now()}`,
      type: 'text',
      content,
      sender: 'assistant',
      timestamp: new Date()
    }
  }

  private createErrorResponse(error: string, sessionId: string): WebSocketMessage {
    return {
      id: `error_${Date.now()}`,
      type: 'text',
      content: `❌ ${error}`,
      sender: 'assistant',
      timestamp: new Date()
    }
  }

  async getUpcomingAppointments(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/appointments/upcoming/${userId}`)

      if (!response.ok) {
        throw new Error('Failed to get upcoming appointments')
      }

      return await response.json()
    } catch (error) {
      console.error('Upcoming appointments error:', error)
      return []
    }
  }

  async cancelAppointment(appointmentId: string, reason?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/appointments/${appointmentId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      return response.ok
    } catch (error) {
      console.error('Appointment cancellation error:', error)
      return false
    }
  }

  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newTime: string
  ): Promise<BookingConfirmation | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/appointments/${appointmentId}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newDate, newTime })
      })

      if (!response.ok) {
        throw new Error('Failed to reschedule appointment')
      }

      return await response.json()
    } catch (error) {
      console.error('Appointment reschedule error:', error)
      return null
    }
  }
}

// Global booking service instance
export const appointmentBookingService = new AppointmentBookingService()
