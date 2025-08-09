const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log('✅ Query test successful:', result)
    
    await prisma.$disconnect()
    console.log('✅ Disconnected from database')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    await prisma.$disconnect()
  }
}

testConnection() 