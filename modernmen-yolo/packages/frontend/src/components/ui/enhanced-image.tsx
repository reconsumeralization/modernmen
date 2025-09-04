'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { X, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EnhancedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  enableLightbox?: boolean
  lightboxTitle?: string
}

export function EnhancedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  enableLightbox = true,
  lightboxTitle
}: EnhancedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-center text-muted-foreground">
          <div className="text-2xl mb-2">📷</div>
          <div className="text-sm">Image not available</div>
        </div>
      </div>
    )
  }

  const imageContent = (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {enableLightbox && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      )}
    </div>
  )

  if (!enableLightbox) {
    return imageContent
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          {imageContent}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] p-0">
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="max-w-full max-h-full object-contain"
            quality={95}
          />
          {lightboxTitle && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
              <h3 className="text-lg font-semibold">{lightboxTitle}</h3>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => {}}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Gallery Grid Component
interface GalleryGridProps {
  images: Array<{
    id: string
    src: string
    alt: string
    title?: string
    category?: string
  }>
  columns?: number
  className?: string
}

export function GalleryGrid({ images, columns = 3, className = '' }: GalleryGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  return (
    <div className={`grid gap-4 ${gridCols[columns as keyof typeof gridCols]} ${className}`}>
      {images.map((image) => (
        <div key={image.id} className="group relative overflow-hidden rounded-lg">
          <EnhancedImage
            src={image.src}
            alt={image.alt}
            width={400}
            height={300}
            className="w-full h-64"
            lightboxTitle={image.title}
            enableLightbox={true}
          />
          {(image.title || image.category) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {image.title && <h3 className="font-semibold mb-1">{image.title}</h3>}
                {image.category && <p className="text-sm opacity-90">{image.category}</p>}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
