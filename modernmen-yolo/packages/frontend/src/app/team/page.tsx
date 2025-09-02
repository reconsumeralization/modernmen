import { Star, Award, Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const teamMembers = [
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    role: 'Master Barber & Owner',
    image: '/placeholder-user.jpg',
    bio: 'With over 15 years of experience, Mike specializes in classic cuts and traditional barbering techniques. He founded Modern Men to bring professional grooming services to discerning gentlemen.',
    specialties: ['Classic Cuts', 'Traditional Fades', 'Beard Sculpting'],
    experience: '15+ years',
    rating: 4.9,
    reviews: 250,
    availability: 'Mon-Fri: 9AM-7PM',
  },
  {
    id: 'sarah-davis',
    name: 'Sarah Davis',
    role: 'Senior Stylist',
    image: '/placeholder-user.jpg',
    bio: 'Sarah brings contemporary styling expertise with a focus on modern techniques and trends. Her innovative approach keeps our clients looking sharp and current.',
    specialties: ['Modern Fades', 'Beard Grooming', 'Color Consultation'],
    experience: '8 years',
    rating: 4.8,
    reviews: 180,
    availability: 'Tue-Sat: 10AM-8PM',
  },
  {
    id: 'alex-rodriguez',
    name: 'Alex Rodriguez',
    role: 'Style Specialist',
    image: '/placeholder-user.jpg',
    bio: 'Alex is our color and styling expert, specializing in advanced techniques and creative cuts. He helps clients express their unique style through innovative approaches.',
    specialties: ['Creative Cuts', 'Hair Color', 'Advanced Styling'],
    experience: '6 years',
    rating: 4.7,
    reviews: 120,
    availability: 'Wed-Sun: 11AM-7PM',
  },
  {
    id: 'jordan-smith',
    name: 'Jordan Smith',
    role: 'Apprentice Barber',
    image: '/placeholder-user.jpg',
    bio: 'Jordan is our talented apprentice bringing fresh energy and new techniques to our team. Under Mike\'s mentorship, he\'s developing into an exceptional barber.',
    specialties: ['Contemporary Cuts', 'Beard Design', 'Client Consultation'],
    experience: '2 years',
    rating: 4.6,
    reviews: 45,
    availability: 'Mon-Wed, Fri: 9AM-5PM',
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Meet Our Team
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Professional barbers and stylists dedicated to providing exceptional grooming experiences.
              Each member of our team brings unique expertise and passion for the craft.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:flex">
                  {/* Image Section */}
                  <div className="md:w-1/3 bg-slate-100 flex items-center justify-center p-8">
                    <div className="w-32 h-32 bg-slate-300 rounded-full flex items-center justify-center">
                      <Users className="w-16 h-16 text-slate-600" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-2/3 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-2xl mb-1">{member.name}</CardTitle>
                          <p className="text-primary font-medium">{member.role}</p>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {member.rating}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <p className="text-muted-foreground mb-4">
                        {member.bio}
                      </p>

                      {/* Specialties */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Specialties
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary">{member.experience}</div>
                          <div className="text-xs text-muted-foreground">Experience</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">{member.reviews}</div>
                          <div className="text-xs text-muted-foreground">Reviews</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">{member.rating}</div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        {member.availability}
                      </div>

                      {/* Action Button */}
                      <Button className="w-full">
                        <Link href={`/book?barber=${member.id}`}>
                          Book with {member.name.split(' ')[0]}
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">4</div>
              <div className="text-slate-600">Expert Barbers</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-slate-600">Years Combined Experience</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">4.8/5</div>
              <div className="text-slate-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">595</div>
              <div className="text-slate-600">Total Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Philosophy</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We believe that great grooming is about more than just a haircut. It's about building relationships,
              understanding your lifestyle, and delivering consistent, professional results that make you feel confident.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for perfection in every cut, every style, and every interaction with our clients.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Personal Connection</h3>
                <p className="text-muted-foreground">
                  We take time to understand your preferences and build lasting relationships with our clients.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Continuous Learning</h3>
                <p className="text-muted-foreground">
                  Our team stays current with the latest techniques and trends to serve you better.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Meet Our Team?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
            Book an appointment with one of our expert barbers and experience the difference professional grooming makes.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/book">
              Book Your Appointment
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
