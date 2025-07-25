import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {    console.error('Error fetching booking:', error)
    return NextResponse.json({ message: 'Error fetching booking' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const data = await request.json()
    
    // Remove read-only fields that shouldn't be updated directly
    const { client, staff, service, createdAt, updatedAt, ...updateData } = data
    
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        staff: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        service: {
          select: {
            name: true,
            duration: true
          }
        }
      }
    })
    
    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ message: 'Error updating booking' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    await prisma.booking.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json({ message: 'Error deleting booking' }, { status: 500 })
  }
}