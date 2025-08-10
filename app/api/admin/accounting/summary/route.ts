import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function parseRange(search: URLSearchParams) {
  const from = search.get('from') ? new Date(search.get('from') as string) : new Date('2000-01-01')
  const to = search.get('to') ? new Date(search.get('to') as string) : new Date()
  return { from, to }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { from, to } = parseRange(searchParams)

    const [ordersPaid, orderItems, giftCards] = await Promise.all([
      prisma.order.findMany({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: from, lte: to },
        },
        select: { subtotal: true, tax: true, total: true },
      }),
      prisma.orderItem.findMany({
        where: { order: { paymentStatus: 'PAID', createdAt: { gte: from, lte: to } } },
        select: { price: true, quantity: true, product: { select: { cost: true } } },
      }),
      (prisma as any).giftCard?.findMany?.({
        select: { balance: true, status: true },
      }) || [],
    ])

    const revenue = ordersPaid.reduce((s: number, o: any) => s + Number(o.total), 0)
    const tax = ordersPaid.reduce((s: number, o: any) => s + Number(o.tax), 0)
    const cogs = orderItems.reduce((s: number, it: any) => s + (Number(it.product?.cost || 0) * it.quantity), 0)
    const grossMargin = revenue - cogs
    const giftCardLiability = (giftCards as any[])
      .filter((g: any) => g.status === 'ACTIVE')
      .reduce((s: number, g: any) => s + Number(g.balance), 0)

    return NextResponse.json({
      range: { from, to },
      revenue,
      tax,
      cogs,
      grossMargin,
      giftCardLiability,
      ordersCount: ordersPaid.length,
    })
  } catch (e) {
    console.error('Accounting summary error:', e)
    return NextResponse.json({ error: 'Failed to load summary' }, { status: 500 })
  }
}


