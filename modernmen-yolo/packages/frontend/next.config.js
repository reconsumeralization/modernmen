/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations for Vercel deployment
  experimental: {
    // Removed optimizeCss for Vercel compatibility
    // optimizeCss: true,
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization for mobile devices
  images: {
    domains: ['localhost', 'supabase.co', 'vercel.app'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // PWA and mobile optimization headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self' https: blob:; object-src 'none';",
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Mobile-specific headers
          {
            key: 'viewport',
            value: 'width=device-width, initial-scale=1, maximum-scale=5',
          },
          {
            key: 'mobile-web-app-capable',
            value: 'yes',
          },
          {
            key: 'apple-mobile-web-app-capable',
            value: 'yes',
          },
          {
            key: 'apple-mobile-web-app-status-bar-style',
            value: 'default',
          },
          {
            key: 'apple-mobile-web-app-title',
            value: 'Modern Men',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ModernMen_URL: process.env.NEXT_PUBLIC_ModernMen_URL || 'http://localhost:3001',
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  },

  // API rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/admin/:path*',
        destination: `${process.env.NEXT_PUBLIC_ModernMen_URL || 'http://localhost:3001'}/admin/:path*`,
      },
      {
        source: '/api/cms/:path*',
        destination: `${process.env.NEXT_PUBLIC_ModernMen_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ]
  },

  // Webpack configuration for PWA and Vercel optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Service worker handling
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    // Temporarily disable webpack externals to identify the source
    // if (!isServer) {
    //   config.externals = config.externals || []
    //   config.externals.push({
    //     'drizzle-kit': 'drizzle-kit',
    //     '@payloadcms/db-postgres': '@payloadcms/db-postgres',
    //     '@payloadcms/db-mongodb': '@payloadcms/db-mongodb',
    //     'payload': 'payload'
    //   })
    // }

    // Vercel deployment optimizations
    if (!dev && !isServer) {
      // Optimize bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            chunks: 'all',
            priority: 20,
          },
        },
      }

      // Add bundle analyzer in analyze mode
      if (process.env.ANALYZE) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: './analyze/client.html',
          })
        )
      }
    }

    return config
  },
}

module.exports = nextConfig
