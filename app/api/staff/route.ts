import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')
  const active = searchParams.get('active')

  const where: any = {}
  if (role) {
    where.role = role.toUpperCase()
  }
  if (active !== undefined) {
    where.isActive = active === 'true'
  }

  try {
    const staff = await prisma.staff.findMany({
      where,
      orderBy: { firstName: 'asc' },
    })
    return NextResponse.json({ staff })
  } catch (error) {
    console.error('Failed to fetch staff:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const staff = await prisma.staff.create({ data })
    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    console.error('Failed to create staff:', error)
    return NextResponse.json(
      { error: 'Failed to create staff' },
      { status: 500 }
    )
  }
}
