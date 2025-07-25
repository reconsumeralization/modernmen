import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newProduct = await prisma.product.create({ data })
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 })
  }
}