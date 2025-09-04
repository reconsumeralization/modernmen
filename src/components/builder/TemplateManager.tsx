// 📋 AMAZING Template Manager - Save, Load, and Share Templates
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuilder } from '../../lib/builder-engine'
import { systemManager } from '../../config/system.config'
import { cn } from '../../lib/utils'

interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail?: string
  components: any[]
  theme?: any
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  usageCount: number
}

const TEMPLATE_CATEGORIES = [
  'Landing Pages',
  'Business',
  'Portfolio',
  'E-commerce',
  'Blog',
  'Contact',
  'About',
  'Services',
  'Custom'
]

const PRESET_TEMPLATES: Template[] = [
  {
    id: 'landing-hero',
    name: 'Hero Landing Page',
    description: 'Perfect for product launches and service introductions',
    category: 'Landing Pages',
    thumbnail: '/templates/hero-landing.jpg',
    components: [
      {
        id: 'hero-1',
        type: 'hero',
        content: {
          title: 'Welcome to Amazing',
          subtitle: 'Build something incredible',
          ctaText: 'Get Started',
          backgroundImage: '/images/hero-bg.jpg'
        },
        position: { x: 0, y: 0, width: 12, height: 4 }
      },
      {
        id: 'features-1',
        type: 'features',
        content: {
          title: 'Amazing Features',
          features: [
            { title: 'Feature 1', description: 'Amazing feature description' },
            { title: 'Feature 2', description: 'Another amazing feature' },
            { title: 'Feature 3', description: 'Yet another amazing feature' }
          ]
        },
        position: { x: 0, y: 4, width: 12, height: 3 }
      }
    ],
    tags: ['hero', 'landing', 'modern'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 1247
  },
  {
    id: 'business-about',
    name: 'Business About Page',
    description: 'Professional about page for businesses',
    category: 'Business',
    thumbnail: '/templates/business-about.jpg',
    components: [
      {
        id: 'about-header',
        type: 'header',
        content: {
          title: 'About Our Company',
          subtitle: 'Learn more about who we are'
        },
        position: { x: 0, y: 0, width: 12, height: 2 }
      },
      {
        id: 'team-section',
        type: 'team',
        content: {
          title: 'Meet Our Team',
          members: [
            { name: 'John Doe', role: 'CEO', image: '/images/team-1.jpg' },
            { name: 'Jane Smith', role: 'CTO', image: '/images/team-2.jpg' }
          ]
        },
        position: { x: 0, y: 2, width: 12, height: 3 }
      }
    ],
    tags: ['business', 'about', 'team'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 892
  },
  {
    id: 'portfolio-showcase',
    name: 'Portfolio Showcase',
    description: 'Beautiful portfolio layout for creative professionals',
    category: 'Portfolio',
    thumbnail: '/templates/portfolio-showcase.jpg',
    components: [
      {
        id: 'portfolio-hero',
        type: 'hero',
        content: {
          title: 'My Portfolio',
          subtitle: 'Showcase of my best work',
          backgroundImage: '/images/portfolio-hero.jpg'
        },
        position: { x: 0, y: 0, width: 12, height: 4 }
      },
      {
        id: 'gallery-1',
        type: 'gallery',
        content: {
          images: [
            '/images/work-1.jpg',
            '/images/work-2.jpg',
            '/images/work-3.jpg'
          ]
        },
        position: { x: 0, y: 4, width: 12, height: 4 }
      }
    ],
    tags: ['portfolio', 'gallery', 'creative'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 654
  }
]

export function TemplateManager() {
  const { currentPage, loadTemplate, saveTemplate } = useBuilder()
  const [templates, setTemplates] = useState<Template[]>(PRESET_TEMPLATES)
  const [userTemplates, setUserTemplates] = useState<Template[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load user templates on mount
  useEffect(() => {
    loadUserTemplates()
  }, [])

  const loadUserTemplates = async () => {
    try {
      // Load from localStorage for now (could be from database later)
      const saved = localStorage.getItem('builder-templates')
      if (saved) {
        const parsed = JSON.parse(saved)
        setUserTemplates(parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt)
        })))
      }
    } catch (error) {
      console.error('Failed to load user templates:', error)
    }
  }

  // Filter templates
  const filteredTemplates = [...templates, ...userTemplates].filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Handle template application
  const handleApplyTemplate = async (template: Template) => {
    if (!currentPage) return

    setIsLoading(true)
    try {
      await loadTemplate(template.id, template)

      // Show success feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = `Template "${template.name}" applied successfully!`
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)

    } catch (error) {
      console.error('Failed to apply template:', error)

      // Show error feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = 'Failed to apply template. Please try again.'
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle template saving
  const handleSaveTemplate = async (templateData: Partial<Template>) => {
    if (!currentPage) return

    try {
      const newTemplate: Template = {
        id: `user-${Date.now()}`,
        name: templateData.name || 'Untitled Template',
        description: templateData.description || '',
        category: templateData.category || 'Custom',
        components: currentPage.components,
        theme: currentPage.theme,
        tags: templateData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        usageCount: 0
      }

      const updatedTemplates = [...userTemplates, newTemplate]
      setUserTemplates(updatedTemplates)

      // Save to localStorage
      localStorage.setItem('builder-templates', JSON.stringify(updatedTemplates))

      setShowSaveDialog(false)

      // Show success feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = 'Template saved successfully!'
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)

    } catch (error) {
      console.error('Failed to save template:', error)

      // Show error feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = 'Failed to save template. Please try again.'
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">📋 Template Manager</h2>
            <p className="text-sm text-gray-600">Save, load, and share amazing page templates</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowSaveDialog(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Current Page
            </motion.button>
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
              placeholder="Search templates..."
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
            {TEMPLATE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Template Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onApply={() => handleApplyTemplate(template)}
              isLoading={isLoading}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Save Template Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <SaveTemplateDialog
            onSave={handleSaveTemplate}
            onClose={() => setShowSaveDialog(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// 📋 Template Card Component
interface TemplateCardProps {
  template: Template
  onApply: () => void
  isLoading: boolean
}

function TemplateCard({ template, onApply, isLoading }: TemplateCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
      whileHover={{ y: -2 }}
      onClick={onApply}
    >
      {/* Thumbnail */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl">📄</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{template.name}</h4>
            <p className="text-xs text-gray-600 mt-1">{template.category}</p>
          </div>

          {template.isPublic && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Public
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{template.components.length} components</span>
          <span>{template.usageCount.toLocaleString()} uses</span>
        </div>

        <motion.button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation()
            onApply()
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Applying...
            </div>
          ) : (
            'Apply Template'
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

// 💾 Save Template Dialog
interface SaveTemplateDialogProps {
  onSave: (templateData: Partial<Template>) => void
  onClose: () => void
}

function SaveTemplateDialog({ onSave, onClose }: SaveTemplateDialogProps) {
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: 'Custom',
    tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')

  const handleSave = () => {
    if (!templateData.name.trim()) return

    onSave({
      ...templateData,
      tags: templateData.tags.filter(tag => tag.trim())
    })
  }

  const addTag = () => {
    if (tagInput.trim() && !templateData.tags.includes(tagInput.trim())) {
      setTemplateData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTemplateData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
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
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">💾 Save Template</h2>
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
        <div className="p-6 space-y-4">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name *
            </label>
            <input
              type="text"
              value={templateData.name}
              onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="My Amazing Template"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={templateData.description}
              onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Describe what this template is for..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={templateData.category}
              onChange={(e) => setTemplateData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TEMPLATE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a tag..."
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Tag Display */}
            <div className="flex flex-wrap gap-2">
              {templateData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
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
            onClick={handleSave}
            disabled={!templateData.name.trim()}
            className={cn(
              "px-4 py-2 rounded-lg transition-colors",
              templateData.name.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            Save Template
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
