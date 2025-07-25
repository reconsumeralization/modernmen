@echo off
echo Starting Modern Men Admin System Setup...

REM Install dependencies
echo Installing dependencies...
call npm install

REM Generate Prisma client
echo Setting up database...
call npx prisma generate

REM Try to push database schema (optional, might fail if DB not configured)
echo Attempting to push database schema...
call npx prisma db push 2>nul
if errorlevel 1 (
    echo Database push failed - you'll need to configure DATABASE_URL in .env.local
)

REM Start development server
echo Starting development server...
call npm run dev

pause