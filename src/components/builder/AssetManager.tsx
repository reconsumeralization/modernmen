// 🎨 AMAZING Asset Manager - Professional Media Management
import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { systemManager } from '../../config/system.config'
import { cn } from '../../lib/utils'

interface Asset {
  id: string
  name: string
  url: string
  type: 'image' | 'icon' | 'video' | 'document'
  size: number
  dimensions?: { width: number; height: number }
  tags: string[]
  uploadedAt: Date
  category: string
  usage: number
}

const ASSET_CATEGORIES = [
  'Images',
  'Icons',
  'Logos',
  'Backgrounds',
  'Illustrations',
  'Photos',
  'Vectors',
  'Videos'
]

const SAMPLE_ASSETS: Asset[] = [
  {
    id: 'hero-bg-1',
    name: 'Modern Hero Background',
    url: '/assets/images/hero-bg-1.jpg',
    type: 'image',
    size: 2457600,
    dimensions: { width: 1920, height: 1080 },
    tags: ['hero', 'background', 'modern', 'gradient'],
    uploadedAt: new Date(),
    category: 'Backgrounds',
    usage: 45
  },
  {
    id: 'logo-placeholder',
    name: 'Company Logo Placeholder',
    url: '/assets/images/logo-placeholder.png',
    type: 'image',
    size: 51200,
    dimensions: { width: 200, height: 80 },
    tags: ['logo', 'placeholder', 'brand'],
    uploadedAt: new Date(),
    category: 'Logos',
    usage: 23
  },
  {
    id: 'icon-star',
    name: 'Star Icon',
    url: '/assets/icons/star.svg',
    type: 'icon',
    size: 1024,
    tags: ['star', 'rating', 'favorite'],
    uploadedAt: new Date(),
    category: 'Icons',
    usage: 156
  },
  {
    id: 'illustration-team',
    name: 'Team Illustration',
    url: '/assets/illustrations/team.svg',
    type: 'image',
    size: 204800,
    dimensions: { width: 400, height: 300 },
    tags: ['team', 'people', 'illustration'],
    uploadedAt: new Date(),
    category: 'Illustrations',
    usage: 78
  }
]

export function AssetManager() {
  const [assets, setAssets] = useState<Asset[]>(SAMPLE_ASSETS)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Handle asset selection
  const toggleAssetSelection = useCallback((assetId: string) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev)
      if (newSet.has(assetId)) {
        newSet.delete(assetId)
      } else {
        newSet.add(assetId)
      }
      return newSet
    })
  }, [])

  // Handle drag start
  const handleDragStart = useCallback((asset: Asset) => {
    setDraggedAsset(asset)
  }, [])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedAsset(null)
  }, [])

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    const newAssets: Asset[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const asset: Asset = {
        id: `uploaded-${Date.now()}-${i}`,
        name: file.name,
        url: URL.createObjectURL(file), // In real app, this would be uploaded to storage
        type: file.type.startsWith('image/') ? 'image' : 'document',
        size: file.size,
        tags: [],
        uploadedAt: new Date(),
        category: 'Images',
        usage: 0
      }

      if (asset.type === 'image') {
        // Get image dimensions
        await new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => {
            asset.dimensions = { width: img.width, height: img.height }
            resolve()
          }
          img.src = asset.url
        })
      }

      newAssets.push(asset)
    }

    setAssets(prev => [...prev, ...newAssets])
    setShowUploadDialog(false)

    // Show success feedback
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    notification.textContent = `${newAssets.length} asset(s) uploaded successfully!`
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }, [])

  // Handle asset deletion
  const handleDeleteAssets = useCallback(() => {
    if (selectedAssets.size === 0) return

    setAssets(prev => prev.filter(asset => !selectedAssets.has(asset.id)))
    setSelectedAssets(new Set())

    // Show success feedback
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    notification.textContent = `${selectedAssets.size} asset(s) deleted successfully!`
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }, [selectedAssets])

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">🎨 Asset Manager</h2>
            <p className="text-sm text-gray-600">Manage images, icons, and media assets</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm transition-colors",
                  viewMode === 'grid' ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm transition-colors",
                  viewMode === 'list' ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                List
              </button>
            </div>

            {/* Upload Button */}
            <motion.button
              onClick={() => setShowUploadDialog(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Upload Assets
            </motion.button>

            {/* Delete Button */}
            {selectedAssets.size > 0 && (
              <motion.button
                onClick={handleDeleteAssets}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Delete ({selectedAssets.size})
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {ASSET_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Asset Grid/List */}
      <div className="flex-1 p-6 overflow-auto">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or upload some assets</p>
            <button
              onClick={() => setShowUploadDialog(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Upload Your First Asset
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredAssets.map((asset) => (
              <AssetGridItem
                key={asset.id}
                asset={asset}
                isSelected={selectedAssets.has(asset.id)}
                onSelect={() => toggleAssetSelection(asset.id)}
                onDragStart={() => handleDragStart(asset)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAssets.map((asset) => (
              <AssetListItem
                key={asset.id}
                asset={asset}
                isSelected={selectedAssets.has(asset.id)}
                onSelect={() => toggleAssetSelection(asset.id)}
                onDragStart={() => handleDragStart(asset)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <AnimatePresence>
        {showUploadDialog && (
          <UploadDialog
            onUpload={handleFileUpload}
            onClose={() => setShowUploadDialog(false)}
            fileInputRef={fileInputRef}
          />
        )}
      </AnimatePresence>

      {/* Drag Overlay */}
      <AnimatePresence>
        {draggedAsset && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-4 rounded-lg shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm font-medium">Drop to use asset</p>
                <p className="text-xs text-gray-600">{draggedAsset.name}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 🎨 Asset Grid Item
interface AssetGridItemProps {
  asset: Asset
  isSelected: boolean
  onSelect: () => void
  onDragStart: () => void
  onDragEnd: () => void
}

function AssetGridItem({ asset, isSelected, onSelect, onDragStart, onDragEnd }: AssetGridItemProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <motion.div
      className={cn(
        "relative bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200",
        isSelected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
      )}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      draggable
      onDragStart={(e: { dataTransfer: { setData: (arg0: string, arg1: string) => void } }) => {
        onDragStart()
        e.dataTransfer.setData('application/json', JSON.stringify(asset))
      }}
      onDragEnd={onDragEnd}
    >
      {/* Asset Preview */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {asset.type === 'image' ? (
          <>
            <img
              src={asset.url}
              alt={asset.name}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-200",
                isImageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : asset.type === 'icon' ? (
          <div className="text-3xl">📄</div>
        ) : (
          <div className="text-3xl">🎬</div>
        )}
      </div>

      {/* Asset Info */}
      <div className="p-3">
        <h4 className="text-sm font-medium text-gray-900 truncate">{asset.name}</h4>
        <p className="text-xs text-gray-600 mt-1">
          {(asset.size / 1024).toFixed(1)} KB
        </p>
        {asset.dimensions && (
          <p className="text-xs text-gray-500">
            {asset.dimensions.width} × {asset.dimensions.height}
          </p>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}

      {/* Drag Indicator */}
      <div className="absolute top-2 left-2 opacity-0 hover:opacity-100 transition-opacity">
        <div className="w-5 h-5 bg-gray-800 bg-opacity-75 rounded flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

// 📋 Asset List Item
interface AssetListItemProps {
  asset: Asset
  isSelected: boolean
  onSelect: () => void
  onDragStart: () => void
  onDragEnd: () => void
}

function AssetListItem({ asset, isSelected, onSelect, onDragStart, onDragEnd }: AssetListItemProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-4 p-4 bg-white border rounded-lg cursor-pointer transition-all duration-200",
        isSelected ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"
      )}
      whileHover={{ scale: 1.005 }}
      onClick={onSelect}
      draggable
      onDragStart={(e: React.DragEvent) => {
        onDragStart()
        e.dataTransfer.setData('application/json', JSON.stringify(asset))
      }}
      onDragEnd={onDragEnd}
    >
      {/* Asset Preview */}
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
        {asset.type === 'image' ? (
          <img
            src={asset.url}
            alt={asset.name}
            className="w-full h-full object-cover rounded"
          />
        ) : asset.type === 'icon' ? (
          <div className="text-lg">📄</div>
        ) : (
          <div className="text-lg">🎬</div>
        )}
      </div>

      {/* Asset Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{asset.name}</h4>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-gray-600">{asset.category}</span>
          <span className="text-xs text-gray-500">
            {(asset.size / 1024).toFixed(1)} KB
          </span>
          {asset.dimensions && (
            <span className="text-xs text-gray-500">
              {asset.dimensions.width} × {asset.dimensions.height}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {asset.usage} uses
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-1 mt-2">
          {asset.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Selection Checkbox */}
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
    </motion.div>
  )
}

// 📤 Upload Dialog
interface UploadDialogProps {
  onUpload: (files: FileList) => void
  onClose: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

function UploadDialog({ onUpload, onClose, fileInputRef }: UploadDialogProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files)
    }
  }, [onUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files)
    }
  }, [onUpload])

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">📤 Upload Assets</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Drag & Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-4xl mb-4">
              {dragActive ? "🎯" : "📁"}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {dragActive ? "Drop your files here!" : "Drag & drop your assets"}
            </h3>
            <p className="text-gray-600 mb-4">
              Or click to browse files from your computer
            </p>
            <p className="text-sm text-gray-500">
              Supports images, icons, videos, and documents
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.svg,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* File Type Info */}
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Supported file types:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>• Images (JPG, PNG, GIF, SVG)</div>
              <div>• Videos (MP4, WebM)</div>
              <div>• Icons (SVG, PNG)</div>
              <div>• Documents (PDF, DOC, DOCX)</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Files
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
