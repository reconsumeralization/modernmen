import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        bookings: {
          select: { id: true, status: true, totalPrice: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!staff) {
      return NextResponse.json({ message: 'Staff member not found' }, { status: 404 })
    }

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json({ message: 'Error fetching staff' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const data = await request.json()
    const updatedStaff = await prisma.staff.update({
      where: { id },
      data
    })
    return NextResponse.json(updatedStaff)
  } catch (error) {
    console.error('Error updating staff:', error)
    return NextResponse.json({ message: 'Error updating staff' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    await prisma.staff.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Staff member deleted successfully' })
  } catch (error) {
    console.error('Error deleting staff:', error)
    return NextResponse.json({ message: 'Error deleting staff' }, { status: 500 })
  }
}