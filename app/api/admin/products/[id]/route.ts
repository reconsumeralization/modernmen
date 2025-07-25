import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const data = await request.json()
    const updatedProduct = await prisma.product.update({
      where: { id },
      data
    })
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    await prisma.product.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 })
  }
}