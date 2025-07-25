import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Direct Prisma instance
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')

    const where: any = {}
    if (category) {
      where.category = category
    }
    if (featured !== null) {
      where.isFeatured = featured === 'true'
    }
    if (active !== null) {
      where.isActive = active === 'true'
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(products)

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        brand: productData.brand,
        description: productData.description || '',
        price: productData.price,
        cost: productData.cost || 0,
        category: productData.category,
        inStock: productData.inStock,
        sku: productData.sku,
        imageUrls: productData.imageUrls || [],
        isFeatured: productData.isFeatured || false,
        isActive: true
      }
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}