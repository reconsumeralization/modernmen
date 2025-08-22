import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Rate limiting configuration for different auth operations
const AUTH_RATE_LIMITS = {
  signin: {
    requests: 5,
    window: '5m', // 5 requests per 5 minutes
    description: 'Sign in attempts'
  },
  signup: {
    requests: 3,
    window: '1h', // 3 registrations per hour
    description: 'User registrations'
  },
  forgotPassword: {
    requests: 3,
    window: '1h', // 3 password reset requests per hour
    description: 'Password reset requests'
  },
  resetPassword: {
    requests: 5,
    window: '1h', // 5 password reset attempts per hour
    description: 'Password reset attempts'
  },
  api: {
    requests: 100,
    window: '1m', // 100 requests per minute for general API
    description: 'API requests'
  }
}

// Initialize Redis for production (fallback to in-memory for development)
let redis: Redis | null = null
let ratelimit: Ratelimit | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
  })
}

// In-memory rate limiting store for development
const inMemoryStore = new Map<string, { count: number; resetTime: number }>()

function getInMemoryRatelimit(requests: number, windowMs: number) {
  return {
    limit: async (identifier: string) => {
      const now = Date.now()
      const key = identifier
      const stored = inMemoryStore.get(key)

      if (!stored || now > stored.resetTime) {
        inMemoryStore.set(key, { count: 1, resetTime: now + windowMs })
        return { success: true, remaining: requests - 1 }
      }

      if (stored.count >= requests) {
        return {
          success: false,
          remaining: 0,
          reset: new Date(stored.resetTime)
        }
      }

      stored.count++
      return { success: true, remaining: requests - stored.count }
    }
  }
}

export class AuthRateLimiter {
  private limiter: any

  constructor(private config: typeof AUTH_RATE_LIMITS.signin) {
    if (ratelimit) {
      // Use Redis-based rate limiting
      this.limiter = new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(config.requests, config.window),
      })
    } else {
      // Use in-memory rate limiting
      this.limiter = getInMemoryRatelimit(config.requests, this.parseWindow(config.window))
    }
  }

  private parseWindow(window: string): number {
    const match = window.match(/(\d+)([smhd])/)
    if (!match) return 60000 // Default to 1 minute

    const value = parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case 's': return value * 1000
      case 'm': return value * 60 * 1000
      case 'h': return value * 60 * 60 * 1000
      case 'd': return value * 24 * 60 * 60 * 1000
      default: return 60000
    }
  }

  async check(identifier: string) {
    try {
      const result = await this.limiter.limit(identifier)

      return {
        success: result.success,
        remaining: result.remaining || 0,
        reset: result.reset || new Date(Date.now() + this.parseWindow(this.config.window)),
        limit: this.config.requests,
        window: this.config.window
      }
    } catch (error) {
      console.error('Rate limit error:', error)
      // Allow request on error to prevent blocking legitimate users
      return {
        success: true,
        remaining: this.config.requests - 1,
        reset: new Date(Date.now() + this.parseWindow(this.config.window)),
        limit: this.config.requests,
        window: this.config.window
      }
    }
  }
}

// Export pre-configured rate limiters
export const authRateLimiters = {
  signin: new AuthRateLimiter(AUTH_RATE_LIMITS.signin),
  signup: new AuthRateLimiter(AUTH_RATE_LIMITS.signup),
  forgotPassword: new AuthRateLimiter(AUTH_RATE_LIMITS.forgotPassword),
  resetPassword: new AuthRateLimiter(AUTH_RATE_LIMITS.resetPassword),
  api: new AuthRateLimiter(AUTH_RATE_LIMITS.api),
}

// Helper function to get rate limit from request
export function getRateLimitIdentifier(request: Request, type: keyof typeof AUTH_RATE_LIMITS): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  switch (type) {
    case 'signin':
    case 'signup':
      return `auth:${type}:${ip}`
    case 'forgotPassword':
    case 'resetPassword':
      return `auth:${type}:${ip}`
    case 'api':
      return `api:${ip}`
    default:
      return `auth:${type}:${ip}`
  }
}

// Helper function to create rate limit response
export function createRateLimitResponse(result: any) {
  const resetTime = Math.ceil((result.reset.getTime() - Date.now()) / 1000)

  return new Response(JSON.stringify({
    error: 'Rate limit exceeded',
    message: `Too many requests. Please try again in ${Math.ceil(resetTime / 60)} minutes.`,
    retryAfter: resetTime
  }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toISOString(),
      'Retry-After': resetTime.toString()
    }
  })
}
