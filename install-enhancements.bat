@echo off

echo Installing additional dependencies for Modern Men enhancements...

REM Install runtime dependencies
call npm install bcryptjs jsonwebtoken

REM Install TypeScript types
call npm install --save-dev @types/bcryptjs @types/jsonwebtoken

echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Update your .env file with JWT_SECRET=your-secure-secret-key
echo 2. Run 'npm run db:push' to update the database schema
echo 3. Visit /book-enhanced for the new booking experience
echo 4. Visit /portal/login to access the customer portal
