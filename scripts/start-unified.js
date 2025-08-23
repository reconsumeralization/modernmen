#!/usr/bin/env node

/**
 * Unified Startup Script for Modern Men Hair Salon Documentation System
 * 
 * This script provides a unified way to start all necessary services
 * for development, testing, and production environments.
 */

import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  services: {
    nextjs: {
      command: 'npm',
      args: ['run', 'dev'],
      port: 3000,
      name: 'Next.js Dev Server',
      color: '\x1b[36m', // Cyan
      required: true
    },
    storybook: {
      command: 'npm',
      args: ['run', 'storybook'],
      port: 6006,
      name: 'Storybook',
      color: '\x1b[35m', // Magenta
      required: false
    },
    payload: {
      command: 'npm',
      args: ['run', 'payload:dev'],
      port: 3001,
      name: 'Payload CMS',
      color: '\x1b[33m', // Yellow
      required: false
    },
    mcp: {
      command: 'npm',
      args: ['run', 'mcp:start'],
      port: 8080,
      name: 'MCP Bridge Server',
      color: '\x1b[32m', // Green
      required: false
    }
  },
  environments: {
    dev: ['nextjs'],
    full: ['nextjs', 'storybook', 'payload'],
    docs: ['nextjs', 'storybook'],
    cms: ['nextjs', 'payload'],
    all: ['nextjs', 'storybook', 'payload', 'mcp']
  }
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

class UnifiedStarter {
  constructor() {
    this.processes = new Map();
    this.isShuttingDown = false;
    this.startTime = Date.now();
  }

  log(service, message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const serviceConfig = CONFIG.services[service];
    const serviceColor = serviceConfig?.color || colors.white;
    
    let typeColor = colors.white;
    switch (type) {
      case 'error': typeColor = colors.red; break;
      case 'warn': typeColor = colors.yellow; break;
      case 'success': typeColor = colors.green; break;
      case 'info': typeColor = colors.blue; break;
    }

    console.log(
      `${colors.bright}[${timestamp}]${colors.reset} ` +
      `${serviceColor}[${service.toUpperCase()}]${colors.reset} ` +
      `${typeColor}${message}${colors.reset}`
    );
  }

  async checkPort(port) {
    const { createServer } = await import('net');
    
    return new Promise((resolve) => {
      const server = createServer();
      
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      
      server.on('error', () => resolve(false));
    });
  }

