'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Hicham Mellouli",
      title: "Barber",
      bio: "My journey in this industry began at the age of 19, when I started my apprenticeship under the guidance of Master Barber Zbi. I've always been drawn to the creative and social aspects of barbering, and I feel fortunate to have found a career that aligns with my strengths and interests.",
      fullBio: "Throughout my career, I've had the opportunity to build strong relationships with my clients, and I take pride in making a positive impact on their lives through my work. For me, it's not just about giving great haircuts – it's about being a trusted friend and confidant, and providing a welcoming space for people to relax and connect.",
      image: "/images/hicham.jpg"
    },
    {
      name: "Ella Forestal",
      title: "Journeyman Stylist",
      bio: "I've been passionate about the beauty industry for nine years, with seven of those years dedicated to the art of hair styling. I love letting my creative side shine through with fun, edgy cuts and colors.",
      fullBio: "I specialize in men's hair (I do a mean fade) and textured women's cuts. Growing up in the world of competitive dance, I was introduced to hair and makeup at the young age of three. The stylist-client relationship is truly unique – I'm thrilled to help you feel and look your best!",
      image: "/images/ella.jpg"
    },
    {
      name: "Tri Ha",
      title: "Hairstylist",
      bio: "I began my journey as a barber at 18, driven by a passion for the craft and the impact a great haircut can have on a person's confidence. At 19, I enrolled at The Style Academy, where I gained valuable training.",
      fullBio: "For me, barbering is about more than just cutting hair—it's about creating a personalized experience for each client, understanding their unique style, and helping them feel their best. My goal is always to ensure that every client walks out feeling happy, confident, and satisfied with their look.",
      image: "/images/tri.jpg"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-salon-dark mb-4">
            Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our skilled stylists and barbers who are passionate about making you look and feel your best
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-80">
                <div className="w-full h-full bg-gradient-to-br from-salon-gold/20 to-salon-dark/20 flex items-center justify-center">
                  <div className="text-6xl font-bold text-salon-gold opacity-30">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-salon-dark mb-2">
                  {member.name}
                </h3>
                <p className="text-salon-gold font-medium mb-4">
                  {member.title}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {member.fullBio}
                </p>
                <div className="mt-6">
                  <button className="btn-primary w-full">
                    Book with {member.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-700 mb-6">
            I believe that a great barbershop is more than just a place to get a haircut – it's a gathering place where people can come together, share stories, and catch up with friends.
          </p>
          <a href="/book" className="btn-primary">
            Book Your Appointment
          </a>
        </motion.div>
      </div>
    </section>
  )
}
