import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'edge'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, paymentMethodId } = await request.json()

    if (!paymentIntentId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing payment intent ID or payment method ID' },
        { status: 400 }
      )
    }

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 404 }
      )
    }

    // Confirm the payment
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: paymentMethodId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/confirmation`,
      }
    )

    // Check payment status
    if (confirmedPaymentIntent.status === 'succeeded') {
      // Payment successful - you could trigger booking creation here
      // For now, just return success
      return NextResponse.json({
        success: true,
        paymentIntentId: confirmedPaymentIntent.id,
        status: confirmedPaymentIntent.status,
        amount: confirmedPaymentIntent.amount,
        currency: confirmedPaymentIntent.currency,
      })
    } else if (confirmedPaymentIntent.status === 'requires_action') {
      // Payment requires additional action (3D Secure, etc.)
      return NextResponse.json({
        success: false,
        requiresAction: true,
        paymentIntentId: confirmedPaymentIntent.id,
        clientSecret: confirmedPaymentIntent.client_secret,
        status: confirmedPaymentIntent.status,
      })
    } else {
      // Payment failed
      return NextResponse.json({
        success: false,
        error: 'Payment failed',
        status: confirmedPaymentIntent.status,
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Error confirming payment:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
