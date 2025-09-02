'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { BaseBlockProps } from './index'

interface GalleryImage {
  image: any
  caption?: string
  alt: string
}

interface GalleryBlockProps extends BaseBlockProps {
  images: GalleryImage[]
  layout?: 'grid' | 'masonry' | 'carousel' | 'lightbox'
  columns?: '1' | '2' | '3' | '4' | '6'
  spacing?: 'tight' | 'normal' | 'loose'
  isPreview?: boolean
}

export const GalleryBlock: React.FC<GalleryBlockProps> = ({
  id,
  images = [],
  layout = 'grid',
  columns = '3',
  spacing = 'normal',
  className = '',
  isPreview = false,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  if (!images || images.length === 0) {
    return (
      <section id={id} className={`gallery-block py-12 px-6 ${className}`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
            <p className="text-gray-500">🖼️ No images configured. Add some images to display them here.</p>
          </div>
        </div>
      </section>
    )
  }

  // Column classes
  const columnClasses = {
    '1': 'columns-1',
    '2': 'columns-1 sm:columns-2',
    '3': 'columns-1 sm:columns-2 lg:columns-3',
    '4': 'columns-1 sm:columns-2 md:columns-3 lg:columns-4',
    '6': 'columns-2 sm:columns-3 md:columns-4 lg:columns-6'
  }

  const gridClasses = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    '6': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
  }

  // Spacing classes
  const spacingClasses = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-8'
  }

  const openLightbox = (index: number) => {
    if (layout === 'lightbox' && !isPreview) {
      setCurrentImage(index)
      setLightboxOpen(true)
    }
  }

  return (
    <section id={id} className={`gallery-block py-16 px-6 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Grid Layout */}
        {(layout === 'grid' || layout === 'lightbox') && (
          <div className={`grid ${gridClasses[columns]} ${spacingClasses[spacing]}`}>
            {images.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={item.image?.url || '/placeholder-image.jpg'}
                    alt={item.alt || 'Gallery image'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {layout === 'lightbox' && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                {item.caption && (
                  <div className="p-3">
                    <p className="text-sm text-gray-600">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Masonry Layout */}
        {layout === 'masonry' && (
          <div className={`${columnClasses[columns]} ${spacingClasses[spacing]}`}>
            {images.map((item, index) => (
              <div key={index} className="break-inside-avoid mb-4">
                <div className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300">
                  <Image
                    src={item.image?.url || '/placeholder-image.jpg'}
                    alt={item.alt || 'Gallery image'}
                    width={400}
                    height={600}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.caption && (
                    <div className="p-3">
                      <p className="text-sm text-gray-600">{item.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carousel Layout */}
        {layout === 'carousel' && !isPreview && (
          <CarouselGallery images={images} />
        )}

        {/* Carousel fallback for preview */}
        {layout === 'carousel' && isPreview && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.slice(0, 3).map((item, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={item.image?.url || '/placeholder-image.jpg'}
                  alt={item.alt || 'Gallery image'}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && !isPreview && (
        <LightboxModal
          images={images}
          currentIndex={currentImage}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setCurrentImage((prev) => (prev + 1) % images.length)}
          onPrev={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
        />
      )}
    </section>
  )
}

// Carousel Gallery Component
const CarouselGallery: React.FC<{ images: GalleryImage[] }> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-200">
        <Image
          src={images[currentSlide]?.image?.url || '/placeholder-image.jpg'}
          alt={images[currentSlide]?.alt || 'Gallery image'}
          fill
          className="object-cover"
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Caption */}
      {images[currentSlide]?.caption && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">{images[currentSlide].caption}</p>
        </div>
      )}

      {/* Thumbnail Strip */}
      <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
        {images.map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden ${
              index === currentSlide ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={item.image?.url || '/placeholder-image.jpg'}
              alt={item.alt || 'Gallery thumbnail'}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

// Lightbox Modal Component
const LightboxModal: React.FC<{
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}> = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
      >
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
      >
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main Image */}
      <div className="relative max-w-5xl max-h-[90vh] mx-4">
        <Image
          src={images[currentIndex]?.image?.url || '/placeholder-image.jpg'}
          alt={images[currentIndex]?.alt || 'Gallery image'}
          width={1200}
          height={800}
          className="max-w-full max-h-full object-contain"
        />
        
        {/* Caption */}
        {images[currentIndex]?.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
            <p className="text-center">{images[currentIndex].caption}</p>
          </div>
        )}
      </div>

      {/* Image Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

export default GalleryBlock