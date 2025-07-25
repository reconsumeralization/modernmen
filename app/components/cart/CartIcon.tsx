'use client'

import React from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'

interface CartIconProps {
  onClick: () => void
  className?: string
}

const CartIcon = ({ onClick, className = "" }: CartIconProps) => {
  const { state } = useCart()

  return (
    <button
      onClick={onClick}
      className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
    >
      <ShoppingBag className="w-6 h-6" />
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </button>
  )
}

export default CartIcon