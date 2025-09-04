# Disk Space Cleanup Script for Modern Men Project
# This script identifies and removes common cache directories and temporary files

Write-Host "🔍 Analyzing disk space usage..." -ForegroundColor Cyan

# Check for common cache directories
$cacheDirs = @('.next', '.cache', 'node_modules/.cache', '.turbo', '.swc', '.tmp', 'temp', 'tmp')
$totalSaved = 0

foreach ($dir in $cacheDirs) {
    if (Test-Path $dir) {
        Write-Host "📁 Found: $dir" -ForegroundColor Yellow
        try {
            $size = (Get-ChildItem -Path $dir -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
            if ($size) {
                $sizeMB = [math]::Round($size / 1MB, 2)
                Write-Host "   Size: $sizeMB MB" -ForegroundColor Gray
                $totalSaved += $size
            }
        } catch {
            Write-Host "   Could not calculate size" -ForegroundColor Red
        }
    }
}

# Check for duplicate lockfiles
$lockFiles = @('package-lock.json', 'yarn.lock', 'pnpm-lock.yaml')
$lockFileCount = 0
foreach ($file in $lockFiles) {
    if (Test-Path $file) {
        $lockFileCount++
        Write-Host "🔒 Lockfile found: $file" -ForegroundColor Yellow
    }
}

if ($lockFileCount -gt 1) {
    Write-Host "⚠️  Multiple lockfiles detected - consider keeping only one" -ForegroundColor Red
}

# Calculate potential savings
$totalSavedMB = [math]::Round($totalSaved / 1MB, 2)
Write-Host "`n💾 Potential space savings: $totalSavedMB MB" -ForegroundColor Green

# Ask for confirmation before cleanup
$confirmation = Read-Host "`n🔧 Start cleanup process? (y/N)"
if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
    Write-Host "`n🧹 Starting cleanup..." -ForegroundColor Green

    # Remove .next cache
    if (Test-Path '.next') {
        Write-Host "Removing .next cache..." -ForegroundColor Yellow
        Remove-Item -Path '.next' -Recurse -Force -ErrorAction SilentlyContinue
    }

    # Remove other cache directories
    foreach ($dir in @('.cache', '.turbo', '.swc', '.tmp')) {
        if (Test-Path $dir) {
            Write-Host "Removing $dir..." -ForegroundColor Yellow
            Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    # Clear npm cache if it exists
    if (Test-Path 'node_modules/.cache') {
        Write-Host "Clearing npm cache..." -ForegroundColor Yellow
        Remove-Item -Path 'node_modules/.cache' -Recurse -Force -ErrorAction SilentlyContinue
    }

    # Clear temp files
    foreach ($dir in @('temp', 'tmp')) {
        if (Test-Path $dir) {
            Write-Host "Removing $dir..." -ForegroundColor Yellow
            Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    Write-Host "`n✅ Cleanup completed!" -ForegroundColor Green

    # Test if cleanup helped
    Write-Host "`n🧪 Testing disk space after cleanup..." -ForegroundColor Cyan
    $remainingCache = 0
    foreach ($dir in $cacheDirs) {
        if (Test-Path $dir) {
            $size = (Get-ChildItem -Path $dir -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
            if ($size) {
                $remainingCache += $size
            }
        }
    }
    $remainingMB = [math]::Round($remainingCache / 1MB, 2)
    $actualSaved = [math]::Round(($totalSaved - $remainingCache) / 1MB, 2)
    Write-Host "💾 Actual space freed: $actualSaved MB" -ForegroundColor Green
    Write-Host "📊 Remaining cache size: $remainingMB MB" -ForegroundColor Cyan

} else {
    Write-Host "`n❌ Cleanup cancelled by user" -ForegroundColor Red
}

Write-Host "`n🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'npm install' to restore dependencies" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to test the application" -ForegroundColor White
Write-Host "3. Monitor disk space usage going forward" -ForegroundColor White
