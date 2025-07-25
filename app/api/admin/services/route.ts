import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany()
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ message: 'Error fetching services' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newService = await prisma.service.create({ data })
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ message: 'Error creating service' }, { status: 500 })
  }
}