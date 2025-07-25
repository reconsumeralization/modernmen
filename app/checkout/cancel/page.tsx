'use client'

import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 text-sm">
              💡 Your items are still in your cart. You can complete your purchase anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <Link 
              href="/" 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{' '}
              <a href="mailto:info@modernmen.ca" className="text-blue-600 hover:underline">
                info@modernmen.ca
              </a>{' '}
              or{' '}
              <a href="tel:306-522-4111" className="text-blue-600 hover:underline">
                (306) 522-4111
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}