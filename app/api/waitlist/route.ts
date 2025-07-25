import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: Add to waitlist
export async function POST(request: NextRequest) {
  try {
    const { clientId, serviceId, preferredStaffId, requestedDate } = await request.json()
    if (!clientId || !serviceId || !requestedDate) {
      return NextResponse.json({ error: 'clientId, serviceId, and requestedDate are required' }, { status: 400 })
    }
    const entry = await prisma.waitlistEntry.create({
      data: {
        clientId,
        serviceId,
        preferredStaffId: preferredStaffId || null,
        requestedDate: new Date(requestedDate),
        status: 'WAITING'
      }
    })
    return NextResponse.json({ success: true, entry })
  } catch (error) {
    console.error('❌ WAITLIST POST ERROR:', error)
    return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 })
  }
}

// GET: List waitlist entries (optionally filter by status/service/date)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const serviceId = searchParams.get('serviceId')
    const date = searchParams.get('date')
    const where: any = {}
    if (status) where.status = status
    if (serviceId) where.serviceId = serviceId
    if (date) {
      const d = new Date(date)
      where.requestedDate = { gte: d, lt: new Date(d.getTime() + 24*60*60*1000) }
    }
    const entries = await prisma.waitlistEntry.findMany({
      where,
      include: {
        client: { select: { firstName: true, lastName: true, email: true, phone: true } },
        service: { select: { name: true } },
        preferredStaff: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json({ entries })
  } catch (error) {
    console.error('❌ WAITLIST GET ERROR:', error)
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 })
  }
}

// PATCH: Update waitlist entry status
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }
    const updated = await prisma.waitlistEntry.update({
      where: { id },
      data: { status }
    })
    return NextResponse.json({ success: true, entry: updated })
  } catch (error) {
    console.error('❌ WAITLIST PATCH ERROR:', error)
    return NextResponse.json({ error: 'Failed to update waitlist entry' }, { status: 500 })
  }
}

// DELETE: Remove/cancel waitlist entry
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }
    await prisma.waitlistEntry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ WAITLIST DELETE ERROR:', error)
    return NextResponse.json({ error: 'Failed to delete waitlist entry' }, { status: 500 })
  }
} 