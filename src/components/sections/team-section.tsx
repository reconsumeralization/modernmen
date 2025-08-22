'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

const team = [
  {
    name: 'Tammy',
    role: 'Owner & Master Stylist',
    image: 'https://images.unsplash.com/photo-1594824389317-34a521b78ad5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Over 20 years of experience in men\'s grooming. Passionate about the art and craft of barbering.'
  },
  {
    name: 'Raylyne',
    role: 'Senior Stylist',
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: '4+ years with Modern Men. Specializes in modern cuts and traditional barbering techniques.'
  },
  {
    name: 'Master Barber',
    role: 'Traditional Barber',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Expert in classic cuts and hot towel shaves. Bringing traditional barbering to modern men.'
  }
]

export function TeamSection() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-amber-600"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-amber-400 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}