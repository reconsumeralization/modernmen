'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
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

export default function TeamPage() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    fetchAllStylists()
  }, [])

  const fetchAllStylists = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stylists?limit=50')
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
      return ['General Styling']
    }
    return stylist.specializations.map(spec => spec.name || spec.title || spec)
  }

  const handleBookAppointment = (stylist: Stylist) => {
    localStorage.setItem('selectedStylist', JSON.stringify({
      id: stylist.id,
      name: stylist.name
    }))
    toast.success(`Selected ${stylist.name} for booking`)
    window.location.href = '/portal/book'
  }

  const handleViewProfile = (stylist: Stylist) => {
    setSelectedStylist(stylist)
    setShowProfileModal(true)
  }

  const closeProfileModal = () => {
    setShowProfileModal(false)
    setSelectedStylist(null)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">☆</span>)
      } else {
        stars.push(<span key={i} className="text-gray-400">☆</span>)
      }
    }
    return stars
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Team</h2>
          <p className="text-gray-600">Please wait while we load our talented team...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Icons.x className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Team</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={fetchAllStylists}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Icons.refreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-amber-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl mr-4">✂</span>
                <h1 className="text-5xl font-bold">Our Team</h1>
              </div>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Meet the talented professionals who make Modern Men Salon the premier destination
                for men's grooming in the area.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {stylists.length === 0 ? (
          <div className="text-center py-16">
            <Icons.users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Team Members Found</h2>
            <p className="text-gray-600 mb-4">We're working on building our team. Check back soon!</p>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="text-gray-600">
                Showing {stylists.length} team {stylists.length === 1 ? 'member' : 'members'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stylists.map((stylist, index) => (
                <motion.div
                  key={stylist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="relative">
                        <img
                          src={getProfileImage(stylist)}
                          alt={stylist.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-600 group-hover:border-amber-400 transition-colors duration-300"
                        />
                        {stylist.featured && (
                          <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs">
                            Featured
                          </Badge>
                        )}
                        {stylist.performance?.rating && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            {renderStars(stylist.performance.rating)}
                          </div>
                        )}
                      </div>
                      <div className="text-center mt-4">
                        <CardTitle className="text-lg font-bold text-gray-800">{stylist.name}</CardTitle>
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                          {getSpecializations(stylist).slice(0, 2).map((spec, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {stylist.experience?.yearsExperience && (
                        <p className="text-sm text-gray-600 text-center mb-3">
                          {stylist.experience.yearsExperience}+ years experience
                        </p>
                      )}

                      <p className="text-sm text-gray-700 text-center mb-4">
                        {formatBio(stylist.bio).length > 80
                          ? `${formatBio(stylist.bio).substring(0, 80)}...`
                          : formatBio(stylist.bio)
                        }
                      </p>

                      {stylist.performance?.totalAppointments && (
                        <p className="text-xs text-gray-500 text-center mb-4">
                          {stylist.performance.totalAppointments} appointments completed
                        </p>
                      )}

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleBookAppointment(stylist)}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm py-2"
                        >
                          Book Appointment
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleViewProfile(stylist)}
                          className="w-full border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white text-sm py-2"
                        >
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedStylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedStylist.name}'s Profile</h2>
                <Button
                  variant="ghost"
                  onClick={closeProfileModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icons.x className="h-6 w-6" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Image and Basic Info */}
                <div className="lg:col-span-1">
                  <img
                    src={getProfileImage(selectedStylist)}
                    alt={selectedStylist.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-amber-600 mb-4"
                  />

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedStylist.name}</h3>

                    {selectedStylist.performance?.rating && (
                      <div className="flex items-center justify-center mb-2">
                        {renderStars(selectedStylist.performance.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          ({selectedStylist.performance.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}

                    {selectedStylist.experience?.yearsExperience && (
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedStylist.experience.yearsExperience}+ years experience
                      </p>
                    )}

                    <div className="flex flex-wrap justify-center gap-1 mb-4">
                      {getSpecializations(selectedStylist).map((spec, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleBookAppointment(selectedStylist)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white mb-2"
                    >
                      Book with {selectedStylist.name}
                    </Button>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">About</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {formatBio(selectedStylist.bio)}
                      </p>
                    </div>

                    {/* Performance Stats */}
                    {selectedStylist.performance && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Performance</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Total Appointments</p>
                            <p className="text-xl font-bold text-gray-800">
                              {selectedStylist.performance.totalAppointments || 0}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Rating</p>
                            <p className="text-xl font-bold text-gray-800">
                              {selectedStylist.performance.rating?.toFixed(1) || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {selectedStylist.experience && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Experience & Qualifications</h4>

                        {selectedStylist.experience.certifications && selectedStylist.experience.certifications.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-800 mb-2">Certifications</h5>
                            <div className="space-y-1">
                              {selectedStylist.experience.certifications.map((cert: any, i: number) => (
                                <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                  <span className="text-sm text-gray-700">{cert.name}</span>
                                  {cert.year && <span className="text-xs text-gray-500">{cert.year}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedStylist.experience.awards && selectedStylist.experience.awards.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Awards</h5>
                            <div className="space-y-1">
                              {selectedStylist.experience.awards.map((award: any, i: number) => (
                                <div key={i} className="flex justify-between items-center bg-amber-50 p-2 rounded">
                                  <span className="text-sm text-gray-700">{award.name}</span>
                                  {award.year && <span className="text-xs text-amber-600">{award.year}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Social Media */}
                    {selectedStylist.socialMedia && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Connect</h4>
                        <div className="flex space-x-4">
                          {selectedStylist.socialMedia.instagram && (
                            <a
                              href={selectedStylist.socialMedia.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-pink-600 transition-colors"
                            >
                              <Icons.phone className="h-6 w-6" />
                            </a>
                          )}
                          {selectedStylist.socialMedia.facebook && (
                            <a
                              href={selectedStylist.socialMedia.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <Icons.users className="h-6 w-6" />
                            </a>
                          )}
                          {selectedStylist.socialMedia.website && (
                            <a
                              href={selectedStylist.socialMedia.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-green-600 transition-colors"
                            >
                              <Icons.externalLink className="h-6 w-6" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
