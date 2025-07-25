import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const clients = await prisma.client.findMany()
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ message: 'Error fetching clients' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newClient = await prisma.client.create({ data })
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ message: 'Error creating client' }, { status: 500 })
  }
}