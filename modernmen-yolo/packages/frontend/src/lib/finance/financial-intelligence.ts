// Advanced Financial Management & Intelligence System
// Comprehensive financial forecasting, budgeting, and business intelligence

export interface FinancialMetrics {
  revenue: {
    total: number
    recurring: number
    oneTime: number
    byService: Record<string, number>
    byLocation: Record<string, number>
    growth: {
      monthOverMonth: number
      yearOverYear: number
      projectedAnnual: number
    }
  }
  costs: {
    total: number
    fixed: number
    variable: number
    byCategory: Record<string, number>
    labor: number
    supplies: number
    rent: number
    utilities: number
    marketing: number
  }
  profitability: {
    grossMargin: number
    netMargin: number
    breakEvenPoint: number
    profitPerService: Record<string, number>
    profitPerLocation: Record<string, number>
  }
  cashflow: {
    operating: number
    investing: number
    financing: number
    netCashFlow: number
    cashPosition: number
    runway: number // months
  }
  kpis: {
    customerAcquisitionCost: number
    lifetimeValue: number
    paybackPeriod: number
    returnOnInvestment: number
    monthlyRecurringRevenue: number
  }
}

export interface FinancialForecast {
  period: string
  revenue: {
    baseCase: number
    optimistic: number
    pessimistic: number
    confidence: number
  }
  costs: {
    baseCase: number
    optimistic: number
    pessimistic: number
  }
  profit: {
    baseCase: number
    optimistic: number
    pessimistic: number
  }
  assumptions: {
    growthRate: number
    priceIncrease: number
    costInflation: number
    marketConditions: string
  }
  risks: Array<{
    type: string
    probability: number
    impact: number
    mitigation: string
  }>
}

export interface Budget {
  id: string
  name: string
  period: {
    start: Date
    end: Date
  }
  categories: Array<{
    category: string
    budgeted: number
    actual: number
    variance: number
    variancePercentage: number
  }>
  status: 'draft' | 'approved' | 'active' | 'completed'
  createdBy: string
  approvedBy?: string
  approvalDate?: Date
}

export interface FinancialReporting {
  balanceSheet: {
    assets: {
      current: number
      fixed: number
      total: number
    }
    liabilities: {
      current: number
      longTerm: number
      total: number
    }
    equity: number
  }
  incomeStatement: {
    revenue: number
    costOfGoodsSold: number
    grossProfit: number
    operatingExpenses: number
    operatingProfit: number
    netIncome: number
  }
  cashFlowStatement: {
    operatingActivities: number
    investingActivities: number
    financingActivities: number
    netCashFlow: number
  }
  ratios: {
    currentRatio: number
    debtToEquityRatio: number
    returnOnAssets: number
    returnOnEquity: number
    grossMarginRatio: number
    netMarginRatio: number
  }
}

export interface InvestmentAnalysis {
  opportunities: Array<{
    id: string
    name: string
    type: 'equipment' | 'location' | 'technology' | 'marketing' | 'staff'
    cost: number
    expectedReturn: number
    paybackPeriod: number
    roi: number
    risk: 'low' | 'medium' | 'high'
    priority: 'low' | 'medium' | 'high'
    timeline: string
  }>
  recommendations: Array<{
    category: string
    suggestion: string
    expectedImpact: number
    implementationCost: number
    priority: string
  }>
  optimization: {
    costReduction: number
    revenueIncrease: number
    efficiencyGains: number
    netBenefit: number
  }
}

class FinancialIntelligence {
  private readonly API_BASE = '/api/finance'

  // Financial Metrics
  async getFinancialMetrics(
    period: { start: Date; end: Date }
  ): Promise<FinancialMetrics> {
    try {
      const params = new URLSearchParams({
        start: period.start.toISOString(),
        end: period.end.toISOString()
      })

      const response = await fetch(`${this.API_BASE}/metrics?${params}`)
      if (!response.ok) throw new Error('Failed to get financial metrics')

      return await response.json()
    } catch (error) {
      console.error('Failed to get financial metrics:', error)
      throw error
    }
  }

  // Financial Forecasting
  async generateFinancialForecast(
    forecastPeriod: number = 12, // months
    scenario: 'base' | 'optimistic' | 'pessimistic' = 'base'
  ): Promise<FinancialForecast[]> {
    try {
      const params = new URLSearchParams({
        period: forecastPeriod.toString(),
        scenario
      })

      const response = await fetch(`${this.API_BASE}/forecast?${params}`)
      if (!response.ok) throw new Error('Failed to generate financial forecast')

      return await response.json()
    } catch (error) {
      console.error('Failed to generate financial forecast:', error)
      throw error
    }
  }

