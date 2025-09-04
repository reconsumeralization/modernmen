// 🎯 Builder Toolbar - Professional Controls for Amazing Building
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Undo2 as Undo,
  Redo2 as Redo,
  Save,
  Download,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  MousePointer,
  Move,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  Layers,
  Palette,
  Type,
  Square,
  Circle,
  Image,
  Play,
  Pause,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface BuilderToolbarProps {
  zoom: number
  onZoomChange: (zoom: number) => void
  showGrid: boolean
  onShowGridChange: (show: boolean) => void
  snapToGrid: boolean
  onSnapToGridChange: (snap: boolean) => void
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onExport: () => void
  canUndo: boolean
  canRedo: boolean
  isPreviewMode?: boolean
  onPreviewToggle?: () => void
  selectedTool?: 'select' | 'move' | 'text' | 'shape' | 'image'
  onToolChange?: (tool: string) => void
  viewportMode?: 'desktop' | 'tablet' | 'mobile'
  onViewportChange?: (mode: string) => void
  className?: string
}

export function BuilderToolbar({
  zoom,
  onZoomChange,
  showGrid,
  onShowGridChange,
  snapToGrid,
  onSnapToGridChange,
  onUndo,
  onRedo,
  onSave,
  onExport,
  canUndo,
  canRedo,
  isPreviewMode = false,
  onPreviewToggle,
  selectedTool = 'select',
  onToolChange,
  viewportMode = 'desktop',
  onViewportChange,
  className
}: BuilderToolbarProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  const handleSave = async () => {
    setIsAutoSaving(true)
    await onSave()
    setTimeout(() => setIsAutoSaving(false), 1000)
  }

  const viewportIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  }

  const ViewportIcon = viewportIcons[viewportMode as keyof typeof viewportIcons]

  return (
    <div className={cn(
      "h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm",
      "backdrop-blur-sm bg-white/95",
      className
    )}>
      {/* 🎯 Left Section - Main Tools */}
      <div className="flex items-center gap-2">
        {/* Tool Group */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <ToolbarButton
            icon={<MousePointer className="w-4 h-4" />}
            tooltip="Select Tool (V)"
            active={selectedTool === 'select'}
            onClick={() => onToolChange?.('select')}
            size="sm"
          />

          <ToolbarButton
            icon={<Move className="w-4 h-4" />}
            tooltip="Move Tool (M)"
            active={selectedTool === 'move'}
            onClick={() => onToolChange?.('move')}
            size="sm"
          />

          <ToolbarButton
            icon={<Type className="w-4 h-4" />}
            tooltip="Text Tool (T)"
            active={selectedTool === 'text'}
            onClick={() => onToolChange?.('text')}
            size="sm"
          />

          <ToolbarButton
            icon={<Square className="w-4 h-4" />}
            tooltip="Shape Tool (S)"
            active={selectedTool === 'shape'}
            onClick={() => onToolChange?.('shape')}
            size="sm"
          />

          <ToolbarButton
            icon={<Image className="w-4 h-4" />}
            tooltip="Image Tool (I)"
            active={selectedTool === 'image'}
            onClick={() => onToolChange?.('image')}
            size="sm"
          />
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* History Controls */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={<Undo className="w-4 h-4" />}
            tooltip="Undo (Ctrl+Z)"
            onClick={onUndo}
            disabled={!canUndo}
            size="sm"
          />

          <ToolbarButton
            icon={<Redo className="w-4 h-4" />}
            tooltip="Redo (Ctrl+Y)"
            onClick={onRedo}
            disabled={!canRedo}
            size="sm"
          />
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* File Actions */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={
              isAutoSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Save className="w-4 h-4" />
                </motion.div>
              ) : (
                <Save className="w-4 h-4" />
              )
            }
            tooltip={isAutoSaving ? "Saving..." : "Save (Ctrl+S)"}
            onClick={handleSave}
            variant="primary"
            size="sm"
          />

          <ToolbarButton
            icon={<Download className="w-4 h-4" />}
            tooltip="Export (Ctrl+E)"
            onClick={onExport}
            size="sm"
          />
        </div>
      </div>

      {/* 🎯 Center Section - Page Info & Status */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Modern Men Landing Page</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Auto-save:</span>
            <span className="text-sm font-medium text-green-600">On</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-600">Status:</span>
            <span className="text-sm font-medium text-blue-600">Draft</span>
          </div>
        </div>
      </div>

      {/* 🎯 Right Section - View Controls */}
      <div className="flex items-center gap-2">
        {/* Viewport Controls */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <ToolbarButton
            icon={<Monitor className="w-4 h-4" />}
            tooltip="Desktop View"
            active={viewportMode === 'desktop'}
            onClick={() => onViewportChange?.('desktop')}
            size="sm"
          />

          <ToolbarButton
            icon={<Tablet className="w-4 h-4" />}
            tooltip="Tablet View"
            active={viewportMode === 'tablet'}
            onClick={() => onViewportChange?.('tablet')}
            size="sm"
          />

          <ToolbarButton
            icon={<Smartphone className="w-4 h-4" />}
            tooltip="Mobile View"
            active={viewportMode === 'mobile'}
            onClick={() => onViewportChange?.('mobile')}
            size="sm"
          />
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* View Options */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={<Grid3X3 className="w-4 h-4" />}
            tooltip="Toggle Grid (G)"
            active={showGrid}
            onClick={() => onShowGridChange(!showGrid)}
            size="sm"
          />

          <ToolbarButton
            icon={<div className="w-3 h-3 border border-current rounded-sm" />}
            tooltip="Snap to Grid"
            active={snapToGrid}
            onClick={() => onSnapToGridChange(!snapToGrid)}
            size="sm"
          />

          <ToolbarButton
            icon={<Layers className="w-4 h-4" />}
            tooltip="Show Layers"
            size="sm"
          />
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={<ZoomOut className="w-4 h-4" />}
            tooltip="Zoom Out (-)"
            onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}
            size="sm"
          />

          <motion.div 
            className="px-3 py-1 bg-gray-100 rounded text-sm font-medium min-w-[60px] text-center cursor-pointer hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onZoomChange(1)}
          >
            {Math.round(zoom * 100)}%
          </motion.div>

          <ToolbarButton
            icon={<ZoomIn className="w-4 h-4" />}
            tooltip="Zoom In (+)"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
            size="sm"
          />
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Preview & Settings */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            tooltip={isPreviewMode ? "Exit Preview (P)" : "Preview Mode (P)"}
            onClick={onPreviewToggle}
            variant={isPreviewMode ? "primary" : "default"}
            size="sm"
          />

          <ToolbarButton
            icon={<RotateCcw className="w-4 h-4" />}
            tooltip="Reset View (0)"
            onClick={() => {
              onZoomChange(1)
              onShowGridChange(true)
              onSnapToGridChange(true)
            }}
            size="sm"
          />

          <div className="relative">
            <ToolbarButton
              icon={<Settings className="w-4 h-4" />}
              tooltip="Settings"
              active={showSettings}
              onClick={() => setShowSettings(!showSettings)}
              size="sm"
            />

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                >
                  <h3 className="font-medium text-gray-900 mb-3">Builder Settings</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Auto-save</span>
                      <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Show rulers</span>
                      <div className="w-8 h-4 bg-gray-300 rounded-full relative">
                        <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Smart guides</span>
                      <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// 🎯 Enhanced Toolbar Button Component
interface ToolbarButtonProps {
  icon: React.ReactNode
  tooltip: string
  active?: boolean
  disabled?: boolean
  variant?: 'default' | 'primary'
  size?: 'sm' | 'md'
  onClick?: () => void
  className?: string
}

function ToolbarButton({
  icon,
  tooltip,
  active = false,
  disabled = false,
  variant = 'default',
  size = 'md',
  onClick,
  className
}: ToolbarButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10'
  }

  const variantClasses = {
    default: cn(
      "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
      active && "text-blue-600 bg-blue-50 shadow-sm"
    ),
    primary: cn(
      "text-white bg-blue-600 hover:bg-blue-700 shadow-sm",
      active && "bg-blue-700"
    )
  }

  return (
    <div className="relative group">
      <motion.button
        className={cn(
          "relative flex items-center justify-center rounded-lg transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          sizeClasses[size],
          variantClasses[variant],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        {icon}
      </motion.button>

      {/* Enhanced Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-50"
          >
            {tooltip}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
