export interface LanguageDetection {
  language: string
  confidence: number
  script: string
  region?: string
}

export interface TranslationRequest {
  text: string
  fromLanguage: string
  toLanguage: string
  context?: 'greeting' | 'service' | 'booking' | 'error' | 'confirmation'
}

export interface TranslationResponse {
  translatedText: string
  detectedLanguage?: string
  confidence: number
  alternatives?: Array<{
    text: string
    confidence: number
  }>
}

export interface LocalizedContent {
  language: string
  region?: string
  content: {
    greetings: Record<string, string>
    services: Record<string, string>
    booking: Record<string, string>
    errors: Record<string, string>
    confirmations: Record<string, string>
    help: Record<string, string>
  }
  culturalNotes?: {
    timeFormat: '12h' | '24h'
    dateFormat: string
    currency: string
    formalAddress: boolean
    businessHours: {
      weekend: boolean
      lunchBreak: boolean
    }
  }
}

export interface MultilingualConversation {
  sessionId: string
  primaryLanguage: string
  detectedLanguages: string[]
  translationHistory: Array<{
    originalText: string
    translatedText: string
    fromLanguage: string
    toLanguage: string
    timestamp: Date
  }>
  languageSwitches: Array<{
    fromLanguage: string
    toLanguage: string
    reason: 'user_request' | 'auto_detection' | 'context_switch'
    timestamp: Date
  }>
}

