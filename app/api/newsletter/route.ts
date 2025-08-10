import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, consent } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    // Placeholder implementation. Integrate with provider (Mailchimp/Resend) here.
    console.log('📬 Newsletter signup:', { email, name, consent: !!consent })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}


