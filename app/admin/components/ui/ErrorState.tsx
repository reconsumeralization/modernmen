'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

const ErrorState = ({ 
  title = "Error", 
  message, 
  onRetry 
}: ErrorStateProps) => {
  return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700 font-medium">{title}</p>
        </div>
        <p className="text-red-600 text-sm mt-1">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorState