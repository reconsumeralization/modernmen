import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { BookingPaymentData } from '@/lib/stripe'

export const runtime = 'edge'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const body: BookingPaymentData = await request.json()

    // Validate required fields
    if (!body.customerEmail || !body.customerName || !body.amount) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      )
    }

    // Create or retrieve customer
    let customer
    try {
      const existingCustomers = await stripe.customers.list({
        email: body.customerEmail,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: body.customerEmail,
          name: body.customerName,
          phone: body.customerPhone,
          metadata: {
            serviceId: body.serviceId,
            barberId: body.barberId,
          },
        })
      }
    } catch (error) {
      console.error('Error creating/retrieving customer:', error)
      return NextResponse.json(
        { error: 'Failed to process customer information' },
        { status: 500 }
      )
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount, // Amount in cents
      currency: body.currency || 'usd',
      customer: customer.id,
      receipt_email: body.customerEmail,
      description: `${body.serviceName} with ${body.barberName}`,
      metadata: {
        serviceId: body.serviceId,
        serviceName: body.serviceName,
        barberId: body.barberId,
        barberName: body.barberName,
        date: body.date,
        time: body.time,
        duration: body.duration.toString(),
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        specialRequests: body.specialRequests || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
      setup_future_usage: 'off_session', // Allow saving card for future payments
    })

    return NextResponse.json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)

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
