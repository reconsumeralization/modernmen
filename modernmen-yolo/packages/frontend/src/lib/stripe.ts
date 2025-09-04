import { loadStripe, Stripe } from '@stripe/stripe-js'

// Initialize Stripe with publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!

if (!stripePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
}

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

// Payment intent types
export interface PaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
  metadata?: Record<string, any>
}

// Booking payment data
export interface BookingPaymentData {
  serviceId: string
  serviceName: string
  barberId: string
  barberName: string
  date: string
  time: string
  duration: number
  customerEmail: string
  customerName: string
  customerPhone: string
  amount: number
  currency?: string
  specialRequests?: string
}

// Payment result types
export interface PaymentResult {
  success: boolean
  paymentIntentId?: string
  error?: string
  bookingId?: string
}

// Stripe API functions
export class StripeService {
  private static instance: StripeService

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService()
    }
    return StripeService.instance
  }

  // Create payment intent for booking
  async createBookingPaymentIntent(bookingData: BookingPaymentData): Promise<PaymentIntent> {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create payment intent')
    }

    return response.json()
  }

  // Confirm payment with card details
  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<PaymentResult> {
    const response = await fetch('/api/stripe/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId,
        paymentMethodId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Payment confirmation failed')
    }

    return response.json()
  }

  // Get payment intent status
  async getPaymentIntentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    const response = await fetch(`/api/stripe/payment-intent/${paymentIntentId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get payment status')
    }

    return response.json()
  }

  // Cancel payment intent
  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentResult> {
    const response = await fetch(`/api/stripe/cancel-payment-intent/${paymentIntentId}`, {
      method: 'POST',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to cancel payment')
    }

    return response.json()
  }

  // Refund payment
  async refundPayment(paymentIntentId: string, amount?: number): Promise<PaymentResult> {
    const response = await fetch('/api/stripe/refund-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId,
        amount,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Refund failed')
    }

    return response.json()
  }

  // Get customer payment methods
  async getCustomerPaymentMethods(customerId: string): Promise<any[]> {
    const response = await fetch(`/api/stripe/customer/${customerId}/payment-methods`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get payment methods')
    }

    return response.json()
  }

  // Save payment method for future use
  async savePaymentMethod(
    paymentMethodId: string,
    customerEmail: string
  ): Promise<any> {
    const response = await fetch('/api/stripe/save-payment-method', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentMethodId,
        customerEmail,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to save payment method')
    }

    return response.json()
  }
}

// Export singleton instance
export const stripeService = StripeService.getInstance()

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100) // Stripe amounts are in cents
}

export const calculateProcessingFee = (amount: number): number => {
  // Stripe processing fee: 2.9% + 30¢
  return Math.round((amount * 0.029) + 30)
}

export const calculateTotalWithFees = (amount: number): number => {
  return amount + calculateProcessingFee(amount)
}

// Payment status utilities
export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'succeeded':
      return 'text-green-600 bg-green-100'
    case 'processing':
      return 'text-yellow-600 bg-yellow-100'
    case 'requires_payment_method':
      return 'text-red-600 bg-red-100'
    case 'canceled':
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-blue-600 bg-blue-100'
  }
}

export const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'succeeded':
      return 'Payment Successful'
    case 'processing':
      return 'Processing Payment'
    case 'requires_payment_method':
      return 'Payment Method Required'
    case 'canceled':
      return 'Payment Canceled'
    default:
      return 'Unknown Status'
  }
}
