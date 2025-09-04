// 📱 AMAZING Device Preview - Professional Multi-Device Testing
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuilder } from '../../lib/builder-engine'
import { systemManager } from '../../config/system.config'
import { cn } from '../../lib/utils'

interface Device {
  id: string
  name: string
  icon: string
  width: number
  height: number
  type: 'mobile' | 'tablet' | 'desktop' | 'custom'
  userAgent?: string
  devicePixelRatio?: number
}

const PRESET_DEVICES: Device[] = [
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    icon: '📱',
    width: 390,
    height: 844,
    type: 'mobile',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    devicePixelRatio: 2
  },
  {
    id: 'iphone-14-pro-max',
    name: 'iPhone 14 Pro Max',
    icon: '📱',
    width: 430,
    height: 932,
    type: 'mobile',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    devicePixelRatio: 3
  },
  {
    id: 'samsung-s23',
    name: 'Samsung S23',
    icon: '📱',
    width: 360,
    height: 780,
    type: 'mobile',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36',
    devicePixelRatio: 3
  },
  {
    id: 'ipad-air',
    name: 'iPad Air',
    icon: '📱',
    width: 820,
    height: 1180,
    type: 'tablet',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    devicePixelRatio: 2
  },
  {
    id: 'ipad-pro',
    name: 'iPad Pro 12.9"',
    icon: '📱',
    width: 1024,
    height: 1366,
    type: 'tablet',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    devicePixelRatio: 2
  },
  {
    id: 'surface-pro',
    name: 'Surface Pro',
    icon: '💻',
    width: 912,
    height: 1368,
    type: 'tablet',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    devicePixelRatio: 2
  },
  {
    id: 'macbook-air-13',
    name: 'MacBook Air 13"',
    icon: '💻',
    width: 1280,
    height: 800,
    type: 'desktop',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    devicePixelRatio: 2
  },
  {
    id: 'macbook-pro-16',
    name: 'MacBook Pro 16"',
    icon: '💻',
    width: 1536,
    height: 960,
    type: 'desktop',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    devicePixelRatio: 2
  },
  {
    id: 'desktop-1080p',
    name: 'Desktop 1080p',
    icon: '🖥️',
    width: 1920,
    height: 1080,
    type: 'desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    devicePixelRatio: 1
  },
  {
    id: 'desktop-4k',
    name: 'Desktop 4K',
    icon: '🖥️',
    width: 2560,
    height: 1440,
    type: 'desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    devicePixelRatio: 1
  }
]

export function DevicePreview() {
  const { currentPage, exportPage } = useBuilder() || {}
  const [selectedDevice, setSelectedDevice] = useState<Device>(PRESET_DEVICES[0])
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Generate preview when page or device changes
  useEffect(() => {
    if (currentPage) {
      generatePreview()
    }
  }, [currentPage, selectedDevice, orientation])

  const generatePreview = async () => {
    if (!currentPage) return

    setIsGenerating(true)
    try {
      // Generate HTML for preview
      const html = exportPage(currentPage.id, 'html', {
		  device: selectedDevice,
		  orientation,
		  responsive: true
	  })

      // Create blob URL for iframe
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      setPreviewUrl(url)

      // Show success feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = `Preview generated for ${selectedDevice.name}!`
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 2000)

    } catch (error) {
      console.error('Failed to generate preview:', error)

      // Show error feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = 'Failed to generate preview. Please try again.'
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeviceChange = (device: Device) => {
    setSelectedDevice(device)
    // Auto-detect orientation based on device type
    if (device.type === 'mobile') {
      setOrientation('portrait')
    } else if (device.type === 'desktop') {
      setOrientation('landscape')
    }
  }

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25))
  }

  const handleZoomReset = () => {
    setZoom(100)
  }

  // Calculate device dimensions with orientation
  const deviceDimensions = orientation === 'portrait'
    ? { width: selectedDevice.width, height: selectedDevice.height }
    : { width: selectedDevice.height, height: selectedDevice.width }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">📱 Device Preview</h2>
            <p className="text-sm text-gray-600">See how your page looks on different devices</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Orientation Toggle */}
            <motion.button
              onClick={toggleOrientation}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Switch to ${orientation === 'portrait' ? 'landscape' : 'portrait'}`}
            >
              {orientation === 'portrait' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4v16M18 4v16M6 4h12M6 20h12" />
                </svg>
              )}
            </motion.button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <motion.button
                onClick={handleZoomOut}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={zoom <= 25}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </motion.button>

              <span className="text-sm font-medium px-2 min-w-[3rem] text-center">
                {zoom}%
              </span>

              <motion.button
                onClick={handleZoomIn}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={zoom >= 200}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.button>

              <motion.button
                onClick={handleZoomReset}
                className="p-1 hover:bg-gray-200 rounded transition-colors ml-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Reset zoom"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>
            </div>

            {/* Refresh Preview */}
            <motion.button
              onClick={generatePreview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                'Refresh'
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Device Selector */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {PRESET_DEVICES.map((device) => (
            <motion.button
              key={device.id}
              onClick={() => handleDeviceChange(device)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all whitespace-nowrap",
                selectedDevice.id === device.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{device.icon}</span>
              <div className="text-left">
                <div className="text-sm font-medium">{device.name}</div>
                <div className="text-xs text-gray-500">
                  {orientation === 'portrait' ? device.width : device.height} × {orientation === 'portrait' ? device.height : device.width}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-6 overflow-auto bg-gray-100">
        <div className="flex justify-center items-start min-h-full">
          {previewUrl ? (
            <motion.div
              className="relative bg-white rounded-lg shadow-xl overflow-hidden"
              style={{
                width: `${(deviceDimensions.width * zoom) / 100}px`,
                height: `${(deviceDimensions.height * zoom) / 100}px`,
                maxWidth: '90vw',
                maxHeight: '70vh'
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Device Frame */}
              <div className="absolute inset-0 bg-gray-900 rounded-lg">
                {/* Screen */}
                <div className="absolute inset-2 bg-white rounded-md overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title={`${selectedDevice.name} Preview`}
                    style={{
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: 'top left',
                      width: `${100 / (zoom / 100)}%`,
                      height: `${100 / (zoom / 100)}%`
                    }}
                  />
                </div>

                {/* Device Info Overlay */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {selectedDevice.name} • {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
                </div>
              </div>

              {/* Loading Overlay */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center text-white">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm">Generating preview...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Preview Available</h3>
              <p className="text-gray-600 mb-6">
                {currentPage ? 'Click "Refresh" to generate a preview' : 'Create a page first to see the preview'}
              </p>
              {currentPage && (
                <button
                  onClick={generatePreview}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Generate Preview
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Device Specs */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <div>
              <span className="font-medium">Device:</span> {selectedDevice.name}
            </div>
            <div>
              <span className="font-medium">Resolution:</span> {deviceDimensions.width} × {deviceDimensions.height}px
            </div>
            <div>
              <span className="font-medium">Orientation:</span> {orientation}
            </div>
            <div>
              <span className="font-medium">Zoom:</span> {zoom}%
            </div>
          </div>

          <div className="flex items-center gap-4">
            {selectedDevice.userAgent && (
              <div className="text-xs text-gray-500 max-w-xs truncate" title={selectedDevice.userAgent}>
                <span className="font-medium">User Agent:</span> {selectedDevice.userAgent}
              </div>
            )}
            {selectedDevice.devicePixelRatio && (
              <div className="text-xs text-gray-500">
                <span className="font-medium">DPR:</span> {selectedDevice.devicePixelRatio}x
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