  // Budget Management
  async createBudget(budget: Omit<Budget, 'id' | 'status'>): Promise<Budget> {
    try {
      const response = await fetch(`${this.API_BASE}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget)
      })

      if (!response.ok) throw new Error('Failed to create budget')
      const createdBudget = await response.json()

      return {
        ...createdBudget,
        period: {
          start: new Date(createdBudget.period.start),
          end: new Date(createdBudget.period.end)
        },
        approvalDate: createdBudget.approvalDate ? new Date(createdBudget.approvalDate) : undefined
      }
    } catch (error) {
      console.error('Failed to create budget:', error)
      throw error
    }
  }

  async getBudgets(status?: string): Promise<Budget[]> {
    try {
      const params = new URLSearchParams(status ? { status } : {})
      const response = await fetch(`${this.API_BASE}/budgets?${params}`)

      if (!response.ok) throw new Error('Failed to get budgets')
      const budgets = await response.json()

      return budgets.map((budget: any) => ({
        ...budget,
        period: {
          start: new Date(budget.period.start),
          end: new Date(budget.period.end)
        },
        approvalDate: budget.approvalDate ? new Date(budget.approvalDate) : undefined
      }))
    } catch (error) {
      console.error('Failed to get budgets:', error)
      throw error
    }
  }

  async updateBudgetProgress(
    budgetId: string,
    updates: { [category: string]: { actual: number } }
  ): Promise<Budget> {
    try {
      const response = await fetch(`${this.API_BASE}/budgets/${budgetId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update budget progress')
      const budget = await response.json()

      return {
        ...budget,
        period: {
          start: new Date(budget.period.start),
          end: new Date(budget.period.end)
        },
        approvalDate: budget.approvalDate ? new Date(budget.approvalDate) : undefined
      }
    } catch (error) {
      console.error('Failed to update budget progress:', error)
      throw error
    }
  }

  // Financial Reporting
  async generateFinancialReport(
    reportType: 'monthly' | 'quarterly' | 'annual',
    period: { start: Date; end: Date }
  ): Promise<FinancialReporting> {
    try {
      const params = new URLSearchParams({
        type: reportType,
        start: period.start.toISOString(),
        end: period.end.toISOString()
      })

      const response = await fetch(`${this.API_BASE}/reports?${params}`)
      if (!response.ok) throw new Error('Failed to generate financial report')

      return await response.json()
    } catch (error) {
      console.error('Failed to generate financial report:', error)
      throw error
    }
  }

  // Investment Analysis
  async analyzeInvestmentOpportunities(): Promise<InvestmentAnalysis> {
    try {
      const response = await fetch(`${this.API_BASE}/investments`)
      if (!response.ok) throw new Error('Failed to analyze investments')

      return await response.json()
    } catch (error) {
      console.error('Failed to analyze investments:', error)
      throw error
    }
  }

  // Cash Flow Management
  async optimizeCashFlow(): Promise<{
    recommendations: Array<{
      action: string
      impact: number
      timeline: string
      priority: 'low' | 'medium' | 'high'
    }>
    projections: Array<{
      period: string
      projectedCashFlow: number
      confidence: number
    }>
    alerts: Array<{
      type: 'warning' | 'critical' | 'info'
      message: string
      suggestedAction: string
    }>
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/cashflow-optimization`)
      if (!response.ok) throw new Error('Failed to optimize cash flow')

      return await response.json()
    } catch (error) {
      console.error('Failed to optimize cash flow:', error)
      throw error
    }
  }

  // Pricing Optimization
  async optimizePricing(): Promise<{
    currentPricing: {
      serviceId: string
      serviceName: string
      currentPrice: number
      cost: number
      margin: number
    }[]
    recommendations: Array<{
      serviceId: string
      serviceName: string
      recommendedPrice: number
      expectedRevenueIncrease: number
      expectedVolumeChange: number
      confidence: number
      reasoning: string
    }>
    dynamicPricing: {
      enabled: boolean
      rules: Array<{
        condition: string
        adjustment: number
        reasoning: string
      }>
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/pricing-optimization`)
      if (!response.ok) throw new Error('Failed to optimize pricing')

      return await response.json()
    } catch (error) {
      console.error('Failed to optimize pricing:', error)
      throw error
    }
  }

