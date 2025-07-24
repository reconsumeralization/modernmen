import { NextRequest, NextResponse } from 'next/server'

// Facebook Messenger webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  
  // Verify the webhook (use your verify token)
  const VERIFY_TOKEN = process.env.MESSENGER_VERIFY_TOKEN || 'modern_men_verify_token'
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Messenger webhook verified')
    return new Response(challenge)
  }
  
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

// Handle incoming messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process webhook data
    if (body.object === 'page') {
      body.entry?.forEach((entry: any) => {
        const webhookEvent = entry.messaging?.[0]
        
        if (webhookEvent) {
          handleMessage(webhookEvent)
        }
      })
      
      return NextResponse.json({ status: 'EVENT_RECEIVED' })
    }
    
    return NextResponse.json({ error: 'Invalid webhook data' }, { status: 404 })
  } catch (error) {
    console.error('Messenger webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleMessage(event: any) {
  const senderId = event.sender.id
  const message = event.message
  
  console.log('📱 Messenger message received:', { senderId, message })
  
  if (message?.text) {
    const text = message.text.toLowerCase()
    let response = ''
    
    // Simple bot responses
    if (text.includes('book') || text.includes('appointment')) {
      response = `Hi! I'd love to help you book an appointment at Modern Men Hair Salon! 

📞 Call us: (306) 522-4111
💬 Text us: (306) 541-5511
🌐 Online booking: https://modernmen.ca

Our services:
✂️ Men's Haircuts (from $45)
🧔 Beard Grooming (from $25)
🎨 Hair Tattoos (from $35)

We're open Mon-Sat, closed Sundays!`
    } else if (text.includes('hours') || text.includes('open')) {
      response = `Our hours are:
Monday: 9am - 6pm
Tuesday: 9am - 5pm
Wednesday: 9am - 8pm
Thursday: 9am - 8pm
Friday: 9am - 5pm
Saturday: 9am - 5pm
Sunday: Closed

📍 #4 - 425 Victoria Ave East, Regina, SK`
    } else if (text.includes('price') || text.includes('cost')) {
      response = `Our pricing:
✂️ Men's Haircuts & Styling: Starting at $45
🧔 Beard Grooming & Shaving: Starting at $25
🎨 Hair Tattoos & Design: Starting at $35

Call (306) 522-4111 for specific pricing!`
    } else if (text.includes('location') || text.includes('address')) {
      response = `We're located at:
📍 #4 - 425 Victoria Ave East
Regina, SK S4N 0N8

Free parking available!
Call: (306) 522-4111`
    } else {
      response = `Hi! Welcome to Modern Men Hair Salon! 

How can I help you today?
📅 Book an appointment
🕒 Check our hours
💰 View pricing
📍 Get directions

Or call us at (306) 522-4111!`
    }
    
    // Send response back to user
    await sendMessage(senderId, response)
  }
}

async function sendMessage(recipientId: string, messageText: string) {
  const PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN
  
  if (!PAGE_ACCESS_TOKEN) {
    console.error('No Messenger page access token configured')
    return
  }
  
  const messageData = {
    recipient: { id: recipientId },
    message: { text: messageText }
  }
  
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData)
    })
    
    const result = await response.json()
    console.log('✅ Messenger response sent:', result)
  } catch (error) {
    console.error('❌ Failed to send Messenger response:', error)
  }
}
