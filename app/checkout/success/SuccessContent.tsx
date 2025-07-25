'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, MapPin, Truck } from 'lucide-react'
import Link from 'next/link'

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get('order_id')
    const sessionId = searchParams.get('session_id')
    
    if (orderId) {
      fetchOrder(orderId)
    }
  }, [searchParams])

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrder(orderData)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Order Number:</p>
                  <p className="text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Total:</p>
                  <p className="text-gray-900 text-lg font-bold">${Number(order.total).toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-700 mb-2">Fulfillment:</p>
                  <div className="flex items-center">
                    {order.isPickup ? (
                      <>
                        <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                        <span>Store Pickup - Ready in 2-3 business days</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4 text-blue-600 mr-2" />
                        <span>Shipping - 5-7 business days</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {order.items && (
                <div className="mt-6">
                  <p className="font-medium text-gray-700 mb-3">Items:</p>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span>{item.product.brand} {item.product.name}</span>
                        <span>Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/" 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              📧 A confirmation email has been sent to your email address with order details and tracking information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
