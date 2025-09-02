import Link from 'next/link'
import { ArrowRight, Award, Clock, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ModernMen branded service icon
const ModernMenServiceIcon = () => (
  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
    <span className="text-white text-sm font-bold">M</span>
  </div>
)

const services = [
  {
    id: 'classic-cut',
    name: 'Classic Haircut',
    description: 'Traditional barbering techniques with modern precision',
    duration: '30 min',
    price: 35,
    icon: ModernMenServiceIcon,
    features: ['Consultation', 'Wash & Cut', 'Style & Finish', 'Aftercare Advice'],
    popular: false,
  },
  {
    id: 'modern-fade',
    name: 'Modern Fade',
    description: 'Contemporary fade cuts with precision blending',
    duration: '45 min',
    price: 45,
    icon: ModernMenServiceIcon,
    features: ['Consultation', 'Wash & Cut', 'Precision Fade', 'Style & Finish'],
    popular: true,
  },
  {
    id: 'beard-trim',
    name: 'Beard Trim & Shape',
    description: 'Expert beard trimming and shaping services',
    duration: '25 min',
    price: 25,
    icon: Award,
    features: ['Consultation', 'Trim & Shape', 'Edge Definition', 'Product Application'],
    popular: false,
  },
  {
    id: 'beard-maintenance',
    name: 'Beard Maintenance',
    description: 'Complete beard care including wash, trim, and conditioning',
    duration: '35 min',
    price: 35,
    icon: Award,
    features: ['Wash & Conditioning', 'Trim & Shape', 'Hot Towel Treatment', 'Product Application'],
    popular: false,
  },
  {
    id: 'hair-beard-combo',
    name: 'Hair & Beard Combo',
    description: 'Complete grooming package for the discerning gentleman',
    duration: '55 min',
    price: 55,
    icon: Clock,
    features: ['Haircut', 'Beard Grooming', 'Hot Towel Treatment', 'Styling Products'],
    popular: true,
  },
  {
    id: 'executive-package',
    name: 'Executive Package',
    description: 'Premium grooming experience with all services included',
    duration: '75 min',
    price: 85,
    icon: Star,
    features: ['Haircut', 'Beard Grooming', 'Scalp Massage', 'Premium Products', 'Beverage Service'],
    popular: false,
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Professional grooming services tailored for the modern gentleman.
              From classic cuts to contemporary styles, we deliver exceptional results every time.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="relative">
                    {service.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-primary">
                        Most Popular
                      </Badge>
                    )}
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{service.name}</CardTitle>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-primary">${service.price}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 text-center">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                    <Link href={`/book?service=${service.id}`} className="flex items-center justify-center">
                      Book Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience our streamlined grooming process designed for your comfort and satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Consultation</h3>
              <p className="text-slate-600">
                We discuss your preferences, lifestyle, and desired outcome to create a personalized plan.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Preparation</h3>
              <p className="text-slate-600">
                Your stylist prepares the perfect environment and tools for your specific service.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Service</h3>
              <p className="text-slate-600">
                Expert execution with precision techniques and premium products for outstanding results.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Finishing</h3>
              <p className="text-slate-600">
                Final styling, product recommendations, and aftercare advice for lasting results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Book Your Service?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
            Choose your preferred service and schedule an appointment with one of our expert barbers.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/book" className="flex items-center">
              Book Your Appointment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
