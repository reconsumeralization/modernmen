'use client'
import { useState } from 'react'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/app/contexts/CartContext'

export default function CartDrawer({ isOpen, onCloseAction }: { isOpen: boolean; onCloseAction: () => void }) {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [giftCardCode, setGiftCardCode] = useState('')

  const subtotal = state.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.10 // 10% GST
  const total = subtotal + tax

  const handleCheckout = async () => {
    if (state.items.length === 0) return

    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map((item: any) => ({
            id: item.id,
            quantity: item.quantity,
            price: Number(item.price)
          })),
          clientId: 'guest', // Will be updated when user auth is implemented
          isPickup: true,
          giftCardCode: giftCardCode || undefined
        }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        return
      }

      if (data.paidByGiftCard) {
        // Gift card covered the full amount
        alert('Order completed with gift card!')
        clearCart()
        onCloseAction()
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCloseAction} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button onClick={onCloseAction} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingBag size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.imageUrl || '/images/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 rounded border text-center text-sm hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded border text-center text-sm hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gift Card Input */}
          {state.items.length > 0 && (
            <div className="border-t px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gift Card Code (Optional)
                </label>
                <input
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                  placeholder="Enter gift card code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t px-6 py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10% GST):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-brand-red text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </button>
              
              <button
                onClick={clearCart}
                className="w-full text-gray-500 py-2 px-4 rounded-md hover:bg-gray-100"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}