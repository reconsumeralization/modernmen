'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BlockRenderer, BLOCK_REGISTRY } from '../blocks'
import { LivePreview } from './LivePreview'
import { AdvancedStyleControls } from './AdvancedStyleControls'

interface PageBuilderProps {
  initialBlocks?: any[]
  onBlocksChange?: (blocks: any[]) => void
  isPreview?: boolean
  className?: string
}

export const DragDropPageBuilder: React.FC<PageBuilderProps> = ({
  initialBlocks = [],
  onBlocksChange,
  isPreview = false,
  className = '',
}) => {
  const [blocks, setBlocks] = useState(initialBlocks)
  const [activeBlock, setActiveBlock] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isDirty, setIsDirty] = useState(false)
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [showLivePreview, setShowLivePreview] = useState(true)
  const [previewMode, setPreviewMode] = useState<'split' | 'preview-only' | 'builder-only'>('split')
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Update blocks when they change
  useEffect(() => {
    if (onBlocksChange && isDirty) {
      onBlocksChange(blocks)
      setIsDirty(false)
    }
  }, [blocks, onBlocksChange, isDirty])

  // Generate unique ID for new blocks
  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Handle block selection from live preview
  useEffect(() => {
    const handlePreviewBlockSelected = (event: CustomEvent) => {
      setSelectedBlock(event.detail.blockId)
    }

    window.addEventListener('previewBlockSelected', handlePreviewBlockSelected as EventListener)
    return () => window.removeEventListener('previewBlockSelected', handlePreviewBlockSelected as EventListener)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    
    // Check if dragging from block library
    if (typeof active.id === 'string' && active.id.startsWith('library-')) {
      const blockType = active.id.replace('library-', '')
      setActiveBlock({
        blockType,
        id: generateId(),
        ...getDefaultBlockData(blockType)
      })
    } else {
      // Dragging existing block
      const block = blocks.find(b => b.id === active.id)
      setActiveBlock(block)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveBlock(null)

    if (!over) return

    // Adding new block from library
    if (typeof active.id === 'string' && active.id.startsWith('library-')) {
      const blockType = active.id.replace('library-', '')
      const newBlock = {
        blockType,
        id: generateId(),
        ...getDefaultBlockData(blockType)
      }

      // Insert at specific position if over a block
      let insertIndex = blocks.length
      if (over.id && over.id !== 'canvas') {
        const overIndex = blocks.findIndex(b => b.id === over.id)
        if (overIndex !== -1) {
          insertIndex = overIndex + 1
        }
      }

      const newBlocks = [...blocks]
      newBlocks.splice(insertIndex, 0, newBlock)
      setBlocks(newBlocks)
      setIsDirty(true)
      setSelectedBlock(newBlock.id)
      return
    }

    // Reordering existing blocks
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id)
      const newIndex = blocks.findIndex(b => b.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        setBlocks(arrayMove(blocks, oldIndex, newIndex))
        setIsDirty(true)
      }
    }
  }

  const addBlock = (blockType: string) => {
    const newBlock = {
      blockType,
      id: generateId(),
      ...getDefaultBlockData(blockType)
    }
    setBlocks([...blocks, newBlock])
    setIsDirty(true)
    setSelectedBlock(newBlock.id)
  }

  const duplicateBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (block) {
      const duplicatedBlock = {
        ...block,
        id: generateId()
      }
      const index = blocks.findIndex(b => b.id === blockId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, duplicatedBlock)
      setBlocks(newBlocks)
      setIsDirty(true)
    }
  }

  const deleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId))
    setIsDirty(true)
    if (selectedBlock === blockId) {
      setSelectedBlock(null)
    }
  }

  const updateBlock = (blockId: string, updates: any) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, ...updates }
        : block
    ))
    setIsDirty(true)
  }

  const moveBlockUp = (blockId: string) => {
    const index = blocks.findIndex(b => b.id === blockId)
    if (index > 0) {
      setBlocks(arrayMove(blocks, index, index - 1))
      setIsDirty(true)
    }
  }

  const moveBlockDown = (blockId: string) => {
    const index = blocks.findIndex(b => b.id === blockId)
    if (index < blocks.length - 1) {
      setBlocks(arrayMove(blocks, index, index + 1))
      setIsDirty(true)
    }
  }

  // Viewport size classes for responsive preview
  const viewportClasses = {
    desktop: 'w-full max-w-none',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto'
  }

  return (
    <div className={`page-builder flex h-screen bg-gray-50 ${className}`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Block Library Sidebar */}
        {sidebarOpen && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">🎨 Page Builder</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search blocks..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <BlockLibrary onAddBlock={addBlock} />
            </div>
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
                
                <div className="text-sm text-gray-600">
                  {blocks.length} block{blocks.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Responsive Preview Controls */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    onClick={() => setViewMode('tablet')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📱 Tablet
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📱 Mobile
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Preview Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setPreviewMode('builder-only')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        previewMode === 'builder-only' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Builder Only"
                    >
                      🔧
                    </button>
                    <button
                      onClick={() => setPreviewMode('split')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        previewMode === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Split View"
                    >
                      ⚌
                    </button>
                    <button
                      onClick={() => setPreviewMode('preview-only')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        previewMode === 'preview-only' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Preview Only"
                    >
                      👁️
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowStylePanel(!showStylePanel)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      showStylePanel ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🎨 Styles
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    💾 Save Page
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Area - Split View */}
          <div className="flex-1 flex">
            {/* Builder Canvas */}
            {(previewMode === 'builder-only' || previewMode === 'split') && (
              <div className={`${previewMode === 'split' ? 'w-1/2' : 'w-full'} overflow-auto bg-gray-100 p-8 border-r border-gray-200`}>
                <div className={`bg-white shadow-lg ${viewportClasses[viewMode]} transition-all duration-300`}>
                  <CanvasArea
                    blocks={blocks}
                    selectedBlock={selectedBlock}
                    onSelectBlock={setSelectedBlock}
                    onDuplicateBlock={duplicateBlock}
                    onDeleteBlock={deleteBlock}
                    onMoveUp={moveBlockUp}
                    onMoveDown={moveBlockDown}
                    onUpdateBlock={updateBlock}
                    isPreview={isPreview}
                    viewMode={viewMode}
                  />
                </div>
              </div>
            )}

            {/* Live Preview */}
            {(previewMode === 'preview-only' || previewMode === 'split') && (
              <div className={`${previewMode === 'split' ? 'w-1/2' : 'w-full'} overflow-hidden`}>
                <LivePreview
                  blocks={blocks}
                  viewMode={viewMode}
                  selectedBlock={selectedBlock}
                  className="h-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Style Panel */}
        {showStylePanel && selectedBlock && (
          <StylePanel
            block={blocks.find(b => b.id === selectedBlock)}
            viewMode={viewMode}
            onUpdateBlock={(updates) => updateBlock(selectedBlock, updates)}
            onClose={() => setShowStylePanel(false)}
          />
        )}

        <DragOverlay>
          {activeBlock ? (
            <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-blue-500 opacity-90">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {BLOCK_REGISTRY[activeBlock.blockType as keyof typeof BLOCK_REGISTRY]?.name.split(' ')[0] || '📄'}
                </span>
                <div>
                  <div className="font-semibold text-gray-900">
                    {BLOCK_REGISTRY[activeBlock.blockType as keyof typeof BLOCK_REGISTRY]?.name || 'Block'}
                  </div>
                  <div className="text-sm text-gray-500">Drag to position</div>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

// Block Library Component
const BlockLibrary: React.FC<{ onAddBlock: (blockType: string) => void }> = ({ onAddBlock }) => {
  const categories = ['Layout', 'Content', 'Media', 'Business', 'Forms', 'Marketing', 'Social Proof', 'Advanced']

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const blocksInCategory = Object.entries(BLOCK_REGISTRY).filter(
          ([_, config]) => config.category === category
        )

        if (blocksInCategory.length === 0) return null

        return (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{category}</h3>
            <div className="grid grid-cols-1 gap-2">
              {blocksInCategory.map(([blockType, config]) => (
                <LibraryBlock
                  key={blockType}
                  blockType={blockType}
                  config={config}
                  onAdd={onAddBlock}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Library Block Component
const LibraryBlock: React.FC<{
  blockType: string
  config: any
  onAdd: (blockType: string) => void
}> = ({ blockType, config, onAdd }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `library-${blockType}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-colors group"
      onClick={() => onAdd(blockType)}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{config.name.split(' ')[0]}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
            {config.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {config.description}
          </div>
        </div>
      </div>
    </div>
  )
}

// Canvas Area Component
const CanvasArea: React.FC<{
  blocks: any[]
  selectedBlock: string | null
  onSelectBlock: (id: string | null) => void
  onDuplicateBlock: (id: string) => void
  onDeleteBlock: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onUpdateBlock: (id: string, updates: any) => void
  isPreview: boolean
  viewMode: 'desktop' | 'tablet' | 'mobile'
}> = ({ 
  blocks, 
  selectedBlock, 
  onSelectBlock, 
  onDuplicateBlock, 
  onDeleteBlock, 
  onMoveUp, 
  onMoveDown, 
  onUpdateBlock,
  isPreview,
  viewMode
}) => {
  if (blocks.length === 0) {
    return (
      <div 
        id="canvas"
        className="min-h-96 flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 m-8 rounded-lg"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Start Building Your Page</h3>
          <p className="text-gray-500">Drag blocks from the sidebar to begin creating your page</p>
        </div>
      </div>
    )
  }

  return (
    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
      <div className="min-h-screen">
        {blocks.map((block) => (
          <SortableBlock
            key={block.id}
            block={block}
            isSelected={selectedBlock === block.id}
            onSelect={onSelectBlock}
            onDuplicate={onDuplicateBlock}
            onDelete={onDeleteBlock}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onUpdateBlock={onUpdateBlock}
            isPreview={isPreview}
            viewMode={viewMode}
          />
        ))}
      </div>
    </SortableContext>
  )
}

// Sortable Block Wrapper
const SortableBlock: React.FC<{
  block: any
  isSelected: boolean
  onSelect: (id: string | null) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onUpdateBlock: (id: string, updates: any) => void
  isPreview: boolean
  viewMode: 'desktop' | 'tablet' | 'mobile'
}> = ({ block, isSelected, onSelect, onDuplicate, onDelete, onMoveUp, onMoveDown, onUpdateBlock, isPreview, viewMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-50' : ''} ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={() => onSelect(block.id)}
    >
      {/* Block Controls */}
      {!isPreview && (
        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 z-10 ${
          isSelected || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity`}>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-lg px-2 py-1 space-x-1">
            <div
              {...attributes}
              {...listeners}
              className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            
            <button
              onClick={(e) => { e.stopPropagation(); onMoveUp(block.id) }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Move up"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); onMoveDown(block.id) }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Move down"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className="w-px h-4 bg-gray-300" />
            
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(block.id) }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Duplicate"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(block.id) }}
              className="p-1 hover:bg-red-100 hover:text-red-600 rounded"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Block Content */}
      <div className={getResponsiveClasses(block, viewMode)}>
        <BlockRenderer
          blocks={[block]}
          isPreview={isPreview}
          isDragging={isDragging}
        />
      </div>
    </div>
  )
}

// Helper function to get default data for new blocks
const getDefaultBlockData = (blockType: string) => {
  const defaults: { [key: string]: any } = {
    hero: {
      headline: 'Welcome to Our Business',
      subheadline: 'Experience exceptional service and quality that exceeds your expectations.',
      ctaButtons: [{ text: 'Get Started', link: '/contact', style: 'primary' }]
    },
    text: {
      content: 'Add your text content here. You can format it with rich text options.'
    },
    services: {
      title: 'Our Services',
      services: [
        { icon: 'scissors', title: 'Service 1', description: 'Description of service 1' },
        { icon: 'target', title: 'Service 2', description: 'Description of service 2' }
      ]
    },
    gallery: {
      images: []
    },
    contact: {
      title: 'Get In Touch',
      fields: [
        { type: 'text', label: 'Name', required: true },
        { type: 'email', label: 'Email', required: true },
        { type: 'textarea', label: 'Message', required: true }
      ]
    },
    cta: {
      headline: 'Ready to Get Started?',
      description: 'Join thousands of satisfied customers who trust us.',
      button: { text: 'Get Started', link: '/contact', style: 'primary' }
    }
  }

  return defaults[blockType] || {}
}

// Helper function to get responsive classes for blocks
const getResponsiveClasses = (block: any, viewMode: 'desktop' | 'tablet' | 'mobile') => {
  const styles = block.styles || {}
  const responsive = styles.responsive || {}
  
  let classes = ''
  
  // Base responsive hiding/showing classes
  if (responsive[viewMode]?.hidden) {
    classes += 'hidden '
  }
  
  // Responsive margin and padding
  const spacing = responsive[viewMode]?.spacing
  if (spacing?.margin) {
    classes += `m-${spacing.margin} `
  }
  if (spacing?.padding) {
    classes += `p-${spacing.padding} `
  }
  
  // Responsive width
  const layout = responsive[viewMode]?.layout
  if (layout?.width) {
    switch (layout.width) {
      case 'full':
        classes += 'w-full '
        break
      case 'container':
        classes += 'container mx-auto '
        break
      case 'half':
        classes += 'w-1/2 '
        break
      case 'third':
        classes += 'w-1/3 '
        break
    }
  }
  
  // Responsive text alignment
  if (layout?.textAlign) {
    classes += `text-${layout.textAlign} `
  }
  
  return classes.trim()
}

// Style Panel Component
const StylePanel: React.FC<{
  block: any
  viewMode: 'desktop' | 'tablet' | 'mobile'
  onUpdateBlock: (updates: any) => void
  onClose: () => void
}> = ({ block, viewMode, onUpdateBlock, onClose }) => {
  if (!block) return null
  
  const currentStyles = block.styles || {}
  const currentResponsive = currentStyles.responsive || {}
  const currentViewStyles = currentResponsive[viewMode] || {}
  
  const updateResponsiveStyle = (property: string, value: any) => {
    const updatedStyles = {
      ...currentStyles,
      responsive: {
        ...currentResponsive,
        [viewMode]: {
          ...currentViewStyles,
          [property]: value
        }
      }
    }
    onUpdateBlock({ styles: updatedStyles })
  }

  const updateNestedStyle = (category: string, property: string, value: any) => {
    const currentCategory = currentViewStyles[category] || {}
    updateResponsiveStyle(category, {
      ...currentCategory,
      [property]: value
    })
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">🎨 Block Styles</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          Editing for: <span className="font-medium capitalize">{viewMode}</span>
        </div>
        
        <div className="text-xs text-gray-500 mb-4">
          Block: {BLOCK_REGISTRY[block.blockType as keyof typeof BLOCK_REGISTRY]?.name || block.blockType}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">👁️ Quick Controls</h4>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="hidden"
              checked={currentViewStyles.hidden || false}
              onChange={(e) => updateResponsiveStyle('hidden', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="hidden" className="text-sm text-gray-600">
              Hide on {viewMode}
            </label>
          </div>
        </div>

        {/* Advanced Style Controls */}
        <AdvancedStyleControls
          block={block}
          viewMode={viewMode}
          onUpdateBlock={onUpdateBlock}
        />

        {/* Custom CSS */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">⚡ Custom CSS Classes</h4>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Additional Classes</label>
            <textarea
              value={currentViewStyles.customClasses || ''}
              onChange={(e) => updateResponsiveStyle('customClasses', e.target.value)}
              placeholder="Enter custom Tailwind classes..."
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="text-xs text-gray-400 mt-1">
              Use Tailwind utility classes for advanced styling
            </div>
          </div>
        </div>
      </div>

      {/* Preview of Applied Styles */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 mb-2">Applied Classes Preview:</div>
        <div className="bg-white p-2 rounded border text-xs font-mono text-gray-700 max-h-20 overflow-y-auto">
          {getResponsiveClasses(block, viewMode) || 'No styles applied'}
        </div>
      </div>
    </div>
  )
}

export default DragDropPageBuilder