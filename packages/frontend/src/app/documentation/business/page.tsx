import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Documentation - Modern Men Hair Salon',
  description: 'Business user documentation for salon owners, employees, and customers',
}

export default function BusinessDocumentationPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Business Documentation
        </h1>
        <p className="text-slate-300">
          Comprehensive guides for salon owners, employees, and customers to effectively use 
          the Modern Men Hair Salon management system for daily operations and business growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Salon Owner Guides</h2>
          <p className="text-slate-400 text-sm mb-4">
            Complete business management guides for salon owners and managers
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Initial Business Setup
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Staff Management
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Financial Analytics
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Employee Operations</h2>
          <p className="text-slate-400 text-sm mb-4">
            Daily operational guides for stylists, receptionists, and salon staff
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Daily Workflow
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Appointment Management
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Customer Service
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Customer Help</h2>
          <p className="text-slate-400 text-sm mb-4">
            Self-service guides for customers using the booking and account features
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Account Setup
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Booking Appointments
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Payment & Billing
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Business Analytics</h2>
          <p className="text-slate-400 text-sm mb-4">
            Understanding reports, metrics, and business intelligence features
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Revenue Reports
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Customer Analytics
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Performance Metrics
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}