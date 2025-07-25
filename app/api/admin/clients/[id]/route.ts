import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            service: true,
            staff: true
          },
          orderBy: { createdAt: 'desc' }
        },
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        clientNotes: {
          orderBy: { createdAt: 'desc' }
        },
        loyaltyPoints: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {    console.error('Error fetching client:', error)
    return NextResponse.json({ message: 'Error fetching client' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const data = await request.json()
    const updatedClient = await prisma.client.update({
      where: { id },
      data
    })
    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json({ message: 'Error updating client' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    await prisma.client.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json({ message: 'Error deleting client' }, { status: 500 })
  }
}