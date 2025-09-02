import Link from 'next/link'
import { ArrowRight, Star, Users, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 10,000+ Gentlemen
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Professional Grooming for the
              <span className="text-primary"> Modern Gentleman</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Experience exceptional hair care and beard grooming services in a sophisticated environment designed for discerning men.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Link href="/book" className="flex items-center">
                  Book Appointment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-slate-900">
                <Link href="/services">
                  View Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
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
                  <Link href="/services#haircuts">
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
                  <Link href="/services#beard">
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
                  <Link href="/services#combo">
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
    </div>
  )
}
