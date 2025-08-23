# Unified Startup System

The Modern Men Documentation System includes a unified startup script that makes it easy to start all necessary services for development.

## Quick Start

```bash
# Start development environment (Next.js only)
npm run dev:unified

# Start full development environment (Next.js + Storybook + Payload CMS)
npm run dev:full

# Start documentation environment (Next.js + Storybook)
npm run dev:docs

# Start CMS environment (Next.js + Payload CMS)
npm run dev:cms

# Start all services including MCP Bridge
npm run dev:all
```

## Available Commands

| Command | Description | Services Started |
|---------|-------------|------------------|
| `npm run dev:unified` | Basic development | Next.js (port 3000) |
| `npm run dev:full` | Full development | Next.js + Storybook + Payload CMS |
| `npm run dev:docs` | Documentation focus | Next.js + Storybook |
| `npm run dev:cms` | CMS development | Next.js + Payload CMS |
| `npm run dev:all` | All services | Next.js + Storybook + Payload + MCP |
| `npm run dev:status` | Check service status | - |
| `npm run dev:stop` | Stop all services | - |

## Service Details

### Next.js Development Server (Port 3000)
- Main application and documentation system
- Hot reload for development
- **URL:** http://localhost:3000
- **Documentation:** http://localhost:3000/documentation

### Storybook (Port 6006)
- Component library and design system
- Interactive component development
- **URL:** http://localhost:6006

### Payload CMS (Port 3001)
- Content management system
- Admin interface for documentation
- **URL:** http://localhost:3001/admin

### MCP Bridge Server (Port 8080)
- Model Context Protocol bridge
- AI integration services
- **URL:** http://localhost:8080

## Features

### 🚀 Smart Startup
- Automatically checks port availability
- Waits for services to be ready before proceeding
- Color-coded logging for easy identification

### 🔄 Process Management
- Graceful shutdown with Ctrl+C
- Automatic restart of failed required services
- Process monitoring and health checks

### 📊 Status Monitoring
- Real-time service status display
- Uptime tracking
- Quick links to all running services

### 🛠 Development Tools
- Environment-specific configurations
- Service dependency management
- Integrated error handling

## Usage Examples

### Basic Development
```bash
npm run dev:unified
```
Starts only the Next.js development server for basic development work.

### Full Documentation Development
```bash
npm run dev:docs
```
Starts Next.js and Storybook for comprehensive documentation and component development.

### Content Management Development
```bash
npm run dev:cms
```
Starts Next.js and Payload CMS for content management and documentation editing.

### Complete Development Environment
```bash
npm run dev:full
```
Starts Next.js, Storybook, and Payload CMS for full-featured development.

### All Services (Including AI)
```bash
npm run dev:all
```
Starts all services including the MCP Bridge Server for AI integration development.

## Troubleshooting

### Port Conflicts
If you get port conflict errors, check what's running:
```bash
npm run dev:status
```

Stop all services:
```bash
npm run dev:stop
```

### Service Won't Start
1. Check if the port is available
2. Ensure all dependencies are installed: `npm install`
3. Check for TypeScript errors: `npm run typecheck`
4. Try starting services individually to isolate issues

### Performance Issues
- Use `npm run dev:unified` for basic development to reduce resource usage
- Close unused browser tabs
- Monitor system resources when running multiple services

## Configuration

The unified starter can be configured by editing `scripts/start-unified.js`:

- **Service Ports:** Modify the `CONFIG.services` section
- **Environment Presets:** Update `CONFIG.environments`
- **Startup Behavior:** Adjust service dependencies and requirements

## Integration with Development Workflow

The unified startup system integrates mlessly with:
- **Hot Reload:** All services support hot reload during development
- **TypeScript:** Automatic type checking and compilation
- **Linting:** ESLint integration for code quality
- **Testing:** Jest and Playwright test suites
- **Storybook:** Component development and testing
- **Payload CMS:** Content management and API development

## Best Practices

1. **Use Environment-Specific Commands:** Choose the right environment for your development focus
2. **Monitor Resource Usage:** Don't run all services if you don't need them
3. **Check Status Regularly:** Use `npm run dev:status` to monitor service health
4. **Graceful Shutdown:** Always use Ctrl+C to stop services properly
5. **Port Management:** Keep track of which ports are in use for each service

## Support

For issues with the unified startup system:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure ports are available
4. Check the individual service documentation
5. Review the startup script logs for detailed error information