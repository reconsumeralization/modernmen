@echo off
echo ========================================
echo MODERN MEN BARBERSHOP - COMPLETE SETUP
echo ========================================
echo.

echo [1/7] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/7] Setting up database with Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)

call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Failed to push database schema
    pause
    exit /b 1
)

echo.
echo [3/7] Generating secure admin password hash...
call node generateHash.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate password hash
    pause
    exit /b 1
)

echo.
echo [4/7] Creating API routes structure...
if not exist "app\api\admin" mkdir app\api\admin
if not exist "app\api\admin\auth" mkdir app\api\admin\auth
if not exist "app\api\admin\auth\login" mkdir app\api\admin\auth\login
if not exist "app\api\admin\clients" mkdir app\api\admin\clients

echo.
echo [5/7] Setting up authentication middleware...
if not exist "middleware.ts" (
    echo Creating middleware.ts...
    echo import { NextResponse } from 'next/server'^

import type { NextRequest } from 'next/server'^

import jwt from 'jsonwebtoken'^


export function middleware^(request: NextRequest^) {^

  // Only protect admin routes^

  if ^(request.nextUrl.pathname.startsWith^('/admin'^) ^&^& ^!request.nextUrl.pathname.startsWith^('/admin/login'^)^) {^

    const token = request.cookies.get^('adminToken'^)?.value^


    if ^(^!token^) {^

      return NextResponse.redirect^(new URL^('/admin/login', request.url^)^)^

    }^


    try {^

      jwt.verify^(token, process.env.JWT_SECRET ^|^| 'fallback-secret'^)^

    } catch ^(error^) {^

      return NextResponse.redirect^(new URL^('/admin/login', request.url^)^)^

    }^

  }^


  return NextResponse.next^(^)^

}^


export const config = {^

  matcher: ['/admin/:path*']^

} > middleware.ts
)

echo.
echo [6/7] Testing setup...
echo Checking if all required files exist...

set "missing_files="
if not exist "app\admin\page.tsx" set "missing_files=%missing_files% admin/page.tsx"
if not exist "app\admin\components\AdminLayout.tsx" set "missing_files=%missing_files% AdminLayout.tsx"
if not exist "app\admin\login\page.tsx" set "missing_files=%missing_files% admin/login/page.tsx"
if not exist ".env.local" set "missing_files=%missing_files% .env.local"

if not "%missing_files%"=="" (
    echo WARNING: Missing files: %missing_files%
    echo Please ensure all admin components are properly created
)

echo.
echo [7/7] Final verification...
echo Checking environment setup...

findstr /C:"JWT_SECRET" .env.local >nul
if %errorlevel% neq 0 (
    echo WARNING: JWT_SECRET not found in .env.local
    echo Please add JWT_SECRET=your-secret-key to .env.local
)

findstr /C:"ADMIN_PASSWORD_HASH" .env.local >nul
if %errorlevel% neq 0 (
    echo WARNING: ADMIN_PASSWORD_HASH not found in .env.local
    echo Please run setup-admin-auth.bat to generate password hash
)

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Your admin system is ready to use:
echo.
echo 1. Start the development server:
echo    npm run dev
echo.
echo 2. Access admin panel:
echo    http://localhost:3000/admin/login
echo.
echo 3. Default credentials:
echo    Username: admin
echo    Password: modernmen2024!
echo.
echo 4. IMPORTANT: Change the default password by running:
echo    setup-admin-auth.bat
echo.
echo For detailed documentation, see ADMIN-SETUP-GUIDE.md
echo.
pause