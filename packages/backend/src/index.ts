import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Security middleware
app.use(helmet())
app.use(cors())
app.use(compression())

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'modernmen-backend'
  })
})

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Modern Men Hair Salon Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      auth: 'POST /api/auth/*',
      appointments: 'GET|POST /api/appointments/*',
      customers: 'GET|POST /api/customers/*'
    }
  })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Modern Men Backend Server running on port ${PORT}`)
  console.log(`📊 Health check available at http://localhost:${PORT}/health`)
})

export default app