export class MultiLanguageSupport {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
  private readonly SUPPORTED_LANGUAGES = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'tr', 'cs', 'hu', 'th', 'vi', 'id', 'ms', 'tl'
  ]

  private localizedContent: Map<string, LocalizedContent> = new Map()
  private activeConversations: Map<string, MultilingualConversation> = new Map()

  constructor() {
    this.initializeLocalizedContent()
  }

  async detectLanguage(text: string): Promise<LanguageDetection> {
    try {
      // Use browser's built-in language detection for client-side
      if (typeof window !== 'undefined' && 'ai' in window) {
        // Future: Use Web AI API when available
        return this.fallbackLanguageDetection(text)
      }

      // Server-side detection
      const response = await fetch(`${this.API_BASE_URL}/language/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error('Language detection failed')
      }

      const result = await response.json()
      return {
        language: result.language,
        confidence: result.confidence,
        script: this.getScriptForLanguage(result.language),
        region: result.region
      }

    } catch (error) {
      console.error('Language detection error:', error)
      return this.fallbackLanguageDetection(text)
    }
  }

  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/language/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const result = await response.json()
      return {
        translatedText: result.translatedText,
        detectedLanguage: result.detectedLanguage,
        confidence: result.confidence,
        alternatives: result.alternatives
      }

    } catch (error) {
      console.error('Translation error:', error)
      return {
        translatedText: request.text, // Return original text if translation fails
        confidence: 0,
        alternatives: []
      }
    }
  }

  async processMultilingualMessage(
    sessionId: string,
    message: string,
    contextLanguage?: string
  ): Promise<{
    processedMessage: string
    detectedLanguage: string
    shouldTranslate: boolean
    translation?: TranslationResponse
  }> {
    // Detect language of the incoming message
    const detection = await this.detectLanguage(message)

    // Get or create conversation context
    let conversation = this.activeConversations.get(sessionId)
    if (!conversation) {
      conversation = this.createConversation(sessionId, detection.language)
      this.activeConversations.set(sessionId, conversation)
    }

    // Update conversation with detected language
    if (!conversation.detectedLanguages.includes(detection.language)) {
      conversation.detectedLanguages.push(detection.language)
    }

    // Determine if translation is needed
    const shouldTranslate = this.shouldTranslateMessage(
      detection.language,
      contextLanguage || conversation.primaryLanguage,
      conversation
    )

    let processedMessage = message
    let translation: TranslationResponse | undefined

    if (shouldTranslate) {
      translation = await this.translateText({
        text: message,
        fromLanguage: detection.language,
        toLanguage: conversation.primaryLanguage,
        context: 'general'
      })

      processedMessage = translation.translatedText

      // Record translation in conversation history
      conversation.translationHistory.push({
        originalText: message,
        translatedText: processedMessage,
        fromLanguage: detection.language,
        toLanguage: conversation.primaryLanguage,
        timestamp: new Date()
      })
    }

    return {
      processedMessage,
      detectedLanguage: detection.language,
      shouldTranslate,
      translation
    }
  }

  async generateLocalizedResponse(
    sessionId: string,
    responseKey: string,
    language: string,
    variables: Record<string, any> = {}
  ): Promise<string> {
    const conversation = this.activeConversations.get(sessionId)
    const targetLanguage = conversation?.primaryLanguage || language

    const localizedContent = this.localizedContent.get(targetLanguage)
    if (!localizedContent) {
      return this.getFallbackResponse(responseKey, variables)
    }

    // Find the response in the appropriate category
    const category = this.getCategoryForResponseKey(responseKey)
    const baseResponse = localizedContent.content[category]?.[responseKey]

    if (!baseResponse) {
      return this.getFallbackResponse(responseKey, variables)
    }

    // Apply cultural formatting
    let response = this.applyCulturalFormatting(baseResponse, localizedContent.culturalNotes)

    // Replace variables
    response = this.replaceVariables(response, variables, localizedContent.culturalNotes)

    return response
  }

  async switchLanguage(
    sessionId: string,
    newLanguage: string,
    reason: 'user_request' | 'auto_detection' | 'context_switch' = 'user_request'
  ): Promise<boolean> {
    const conversation = this.activeConversations.get(sessionId)
    if (!conversation) return false

    const oldLanguage = conversation.primaryLanguage

    if (oldLanguage === newLanguage) return true

    // Validate new language
    if (!this.SUPPORTED_LANGUAGES.includes(newLanguage)) {
      return false
    }

    // Update conversation
    conversation.primaryLanguage = newLanguage
    conversation.languageSwitches.push({
      fromLanguage: oldLanguage,
      toLanguage: newLanguage,
      reason,
      timestamp: new Date()
    })

    return true
  }

  getSupportedLanguages(): Array<{ code: string; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
    ]
  }

  getLocalizedServices(language: string): any[] {
    // Mock localized services - in reality, this would fetch from your services API
    const localizedServices = {
      en: [
        { id: '1', name: 'Classic Haircut', description: 'Traditional men\'s haircut' },
        { id: '2', name: 'Premium Haircut', description: 'Premium styling with wash' }
      ],
      es: [
        { id: '1', name: 'Corte Clásico', description: 'Corte de cabello tradicional para hombres' },
        { id: '2', name: 'Corte Premium', description: 'Estilizado premium con lavado' }
      ],
      fr: [
        { id: '1', name: 'Coupe Classique', description: 'Coupe de cheveux traditionnelle pour hommes' },
        { id: '2', name: 'Coupe Premium', description: 'Coiffage premium avec lavage' }
      ]
    }

    return localizedServices[language] || localizedServices.en
  }

  private initializeLocalizedContent(): void {
    // English content
    this.localizedContent.set('en', {
      language: 'en',
      region: 'US',
      content: {
        greetings: {
          welcome: 'Welcome to Modern Men Salon! How can I help you today?',
          hello: 'Hello! How can I assist you?',
          goodbye: 'Thank you for visiting! Have a great day!'
        },
        services: {
          haircut: 'Professional haircut service',
          beard_trim: 'Expert beard trimming and shaping',
          full_service: 'Complete haircut and beard service'
        },
        booking: {
          confirm: 'Your appointment has been confirmed for {date} at {time}',
          cancel: 'Your appointment has been cancelled',
          reschedule: 'Your appointment has been rescheduled to {date} at {time}'
        },
        errors: {
          general: 'I apologize, but I encountered an error. Please try again.',
          no_availability: 'I\'m sorry, but there are no available slots for that time.',
          invalid_input: 'I didn\'t understand that. Could you please rephrase?'
        },
        confirmations: {
          booking_success: 'Perfect! Your booking is confirmed.',
          service_selected: 'Great choice! You\'ve selected {service}.'
        },
        help: {
          general: 'I can help you book appointments, learn about our services, or answer questions about the salon.'
        }
      },
      culturalNotes: {
        timeFormat: '12h',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        formalAddress: false,
        businessHours: {
          weekend: true,
          lunchBreak: true
        }
      }
    })

    // Spanish content
    this.localizedContent.set('es', {
      language: 'es',
      region: 'ES',
      content: {
        greetings: {
          welcome: '¡Bienvenido a Modern Men Salon! ¿Cómo puedo ayudarte hoy?',
          hello: '¡Hola! ¿En qué puedo ayudarte?',
          goodbye: '¡Gracias por visitarnos! ¡Que tengas un excelente día!'
        },
        services: {
          haircut: 'Servicio profesional de corte de cabello',
          beard_trim: 'Recorte y moldeado experto de barba',
          full_service: 'Servicio completo de corte de cabello y barba'
        },
        booking: {
          confirm: 'Su cita ha sido confirmada para el {date} a las {time}',
          cancel: 'Su cita ha sido cancelada',
          reschedule: 'Su cita ha sido reprogramada para el {date} a las {time}'
        },
        errors: {
          general: 'Disculpe, pero encontré un error. Por favor, inténtelo de nuevo.',
          no_availability: 'Lo siento, pero no hay espacios disponibles para esa hora.',
          invalid_input: 'No entendí eso. ¿Podrías reformularlo?'
        },
        confirmations: {
          booking_success: '¡Perfecto! Su reserva está confirmada.',
          service_selected: '¡Excelente elección! Has seleccionado {service}.'
        },
        help: {
          general: 'Puedo ayudarte a reservar citas, conocer nuestros servicios o responder preguntas sobre el salón.'
        }
      },
      culturalNotes: {
        timeFormat: '24h',
        dateFormat: 'DD/MM/YYYY',
        currency: 'EUR',
        formalAddress: true,
        businessHours: {
          weekend: false,
          lunchBreak: true
        }
      }
    })

    // Add more languages as needed...
  }

  private fallbackLanguageDetection(text: string): LanguageDetection {
    // Simple fallback detection based on common words
    const languagePatterns = {
      es: /\b(hola|gracias|por favor|servicio|cita)\b/i,
      fr: /\b(bonjour|merci|s\'il vous plaît|service|rendez-vous)\b/i,
      de: /\b(hallo|danke|bitte|dienst|termin)\b/i,
      it: /\b(ciao|grazia|per favore|servizio|appuntamento)\b/i,
      pt: /\b(olá|obrigado|por favor|serviço|compromisso)\b/i,
      ru: /[а-яё]/i,
      ja: /[ぁ-ゖ゛-ゟ゠-ヿ]/,
      ko: /[가-힣]/,
      zh: /[一-龯]/,
      ar: /[\u0600-\u06FF]/,
      hi: /[\u0900-\u097F]/
    }

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(text)) {
        return {
          language: lang,
          confidence: 0.7,
          script: this.getScriptForLanguage(lang)
        }
      }
    }

    return {
      language: 'en',
      confidence: 0.5,
      script: 'Latn'
    }
  }

  private getScriptForLanguage(language: string): string {
    const scriptMap: Record<string, string> = {
      en: 'Latn', es: 'Latn', fr: 'Latn', de: 'Latn', it: 'Latn', pt: 'Latn',
      ru: 'Cyrl', ja: 'Jpan', ko: 'Hang', zh: 'Hans', ar: 'Arab', hi: 'Deva'
    }

    return scriptMap[language] || 'Latn'
  }

  private shouldTranslateMessage(
    detectedLanguage: string,
    contextLanguage: string,
    conversation: MultilingualConversation
  ): boolean {
    // Don't translate if languages match
    if (detectedLanguage === contextLanguage) return false

    // Don't translate if confidence is low
    if (detectedLanguage === 'en' && contextLanguage !== 'en') return true

    // Always translate if different from primary language
    return detectedLanguage !== conversation.primaryLanguage
  }

  private createConversation(sessionId: string, initialLanguage: string): MultilingualConversation {
    return {
      sessionId,
      primaryLanguage: initialLanguage,
      detectedLanguages: [initialLanguage],
      translationHistory: [],
      languageSwitches: []
    }
  }

  private getCategoryForResponseKey(key: string): keyof LocalizedContent['content'] {
    const categoryMap: Record<string, keyof LocalizedContent['content']> = {
      welcome: 'greetings',
      hello: 'greetings',
      goodbye: 'greetings',
      haircut: 'services',
      beard_trim: 'services',
      full_service: 'services',
      confirm: 'booking',
      cancel: 'booking',
      reschedule: 'booking',
      general: 'errors',
      no_availability: 'errors',
      invalid_input: 'errors',
      booking_success: 'confirmations',
      service_selected: 'confirmations'
    }

    return categoryMap[key] || 'help'
  }

  private applyCulturalFormatting(text: string, culturalNotes?: LocalizedContent['culturalNotes']): string {
    if (!culturalNotes) return text

    let formattedText = text

    // Apply time format preferences
    if (culturalNotes.timeFormat === '24h') {
      formattedText = formattedText.replace(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)/gi, (match, hour, minute, period) => {
        let hour24 = parseInt(hour)
        if (period.toLowerCase() === 'pm' && hour24 !== 12) hour24 += 12
        if (period.toLowerCase() === 'am' && hour24 === 12) hour24 = 0
        return `${hour24.toString().padStart(2, '0')}:${minute}`
      })
    }

    // Apply formal address preferences
    if (culturalNotes.formalAddress) {
      formattedText = formattedText.replace(/\byou\b/gi, 'you')
      // Add formal titles where appropriate
    }

    return formattedText
  }

  private replaceVariables(
    text: string,
    variables: Record<string, any>,
    culturalNotes?: LocalizedContent['culturalNotes']
  ): string {
    let processedText = text

    // Replace standard variables
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      processedText = processedText.replace(new RegExp(placeholder, 'g'), String(value))
    })

    // Apply cultural formatting to variables
    if (culturalNotes) {
      // Format dates according to cultural preferences
      if (variables.date && culturalNotes.dateFormat) {
        const date = new Date(variables.date)
        const formattedDate = this.formatDateForCulture(date, culturalNotes.dateFormat)
        processedText = processedText.replace(/{date}/g, formattedDate)
      }

      // Format currency
      if (variables.price && culturalNotes.currency) {
        const formattedPrice = this.formatCurrencyForCulture(variables.price, culturalNotes.currency)
        processedText = processedText.replace(/{price}/g, formattedPrice)
      }
    }

    return processedText
  }

  private formatDateForCulture(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`
      case 'MM/DD/YYYY':
      default:
        return `${month}/${day}/${year}`
    }
  }

  private formatCurrencyForCulture(amount: number, currency: string): string {
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CNY: '¥'
    }

    const symbol = currencySymbols[currency] || '$'
    return `${symbol}${amount}`
  }

  private getFallbackResponse(key: string, variables: Record<string, any> = {}): string {
    const fallbacks: Record<string, string> = {
      welcome: 'Welcome! How can I help you?',
      hello: 'Hello! How can I assist you?',
      goodbye: 'Thank you! Goodbye!',
      haircut: 'Haircut service',
      beard_trim: 'Beard trimming service',
      full_service: 'Complete service',
      confirm: 'Appointment confirmed',
      cancel: 'Appointment cancelled',
      reschedule: 'Appointment rescheduled',
      general: 'An error occurred. Please try again.',
      no_availability: 'No availability at that time.',
      invalid_input: 'I didn\'t understand. Please try again.',
      booking_success: 'Booking successful!',
      service_selected: 'Service selected.'
    }

    let response = fallbacks[key] || 'How can I help you?'

    // Replace variables in fallback
    Object.entries(variables).forEach(([key, value]) => {
      response = response.replace(new RegExp(`{${key}}`, 'g'), String(value))
    })

    return response
  }

  // Analytics and insights
  getLanguageAnalytics(): {
    totalConversations: number
    languageDistribution: Record<string, number>
    translationUsage: number
    popularLanguagePairs: Array<{ from: string; to: string; count: number }>
  } {
    const conversations = Array.from(this.activeConversations.values())
    const languageDistribution: Record<string, number> = {}
    const languagePairs: Record<string, number> = {}

    conversations.forEach(conversation => {
      conversation.detectedLanguages.forEach(lang => {
        languageDistribution[lang] = (languageDistribution[lang] || 0) + 1
      })

      conversation.translationHistory.forEach(translation => {
        const pair = `${translation.fromLanguage}->${translation.toLanguage}`
        languagePairs[pair] = (languagePairs[pair] || 0) + 1
      })
    })

    const popularLanguagePairs = Object.entries(languagePairs)
      .map(([pair, count]) => {
        const [from, to] = pair.split('->')
        return { from, to, count }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalConversations: conversations.length,
      languageDistribution,
      translationUsage: conversations.reduce((sum, conv) => sum + conv.translationHistory.length, 0),
      popularLanguagePairs
    }
  }
}

// Global multi-language support instance
export const multiLanguageSupport = new MultiLanguageSupport()
