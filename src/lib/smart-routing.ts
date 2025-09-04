import { WebSocketMessage } from './websocket'
import { NLPAnalysis } from './nlp-engine'
import { ConversationContext } from './conversation-context'

export interface Agent {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'online' | 'offline' | 'busy' | 'away'
  skills: string[]
  languages: string[]
  specialties: string[]
  experience: number // years
  rating: number
  currentConversations: number
  maxConcurrentConversations: number
  responseTime: number // average in minutes
  lastActivity: Date
  performance: {
    resolvedConversations: number
    averageResolutionTime: number
    customerSatisfaction: number
    transferRate: number
  }
}

export interface RoutingRule {
  id: string
  name: string
  conditions: RoutingCondition[]
  priority: number
  targetAgents: string[] // Agent IDs
  fallbackAgents: string[]
  escalationTime: number // minutes
  reason: string
  isActive: boolean
}

export interface RoutingCondition {
  type: 'intent_confidence' | 'sentiment' | 'complexity' | 'urgency' | 'keywords' | 'user_history' | 'time' | 'channel' | 'language'
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in'
  value: any
  weight: number
}

export interface RoutingDecision {
  shouldEscalate: boolean
  confidence: number
  recommendedAgent?: Agent
  alternativeAgents: Agent[]
  reason: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  estimatedWaitTime: number // minutes
  routingRule?: RoutingRule
}

export interface ConversationTransfer {
  id: string
  conversationId: string
  fromAgent?: string // bot or agent ID
  toAgent: string
  reason: string
  initiatedBy: 'system' | 'user' | 'agent'
  transferType: 'escalation' | 'reassignment' | 'handover'
  timestamp: Date
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  notes?: string
  customerFeedback?: {
    rating: number
    comments: string
  }
}

export interface RoutingAnalytics {
  totalConversations: number
  escalatedConversations: number
  averageEscalationTime: number
  resolutionRate: number
  customerSatisfaction: number
  agentPerformance: Record<string, {
    conversationsHandled: number
    averageResolutionTime: number
    satisfactionScore: number
    transferRate: number
  }>
  commonEscalationReasons: Record<string, number>
}

