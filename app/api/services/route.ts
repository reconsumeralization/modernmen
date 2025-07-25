import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Direct Prisma instance
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const active = searchParams.get('active')

    const where: any = {}
    if (category) {
      where.category = category
    }
    if (active !== null) {
      where.isActive = active === 'true'
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(services)

  } catch (error) {
    console.error('Services fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json()

    const service = await prisma.service.create({
      data: {
        name: serviceData.name,
        description: serviceData.description || '',
        duration: serviceData.duration,
        price: serviceData.price,
        category: serviceData.category,
        addOns: serviceData.addOns || [],
        isActive: true
      }
    })

    return NextResponse.json(service, { status: 201 })

  } catch (error) {
    console.error('Service creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}