'use client'

import React from 'react'
import Link from 'next/link'
import { BaseBlockProps } from './index'

interface CTABlockProps extends BaseBlockProps {
  style?: 'banner' | 'card' | 'minimal' | 'gradient'
  backgroundColor?: string
  headline?: string
  description?: string
  button?: {
    text: string
    link: string
    style: 'primary' | 'secondary' | 'ghost'
  }
  size?: 'small' | 'normal' | 'large' | 'xl'
  isPreview?: boolean
}

export const CTABlock: React.FC<CTABlockProps> = ({
  id,
  style = 'banner',
  backgroundColor = '#1f2937',
  headline = 'Ready to Get Started?',
  description = 'Join thousands of satisfied customers who trust us with their style.',
  button = { text: 'Book Now', link: '/book', style: 'primary' },
  size = 'normal',
  className = '',
  isPreview = false,
}) => {
  // Size classes
  const sizeClasses = {
    small: 'py-8 px-6',
    normal: 'py-16 px-6',
    large: 'py-24 px-8',
    xl: 'py-32 px-8'
  }

  // Style-specific classes and backgrounds
  const getStyleClasses = () => {
    switch (style) {
      case 'banner':
        return {
          container: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
          content: 'max-w-4xl mx-auto text-center',
          background: { backgroundColor }
        }
      case 'card':
        return {
          container: 'bg-white shadow-2xl rounded-2xl border',
          content: 'max-w-3xl mx-auto text-center p-8',
          background: {}
        }
      case 'minimal':
        return {
          container: 'bg-transparent',
          content: 'max-w-2xl mx-auto text-center',
          background: {}
        }
      case 'gradient':
        return {
          container: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white',
          content: 'max-w-4xl mx-auto text-center',
          background: {}
        }
      default:
        return {
          container: 'bg-gray-900 text-white',
          content: 'max-w-4xl mx-auto text-center',
          background: { backgroundColor }
        }
    }
  }

  // Button style classes
  const getButtonClasses = (buttonStyle: string) => {
    const baseClasses = 'inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 focus:outline-none focus:ring-4'
    
    switch (buttonStyle) {
      case 'primary':
        return `${baseClasses} bg-white text-gray-900 hover:bg-gray-100 focus:ring-white/20 shadow-lg hover:shadow-xl`
      case 'secondary':
        return `${baseClasses} bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:ring-white/20`
      case 'ghost':
        return `${baseClasses} bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 focus:ring-white/20`
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/20`
    }
  }

  const styleConfig = getStyleClasses()

  return (
    <section 
      id={id} 
      className={`cta-block ${sizeClasses[size]} ${className}`}
    >
      <div 
        className={`${styleConfig.container} relative overflow-hidden`}
        style={styleConfig.background}
      >
        {/* Background Effects */}
        {style === 'banner' && (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/20 to-transparent" />
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000" />
          </>
        )}

        {style === 'gradient' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20" />
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/20 rounded-full animate-ping" />
              <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-white/20 rounded-full animate-ping delay-500" />
              <div className="absolute top-1/2 left-3/4 w-8 h-8 bg-white/20 rounded-full animate-ping delay-1000" />
            </div>
          </>
        )}

        <div className={`${styleConfig.content} relative z-10`}>
          {/* Headline */}
          {headline && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className={style === 'card' || style === 'minimal' 
                ? 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
                : 'text-current'
              }>
                {headline}
              </span>
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
              style === 'card' || style === 'minimal' ? 'text-gray-600' : 'text-current opacity-90'
            }`}>
              {description}
            </p>
          )}

          {/* Button */}
          {button && button.text && button.link && (
            <div className="flex justify-center">
              <Link
                href={button.link}
                className={style === 'card' || style === 'minimal' 
                  ? `inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 focus:outline-none focus:ring-4 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/20 shadow-lg hover:shadow-xl`
                  : getButtonClasses(button.style)
                }
              >
                {button.text}
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* Additional Elements for Different Styles */}
          {style === 'card' && (
            <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free Consultation
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No Hidden Fees
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                100% Satisfaction
              </div>
            </div>
          )}

          {style === 'banner' && (
            <div className="mt-8 flex justify-center items-center space-x-6 text-sm text-white/80">
              <div className="flex items-center">
                ⭐⭐⭐⭐⭐
                <span className="ml-2">5-star rated</span>
              </div>
              <div className="w-px h-4 bg-white/30" />
              <div>1000+ happy customers</div>
              <div className="w-px h-4 bg-white/30" />
              <div>Same-day service</div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        {size === 'xl' && (
          <>
            <div className="absolute top-0 left-0 w-20 h-20 border-2 border-current/20 rounded-full transform -translate-x-10 -translate-y-10" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-2 border-current/20 rounded-full transform translate-x-16 translate-y-16" />
          </>
        )}
      </div>
    </section>
  )
}

export default CTABlock