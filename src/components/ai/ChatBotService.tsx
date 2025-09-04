import { useState, useCallback } from 'react'

export interface ChatbotState {
  currentIntent: 'greeting' | 'booking' | 'inquiry' | 'confirmation' | null
  selectedService: string | null
  selectedDate: string | null
  selectedTime: string | null
  customerInfo: {
    name: string
    email: string
    phone: string
  } | null
  conversationStep: number
}

export interface SalonService {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
}

export const SALON_SERVICES: SalonService[] = [
  { id: '1', name: 'Classic Haircut', description: 'Traditional men\'s haircut with styling', duration: 30, price: 35, category: 'Haircut' },
  { id: '2', name: 'Premium Haircut', description: 'Premium styling with wash and finish', duration: 45, price: 50, category: 'Haircut' },
  { id: '3', name: 'Beard Trim', description: 'Professional beard shaping and trimming', duration: 20, price: 20, category: 'Grooming' },
  { id: '4', name: 'Full Service', description: 'Haircut, beard trim, and styling', duration: 60, price: 65, category: 'Package' },
  { id: '5', name: 'Hair Color', description: 'Professional hair coloring service', duration: 90, price: 80, category: 'Color' },
  { id: '6', name: 'Scalp Treatment', description: 'Deep conditioning scalp treatment', duration: 30, price: 40, category: 'Treatment' }
]

export const AVAILABLE_TIMES = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
]

