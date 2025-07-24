import { NextResponse } from 'next/server'

// This is a simplified login handler for demonstration purposes.
// In a real application, you should use a secure authentication library like NextAuth.js
// and store hashed passwords in your database.

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password'
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

// A simple mock JWT generator (in a real app, use a library like 'jsonwebtoken')
function sign(payload: object): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  // In a real scenario, you would use a crypto library to create the signature
  const signature = `${encodedHeader}.${encodedPayload}`;
  return signature;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // In a real app, you would generate a proper JWT token
      const token = sign({ email, role: 'admin' })
      return NextResponse.json({ token })
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
