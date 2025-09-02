import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Users, Star } from 'lucide-react'

const galleryItems = {
  haircuts: [
    { id: 1, title: 'Classic Fade', category: 'Modern Cuts', image: '/placeholder-work.jpg' },
    { id: 2, title: 'Traditional Crew Cut', category: 'Classic Cuts', image: '/placeholder-work.jpg' },
    { id: 3, title: 'Textured Crop', category: 'Modern Cuts', image: '/placeholder-work.jpg' },
    { id: 4, title: 'Undercut Style', category: 'Modern Cuts', image: '/placeholder-work.jpg' },
    { id: 5, title: 'Business Professional', category: 'Classic Cuts', image: '/placeholder-work.jpg' },
    { id: 6, title: 'Casual Quiff', category: 'Modern Cuts', image: '/placeholder-work.jpg' },
  ],
  beards: [
    { id: 7, title: 'Full Beard Groom', category: 'Beard Care', image: '/placeholder-work.jpg' },
    { id: 8, title: 'Designer Stubble', category: 'Beard Care', image: '/placeholder-work.jpg' },
    { id: 9, title: 'Clean Shave', category: 'Shaving', image: '/placeholder-work.jpg' },
    { id: 10, title: 'Beard Sculpting', category: 'Beard Care', image: '/placeholder-work.jpg' },
    { id: 11, title: 'Mustache Trim', category: 'Beard Care', image: '/placeholder-work.jpg' },
    { id: 12, title: 'Hot Towel Shave', category: 'Shaving', image: '/placeholder-work.jpg' },
  ],
  salon: [
    { id: 13, title: 'Main Salon Area', category: 'Salon', image: '/placeholder-work.jpg' },
    { id: 14, title: 'Barber Stations', category: 'Salon', image: '/placeholder-work.jpg' },
    { id: 15, title: 'Waiting Area', category: 'Salon', image: '/placeholder-work.jpg' },
    { id: 16, title: 'Product Display', category: '/placeholder-work.jpg' },
    { id: 17, title: 'Private Consultation', category: 'Salon', image: '/placeholder-work.jpg' },
    { id: 18, title: 'Equipment & Tools', category: 'Salon', image: '/placeholder-work.jpg' },
  ],
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Our Work Gallery
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Explore our portfolio of professional grooming services and see the quality
              craftsmanship that has made us a trusted name in men's grooming.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                <span>500+ Transformations</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>10,000+ Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="haircuts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="haircuts" className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                Haircuts & Styles
              </TabsTrigger>
              <TabsTrigger value="beards" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Beards & Shaving
              </TabsTrigger>
              <TabsTrigger value="salon" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Salon Atmosphere
              </TabsTrigger>
            </TabsList>

            {/* Haircuts Tab */}
            <TabsContent value="haircuts">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.haircuts.map((item) => (
                  <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-slate-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-slate-500" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Beards Tab */}
            <TabsContent value="beards">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.beards.map((item) => (
                  <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-slate-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-slate-500" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Salon Tab */}
            <TabsContent value="salon">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.salon.map((item) => (
                  <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-slate-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-slate-500" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about their experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Mike gave me exactly the look I was going for. Professional, precise, and great conversation throughout.
                  Will definitely be back!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-semibold">John D.</div>
                    <div className="text-sm text-muted-foreground">Regular Client</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The beard grooming service is exceptional. Sarah really knows how to shape and style facial hair.
                  Highly recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Mike R.</div>
                    <div className="text-sm text-muted-foreground">Beard Care Client</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Clean, professional environment with friendly staff. The attention to detail is impressive.
                  My go-to barber shop!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-semibold">David L.</div>
                    <div className="text-sm text-muted-foreground">Executive Client</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready for Your Transformation?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
            Experience the same professional grooming services that have delighted thousands of satisfied clients.
            Book your appointment today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Book Your Appointment
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
              View Our Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
