@echo off
echo 🚀 Setting up Modern Men Hair Salon Backend...

echo 📦 Installing dependencies...
npm install

echo 🗃️ Generating Prisma client...
npm run db:generate

echo 📋 Setting up database schema...
npm run db:push

echo 🌱 Seeding database...
npm run db:seed

echo ✅ Setup complete! Your salon management system is ready.
echo 🔗 Start development server with: npm run dev
echo 📊 Visit admin panel at: http://localhost:3000/admin
echo 📖 API docs at: http://localhost:3000/api/docs

pause
