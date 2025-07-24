'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { productsAPI } from '@/lib/api'
import AdminLayout from './AdminLayout'

interface Product {
  id: string
  name: string
  brand: string
  description?: string
  price: number
  cost?: number
  category: string
  inStock: number
  minStock: number
  sku: string
  barcode?: string
  imageUrls: string[]
  isActive: boolean
  isFeatured: boolean
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getAll({
        search: searchTerm,
        page: currentPage,
        limit: 10,
      })
      setProducts(response.products || [])
      setTotalPages(response.totalPages || 1)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [searchTerm, currentPage])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Assuming a delete API exists for products
        // await productsAPI.delete(id);
        loadProducts() // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product')
      }
    }
  }

  return (
    <AdminLayout currentPage="products">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-salon-gold text-salon-dark px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-yellow-500"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, brand, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-none focus:ring-0"
            />
          </div>
        </div>

        {error && <div className="text-red-600 p-4 bg-red-50 rounded-md">{error}</div>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading products...</div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.inStock > product.minStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => setEditingProduct(product)} className="text-gray-600 hover:text-gray-900"><PencilIcon className="h-5 w-5" /></button>
                          <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 flex items-center justify-between border-t">
                  <p className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Product Modal (Add/Edit) */}
        {showModal && (
          <ProductModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false)
              setEditingProduct(null)
            }}
            onSave={loadProducts}
            product={editingProduct}
          />
        )}
      </div>
    </AdminLayout>
  )
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  product?: Product | null
}

function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: product?.id || '',
    name: product?.name || '',
    brand: product?.brand || '',
    description: product?.description || '',
    price: product?.price || 0,
    cost: product?.cost || 0,
    category: product?.category || '',
    inStock: product?.inStock || 0,
    minStock: product?.minStock || 0,
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    imageUrls: product?.imageUrls || [],
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (formData.id) {
        // Update existing product
        // await productsAPI.update(formData.id, formData);
      } else {
        // Create new product
        await productsAPI.create(formData);
      }
      onSave()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="bg-white rounded-lg p-6 text-left shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-medium mb-4">{product ? 'Edit Product' : 'Add Product'}</h3>
            {error && <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</div>}
            <div className="space-y-4">
              <input type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="text" placeholder="Brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required className="w-full border p-2 rounded-md" />
              <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border p-2 rounded-md" />
              <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required className="w-full border p-2 rounded-md" />
              <input type="number" placeholder="Cost" value={formData.cost} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})} className="w-full border p-2 rounded-md" />
              <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="number" placeholder="In Stock" value={formData.inStock} onChange={e => setFormData({...formData, inStock: parseInt(e.target.value)})} required className="w-full border p-2 rounded-md" />
              <input type="number" placeholder="Min Stock" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})} required className="w-full border p-2 rounded-md" />
              <input type="text" placeholder="SKU" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="text" placeholder="Barcode" value={formData.barcode || ''} onChange={e => setFormData({...formData, barcode: e.target.value})} className="w-full border p-2 rounded-md" />
              <input type="text" placeholder="Image URLs (comma-separated)" value={formData.imageUrls.join(', ')} onChange={e => setFormData({...formData, imageUrls: e.target.value.split(',').map(s => s.trim())})} className="w-full border p-2 rounded-md" />
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="form-checkbox" />
                <span>Active</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="form-checkbox" />
                <span>Featured</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-salon-gold text-salon-dark rounded-md disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}