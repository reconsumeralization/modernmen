'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  imageUrl?: string
  inStock: number
}

interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isPickup: boolean
  shippingAddress?: {
    firstName: string
    lastName: string
    address: string
    city: string
    province: string
    postalCode: string
  }
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PICKUP'; isPickup: boolean }
  | { type: 'SET_SHIPPING_ADDRESS'; address: CartState['shippingAddress'] }
  | { type: 'LOAD_CART'; cart: CartState }

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isPickup: true
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.product.id)
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: Math.min(item.quantity + action.quantity, item.inStock) }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.product, quantity: action.quantity }]
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.productId)
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.productId
          ? { ...item, quantity: Math.max(0, Math.min(action.quantity, item.inStock)) }
          : item
      ).filter(item => item.quantity > 0)

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'CLEAR_CART':
      return initialState

    case 'SET_PICKUP':
      return { ...state, isPickup: action.isPickup }

    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.address }

    case 'LOAD_CART':
      return action.cart

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setPickup: (isPickup: boolean) => void
  setShippingAddress: (address: CartState['shippingAddress']) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('modernmen_cart')
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', cart })
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('modernmen_cart', JSON.stringify(state))
  }, [state])

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setPickup = (isPickup: boolean) => {
    dispatch({ type: 'SET_PICKUP', isPickup })
  }

  const setShippingAddress = (address: CartState['shippingAddress']) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', address })
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setPickup,
      setShippingAddress
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext