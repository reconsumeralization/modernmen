import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

function generateCode() {
  return crypto.randomBytes(6).toString('hex').toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const { amountCents, recipientEmail, purchaserEmail, message, expiresAt } = await request.json()
    if (!amountCents || !recipientEmail || !purchaserEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const code = generateCode()
    const amount = (amountCents / 100).toString()
    const card = await prisma.giftCard.create({
      data: {
        code,
        amount,
        balance: amount,
        status: 'PENDING',
        recipientEmail,
        purchaserEmail,
        message,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    })
    return NextResponse.json({ success: true, code: card.code, id: card.id })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create gift card' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })
    const card = await prisma.giftCard.update({ where: { code }, data: { status: 'ACTIVE', activatedAt: new Date() } })
    return NextResponse.json({ success: true, card })
  } catch (e) {
    return NextResponse.json({ error: 'Activation failed' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { code, redeemCents, context, referenceId } = await request.json()
    if (!code || !redeemCents) return NextResponse.json({ error: 'Code and redeem amount required' }, { status: 400 })
    const card = await prisma.giftCard.findUnique({ where: { code } })
    if (!card) return NextResponse.json({ error: 'Gift card not found' }, { status: 404 })
    if (card.status !== 'ACTIVE') return NextResponse.json({ error: 'Gift card not active' }, { status: 400 })
    const redeemAmount = (redeemCents / 100)
    if (Number(card.balance) < redeemAmount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    const newBalance = (Number(card.balance) - redeemAmount).toString()
    const updated = await prisma.giftCard.update({ where: { code }, data: { balance: newBalance, status: Number(newBalance) === 0 ? 'REDEEMED' : 'ACTIVE' } })
    await prisma.giftCardRedemption.create({ data: { giftCardId: updated.id, amount: redeemAmount.toString(), context: context || 'ORDER', referenceId } })
    return NextResponse.json({ success: true, balance: updated.balance, status: updated.status })
  } catch (e) {
    return NextResponse.json({ error: 'Redemption failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })
  const card = await prisma.giftCard.findUnique({ where: { code } })
  if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    code: card.code,
    amount: card.amount,
    balance: card.balance,
    status: card.status,
    expiresAt: card.expiresAt
  })
}


