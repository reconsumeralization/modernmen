import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shared Resources - Modern Men Hair Salon',
  description: 'Shared documentation resources including glossary, troubleshooting, and changelog',
}

export default function SharedDocumentationPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Shared Resources
        </h1>
        <p className="text-slate-300">
          Common resources and references used across all documentation sections, 
          including terminology, troubleshooting guides, and system updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Glossary</h2>
          <p className="text-slate-400 text-sm mb-4">
            Comprehensive glossary of terms and definitions used throughout the system
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Business Terms
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Technical Terms
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Industry Terminology
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Troubleshooting</h2>
          <p className="text-slate-400 text-sm mb-4">
            Common issues and solutions across all user roles and system components
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Login Issues
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Booking Problems
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Payment Issues
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Changelog</h2>
          <p className="text-slate-400 text-sm mb-4">
            Version history, feature updates, and system changes
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Recent Updates
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Breaking Changes
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Migration Guides
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">FAQ</h2>
          <p className="text-slate-400 text-sm mb-4">
            Frequently asked questions from all user types and scenarios
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              General Questions
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Technical FAQ
            </li>
            <li className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
              Business FAQ
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}