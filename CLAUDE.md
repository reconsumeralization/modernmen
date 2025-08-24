# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern Men Hair Salon - A comprehensive Next.js 15 application with TypeScript, Payload CMS integration, Supabase authentication, and full-stack business management features for a hair salon. The project includes customer portals, staff management, appointment booking, analytics dashboards, and comprehensive documentation system.

## Development Commands

### Core Development
- `npm run dev` - Start Next.js development server (port 3000)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix

### Unified Development Environment
- `npm run dev:unified` - Start development server only
- `npm run dev:full` - Start Next.js + Storybook + Payload CMS
- `npm run dev:docs` - Start Next.js + Storybook  
- `npm run dev:cms` - Start Next.js + Payload CMS
- `npm run dev:all` - Start all services including MCP Bridge Server
- `npm run dev:status` - Check running service status
- `npm run dev:stop` - Stop all running services

### Testing
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run Playwright end-to-end tests

### Additional Tools
- `npm run storybook` - Start Storybook (port 6006)
- `npm run payload:dev` - Start Payload CMS development server
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size

## Architecture Overview

### Authentication System
- **NextAuth.js** with multiple providers (Google, GitHub, Credentials)
- **Supabase** backend with custom user tables
- Role-based access control (admin, employee, customer)
- Located in: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`

### Database & CMS
- **Payload CMS 3.x** for content management with PostgreSQL
- **Supabase** for authentication and custom data
- Collections: Users, Customers, Appointments, Services, Stylists, Media
- Configuration: `src/payload.config.ts`

### UI Framework
- **React 19** with **Next.js 15** App Router
- **Tailwind CSS** with **shadcn/ui** components
- **Radix UI** primitives for accessibility
- **Framer Motion** for animations
- Custom theme with CSS variables in `src/app/globals.css`

### Key Features
- **Customer Portal**: Appointment booking, profile management, loyalty points
- **Staff Management**: Employee dashboard, analytics, scheduling
- **Admin Panel**: User management, business analytics, CRM features
- **Documentation System**: Interactive docs with search, API tester, component playground
- **Image Editor**: Custom Modern Men-branded image editing interface
- **Real-time Notifications**: Event-driven notification system
- **Progressive Web App**: Offline support, service worker

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components organized by feature
- `src/lib/` - Utility functions, services, and configurations
- `src/payload/` - Payload CMS collections and components
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `src/stories/` - Storybook component stories

### API Layer
- **REST API** routes in `src/app/api/`
- Rate limiting with **Upstash Redis**
- Error handling and logging system
- Payload CMS admin API integration
- Supabase client integration

## Development Workflow

### Environment Setup
1. Copy `.env.local.example` to `.env.local`
2. Configure Supabase credentials
3. Set up NextAuth secret and providers
4. Initialize Payload CMS database

### Service Dependencies
- **Next.js** (port 3000) - Main application server
- **Storybook** (port 6006) - Component library development
- **Payload CMS** (port 3001) - Content management admin
- **MCP Bridge Server** (port 8080) - Model Context Protocol integration

### Code Quality
- **TypeScript** strict mode with custom configuration
- **ESLint** with Next.js and React hooks rules
- **Prettier** for code formatting
- **Jest** for unit testing with React Testing Library
- **Playwright** for E2E testing
- Test coverage reporting in `coverage/` directory

### Key Configuration Files
- `next.config.js` - Next.js configuration with Payload integration
- `tailwind.config.js` - Tailwind CSS theme customization
- `jest.config.js` - Jest testing framework setup
- `tsconfig.json` - TypeScript compiler options
- `scripts/start-unified.js` - Unified development environment manager

### Development Guidelines
1. Use the unified development scripts for multi-service development
2. Run `npm run typecheck` before committing changes
3. Follow existing component patterns in `src/components/ui/`
4. Use the established authentication patterns for protected routes
5. Leverage existing Payload collections before creating new ones
6. Test API routes with the built-in API tester at `/documentation/developer/api`

### Monitoring & Analytics
- **Vercel Analytics** integration
- **LogRocket** for user session recording
- **Sentry** error tracking and performance monitoring
- Custom analytics dashboard with business metrics
- Real-time monitoring via OpenTelemetry

This application is production-ready with comprehensive business management features, modern development practices, and extensive documentation system.