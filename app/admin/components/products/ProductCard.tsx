'use client'

import React from 'react'
import { Package, DollarSign, Tag, TrendingDown, Edit } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    brand: string
    description: string
    price: number
    cost?: number
    category: string
    inStock: number
    minStock: number
    sku: string
    isActive: boolean
    isFeatured: boolean
  }
  onEdit: (product: any) => void
  onToggleActive: (id: string, isActive: boolean) => void
}

const ProductCard = ({ product, onEdit, onToggleActive }: ProductCardProps) => {
  const isLowStock = product.inStock <= product.minStock
  const profit = product.cost ? product.price - product.cost : 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>
        <div className="flex space-x-2">
          {product.isFeatured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Featured</span>
          )}
          <span className={`px-2 py-1 text-xs rounded ${
            product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>      {product.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>${product.price}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4" />
          <span>{product.category}</span>
        </div>
        <div className={`flex items-center space-x-2 ${isLowStock ? 'text-red-600' : ''}`}>
          <Package className="w-4 h-4" />
          <span>{product.inStock} in stock</span>
          {isLowStock && <TrendingDown className="w-3 h-3" />}
        </div>
        <div className="text-xs text-gray-500">
          SKU: {product.sku}
        </div>
      </div>

      {product.cost && (
        <div className="text-sm mb-3">
          <span className="text-gray-500">Cost: ${product.cost}</span>
          <span className={`ml-2 ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Profit: ${profit.toFixed(2)}
          </span>
        </div>
      )}

      {isLowStock && (
        <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
          <p className="text-red-700 text-xs">⚠️ Low stock - below minimum of {product.minStock}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => onEdit(product)}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center space-x-1"
        >
          <Edit className="w-3 h-3" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onToggleActive(product.id, !product.isActive)}
          className={`px-3 py-1 text-xs rounded ${
            product.isActive 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {product.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard