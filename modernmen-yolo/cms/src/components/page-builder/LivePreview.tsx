'use client'

import React, { useState, useEffect, useRef } from 'react'
import { BlockRenderer } from '../blocks'

interface LivePreviewProps {
  blocks: any[]
  viewMode: 'desktop' | 'tablet' | 'mobile'
  selectedBlock?: string | null
  className?: string
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  blocks,
  viewMode,
  selectedBlock,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const previewRef = useRef<HTMLIFrameElement>(null)

  // Viewport dimensions for different devices
  const viewportDimensions = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '812px' }
  }

  // Generate preview HTML
  const generatePreviewHTML = () => {
    const tailwindCSS = `
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        .selected-block { 
          outline: 2px solid #3b82f6 !important; 
          outline-offset: 2px;
        }
        .preview-container {
          min-height: 100vh;
        }
        
        /* Animation classes */
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .animate-slideDown { animation: slideDown 0.5s ease-out; }
        .animate-slideLeft { animation: slideLeft 0.5s ease-out; }
        .animate-slideRight { animation: slideRight 0.5s ease-out; }
        .animate-zoomIn { animation: zoomIn 0.5s ease-out; }
        .animate-bounceIn { animation: bounceIn 0.8s ease-out; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideLeft { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideRight { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes bounceIn { 
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `

    const blocksHTML = blocks.map((block, index) => {
      const isSelected = block.id === selectedBlock
      const responsiveStyles = getResponsiveClasses(block, viewMode)
      const animationClass = getAnimationClass(block, viewMode)
      
      return `
        <div 
          class="${responsiveStyles} ${animationClass} ${isSelected ? 'selected-block' : ''}" 
          data-block-id="${block.id}"
          data-block-type="${block.blockType}"
        >
          ${renderBlockHTML(block)}
        </div>
      `
    }).join('')

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
        ${tailwindCSS}
      </head>
      <body>
        <div class="preview-container">
          ${blocksHTML || '<div class="flex items-center justify-center h-screen text-gray-500"><div class="text-center"><div class="text-6xl mb-4">🎨</div><h3 class="text-lg font-semibold mb-2">No blocks to preview</h3><p>Add some blocks to see the live preview</p></div></div>'}
        </div>
        <script>
          // Add click handlers for block selection
          document.addEventListener('click', (e) => {
            const block = e.target.closest('[data-block-id]');
            if (block) {
              window.parent.postMessage({
                type: 'blockSelected',
                blockId: block.dataset.blockId
              }, '*');
            }
          });
          
          // Smooth scrolling to selected blocks
          const selectedBlock = document.querySelector('.selected-block');
          if (selectedBlock) {
            selectedBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        </script>
      </body>
      </html>
    `
  }

  // Update preview when blocks change
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      if (previewRef.current) {
        const doc = previewRef.current.contentDocument
        if (doc) {
          doc.open()
          doc.write(generatePreviewHTML())
          doc.close()
        }
      }
      setIsLoading(false)
      setLastUpdate(Date.now())
    }, 100) // Small delay to batch updates

    return () => clearTimeout(timer)
  }, [blocks, viewMode, selectedBlock])

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'blockSelected') {
        // Handle block selection from preview
        window.dispatchEvent(new CustomEvent('previewBlockSelected', {
          detail: { blockId: event.data.blockId }
        }))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const currentDimensions = viewportDimensions[viewMode]

  return (
    <div className={`live-preview relative ${className}`}>
      {/* Preview Status Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900 text-white px-4 py-2 text-sm z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span>Live Preview</span>
          </div>
          
          <div className="text-gray-300">
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} • {blocks.length} blocks
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      </div>

      {/* Preview Frame */}
      <div className="pt-10 h-full bg-gray-100 overflow-auto">
        <div 
          className="mx-auto bg-white shadow-lg transition-all duration-300"
          style={{ 
            width: currentDimensions.width,
            maxWidth: viewMode === 'desktop' ? '100%' : currentDimensions.width,
            minHeight: currentDimensions.height
          }}
        >
          <iframe
            ref={previewRef}
            className="w-full h-full border-0"
            style={{ minHeight: '800px' }}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-lg">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-gray-600">Updating preview...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to get responsive classes (same as in main page builder)
const getResponsiveClasses = (block: any, viewMode: 'desktop' | 'tablet' | 'mobile') => {
  const styles = block.styles || {}
  const responsive = styles.responsive || {}
  
  let classes = ''
  
  if (responsive[viewMode]?.hidden) {
    classes += 'hidden '
  }
  
  const spacing = responsive[viewMode]?.spacing
  if (spacing?.margin) {
    classes += `m-${spacing.margin} `
  }
  if (spacing?.padding) {
    classes += `p-${spacing.padding} `
  }
  
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
  
  if (layout?.textAlign) {
    classes += `text-${layout.textAlign} `
  }
  
  // Add custom classes
  if (responsive[viewMode]?.customClasses) {
    classes += responsive[viewMode].customClasses + ' '
  }
  
  // Add background styles
  const background = responsive[viewMode]?.background
  if (background?.color && background.color !== '#ffffff') {
    classes += `bg-[${background.color}] `
  }
  
  return classes.trim()
}

// Get animation class based on block settings
const getAnimationClass = (block: any, viewMode: 'desktop' | 'tablet' | 'mobile') => {
  const styles = block.styles || {}
  const responsive = styles.responsive || {}
  const animation = responsive[viewMode]?.animation
  
  if (!animation?.entrance || animation.entrance === 'none') {
    return ''
  }
  
  const animationMap: { [key: string]: string } = {
    'fadeIn': 'animate-fadeIn',
    'slideUp': 'animate-slideUp',
    'slideDown': 'animate-slideDown',
    'slideLeft': 'animate-slideLeft',
    'slideRight': 'animate-slideRight',
    'zoomIn': 'animate-zoomIn',
    'bounceIn': 'animate-bounceIn'
  }
  
  return animationMap[animation.entrance] || ''
}

// Simplified block HTML rendering for iframe
const renderBlockHTML = (block: any): string => {
  const { blockType } = block
  
  switch (blockType) {
    case 'hero':
      return `
        <section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-6">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6">${block.headline || 'Welcome to Our Business'}</h1>
            <p class="text-xl mb-8 opacity-90">${block.subheadline || 'Experience exceptional service and quality.'}</p>
            ${(block.ctaButtons || []).map((btn: any) => 
              `<a href="${btn.link || '#'}" class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mr-4">${btn.text || 'Get Started'}</a>`
            ).join('')}
          </div>
        </section>
      `
    
    case 'text':
      return `
        <section class="py-12 px-6">
          <div class="max-w-4xl mx-auto">
            <div class="prose prose-lg max-w-none">
              ${block.content || 'Add your text content here.'}
            </div>
          </div>
        </section>
      `
    
    case 'services':
      return `
        <section class="py-16 px-6 bg-gray-50">
          <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">${block.title || 'Our Services'}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${(block.services || []).map((service: any) => `
                <div class="bg-white p-6 rounded-xl shadow-lg">
                  <div class="text-3xl mb-4">${getServiceIcon(service.icon)}</div>
                  <h3 class="text-xl font-semibold mb-3">${service.title}</h3>
                  <p class="text-gray-600">${service.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `
    
    case 'gallery':
      return `
        <section class="py-16 px-6">
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${(block.images || []).map((img: any) => `
                <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img src="${img.url || '/placeholder-image.jpg'}" alt="${img.alt || ''}" class="w-full h-full object-cover">
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `
    
    case 'contact':
      return `
        <section class="py-16 px-6 bg-gray-50">
          <div class="max-w-2xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-8">${block.title || 'Get In Touch'}</h2>
            <form class="space-y-6">
              ${(block.fields || []).map((field: any) => {
                if (field.type === 'textarea') {
                  return `<textarea placeholder="${field.label}" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4"></textarea>`
                }
                return `<input type="${field.type}" placeholder="${field.label}" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">`
              }).join('')}
              <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Send Message</button>
            </form>
          </div>
        </section>
      `
    
    case 'cta':
      return `
        <section class="py-20 px-6 bg-blue-600 text-white">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">${block.headline || 'Ready to Get Started?'}</h2>
            <p class="text-xl mb-8 opacity-90">${block.description || 'Join thousands of satisfied customers.'}</p>
            <a href="${block.button?.link || '#'}" class="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              ${block.button?.text || 'Get Started'}
            </a>
          </div>
        </section>
      `
    
    default:
      return `
        <section class="py-12 px-6">
          <div class="max-w-4xl mx-auto text-center">
            <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
              <p class="text-gray-500">⚡ ${blockType} block</p>
            </div>
          </div>
        </section>
      `
  }
}

// Helper function to get service icons
const getServiceIcon = (iconName: string) => {
  const icons: { [key: string]: string } = {
    scissors: '✂️',
    target: '🎯',
    star: '⭐',
    heart: '❤️',
    shield: '🛡️',
    crown: '👑',
    gem: '💎',
    fire: '🔥'
  }
  return icons[iconName] || '⚡'
}

export default LivePreview