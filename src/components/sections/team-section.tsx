'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { toast } from 'sonner'

interface Stylist {
  id: string
  name: string
  bio?: any
  profileImage?: any
  specializations?: any[]
  experience?: {
    yearsExperience?: number
    certifications?: any[]
    awards?: any[]
  }
  performance?: {
    rating?: number
    reviewCount?: number
    totalAppointments?: number
  }
  socialMedia?: {
    instagram?: string
    facebook?: string
    website?: string
  }
  featured?: boolean
  isActive?: boolean
  portfolio?: any[]
}

interface StylistResponse {
  stylists: Stylist[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export function TeamSection() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStylists()
  }, [])

  const fetchStylists = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stylists?featured=true&limit=6')
      if (!response.ok) {
        throw new Error('Failed to fetch stylists')
      }
      const data: StylistResponse = await response.json()
      setStylists(data.stylists)
    } catch (err) {
      console.error('Error fetching stylists:', err)
      setError(err instanceof Error ? err.message : 'Failed to load team members')
      toast.error('Failed to load team information')
    } finally {
      setLoading(false)
    }
  }

  const formatBio = (bio: any) => {
    if (!bio) return 'Professional stylist dedicated to exceptional service.'
    // Simple text extraction from rich text (this could be enhanced)
    if (typeof bio === 'string') return bio
    if (bio.root && bio.root.children) {
      return bio.root.children.map((child: any) => child.text || '').join(' ')
    }
    return 'Professional stylist dedicated to exceptional service.'
  }

  const getProfileImage = (stylist: Stylist) => {
    if (stylist.profileImage?.url) {
      return stylist.profileImage.url
    }
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }

  const getSpecializations = (stylist: Stylist) => {
    if (!stylist.specializations || stylist.specializations.length === 0) {
      return 'General Styling'
    }
    return stylist.specializations.map(spec => spec.name || spec.title).join(', ')
  }

  const handleBookAppointment = (stylist: Stylist) => {
    // Store selected stylist in localStorage for booking flow
    localStorage.setItem('selectedStylist', JSON.stringify({
      id: stylist.id,
      name: stylist.name
    }))
    toast.success(`Selected ${stylist.name} for booking`)
    // Navigate to booking page (this would need to be implemented)
    window.location.href = '/portal/book'
  }

  const handleViewProfile = (stylist: Stylist) => {
    window.location.href = `/team/${stylist.id}`
  }

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Meet Our Team
            </h2>
          </div>
          <div className="flex justify-center items-center min-h-[200px]">
            <Icons.spinner className="h-8 w-8 animate-spin text-amber-600" />
            <span className="ml-2 text-gray-300">Loading team members...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Meet Our Team
            </h2>
          </div>
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              onClick={fetchStylists}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Icons.refreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our team of incomparably talented stylists and barbers are passionate about
              delivering exceptional service and creating the perfect look for every client.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stylists.map((stylist, index) => (
            <motion.div
              key={stylist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="mb-6 relative">
                    <img
                      src={getProfileImage(stylist)}
                      alt={stylist.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-amber-600 group-hover:border-amber-400 transition-colors duration-300"
                    />
                    {stylist.performance?.rating && (
                      <div className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Icons.info className="h-3 w-3 mr-1" />
                        {stylist.performance.rating.toFixed(1)}★
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{stylist.name}</h3>
                  <p className="text-amber-400 font-medium mb-2">{getSpecializations(stylist)}</p>

                  {stylist.experience?.yearsExperience && (
                    <p className="text-gray-400 text-sm mb-2">
                      {stylist.experience.yearsExperience}+ years experience
                    </p>
                  )}

                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {formatBio(stylist.bio)}
                  </p>

                  {stylist.performance?.totalAppointments && (
                    <p className="text-gray-400 text-xs mb-4">
                      {stylist.performance.totalAppointments} appointments completed
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleBookAppointment(stylist)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-colors duration-200"
                    >
                      Book with {stylist.name.split(' ')[0]}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleViewProfile(stylist)}
                      className="w-full border-white/20 text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {stylists.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No team members available at the moment.</p>
            <p className="text-sm text-gray-500">Please check back later or contact us directly.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            onClick={() => window.location.href = '/team'}
            variant="outline"
            className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors duration-200"
          >
            View All Team Members
          </Button>
        </div>
      </div>
    </section>
  )
}