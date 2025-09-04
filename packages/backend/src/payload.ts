import { getPayload } from 'payload'
import { validatePayloadEnvironmentStrict } from './lib/env-validation'
import { payloadShutdown } from './lib/payload-graceful-shutdown'

// Validate environment variables before initializing Payload
if (typeof window === 'undefined') {
  // Only validate on server-side
  validatePayloadEnvironmentStrict();
}

// Use production config in production, simple config for development
const config = process.env.NODE_ENV === 'production'
  ? require('./payload.config.production').default
  : require('./payload.config.simple').default

let cached = global.payload

if (!cached) {
  cached = global.payload = { client: null, promise: null }
}

const getPayloadClient = async () => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayload({
      config,
    })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}

// Vercel-specific initialization
if (typeof globalThis !== 'undefined') {
  globalThis.payload = cached
}

export default getPayloadClient
export { getPayloadClient }

// Add type declaration for global
declare global {
  var payload: {
    client: any
    promise: Promise<any> | null
  } | undefined
}
