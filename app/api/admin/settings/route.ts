import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.businessSetting.findUnique({ where: { id: 'default' } })
  return NextResponse.json(settings || null)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const settings = await prisma.businessSetting.upsert({
      where: { id: 'default' },
      update: {
        paymentProvider: body.paymentProvider,
        giftCardMode: body.giftCardMode,
        depositAmountCents: body.depositAmountCents ?? 0
      },
      create: {
        id: 'default',
        paymentProvider: body.paymentProvider || 'STRIPE',
        giftCardMode: body.giftCardMode || 'INTERNAL',
        depositAmountCents: body.depositAmountCents ?? 0
      }
    })
    return NextResponse.json(settings)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}


