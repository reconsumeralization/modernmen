import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const clientId = searchParams.get('clientId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const where: any = {}
  if (status) {
    where.status = status.toUpperCase()
  }
  if (clientId) {
    where.clientId = clientId
  }

  try {
    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { firstName: true, lastName: true } },
          items: { include: { product: true } },
        },
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const order = await prisma.order.create({ data })
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}