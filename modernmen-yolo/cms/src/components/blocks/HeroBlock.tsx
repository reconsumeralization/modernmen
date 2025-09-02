'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BaseBlockProps } from './index'

interface HeroBlockProps extends BaseBlockProps {
  style?: 'gradient' | 'image' | 'video' | 'solid' | 'particles'
  backgroundImage?: any
  backgroundVideo?: string
  backgroundColor?: string
  height?: 'small' | 'medium' | 'large' | 'fullscreen'
  headline?: string
  subheadline?: string
  ctaButtons?: Array<{
    text: string
    link: string
    style: 'primary' | 'secondary' | 'ghost' | 'link'
    icon?: string
  }>
  textAlign?: 'left' | 'center' | 'right'
  overlay?: boolean
  isPreview?: boolean
}

const iconMap: { [key: string]: string } = {
  calendar: '📅',
  phone: '📞',
  scissors: '✂️',
  star: '⭐',
  rocket: '🚀',
}

export const HeroBlock: React.FC<HeroBlockProps> = ({
  id,
  style = 'gradient',
  backgroundImage,
  backgroundVideo,
  backgroundColor = '#1f2937',
  height = 'large',
  headline = 'Welcome to Our Business',
  subheadline = 'Experience exceptional service and quality that exceeds your expectations.',
  ctaButtons = [],
  textAlign = 'center',
  overlay = true,
  className = '',
  isPreview = false,
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [particlesEnabled, setParticlesEnabled] = useState(false)

  useEffect(() => {
    if (style === 'particles' && !isPreview) {
      setParticlesEnabled(true)
    }
  }, [style, isPreview])

  // Height classes
  const heightClasses = {
    small: 'h-96',
    medium: 'h-[600px]',
    large: 'h-[800px]',
    fullscreen: 'min-h-screen'
  }

  // Text alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  // Background styles
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (style) {
      case 'solid':
        return { backgroundColor: backgroundColor || '#1f2937' }
      
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backgroundColor || '#1f2937'} 0%, ${adjustColor(backgroundColor || '#1f2937', -20)} 100%)`
        }
      
      case 'image':
        return backgroundImage?.url ? {
          backgroundImage: `url(${backgroundImage.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isPreview ? 'scroll' : 'fixed'
        } : { backgroundColor: backgroundColor || '#1f2937' }
      
      case 'video':
        return { backgroundColor: backgroundColor || '#1f2937' }
      
      case 'particles':
        return {
          background: `linear-gradient(135deg, ${backgroundColor || '#1f2937'} 0%, ${adjustColor(backgroundColor || '#1f2937', -30)} 100%)`
        }
      
      default:
        return { backgroundColor: backgroundColor || '#1f2937' }
    }
  }

  // Button style classes
  const getButtonClasses = (buttonStyle: string) => {
    const baseClasses = 'inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:transform hover:scale-105 focus:outline-none focus:ring-4'
    
    switch (buttonStyle) {
      case 'primary':
        return `${baseClasses} bg-white text-gray-900 hover:bg-gray-100 focus:ring-white/20 shadow-lg hover:shadow-xl`
      case 'secondary':
        return `${baseClasses} bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:ring-white/20`
      case 'ghost':
        return `${baseClasses} bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 focus:ring-white/20`
      case 'link':
        return `${baseClasses} bg-transparent text-white underline hover:text-gray-200 focus:ring-white/20`
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/20`
    }
  }

  // Helper function to adjust color brightness
  function adjustColor(color: string, amount: number): string {
    const usePound = color[0] === '#'
    const col = usePound ? color.slice(1) : color
    const num = parseInt(col, 16)
    let r = (num >> 16) + amount
    let b = ((num >> 8) & 0x00FF) + amount
    let g = (num & 0x0000FF) + amount
    r = r > 255 ? 255 : r < 0 ? 0 : r
    b = b > 255 ? 255 : b < 0 ? 0 : b
    g = g > 255 ? 255 : g < 0 ? 0 : g
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
  }

  return (
    <section
      id={id}
      className={`hero-block relative ${heightClasses[height]} flex items-center justify-center overflow-hidden ${className}`}
      style={getBackgroundStyle()}
    >
      {/* Video Background */}
      {style === 'video' && backgroundVideo && !isPreview && (
        <div className="absolute inset-0 z-0">
          {backgroundVideo.includes('youtube.com') || backgroundVideo.includes('youtu.be') ? (
            <iframe
              src={`${backgroundVideo}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeID(backgroundVideo)}&controls=0&showinfo=0&rel=0`}
              className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2"
              frameBorder="0"
              allow="autoplay; muted"
              onLoad={() => setIsVideoLoaded(true)}
            />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
              onLoadedData={() => setIsVideoLoaded(true)}
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          )}
        </div>
      )}

      {/* Particles Background */}
      {style === 'particles' && particlesEnabled && !isPreview && (
        <div className="absolute inset-0 z-0">
          <ParticlesBackground />
        </div>
      )}

      {/* Overlay */}
      {overlay && (style === 'image' || style === 'video') && (
        <div className="absolute inset-0 bg-black/50 z-10" />
      )}

      {/* Content */}
      <div className={`relative z-20 max-w-6xl mx-auto px-6 ${alignClasses[textAlign]}`}>
        <div className="space-y-6">
          {/* Headline */}
          {headline && (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {headline}
              </span>
            </h1>
          )}

          {/* Subheadline */}
          {subheadline && (
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {subheadline}
            </p>
          )}

          {/* CTA Buttons */}
          {ctaButtons && ctaButtons.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center items-center pt-4">
              {ctaButtons.map((button, index) => (
                <Link
                  key={index}
                  href={button.link || '#'}
                  className={getButtonClasses(button.style)}
                >
                  {button.icon && iconMap[button.icon] && (
                    <span className="mr-2 text-lg">{iconMap[button.icon]}</span>
                  )}
                  {button.text}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        {height === 'fullscreen' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute top-1/3 right-20 w-2 h-2 bg-white/40 rounded-full animate-ping hidden lg:block" />
      <div className="absolute bottom-1/3 left-20 w-2 h-2 bg-white/40 rounded-full animate-ping hidden lg:block" />
    </section>
  )
}

// Helper component for particles background
const ParticlesBackground: React.FC = () => {
  return (
    <div className="particles-container absolute inset-0">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}

// Helper function to extract YouTube video ID
const getYouTubeID = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}

export default HeroBlock