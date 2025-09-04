import { WebSocketMessage } from './websocket'
import { NLPAnalysis } from './nlp-engine'

export interface ConversationContext {
  sessionId: string
  userId?: string
  currentIntent: string
  conversationState: ConversationState
  entities: Record<string, any>
  history: ConversationHistoryItem[]
  metadata: ConversationMetadata
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface ConversationState {
  step: number
  totalSteps: number
  isComplete: boolean
  isActive: boolean
  lastActivity: Date
  flow: ConversationFlow
}

export interface ConversationHistoryItem {
  id: string
  message: WebSocketMessage
  analysis: NLPAnalysis
  timestamp: Date
  contextSnapshot: Partial<ConversationContext>
  actions: string[]
  outcomes: string[]
}

export interface ConversationMetadata {
  source: 'text' | 'voice' | 'widget' | 'api'
  platform: 'web' | 'mobile' | 'api'
  language: string
  timezone: string
  userAgent?: string
  ipAddress?: string
  location?: {
    country: string
    city: string
    timezone: string
  }
}

export interface UserPreferences {
  communicationStyle: 'formal' | 'casual' | 'professional'
  preferredTimes: string[]
  favoriteServices: string[]
  notificationPreferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
  language: string
  accessibility: {
    highContrast: boolean
    largeText: boolean
    screenReader: boolean
  }
}

export interface ConversationFlow {
  name: string
  steps: FlowStep[]
  currentStepIndex: number
  variables: Record<string, any>
  conditions: FlowCondition[]
}

export interface FlowStep {
  id: string
  name: string
  type: 'input' | 'confirmation' | 'action' | 'branch'
  prompt: string
  validation?: ValidationRule
  actions: StepAction[]
  branches?: FlowBranch[]
}

export interface ValidationRule {
  type: 'required' | 'pattern' | 'range' | 'custom'
  pattern?: RegExp
  min?: number
  max?: number
  customValidator?: (value: any) => boolean
  errorMessage: string
}

export interface StepAction {
  type: 'set_variable' | 'send_message' | 'create_appointment' | 'update_user' | 'external_api'
  payload: any
}

export interface FlowBranch {
  condition: string
  targetStepId: string
  fallbackStepId?: string
}

export interface FlowCondition {
  id: string
  expression: string
  variables: string[]
}

export class ConversationContextManager {
  private contexts: Map<string, ConversationContext> = new Map()
  private flows: Map<string, ConversationFlow> = new Map()

  constructor() {
    this.initializeDefaultFlows()
  }

  private initializeDefaultFlows(): void {
    // Booking flow
    const bookingFlow: ConversationFlow = {
      name: 'booking',
      currentStepIndex: 0,
      variables: {},
      conditions: [],
      steps: [
        {
          id: 'service_selection',
          name: 'Service Selection',
          type: 'input',
          prompt: 'What service would you like to book?',
          validation: {
            type: 'required',
            errorMessage: 'Please select a service'
          },
          actions: [
            {
              type: 'set_variable',
              payload: { key: 'selectedService', source: 'input' }
            }
          ]
        },
        {
          id: 'date_selection',
          name: 'Date Selection',
          type: 'input',
          prompt: 'What date would you like to book?',
          validation: {
            type: 'pattern',
            pattern: /^\d{1,2}\/\d{1,2}\/\d{4}$/,
            errorMessage: 'Please enter date in MM/DD/YYYY format'
          },
          actions: [
            {
              type: 'set_variable',
              payload: { key: 'selectedDate', source: 'input' }
            }
          ]
        },
        {
          id: 'time_selection',
          name: 'Time Selection',
          type: 'input',
          prompt: 'What time would you prefer?',
          validation: {
            type: 'pattern',
            pattern: /^\d{1,2}:\d{2}\s*(AM|PM|am|pm)$/,
            errorMessage: 'Please enter time in HH:MM AM/PM format'
          },
          actions: [
            {
              type: 'set_variable',
              payload: { key: 'selectedTime', source: 'input' }
            }
          ]
        },
        {
          id: 'customer_info',
          name: 'Customer Information',
          type: 'input',
          prompt: 'Please provide your name and contact information',
          validation: {
            type: 'required',
            errorMessage: 'Customer information is required'
          },
          actions: [
            {
              type: 'set_variable',
              payload: { key: 'customerInfo', source: 'input' }
            }
          ]
        },
        {
          id: 'confirmation',
          name: 'Confirmation',
          type: 'confirmation',
          prompt: 'Please confirm your booking details',
          actions: [
            {
              type: 'create_appointment',
              payload: { useVariables: true }
            }
          ]
        }
      ]
    }

    this.flows.set('booking', bookingFlow)
  }

