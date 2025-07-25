import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import stripe from '@/lib/stripe/config'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = session.metadata?.orderId

        if (orderId) {
          // Update order as paid
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'PAID',
              status: 'PROCESSING',
              paymentMethod: 'card'
            }
          })

          // Update product inventory
          const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
          })

          if (order) {
            for (const item of order.items) {
              await prisma.product.update({
                where: { id: item.productId },
                data: {
                  inStock: {
                    decrement: item.quantity
                  }
                }
              })
            }
          }
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        const orderId = session.metadata?.orderId

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'CANCELLED',
              paymentStatus: 'UNPAID'
            }
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}