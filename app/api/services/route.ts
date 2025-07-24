import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const active = searchParams.get('active')

  const where: any = {}
  if (category) {
    where.category = category
  }
  if (active !== undefined) {
    where.isActive = active === 'true'
  }

  try {
    const services = await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ services })
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const service = await prisma.service.create({ data })
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Failed to create service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}