  // Financial Risk Assessment
  async assessFinancialRisks(): Promise<{
    riskFactors: Array<{
      factor: string
      probability: number
      impact: number
      mitigation: string
      status: 'monitored' | 'managed' | 'critical'
    }>
    riskScore: number
    recommendations: Array<{
      action: string
      expectedReduction: number
      cost: number
      priority: string
    }>
    stressTests: {
      scenario: string
      impact: number
      probability: number
      mitigation: string
    }[]
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/risk-assessment`)
      if (!response.ok) throw new Error('Failed to assess financial risks')

      return await response.json()
    } catch (error) {
      console.error('Failed to assess financial risks:', error)
      throw error
    }
  }

  // Benchmarking
  async getIndustryBenchmarks(): Promise<{
    metrics: {
      revenuePerEmployee: number
      profitMargin: number
      customerAcquisitionCost: number
      lifetimeValue: number
      growthRate: number
    }
    comparisons: {
      vsIndustry: {
        metric: string
        ourValue: number
        industryAverage: number
        percentile: number
      }[]
    }
    opportunities: Array<{
      area: string
      currentPerformance: number
      targetPerformance: number
      improvementPotential: number
      actionItems: string[]
    }>
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/benchmarks`)
      if (!response.ok) throw new Error('Failed to get industry benchmarks')

      return await response.json()
    } catch (error) {
      console.error('Failed to get industry benchmarks:', error)
      throw error
    }
  }

  // Tax Optimization
  async optimizeTaxStrategy(): Promise<{
    currentTaxRate: number
    optimizedTaxRate: number
    savings: number
    recommendations: Array<{
      action: string
      savings: number
      implementation: string
      risk: string
    }>
    compliance: {
      status: 'compliant' | 'review_needed' | 'non_compliant'
      issues: string[]
      deadlines: Array<{
        description: string
        date: Date
        status: 'pending' | 'completed' | 'overdue'
      }>
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/tax-optimization`)
      if (!response.ok) throw new Error('Failed to optimize tax strategy')

      const result = await response.json()
      return {
        ...result,
        compliance: {
          ...result.compliance,
          deadlines: result.compliance.deadlines.map((deadline: any) => ({
            ...deadline,
            date: new Date(deadline.date)
          }))
        }
      }
    } catch (error) {
      console.error('Failed to optimize tax strategy:', error)
      throw error
    }
  }

  // Financial Goal Tracking
  async trackFinancialGoals(): Promise<{
    goals: Array<{
      id: string
      name: string
      type: 'revenue' | 'profit' | 'growth' | 'expansion'
      target: number
      current: number
      progress: number
      deadline: Date
      status: 'on_track' | 'at_risk' | 'behind' | 'achieved'
    }>
    projections: {
      optimistic: number
      realistic: number
      pessimistic: number
    }
    adjustments: Array<{
      goalId: string
      recommendedAdjustment: string
      expectedImpact: number
      reasoning: string
    }>
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/goals`)
      if (!response.ok) throw new Error('Failed to track financial goals')

      const result = await response.json()
      return {
        ...result,
        goals: result.goals.map((goal: any) => ({
          ...goal,
          deadline: new Date(goal.deadline)
        }))
      }
    } catch (error) {
      console.error('Failed to track financial goals:', error)
      throw error
    }
  }
}

export const financialIntelligence = new FinancialIntelligence()

// React Hook for Financial Intelligence
export function useFinancialIntelligence() {
  return {
    getFinancialMetrics: financialIntelligence.getFinancialMetrics.bind(financialIntelligence),
    generateFinancialForecast: financialIntelligence.generateFinancialForecast.bind(financialIntelligence),
    createBudget: financialIntelligence.createBudget.bind(financialIntelligence),
    getBudgets: financialIntelligence.getBudgets.bind(financialIntelligence),
    updateBudgetProgress: financialIntelligence.updateBudgetProgress.bind(financialIntelligence),
    generateFinancialReport: financialIntelligence.generateFinancialReport.bind(financialIntelligence),
    analyzeInvestmentOpportunities: financialIntelligence.analyzeInvestmentOpportunities.bind(financialIntelligence),
    optimizeCashFlow: financialIntelligence.optimizeCashFlow.bind(financialIntelligence),
    optimizePricing: financialIntelligence.optimizePricing.bind(financialIntelligence),
    assessFinancialRisks: financialIntelligence.assessFinancialRisks.bind(financialIntelligence),
    getIndustryBenchmarks: financialIntelligence.getIndustryBenchmarks.bind(financialIntelligence),
    optimizeTaxStrategy: financialIntelligence.optimizeTaxStrategy.bind(financialIntelligence),
    trackFinancialGoals: financialIntelligence.trackFinancialGoals.bind(financialIntelligence)
  }
}