export class SmartRoutingService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
  private agents: Map<string, Agent> = new Map()
  private routingRules: RoutingRule[] = []
  private activeTransfers: Map<string, ConversationTransfer> = new Map()

  constructor() {
    this.initializeDefaultRules()
    this.loadAgents()
  }

  private initializeDefaultRules(): void {
    // High urgency rule
    const highUrgencyRule: RoutingRule = {
      id: 'high_urgency',
      name: 'High Urgency Escalation',
      conditions: [
        {
          type: 'urgency',
          operator: 'equals',
          value: 'high',
          weight: 1.0
        }
      ],
      priority: 10,
      targetAgents: [], // Will be filled with available senior agents
      fallbackAgents: [],
      escalationTime: 1, // 1 minute
      reason: 'High urgency conversation requiring immediate human attention',
      isActive: true
    }

    // Low intent confidence rule
    const lowConfidenceRule: RoutingRule = {
      id: 'low_confidence',
      name: 'Low Confidence Escalation',
      conditions: [
        {
          type: 'intent_confidence',
          operator: 'less_than',
          value: 0.6,
          weight: 0.8
        },
        {
          type: 'complexity',
          operator: 'greater_than',
          value: 0.7,
          weight: 0.6
        }
      ],
      priority: 7,
      targetAgents: [], // Experienced agents
      fallbackAgents: [],
      escalationTime: 3,
      reason: 'Low confidence in bot understanding requiring human clarification',
      isActive: true
    }

    // Negative sentiment rule
    const negativeSentimentRule: RoutingRule = {
      id: 'negative_sentiment',
      name: 'Negative Sentiment Escalation',
      conditions: [
        {
          type: 'sentiment',
          operator: 'equals',
          value: 'negative',
          weight: 0.9
        }
      ],
      priority: 9,
      targetAgents: [], // Customer service specialists
      fallbackAgents: [],
      escalationTime: 2,
      reason: 'Negative customer sentiment requiring empathetic human handling',
      isActive: true
    }

    // VIP customer rule
    const vipCustomerRule: RoutingRule = {
      id: 'vip_customer',
      name: 'VIP Customer Priority',
      conditions: [
        {
          type: 'user_history',
          operator: 'contains',
          value: 'vip',
          weight: 0.7
        }
      ],
      priority: 8,
      targetAgents: [], // Senior agents
      fallbackAgents: [],
      escalationTime: 1,
      reason: 'VIP customer requiring priority handling',
      isActive: true
    }

    // Complex booking rule
    const complexBookingRule: RoutingRule = {
      id: 'complex_booking',
      name: 'Complex Booking Assistance',
      conditions: [
        {
          type: 'keywords',
          operator: 'contains',
          value: ['cancel', 'change', 'refund', 'complaint', 'problem'],
          weight: 0.8
        },
        {
          type: 'intent_confidence',
          operator: 'less_than',
          value: 0.7,
          weight: 0.5
        }
      ],
      priority: 6,
      targetAgents: [], // Booking specialists
      fallbackAgents: [],
      escalationTime: 2,
      reason: 'Complex booking issue requiring specialized assistance',
      isActive: true
    }

    this.routingRules = [
      highUrgencyRule,
      negativeSentimentRule,
      vipCustomerRule,
      lowConfidenceRule,
      complexBookingRule
    ]
  }

  async evaluateRouting(
    sessionId: string,
    message: WebSocketMessage,
    analysis: NLPAnalysis,
    context: ConversationContext
  ): Promise<RoutingDecision> {
    const decision: RoutingDecision = {
      shouldEscalate: false,
      confidence: 0,
      alternativeAgents: [],
      reason: '',
      urgency: 'low',
      estimatedWaitTime: 0
    }

    // Evaluate each routing rule
    for (const rule of this.routingRules.filter(r => r.isActive)) {
      const ruleMatch = await this.evaluateRule(rule, message, analysis, context)
      if (ruleMatch.shouldEscalate) {
        decision.shouldEscalate = true
        decision.confidence = Math.max(decision.confidence, ruleMatch.confidence)
        decision.routingRule = rule
        decision.reason = rule.reason
        decision.urgency = this.calculateUrgency(rule, analysis)
        break // Use highest priority matching rule
      }
    }

    // If escalation is needed, find the best agent
    if (decision.shouldEscalate) {
      const { recommendedAgent, alternativeAgents, estimatedWaitTime } =
        await this.findBestAgent(decision.routingRule!, context)

      decision.recommendedAgent = recommendedAgent
      decision.alternativeAgents = alternativeAgents
      decision.estimatedWaitTime = estimatedWaitTime
    }

    // Override for critical situations
    if (analysis.urgency === 'high' || analysis.sentiment === 'negative') {
      decision.shouldEscalate = true
      decision.urgency = 'high'
      decision.reason = 'Critical situation requiring immediate human attention'
    }

    return decision
  }

  private async evaluateRule(
    rule: RoutingRule,
    message: WebSocketMessage,
    analysis: NLPAnalysis,
    context: ConversationContext
  ): Promise<{ shouldEscalate: boolean; confidence: number }> {
    let totalWeight = 0
    let matchedWeight = 0

    for (const condition of rule.conditions) {
      totalWeight += condition.weight
      const conditionMet = await this.evaluateCondition(condition, message, analysis, context)

      if (conditionMet) {
        matchedWeight += condition.weight
      }
    }

    const confidence = totalWeight > 0 ? matchedWeight / totalWeight : 0
    const shouldEscalate = confidence >= 0.6 // 60% confidence threshold

    return { shouldEscalate, confidence }
  }

  private async evaluateCondition(
    condition: RoutingCondition,
    message: WebSocketMessage,
    analysis: NLPAnalysis,
    context: ConversationContext
  ): Promise<boolean> {
    switch (condition.type) {
      case 'intent_confidence':
        return this.evaluateNumericCondition(analysis.intent.confidence, condition.operator, condition.value)

      case 'sentiment':
        return analysis.sentiment === condition.value

      case 'complexity':
        const complexity = this.calculateComplexity(analysis)
        return this.evaluateNumericCondition(complexity, condition.operator, condition.value)

      case 'urgency':
        return analysis.urgency === condition.value

      case 'keywords':
        const messageText = message.content.toLowerCase()
        if (Array.isArray(condition.value)) {
          return condition.value.some(keyword => messageText.includes(keyword.toLowerCase()))
        }
        return messageText.includes(condition.value.toLowerCase())

      case 'user_history':
        return await this.checkUserHistoryCondition(context.userId!, condition)

      case 'time':
        return this.evaluateTimeCondition(condition)

      case 'channel':
        return message.sender === condition.value

      case 'language':
        // Would need language detection integration
        return true

      default:
        return false
    }
  }

  private evaluateNumericCondition(value: number, operator: string, target: number): boolean {
    switch (operator) {
      case 'equals':
        return Math.abs(value - target) < 0.1
      case 'greater_than':
        return value > target
      case 'less_than':
        return value < target
      default:
        return false
    }
  }

  private calculateComplexity(analysis: NLPAnalysis): number {
    let complexity = 0

    // Intent confidence inversely affects complexity
    complexity += (1 - analysis.intent.confidence) * 0.4

    // Multiple entities increase complexity
    const entityCount = Object.keys(analysis.intent.entities).length
    complexity += Math.min(entityCount / 5, 0.3)

    // Long messages might be more complex
    if (analysis.context.topic === 'general') {
      complexity += 0.2
    }

    // Negative sentiment increases complexity
    if (analysis.sentiment === 'negative') {
      complexity += 0.2
    }

    return Math.min(complexity, 1)
  }

  private async checkUserHistoryCondition(userId: string | undefined, condition: RoutingCondition): Promise<boolean> {
    if (!userId) return false

    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/profile`)
      if (!response.ok) return false

      const profile = await response.json()

      switch (condition.value) {
        case 'vip':
          return profile.loyaltyTier === 'gold' || profile.loyaltyTier === 'platinum'
        case 'frequent':
          return profile.totalVisits > 10
        case 'new':
          return profile.totalVisits <= 2
        case 'complainer':
          return profile.complaintCount > 0
        default:
          return false
      }
    } catch (error) {
      return false
    }
  }

  private evaluateTimeCondition(condition: RoutingCondition): boolean {
    const now = new Date()
    const hour = now.getHours()

    switch (condition.value) {
      case 'business_hours':
        return hour >= 9 && hour <= 18
      case 'after_hours':
        return hour < 9 || hour > 18
      case 'peak_hours':
        return (hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 19)
      default:
        return false
    }
  }

  private calculateUrgency(rule: RoutingRule, analysis: NLPAnalysis): 'low' | 'medium' | 'high' | 'critical' {
    if (analysis.urgency === 'high' || analysis.sentiment === 'negative') {
      return 'high'
    }

    if (rule.priority >= 9) return 'high'
    if (rule.priority >= 7) return 'medium'
    return 'low'
  }

  private async findBestAgent(
    rule: RoutingRule,
    context: ConversationContext
  ): Promise<{
    recommendedAgent?: Agent
    alternativeAgents: Agent[]
    estimatedWaitTime: number
  }> {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => agent.status === 'online' && agent.currentConversations < agent.maxConcurrentConversations)

    if (availableAgents.length === 0) {
      return {
        alternativeAgents: [],
        estimatedWaitTime: 15 // 15 minutes default wait
      }
    }

    // Score agents based on the routing rule and context
    const scoredAgents = availableAgents.map(agent => ({
      agent,
      score: this.scoreAgentForRule(agent, rule, context)
    })).sort((a, b) => b.score - a.score)

    const recommendedAgent = scoredAgents[0]?.agent
    const alternativeAgents = scoredAgents.slice(1, 4).map(s => s.agent)

    // Estimate wait time based on agent workload
    const estimatedWaitTime = recommendedAgent
      ? Math.max(1, recommendedAgent.currentConversations * 2)
      : 10

    return {
      recommendedAgent,
      alternativeAgents,
      estimatedWaitTime
    }
  }

  private scoreAgentForRule(agent: Agent, rule: RoutingRule, context: ConversationContext): number {
    let score = 0

    // Base availability score
    score += (1 - agent.currentConversations / agent.maxConcurrentConversations) * 20

    // Skills matching
    if (rule.conditions.some(c => c.type === 'keywords' && c.value.includes('booking'))) {
      if (agent.skills.includes('booking')) score += 15
    }

    if (rule.conditions.some(c => c.type === 'sentiment' && c.value === 'negative')) {
      if (agent.skills.includes('customer_service')) score += 15
    }

    // Experience bonus
    score += Math.min(agent.experience * 2, 10)

    // Performance bonus
    score += agent.rating * 5
    score += (agent.performance.customerSatisfaction - 3) * 2 // Bonus for above-average satisfaction

    // Language matching (if context includes language info)
    if (context.metadata.language && agent.languages.includes(context.metadata.language)) {
      score += 10
    }

    // Specialty matching
    if (context.currentIntent === 'booking' && agent.specialties.includes('appointments')) {
      score += 15
    }

    return score
  }

  async initiateTransfer(
    conversationId: string,
    routingDecision: RoutingDecision,
    initiatedBy: 'system' | 'user' | 'agent' = 'system'
  ): Promise<ConversationTransfer | null> {
    if (!routingDecision.recommendedAgent) return null

    const transfer: ConversationTransfer = {
      id: this.generateTransferId(),
      conversationId,
      toAgent: routingDecision.recommendedAgent.id,
      reason: routingDecision.reason,
      initiatedBy,
      transferType: 'escalation',
      timestamp: new Date(),
      status: 'pending'
    }

    this.activeTransfers.set(transfer.id, transfer)

    // Notify the agent
    await this.notifyAgent(transfer, routingDecision.recommendedAgent)

    return transfer
  }

  private async notifyAgent(transfer: ConversationTransfer, agent: Agent): Promise<void> {
    try {
      const notification = {
        type: 'transfer_request',
        transferId: transfer.id,
        conversationId: transfer.conversationId,
        reason: transfer.reason,
        priority: 'high'
      }

      // Send notification via WebSocket or API
      await fetch(`${this.API_BASE_URL}/agents/${agent.id}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      })
    } catch (error) {
      console.error('Failed to notify agent:', error)
    }
  }

  async acceptTransfer(transferId: string, agentId: string): Promise<boolean> {
    const transfer = this.activeTransfers.get(transferId)
    if (!transfer || transfer.toAgent !== agentId) return false

    transfer.status = 'accepted'

    // Update agent status
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.currentConversations++
      agent.status = agent.currentConversations >= agent.maxConcurrentConversations ? 'busy' : 'online'
    }

    return true
  }

  async rejectTransfer(transferId: string, agentId: string, reason?: string): Promise<boolean> {
    const transfer = this.activeTransfers.get(transferId)
    if (!transfer || transfer.toAgent !== agentId) return false

    transfer.status = 'rejected'
    transfer.notes = reason

    // Try to find an alternative agent
    // Implementation would re-run routing logic

    return true
  }

  private async loadAgents(): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/agents`)
      if (!response.ok) throw new Error('Failed to load agents')

      const agentsData = await response.json()
      agentsData.forEach((agent: Agent) => {
        this.agents.set(agent.id, agent)
      })
    } catch (error) {
      console.error('Failed to load agents:', error)
      // Load mock agents for development
      this.loadMockAgents()
    }
  }

  private loadMockAgents(): void {
    const mockAgents: Agent[] = [
      {
        id: 'agent_1',
        name: 'Sarah Johnson',
        email: 'sarah@modernmen.com',
        status: 'online',
        skills: ['booking', 'customer_service'],
        languages: ['en', 'es'],
        specialties: ['appointments', 'hair_services'],
        experience: 3,
        rating: 4.8,
        currentConversations: 2,
        maxConcurrentConversations: 5,
        responseTime: 2,
        lastActivity: new Date(),
        performance: {
          resolvedConversations: 245,
          averageResolutionTime: 8,
          customerSatisfaction: 4.6,
          transferRate: 0.05
        }
      },
      {
        id: 'agent_2',
        name: 'Mike Chen',
        email: 'mike@modernmen.com',
        status: 'online',
        skills: ['technical_support', 'inventory'],
        languages: ['en', 'zh'],
        specialties: ['product_inquiries', 'technical_issues'],
        experience: 5,
        rating: 4.9,
        currentConversations: 1,
        maxConcurrentConversations: 4,
        responseTime: 1.5,
        lastActivity: new Date(),
        performance: {
          resolvedConversations: 312,
          averageResolutionTime: 6,
          customerSatisfaction: 4.7,
          transferRate: 0.03
        }
      }
    ]

    mockAgents.forEach(agent => {
      this.agents.set(agent.id, agent)
    })
  }

  private generateTransferId(): string {
    return `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Analytics and reporting
  getRoutingAnalytics(): RoutingAnalytics {
    const transfers = Array.from(this.activeTransfers.values())
    const completedTransfers = transfers.filter(t => t.status === 'completed')

    const agentPerformance: Record<string, any> = {}
    this.agents.forEach(agent => {
      agentPerformance[agent.id] = {
        conversationsHandled: agent.performance.resolvedConversations,
        averageResolutionTime: agent.performance.averageResolutionTime,
        satisfactionScore: agent.performance.customerSatisfaction,
        transferRate: agent.performance.transferRate
      }
    })

    const commonReasons: Record<string, number> = {}
    transfers.forEach(transfer => {
      commonReasons[transfer.reason] = (commonReasons[transfer.reason] || 0) + 1
    })

    return {
      totalConversations: transfers.length,
      escalatedConversations: completedTransfers.length,
      averageEscalationTime: 5, // Mock calculation
      resolutionRate: completedTransfers.length / transfers.length,
      customerSatisfaction: 4.5, // Mock calculation
      agentPerformance,
      commonEscalationReasons: commonReasons
    }
  }

  // Agent management
  async updateAgentStatus(agentId: string, status: Agent['status']): Promise<boolean> {
    const agent = this.agents.get(agentId)
    if (!agent) return false

    agent.status = status
    agent.lastActivity = new Date()

    // Persist to backend
    try {
      await fetch(`${this.API_BASE_URL}/agents/${agentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
    } catch (error) {
      console.error('Failed to update agent status:', error)
    }

    return true
  }

  getAvailableAgents(): Agent[] {
    return Array.from(this.agents.values()).filter(
      agent => agent.status === 'online' && agent.currentConversations < agent.maxConcurrentConversations
    )
  }

  getAgentWorkload(): Record<string, { current: number; max: number; utilization: number }> {
    const workload: Record<string, any> = {}

    this.agents.forEach(agent => {
      workload[agent.id] = {
        current: agent.currentConversations,
        max: agent.maxConcurrentConversations,
        utilization: agent.currentConversations / agent.maxConcurrentConversations
      }
    })

    return workload
  }
}

// Global smart routing service instance
export const smartRoutingService = new SmartRoutingService()
