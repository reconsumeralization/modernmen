'use client'

import React, { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, Shield, Lock, CheckCircle } from 'lucide-react'
import { stripeService, formatCurrency, calculateProcessingFee, getPaymentStatusColor, getPaymentStatusLabel } from '@/lib/stripe'
import { analyticsService, trackPaymentFunnel, EVENT_ACTIONS, EVENT_CATEGORIES } from '@/lib/analytics'
import { ECOMMERCE_CONFIG } from '@/config/analytics'

interface StripePaymentFormProps {
  amount: number
  currency?: string
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  bookingData?: any
  className?: string
}

export function StripePaymentForm({
  amount,
  currency = 'usd',
  onPaymentSuccess,
  onPaymentError,
  bookingData,
  className
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [saveCard, setSaveCard] = useState(false)

  const processingFee = calculateProcessingFee(amount)
  const totalAmount = amount + processingFee

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const paymentIntent = await stripeService.createBookingPaymentIntent({
          serviceId: bookingData?.serviceId || 'unknown',
          serviceName: bookingData?.serviceName || 'Hair Service',
          barberId: bookingData?.barberId || 'unknown',
          barberName: bookingData?.barberName || 'Barber',
          date: bookingData?.date || new Date().toISOString().split('T')[0],
          time: bookingData?.time || '12:00 PM',
          duration: bookingData?.duration || 30,
          customerEmail: bookingData?.customerEmail || '',
          customerName: bookingData?.customerName || '',
          customerPhone: bookingData?.customerPhone || '',
          amount: totalAmount,
          currency,
          specialRequests: bookingData?.specialRequests || ''
        })

        setClientSecret(paymentIntent.client_secret)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize payment')
        onPaymentError(error instanceof Error ? error.message : 'Failed to initialize payment')
      }
    }

    if (bookingData) {
      createPaymentIntent()
    }
  }, [bookingData, amount, currency, totalAmount, onPaymentError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      setErrorMessage('Stripe has not been properly initialized')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setPaymentStatus('processing')

    // Track payment initiation
    trackPaymentFunnel.initiated(totalAmount, currency.toUpperCase())

    // Track e-commerce begin_checkout event
    analyticsService.trackEvent({
      action: 'begin_checkout',
      category: EVENT_CATEGORIES.CONVERSION,
      label: bookingData?.serviceId || 'unknown',
      value: Math.round(totalAmount * 100),
      customParameters: {
        currency: currency.toUpperCase(),
        items: [{
          item_id: bookingData?.serviceId || 'unknown',
          item_name: bookingData?.serviceName || 'Hair Service',
          item_category: 'Hair Service',
          price: amount,
          quantity: 1,
          barber_id: bookingData?.barberId,
          barber_name: bookingData?.barberName
        }],
        checkout_step: 1,
        checkout_step_option: 'credit_card'
      }
    })

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
          receipt_email: bookingData?.customerEmail,
        },
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message || 'Payment failed')
        setPaymentStatus('failed')

        // Track payment failure
        trackPaymentFunnel.failed(error.message || 'Payment failed', totalAmount)

        // Track payment error event
        analyticsService.trackEvent({
          action: EVENT_ACTIONS.PAYMENT_FAILED,
          category: EVENT_CATEGORIES.PAYMENT,
          label: error.message || 'Payment failed',
          value: Math.round(totalAmount * 100),
          customParameters: {
            error_type: error.type || 'payment_error',
            error_code: error.code || 'unknown',
            currency: currency.toUpperCase(),
            service_id: bookingData?.serviceId,
            barber_id: bookingData?.barberId,
            timestamp: new Date().toISOString()
          }
        })

        onPaymentError(error.message || 'Payment failed')
      } else if (paymentIntent) {
        setPaymentStatus(paymentIntent.status)

        if (paymentIntent.status === 'succeeded') {
          // Track successful payment
          trackPaymentFunnel.completed(paymentIntent.id, totalAmount, currency.toUpperCase())

          // Track e-commerce purchase event
          analyticsService.trackPurchase({
            transaction_id: paymentIntent.id,
            value: totalAmount,
            currency: currency.toUpperCase(),
            tax: totalAmount * ECOMMERCE_CONFIG.TAX_RATE,
            shipping: ECOMMERCE_CONFIG.SHIPPING_COST,
            items: [{
              item_id: bookingData?.serviceId || 'unknown',
              item_name: bookingData?.serviceName || 'Hair Service',
              item_category: 'Hair Service',
              price: amount,
              quantity: 1,
              barber_id: bookingData?.barberId,
              barber_name: bookingData?.barberName
            }],
            customer_email: bookingData?.customerEmail,
            customer_id: bookingData?.customerId
          })

          // Track conversion goal
          analyticsService.trackConversion('payment_completed', totalAmount, {
            transaction_id: paymentIntent.id,
            service_id: bookingData?.serviceId,
            barber_id: bookingData?.barberId,
            booking_date: bookingData?.date,
            booking_time: bookingData?.time
          })

          onPaymentSuccess(paymentIntent.id)

          // Save payment method if requested
          if (saveCard && paymentIntent.payment_method) {
            try {
              await stripeService.savePaymentMethod(
                paymentIntent.payment_method as string,
                bookingData?.customerEmail
              )
            } catch (saveError) {
              console.warn('Failed to save payment method:', saveError)
              // Don't fail the payment for this
            }
          }
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed')
      setPaymentStatus('failed')
      onPaymentError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Initializing payment...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Service Total:</span>
              <span>{formatCurrency(amount, currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Processing Fee:</span>
              <span>{formatCurrency(processingFee, currency)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(totalAmount, currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus && (
          <Alert className={paymentStatus === 'succeeded' ? 'border-green-200 bg-green-50' : ''}>
            <AlertDescription className="flex items-center gap-2">
              {paymentStatus === 'succeeded' && <CheckCircle className="w-4 h-4 text-green-600" />}
              <span className={`font-medium ${getPaymentStatusColor(paymentStatus)}`}>
                {getPaymentStatusLabel(paymentStatus)}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Information</label>
            <PaymentElement
              options={{
                layout: 'tabs',
                paymentMethodOrder: ['card', 'link'],
              }}
            />
          </div>

          {/* Billing Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Billing Address</label>
            <AddressElement
              options={{
                mode: 'billing',
                allowedCountries: ['US', 'CA', 'GB', 'AU'],
              }}
            />
          </div>

          {/* Save Card Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="saveCard"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="saveCard" className="text-sm text-muted-foreground">
              Save this payment method for future bookings
            </label>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-800 mb-1">Secure Payment</div>
                <div className="text-blue-700">
                  Your payment information is encrypted and secure. We use Stripe's PCI-compliant payment processing.
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full text-lg py-6"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Pay {formatCurrency(totalAmount, currency)}
              </>
            )}
          </Button>
        </form>

        {/* Trust Badges */}
        <div className="flex justify-center gap-4 pt-4 border-t">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            SSL Encrypted
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            PCI Compliant
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Stripe Protected
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
