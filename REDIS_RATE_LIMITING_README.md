# Redis-Based Rate Limiting Implementation

## Overview

The Modern Men Salon application now uses **Redis-based rate limiting** for production environments, with automatic fallback to in-memory rate limiting for development and when Redis is unavailable.

## Features

### 🚀 Production-Ready Rate Limiting
- **Redis Integration**: Uses Upstash Redis for distributed rate limiting
- **Automatic Fallback**: Falls back to in-memory limiting if Redis fails
- **Multiple Limits**: Different limits for signin, signup, forgot password, and API requests
- **Smart Headers**: RFC-compliant rate limit headers in responses

### 📊 Rate Limiting Configuration

| Operation | Requests | Window | Description |
|-----------|----------|--------|-------------|
| **Sign In** | 5 | 5 minutes | Login attempts |
| **Sign Up** | 3 | 1 hour | User registrations |
| **Forgot Password** | 3 | 1 hour | Password reset requests |
| **Reset Password** | 5 | 1 hour | Password reset attempts |
| **API** | 100 | 1 minute | General API requests |

### 🔧 Setup Instructions

#### 1. Set Up Redis (Recommended)

1. **Create Upstash Account**: Visit [upstash.com](https://upstash.com)
2. **Create Redis Database**: Choose the free tier for development
3. **Get Connection Details**: Copy REST URL and token

#### 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Redis Rate Limiting
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

#### 3. Testing Redis Connection

Visit: `http://localhost:3000/api/test-ratelimit`

This endpoint returns:
```json
{
  "rateLimit": {
    "success": true,
    "remaining": 99,
    "limit": 100,
    "window": "1m",
    "usingRedis": true,
    "resetTime": "2024-01-01T12:01:00.000Z"
  }
}
```

## 🔍 Monitoring & Health Checks

### Rate Limit Headers

Successful requests include:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 2024-01-01T12:01:00.000Z
X-RateLimit-Using-Redis: true
```

### Rate Limit Exceeded Response

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again in 1 minutes.",
  "retryAfter": 60,
  "details": {
    "limit": 100,
    "remaining": 0,
    "reset": "2024-01-01T12:01:00.000Z",
    "window": "1m",
    "usingRedis": true,
    "fallbackMode": false,
    "errorOccurred": false
  }
}
```

### Health Check Function

```typescript
import { checkRedisHealth } from '@/lib/auth-ratelimit'

const health = await checkRedisHealth()
// Returns: { healthy: true, redis: true, fallback: false }
```

## 🛡️ Security Benefits

### ✅ Production Security
- **Distributed Limiting**: Rate limits work across multiple server instances
- **Attack Prevention**: Prevents brute force attacks on authentication endpoints
- **Resource Protection**: Protects API endpoints from abuse
- **DDoS Mitigation**: Helps mitigate distributed denial of service attacks

### ✅ Development Experience
- **Zero Configuration**: Works out of the box with in-memory fallback
- **Clear Logging**: Detailed logging of rate limiting events
- **Easy Testing**: Simple test endpoint for verification

## 🚨 Error Handling

### Graceful Degradation
1. **Primary**: Redis-based rate limiting
2. **Fallback**: In-memory rate limiting
3. **Last Resort**: Allow requests with error logging

### Monitoring Alerts
- Redis connection failures are logged as warnings
- Fallback mode activation is logged
- Performance issues (>1s response time) are logged

## 📈 Performance Impact

### Redis Mode
- **Response Time**: ~10-50ms per request
- **Memory Usage**: Minimal (stored in Redis)
- **Scalability**: Unlimited horizontal scaling

### In-Memory Mode
- **Response Time**: ~1-5ms per request
- **Memory Usage**: Grows with active connections
- **Scalability**: Limited to single instance

## 🔧 Configuration Options

### Custom Rate Limits

```typescript
// In src/lib/auth-ratelimit.ts
const AUTH_RATE_LIMITS = {
  api: {
    requests: 1000,  // Increase for high-traffic apps
    window: '1m',
    description: 'API requests'
  }
}
```

### Environment-Based Configuration

```typescript
const isProduction = process.env.NODE_ENV === 'production'
const enableRedis = isProduction && process.env.UPSTASH_REDIS_REST_URL
```

## 🧪 Testing

### Unit Tests

```typescript
import { authRateLimiters } from '@/lib/auth-ratelimit'

describe('Rate Limiting', () => {
  it('should allow requests within limit', async () => {
    const result = await authRateLimiters.api.check('test-ip')
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(99)
  })
})
```

### Integration Tests

```typescript
// Test the actual API endpoint
const response = await fetch('/api/test-ratelimit')
const data = await response.json()
expect(data.rateLimit.usingRedis).toBe(true)
```

## 🚀 Deployment Checklist

- [ ] Set `UPSTASH_REDIS_REST_URL` environment variable
- [ ] Set `UPSTASH_REDIS_REST_TOKEN` environment variable
- [ ] Test Redis connection with `/api/test-ratelimit`
- [ ] Monitor Redis connection health in production logs
- [ ] Set up alerts for Redis connection failures

## 📚 Troubleshooting

### Common Issues

**"Using in-memory rate limiting" warning in production**
- Ensure Redis environment variables are set correctly
- Check Redis service status
- Verify network connectivity to Redis

**Rate limiting too strict/aggressive**
- Adjust limits in `AUTH_RATE_LIMITS` configuration
- Increase window times for less aggressive limiting
- Consider different limits for different endpoints

**Performance issues**
- Monitor Redis response times
- Consider Redis connection pooling
- Use Redis clusters for high-traffic applications

## 🎯 Next Steps

1. **Test Redis Setup**: Use the test endpoint to verify configuration
2. **Monitor Production**: Watch logs for Redis connection issues
3. **Fine-tune Limits**: Adjust rate limits based on actual usage patterns
4. **Add Monitoring**: Set up alerts for rate limiting events

This implementation provides enterprise-grade rate limiting with minimal configuration and maximum reliability! 🚀
