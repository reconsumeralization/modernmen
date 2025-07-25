import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { client: true, items: { include: { product: true } } },
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newOrder = await prisma.order.create({ data })
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 })
  }
}