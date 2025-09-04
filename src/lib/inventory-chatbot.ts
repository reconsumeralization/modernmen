export interface InventoryItem {
  id: string
  name: string
  category: string
  brand: string
  description: string
  price: number
  cost: number
  stockQuantity: number
  reorderPoint: number
  supplier: string
  location: string
  sku: string
  barcode?: string
  variants?: InventoryVariant[]
  lastUpdated: Date
  status: 'active' | 'discontinued' | 'out_of_stock'
}

export interface InventoryVariant {
  id: string
  name: string
  value: string
  stockQuantity: number
  priceModifier?: number
}

export interface StockLevel {
  itemId: string
  currentStock: number
  reservedStock: number
  availableStock: number
  reorderPoint: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock'
}

export interface InventoryQuery {
  productName?: string
  category?: string
  brand?: string
  priceRange?: {
    min: number
    max: number
  }
  inStock?: boolean
  location?: string
  supplier?: string
}

export interface InventoryResponse {
  items: InventoryItem[]
  totalCount: number
  availableCount: number
  lowStockCount: number
  outOfStockCount: number
  suggestions: InventorySuggestion[]
}

export interface InventorySuggestion {
  type: 'restock' | 'promotion' | 'alternative' | 'bundle'
  itemId?: string
  message: string
  priority: 'low' | 'medium' | 'high'
  action?: {
    type: 'reorder' | 'discount' | 'notify_supplier'
    payload: any
  }
}

export interface InventoryAlert {
  id: string
  type: 'low_stock' | 'out_of_stock' | 'expiring' | 'quality_issue'
  itemId: string
  itemName: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  timestamp: Date
  resolved: boolean
}

