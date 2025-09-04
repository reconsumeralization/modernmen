// Advanced Inventory Management & Supply Chain System
// Intelligent inventory optimization, supplier management, and supply chain analytics

export interface InventoryItem {
  id: string
  name: string
  category: string
  sku: string
  description: string
  unit: 'pieces' | 'bottles' | 'packs' | 'kg' | 'liters'
  currentStock: number
  minimumStock: number
  maximumStock: number
  reorderPoint: number
  unitCost: number
  sellingPrice: number
  location: string
  supplier: Supplier
  expiryDate?: Date
  batchNumber?: string
  qualityStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'expired'
  usageRate: {
    daily: number
    weekly: number
    monthly: number
  }
  demandPattern: 'stable' | 'seasonal' | 'trending_up' | 'trending_down'
}

export interface Supplier {
  id: string
  name: string
  contact: {
    email: string
    phone: string
    address: string
  }
  reliability: {
    onTimeDelivery: number
    qualityRating: number
    communicationScore: number
    overallScore: number
  }
  contract: {
    startDate: Date
    endDate: Date
    terms: string
    minimumOrder: number
    leadTime: number // days
  }
  products: string[]
  pricing: {
    [productId: string]: {
      unitPrice: number
      bulkDiscounts: Array<{
        quantity: number
        discountPercentage: number
      }>
      lastUpdated: Date
    }
  }
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  items: Array<{
    itemId: string
    quantity: number
    unitPrice: number
    expectedDelivery: Date
  }>
  status: 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled'
  totalValue: number
  orderDate: Date
  expectedDeliveryDate: Date
  actualDeliveryDate?: Date
  qualityCheck: {
    passed: boolean
    notes: string
    inspector: string
  }
}

export interface InventoryOptimization {
  recommendations: Array<{
    itemId: string
    itemName: string
    action: 'increase_stock' | 'decrease_stock' | 'reorder' | 'discontinue'
    reason: string
    impact: {
      costSavings: number
      stockoutPrevention: number
      workingCapital: number
    }
    priority: 'low' | 'medium' | 'high' | 'critical'
  }>
  optimalStockLevels: Array<{
    itemId: string
    currentLevel: number
    optimalLevel: number
    safetyStock: number
    reorderPoint: number
  }>
  supplierOptimization: Array<{
    supplierId: string
    supplierName: string
    recommendedAction: 'increase_orders' | 'decrease_orders' | 'switch_supplier'
    reason: string
    expectedSavings: number
  }>
  demandForecasting: Array<{
    itemId: string
    itemName: string
    forecastedDemand: Array<{
      period: string
      quantity: number
      confidence: number
    }>
  }>
}

export interface SupplyChainAnalytics {
  inventory: {
    totalValue: number
    stockoutIncidents: number
    overstockValue: number
    turnoverRatio: number
    carryingCost: number
  }
  suppliers: {
    totalSuppliers: number
    averageLeadTime: number
    onTimeDeliveryRate: number
    qualityScore: number
    costSavings: number
  }
  procurement: {
    totalSpend: number
    averageOrderValue: number
    purchaseFrequency: number
    negotiationSavings: number
  }
  efficiency: {
    stockAccuracy: number
    orderFulfillmentTime: number
    supplierPerformance: number
    costOptimization: number
  }
}

class SupplyChainManager {
  private readonly API_BASE = '/api/inventory'

  // Inventory Management
  async getInventory(location?: string): Promise<InventoryItem[]> {
    try {
      const params = new URLSearchParams(location ? { location } : {})
      const response = await fetch(`${this.API_BASE}/items?${params}`)

      if (!response.ok) throw new Error('Failed to fetch inventory')
      const items = await response.json()

      return items.map(this.transformInventoryItem)
    } catch (error) {
      console.error('Failed to get inventory:', error)
      throw error
    }
  }

