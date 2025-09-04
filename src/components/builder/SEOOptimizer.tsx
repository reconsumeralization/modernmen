// 🔍 AMAZING SEO Optimizer - Professional Search Engine Optimization
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuilder } from '../../lib/builder-engine'
import { systemManager } from '../../config/system.config'
import { cn } from '../../lib/utils'

interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  suggestions: SEOSuggestion[]
  keywords: KeywordData[]
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  fixable: boolean
  element?: string
}

interface SEOSuggestion {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'content' | 'technical' | 'social' | 'performance'
  action: string
}

interface KeywordData {
  keyword: string
  density: number
  prominence: number
  competition: 'low' | 'medium' | 'high'
  suggestions: string[]
}

const SEO_CHECKS = [
  {
    id: 'title',
    name: 'Page Title',
    description: 'Optimize your page title for search engines',
    category: 'content'
  },
  {
    id: 'meta-description',
    name: 'Meta Description',
    description: 'Write compelling meta descriptions',
    category: 'content'
  },
  {
    id: 'headings',
    name: 'Heading Structure',
    description: 'Ensure proper H1-H6 hierarchy',
    category: 'content'
  },
  {
    id: 'images',
    name: 'Image Optimization',
    description: 'Optimize images for web performance',
    category: 'technical'
  },
  {
    id: 'links',
    name: 'Internal Links',
    description: 'Add relevant internal linking',
    category: 'technical'
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Optimize for social sharing',
    category: 'social'
  },
  {
    id: 'mobile',
    name: 'Mobile Friendly',
    description: 'Ensure mobile responsiveness',
    category: 'technical'
  },
  {
    id: 'performance',
    name: 'Page Speed',
    description: 'Optimize loading performance',
    category: 'performance'
  }
]

