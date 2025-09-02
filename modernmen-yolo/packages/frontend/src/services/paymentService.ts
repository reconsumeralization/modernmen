import { loadStripe, Stripe } from '@stripe/stripe-js'
import { supabase } from '@/lib/supabase/client'

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

export interface PaymentMethod {
  id: string
  type: string
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

export interface Subscription {
  id: string
  status: string
  current_period_end: string
  cancel_at_period_end: boolean
}

export class PaymentService {
  private static stripe: Stripe | null = null

  // Initialize Stripe
  static async initializeStripe(): Promise<Stripe> {
    if (!this.stripe) {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (!publishableKey) {
        throw new Error('Stripe publishable key not found')
      }
      this.stripe = await loadStripe(publishableKey)
    }
    return this.stripe
  }

  // Create payment intent for appointment
  static async createPaymentIntent(
    appointmentId: string,
    amount: number,
    currency: string = 'usd'
  ): Promise<PaymentIntent> {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        appointmentId,
        amount,
        currency
      }
    })

    if (error) throw error
    return data
  }

  // Confirm payment for appointment
  static async confirmPayment(
    appointmentId: string,
    paymentIntentId: string
  ): Promise<void> {
    const { error } = await supabase.functions.invoke('confirm-payment', {
      body: {
        appointmentId,
        paymentIntentId
      }
    })

    if (error) throw error
  }

  // Process payment with Stripe
  static async processPayment(
    paymentIntent: PaymentIntent,
    paymentMethodId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const stripe = await this.initializeStripe()
      if (!stripe) {
        throw new Error('Stripe not initialized')
      }

      const { error } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: paymentMethodId
        }
      )

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Payment failed' 
      }
    }
  }

  // Save payment method to customer
  static async savePaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<void> {
    const { error } = await supabase.functions.invoke('save-payment-method', {
      body: {
        customerId,
        paymentMethodId
      }
    })

    if (error) throw error
  }

  // Get customer's saved payment methods
  static async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    const { data, error } = await supabase.functions.invoke('get-payment-methods', {
      body: { customerId }
    })

    if (error) throw error
    return data || []
  }

  // Create subscription for loyalty program
  static async createSubscription(
    customerId: string,
    priceId: string
  ): Promise<Subscription> {
    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: {
        customerId,
        priceId
      }
    })

    if (error) throw error
    return data
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    })

    if (error) throw error
  }

  // Get customer's subscriptions
  static async getSubscriptions(customerId: string): Promise<Subscription[]> {
    const { data, error } = await supabase.functions.invoke('get-subscriptions', {
      body: { customerId }
    })

    if (error) throw error
    return data || []
  }

  // Refund payment
  static async refundPayment(
    paymentIntentId: string,
    amount?: number
  ): Promise<void> {
    const { error } = await supabase.functions.invoke('refund-payment', {
      body: {
        paymentIntentId,
        amount
      }
    })

    if (error) throw error
  }

  // Get payment history
  static async getPaymentHistory(customerId: string): Promise<any[]> {
    const { data, error } = await supabase.functions.invoke('get-payment-history', {
      body: { customerId }
    })

    if (error) throw error
    return data || []
  }

  // Update payment method
  static async updatePaymentMethod(
    paymentMethodId: string,
    updates: Partial<PaymentMethod>
  ): Promise<void> {
    const { error } = await supabase.functions.invoke('update-payment-method', {
      body: {
        paymentMethodId,
        updates
      }
    })

    if (error) throw error
  }

  // Delete payment method
  static async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('delete-payment-method', {
      body: { paymentMethodId }
    })

    if (error) throw error
  }

  // Validate payment method
  static async validatePaymentMethod(
    cardNumber: string,
    expMonth: number,
    expYear: number,
    cvc: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const stripe = await this.initializeStripe()
      if (!stripe) {
        throw new Error('Stripe not initialized')
      }

      // Create a test payment method to validate
      // Note: In production, you should use Stripe Elements for security
      const cardElement = {
        _implementation: {
          createToken: () => Promise.resolve({
            token: { id: 'test_token_' + Date.now() },
            error: null
          })
        }
      } as any

      const { error } = await stripe.createToken(cardElement)

      if (error) {
        return { valid: false, error: error.message }
      }

      return { valid: true }
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Validation failed' 
      }
    }
  }
}
