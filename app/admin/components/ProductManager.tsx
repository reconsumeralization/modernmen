'use client'

import React, { useState, useEffect } from 'react'
import ProductCard from './products/ProductCard'
import SearchBar from './ui/SearchBar'
import FilterDropdown from './ui/FilterDropdown'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorState from './ui/ErrorState'
import { Plus, AlertTriangle } from 'lucide-react'

const ProductManager = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      setProducts(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const toggleProductActive = async (productId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      })
      if (!response.ok) throw new Error('Failed to update product')
      await fetchProducts()
    } catch (err) {
      alert('Failed to update product status')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'low' && product.inStock <= product.minStock) ||
      (stockFilter === 'in-stock' && product.inStock > product.minStock)
    return matchesSearch && matchesCategory && matchesStock
  })

  const categories = Array.from(new Set(products.map((p: any) => p.category))).map(cat => ({ value: cat, label: cat }))
  const stockOptions = [
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low', label: 'Low Stock' }
  ]

  const lowStockCount = products.filter(p => p.inStock <= p.minStock).length

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchProducts} />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          {lowStockCount > 0 && (
            <div className="flex items-center space-x-2 mt-2 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{lowStockCount} products low on stock</span>
            </div>
          )}
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search products..." className="max-w-md" />
        <FilterDropdown value={categoryFilter} onChange={setCategoryFilter} options={categories} placeholder="All Categories" />
        <FilterDropdown value={stockFilter} onChange={setStockFilter} options={stockOptions} placeholder="All Stock" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onEdit={() => console.log('Edit product:', product)}
            onToggleActive={toggleProductActive}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductManager