'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BaseBlockProps } from './index'

interface Service {
  icon?: string
  title: string
  description: string
  price?: string
  image?: any
  link?: string
}

interface ServicesBlockProps extends BaseBlockProps {
  title?: string
  subtitle?: string
  services: Service[]
  layout?: 'cards' | 'list' | 'grid' | 'carousel'
  columns?: '1' | '2' | '3' | '4'
  isPreview?: boolean
}

const iconMap: { [key: string]: string } = {
  scissors: '✂️',
  beard: '🧔',
  haircut: '💇',
  color: '🎨',
  massage: '💆',
  style: '🕴️',
  flash: '⚡',
  target: '🎯',
  diamond: '💎',
  rocket: '🚀',
}

export const ServicesBlock: React.FC<ServicesBlockProps> = ({
  id,
  title,
  subtitle,
  services = [],
  layout = 'cards',
  columns = '3',
  className = '',
  isPreview = false,
}) => {
  if (!services || services.length === 0) {
    return (
      <section id={id} className={`services-block py-12 px-6 ${className}`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
            <p className="text-gray-500">⚡ No services configured. Add some services to display them here.</p>
          </div>
        </div>
      </section>
    )
  }

  // Column classes for grid layouts
  const columnClasses = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <section id={id} className={`services-block py-16 px-6 bg-white ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Services */}
        {layout === 'cards' && (
          <div className={`grid ${columnClasses[columns]} gap-8`}>
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        )}

        {layout === 'list' && (
          <div className="space-y-6">
            {services.map((service, index) => (
              <ServiceListItem key={index} service={service} />
            ))}
          </div>
        )}

        {layout === 'grid' && (
          <div className={`grid ${columnClasses[columns]} gap-6`}>
            {services.map((service, index) => (
              <ServiceGridItem key={index} service={service} />
            ))}
          </div>
        )}

        {layout === 'carousel' && !isPreview && (
          <ServiceCarousel services={services} />
        )}

        {layout === 'carousel' && isPreview && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Service Card Component
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const CardContent = () => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      {service.image?.url && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={service.image.url}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        {/* Icon & Title */}
        <div className="flex items-center mb-3">
          {service.icon && iconMap[service.icon] && (
            <span className="text-2xl mr-3 transform group-hover:scale-110 transition-transform">
              {iconMap[service.icon]}
            </span>
          )}
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-4">
          {service.description}
        </p>
        
        {/* Price */}
        {service.price && (
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">{service.price}</span>
          </div>
        )}
      </div>
    </div>
  )

  if (service.link) {
    return (
      <Link href={service.link} className="block transform hover:scale-105 transition-transform">
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}

// Service List Item Component
const ServiceListItem: React.FC<{ service: Service }> = ({ service }) => {
  const ListContent = () => (
    <div className="flex items-start space-x-6 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group">
      {/* Icon */}
      {service.icon && iconMap[service.icon] && (
        <div className="flex-shrink-0">
          <span className="text-3xl transform group-hover:scale-110 transition-transform">
            {iconMap[service.icon]}
          </span>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>
          {service.price && (
            <span className="text-xl font-bold text-blue-600 ml-4">
              {service.price}
            </span>
          )}
        </div>
        <p className="text-gray-600 leading-relaxed">
          {service.description}
        </p>
      </div>
      
      {/* Image */}
      {service.image?.url && (
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
          <Image
            src={service.image.url}
            alt={service.title}
            width={80}
            height={80}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          />
        </div>
      )}
    </div>
  )

  if (service.link) {
    return (
      <Link href={service.link} className="block">
        <ListContent />
      </Link>
    )
  }

  return <ListContent />
}

// Service Grid Item Component
const ServiceGridItem: React.FC<{ service: Service }> = ({ service }) => {
  const GridContent = () => (
    <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all group">
      {/* Icon */}
      {service.icon && iconMap[service.icon] && (
        <div className="mb-4">
          <span className="text-4xl transform group-hover:scale-110 transition-transform inline-block">
            {iconMap[service.icon]}
          </span>
        </div>
      )}
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {service.title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 text-sm mb-3">
        {service.description}
      </p>
      
      {/* Price */}
      {service.price && (
        <div className="text-lg font-bold text-blue-600">
          {service.price}
        </div>
      )}
    </div>
  )

  if (service.link) {
    return (
      <Link href={service.link} className="block transform hover:scale-105 transition-transform">
        <GridContent />
      </Link>
    )
  }

  return <GridContent />
}

// Service Carousel Component (simplified for demo)
const ServiceCarousel: React.FC<{ services: Service[] }> = ({ services }) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-6 pb-4" style={{ width: `${services.length * 320}px` }}>
        {services.map((service, index) => (
          <div key={index} className="w-80 flex-shrink-0">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServicesBlock