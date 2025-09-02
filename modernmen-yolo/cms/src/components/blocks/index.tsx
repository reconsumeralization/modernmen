'use client'

import React from 'react'
import { HeroBlock } from './HeroBlock'
import { TextBlock } from './TextBlock'
import { GalleryBlock } from './GalleryBlock'
import { ServicesBlock } from './ServicesBlock'
import { TeamBlock } from './TeamBlock'
import { ContactBlock } from './ContactBlock'
import { TestimonialsBlock } from './TestimonialsBlock'
import { CTABlock } from './CTABlock'
import { HTMLBlock } from './HTMLBlock'

// Block type definitions
export interface BaseBlockProps {
  id?: string
  className?: string
  style?: React.CSSProperties
}

// Main block renderer component
export interface BlockRendererProps {
  blocks: any[]
  className?: string
  isPreview?: boolean
  isDragging?: boolean
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  blocks, 
  className = '', 
  isPreview = false,
  isDragging = false 
}) => {
  if (!blocks || !Array.isArray(blocks)) {
    return null
  }

  return (
    <div className={`block-renderer ${className} ${isPreview ? 'preview-mode' : ''}`}>
      {blocks.map((block, index) => {
        const blockProps = {
          key: `${block.blockType}-${block.id || index}`,
          id: block.id || `block-${index}`,
          isPreview,
          isDragging,
          ...block
        }

        switch (block.blockType) {
          case 'hero':
            return <HeroBlock {...blockProps} />
          
          case 'text':
            return <TextBlock {...blockProps} />
          
          case 'gallery':
            return <GalleryBlock {...blockProps} />
          
          case 'services':
            return <ServicesBlock {...blockProps} />
          
          case 'team':
            return <TeamBlock {...blockProps} />
          
          case 'contact':
            return <ContactBlock {...blockProps} />
          
          case 'testimonials':
            return <TestimonialsBlock {...blockProps} />
          
          case 'cta':
            return <CTABlock {...blockProps} />
          
          case 'html':
            return <HTMLBlock {...blockProps} />
          
          default:
            console.warn(`Unknown block type: ${block.blockType}`)
            return (
              <div 
                key={blockProps.key}
                className="unknown-block p-4 border-2 border-dashed border-red-300 bg-red-50 text-red-600 rounded-lg"
              >
                <p>⚠️ Unknown block type: <strong>{block.blockType}</strong></p>
                <details className="mt-2">
                  <summary className="cursor-pointer">View block data</summary>
                  <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                    {JSON.stringify(block, null, 2)}
                  </pre>
                </details>
              </div>
            )
        }
      })}
    </div>
  )
}

// Export all block components
export {
  HeroBlock,
  TextBlock, 
  GalleryBlock,
  ServicesBlock,
  TeamBlock,
  ContactBlock,
  TestimonialsBlock,
  CTABlock,
  HTMLBlock
}

// Block registry for dynamic imports
export const BLOCK_REGISTRY = {
  hero: {
    component: HeroBlock,
    name: '🚀 Hero Section',
    category: 'Layout',
    description: 'Eye-catching hero section with background options',
    preview: '/admin-assets/block-hero-preview.jpg'
  },
  text: {
    component: TextBlock,
    name: '📝 Text Block',
    category: 'Content',
    description: 'Rich text content with formatting',
    preview: '/admin-assets/block-text-preview.jpg'
  },
  gallery: {
    component: GalleryBlock,
    name: '🖼️ Image Gallery',
    category: 'Media',
    description: 'Responsive image gallery with multiple layouts',
    preview: '/admin-assets/block-gallery-preview.jpg'
  },
  services: {
    component: ServicesBlock,
    name: '⚡ Services',
    category: 'Business',
    description: 'Showcase services or features',
    preview: '/admin-assets/block-services-preview.jpg'
  },
  team: {
    component: TeamBlock,
    name: '👥 Team',
    category: 'Business',
    description: 'Display team members',
    preview: '/admin-assets/block-team-preview.jpg'
  },
  contact: {
    component: ContactBlock,
    name: '📞 Contact Form',
    category: 'Forms',
    description: 'Customizable contact form',
    preview: '/admin-assets/block-contact-preview.jpg'
  },
  testimonials: {
    component: TestimonialsBlock,
    name: '⭐ Testimonials',
    category: 'Social Proof',
    description: 'Customer testimonials and reviews',
    preview: '/admin-assets/block-testimonials-preview.jpg'
  },
  cta: {
    component: CTABlock,
    name: '🎯 Call to Action',
    category: 'Marketing',
    description: 'Compelling call-to-action sections',
    preview: '/admin-assets/block-cta-preview.jpg'
  },
  html: {
    component: HTMLBlock,
    name: '⚡ Custom HTML',
    category: 'Advanced',
    description: 'Custom HTML, CSS, and JavaScript',
    preview: '/admin-assets/block-html-preview.jpg'
  }
}

export default BlockRenderer