  async updateInventoryItem(
    itemId: string,
    updates: Partial<InventoryItem>
  ): Promise<InventoryItem> {
    try {
      const response = await fetch(`${this.API_BASE}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update inventory item')
      const item = await response.json()
      return this.transformInventoryItem(item)
    } catch (error) {
      console.error('Failed to update inventory item:', error)
      throw error
    }
  }

  async adjustStock(
    itemId: string,
    adjustment: {
      type: 'addition' | 'reduction' | 'correction'
      quantity: number
      reason: string
      reference?: string
    }
  ): Promise<{
    item: InventoryItem
    transaction: {
      id: string
      type: string
      quantity: number
      reason: string
      timestamp: Date
      userId: string
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/items/${itemId}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adjustment)
      })

      if (!response.ok) throw new Error('Failed to adjust stock')
      const result = await response.json()

      return {
        item: this.transformInventoryItem(result.item),
        transaction: {
          ...result.transaction,
          timestamp: new Date(result.transaction.timestamp)
        }
      }
    } catch (error) {
      console.error('Failed to adjust stock:', error)
      throw error
    }
  }

  // Supplier Management
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await fetch(`${this.API_BASE}/suppliers`)
      if (!response.ok) throw new Error('Failed to fetch suppliers')

      const suppliers = await response.json()
      return suppliers.map(this.transformSupplier)
    } catch (error) {
      console.error('Failed to get suppliers:', error)
      throw error
    }
  }

  async evaluateSupplierPerformance(
    supplierId: string,
    period: { start: Date; end: Date }
  ): Promise<{
    onTimeDelivery: number
    qualityRating: number
    costCompetitiveness: number
    communicationScore: number
    overallScore: number
    recommendations: string[]
    comparison: {
      vsIndustry: number
      vsCompetitors: number
      trend: 'improving' | 'declining' | 'stable'
    }
  }> {
    try {
      const params = new URLSearchParams({
        start: period.start.toISOString(),
        end: period.end.toISOString()
      })

      const response = await fetch(`${this.API_BASE}/suppliers/${supplierId}/performance?${params}`)
      if (!response.ok) throw new Error('Failed to evaluate supplier performance')

      return await response.json()
    } catch (error) {
      console.error('Failed to evaluate supplier performance:', error)
      throw error
    }
  }

  // Purchase Order Management
  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id' | 'status' | 'orderDate'>): Promise<PurchaseOrder> {
    try {
      const response = await fetch(`${this.API_BASE}/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...order,
          orderDate: new Date().toISOString()
        })
      })

      if (!response.ok) throw new Error('Failed to create purchase order')
      const purchaseOrder = await response.json()
      return this.transformPurchaseOrder(purchaseOrder)
    } catch (error) {
      console.error('Failed to create purchase order:', error)
      throw error
    }
  }

  async getPurchaseOrders(status?: string): Promise<PurchaseOrder[]> {
    try {
      const params = new URLSearchParams(status ? { status } : {})
      const response = await fetch(`${this.API_BASE}/purchase-orders?${params}`)

      if (!response.ok) throw new Error('Failed to fetch purchase orders')
      const orders = await response.json()

      return orders.map(this.transformPurchaseOrder)
    } catch (error) {
      console.error('Failed to get purchase orders:', error)
      throw error
    }
  }

  // Inventory Optimization
  async optimizeInventory(): Promise<InventoryOptimization> {
    try {
      const response = await fetch(`${this.API_BASE}/optimize`)
      if (!response.ok) throw new Error('Failed to optimize inventory')

      return await response.json()
    } catch (error) {
      console.error('Failed to optimize inventory:', error)
      throw error
    }
  }

  async getReorderRecommendations(): Promise<Array<{
    itemId: string
    itemName: string
    currentStock: number
    reorderQuantity: number
    supplierId: string
    supplierName: string
    estimatedCost: number
    leadTime: number
    priority: 'low' | 'medium' | 'high' | 'critical'
  }>> {
    try {
      const response = await fetch(`${this.API_BASE}/reorder-recommendations`)
      if (!response.ok) throw new Error('Failed to get reorder recommendations')

      return await response.json()
    } catch (error) {
      console.error('Failed to get reorder recommendations:', error)
      throw error
    }
  }

  // Demand Forecasting
  async forecastDemand(
    itemId: string,
    forecastHorizon: number = 30 // days
  ): Promise<{
    itemId: string
    itemName: string
    forecast: Array<{
      date: string
      predictedDemand: number
      confidence: number
      factors: string[]
    }>
    seasonality: {
      pattern: string
      strength: number
      recommendations: string[]
    }
    accuracy: {
      current: number
      historical: number
      trend: 'improving' | 'declining' | 'stable'
    }
  }> {
    try {
      const params = new URLSearchParams({
        horizon: forecastHorizon.toString()
      })

      const response = await fetch(`${this.API_BASE}/demand-forecast/${itemId}?${params}`)
      if (!response.ok) throw new Error('Failed to forecast demand')

      const forecast = await response.json()
      return {
        ...forecast,
        forecast: forecast.forecast.map((f: any) => ({
          ...f,
          date: new Date(f.date).toISOString().split('T')[0]
        }))
      }
    } catch (error) {
      console.error('Failed to forecast demand:', error)
      throw error
    }
  }

  // Supply Chain Analytics
  async getSupplyChainAnalytics(
    period: { start: Date; end: Date }
  ): Promise<SupplyChainAnalytics> {
    try {
      const params = new URLSearchParams({
        start: period.start.toISOString(),
        end: period.end.toISOString()
      })

      const response = await fetch(`${this.API_BASE}/analytics?${params}`)
      if (!response.ok) throw new Error('Failed to get supply chain analytics')

      return await response.json()
    } catch (error) {
      console.error('Failed to get supply chain analytics:', error)
      throw error
    }
  }

  // Cost Optimization
  async optimizeProcurementCosts(): Promise<{
    costReduction: {
      immediate: number
      potential: number
      timeline: string[]
    }
    recommendations: Array<{
      itemId: string
      itemName: string
      currentSupplier: string
      alternativeSuppliers: Array<{
        supplierId: string
        supplierName: string
        price: number
        savings: number
        qualityScore: number
        leadTime: number
      }>
      recommendedAction: string
    }>
    negotiationOpportunities: Array<{
      supplierId: string
      supplierName: string
      potentialSavings: number
      negotiationPoints: string[]
    }>
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/cost-optimization`)
      if (!response.ok) throw new Error('Failed to optimize procurement costs')

      return await response.json()
    } catch (error) {
      console.error('Failed to optimize procurement costs:', error)
      throw error
    }
  }

  // Quality Control
  async performQualityCheck(
    itemId: string,
    batchNumber: string,
    checkData: {
      inspector: string
      criteria: Array<{
        criterion: string
        passed: boolean
        notes: string
      }>
      overallRating: 'excellent' | 'good' | 'fair' | 'poor'
      actionRequired: 'none' | 'return' | 'discount' | 'discard'
    }
  ): Promise<{
    checkId: string
    itemId: string
    batchNumber: string
    passed: boolean
    inspector: string
    timestamp: Date
    nextCheckDate: Date
    recommendations: string[]
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/quality-check/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchNumber,
          ...checkData
        })
      })

      if (!response.ok) throw new Error('Failed to perform quality check')
      const result = await response.json()

      return {
        ...result,
        timestamp: new Date(result.timestamp),
        nextCheckDate: new Date(result.nextCheckDate)
      }
    } catch (error) {
      console.error('Failed to perform quality check:', error)
      throw error
    }
  }

  // Helper Methods
  private transformInventoryItem(data: any): InventoryItem {
    return {
      ...data,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined
    }
  }

  private transformSupplier(data: any): Supplier {
    return {
      ...data,
      contract: {
        ...data.contract,
        startDate: new Date(data.contract.startDate),
        endDate: new Date(data.contract.endDate)
      }
    }
  }

  private transformPurchaseOrder(data: any): PurchaseOrder {
    return {
      ...data,
      items: data.items.map((item: any) => ({
        ...item,
        expectedDelivery: new Date(item.expectedDelivery)
      })),
      orderDate: new Date(data.orderDate),
      expectedDeliveryDate: new Date(data.expectedDeliveryDate),
      actualDeliveryDate: data.actualDeliveryDate ? new Date(data.actualDeliveryDate) : undefined
    }
  }
}

export const supplyChainManager = new SupplyChainManager()

// React Hook for Inventory Management
export function useInventory() {
  return {
    getInventory: supplyChainManager.getInventory.bind(supplyChainManager),
    updateInventoryItem: supplyChainManager.updateInventoryItem.bind(supplyChainManager),
    adjustStock: supplyChainManager.adjustStock.bind(supplyChainManager),
    getSuppliers: supplyChainManager.getSuppliers.bind(supplyChainManager),
    evaluateSupplierPerformance: supplyChainManager.evaluateSupplierPerformance.bind(supplyChainManager),
    createPurchaseOrder: supplyChainManager.createPurchaseOrder.bind(supplyChainManager),
    getPurchaseOrders: supplyChainManager.getPurchaseOrders.bind(supplyChainManager),
    optimizeInventory: supplyChainManager.optimizeInventory.bind(supplyChainManager),
    getReorderRecommendations: supplyChainManager.getReorderRecommendations.bind(supplyChainManager),
    forecastDemand: supplyChainManager.forecastDemand.bind(supplyChainManager),
    getSupplyChainAnalytics: supplyChainManager.getSupplyChainAnalytics.bind(supplyChainManager),
    optimizeProcurementCosts: supplyChainManager.optimizeProcurementCosts.bind(supplyChainManager),
    performQualityCheck: supplyChainManager.performQualityCheck.bind(supplyChainManager)
  }
}
