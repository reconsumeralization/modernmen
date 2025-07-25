'use client'

import React, { useState } from 'react'
import { X, Plus, Minus, ShoppingBag, MapPin, Truck } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'
import getStripe from '@/lib/stripe/client'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { state, removeItem, updateQuantity, setPickup } = useCart()
  const [loading, setLoading] = useState(false)

  const shippingCost = !state.isPickup && state.total < 75 ? 9.99 : 0
  const tax = (state.total + shippingCost) * 0.10
  const finalTotal = state.total + shippingCost + tax

  const handleCheckout = async () => {
    if (state.items.length === 0) return

    setLoading(true)
    try {
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          isPickup: state.isPickup,
          shippingAddress: state.shippingAddress
        })
      })

      const { url, error } = await response.json()
      
      if (error) {
        alert(error)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Cart ({state.itemCount})
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Options */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex space-x-4">
              <button
                onClick={() => setPickup(true)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                  state.isPickup 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Pickup</span>
              </button>
              <button
                onClick={() => setPickup(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                  !state.isPickup 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-sm">Shipping</span>
              </button>
            </div>
            {!state.isPickup && state.total < 75 && (
              <p className="text-sm text-amber-600 mt-2">
                Add ${(75 - state.total).toFixed(2)} more for free shipping
              </p>
            )}
          </div>          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.brand} {item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price}</p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.inStock}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                {!state.isPickup && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  'Checkout'
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                {state.isPickup 
                  ? 'Items will be ready for pickup within 2-3 business days'
                  : 'Standard shipping: 5-7 business days'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartDrawer