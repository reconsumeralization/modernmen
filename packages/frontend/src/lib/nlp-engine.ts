import { ChatbotState, SALON_SERVICES } from '@/components/ai/ChatBotService'

export interface Intent {
  name: string
  confidence: number
  entities: Record<string, Entity>
}

export interface Entity {
  value: string
  confidence: number
  type: 'service' | 'date' | 'time' | 'name' | 'email' | 'phone' | 'location' | 'price'
  start: number
  end: number
}

export interface NLPAnalysis {
  intent: Intent
  sentiment: 'positive' | 'negative' | 'neutral'
  urgency: 'low' | 'medium' | 'high'
  context: {
    topic: string
    subtopics: string[]
    previousIntent?: string
    conversationFlow: string[]
  }
  suggestions: string[]
}

export interface ConversationMemory {
  userId?: string
  shortTerm: NLPAnalysis[]
  longTerm: {
    preferences: string[]
    pastIssues: string[]
    favoriteServices: string[]
    lastInteraction: Date
    satisfaction: number
  }
}

export class NLPEngine {
  private memory: Map<string, ConversationMemory> = new Map()
  private intentPatterns: Record<string, RegExp[]> = {
    booking: [
      /\b(book|schedule|appointment|reserve)\b/i,
      /\b(make|set up|arrange)\b.*\bappointment\b/i,
      /\b(want|need|looking)\b.*\b(cut|haircut|beard|service)\b/i
    ],
    inquiry: [
      /\b(what|how|when|where|who)\b.*\b(hour|open|close|location|address)\b/i,
      /\b(tell me|explain|describe)\b.*\b(service|price|cost|option)\b/i,
      /\b(do you|can you|are you)\b.*\b(offer|provide|have)\b/i
    ],
    confirmation: [
      /\b(yes|yeah|yep|sure|okay|confirm)\b/i,
      /\b(that works|perfect|great|good)\b/i,
      /\b(proceed|continue|go ahead)\b/i
    ],
    cancellation: [
      /\b(cancel|delete|remove|stop)\b.*\b(appointment|booking)\b/i,
      /\b(don't|do not|never mind)\b/i,
      /\b(change|modify|update)\b.*\b(appointment|booking)\b/i
    ],
    help: [
      /\b(help|assist|support|guide)\b/i,
      /\b(what can you do|how do i|how to)\b/i,
      /\b(confused|lost|stuck|don't understand)\b/i
    ],
    feedback: [
      /\b(great|awesome|excellent|amazing|love)\b/i,
      /\b(bad|terrible|awful|horrible|disappointed)\b/i,
      /\b(satisfied|happy|pleased|content)\b/i
    ]
  }

  private entityPatterns: Record<string, RegExp> = {
    date: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\b(january|february|march|april|may|june|july|august|september|october|november|december|\bmonday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.*?\d{1,2}(st|nd|rd|th)?|\btomorrow|today|next week|this week)\b/i,
    time: /\b(\d{1,2}:\d{2}\s*(am|pm)|\d{1,2}\s*(am|pm)|\d{1,2}:\d{2})\b/i,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    phone: /\b(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/,
    price: /\$\d+(\.\d{2})?/,
    service: new RegExp(`\\b(${SALON_SERVICES.map(s => s.name.toLowerCase().replace(/\s+/g, '\\s*')).join('|')})\\b`, 'i')
  }

  analyzeMessage(message: string, userId?: string, context?: ChatbotState): NLPAnalysis {
    const analysis: NLPAnalysis = {
      intent: this.detectIntent(message),
      sentiment: this.analyzeSentiment(message),
      urgency: this.detectUrgency(message),
      context: this.buildContext(message, context),
      suggestions: []
    }

    // Update conversation memory
    this.updateMemory(userId, analysis)

    // Generate suggestions based on analysis
    analysis.suggestions = this.generateSuggestions(analysis, context)

    return analysis
  }

  private detectIntent(message: string): Intent {
    const lowerMessage = message.toLowerCase()
    let bestIntent: Intent = { name: 'unknown', confidence: 0, entities: {} }

    for (const [intentName, patterns] of Object.entries(this.intentPatterns)) {
      let totalConfidence = 0
      let matchCount = 0

      for (const pattern of patterns) {
        const match = pattern.test(lowerMessage)
        if (match) {
          matchCount++
          totalConfidence += 0.8 // Base confidence for pattern match
        }
      }

      if (matchCount > 0) {
        const confidence = Math.min(totalConfidence / patterns.length, 0.95)
        if (confidence > bestIntent.confidence) {
          bestIntent = {
            name: intentName,
            confidence,
            entities: this.extractEntities(message)
          }
        }
      }
    }

    return bestIntent
  }

  private extractEntities(message: string): Record<string, Entity> {
    const entities: Record<string, Entity> = {}

    for (const [entityType, pattern] of Object.entries(this.entityPatterns)) {
      const matches = message.matchAll(new RegExp(pattern, 'gi'))

      for (const match of matches) {
        const value = match[0]
        const start = match.index!
        const end = start + value.length

        entities[entityType] = {
          value,
          confidence: 0.85,
          type: entityType as Entity['type'],
          start,
          end
        }
      }
    }

    return entities
  }

  private analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' {
    const lowerMessage = message.toLowerCase()

    const positiveWords = ['great', 'awesome', 'excellent', 'amazing', 'love', 'perfect', 'good', 'happy', 'pleased', 'satisfied', 'wonderful', 'fantastic']
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointed', 'angry', 'frustrated', 'hate', 'worst', 'poor', 'disgusting']

    let positiveScore = 0
    let negativeScore = 0

    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveScore += 1
    })

    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeScore += 1
    })

    if (positiveScore > negativeScore) return 'positive'
    if (negativeScore > positiveScore) return 'negative'
    return 'neutral'
  }

  private detectUrgency(message: string): 'low' | 'medium' | 'high' {
    const lowerMessage = message.toLowerCase()
    const urgentWords = ['urgent', 'asap', 'emergency', 'immediately', 'right now', 'quickly', 'soon as possible']

    if (urgentWords.some(word => lowerMessage.includes(word))) {
      return 'high'
    }

    const mediumWords = ['today', 'tomorrow', 'this week', 'soon', 'quick', 'fast']
    if (mediumWords.some(word => lowerMessage.includes(word))) {
      return 'medium'
    }

    return 'low'
  }

  private buildContext(message: string, chatbotState?: ChatbotState) {
    const context = {
      topic: this.extractTopic(message),
      subtopics: this.extractSubtopics(message),
      previousIntent: chatbotState?.currentIntent || undefined,
      conversationFlow: this.buildConversationFlow(chatbotState)
    }

    return context
  }

  private extractTopic(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      return 'booking'
    }
    if (lowerMessage.includes('service') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'services'
    }
    if (lowerMessage.includes('hour') || lowerMessage.includes('location') || lowerMessage.includes('address')) {
      return 'information'
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return 'support'
    }

    return 'general'
  }

  private extractSubtopics(message: string): string[] {
    const lowerMessage = message.toLowerCase()
    const subtopics: string[] = []

    const topicKeywords = {
      booking: ['date', 'time', 'service', 'stylist', 'availability'],
      services: ['haircut', 'beard', 'color', 'treatment', 'package'],
      information: ['hours', 'location', 'contact', 'parking', 'policies'],
      support: ['help', 'problem', 'issue', 'question', 'guidance']
    }

    const topic = this.extractTopic(message)
    const keywords = topicKeywords[topic as keyof typeof topicKeywords] || []

    keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        subtopics.push(keyword)
      }
    })

    return subtopics
  }

  private buildConversationFlow(chatbotState?: ChatbotState): string[] {
    if (!chatbotState) return ['initial']

    const flow: string[] = ['greeting']

    if (chatbotState.currentIntent) {
      flow.push(chatbotState.currentIntent)
    }

    if (chatbotState.conversationStep > 0) {
      flow.push(`step_${chatbotState.conversationStep}`)
    }

    return flow
  }

  private generateSuggestions(analysis: NLPAnalysis, context?: ChatbotState): string[] {
    const suggestions: string[] = []

    switch (analysis.intent.name) {
      case 'booking':
        if (!context?.selectedService) {
          suggestions.push('View available services')
        }
        if (!context?.selectedDate) {
          suggestions.push('Check available dates')
        }
        suggestions.push('Speak to stylist directly')
        break

      case 'inquiry':
        suggestions.push('Call the salon')
        suggestions.push('View service menu')
        suggestions.push('Check location on map')
        break

      case 'help':
        suggestions.push('Start booking process')
        suggestions.push('Browse services')
        suggestions.push('Contact support')
        break

      default:
        suggestions.push('Book an appointment')
        suggestions.push('View services')
        suggestions.push('Get salon information')
    }

    return suggestions.slice(0, 3) // Limit to 3 suggestions
  }

  private updateMemory(userId: string | undefined, analysis: NLPAnalysis): void {
    if (!userId) return

    const memory = this.memory.get(userId) || {
      userId,
      shortTerm: [],
      longTerm: {
        preferences: [],
        pastIssues: [],
        favoriteServices: [],
        lastInteraction: new Date(),
        satisfaction: 0.5
      }
    }

    // Update short-term memory (last 10 interactions)
    memory.shortTerm.push(analysis)
    if (memory.shortTerm.length > 10) {
      memory.shortTerm.shift()
    }

    // Update long-term memory
    memory.longTerm.lastInteraction = new Date()

    if (analysis.sentiment === 'positive') {
      memory.longTerm.satisfaction = Math.min(memory.longTerm.satisfaction + 0.1, 1.0)
    } else if (analysis.sentiment === 'negative') {
      memory.longTerm.satisfaction = Math.max(memory.longTerm.satisfaction - 0.1, 0.0)
    }

    // Extract preferences from entities
    if (analysis.intent.entities.service) {
      const service = analysis.intent.entities.service.value.toLowerCase()
      if (!memory.longTerm.favoriteServices.includes(service)) {
        memory.longTerm.favoriteServices.push(service)
      }
    }

    this.memory.set(userId, memory)
  }

  getMemory(userId: string): ConversationMemory | undefined {
    return this.memory.get(userId)
  }

  getPersonalizedResponse(userId: string, baseResponse: string): string {
    const memory = this.memory.get(userId)
    if (!memory) return baseResponse

    let personalizedResponse = baseResponse

    // Add personalized touches based on memory
    if (memory.longTerm.favoriteServices.length > 0) {
      personalizedResponse += `\n\nI remember you were interested in ${memory.longTerm.favoriteServices.join(', ')} before.`
    }

    if (memory.longTerm.satisfaction > 0.8) {
      personalizedResponse += "\n\nI'm glad you're enjoying our services! 😊"
    }

    return personalizedResponse
  }

  predictNextIntent(userId: string): string[] {
    const memory = this.memory.get(userId)
    if (!memory || memory.shortTerm.length < 2) return []

    // Simple prediction based on recent patterns
    const recentIntents = memory.shortTerm.slice(-3).map(a => a.intent.name)
    const intentCounts = recentIntents.reduce((acc, intent) => {
      acc[intent] = (acc[intent] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(intentCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([intent]) => intent)
  }
}

// Global NLP engine instance
export const nlpEngine = new NLPEngine()
