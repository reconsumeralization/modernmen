import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // In a real application, you might invalidate the token on the server side
  // For now, simply return a success message as the client will remove the token
  return NextResponse.json({ message: 'Logged out successfully' })
}