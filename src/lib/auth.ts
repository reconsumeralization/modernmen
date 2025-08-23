import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import { createClient } from '@supabase/supabase-js'
import * as bcrypt from 'bcryptjs'
import { z } from 'zod'
import { logger } from './logger'

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXTAUTH_SECRET'
]

// Only validate environment variables in production
if (process.env.NODE_ENV === 'production') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar] || process.env[envVar]?.includes('your-') || process.env[envVar]?.includes('https://your-project')) {
      throw new Error(`Missing or placeholder value for required environment variable: ${envVar}. Please update your .env.local file with actual values.`)
    }
  }
}

// Create Supabase client for adapter
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseKey,
  }),
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []
    ),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        })]
      : []
    ),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            logger.authEvent('signin_failed_missing_credentials')
            throw new Error('Missing credentials')
          }

          const validatedFields = loginSchema.safeParse(credentials)
          if (!validatedFields.success) {
            logger.authEvent('signin_failed_invalid_format', {
              email: credentials.email
            })
            throw new Error('Invalid email or password format')
          }

          const { email, password } = validatedFields.data

          logger.authEvent('signin_attempt', {
            email: email.toLowerCase()
          })

          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

          if (error) {
            console.error('Supabase error:', error)
            logger.authError('signin_failed_database_error', {
              email: email.toLowerCase(),
              error: error.message
            })
            throw new Error('Database error occurred')
          }

          if (!user || !user.password) {
            logger.authEvent('signin_failed_user_not_found', {
              email: email.toLowerCase()
            })
            throw new Error('Invalid credentials')
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (!isPasswordValid) {
            logger.authEvent('signin_failed_invalid_password', {
              email: email.toLowerCase(),
              userId: user.id
            })
            throw new Error('Invalid credentials')
          }

          logger.authEvent('signin_success', {
            userId: user.id,
            email: user.email,
            role: user.role
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          logger.authError('signin_failed', {
            email: credentials?.email
          }, error instanceof Error ? error : new Error('Unknown authorization error'))
          throw error
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ;(session.user as any).id = token.sub!
        ;(session.user as any).role = token.role as string
        ;(session as any).accessToken = token.accessToken as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async signIn(message) {
      console.log('Sign in event:', message)
    },
    async signOut(message) {
      console.log('Sign out event:', message)
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '2592000'), // 30 days default
  },
  secret: process.env.NEXTAUTH_SECRET,
}