  createContext(sessionId: string, userId?: string): ConversationContext {
    const context: ConversationContext = {
      sessionId,
      userId,
      currentIntent: 'greeting',
      conversationState: {
        step: 0,
        totalSteps: 0,
        isComplete: false,
        isActive: true,
        lastActivity: new Date(),
        flow: this.flows.get('booking') || this.createEmptyFlow()
      },
      entities: {},
      history: [],
      metadata: {
        source: 'text',
        platform: 'web',
        language: 'en-US',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      preferences: {
        communicationStyle: 'casual',
        preferredTimes: [],
        favoriteServices: [],
        notificationPreferences: {
          email: true,
          sms: false,
          push: true
        },
        language: 'en-US',
        accessibility: {
          highContrast: false,
          largeText: false,
          screenReader: false
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.contexts.set(sessionId, context)
    return context
  }

  getContext(sessionId: string): ConversationContext | undefined {
    return this.contexts.get(sessionId)
  }

  updateContext(sessionId: string, updates: Partial<ConversationContext>): ConversationContext | null {
    const context = this.contexts.get(sessionId)
    if (!context) return null

    const updatedContext = {
      ...context,
      ...updates,
      updatedAt: new Date(),
      conversationState: {
        ...context.conversationState,
        ...updates.conversationState,
        lastActivity: new Date()
      }
    }

    this.contexts.set(sessionId, updatedContext)
    return updatedContext
  }

  addMessage(sessionId: string, message: WebSocketMessage, analysis: NLPAnalysis): boolean {
    const context = this.contexts.get(sessionId)
    if (!context) return false

    const historyItem: ConversationHistoryItem = {
      id: message.id,
      message,
      analysis,
      timestamp: new Date(),
      contextSnapshot: {
        currentIntent: context.currentIntent,
        entities: { ...context.entities },
        conversationState: { ...context.conversationState }
      },
      actions: this.extractActions(analysis),
      outcomes: []
    }

    context.history.push(historyItem)
    context.updatedAt = new Date()
    context.conversationState.lastActivity = new Date()

    // Update intent and entities
    context.currentIntent = analysis.intent.name
    Object.assign(context.entities, analysis.intent.entities)

    // Update flow progress
    this.updateFlowProgress(context)

    return true
  }

  private extractActions(analysis: NLPAnalysis): string[] {
    const actions: string[] = []

    // Extract actions based on intent and entities
    if (analysis.intent.name === 'booking') {
      actions.push('initiate_booking_flow')
    }

    if (analysis.intent.entities.service) {
      actions.push('service_selected')
    }

    if (analysis.intent.entities.date) {
      actions.push('date_selected')
    }

    if (analysis.intent.entities.time) {
      actions.push('time_selected')
    }

    return actions
  }

  private updateFlowProgress(context: ConversationContext): void {
    const flow = context.conversationState.flow

    if (flow.currentStepIndex < flow.steps.length - 1) {
      // Check if current step is complete
      const currentStep = flow.steps[flow.currentStepIndex]
      if (this.isStepComplete(currentStep, context)) {
        flow.currentStepIndex++
        context.conversationState.step = flow.currentStepIndex
      }
    }

    // Check if flow is complete
    context.conversationState.isComplete = flow.currentStepIndex >= flow.steps.length - 1
  }

  private isStepComplete(step: FlowStep, context: ConversationContext): boolean {
    if (!step.validation) return true

    switch (step.validation.type) {
      case 'required':
        return context.entities[step.id] !== undefined
      case 'pattern':
        const value = context.entities[step.id]
        return step.validation.pattern?.test(value) || false
      default:
        return true
    }
  }

  getCurrentStep(sessionId: string): FlowStep | null {
    const context = this.contexts.get(sessionId)
    if (!context) return null

    const flow = context.conversationState.flow
    if (flow.currentStepIndex >= flow.steps.length) return null

    return flow.steps[flow.currentStepIndex]
  }

  setFlowVariable(sessionId: string, key: string, value: any): boolean {
    const context = this.contexts.get(sessionId)
    if (!context) return false

    context.conversationState.flow.variables[key] = value
    return true
  }

  getFlowVariable(sessionId: string, key: string): any {
    const context = this.contexts.get(sessionId)
    if (!context) return undefined

    return context.conversationState.flow.variables[key]
  }

  resetFlow(sessionId: string): boolean {
    const context = this.contexts.get(sessionId)
    if (!context) return false

    context.conversationState.flow.currentStepIndex = 0
    context.conversationState.step = 0
    context.conversationState.isComplete = false
    context.entities = {}
    return true
  }

  endSession(sessionId: string): boolean {
    const context = this.contexts.get(sessionId)
    if (!context) return false

    context.conversationState.isActive = false
    return true
  }

  getActiveContexts(): ConversationContext[] {
    return Array.from(this.contexts.values()).filter(ctx => ctx.conversationState.isActive)
  }

  getContextByUser(userId: string): ConversationContext[] {
    return Array.from(this.contexts.values()).filter(ctx => ctx.userId === userId)
  }

  cleanupInactiveContexts(maxAge: number = 24 * 60 * 60 * 1000): number {
    const cutoff = Date.now() - maxAge
    let removed = 0

    for (const [sessionId, context] of this.contexts.entries()) {
      if (!context.conversationState.isActive &&
          context.conversationState.lastActivity.getTime() < cutoff) {
        this.contexts.delete(sessionId)
        removed++
      }
    }

    return removed
  }

  private createEmptyFlow(): ConversationFlow {
    return {
      name: 'default',
      currentStepIndex: 0,
      variables: {},
      conditions: [],
      steps: []
    }
  }

  // Analytics and insights
  getConversationStats(): {
    totalConversations: number
    activeConversations: number
    completedFlows: number
    averageCompletionTime: number
  } {
    const contexts = Array.from(this.contexts.values())
    const activeContexts = contexts.filter(ctx => ctx.conversationState.isActive)
    const completedContexts = contexts.filter(ctx => ctx.conversationState.isComplete)

    const completionTimes = completedContexts
      .filter(ctx => ctx.history.length > 0)
      .map(ctx => ctx.updatedAt.getTime() - ctx.createdAt.getTime())

    const averageCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      : 0

    return {
      totalConversations: contexts.length,
      activeConversations: activeContexts.length,
      completedFlows: completedContexts.length,
      averageCompletionTime
    }
  }
}

// Global context manager instance
export const conversationManager = new ConversationContextManager()