export function SEOOptimizer() {
  const { currentPage, updatePageSEO } = useBuilder()
  const [activeTab, setActiveTab] = useState<'analysis' | 'keywords' | 'content' | 'technical'>('analysis')
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [targetKeyword, setTargetKeyword] = useState('')
  const [customKeywords, setCustomKeywords] = useState<string[]>([])
  const [seoSettings, setSeoSettings] = useState({
    title: '',
    description: '',
    keywords: '',
    canonical: '',
    robots: 'index,follow',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image'
  })

  // Initialize SEO settings from current page
  useEffect(() => {
    if (currentPage?.seo) {
      setSeoSettings({
        title: currentPage.seo.title || '',
        description: currentPage.seo.description || '',
        keywords: currentPage.seo.keywords || '',
        canonical: currentPage.seo.canonical || '',
        robots: currentPage.seo.robots || 'index,follow',
        ogTitle: currentPage.seo.ogTitle || '',
        ogDescription: currentPage.seo.ogDescription || '',
        ogImage: currentPage.seo.ogImage || '',
        twitterCard: currentPage.seo.twitterCard || 'summary_large_image'
      })
    }
  }, [currentPage])

  // Run SEO analysis
  const runAnalysis = async () => {
    if (!currentPage) return

    setIsAnalyzing(true)
    try {
      // Simulate SEO analysis (in real app, this would call an API)
      const analysis: SEOAnalysis = {
        score: 78,
        issues: [
          {
            type: 'warning',
            title: 'Meta description too short',
            description: 'Your meta description should be between 120-160 characters',
            impact: 'medium',
            fixable: true,
            element: 'meta[name="description"]'
          },
          {
            type: 'info',
            title: 'Add structured data',
            description: 'Consider adding JSON-LD structured data for better search visibility',
            impact: 'low',
            fixable: true
          },
          {
            type: 'error',
            title: 'Missing alt text',
            description: 'Some images are missing alt text for accessibility',
            impact: 'high',
            fixable: true,
            element: 'img'
          }
        ],
        suggestions: [
          {
            title: 'Optimize page title',
            description: 'Include your main keyword in the page title',
            priority: 'high',
            category: 'content',
            action: 'Update page title to include primary keyword'
          },
          {
            title: 'Add internal links',
            description: 'Link to related pages to improve site structure',
            priority: 'medium',
            category: 'technical',
            action: 'Add 2-3 internal links to relevant pages'
          },
          {
            title: 'Improve mobile speed',
            description: 'Optimize images and reduce server response time',
            priority: 'high',
            category: 'performance',
            action: 'Compress images and enable browser caching'
          }
        ],
        keywords: [
          {
            keyword: targetKeyword || 'amazing website',
            density: 2.3,
            prominence: 85,
            competition: 'medium',
            suggestions: ['amazing web design', 'amazing builder', 'create amazing sites']
          }
        ]
      }

      setSeoAnalysis(analysis)

      // Show success feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = 'SEO analysis completed!'
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 2000)

    } catch (error) {
      console.error('SEO analysis failed:', error)

      // Show error feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = 'SEO analysis failed. Please try again.'
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Save SEO settings
  const saveSEOSettings = async () => {
    if (!currentPage) return

    try {
      await updatePageSEO(currentPage.id, seoSettings)

      // Show success feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = 'SEO settings saved successfully!'
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 2000)

    } catch (error) {
      console.error('Failed to save SEO settings:', error)

      // Show error feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = 'Failed to save SEO settings.'
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)
    }
  }

  // Add custom keyword
  const addCustomKeyword = () => {
    if (targetKeyword.trim() && !customKeywords.includes(targetKeyword.trim())) {
      setCustomKeywords(prev => [...prev, targetKeyword.trim()])
      setTargetKeyword('')
    }
  }

  // Remove custom keyword
  const removeCustomKeyword = (keyword: string) => {
    setCustomKeywords(prev => prev.filter(k => k !== keyword))
  }

  // Get SEO score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get issue icon
  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '❓'
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">🔍 SEO Optimizer</h2>
            <p className="text-sm text-gray-600">Optimize your pages for search engines</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={runAnalysis}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                'Run Analysis'
              )}
            </motion.button>

            <motion.button
              onClick={saveSEOSettings}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Settings
            </motion.button>
          </div>
        </div>
      </div>

      {/* SEO Score */}
      {seoAnalysis && (
        <motion.div
          className="bg-white border-b border-gray-200 px-6 py-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={cn(
                  "text-3xl font-bold",
                  getScoreColor(seoAnalysis.score)
                )}>
                  {seoAnalysis.score}
                </div>
                <div className="text-sm text-gray-600">SEO Score</div>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600">
                    {seoAnalysis.issues.filter(i => i.type === 'error').length}
                  </div>
                  <div className="text-xs text-gray-600">Errors</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-600">
                    {seoAnalysis.issues.filter(i => i.type === 'warning').length}
                  </div>
                  <div className="text-xs text-gray-600">Warnings</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {seoAnalysis.suggestions.length}
                  </div>
                  <div className="text-xs text-gray-600">Suggestions</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Last analyzed: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'analysis', label: 'Analysis', icon: '📊' },
              { id: 'keywords', label: 'Keywords', icon: '🔤' },
              { id: 'content', label: 'Content', icon: '📝' },
              { id: 'technical', label: 'Technical', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* SEO Issues */}
              {seoAnalysis && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues Found</h3>
                  <div className="space-y-4">
                    {seoAnalysis.issues.map((issue, index) => (
                      <motion.div
                        key={index}
                        className={cn(
                          "p-4 rounded-lg border",
                          issue.type === 'error' && "border-red-200 bg-red-50",
                          issue.type === 'warning' && "border-yellow-200 bg-yellow-50",
                          issue.type === 'info' && "border-blue-200 bg-blue-50"
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{getIssueIcon(issue.type)}</span>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{issue.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                issue.impact === 'high' && "bg-red-100 text-red-700",
                                issue.impact === 'medium' && "bg-yellow-100 text-yellow-700",
                                issue.impact === 'low' && "bg-blue-100 text-blue-700"
                              )}>
                                {issue.impact} impact
                              </span>
                              {issue.element && (
                                <span className="text-xs text-gray-500">
                                  Element: {issue.element}
                                </span>
                              )}
                              {issue.fixable && (
                                <span className="text-xs text-green-600">
                                  ✓ Fixable
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Suggestions */}
              {seoAnalysis && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {seoAnalysis.suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        className="p-4 bg-white border border-gray-200 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">
                            {suggestion.category === 'content' && '📝'}
                            {suggestion.category === 'technical' && '⚙️'}
                            {suggestion.category === 'social' && '📱'}
                            {suggestion.category === 'performance' && '🚀'}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                suggestion.priority === 'high' && "bg-red-100 text-red-700",
                                suggestion.priority === 'medium' && "bg-yellow-100 text-yellow-700",
                                suggestion.priority === 'low' && "bg-blue-100 text-blue-700"
                              )}>
                                {suggestion.priority} priority
                              </span>
                              <span className="text-xs text-gray-500 capitalize">
                                {suggestion.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {!seoAnalysis && !isAnalyzing && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for SEO Analysis</h3>
                  <p className="text-gray-600 mb-6">
                    Click "Run Analysis" to get detailed SEO insights for your page
                  </p>
                  <button
                    onClick={runAnalysis}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start SEO Analysis
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'keywords' && (
            <motion.div
              key="keywords"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Target Keyword */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Target Keyword</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomKeyword()}
                    placeholder="Enter your main keyword..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={addCustomKeyword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Custom Keywords */}
              {customKeywords.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Your Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {customKeywords.map(keyword => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {keyword}
                        <button
                          onClick={() => removeCustomKeyword(keyword)}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyword Analysis */}
              {seoAnalysis && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Keyword Analysis</h3>
                  <div className="space-y-4">
                    {seoAnalysis.keywords.map((keyword, index) => (
                      <motion.div
                        key={index}
                        className="p-4 bg-white border border-gray-200 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{keyword.keyword}</h4>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                              Density: <span className="font-medium">{keyword.density}%</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Prominence: <span className="font-medium">{keyword.prominence}%</span>
                            </div>
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              keyword.competition === 'low' && "bg-green-100 text-green-700",
                              keyword.competition === 'medium' && "bg-yellow-100 text-yellow-700",
                              keyword.competition === 'high' && "bg-red-100 text-red-700"
                            )}>
                              {keyword.competition} competition
                            </span>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Related Keywords:</h5>
                          <div className="flex flex-wrap gap-2">
                            {keyword.suggestions.map(suggestion => (
                              <span
                                key={suggestion}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {suggestion}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Basic SEO Settings */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Basic SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title ({seoSettings.title.length}/60)
                    </label>
                    <input
                      type="text"
                      value={seoSettings.title}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, title: e.target.value }))}
                      maxLength={60}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your amazing page title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description ({seoSettings.description.length}/160)
                    </label>
                    <textarea
                      value={seoSettings.description}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, description: e.target.value }))}
                      maxLength={160}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your page in 160 characters or less"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={seoSettings.keywords}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, keywords: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Settings */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Social Media</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Graph Title
                    </label>
                    <input
                      type="text"
                      value={seoSettings.ogTitle}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, ogTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Title for social media sharing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Graph Description
                    </label>
                    <textarea
                      value={seoSettings.ogDescription}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, ogDescription: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description for social media sharing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Graph Image URL
                    </label>
                    <input
                      type="url"
                      value={seoSettings.ogImage}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, ogImage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Card Type
                    </label>
                    <select
                      value={seoSettings.twitterCard}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, twitterCard: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'technical' && (
            <motion.div
              key="technical"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Technical SEO Settings */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Technical SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={seoSettings.canonical}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, canonical: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/canonical-url"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Robots Meta
                    </label>
                    <select
                      value={seoSettings.robots}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, robots: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="index,follow">Index, Follow (Default)</option>
                      <option value="noindex,follow">No Index, Follow</option>
                      <option value="index,nofollow">Index, No Follow</option>
                      <option value="noindex,nofollow">No Index, No Follow</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ SEO Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SEO_CHECKS.map((check) => (
                    <div key={check.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{check.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{check.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded capitalize">
                          {check.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
