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
    const provider = searchParams.get('provider')

    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: from, lte: to },
        ...(provider ? { paymentMethod: provider } : {}),
      },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    })

    const rows = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      total: Number(o.total),
      tax: Number(o.tax),
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
      items: o.items.map((it) => ({
        productId: it.productId,
        name: it.product?.name,
        brand: it.product?.brand,
        price: Number(it.price),
        quantity: it.quantity,
        cost: Number(it.product?.cost || 0),
      })),
    }))

    return NextResponse.json({ rows })
  } catch (e) {
    console.error('Accounting sales error:', e)
    return NextResponse.json({ error: 'Failed to load sales' }, { status: 500 })
  }
}


