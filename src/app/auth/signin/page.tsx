'use client'

import { getProviders, signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Icons } from '@/components/ui/icons'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [providers, setProviders] = useState<any>(null)
  const searchParams = useSearchParams()
  const router = useRouter()


  const callbackUrl = searchParams?.get('callbackUrl') || '/'
  const error = searchParams?.get('error')

  useEffect(() => {
    const getProvidersData = async () => {
      const providers = await getProviders()
      setProviders(providers)
    }
    getProvidersData()

    if (error) {
      toast.error(error === 'CredentialsSignin' ? 'Invalid credentials' : 'Authentication failed')
    }
  }, [error])

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Sign in failed: ' + result.error)
      } else {
        toast.success('Signed in successfully! Welcome back!')
        router.push(callbackUrl)
      }
    } catch (error) {
      toast.error('Sign in failed: An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OAuth Providers */}
          {providers && Object.values(providers)
            .filter((provider: any) => provider.id !== 'credentials')
            .map((provider: any) => (
              <Button
                key={provider.name}
                variant="outline"
                onClick={() => handleProviderSignIn(provider.id)}
                className="w-full"
                disabled={isLoading}
              >
                {provider.id === 'google' && <Icons.google className="mr-2 h-4 w-4" />}
                {provider.id === 'github' && <Icons.gitHub className="mr-2 h-4 w-4" />}
                Continue with {provider.name}
              </Button>
            ))}

          {/* Divider */}
          {providers && Object.values(providers).length > 1 && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          )}

          {/* Credentials Form */}
          {providers && Object.values(providers).some((p: any) => p.id === 'credentials') && (
            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