export class InventoryChatbotService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

  async queryInventory(query: InventoryQuery): Promise<InventoryResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/inventory/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      })

      if (!response.ok) {
        throw new Error('Failed to query inventory')
      }

      const data = await response.json()
      return this.enrichInventoryResponse(data)

    } catch (error) {
      console.error('Inventory query error:', error)
      return this.createFallbackResponse()
    }
  }

  async checkProductAvailability(productName: string, quantity: number = 1): Promise<{
    available: boolean
    availableQuantity: number
    alternatives: InventoryItem[]
    estimatedRestockDate?: Date
  }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/inventory/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productName, quantity })
      })

      if (!response.ok) {
        throw new Error('Failed to check availability')
      }

      return await response.json()

    } catch (error) {
      console.error('Availability check error:', error)
      return {
        available: false,
        availableQuantity: 0,
        alternatives: []
      }
    }
  }

  async getLowStockAlerts(): Promise<InventoryAlert[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/inventory/alerts`)

      if (!response.ok) {
        throw new Error('Failed to get alerts')
      }

      return await response.json()

    } catch (error) {
      console.error('Alerts fetch error:', error)
      return []
    }
  }

  async getProductDetails(productId: string): Promise<InventoryItem | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/inventory/${productId}`)

      if (!response.ok) {
        throw new Error('Failed to get product details')
      }

      return await response.json()

    } catch (error) {
      console.error('Product details error:', error)
      return null
    }
  }

  async searchProductsByNaturalLanguage(query: string): Promise<InventoryResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/inventory/search/natural`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        throw new Error('Failed to search products')
      }

      const data = await response.json()
      return this.enrichInventoryResponse(data)

    } catch (error) {
      console.error('Natural language search error:', error)
      return this.createFallbackResponse()
    }
  }

  private enrichInventoryResponse(data: any): InventoryResponse {
    const response: InventoryResponse = {
      items: data.items || [],
      totalCount: data.totalCount || 0,
      availableCount: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      suggestions: []
    }

    // Calculate stock statistics
    response.items.forEach(item => {
      if (item.stockQuantity > item.reorderPoint) {
        response.availableCount++
      } else if (item.stockQuantity > 0) {
        response.lowStockCount++
      } else {
        response.outOfStockCount++
      }
    })

    // Generate suggestions
    response.suggestions = this.generateInventorySuggestions(response.items)

    return response
  }

  private generateInventorySuggestions(items: InventoryItem[]): InventorySuggestion[] {
    const suggestions: InventorySuggestion[] = []

    // Low stock alerts
    const lowStockItems = items.filter(item =>
      item.stockQuantity <= item.reorderPoint && item.stockQuantity > 0
    )

    lowStockItems.forEach(item => {
      suggestions.push({
        type: 'restock',
        itemId: item.id,
        message: `${item.name} is running low (${item.stockQuantity} remaining). Consider reordering.`,
        priority: item.stockQuantity <= item.reorderPoint * 0.5 ? 'high' : 'medium',
        action: {
          type: 'reorder',
          payload: { itemId: item.id, supplier: item.supplier }
        }
      })
    })

    // Out of stock items
    const outOfStockItems = items.filter(item => item.stockQuantity === 0)

    outOfStockItems.forEach(item => {
      suggestions.push({
        type: 'alternative',
        itemId: item.id,
        message: `${item.name} is currently out of stock. Would you like to see similar alternatives?`,
        priority: 'high'
      })
    })

    // Popular items running low
    const popularLowStock = lowStockItems.filter(item =>
      this.isPopularItem(item)
    )

    popularLowStock.forEach(item => {
      suggestions.push({
        type: 'promotion',
        itemId: item.id,
        message: `Popular item ${item.name} is almost sold out! Consider offering a promotion to move remaining stock.`,
        priority: 'medium',
        action: {
          type: 'discount',
          payload: { itemId: item.id, discountPercent: 10 }
        }
      })
    })

    return suggestions.slice(0, 5) // Limit to 5 suggestions
  }

  private isPopularItem(item: InventoryItem): boolean {
    // Mock popularity check - in reality, this would check sales data
    const popularCategories = ['shampoo', 'treatment', 'styling']
    const popularBrands = ['premium', 'professional', 'luxury']

    return popularCategories.some(cat =>
      item.category.toLowerCase().includes(cat) ||
      item.name.toLowerCase().includes(cat)
    ) || popularBrands.some(brand =>
      item.brand.toLowerCase().includes(brand) ||
      item.name.toLowerCase().includes(brand)
    )
  }

  private createFallbackResponse(): InventoryResponse {
    return {
      items: [],
      totalCount: 0,
      availableCount: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      suggestions: [{
        type: 'alternative',
        message: 'I apologize, but I\'m unable to check inventory right now. Please try again later or contact our staff directly.',
        priority: 'medium'
      }]
    }
  }

  // Natural language processing for inventory queries
  parseInventoryQuery(message: string): InventoryQuery {
    const lowerMessage = message.toLowerCase()
    const query: InventoryQuery = {}

    // Product name extraction
    const productPatterns = [
      /\b(looking for|find|search for|do you have)\s+(.+?)(?:\?|$|\.)/i,
      /\b(.+?)\s+(available|in stock|price|cost)/i,
      /\bwhere can I find\s+(.+?)(?:\?|$|\.)/i
    ]

    for (const pattern of productPatterns) {
      const match = message.match(pattern)
      if (match) {
        query.productName = match[1] || match[2]
        break
      }
    }

    // Category extraction
    const categories = ['shampoo', 'conditioner', 'treatment', 'styling', 'grooming', 'hair', 'beard']
    for (const category of categories) {
      if (lowerMessage.includes(category)) {
        query.category = category
        break
      }
    }

    // Brand extraction
    const brands = ['premium', 'professional', 'luxury', 'natural', 'organic']
    for (const brand of brands) {
      if (lowerMessage.includes(brand)) {
        query.brand = brand
        break
      }
    }

    // Price range extraction
    const priceMatch = lowerMessage.match(/(\d+)(?:\s*-\s*|\s*to\s*)(\d+)\s*dollars?/i)
    if (priceMatch) {
      query.priceRange = {
        min: parseInt(priceMatch[1]),
        max: parseInt(priceMatch[2])
      }
    }

    // Stock status
    if (lowerMessage.includes('in stock') || lowerMessage.includes('available')) {
      query.inStock = true
    }

    return query
  }

  // Generate human-readable inventory responses
  generateInventoryResponse(query: InventoryQuery, response: InventoryResponse): string {
    if (response.items.length === 0) {
      return this.generateNoResultsResponse(query)
    }

    let message = `I found ${response.totalCount} item${response.totalCount !== 1 ? 's' : ''}`

    if (query.productName) {
      message += ` matching "${query.productName}"`
    }

    message += ':\n\n'

    // Group items by category for better organization
    const itemsByCategory = response.items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {} as Record<string, InventoryItem[]>)

    Object.entries(itemsByCategory).forEach(([category, items]) => {
      message += `**${category}**\n`
      items.forEach(item => {
        const stockStatus = this.getStockStatusText(item)
        message += `• ${item.name} - $${item.price} (${stockStatus})\n`
      })
      message += '\n'
    })

    // Add suggestions
    if (response.suggestions.length > 0) {
      message += '**Suggestions:**\n'
      response.suggestions.forEach(suggestion => {
        const priorityEmoji = {
          high: '🚨',
          medium: '⚠️',
          low: 'ℹ️'
        }[suggestion.priority] || 'ℹ️'

        message += `${priorityEmoji} ${suggestion.message}\n`
      })
    }

    return message
  }

  private generateNoResultsResponse(query: InventoryQuery): string {
    let message = "I couldn't find any items"

    if (query.productName) {
      message += ` matching "${query.productName}"`
    }

    message += '. Here are some suggestions:\n\n'
    message += '• Try searching with different keywords\n'
    message += '• Check our available categories: shampoo, conditioner, treatment, styling\n'
    message += '• Ask about specific brands or price ranges\n'
    message += '• Contact our staff for personalized recommendations\n'

    return message
  }

  private getStockStatusText(item: InventoryItem): string {
    if (item.stockQuantity === 0) {
      return 'Out of stock'
    } else if (item.stockQuantity <= item.reorderPoint) {
      return `Low stock (${item.stockQuantity} left)`
    } else {
      return `In stock (${item.stockQuantity} available)`
    }
  }

  // Inventory analytics for chatbot insights
  async getInventoryAnalytics(): Promise<{
    totalItems: number
    totalValue: number
    lowStockItems: number
    outOfStockItems: number
    topSellingCategories: Array<{ category: string; count: number }>
    inventoryTurnover: number
  }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/inventory/analytics`)

      if (!response.ok) {
        throw new Error('Failed to get analytics')
      }

      return await response.json()

    } catch (error) {
      console.error('Analytics fetch error:', error)
      return {
        totalItems: 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        topSellingCategories: [],
        inventoryTurnover: 0
      }
    }
  }

  // Smart restock recommendations
  async getRestockRecommendations(): Promise<Array<{
    itemId: string
    itemName: string
    recommendedQuantity: number
    reason: string
    priority: 'low' | 'medium' | 'high'
    estimatedCost: number
  }>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/inventory/restock-recommendations`)

      if (!response.ok) {
        throw new Error('Failed to get restock recommendations')
      }

      return await response.json()

    } catch (error) {
      console.error('Restock recommendations error:', error)
      return []
    }
  }

  // Product comparison for chatbot
  async compareProducts(productIds: string[]): Promise<{
    comparison: Array<{
      feature: string
      values: Record<string, any>
    }>
    recommendation: string
  }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/inventory/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productIds })
      })

      if (!response.ok) {
        throw new Error('Failed to compare products')
      }

      return await response.json()

    } catch (error) {
      console.error('Product comparison error:', error)
      return {
        comparison: [],
        recommendation: 'Unable to compare products at this time.'
      }
    }
  }
}

// Global inventory chatbot service instance
export const inventoryChatbotService = new InventoryChatbotService()
