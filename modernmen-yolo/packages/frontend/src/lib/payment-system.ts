/**
 * Advanced Payment Processing System for ModernMen Barbershop
 * Integrates with Stripe for secure payment processing with comprehensive error handling
 */

import { loadStripe, Stripe, StripeElements, PaymentIntent } from '@stripe/stripe-js'
import { AppError, createErrorResponse, handleApiError } from '@/lib/error-handling'
import { validationSystem } from '@/lib/validation-system'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

// Payment interfaces
export interface PaymentRequest {
  amount: number // in cents
  currency: string
  appointmentId: string
  customerId: string
  serviceId: string
  paymentMethodId?: string
  savePaymentMethod?: boolean
  metadata?: Record<string, string>
}

export interface PaymentResult {
  success: boolean
  paymentIntent?: PaymentIntent
  error?: string
  requiresAction?: boolean
  clientSecret?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account' | 'gift_card'
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  billing_details?: {
    name: string
    email: string
    address: {
      line1: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
  created: Date
  isDefault: boolean
}

export interface GiftCard {
  id: string
  code: string
  balance: number
  originalAmount: number
  isActive: boolean
  expiresAt?: Date
  customerId?: string
}

export interface PaymentHistory {
  id: string
  appointmentId: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded'
  paymentMethod: string
  transactionId: string
  createdAt: Date
  refundedAmount?: number
  refundReason?: string
  metadata: Record<string, any>
}

export interface RefundRequest {
  paymentId: string
  amount?: number // partial refund amount in cents
  reason: string
  metadata?: Record<string, string>
}

// Pricing and discounts
export interface PricingCalculation {
  subtotal: number
  discounts: Discount[]
  taxes: Tax[]
  tips: number
  total: number
  breakdown: PriceBreakdown[]
}

export interface Discount {
  id: string
  type: 'percentage' | 'fixed' | 'gift_card'
  value: number
  code?: string
  description: string
  applied: number
}

export interface Tax {
  id: string
  name: string
  rate: number
  amount: number
  type: 'sales' | 'service' | 'city'
}

export interface PriceBreakdown {
  item: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

class PaymentSystem {
  private stripe: Stripe | null = null
  private elements: StripeElements | null = null
  private initialized = false

  /**
   * Initialize Stripe
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (!stripePublicKey) {
        throw new Error('Stripe publishable key not configured')
      }

      this.stripe = await loadStripe(stripePublicKey)
      if (!this.stripe) {
        throw new Error('Failed to load Stripe')
      }

      this.initialized = true
    } catch (error) {
      console.error('Stripe initialization error:', error)
      throw new Error('Payment system initialization failed')
    }
  }

  /**
   * Calculate pricing with discounts and taxes
   */
  async calculatePricing(request: {
    serviceIds: string[]
    discountCodes?: string[]
    giftCardCode?: string
    customerId?: string
    location?: string
  }): Promise<PricingCalculation> {
    try {
      // Fetch service prices
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id, name, price, category')
        .in('id', request.serviceIds)

      if (servicesError) throw servicesError

      let subtotal = services?.reduce((sum, service) => sum + service.price, 0) || 0

      // Apply discounts
      const discounts: Discount[] = []
      let totalDiscount = 0

      // Process discount codes
      if (request.discountCodes?.length) {
        for (const code of request.discountCodes) {
          const discount = await this.validateDiscountCode(code, subtotal)
          if (discount) {
            discounts.push(discount)
            totalDiscount += discount.applied
          }
        }
      }

      // Process gift card
      if (request.giftCardCode) {
        const giftCard = await this.validateGiftCard(request.giftCardCode)
        if (giftCard) {
          const giftCardDiscount = Math.min(giftCard.balance, subtotal - totalDiscount)
          discounts.push({
            id: giftCard.id,
            type: 'gift_card',
            value: giftCard.balance,
            code: giftCard.code,
            description: `Gift Card (${giftCard.code})`,
            applied: giftCardDiscount
          })
          totalDiscount += giftCardDiscount
        }
      }

      // Calculate taxes
      const taxes = await this.calculateTaxes(subtotal - totalDiscount, request.location)
      const totalTax = taxes.reduce((sum, tax) => sum + tax.amount, 0)

      // Build breakdown
      const breakdown: PriceBreakdown[] = services?.map(service => ({
        item: service.name,
        quantity: 1,
        unitPrice: service.price,
        discount: 0, // Could be service-specific discounts
        total: service.price
      })) || []

      return {
        subtotal,
        discounts,
        taxes,
        tips: 0, // Tips will be added separately
        total: subtotal - totalDiscount + totalTax,
        breakdown
      }

    } catch (error) {
      console.error('Pricing calculation error:', error)
      throw new Error('Failed to calculate pricing')
    }
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(paymentRequest: PaymentRequest): Promise<{
    clientSecret: string
    paymentIntentId: string
  }> {
    await this.initialize()

    try {
      // Validate payment request
      const validation = validationSystem.validatePaymentInfo({
        amount: paymentRequest.amount / 100, // Convert cents to dollars for validation
        paymentMethod: 'card'
      })

      if (!validation.isValid) {
        throw new Error('Payment validation failed: ' + validation.errors.map(e => e.message).join(', '))
      }

      // Call backend to create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create payment intent')
      }

      const data = await response.json()
      return {
        clientSecret: data.client_secret,
        paymentIntentId: data.id
      }

    } catch (error) {
      console.error('Create payment intent error:', error)
      throw new Error('Failed to create payment intent')
    }
  }

  /**
   * Process payment
   */
  async processPayment(
    clientSecret: string,
    paymentMethodId?: string,
    billingDetails?: any
  ): Promise<PaymentResult> {
    await this.initialize()

    try {
      if (!this.stripe) throw new Error('Stripe not initialized')

      let result
      
      if (paymentMethodId) {
        // Use saved payment method
        result = await this.stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            payment_method: paymentMethodId,
            return_url: `${window.location.origin}/booking/confirmation`
          }
        })
      } else if (this.elements) {
        // Use payment element
        result = await this.stripe.confirmPayment({
          elements: this.elements,
          clientSecret,
          confirmParams: {
            payment_method_data: {
              billing_details: billingDetails
            },
            return_url: `${window.location.origin}/booking/confirmation`
          }
        })
      } else {
        throw new Error('No payment method provided')
      }

      if (result.error) {
        return {
          success: false,
          error: result.error.message,
          requiresAction: result.error.code === 'payment_intent_authentication_failure'
        }
      }

      if (result.paymentIntent?.status === 'succeeded') {
        // Update appointment status
        await this.updateAppointmentPaymentStatus(
          result.paymentIntent.metadata?.appointmentId || '',
          'paid',
          result.paymentIntent.id
        )

        toast.success('Payment processed successfully!')

        return {
          success: true,
          paymentIntent: result.paymentIntent
        }
      }

      return {
        success: false,
        error: 'Payment processing incomplete',
        requiresAction: result.paymentIntent?.status === 'requires_action'
      }

    } catch (error) {
      console.error('Payment processing error:', error)
      
      toast.error('Payment failed. Please try again.')

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      }
    }
  }

  /**
   * Save payment method for future use
   */
  async savePaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch('/api/payments/save-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, paymentMethodId })
      })

      if (!response.ok) {
        throw new Error('Failed to save payment method')
      }

      toast.success('Payment method saved successfully!')

    } catch (error) {
      console.error('Save payment method error:', error)
      toast.error('Failed to save payment method')
    }
  }

  /**
   * Get customer payment methods
   */
  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`/api/payments/methods?customerId=${customerId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods')
      }

      const data = await response.json()
      return data.paymentMethods || []

    } catch (error) {
      console.error('Get payment methods error:', error)
      return []
    }
  }

  /**
   * Process refund
   */
  async processRefund(refundRequest: RefundRequest): Promise<{
    success: boolean
    refundId?: string
    error?: string
  }> {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refundRequest)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Refund failed')
      }

      toast.success(`Refund of $${(refundRequest.amount || 0) / 100} processed successfully!`)

      return {
        success: true,
        refundId: data.refund.id
      }

    } catch (error) {
      console.error('Refund error:', error)
      toast.error('Refund processing failed')
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund failed'
      }
    }
  }

  /**
   * Validate gift card
   */
  async validateGiftCard(code: string): Promise<GiftCard | null> {
    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .gte('balance', 0)
        .single()

      if (error || !data) return null

      // Check expiration
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return null
      }

      return {
        id: data.id,
        code: data.code,
        balance: data.balance,
        originalAmount: data.original_amount,
        isActive: data.is_active,
        expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
        customerId: data.customer_id
      }

    } catch (error) {
      console.error('Gift card validation error:', error)
      return null
    }
  }

  /**
   * Apply gift card to payment
   */
  async applyGiftCard(giftCardCode: string, amount: number): Promise<{
    success: boolean
    appliedAmount: number
    remainingBalance: number
    error?: string
  }> {
    try {
      const giftCard = await this.validateGiftCard(giftCardCode)
      
      if (!giftCard) {
        return {
          success: false,
          appliedAmount: 0,
          remainingBalance: 0,
          error: 'Invalid or expired gift card'
        }
      }

      const appliedAmount = Math.min(giftCard.balance, amount)
      const remainingBalance = giftCard.balance - appliedAmount

      // Update gift card balance
      const { error } = await supabase
        .from('gift_cards')
        .update({ balance: remainingBalance })
        .eq('id', giftCard.id)

      if (error) throw error

      return {
        success: true,
        appliedAmount,
        remainingBalance
      }

    } catch (error) {
      console.error('Gift card application error:', error)
      return {
        success: false,
        appliedAmount: 0,
        remainingBalance: 0,
        error: 'Failed to apply gift card'
      }
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(customerId: string): Promise<PaymentHistory[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          appointments (
            id,
            appointment_date,
            start_time,
            services (name)
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(payment => ({
        id: payment.id,
        appointmentId: payment.appointment_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.payment_method,
        transactionId: payment.transaction_id,
        createdAt: new Date(payment.created_at),
        refundedAmount: payment.refunded_amount,
        refundReason: payment.refund_reason,
        metadata: payment.metadata || {}
      })) || []

    } catch (error) {
      console.error('Payment history error:', error)
      return []
    }
  }

  /**
   * Private helper methods
   */
  private async validateDiscountCode(code: string, subtotal: number): Promise<Discount | null> {
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .single()

      if (error || !data) return null

      let appliedAmount = 0
      if (data.type === 'percentage') {
        appliedAmount = Math.round(subtotal * (data.value / 100))
      } else if (data.type === 'fixed') {
        appliedAmount = Math.min(data.value * 100, subtotal) // Convert dollars to cents
      }

      return {
        id: data.id,
        type: data.type,
        value: data.value,
        code: data.code,
        description: data.description,
        applied: appliedAmount
      }

    } catch (error) {
      console.error('Discount code validation error:', error)
      return null
    }
  }

  private async calculateTaxes(taxableAmount: number, location?: string): Promise<Tax[]> {
    // Simplified tax calculation - in reality, this would be more complex
    // and potentially use a tax service like Avalara or TaxJar
    
    const baseTaxRate = 0.0875 // 8.75% base tax rate
    const taxAmount = Math.round(taxableAmount * baseTaxRate)

    return [{
      id: 'sales_tax',
      name: 'Sales Tax',
      rate: baseTaxRate,
      amount: taxAmount,
      type: 'sales'
    }]
  }

  private async updateAppointmentPaymentStatus(
    appointmentId: string,
    status: string,
    transactionId: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          payment_status: status,
          payment_transaction_id: transactionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)

      if (error) throw error

    } catch (error) {
      console.error('Update appointment payment status error:', error)
    }
  }

  /**
   * Create Stripe Elements
   */
  createElements(clientSecret: string): StripeElements | null {
    if (!this.stripe) return null

    this.elements = this.stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0066cc',
          colorBackground: '#ffffff',
          colorText: '#30313d',
          colorDanger: '#df1b41',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '6px'
        }
      }
    })

    return this.elements
  }
}

// Export singleton instance
export const paymentSystem = new PaymentSystem()

// Export convenience functions
export const calculatePricing = (request: any) => paymentSystem.calculatePricing(request)
export const createPaymentIntent = (request: PaymentRequest) => paymentSystem.createPaymentIntent(request)
export const processPayment = (clientSecret: string, paymentMethodId?: string, billingDetails?: any) => 
  paymentSystem.processPayment(clientSecret, paymentMethodId, billingDetails)
export const validateGiftCard = (code: string) => paymentSystem.validateGiftCard(code)
export const getPaymentHistory = (customerId: string) => paymentSystem.getPaymentHistory(customerId)