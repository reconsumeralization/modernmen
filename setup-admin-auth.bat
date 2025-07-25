@echo off

echo Setting up Admin Authentication...

REM Install bcryptjs and jsonwebtoken
echo Installing necessary packages...
npm install bcryptjs jsonwebtoken

echo.
echo Admin Authentication Setup Complete!
echo.
echo IMPORTANT: Please add the following variables to your .env.local file:
echo ADMIN_USERNAME=your_admin_username
echo ADMIN_PASSWORD_HASH=your_hashed_admin_password (you can generate this using a tool or a script)
echo JWT_SECRET=a_strong_random_secret_key
echo.
echo Example: ADMIN_USERNAME=admin ADMIN_PASSWORD_HASH=$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx JWT_SECRET=supersecretkey123
echo.
pause