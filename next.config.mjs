/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Progressive Web App
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for security and performance
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
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
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
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/documentation',
        permanent: true,
      },
    ]
  },

  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/healthcheck',
      },
    ]
  },

  // Bundle analysis
  ...(process.env.ANALYZE === 'true' ? {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: '../bundle-report.html',
          })
        )
      }
      return config
    },
  } : {}),

  // Output configuration for static export if needed
  // output: 'export',
  // trailingSlash: true,
  
  // Compression
  compress: true,
  
  // Power optimizations
  poweredByHeader: false,
  
  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
}

export default nextConfig
