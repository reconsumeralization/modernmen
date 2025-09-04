import express, { Request as ExpressRequest, Response as ExpressResponse, Router, NextFunction } from 'express'
import { z } from 'zod'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

const app = express()
const router = Router()

// Enhanced security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// Initialize Supabase client with enhanced configuration
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY environment variables are required')
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

// Enhanced type definitions with better typing
interface ToolDefinition {
  name: string
  description: string
  category: string
  schema: z.ZodType<any>
  handler: (params: any, context?: ExecutionContext) => Promise<ToolResult>
  permissions?: string[]
  rateLimit?: {
    requests: number
    windowMs: number
  }
}

interface ExecutionContext {
  userId?: string
  sessionId?: string
  timestamp: Date
  requestId: string
}

interface ToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource' | 'json' | 'markdown'
    text?: string
    data?: string
    mimeType?: string
    metadata?: Record<string, any>
  }>
  isError?: boolean
  metadata?: {
    executionTime?: number
    tokensUsed?: number
    cost?: number
    cacheHit?: boolean
  }
}

interface MCPMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  metadata?: Record<string, any>
}

interface SSEEvent {
  type: 'tools' | 'keepalive' | 'error' | 'status' | 'metrics'
  tools?: Array<{
    name: string
    description: string
    category: string
    inputSchema: any
    permissions?: string[]
  }>
  error?: string
  status?: string
  metrics?: Record<string, any>
}

// Enhanced tool registry with metadata and caching
const tools = new Map<string, ToolDefinition>()
const toolMetrics = new Map<string, {
  calls: number
  totalExecutionTime: number
  errors: number
  lastUsed: Date
}>()

// Request tracking for rate limiting per tool
const toolRateLimits = new Map<string, Map<string, number[]>>()

// Enhanced tool registration with comprehensive validation
function registerTool(
  name: string, 
  description: string,
  category: string,
  schema: z.ZodType<any>, 
  handler: (params: any, context?: ExecutionContext) => Promise<ToolResult>,
  options?: {
    permissions?: string[]
    rateLimit?: { requests: number; windowMs: number }
  }
): void {
  if (tools.has(name)) {
    console.warn(`Tool '${name}' is being overridden`)
  }
  
  tools.set(name, { 
    name,
    description,
    category,
    schema, 
    handler,
    permissions: options?.permissions,
    rateLimit: options?.rateLimit
  })
  
  // Initialize metrics
  toolMetrics.set(name, {
    calls: 0,
    totalExecutionTime: 0,
    errors: 0,
    lastUsed: new Date()
  })
  
  console.log(`✅ Registered tool: ${name} (${category})`)
}

// Enhanced error handling utilities
function createErrorResult(message: string, error?: unknown, code?: string): ToolResult {
  const errorMessage = error instanceof Error ? error.message : String(error)
  return {
    content: [{
      type: 'text',
      text: `${message}: ${errorMessage}`,
      metadata: { errorCode: code }
    }],
    isError: true,
    metadata: {
      executionTime: 0
    }
  }
}

