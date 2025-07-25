import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const data = await request.json()
    const updatedService = await prisma.service.update({
      where: { id },
      data
    })
    return NextResponse.json(updatedService)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ message: 'Error updating service' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    await prisma.service.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ message: 'Error deleting service' }, { status: 500 })
  }
}