export function useChatBot() {
  const [chatbotState, setChatbotState] = useState<ChatbotState>({
    currentIntent: null,
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    customerInfo: null,
    conversationStep: 0
  })

  const processMessage = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase()

    // Greeting detection
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      setChatbotState(prev => ({ ...prev, currentIntent: 'greeting', conversationStep: 1 }))
      return "Hello! Welcome to Modern Men salon. I'm here to help you book an appointment or answer any questions about our services. What would you like to do today?"
    }

    // Booking intent detection
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      setChatbotState(prev => ({ ...prev, currentIntent: 'booking', conversationStep: 1 }))

      const servicesList = SALON_SERVICES.map(service =>
        `${service.id}. ${service.name} - $${service.price} (${service.duration}min)`
      ).join('\n')

      return `Great! I'd be happy to help you book an appointment. Here are our available services:\n\n${servicesList}\n\nPlease reply with the number of the service you'd like to book (1-6).`
    }

    // Service inquiry
    if (lowerMessage.includes('service') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return getServiceInformation()
    }

    // Hours inquiry
    if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
      return getHoursInformation()
    }

    // Location inquiry
    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
      return getLocationInformation()
    }

    // Handle booking flow based on current state
    if (chatbotState.currentIntent === 'booking') {
      return handleBookingFlow(message, lowerMessage)
    }

    // Default fallback
    return getDefaultResponse()
  }, [chatbotState])

  const handleBookingFlow = (message: string, lowerMessage: string): string => {
    const step = chatbotState.conversationStep

    switch (step) {
      case 1: // Service selection
        const serviceNumber = parseInt(message.trim())
        if (serviceNumber >= 1 && serviceNumber <= SALON_SERVICES.length) {
          const selectedService = SALON_SERVICES[serviceNumber - 1]
          setChatbotState(prev => ({
            ...prev,
            selectedService: selectedService.id,
            conversationStep: 2
          }))
          return `Perfect! You've selected ${selectedService.name}.\n\nNow, what date would you like to book for? Please provide a date in the format: MM/DD/YYYY (e.g., 12/25/2024)`
        }
        return "Please select a valid service number (1-6)."

      case 2: // Date selection
        const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
        const match = message.match(datePattern)
        if (match) {
          const [, month, day, year] = match
          const selectedDate = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
          setChatbotState(prev => ({
            ...prev,
            selectedDate,
            conversationStep: 3
          }))

          const timesList = AVAILABLE_TIMES.map((time, index) =>
            `${index + 1}. ${time}`
          ).join('\n')

          return `Great! Date set to ${selectedDate}.\n\nWhat time would you prefer? Here are our available times:\n\n${timesList}\n\nPlease reply with the number of your preferred time (1-${AVAILABLE_TIMES.length}).`
        }
        return "Please provide a valid date in MM/DD/YYYY format."

      case 3: // Time selection
        const timeNumber = parseInt(message.trim())
        if (timeNumber >= 1 && timeNumber <= AVAILABLE_TIMES.length) {
          const selectedTime = AVAILABLE_TIMES[timeNumber - 1]
          setChatbotState(prev => ({
            ...prev,
            selectedTime,
            conversationStep: 4
          }))
          return `Excellent! Time set to ${selectedTime}.\n\nNow I need some information from you. What's your full name?`
        }
        return `Please select a valid time number (1-${AVAILABLE_TIMES.length}).`

      case 4: // Customer name
        setChatbotState(prev => ({
          ...prev,
          customerInfo: {
            ...prev.customerInfo,
            name: message.trim()
          } as any,
          conversationStep: 5
        }))
        return "Thank you! What's your email address?"

      case 5: // Customer email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailPattern.test(message.trim())) {
          setChatbotState(prev => ({
            ...prev,
            customerInfo: {
              ...prev.customerInfo!,
              email: message.trim()
            },
            conversationStep: 6
          }))
          return "Perfect! What's your phone number?"
        }
        return "Please provide a valid email address."

      case 6: // Customer phone
        const phonePattern = /^[\+]?[1-9][\d]{0,15}$/
        if (phonePattern.test(message.replace(/[\s\-\(\)]/g, ''))) {
          const phone = message.trim()

          setChatbotState(prev => ({
            ...prev,
            customerInfo: {
              ...prev.customerInfo!,
              phone: phone
            },
            conversationStep: 7
          }))

          // Return confirmation message - the actual booking will be handled by the AdvancedChatBot component
          return `Perfect! I've collected all your information:\n\n` +
            `👤 Name: ${chatbotState.customerInfo?.name}\n` +
            `📧 Email: ${chatbotState.customerInfo?.email}\n` +
            `📞 Phone: ${phone}\n` +
            `📅 Date: ${chatbotState.selectedDate}\n` +
            `🕐 Time: ${chatbotState.selectedTime}\n` +
            `💇‍♂️ Service: ${SALON_SERVICES.find(s => s.id === chatbotState.selectedService)?.name}\n\n` +
            `🔄 Processing your booking now...`
        }
        return "Please provide a valid phone number."

      default:
        return "I'm not sure what you mean. Let me start over. How can I help you today?"
    }
  }

  const getServiceInformation = (): string => {
    return 'Here are our current services and pricing:\n\n' +
      SALON_SERVICES.map(service =>
        `💇‍♂️ **${service.name}**\n` +
        `   📝 ${service.description}\n` +
        `   💰 Price: $${service.price}\n` +
        `   ⏰ Duration: ${service.duration} minutes\n` +
        `   📂 Category: ${service.category}`
      ).join('\n\n') +
      '\n\nAll services include a consultation and professional styling. Would you like to book any of these services?'
  }

  const getHoursInformation = (): string => {
    return '🕐 **Our Hours:**\n\n' +
      '• **Monday - Friday:** 9:00 AM - 8:00 PM\n' +
      '• **Saturday:** 8:00 AM - 6:00 PM\n' +
      '• **Sunday:** 10:00 AM - 5:00 PM\n\n' +
      'We recommend booking appointments in advance, especially on weekends!\n\n' +
      '📞 Call us at (555) 123-4567 to book your appointment.'
  }

  const getLocationInformation = (): string => {
    return '📍 **Our Location:**\n\n' +
      '🏢 **Modern Men Salon**\n' +
      '📍 123 Style Street, Downtown\n' +
      '🏙️ New York, NY 10001\n\n' +
      '🚗 **Parking:**\n' +
      '• Street parking available\n' +
      '• Nearby parking garage\n' +
      '• Easy access via public transport\n\n' +
      '📞 **Contact:**\n' +
      '• Phone: (555) 123-4567\n' +
      '• Email: info@modernmen.com\n\n' +
      'We\'re located in the heart of downtown with excellent accessibility!'
  }

  const getDefaultResponse = (): string => {
    return 'I\'m here to help with:\n\n' +
      '📅 **Booking appointments**\n' +
      '💇‍♂️ **Service information and pricing**\n' +
      '🕐 **Salon hours and location**\n' +
      '👨‍💼 **Stylist information**\n' +
      '🛍️ **Product recommendations**\n' +
      '🎁 **Loyalty program details**\n\n' +
      'What would you like to know more about? You can also type "book" to schedule an appointment!'
  }

  const resetConversation = useCallback(() => {
    setChatbotState({
      currentIntent: null,
      selectedService: null,
      selectedDate: null,
      selectedTime: null,
      customerInfo: null,
      conversationStep: 0
    })
  }, [])

  return {
    chatbotState,
    processMessage,
    resetConversation,
    services: SALON_SERVICES
  }
}
