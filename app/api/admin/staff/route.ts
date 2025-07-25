import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const staff = await prisma.staff.findMany()
    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json({ message: 'Error fetching staff' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newStaff = await prisma.staff.create({ data })
    return NextResponse.json(newStaff, { status: 201 })
  } catch (error) {
    console.error('Error creating staff:', error)
    return NextResponse.json({ message: 'Error creating staff' }, { status: 500 })
  }
}