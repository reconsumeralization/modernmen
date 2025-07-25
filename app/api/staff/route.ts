import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Direct Prisma instance
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where: any = {}
    if (active !== null) {
      where.isActive = active === 'true'
    }

    const staff = await prisma.staff.findMany({
      where,
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    })

    return NextResponse.json(staff)

  } catch (error) {
    console.error('Staff fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const staffData = await request.json()

    const staff = await prisma.staff.create({
      data: {
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email,
        phone: staffData.phone,
        role: staffData.role,
        specialties: staffData.specialties || [],
        workingDays: staffData.workingDays || [],
        startTime: staffData.startTime,
        endTime: staffData.endTime,
        totalBookings: 0,
        rating: 0,
        isActive: true
      }
    })

    return NextResponse.json(staff, { status: 201 })

  } catch (error) {
    console.error('Staff creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}