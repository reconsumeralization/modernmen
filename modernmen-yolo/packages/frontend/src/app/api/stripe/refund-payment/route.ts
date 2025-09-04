import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'edge'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, amount } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // First, retrieve the payment intent to get the charge ID
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!paymentIntent.latest_charge) {
      return NextResponse.json(
        { error: 'No charge found for this payment intent' },
        { status: 400 }
      )
    }

    const chargeId = paymentIntent.latest_charge as string

    // Create the refund
    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: amount, // Amount in cents, if not provided, full refund
      reason: 'requested_by_customer',
      metadata: {
        paymentIntentId,
        originalAmount: paymentIntent.amount,
      },
    })

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status,
      paymentIntentId,
    })

  } catch (error) {
    console.error('Error processing refund:', error)

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
