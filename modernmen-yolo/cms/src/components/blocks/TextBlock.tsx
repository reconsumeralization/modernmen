'use client'

import React from 'react'
import { BaseBlockProps } from './index'

interface TextBlockProps extends BaseBlockProps {
  content?: any // Rich text content
  width?: 'narrow' | 'normal' | 'wide' | 'full'
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  backgroundColor?: string
  isPreview?: boolean
}

export const TextBlock: React.FC<TextBlockProps> = ({
  id,
  content,
  width = 'normal',
  textAlign = 'left',
  backgroundColor,
  className = '',
  isPreview = false,
}) => {
  // Width classes
  const widthClasses = {
    narrow: 'max-w-2xl',
    normal: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-none'
  }

  // Text alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }

  // Container classes
  const containerClass = width === 'full' ? 'w-full' : `${widthClasses[width]} mx-auto`

  // Background style
  const backgroundStyle = backgroundColor ? { backgroundColor } : {}

  // Render rich text content
  const renderContent = () => {
    if (!content) return null

    // If content is already HTML string
    if (typeof content === 'string') {
      return (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }

    // If content is rich text object (Payload format)
    if (content.root && content.root.children) {
      return <RichTextRenderer content={content} />
    }

    // Fallback for plain text
    return <p className="text-gray-700 leading-relaxed">{String(content)}</p>
  }

  return (
    <section
      id={id}
      className={`text-block py-12 px-6 ${className}`}
      style={backgroundStyle}
    >
      <div className={`${containerClass} ${alignClasses[textAlign]}`}>
        <div className="text-content space-y-6">
          {renderContent()}
        </div>
      </div>
    </section>
  )
}

// Rich text renderer component for Payload's rich text format
const RichTextRenderer: React.FC<{ content: any }> = ({ content }) => {
  if (!content?.root?.children) return null

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (node.text !== undefined) {
      // Text node
      let textElement: React.ReactNode = node.text
      
      if (node.bold) {
        textElement = <strong key={index}>{textElement}</strong>
      }
      if (node.italic) {
        textElement = <em key={index}>{textElement}</em>
      }
      if (node.underline) {
        textElement = <u key={index}>{textElement}</u>
      }
      if (node.strikethrough) {
        textElement = <s key={index}>{textElement}</s>
      }
      if (node.code) {
        textElement = <code key={index} className="bg-gray-100 px-1 rounded">{textElement}</code>
      }
      
      return textElement
    }

    // Element nodes
    const children = node.children?.map((child: any, childIndex: number) => 
      renderNode(child, childIndex)
    )

    switch (node.type) {
      case 'paragraph':
        return <p key={index} className="mb-4 leading-relaxed text-gray-700">{children}</p>
      
      case 'heading':
        const HeadingTag = `h${node.tag}` as keyof JSX.IntrinsicElements
        const headingClasses = {
          h1: 'text-4xl font-bold mb-6 text-gray-900',
          h2: 'text-3xl font-bold mb-5 text-gray-900',
          h3: 'text-2xl font-semibold mb-4 text-gray-800',
          h4: 'text-xl font-semibold mb-3 text-gray-800',
          h5: 'text-lg font-medium mb-2 text-gray-700',
          h6: 'text-base font-medium mb-2 text-gray-700'
        }
        return (
          <HeadingTag key={index} className={headingClasses[`h${node.tag}` as keyof typeof headingClasses]}>
            {children}
          </HeadingTag>
        )
      
      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        const listClasses = node.listType === 'number' 
          ? 'list-decimal list-inside mb-4 space-y-2'
          : 'list-disc list-inside mb-4 space-y-2'
        return (
          <ListTag key={index} className={listClasses}>
            {children}
          </ListTag>
        )
      
      case 'listitem':
        return <li key={index} className="text-gray-700 leading-relaxed">{children}</li>
      
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 my-6 italic text-gray-600 bg-blue-50 rounded-r">
            {children}
          </blockquote>
        )
      
      case 'code':
        return (
          <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
            <code>{children}</code>
          </pre>
        )
      
      case 'link':
        return (
          <a 
            key={index}
            href={node.url}
            target={node.newTab ? '_blank' : undefined}
            rel={node.newTab ? 'noopener noreferrer' : undefined}
            className="text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            {children}
          </a>
        )
      
      case 'linebreak':
        return <br key={index} />
      
      case 'horizontalrule':
        return <hr key={index} className="my-8 border-gray-300" />
      
      default:
        console.warn(`Unknown rich text node type: ${node.type}`)
        return <div key={index}>{children}</div>
    }
  }

  return (
    <div className="prose prose-lg max-w-none">
      {content.root.children.map((node: any, index: number) => renderNode(node, index))}
    </div>
  )
}

export default TextBlock