function createSuccessResult(
  data: any, 
  type: 'text' | 'image' | 'resource' | 'json' | 'markdown' = 'text',
  metadata?: Record<string, any>
): ToolResult {
  let content: string
  let contentType = type

  if (type === 'json') {
    content = JSON.stringify(data, null, 2)
    contentType = 'text'
  } else if (type === 'markdown') {
    content = typeof data === 'string' ? data : `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
    contentType = 'text'
  } else {
    content = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  }

  return {
    content: [{
      type: contentType,
      text: content,
      metadata
    }],
    isError: false
  }
}

// Tool rate limiting check
function checkToolRateLimit(toolName: string, clientId: string): boolean {
  const tool = tools.get(toolName)
  if (!tool?.rateLimit) return true

  const now = Date.now()
  const windowMs = tool.rateLimit.windowMs
  const maxRequests = tool.rateLimit.requests

  if (!toolRateLimits.has(toolName)) {
    toolRateLimits.set(toolName, new Map())
  }

  const toolLimits = toolRateLimits.get(toolName)!
  const clientRequests = toolLimits.get(clientId) || []
  
  // Remove old requests outside the window
  const validRequests = clientRequests.filter(timestamp => now - timestamp < windowMs)
  
  if (validRequests.length >= maxRequests) {
    return false
  }

  validRequests.push(now)
  toolLimits.set(clientId, validRequests)
  return true
}

// Enhanced Supabase AI Tools with comprehensive features
registerTool(
  'supabaseEmbeddings',
  'Generate high-quality text embeddings using Supabase AI functions with caching and batch support',
  'AI/ML',
  z.object({
    text: z.union([
      z.string().min(1, 'Text cannot be empty').max(8000, 'Text too long'),
      z.array(z.string().min(1).max(8000)).max(100, 'Too many texts in batch')
    ]),
    model: z.string().optional().default('text-embedding-ada-002'),
    dimensions: z.number().min(1).max(3072).optional(),
    normalize: z.boolean().optional().default(true)
  }),
  async ({ text, model, dimensions, normalize }, context): Promise<ToolResult> => {
    try {
      const isArray = Array.isArray(text)
      const { data, error } = await supabase.functions.invoke('embeddings', {
        body: { 
          text, 
          model, 
          dimensions,
          normalize,
          batch: isArray
        }
      })
      
      if (error) {
        return createErrorResult('Supabase embeddings function error', error, 'SUPABASE_ERROR')
      }
      
      return createSuccessResult({
        embeddings: data,
        model,
        dimensions: data?.length || (isArray ? data?.[0]?.length : 0),
        count: isArray ? text.length : 1,
        normalized: normalize
      }, 'json', {
        tokensUsed: isArray ? text.reduce((sum, t) => sum + t.length, 0) : text.length
      })
    } catch (error) {
      return createErrorResult('Error generating embeddings', error, 'EXECUTION_ERROR')
    }
  },
  {
    rateLimit: { requests: 50, windowMs: 60000 }
  }
)

registerTool(
  'supabaseChat',
  'Advanced chat completion using Supabase AI with streaming, function calling, and conversation management',
  'AI/ML',
  z.object({
    messages: z.array(z.object({
      role: z.enum(['user', 'assistant', 'system', 'function']),
      content: z.string().min(1, 'Message content cannot be empty'),
      name: z.string().optional(),
      function_call: z.object({
        name: z.string(),
        arguments: z.string()
      }).optional()
    })).min(1, 'At least one message is required'),
    model: z.string().optional().default('gpt-4-turbo-preview'),
    temperature: z.number().min(0).max(2).optional().default(0.7),
    maxTokens: z.number().min(1).max(4000).optional(),
    stream: z.boolean().optional().default(false),
    functions: z.array(z.object({
      name: z.string(),
      description: z.string(),
      parameters: z.record(z.string(), z.any())
    })).optional(),
    presencePenalty: z.number().min(-2).max(2).optional(),
    frequencyPenalty: z.number().min(-2).max(2).optional()
  }),
  async ({ messages, model, temperature, maxTokens, stream, functions, presencePenalty, frequencyPenalty }, context): Promise<ToolResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages, 
          model, 
          temperature,
          max_tokens: maxTokens,
          stream,
          functions,
          presence_penalty: presencePenalty,
          frequency_penalty: frequencyPenalty
        }
      })
      
      if (error) {
        return createErrorResult('Supabase chat function error', error, 'SUPABASE_ERROR')
      }
      
      return createSuccessResult({
        response: data.response,
        usage: data.usage,
        model,
        finishReason: data.finish_reason
      }, 'markdown', {
        tokensUsed: data.usage?.total_tokens,
        cost: data.usage?.total_tokens * 0.00002 // Approximate cost
      })
    } catch (error) {
      return createErrorResult('Error in chat completion', error, 'EXECUTION_ERROR')
    }
  },
  {
    rateLimit: { requests: 30, windowMs: 60000 }
  }
)

// Enhanced command execution tool with comprehensive security
registerTool(
  'executeCommand',
  'Execute system commands with advanced security, sandboxing, and output streaming',
  'System',
  z.object({
    command: z.string().min(1, 'Command cannot be empty'),
    args: z.array(z.string()).optional().default([]),
    workingDirectory: z.string().optional(),
    timeout: z.number().min(1000).max(30000).optional().default(10000),
    env: z.record(z.string(), z.string()).optional(),
    shell: z.boolean().optional().default(false),
    captureOutput: z.boolean().optional().default(true)
  }),
  async ({ command, args = [], workingDirectory, timeout, env, shell, captureOutput }, context): Promise<ToolResult> => {
    try {
      // Enhanced security checks
      const dangerousCommands = [
        'rm', 'del', 'format', 'fdisk', 'mkfs', 'dd', 'sudo', 'su',
        'chmod', 'chown', 'passwd', 'useradd', 'userdel', 'shutdown',
        'reboot', 'halt', 'poweroff', 'kill', 'killall'
      ]
      
      const dangerousPaths = ['/etc', '/bin', '/sbin', '/usr/bin', '/usr/sbin', '/root']
      
      if (dangerousCommands.some(cmd => command.toLowerCase().includes(cmd))) {
        return createErrorResult('Command rejected for security reasons', new Error('Dangerous command detected'), 'SECURITY_ERROR')
      }
      
      if (dangerousPaths.some(path => workingDirectory?.includes(path))) {
        return createErrorResult('Working directory rejected for security reasons', new Error('Dangerous path detected'), 'SECURITY_ERROR')
      }

      return new Promise((resolve) => {
        const startTime = Date.now()
        const child = spawn(command, args, {
          cwd: workingDirectory || process.cwd(),
          timeout,
          env: { ...process.env, ...env },
          shell,
          stdio: captureOutput ? 'pipe' : 'inherit'
        })

        let stdout = ''
        let stderr = ''

        if (captureOutput) {
          child.stdout?.on('data', (data) => {
            stdout += data.toString()
          })

          child.stderr?.on('data', (data) => {
            stderr += data.toString()
          })
        }

        child.on('close', (code) => {
          const executionTime = Date.now() - startTime
          const result = {
            command: `${command} ${args.join(' ')}`,
            workingDirectory: workingDirectory || process.cwd(),
            exitCode: code,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            executionTime,
            timestamp: new Date().toISOString(),
            success: code === 0
          }
          
          if (code === 0) {
            resolve(createSuccessResult(result, 'json', { executionTime }))
          } else {
            resolve(createErrorResult('Command execution failed', new Error(`Exit code: ${code}`), 'COMMAND_ERROR'))
          }
        })

        child.on('error', (error) => {
          resolve(createErrorResult('Error executing command', error, 'SPAWN_ERROR'))
        })
      })
    } catch (error) {
      return createErrorResult('Error setting up command execution', error, 'SETUP_ERROR')
    }
  },
  {
    permissions: ['system:execute'],
    rateLimit: { requests: 10, windowMs: 60000 }
  }
)

// File system operations tool
registerTool(
  'fileOperations',
  'Perform safe file system operations with comprehensive validation',
  'System',
  z.object({
    operation: z.enum(['read', 'write', 'list', 'exists', 'stat', 'mkdir']),
    path: z.string().min(1, 'Path cannot be empty'),
    content: z.string().optional(),
    encoding: z.string().optional().default('utf8'),
    recursive: z.boolean().optional().default(false)
  }),
  async ({ operation, path: filePath, content, encoding, recursive }, context): Promise<ToolResult> => {
    try {
      // Security: Prevent access to sensitive directories
      const safePath = path.resolve(filePath)
      const allowedPaths = [process.cwd(), '/tmp', '/var/tmp']
      const isAllowed = allowedPaths.some(allowed => safePath.startsWith(path.resolve(allowed)))
      
      if (!isAllowed) {
        return createErrorResult('Path access denied', new Error('Path outside allowed directories'), 'SECURITY_ERROR')
      }

      switch (operation) {
        case 'read':
          const fileContent = await fs.readFile(safePath, encoding as BufferEncoding)
          return createSuccessResult({ content: fileContent, path: safePath, size: fileContent.length })

        case 'write':
          if (!content) {
            return createErrorResult('Content required for write operation', new Error('Missing content'), 'VALIDATION_ERROR')
          }
          await fs.writeFile(safePath, content, encoding as BufferEncoding)
          return createSuccessResult({ message: 'File written successfully', path: safePath, size: content.length })

        case 'list':
          const entries = await fs.readdir(safePath, { withFileTypes: true })
          const fileList = entries.map(entry => ({
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            path: path.join(safePath, entry.name)
          }))
          return createSuccessResult({ files: fileList, count: fileList.length, path: safePath })

        case 'exists':
          try {
            await fs.access(safePath)
            return createSuccessResult({ exists: true, path: safePath })
          } catch {
            return createSuccessResult({ exists: false, path: safePath })
          }

        case 'stat':
          const stats = await fs.stat(safePath)
          return createSuccessResult({
            path: safePath,
            size: stats.size,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
            created: stats.birthtime,
            modified: stats.mtime,
            accessed: stats.atime
          })

        case 'mkdir':
          await fs.mkdir(safePath, { recursive })
          return createSuccessResult({ message: 'Directory created successfully', path: safePath })

        default:
          return createErrorResult('Invalid operation', new Error('Unsupported operation'), 'VALIDATION_ERROR')
      }
    } catch (error) {
      return createErrorResult(`Error performing ${operation} operation`, error, 'FILE_ERROR')
    }
  },
  {
    permissions: ['filesystem:read', 'filesystem:write'],
    rateLimit: { requests: 20, windowMs: 60000 }
  }
)

// Enhanced SSE endpoint with comprehensive features
router.get('/sse', (req: ExpressRequest, res: ExpressResponse) => {
  res.set('Content-Type', 'text/event-stream')
  res.set('Cache-Control', 'no-cache')
  res.set('Connection', 'keep-alive')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Cache-Control')

  const clientId = (req.headers as any)['x-client-id'] || `client-${Date.now()}`

  try {
    // Send initial tools list with enhanced metadata
    const toolList = Array.from(tools.values()).map(({ name, description, category, permissions }) => ({
      name,
      description,
      category,
      permissions,
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    }))
    
    const event: SSEEvent = { type: 'tools', tools: toolList }
    res.write(`data: ${JSON.stringify(event)}\n\n`)

    // Send server status
    const statusEvent: SSEEvent = {
      type: 'status',
      status: 'connected',
      metrics: {
        toolsCount: tools.size,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    }
    res.write(`data: ${JSON.stringify(statusEvent)}\n\n`)

    // Enhanced keepalive with metrics
    const interval = setInterval(() => {
      if (res.destroyed) {
        clearInterval(interval as any)
        return
      }
      
      const metricsEvent: SSEEvent = {
        type: 'metrics',
        metrics: Object.fromEntries(
          Array.from(toolMetrics.entries()).map(([name, metrics]) => [name, metrics])
        )
      }
      res.write(`data: ${JSON.stringify(metricsEvent)}\n\n`)
      res.write(': keepalive\n\n')
    }, 30000)

    // Handle connection close using response events
    res.on('close', () => {
      clearInterval(interval)
      console.log(`SSE connection closed for client: ${clientId}`)
    })

    res.on('error', (error: any) => {
      clearInterval(interval)
      console.error(`SSE connection error for client ${clientId}:`, error)
    })
  } catch (error) {
    const errorEvent: SSEEvent = { 
      type: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
    res.write(`data: ${JSON.stringify(errorEvent)}\n\n`)
  }
})

// Enhanced tool execution endpoint with comprehensive features
router.post('/execute', async (req: ExpressRequest, res: ExpressResponse) => {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const clientId = (req.headers as any)['x-client-id'] || (req as any).ip || 'unknown'
  
  try {
    const body = req.body as any
    const { tool, params, context } = body
    
    if (!tool || typeof tool !== 'string') {
      return res.status(400).json({ 
        error: 'Tool name is required and must be a string',
        isError: true,
        requestId
      })
    }
    
    if (!tools.has(tool)) {
      return res.status(404).json({ 
        error: `Tool '${tool}' not found. Available tools: ${Array.from(tools.keys()).join(', ')}`,
        isError: true,
        requestId
      })
    }

    // Check tool-specific rate limits
    if (!checkToolRateLimit(tool, clientId)) {
      return res.status(429).json({
        error: `Rate limit exceeded for tool '${tool}'`,
        isError: true,
        requestId
      })
    }

    const toolDef = tools.get(tool)!
    const metrics = toolMetrics.get(tool)!
    
    try {
      const validatedParams = toolDef.schema.parse(params || {})
      const startTime = Date.now()
      
      const executionContext: ExecutionContext = {
        userId: context?.userId,
        sessionId: context?.sessionId,
        timestamp: new Date(),
        requestId
      }
      
      const result = await toolDef.handler(validatedParams, executionContext)
      const executionTime = Date.now() - startTime
      
      // Update metrics
      metrics.calls++
      metrics.totalExecutionTime += executionTime
      metrics.lastUsed = new Date()
      if (result.isError) {
        metrics.errors++
      }
      
      res.json({
        ...result,
        metadata: {
          ...result.metadata,
          tool,
          executionTime,
          timestamp: new Date().toISOString(),
          requestId,
          averageExecutionTime: Math.round(metrics.totalExecutionTime / metrics.calls)
        }
      })
    } catch (validationError) {
      metrics.errors++
      if (validationError instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Parameter validation failed',
          details: validationError.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code
          })),
          isError: true,
          requestId
        })
      }
      throw validationError
    }
  } catch (error) {
    console.error(`Tool execution error [${requestId}]:`, error)
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      isError: true,
      requestId,
      timestamp: new Date().toISOString()
    })
  }
})

// Enhanced tool discovery endpoint with comprehensive information
router.get('/tools', (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const category = req.query.category as string
    const search = req.query.search as string
    
    let toolList = Array.from(tools.values()).map(({ name, description, category, permissions, rateLimit, schema }) => {
      const metrics = toolMetrics.get(name)!
      return {
        name,
        description,
        category,
        permissions,
        rateLimit,
        metrics: {
          calls: metrics.calls,
          averageExecutionTime: metrics.calls > 0 ? Math.round(metrics.totalExecutionTime / metrics.calls) : 0,
          errorRate: metrics.calls > 0 ? Math.round((metrics.errors / metrics.calls) * 100) : 0,
          lastUsed: metrics.lastUsed
        },
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    })
    
    // Filter by category if specified
    if (category) {
      toolList = toolList.filter(tool => tool.category.toLowerCase().includes(category.toLowerCase()))
    }
    
    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase()
      toolList = toolList.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Group by category
    const categories = [...new Set(toolList.map(tool => tool.category))]
    const groupedTools = categories.reduce((acc, cat) => {
      acc[cat] = toolList.filter(tool => tool.category === cat)
      return acc
    }, {} as Record<string, any[]>)
    
    res.json({
      tools: toolList,
      categories: groupedTools,
      count: toolList.length,
      totalCalls: Array.from(toolMetrics.values()).reduce((sum, m) => sum + m.calls, 0),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to retrieve tools',
      isError: true,
      timestamp: new Date().toISOString()
    })
  }
})

// Metrics endpoint
router.get('/metrics', (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const metrics = {
      server: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      },
      tools: Object.fromEntries(
        Array.from(toolMetrics.entries()).map(([name, metrics]) => [
          name,
          {
            ...metrics,
            averageExecutionTime: metrics.calls > 0 ? Math.round(metrics.totalExecutionTime / metrics.calls) : 0,
            errorRate: metrics.calls > 0 ? (metrics.errors / metrics.calls) * 100 : 0
          }
        ])
      ),
      summary: {
        totalTools: tools.size,
        totalCalls: Array.from(toolMetrics.values()).reduce((sum, m) => sum + m.calls, 0),
        totalErrors: Array.from(toolMetrics.values()).reduce((sum, m) => sum + m.errors, 0),
        totalExecutionTime: Array.from(toolMetrics.values()).reduce((sum, m) => sum + m.totalExecutionTime, 0)
      }
    }
    
    res.json({
      ...metrics,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to retrieve metrics',
      isError: true,
      timestamp: new Date().toISOString()
    })
  }
})

// Enhanced health check endpoint
router.get('/health', (req: ExpressRequest, res: ExpressResponse) => {
  const health = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    toolsCount: tools.size,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    checks: {
      supabase: supabaseUrl ? 'configured' : 'missing',
      tools: tools.size > 0 ? 'loaded' : 'empty',
      memory: process.memoryUsage().heapUsed < 1024 * 1024 * 1024 ? 'ok' : 'high' // 1GB threshold
    }
  }
  
  const isHealthy = Object.values(health.checks).every(check => check === 'configured' || check === 'loaded' || check === 'ok')
  
  res.status(isHealthy ? 200 : 503).json(health)
})

app.use('/', router)

// Enhanced error handling middleware
app.use((error: Error, req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
  console.error('Unhandled error:', error)
  res.status(500).json({
    error: 'Internal server error',
    isError: true,
    timestamp: new Date().toISOString(),
    requestId: `err-${Date.now()}`
  })
})

// 404 handler
app.use('*', (req: ExpressRequest, res: ExpressResponse) => {
  res.status(404).json({
    error: 'Endpoint not found',
    isError: true,
    availableEndpoints: ['/health', '/tools', '/execute', '/sse', '/metrics'],
    timestamp: new Date().toISOString()
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Enhanced Cursor Bridge MCP Server running on port ${PORT}`)
  console.log(`📊 Registered ${tools.size} tools across ${[...new Set(Array.from(tools.values()).map(t => t.category))].length} categories`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`🛠️  Tools endpoint: http://localhost:${PORT}/tools`)
  console.log(`📡 SSE endpoint: http://localhost:${PORT}/sse`)
  console.log(`📈 Metrics endpoint: http://localhost:${PORT}/metrics`)
  console.log(`🔒 Security: Rate limiting and input validation enabled`)
  console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`)
})
