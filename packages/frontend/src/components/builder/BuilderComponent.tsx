// 🎯 Builder Component - The Building Blocks of Amazing Pages
import React, { useRef, useState, useCallback } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { BuilderComponentInstance } from '../../lib/builder-engine'
import { systemManager } from '../../config/system.config'
import { cn } from '../../lib/utils'

interface BuilderComponentProps {
  component: BuilderComponentInstance
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<BuilderComponentInstance>) => void
  onDelete: () => void
  snapToGrid: boolean
  zoom: number
}

export function BuilderComponent({
  component,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  snapToGrid,
  zoom
}: BuilderComponentProps) {
  const dragControls = useDragControls()
  const componentRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)

  const config = systemManager.getConfig()
  const componentDef = config.builder.components.find(c => c.id === component.componentId)

  // 🎯 Handle drag start
  const handleDragStart = useCallback((event: any) => {
    setIsDragging(true)
    dragControls.start(event)
  }, [dragControls])

  // 🎯 Handle drag end
  const handleDragEnd = useCallback((event: any, info: any) => {
    setIsDragging(false)

    let newX = component.position.x + info.offset.x / zoom
    let newY = component.position.y + info.offset.y / zoom

    // Snap to grid if enabled
    if (snapToGrid) {
      const gridSize = 20
      newX = Math.round(newX / gridSize) * gridSize
      newY = Math.round(newY / gridSize) * gridSize
    }

    onUpdate({
      position: {
        ...component.position,
        x: newX,
        y: newY
      }
    })
  }, [component.position, zoom, snapToGrid, onUpdate])

  // 🎯 Handle resize start
  const handleResizeStart = useCallback((handle: string) => {
    setIsResizing(true)
    setResizeHandle(handle)
  }, [])

  // 🎯 Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    setResizeHandle(null)
  }, [])

  // 🎯 Render component content based on type
  const renderComponentContent = () => {
    if (!componentDef) {
      return (
        <div className="flex items-center justify-center h-full bg-red-100 border-2 border-red-300 rounded">
          <span className="text-red-600 text-sm">Component not found</span>
        </div>
      )
    }

    // Render based on component type
    switch (component.componentId) {
      case 'hero':
        return (
          <div className="relative h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="relative p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">{component.props.title || 'Hero Title'}</h1>
              <p className="text-xl mb-6">{component.props.subtitle || 'Hero subtitle'}</p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {component.props.ctaText || 'Call to Action'}
              </button>
            </div>
          </div>
        )

      case 'services-grid':
        return (
          <div className="h-full p-6 bg-white rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Services</h2>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 p-4 rounded-lg">
                  <div className="w-full h-24 bg-gray-200 rounded mb-3" />
                  <h3 className="font-semibold mb-2">Service {i}</h3>
                  <p className="text-sm text-gray-600 mb-2">Description of service {i}</p>
                  <span className="text-lg font-bold text-blue-600">$50</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'testimonial-carousel':
        return (
          <div className="h-full p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">What Our Customers Say</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Amazing experience! The staff was professional and the results were fantastic."
              </p>
            </div>
          </div>
        )

      case 'contact-form':
        return (
          <div className="h-full p-6 bg-white rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {component.props.submitText || 'Send Message'}
              </button>
            </form>
          </div>
        )

      case 'pricing-cards':
        return (
          <div className="h-full p-6 bg-white rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-center">Pricing Plans</h2>
            <div className="grid grid-cols-3 gap-6">
              {['Basic', 'Premium', 'VIP'].map((plan, i) => (
                <div key={plan} className={cn(
                  "p-6 rounded-lg border-2 text-center",
                  i === 1 ? "border-blue-500 bg-blue-50" : "border-gray-200"
                )}>
                  <h3 className="text-xl font-bold mb-2">{plan}</h3>
                  <div className="text-3xl font-bold mb-4">
                    ${[29, 49, 99][i]}
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    <li>✓ Feature 1</li>
                    <li>✓ Feature 2</li>
                    <li>✓ Feature 3</li>
                  </ul>
                  <button className={cn(
                    "w-full py-2 px-4 rounded-lg font-semibold transition-colors",
                    i === 1
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  )}>
                    Choose Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded">
            <div className="text-center">
              <div className="text-2xl mb-2">{componentDef.icon}</div>
              <div className="text-sm font-medium text-gray-600">{componentDef.name}</div>
            </div>
          </div>
        )
    }
  }

  // 🎯 Apply styles
  const getComponentStyles = () => {
    const styles: React.CSSProperties = {
      position: 'absolute',
      left: component.position.x,
      top: component.position.y,
      width: component.position.width,
      height: component.position.height,
      zIndex: isSelected ? 10 : 1
    }

    // Apply custom styles
    component.styles.forEach(style => {
      if (style.property && style.value) {
        styles[style.property as any] = style.value
      }
    })

    return styles
  }

  return (
    <>
      {/* 🎯 Main Component */}
      <motion.div
        ref={componentRef}
        style={getComponentStyles()}
        className={cn(
          "rounded-lg overflow-hidden cursor-move",
          isSelected && "ring-2 ring-blue-500 ring-offset-2",
          isDragging && "opacity-50"
        )}
        drag
        dragControls={dragControls}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        {renderComponentContent()}
      </motion.div>

      {/* 🎯 Selection Handles */}
      {isSelected && (
        <>
          {/* Corner resize handles */}
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize -top-1.5 -left-1.5"
            onMouseDown={() => handleResizeStart('nw')}
            onMouseUp={handleResizeEnd}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize -top-1.5 -right-1.5"
            onMouseDown={() => handleResizeStart('ne')}
            onMouseUp={handleResizeEnd}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize -bottom-1.5 -left-1.5"
            onMouseDown={() => handleResizeStart('sw')}
            onMouseUp={handleResizeEnd}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-se-resize -bottom-1.5 -right-1.5"
            onMouseDown={() => handleResizeStart('se')}
            onMouseUp={handleResizeEnd}
          />

          {/* Delete button */}
          <motion.button
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ×
          </motion.button>
        </>
      )}

      {/* 🎯 Interaction Preview */}
      {component.interactions.length > 0 && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
      )}
    </>
  )
}
