import Link from 'next/link'
import { ArrowRight, Star, Users, Award, Clock, MapPin, Phone, Calendar, Zap, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// Dynamic import for heavy components to prevent SSR issues
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const VideoBackground = dynamic(() => import('@/lib/video-branding').then(mod => ({ default: mod.VideoBackground })), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
})
import { useAnalytics, trackBookingFunnel, EVENT_ACTIONS, EVENT_CATEGORIES } from '@/lib/analytics'
import { useCallback } from 'react'
import { Chat } from '@/components/Chat'

// Client component wrapper for interactive elements
"use client"
function ClientHomePage() {
  const { trackEvent } = useAnalytics()

  // Track button clicks and conversions
  const handleBookingClick = useCallback(() => {
    trackEvent({
      action: EVENT_ACTIONS.BUTTON_CLICK,
      category: EVENT_CATEGORIES.CONVERSION,
      label: 'hero_book_appointment',
      customParameters: {
        button_location: 'hero_section',
        button_text: 'Book Now - Instant Confirmation'
      }
    })
    trackBookingFunnel.start('hero_section')
  }, [trackEvent])

  const handleServicesClick = useCallback(() => {
    trackEvent({
      action: EVENT_ACTIONS.BUTTON_CLICK,
      category: EVENT_CATEGORIES.NAVIGATION,
      label: 'hero_view_services',
      customParameters: {
        button_location: 'hero_section',
        button_text: 'Explore Premium Services'
      }
    })
  }, [trackEvent])

  const handleServiceCardClick = useCallback((serviceName: string, serviceId: string) => {
    trackEvent({
      action: EVENT_ACTIONS.SERVICE_VIEWED,
      category: EVENT_CATEGORIES.SERVICE_INTERACTION,
      label: serviceId,
      customParameters: {
        service_name: serviceName,
        location: 'homepage_services_section'
      }
    })
  }, [trackEvent])

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <VideoBackground videoId="modern-men-haze">
          <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-32 right-16 w-16 h-16 bg-accent/20 rounded-full blur-lg"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
              <motion.div
                className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-md"
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
              />
            </div>

            <div className="text-center max-w-5xl mx-auto">
              {/* Dynamic Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-primary/80 to-accent/80 text-white border-white/30 backdrop-blur-sm px-6 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  🔥 Trusted by 10,000+ Gentlemen Worldwide
                </Badge>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                className="text-5xl lg:text-7xl font-black mb-8 text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Professional Grooming for the
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-pulse"
                  animate={{ backgroundPosition: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {' '}Modern Gentleman
                </motion.span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                className="text-xl lg:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience <strong className="text-primary">exceptional</strong> hair care and beard grooming in a
                <em className="text-accent"> sophisticated environment</em> designed for discerning men who demand excellence.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="text-xl px-10 py-7 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl border-2 border-white/20 font-bold"
                    onClick={handleBookingClick}
                  >
                    <Link href="/book" className="flex items-center">
                      <Zap className="mr-3 w-6 h-6" />
                      Book Now - Instant Confirmation
                      <ArrowRight className="ml-3 w-6 h-6" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-xl px-10 py-7 border-2 border-white/60 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm shadow-xl font-semibold"
                    onClick={handleServicesClick}
                  >
                    <Link href="/services" className="flex items-center">
                      <Award className="mr-3 w-6 h-6" />
                      Explore Premium Services
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Trust Indicators & Live Availability */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Shield className="w-8 h-8 text-primary mb-2" />
                  <span className="text-white font-semibold">Licensed & Insured</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Calendar className="w-8 h-8 text-accent mb-2" />
                  <span className="text-white font-semibold">24/7 Online Booking</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Star className="w-8 h-8 text-yellow-400 mb-2" />
                  <span className="text-white font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <span className="text-white font-semibold">10K+ Happy Clients</span>
                </div>

                {/* Live Availability Indicator */}
                <motion.div
                  className="flex flex-col items-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl border border-green-400/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="relative mb-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-green-400 rounded-full"
                      animate={{ opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <span className="text-white font-semibold text-center">
                    <motion.span
                      className="text-green-300"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      LIVE
                    </motion.span>
                    <br />
                    Available Now
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </VideoBackground>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/80 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-slate-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-slate-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-slate-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-slate-600">Online Booking</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From classic cuts to modern styles, we offer comprehensive grooming services tailored to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Hair Cuts & Styling</h3>
                <p className="text-slate-600 mb-4">
                  Professional haircuts and styling services using premium techniques and products.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$35+</span>
                  <Link
                    href="/services#haircuts"
                    onClick={() => handleServiceCardClick('Hair Cuts & Styling', 'hair-cuts-styling')}
                  >
                    <Button variant="ghost" className="group-hover:bg-primary group-hover:text-white">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Beard Grooming</h3>
                <p className="text-slate-600 mb-4">
                  Expert beard trimming, shaping, and maintenance for the perfect look.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$25+</span>
                  <Link
                    href="/services#beard"
                    onClick={() => handleServiceCardClick('Beard Grooming', 'beard-grooming')}
                  >
                    <Button variant="ghost" className="group-hover:bg-primary group-hover:text-white">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Combo Packages</h3>
                <p className="text-slate-600 mb-4">
                  Complete grooming packages combining multiple services for the best value.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$55+</span>
                  <Link
                    href="/services#combo"
                    onClick={() => handleServiceCardClick('Combo Packages', 'combo-packages')}
                  >
                    <Button variant="ghost" className="group-hover:bg-primary group-hover:text-white">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg">
              <Link href="/services" className="flex items-center">
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready for Your Next Appointment?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
            Book online instantly or call us to schedule your grooming session. We look forward to serving you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/book" className="flex items-center">
                Book Online Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Chat />
    </div>
  )
}

// Server component that renders the client component
export default function HomePage() {
  return (
    <VideoBackground videoId="modern-men-haze">
      <ClientHomePage />
    </VideoBackground>
  )
}

