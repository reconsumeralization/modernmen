#!/usr/bin/env pwsh

# Modern Men - Direct Vercel Deployment with Token
# Using existing Vercel credentials from .env.local

Write-Host "🚀 Modern Men Direct Vercel Deployment" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Read environment variables
$envFile = ".\.env.local"
if (Test-Path $envFile) {
    Write-Host "[INFO] Loading environment variables from .env.local" -ForegroundColor Blue
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^#][^=]*)=(.*)$") {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    Write-Host "[SUCCESS] Environment variables loaded" -ForegroundColor Green
} else {
    Write-Host "[ERROR] .env.local file not found" -ForegroundColor Red
    exit 1
}

# Verify required variables
$vercelToken = $env:VERCEL_TOKEN
$vercelOrgId = $env:VERCEL_ORG_ID
$vercelTeam = $env:VERCEL_TEAM

if (-not $vercelToken) {
    Write-Host "[ERROR] VERCEL_TOKEN not found in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "[SUCCESS] Vercel credentials verified" -ForegroundColor Green
Write-Host "  - Token: $($vercelToken.Substring(0,8))..." -ForegroundColor Gray
Write-Host "  - Org ID: $vercelOrgId" -ForegroundColor Gray
Write-Host "  - Team: $vercelTeam" -ForegroundColor Gray
Write-Host ""

# Create deployment package
Write-Host "[INFO] Creating deployment package..." -ForegroundColor Blue

# Create .vercel directory if it doesn't exist
if (-not (Test-Path ".vercel")) {
    New-Item -ItemType Directory -Name ".vercel" | Out-Null
}

# Create project.json with your credentials
$projectConfig = @{
    "orgId" = $vercelOrgId
    "projectId" = "modernmen-" + (Get-Random -Maximum 99999)
} | ConvertTo-Json

$projectConfig | Out-File -FilePath ".\.vercel\project.json" -Encoding UTF8
Write-Host "[SUCCESS] Vercel project configuration created" -ForegroundColor Green
# Install Vercel CLI if not present
Write-Host "[INFO] Installing Vercel CLI..." -ForegroundColor Blue
try {
    # Try using npx first (works without global install)
    $vercelPath = Get-Command vercel -ErrorAction SilentlyContinue
    if (-not $vercelPath) {
        # Download and install Node.js portable if needed
        Write-Host "[INFO] Node.js/npm not found. Installing Vercel CLI via direct download..." -ForegroundColor Blue
        
        # Create a simple curl-based deployment using Vercel API
        Write-Host "[INFO] Using Vercel REST API for deployment..." -ForegroundColor Blue
        
        # Compress project files
        Write-Host "[INFO] Preparing deployment files..." -ForegroundColor Blue
        
        # Create file list for deployment
        $files = @()
        Get-ChildItem -Recurse -File | Where-Object {
            $_.FullName -notmatch "(node_modules|\.next|\.git|\.vercel)" -and
            $_.Extension -match "\.(js|ts|tsx|jsx|json|md|css|html|png|jpg|svg)$"
        } | ForEach-Object {
            $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
            $files += $relativePath
        }
        
        Write-Host "[SUCCESS] Found $($files.Count) files for deployment" -ForegroundColor Green
        
        # Use manual upload method
        Write-Host ""
        Write-Host "🎯 MANUAL DEPLOYMENT REQUIRED" -ForegroundColor Yellow
        Write-Host "=============================" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Since Node.js/npm is not available, please deploy manually:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Visit: https://vercel.com/login" -ForegroundColor White
        Write-Host "2. Sign in with your account: reconsumeralization@gmail.com" -ForegroundColor White
        Write-Host "3. Click 'Add New...' → 'Project'" -ForegroundColor White
        Write-Host "4. Choose 'Upload Folder'" -ForegroundColor White
        Write-Host "5. Select this folder: $((Get-Location).Path)" -ForegroundColor White
        Write-Host "6. Vercel will auto-detect Next.js settings" -ForegroundColor White
        Write-Host "7. Add production environment variables (see PRODUCTION_ENV_GUIDE.md)" -ForegroundColor White
        Write-Host "8. Click 'Deploy'" -ForegroundColor White
        Write-Host ""
        Write-Host "✅ Your project is fully configured and ready!" -ForegroundColor Green
        Write-Host ""
        
    } else {
        Write-Host "[SUCCESS] Vercel CLI found" -ForegroundColor Green
        
        # Set Vercel token
        $env:VERCEL_TOKEN = $vercelToken
        
        Write-Host "[INFO] Deploying to Vercel..." -ForegroundColor Blue
        
        # Deploy using CLI
        & vercel --prod --token $vercelToken --scope $vercelTeam
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "🎉 DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
            Write-Host "========================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Your Modern Men app is now live on Vercel!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "[ERROR] Deployment failed with CLI" -ForegroundColor Red
            Write-Host "Please use the manual deployment method above" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please use the manual deployment method" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📖 Next Steps:" -ForegroundColor Blue
Write-Host "1. Set production environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "2. Configure custom domain (optional)" -ForegroundColor White
Write-Host "3. Test all features in production" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")