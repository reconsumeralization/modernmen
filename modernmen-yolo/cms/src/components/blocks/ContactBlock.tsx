'use client'

import React, { useState } from 'react'
import { BaseBlockProps } from './index'

interface ContactField {
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox'
  label: string
  placeholder?: string
  required: boolean
  options?: Array<{ label: string; value: string }>
}

interface ContactBlockProps extends BaseBlockProps {
  title?: string
  subtitle?: string
  fields: ContactField[]
  submitButtonText?: string
  successMessage?: string
  layout?: 'single' | 'two-column' | 'inline'
  isPreview?: boolean
}

export const ContactBlock: React.FC<ContactBlockProps> = ({
  id,
  title = 'Get In Touch',
  subtitle = "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  fields = [],
  submitButtonText = 'Send Message',
  successMessage = 'Thank you! Your message has been sent.',
  layout = 'single',
  className = '',
  isPreview = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (fieldLabel: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldLabel]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isPreview) return

    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
    
    // Reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({})
    }, 5000)
  }

  if (!fields || fields.length === 0) {
    return (
      <section id={id} className={`contact-block py-12 px-6 ${className}`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
            <p className="text-gray-500">📞 No form fields configured. Add some fields to display the contact form.</p>
          </div>
        </div>
      </section>
    )
  }

  // Layout classes
  const layoutClasses = {
    single: 'max-w-2xl',
    'two-column': 'max-w-4xl',
    inline: 'max-w-6xl'
  }

  const formClasses = {
    single: 'space-y-6',
    'two-column': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    inline: 'flex flex-wrap items-end gap-4'
  }

  if (submitted) {
    return (
      <section id={id} className={`contact-block py-16 px-6 bg-gradient-to-br from-green-50 to-emerald-50 ${className}`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id={id} className={`contact-block py-16 px-6 bg-gray-50 ${className}`}>
      <div className={`${layoutClasses[layout]} mx-auto`}>
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

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className={formClasses[layout]}>
            {fields.map((field, index) => (
              <FormField
                key={index}
                field={field}
                value={formData[field.label] || ''}
                onChange={(value) => handleInputChange(field.label, value)}
                layout={layout}
                isPreview={isPreview}
              />
            ))}

            {/* Submit Button */}
            <div className={layout === 'inline' ? 'flex-shrink-0' : 'col-span-full'}>
              <button
                type="submit"
                disabled={isSubmitting || isPreview}
                className={`w-full bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ${
                  layout === 'inline' ? 'w-auto' : ''
                } ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:transform hover:scale-105'
                } ${
                  isPreview ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {submitButtonText}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">info@example.com</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">(555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Response</p>
                  <p className="text-sm text-gray-600">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Form Field Component
const FormField: React.FC<{
  field: ContactField
  value: any
  onChange: (value: any) => void
  layout: string
  isPreview: boolean
}> = ({ field, value, onChange, layout, isPreview }) => {
  const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2"

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isPreview}
            className={`${baseClasses} h-32 resize-vertical`}
            rows={4}
          />
        )
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={isPreview}
            className={baseClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              required={field.required}
              disabled={isPreview}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{field.placeholder || field.label}</span>
          </div>
        )
      
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isPreview}
            className={baseClasses}
          />
        )
    }
  }

  if (field.type === 'checkbox') {
    return (
      <div className={layout === 'two-column' ? 'col-span-full' : ''}>
        {renderField()}
      </div>
    )
  }

  return (
    <div className={layout === 'inline' ? 'flex-1 min-w-0' : ''}>
      <label className={labelClasses}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  )
}

export default ContactBlock