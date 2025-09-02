'use client'

import React from 'react'
import { BaseBlockProps } from './index'

interface TestimonialsBlockProps extends BaseBlockProps {
  title?: string
  testimonials?: any[]
  layout?: 'carousel' | 'grid' | 'list' | 'cards'
  showRating?: boolean
  showPhoto?: boolean
  isPreview?: boolean
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  id,
  title = 'What Our Clients Say',
  testimonials = [],
  layout = 'carousel',
  showRating = true,
  showPhoto = true,
  className = '',
  isPreview = false,
}) => {
  // Mock data for preview
  const mockTestimonials = [
    {
      content: 'Amazing service! The team was professional and the results exceeded my expectations.',
      customerName: 'Mike Johnson',
      rating: 5
    },
    {
      content: 'Best experience I\'ve had. Highly recommend to anyone looking for quality service.',
      customerName: 'Sarah Davis',  
      rating: 5
    }
  ]

  const reviews = testimonials.length > 0 ? testimonials : mockTestimonials

  return (
    <section id={id} className={`testimonials-block py-16 px-6 bg-gray-50 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <TestimonialCard key={index} review={review} showRating={showRating} />
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialCard: React.FC<{ review: any; showRating: boolean }> = ({ review, showRating }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    {showRating && review.rating && (
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )}
    <p className="text-gray-700 mb-4 leading-relaxed">"{review.content || review.comment}"</p>
    <div className="flex items-center">
      <div>
        <p className="font-semibold text-gray-900">{review.customerName || review.customer?.name}</p>
      </div>
    </div>
  </div>
)

export default TestimonialsBlock