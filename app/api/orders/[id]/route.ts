import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                brand: true,
                sku: true,
                imageUrls: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const data = await request.json()
    
    const updatedOrder = await prisma.order.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                brand: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}