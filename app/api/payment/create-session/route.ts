import { NextResponse } from 'next/server'
import stripe from '@/lib/stripe/config'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { 
      items, 
      clientId, 
      isPickup = true, 
      shippingAddress 
    } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // Calculate totals
    let subtotal = 0
    const lineItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id }
      })

      if (!product) {
        return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 400 })
      }

      if (product.inStock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}. Only ${product.inStock} available.` 
        }, { status: 400 })
      }

      const itemTotal = Number(product.price) * item.quantity
      subtotal += itemTotal

      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: `${product.brand} ${product.name}`,
            images: product.imageUrls?.length > 0 ? [product.imageUrls[0]] : undefined,
            metadata: {
              productId: product.id,
              sku: product.sku
            }
          },
          unit_amount: Math.round(Number(product.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      })
    }

    // Add shipping if not pickup
    let shippingCost = 0
    if (!isPickup) {
      shippingCost = subtotal >= 75 ? 0 : 9.99 // Free shipping over $75
      if (shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Standard Shipping',
            },
            unit_amount: Math.round(shippingCost * 100),
          },
          quantity: 1,
        })
      }
    }

    // Calculate tax (10% GST for Saskatchewan)
    const tax = (subtotal + shippingCost) * 0.10
    const total = subtotal + shippingCost + tax

    // Create order in database
    const orderNumber = `MM-${Date.now()}`
    const order = await prisma.order.create({
      data: {
        clientId,
        orderNumber,
        subtotal,
        tax,
        total,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        isPickup,
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        orderId: order.id,
        orderNumber,
        isPickup: isPickup.toString(),
      },
      shipping_address_collection: isPickup ? undefined : {
        allowed_countries: ['CA', 'US'],
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      orderId: order.id,
      url: session.url 
    })

  } catch (error) {
    console.error('Payment session creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}