  async waitForPort(port, timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const isAvailable = await this.checkPort(port);
      if (!isAvailable) {
        return true; // Port is in use (service is running)
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return false;
  }

  async startService(serviceName) {
    const service = CONFIG.services[serviceName];
    if (!service) {
      this.log('system', `Unknown service: ${serviceName}`, 'error');
      return false;
    }

    this.log(serviceName, `Starting ${service.name}...`, 'info');

    // Check if port is already in use
    if (service.port) {
      const portAvailable = await this.checkPort(service.port);
      if (!portAvailable) {
        this.log(serviceName, `Port ${service.port} is already in use`, 'warn');
        return false;
      }
    }

    const process = spawn(service.command, service.args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      cwd: path.resolve(__dirname, '..')
    });

    this.processes.set(serviceName, process);

    // Handle process output
    process.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        this.log(serviceName, output, 'info');
      }
    });

    process.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('warn') && !output.includes('deprecated')) {
        this.log(serviceName, output, 'error');
      }
    });

    process.on('close', (code) => {
      if (!this.isShuttingDown) {
        this.log(serviceName, `Process exited with code ${code}`, code === 0 ? 'info' : 'error');
        this.processes.delete(serviceName);
      }
    });

    process.on('error', (error) => {
      this.log(serviceName, `Failed to start: ${error.message}`, 'error');
      this.processes.delete(serviceName);
    });

    // Wait for service to be ready
    if (service.port) {
      this.log(serviceName, `Waiting for service to be ready on port ${service.port}...`, 'info');
      const isReady = await this.waitForPort(service.port);
      if (isReady) {
        this.log(serviceName, `${service.name} is ready on port ${service.port}`, 'success');
      } else {
        this.log(serviceName, `Timeout waiting for service to start`, 'error');
        return false;
      }
    }

    return true;
  }

  async startEnvironment(envName) {
    const services = CONFIG.environments[envName];
    if (!services) {
      this.log('system', `Unknown environment: ${envName}`, 'error');
      return false;
    }

    this.log('system', `Starting ${envName} environment...`, 'info');
    this.log('system', `Services: ${services.join(', ')}`, 'info');

    // Start services sequentially
    for (const serviceName of services) {
      const success = await this.startService(serviceName);
      if (!success && CONFIG.services[serviceName].required) {
        this.log('system', `Failed to start required service: ${serviceName}`, 'error');
        return false;
      }
    }

    this.displayStatus();
    return true;
  }

  displayStatus() {
    console.log('\n' + '='.repeat(60));
    console.log(`${colors.bright}${colors.green}🚀 Modern Men Documentation System${colors.reset}`);
    console.log('='.repeat(60));
    
    const runningServices = Array.from(this.processes.keys());
    
    if (runningServices.length === 0) {
      console.log(`${colors.yellow}No services running${colors.reset}`);
      return;
    }

    console.log(`${colors.bright}Running Services:${colors.reset}`);
    
    runningServices.forEach(serviceName => {
      const service = CONFIG.services[serviceName];
      const url = service.port ? `http://localhost:${service.port}` : 'N/A';
      console.log(`  ${service.color}● ${service.name}${colors.reset} - ${url}`);
    });

    console.log('\n' + `${colors.bright}Quick Links:${colors.reset}`);
    if (runningServices.includes('nextjs')) {
      console.log(`  📖 Documentation: ${colors.cyan}http://localhost:3000/documentation${colors.reset}`);
      console.log(`  🏠 Main App: ${colors.cyan}http://localhost:3000${colors.reset}`);
    }
    if (runningServices.includes('storybook')) {
      console.log(`  📚 Storybook: ${colors.magenta}http://localhost:6006${colors.reset}`);
    }
    if (runningServices.includes('payload')) {
      console.log(`  ⚙️  Payload CMS: ${colors.yellow}http://localhost:3001/admin${colors.reset}`);
    }

    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    console.log(`\n${colors.bright}Uptime:${colors.reset} ${uptime}s`);
    console.log(`${colors.bright}Press Ctrl+C to stop all services${colors.reset}`);
    console.log('='.repeat(60) + '\n');
  }

  async shutdown() {
    if (this.isShuttingDown) return;
    
    this.isShuttingDown = true;
    this.log('system', 'Shutting down all services...', 'warn');

    const shutdownPromises = Array.from(this.processes.entries()).map(([serviceName, process]) => {
      return new Promise((resolve) => {
        this.log(serviceName, 'Stopping...', 'warn');
        
        process.kill('SIGTERM');
        
        const timeout = setTimeout(() => {
          this.log(serviceName, 'Force killing...', 'warn');
          process.kill('SIGKILL');
          resolve();
        }, 5000);

        process.on('close', () => {
          clearTimeout(timeout);
          this.log(serviceName, 'Stopped', 'info');
          resolve();
        });
      });
    });

    await Promise.all(shutdownPromises);
    this.log('system', 'All services stopped', 'success');
    process.exit(0);
  }

  setupSignalHandlers() {
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGQUIT', () => this.shutdown());
  }

  displayHelp() {
    console.log(`
${colors.bright}${colors.green}Modern Men Documentation System - Unified Starter${colors.reset}

${colors.bright}Usage:${colors.reset}
  node scripts/start-unified.js [environment] [options]

${colors.bright}Environments:${colors.reset}
  dev      Start development server only (default)
  full     Start Next.js + Storybook + Payload CMS
  docs     Start Next.js + Storybook
  cms      Start Next.js + Payload CMS
  all      Start all services including MCP

${colors.bright}Options:${colors.reset}
  --help, -h     Show this help message
  --status, -s   Show current running services
  --stop         Stop all running services

${colors.bright}Examples:${colors.reset}
  node scripts/start-unified.js dev
  node scripts/start-unified.js full
  node scripts/start-unified.js --status

${colors.bright}Services:${colors.reset}
  Next.js Dev Server  - Port 3000 (Documentation & Main App)
  Storybook          - Port 6006 (Component Library)
  Payload CMS        - Port 3001 (Content Management)
  MCP Bridge Server  - Port 8080 (Model Context Protocol)
`);
  }

  async showStatus() {
    console.log(`${colors.bright}Checking service status...${colors.reset}\n`);
    
    for (const [serviceName, service] of Object.entries(CONFIG.services)) {
      if (service.port) {
        const isRunning = !(await this.checkPort(service.port));
        const status = isRunning ? 
          `${colors.green}● Running${colors.reset}` : 
          `${colors.red}● Stopped${colors.reset}`;
        
        console.log(`${service.name.padEnd(20)} ${status} ${service.port ? `(Port ${service.port})` : ''}`);
      }
    }
  }

  async run() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      this.displayHelp();
      return;
    }

    if (args.includes('--status') || args.includes('-s')) {
      await this.showStatus();
      return;
    }

    if (args.includes('--stop')) {
      this.log('system', 'Stopping all services...', 'warn');
      // Kill processes on common ports
      const ports = [3000, 6006, 3001, 8080];
      for (const port of ports) {
        try {
          exec(`lsof -ti:${port} | xargs kill -9`, () => {});
        } catch (error) {
          // Ignore errors
        }
      }
      this.log('system', 'Stop command sent to all services', 'info');
      return;
    }

    const environment = args[0] || 'dev';
    
    this.setupSignalHandlers();
    
    const success = await this.startEnvironment(environment);
    if (!success) {
      process.exit(1);
    }

    // Keep the process alive
    setInterval(() => {
      // Check if any required services have died
      const requiredServices = CONFIG.environments[environment].filter(
        serviceName => CONFIG.services[serviceName].required
      );
      
      const runningServices = Array.from(this.processes.keys());
      const missingRequired = requiredServices.filter(
        serviceName => !runningServices.includes(serviceName)
      );

      if (missingRequired.length > 0) {
        this.log('system', `Required services stopped: ${missingRequired.join(', ')}`, 'error');
        this.shutdown();
      }
    }, 5000);
  }
}

// Run the unified starter
const starter = new UnifiedStarter();
starter.run().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});