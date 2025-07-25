import { AdminLoginResponse } from '@/types'

export async function loginAdmin(username: string, password: string): Promise<AdminLoginResponse> {
  const res = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Failed to login')
  }

  return res.json()
}