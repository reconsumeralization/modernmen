import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')
  const inStock = searchParams.get('inStock')
  const featured = searchParams.get('featured')
  const active = searchParams.get('active')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const where: any = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as any } },
          { brand: { contains: search, mode: 'insensitive' as any } },
          { description: { contains: search, mode: 'insensitive' as any } },
          { sku: { contains: search, mode: 'insensitive' as any } },
        ],
      }
    : {}

  if (category) {
    where.category = category
  }
  if (brand) {
    where.brand = brand
  }
  if (inStock !== undefined) {
    where.inStock = inStock === 'true' ? { gt: 0 } : 0
  }
  if (featured !== undefined) {
    where.isFeatured = featured === 'true'
  }
  if (active !== undefined) {
    where.isActive = active === 'true'
  }

  try {
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: 'asc' },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const product = await prisma.product.create({ data })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
