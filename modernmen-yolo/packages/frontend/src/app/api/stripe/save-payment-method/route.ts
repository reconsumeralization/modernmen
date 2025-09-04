import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'edge'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { paymentMethodId, customerEmail } = await request.json()

    if (!paymentMethodId || !customerEmail) {
      return NextResponse.json(
        { error: 'Payment method ID and customer email are required' },
        { status: 400 }
      )
    }

    // Find or create customer
    let customer
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      return NextResponse.json(
        { error: 'Customer not found. Payment method can only be saved after a successful payment.' },
        { status: 400 }
      )
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    })

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    return NextResponse.json({
      success: true,
      paymentMethodId,
      customerId: customer.id,
      message: 'Payment method saved successfully',
    })

  } catch (error) {
    console.error('Error saving payment method:', error)

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
