'use client'

import React, { useEffect, useRef } from 'react'
import { BaseBlockProps } from './index'

interface HTMLBlockProps extends BaseBlockProps {
  html?: string
  css?: string
  js?: string
  isPreview?: boolean
}

export const HTMLBlock: React.FC<HTMLBlockProps> = ({
  id,
  html = '',
  css = '',
  js = '',
  className = '',
  isPreview = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || isPreview) return

    // Inject CSS
    if (css) {
      const styleElement = document.createElement('style')
      styleElement.textContent = css
      styleElement.setAttribute('data-custom-html-block', id || 'html-block')
      document.head.appendChild(styleElement)

      // Cleanup on unmount
      return () => {
        document.head.removeChild(styleElement)
      }
    }
  }, [css, id, isPreview])

  useEffect(() => {
    if (!containerRef.current || isPreview || !js) return

    try {
      // Create a new script element
      const scriptElement = document.createElement('script')
      scriptElement.textContent = js
      scriptElement.setAttribute('data-custom-html-block', id || 'html-block')
      
      // Append to container instead of head for better isolation
      containerRef.current.appendChild(scriptElement)

      // Cleanup on unmount
      return () => {
        if (containerRef.current && containerRef.current.contains(scriptElement)) {
          containerRef.current.removeChild(scriptElement)
        }
      }
    } catch (error) {
      console.error('Error executing custom JavaScript:', error)
    }
  }, [js, id, isPreview])

  if (!html && !css && !js) {
    return (
      <section id={id} className={`html-block py-12 px-6 ${className}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
            <p className="text-gray-500">⚡ No custom HTML configured. Add HTML, CSS, or JavaScript to display custom content.</p>
          </div>
        </div>
      </section>
    )
  }

  if (isPreview) {
    return (
      <section id={id} className={`html-block py-12 px-6 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="ml-4 text-sm text-gray-600 font-mono">Custom HTML Block (Preview Mode)</span>
            </div>
            
            <div className="bg-white rounded p-4 border">
              <div className="text-sm text-gray-500 mb-2">HTML Preview:</div>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                <code>{html || 'No HTML content'}</code>
              </pre>
              
              {css && (
                <>
                  <div className="text-sm text-gray-500 mb-2 mt-4">CSS:</div>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                    <code>{css}</code>
                  </pre>
                </>
              )}
              
              {js && (
                <>
                  <div className="text-sm text-gray-500 mb-2 mt-4">JavaScript:</div>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                    <code>{js}</code>
                  </pre>
                </>
              )}
            </div>
            
            <div className="mt-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3">
              ⚠️ Custom HTML blocks are disabled in preview mode for security reasons.
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id={id} className={`html-block ${className}`}>
      <div 
        ref={containerRef}
        className="custom-html-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}

export default HTMLBlock