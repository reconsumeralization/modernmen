// 🎯 AMAZING DND Builder Canvas - The Heart of the Builder
import React, { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuilder } from '../../lib/builder-engine'
import { BuilderComponent } from './BuilderComponent'
import { BuilderToolbar } from './BuilderToolbar'
import { ComponentPalette } from './ComponentPalette'
import { StylePanel } from './StylePanel'
import { InteractionPanel } from './InteractionPanel'
import { cn } from '../../lib/utils'
import { safeGet, safeMap, safeFilter, isValidIndex, safeLength } from '../../lib/safe-access'
import { errorMonitor, ErrorCategory, ErrorSeverity } from '../../lib/error-monitoring'
import { useErrorMonitoring } from '../../lib/error-monitoring'

interface BuilderCanvasProps {
  pageId?: string
  className?: string
  onSave?: (pageId: string) => void
  onExport?: (code: string) => void
}

export function BuilderCanvas({
  pageId,
  className,
  onSave,
  onExport
}: BuilderCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [selectedPanel, setSelectedPanel] = useState<'styles' | 'interactions' | null>(null)

  // Error monitoring
  const { addBreadcrumb, captureError } = useErrorMonitoring()

  const builderHook = useBuilder(pageId)
  const {
    currentPage,
    selectedComponent,
    isDragging,
    setSelectedComponent,
    setIsDragging,
    addComponent,
    updateComponent,
    removeComponent,
    undo,
    redo,
    savePage,
    exportPage,
    availableComponents
  } = builderHook || {}

  // Safe access to current page components
  const pageComponents = safeGet(currentPage, 'components', [])
  const componentsLength = safeLength(pageComponents)

  // 🎯 Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedComponent(null)
      setSelectedPanel(null)
    }
  }, [setSelectedComponent])

  // 🎯 Handle component drop
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    try {
      addBreadcrumb('Component drop initiated', 'user_action', {
        clientX: e.clientX,
        clientY: e.clientY
      })

      e.preventDefault()
      setIsDragging(false)

      const componentId = e.dataTransfer.getData('component-id')
      if (!componentId) {
        await captureError(
          new Error('Component drop failed: No component ID in data transfer'),
          {
            component: 'BuilderCanvas',
            action: 'handleDrop',
            metadata: { dataTransferKeys: Array.from(e.dataTransfer.items).map(item => item.type) }
          },
          ['builder', 'drag-drop', 'validation']
        )
        return
      }

      if (!canvasRef.current) {
        await captureError(
          new Error('Component drop failed: Canvas ref not available'),
          {
            component: 'BuilderCanvas',
            action: 'handleDrop',
            metadata: { componentId }
          },
          ['builder', 'drag-drop', 'ref']
        )
        return
      }

      // Validate available components before adding
      if (availableComponents && Array.isArray(availableComponents)) {
        const componentExists = safeFind(availableComponents, (comp: any) => comp.id === componentId)
        if (!componentExists) {
          await captureError(
            new Error(`Component drop failed: Component ${componentId} not found in available components`),
            {
              component: 'BuilderCanvas',
              action: 'handleDrop',
              metadata: { componentId, availableCount: availableComponents.length }
            },
            ['builder', 'drag-drop', 'validation']
          )
          return
        }
      }

      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - panOffset.x) / zoom
      const y = (e.clientY - rect.top - panOffset.y) / zoom

      // Validate coordinates
      if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
        await captureError(
          new Error('Component drop failed: Invalid drop coordinates'),
          {
            component: 'BuilderCanvas',
            action: 'handleDrop',
            metadata: { x, y, zoom, panOffset, clientX: e.clientX, clientY: e.clientY, rect }
          },
          ['builder', 'drag-drop', 'coordinates']
        )
        return
      }

      if (addComponent) {
        await addComponent(componentId, { x, y })
        addBreadcrumb('Component added successfully', 'user_action', {
          componentId,
          position: { x, y }
        })
      } else {
        await captureError(
          new Error('Component drop failed: addComponent function not available'),
          {
            component: 'BuilderCanvas',
            action: 'handleDrop',
            metadata: { componentId, position: { x, y } }
          },
          ['builder', 'drag-drop', 'function']
        )
      }
    } catch (error) {
      await captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          component: 'BuilderCanvas',
          action: 'handleDrop',
          metadata: {
            componentId: e.dataTransfer.getData('component-id'),
            clientX: e.clientX,
            clientY: e.clientY
          }
        },
        ['builder', 'drag-drop', 'exception']
      )
    }
  }, [addComponent, panOffset, zoom, setIsDragging, availableComponents, addBreadcrumb, captureError])

  // 🎯 Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // 🎯 Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Left mouse
      setIsPanning(true)
      e.preventDefault()
    }
  }, [])

  // 🎯 Handle mouse move for panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && canvasRef.current) {
      setPanOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }))
    }
  }, [isPanning])

  // 🎯 Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // 🎯 Handle zoom
  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)))
  }, [])

  // 🎯 Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      try {
        addBreadcrumb('Keyboard event', 'user_action', {
          key: e.key,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          selectedComponent
        })

        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case 'z':
              if (e.shiftKey) {
                if (redo) {
                  redo()
                  addBreadcrumb('Redo executed', 'user_action')
                } else {
                  await captureError(
                    new Error('Redo function not available'),
                    { component: 'BuilderCanvas', action: 'keyboard_redo' },
                    ['builder', 'keyboard', 'redo']
                  )
                }
              } else {
                if (undo) {
                  undo()
                  addBreadcrumb('Undo executed', 'user_action')
                } else {
                  await captureError(
                    new Error('Undo function not available'),
                    { component: 'BuilderCanvas', action: 'keyboard_undo' },
                    ['builder', 'keyboard', 'undo']
                  )
                }
              }
              e.preventDefault()
              break
            case 's':
              if (savePage) {
                savePage()
                onSave?.(currentPage?.id || '')
                addBreadcrumb('Page saved via keyboard', 'user_action', { pageId: currentPage?.id })
              } else {
                await captureError(
                  new Error('Save function not available'),
                  { component: 'BuilderCanvas', action: 'keyboard_save' },
                  ['builder', 'keyboard', 'save']
                )
              }
              e.preventDefault()
              break
            case 'e':
              if (e.shiftKey) {
                if (exportPage) {
                  const code = exportPage()
                  onExport?.(code || '')
                  addBreadcrumb('Page exported via keyboard', 'user_action')
                } else {
                  await captureError(
                    new Error('Export function not available'),
                    { component: 'BuilderCanvas', action: 'keyboard_export' },
                    ['builder', 'keyboard', 'export']
                  )
                }
              }
              e.preventDefault()
              break
          }
        }

        if (e.key === 'Delete' && selectedComponent) {
          // Validate selected component exists in page components
          if (pageComponents && Array.isArray(pageComponents)) {
            const componentExists = safeFind(pageComponents, (comp: any) => comp.id === selectedComponent)
            if (componentExists) {
              if (removeComponent) {
                removeComponent(selectedComponent)
                setSelectedComponent(null)
                addBreadcrumb('Component deleted via keyboard', 'user_action', { componentId: selectedComponent })
              } else {
                await captureError(
                  new Error('Remove component function not available'),
                  { component: 'BuilderCanvas', action: 'keyboard_delete' },
                  ['builder', 'keyboard', 'delete']
                )
              }
            } else {
              await captureError(
                new Error(`Cannot delete component: ${selectedComponent} not found in page components`),
                {
                  component: 'BuilderCanvas',
                  action: 'keyboard_delete',
                  metadata: { selectedComponent, componentsCount: componentsLength }
                },
                ['builder', 'keyboard', 'delete', 'validation']
              )
              setSelectedComponent(null)
            }
          }
        }

        if (e.key === 'Escape') {
          setSelectedComponent(null)
          setSelectedPanel(null)
          addBreadcrumb('Escape pressed - cleared selection', 'user_action')
        }
      } catch (error) {
        await captureError(
          error instanceof Error ? error : new Error(String(error)),
          {
            component: 'BuilderCanvas',
            action: 'keyboard_handler',
            metadata: {
              key: e.key,
              ctrlKey: e.ctrlKey,
              shiftKey: e.shiftKey,
              selectedComponent
            }
          },
          ['builder', 'keyboard', 'exception']
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, savePage, exportPage, removeComponent, selectedComponent, setSelectedComponent, onSave, onExport, currentPage, pageComponents, componentsLength, addBreadcrumb, captureError])

  // 🎯 Handle wheel for zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      handleZoom(delta)
    }
  }, [handleZoom])

  return (
    <div className={cn("flex h-screen bg-gray-50", className)}>
      {/* 🎯 Component Palette */}
      <ComponentPalette
        components={availableComponents}
        onDragStart={() => setIsDragging(true)}
      />

      {/* 🎯 Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* 🎯 Toolbar */}
        <BuilderToolbar
          zoom={zoom}
          onZoomChange={setZoom}
          showGrid={showGrid}
          onShowGridChange={setShowGrid}
          snapToGrid={snapToGrid}
          onSnapToGridChange={setSnapToGrid}
          onUndo={undo}
          onRedo={redo}
          onSave={() => {
            savePage()
            onSave?.(currentPage?.id || '')
          }}
          onExport={() => {
            const code = exportPage()
            onExport?.(code || '')
          }}
          canUndo={true} // TODO: Implement undo/redo state
          canRedo={true}
        />

        {/* 🎯 Canvas */}
        <div
          ref={canvasRef}
          className={cn(
            "flex-1 relative overflow-hidden bg-white cursor-crosshair",
            isDragging && "cursor-grabbing",
            isPanning && "cursor-grabbing"
          )}
          onClick={handleCanvasClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* 🎯 Grid Background */}
          {showGrid && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                transformOrigin: '0 0'
              }}
            />
          )}

          {/* 🎯 Canvas Content */}
          <motion.div
            className="absolute inset-0"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            <AnimatePresence>
              {safeMap(pageComponents, (component: any, index: number) => {
                try {
                  // Validate component has required properties
                  if (!component || !component.id) {
                    captureError(
                      new Error(`Invalid component at index ${index}: missing id`),
                      {
                        component: 'BuilderCanvas',
                        action: 'component_render',
                        metadata: { index, component }
                      },
                      ['builder', 'render', 'validation']
                    )
                    return null
                  }

                  return (
                    <BuilderComponent
                      key={component.id}
                      component={component}
                      isSelected={selectedComponent === component.id}
                      onSelect={() => {
                        try {
                          setSelectedComponent(component.id)
                          addBreadcrumb('Component selected', 'user_action', { componentId: component.id })
                        } catch (error) {
                          captureError(
                            error instanceof Error ? error : new Error(String(error)),
                            {
                              component: 'BuilderCanvas',
                              action: 'component_select',
                              metadata: { componentId: component.id }
                            },
                            ['builder', 'render', 'selection']
                          )
                        }
                      }}
                      onUpdate={(updates: any) => {
                        try {
                          if (updateComponent) {
                            updateComponent(component.id, updates)
                            addBreadcrumb('Component updated', 'user_action', {
                              componentId: component.id,
                              updates: Object.keys(updates)
                            })
                          } else {
                            throw new Error('updateComponent function not available')
                          }
                        } catch (error) {
                          captureError(
                            error instanceof Error ? error : new Error(String(error)),
                            {
                              component: 'BuilderCanvas',
                              action: 'component_update',
                              metadata: { componentId: component.id, updates }
                            },
                            ['builder', 'render', 'update']
                          )
                        }
                      }}
                      onDelete={() => {
                        try {
                          if (removeComponent) {
                            removeComponent(component.id)
                            setSelectedComponent(null)
                            addBreadcrumb('Component deleted', 'user_action', { componentId: component.id })
                          } else {
                            throw new Error('removeComponent function not available')
                          }
                        } catch (error) {
                          captureError(
                            error instanceof Error ? error : new Error(String(error)),
                            {
                              component: 'BuilderCanvas',
                              action: 'component_delete',
                              metadata: { componentId: component.id }
                            },
                            ['builder', 'render', 'delete']
                          )
                        }
                      }}
                      snapToGrid={snapToGrid}
                      zoom={zoom}
                    />
                  )
                } catch (error) {
                  captureError(
                    error instanceof Error ? error : new Error(String(error)),
                    {
                      component: 'BuilderCanvas',
                      action: 'component_render',
                      metadata: { index, componentId: component?.id }
                    },
                    ['builder', 'render', 'exception']
                  )
                  return null
                }
              })}
            </AnimatePresence>
          </motion.div>

          {/* 🎯 Selection Outline */}
          <AnimatePresence>
            {selectedComponent && (
              <motion.div
                className="absolute border-2 border-blue-500 pointer-events-none"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                  transformOrigin: '0 0'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Selection handles will be rendered by BuilderComponent */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🎯 Side Panels */}
      <AnimatePresence>
        {selectedPanel === 'styles' && selectedComponent && (
          <StylePanel
            componentId={selectedComponent}
            onClose={() => setSelectedPanel(null)}
          />
        )}

        {selectedPanel === 'interactions' && selectedComponent && (
          <InteractionPanel
            componentId={selectedComponent}
            onClose={() => setSelectedPanel(null)}
          />
        )}
      </AnimatePresence>

      {/* 🎯 Panel Toggle Buttons */}
      <div className="absolute top-20 right-4 flex flex-col gap-2">
        <motion.button
          className={cn(
            "p-2 rounded-lg shadow-lg transition-colors",
            selectedPanel === 'styles'
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          )}
          onClick={() => setSelectedPanel(selectedPanel === 'styles' ? null : 'styles')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!selectedComponent}
        >
          🎨
        </motion.button>

        <motion.button
          className={cn(
            "p-2 rounded-lg shadow-lg transition-colors",
            selectedPanel === 'interactions'
              ? "bg-purple-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          )}
          onClick={() => setSelectedPanel(selectedPanel === 'interactions' ? null : 'interactions')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!selectedComponent}
        >
          ⚡
        </motion.button>
      </div>

      {/* 🎯 Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <motion.button
          className="p-2 bg-white rounded-lg shadow-lg text-gray-600 hover:bg-gray-50"
          onClick={() => handleZoom(0.1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          +
        </motion.button>

        <div className="px-2 py-1 bg-white rounded-lg shadow-lg text-sm text-gray-600">
          {Math.round(zoom * 100)}%
        </div>

        <motion.button
          className="p-2 bg-white rounded-lg shadow-lg text-gray-600 hover:bg-gray-50"
          onClick={() => handleZoom(-0.1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          -
        </motion.button>
      </div>
    </div>
  )
}
