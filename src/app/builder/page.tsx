// 🎯 AMAZING Drag & Drop Page Builder - Where Everything Comes Together!
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BuilderCanvas } from '../../components/builder/BuilderCanvas'
import { ThemeManager } from '../../components/builder/ThemeManager'
import { TemplateManager } from '../../components/builder/TemplateManager'
import { AssetManager } from '../../components/builder/AssetManager'
import { DevicePreview } from '../../components/builder/DevicePreview'
import { SEOOptimizer } from '../../components/builder/SEOOptimizer'
import { useBuilder } from '../../lib/builder-engine'
import { systemManager } from '../../config/system.config'
import { logger } from '../../lib/logger'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/button'

export default function BuilderPage() {
  const [currentPageId, setCurrentPageId] = useState<string | undefined>()
  const [showPreview, setShowPreview] = useState(false)
  const [exportedCode, setExportedCode] = useState<string>('')
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [activeSidebarTab, setActiveSidebarTab] = useState<'canvas' | 'theme' | 'template' | 'assets' | 'preview' | 'seo'>('canvas')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const {
    currentPage,
    availableComponents,
    availableTemplates,
    availableThemes,
    exportPage,
    savePage,
  } = useBuilder(currentPageId) || {}

  // 🎯 Initialize system on page load
  React.useEffect(() => {
    const initializeBuilder = async () => {
      try {
        await systemManager.initialize()
        logger.info('🎨 Builder system initialized successfully')

        // Create a new page if none exists
        if (!currentPageId) {
          const builderEngine = (await import('../../lib/builder-engine')).builderEngine
          const newPage = builderEngine.createPage()
          builderEngine.savePage(newPage)
          setCurrentPageId(newPage.id)
        }
      } catch (error) {
        logger.error('❌ Failed to initialize builder system:', {}, error instanceof Error ? error : new Error(String(error)))
      }
    }

    initializeBuilder()
  }, [currentPageId])

  // 🎯 Handle page save
  const handlePageSave = () => {
    if (savePage) {
      savePage()
      logger.info(`💾 Page saved`)
    }
  }

  // 🎯 Handle code export
  const handleCodeExport = (code?: string) => {
    if (code) {
      setExportedCode(code)
    } else if (exportPage) {
      const exportedCode = exportPage('react')
      setExportedCode(exportedCode)
    }
    setShowCodeModal(true)
    logger.info('📤 Code exported successfully')
  }

  // 🎯 Create new page
  const createNewPage = async () => {
    const builderEngine = (await import('../../lib/builder-engine')).builderEngine
    const newPage = builderEngine.createPage()
    builderEngine.savePage(newPage)
    setCurrentPageId(newPage.id)
    logger.info(`🆕 New page created: ${newPage.id}`)
  }

  // 🎯 Load template
  const loadTemplate = async (templateId: string) => {
    const builderEngine = (await import('../../lib/builder-engine')).builderEngine
    const template = availableTemplates?.find((t: any) => t.id === templateId)
    if (template) {
      const newPage = builderEngine.createPage(templateId)
      builderEngine.savePage(newPage)
      setCurrentPageId(newPage.id)
      logger.info(`📋 Template loaded: ${templateId}`)
    }
  }

  // 🎯 Toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview)
    logger.info(`👁️ Preview mode: ${!showPreview ? 'ON' : 'OFF'}`)
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* 🎯 Sidebar */}
      <motion.aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">🎨 Builder Tools</h2>
                <p className="text-xs text-gray-600">Amazing tools at your fingertips</p>
              </div>
            )}
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Tool Tabs */}
        <div className="flex-1 p-4 space-y-2">
          {[
            { id: 'canvas', label: 'Canvas', icon: '🎨', description: 'Visual page builder' },
            { id: 'theme', label: 'Themes', icon: '🎯', description: 'Apply beautiful themes' },
            { id: 'template', label: 'Templates', icon: '📋', description: 'Save and load templates' },
            { id: 'assets', label: 'Assets', icon: '🎨', description: 'Manage media assets' },
            { id: 'preview', label: 'Preview', icon: '📱', description: 'Multi-device preview' },
            { id: 'seo', label: 'SEO', icon: '🔍', description: 'Search optimization' }
          ].map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => setActiveSidebarTab(tool.id as any)}
              className={cn(
                "w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3",
                activeSidebarTab === tool.id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "hover:bg-gray-100 text-gray-700"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{tool.icon}</span>
              {!sidebarCollapsed && (
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{tool.label}</div>
                  <div className="text-xs text-gray-500">{tool.description}</div>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          {!sidebarCollapsed && (
            <div className="text-xs text-gray-500 text-center">
              Modern Men Amazing Builder v2.0
            </div>
          )}
        </div>
      </motion.aside>

      {/* 🎯 Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* 🎯 Header */}
        <motion.header
          className="bg-white border-b border-gray-200 px-6 py-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Modern Men Builder</h1>
                  <p className="text-sm text-gray-600">Amazing Drag & Drop Page Builder</p>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={createNewPage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  New Page
                </motion.button>

                <motion.button
                  onClick={togglePreview}
                  className={cn(
                    "px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                    showPreview
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showPreview ? 'Edit Mode' : 'Preview'}
                </motion.button>
              </div>
            </div>

            {/* Page Info */}
            <div className="flex items-center gap-4">
              {currentPage && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{currentPage.name}</span>
                  <span className="mx-2">•</span>
                  <span>{currentPage.components.length} components</span>
                </div>
              )}

              {/* Active Tool Indicator */}
              <div className="text-sm text-gray-600">
                Active: <span className="font-medium capitalize">{activeSidebarTab}</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* 🎯 Dynamic Content Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {activeSidebarTab === 'canvas' && (
              <motion.div
                key="canvas"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                {showPreview ? (
                  <PreviewMode
                    pageId={currentPageId}
                    onExitPreview={() => setShowPreview(false)}
                  />
                ) : (
                  <BuilderCanvas
                    pageId={currentPageId}
                    onSave={handlePageSave}
                    onExport={() => handleCodeExport()}
                  />
                )}
              </motion.div>
            )}

            {activeSidebarTab === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ThemeManager />
              </motion.div>
            )}

            {activeSidebarTab === 'template' && (
              <motion.div
                key="template"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <TemplateManager />
              </motion.div>
            )}

            {activeSidebarTab === 'assets' && (
              <motion.div
                key="assets"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <AssetManager />
              </motion.div>
            )}

            {activeSidebarTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <DevicePreview />
              </motion.div>
            )}

            {activeSidebarTab === 'seo' && (
              <motion.div
                key="seo"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <SEOOptimizer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🎯 Code Export Modal */}
        <AnimatePresence>
          {showCodeModal && (
            <CodeExportModal
              code={exportedCode}
              onClose={() => setShowCodeModal(false)}
            />
          )}
        </AnimatePresence>

        {/* 🎯 Welcome Overlay for New Users */}
        {!currentPage && activeSidebarTab === 'canvas' && (
          <WelcomeOverlay onCreatePage={createNewPage} />
        )}
      </div>
    </div>
  )
}

// 🎯 Preview Mode Component
interface PreviewModeProps {
  pageId?: string
  onExitPreview: () => void
}

function PreviewMode({ pageId, onExitPreview }: PreviewModeProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Preview Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Preview Mode</h2>
        <button
          onClick={onExitPreview}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Exit Preview
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Mock Preview Content */}
          <div className="space-y-8">
            <div className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
              <h1 className="text-4xl font-bold mb-4">Your Amazing Page</h1>
              <p className="text-xl">This is how your page will look to visitors</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 p-6 rounded-lg">
                  <div className="w-full h-32 bg-gray-200 rounded mb-4" />
                  <h3 className="font-semibold mb-2">Service {i}</h3>
                  <p className="text-gray-600 text-sm">Amazing service description</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Build Something Amazing?</h2>
              <p className="text-gray-600 mb-6">Switch back to edit mode to continue building</p>
              <button
                onClick={onExitPreview}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Builder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 🎯 Code Export Modal
interface CodeExportModalProps {
  code: string
  onClose: () => void
}

function CodeExportModal({ code, onClose }: CodeExportModalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Exported React Component</h2>
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
        <div className="flex-1 p-6 overflow-hidden">
          <div className="flex gap-4 h-full">
            {/* Code Display */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generated Code</h3>
                <button
                  onClick={copyToClipboard}
                  className={cn(
                    "px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm h-[400px]">
                <code>{code || '// Your amazing component code will appear here'}</code>
              </pre>
            </div>

            {/* Instructions */}
            <div className="w-80 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">How to Use</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <strong className="text-gray-900">1. Copy the code</strong>
                  <p>Click the "Copy Code" button above</p>
                </div>
                <div>
                  <strong className="text-gray-900">2. Create a new file</strong>
                  <p>Save as a .tsx file in your components folder</p>
                </div>
                <div>
                  <strong className="text-gray-900">3. Import and use</strong>
                  <p>Import the component and use it in your pages</p>
                </div>
                <div>
                  <strong className="text-gray-900">4. Customize</strong>
                  <p>Modify props and styles as needed</p>
                </div>
              </div>

              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Pro Tip:</strong> The generated code includes all your custom styles and interactions!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Copy Code
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 🎯 Welcome Overlay for New Users
interface WelcomeOverlayProps {
  onCreatePage: () => void
}

function WelcomeOverlay({ onCreatePage }: WelcomeOverlayProps) {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center max-w-md mx-auto p-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <span className="text-white text-2xl font-bold">🚀</span>
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Modern Men Builder
        </h2>

        <p className="text-gray-600 mb-8">
          Create amazing pages with our drag-and-drop builder. No coding required!
        </p>

        <div className="space-y-4">
          <motion.button
            onClick={onCreatePage}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Your First Page
          </motion.button>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Drag & Drop
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Real-time Preview
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Mobile Responsive
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Export to Code
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
