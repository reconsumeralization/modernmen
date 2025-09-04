# Modern Men Hair Salon - Complete Setup Script
# This script will configure everything including Payload CMS from one command

Write-Host "🚀 Modern Men Hair Salon - Complete Setup Script" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Step 1: Stop any existing processes
Write-Host "`n📋 Step 1: Stopping existing processes..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null
Start-Sleep -Seconds 2

# Step 2: Install dependencies
Write-Host "`n📦 Step 2: Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# Step 3: Install Payload CMS dependencies
Write-Host "`n🔧 Step 3: Installing Payload CMS dependencies..." -ForegroundColor Yellow
npm install @payloadcms/next @payloadcms/db-postgres @payloadcms/bundler-webpack --legacy-peer-deps

# Step 4: Install Lucide React icons
Write-Host "`n🎨 Step 4: Installing Lucide React icons..." -ForegroundColor Yellow
npm install lucide-react@latest --legacy-peer-deps

# Step 5: Re-enable Payload CMS in next.config.js
Write-Host "`n⚙️ Step 5: Configuring Payload CMS..." -ForegroundColor Yellow

# Create a backup of the current config
Copy-Item "next.config.js" "next.config.js.backup" -Force

# Update next.config.js to enable Payload CMS
$configContent = @'
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
    reactCompiler: false,
  },
  serverExternalPackages: ['@prisma/client'],

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

// Make sure you wrap your `nextConfig`
// with the `withPayload` plugin
export default withPayload(nextConfig)
'@

Set-Content -Path "next.config.js" -Value $configContent

# Step 6: Start the development server
Write-Host "`n🚀 Step 6: Starting development server..." -ForegroundColor Yellow
Write-Host "Starting server in background..." -ForegroundColor Green

# Start the server in background
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden

# Step 7: Wait and check server status
Write-Host "`n⏳ Step 7: Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Step 8: Check if server is running
Write-Host "`n🔍 Step 8: Checking server status..." -ForegroundColor Yellow

$serverRunning = $false
$attempts = 0
$maxAttempts = 5

while (-not $serverRunning -and $attempts -lt $maxAttempts) {
    $attempts++
    Write-Host "Attempt $attempts of $maxAttempts..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $serverRunning = $true
            Write-Host "✅ Server is running successfully!" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Server not ready yet, waiting..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}

# Step 9: Display final status
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

if ($serverRunning) {
    Write-Host "✅ Development server is running at: http://localhost:3000" -ForegroundColor Green
    Write-Host "✅ Payload CMS admin panel: http://localhost:3000/admin" -ForegroundColor Green
    Write-Host "✅ Main application: http://localhost:3000" -ForegroundColor Green
    Write-Host "✅ Authentication: http://localhost:3000/auth/signin" -ForegroundColor Green
    
    Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Visit http://localhost:3000 to test your application" -ForegroundColor White
    Write-Host "2. Visit http://localhost:3000/admin to set up Payload CMS" -ForegroundColor White
    Write-Host "3. Configure email service in .env.local" -ForegroundColor White
    Write-Host "4. Set up monitoring services (Sentry, LogRocket)" -ForegroundColor White
} else {
    Write-Host "❌ Server failed to start properly" -ForegroundColor Red
    Write-Host "Check the logs for any errors" -ForegroundColor Red
}

Write-Host "`n🔧 To stop the server, run: taskkill /f /im node.exe" -ForegroundColor Cyan
Write-Host "🔧 To restart the server, run: npm run dev" -ForegroundColor Cyan

Write-Host "`n🎯 Your Modern Men Hair Salon application is ready!" -ForegroundColor Green
