import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Developer Documentation - Modern Men Hair Salon',
  description: 'Comprehensive developer documentation for the Modern Men Hair Salon management system',
}

export default function DeveloperDocumentationPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Developer Documentation
        </h1>
        <p className="text-slate-300">
          Welcome to the developer documentation for the Modern Men Hair Salon management system. 
          Here you'll find comprehensive guides, API references, and technical documentation to help you 
          build, extend, and maintain the application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Getting Started</h2>
          <p className="text-slate-400 text-sm mb-4">
            Set up your development environment and understand the project structure
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Project Setup & Installation
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Architecture Overview
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Development Workflow
            </li>
          </ul>
        </div>

        <a href="/documentation/developer/api" className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors block">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">API Reference</h2>
          <p className="text-slate-400 text-sm mb-4">
            Complete API documentation with examples and interactive testing
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Authentication & Authorization
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Booking Management APIs
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              User Management APIs
            </li>
          </ul>
        </a>

        <a href="/documentation/developer/components" className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors block">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Components & UI</h2>
          <p className="text-slate-400 text-sm mb-4">
            Interactive component library with Storybook integration
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Component Library
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Design System
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Interactive Playground
            </li>
          </ul>
        </a>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Testing & Quality</h2>
          <p className="text-slate-400 text-sm mb-4">
            Testing strategies, quality assurance, and best practices
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Testing Framework
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Code Quality Standards
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              CI/CD Pipeline
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}