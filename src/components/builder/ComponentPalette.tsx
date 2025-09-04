// 🎯 Component Palette - Drag & Drop Component Library
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ComponentPaletteProps {
  components: any[]
  onDragStart: () => void
  className?: string
}

interface ComponentCategory {
  name: string
  components: any[]
  isOpen: boolean
}

export function ComponentPalette({
  components,
  onDragStart,
  className
}: ComponentPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<ComponentCategory[]>(() => {
    // Group components by category
    const categoryMap = new Map<string, any[]>()

    components.forEach(component => {
      const category = component.category || 'other'
      if (!categoryMap.has(category)) {
        categoryMap.set(category, [])
      }
      categoryMap.get(category)!.push(component)
    })

    return Array.from(categoryMap.entries()).map(([name, comps]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      components: comps,
      isOpen: true
    }))
  })

  // 🎯 Filter components based on search
  const filteredCategories = categories.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.components.length > 0)

  // 🎯 Handle drag start
  const handleDragStart = (e: React.DragEvent, component: any) => {
    e.dataTransfer.setData('component-id', component.id)
    e.dataTransfer.effectAllowed = 'copy'
    onDragStart()
  }

  // 🎯 Toggle category
  const toggleCategory = (categoryName: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.name === categoryName
          ? { ...cat, isOpen: !cat.isOpen }
          : cat
      )
    )
  }

  return (
    <div className={cn("w-80 bg-white border-r border-gray-200 flex flex-col", className)}>
      {/* 🎯 Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Components</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 🎯 Component List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredCategories.map((category) => (
            <motion.div
              key={category.name}
              initial={{ height: 'auto' }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="border-b border-gray-100 last:border-b-0"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{category.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {category.components.length}
                  </span>
                  {category.isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Category Components */}
              <AnimatePresence>
                {category.isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 space-y-2">
                      {category.components.map((component) => (
                        <ComponentItem
                          key={component.id}
                          component={component}
                          onDragStart={(e) => handleDragStart(e, component)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCategories.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-medium mb-1">No components found</div>
            <div className="text-sm">Try adjusting your search terms</div>
          </div>
        )}
      </div>
    </div>
  )
}

// 🎯 Individual Component Item
interface ComponentItemProps {
  component: any
  onDragStart: (e: React.DragEvent) => void
}

function ComponentItem({ component, onDragStart }: ComponentItemProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <motion.div
      className={cn(
        "group relative p-3 bg-white border border-gray-200 rounded-lg cursor-move transition-all duration-200",
        "hover:border-blue-300 hover:shadow-sm",
        isDragging && "opacity-50 scale-95"
      )}
      draggable
      onDragStart={(e) => {
        setIsDragging(true)
        onDragStart(e)
      }}
      onDragEnd={() => setIsDragging(false)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-0.5">
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
        </div>
      </div>

      {/* Component Icon */}
      <div className="flex items-center gap-3">
        <div className="text-2xl">{component.icon}</div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {component.name}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {component.category}
          </div>
        </div>
      </div>

      {/* Component Preview */}
      <div className="mt-3 h-16 bg-gray-50 rounded border overflow-hidden">
        <ComponentPreview component={component} />
      </div>

      {/* Hover Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        Drag to canvas
      </div>
    </motion.div>
  )
}

// 🎯 Component Preview
interface ComponentPreviewProps {
  component: any
}

function ComponentPreview({ component }: ComponentPreviewProps) {
  switch (component.id) {
    case 'hero':
      return (
        <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 p-2">
          <div className="h-2 bg-white bg-opacity-30 rounded mb-1" />
          <div className="h-1 bg-white bg-opacity-20 rounded mb-1 w-3/4" />
          <div className="h-3 bg-white bg-opacity-40 rounded w-1/2" />
        </div>
      )

    case 'services-grid':
      return (
        <div className="h-full p-2">
          <div className="grid grid-cols-3 gap-1 h-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      )

    case 'testimonial-carousel':
      return (
        <div className="h-full p-2">
          <div className="flex gap-1 mb-1">
            <div className="w-4 h-4 bg-gray-200 rounded-full" />
            <div className="flex-1 h-2 bg-gray-200 rounded" />
          </div>
          <div className="h-1 bg-gray-300 rounded w-full" />
          <div className="h-1 bg-gray-300 rounded w-4/5 mt-1" />
        </div>
      )

    case 'contact-form':
      return (
        <div className="h-full p-2 space-y-1">
          <div className="h-2 bg-gray-200 rounded" />
          <div className="h-2 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-3 bg-blue-200 rounded" />
        </div>
      )

    case 'pricing-cards':
      return (
        <div className="h-full p-2">
          <div className="grid grid-cols-3 gap-1 h-full">
            {[1, 2, 3].map(i => (
              <div key={i} className={cn(
                "rounded",
                i === 2 ? "bg-blue-200" : "bg-gray-200"
              )} />
            ))}
          </div>
        </div>
      )

    default:
      return (
        <div className="h-full flex items-center justify-center text-gray-400">
          <span className="text-xs">{component.icon}</span>
        </div>
      )
  }
}
