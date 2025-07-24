'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Tammy",
      title: "Owner / Journeyman Stylist",
      bio: "After putting hair on the floor for over 20 years now, I love it more today than I did in the beginning. It's like a romance that evolved from a casual courtship to a lifetime commitment.",
      fullBio: "Owner and passionate leader of Modern Men, Tammy carries herself with a positive glow and believes in making a future on making men look the best and feel confident in themselves. She inspires her team to achieve excellence in men's grooming.",
      image: "/images/tammy.jpg"
    },
    {
      name: "Hicham Mellouli",
      title: "Barber",
      bio: "My journey in this industry began at the age of 19, when I started my apprenticeship under the guidance of Master Barber Zbi. I've always been drawn to the creative and social aspects of barbering, and I feel fortunate to have found a career that aligns with my strengths and interests.",
      fullBio: "Throughout my career, I've had the opportunity to build strong relationships with my clients, and I take pride in making a positive impact on their lives through my work. For me, it's not just about giving great haircuts – it's about being a trusted friend and confidant, and providing a welcoming space for people to relax and connect.",
      image: "/images/hicham.jpg"
    },
    {
      name: "Jasmine",
      title: "Journeyman Stylist",
      bio: "Modern Men was my first job as school finished. I was inspired by Tammy's goals and her positive energy. I have enjoyed every day and minute of working here and can't wait for what the future holds.",
      fullBio: "Jasmine creates forever friendships with clients and provides a safe zone for them. She believes this is a team game and is constantly learning from her coworkers. She specializes in advanced traditional barbering techniques.",
      image: "/images/jasmine.jpg"
    },
    {
      name: "Henok",
      title: "Apprentice Barber",
      bio: "I am originally from Eritrea Africa and I can remember from the young age of 15 I was put in charge of cutting family and friends hair! I speak 4 languages: Tigrigna, Amharic, Arabic and English.",
      fullBio: "I feel very appreciative that I can fill the demand of an experienced Barber for the growing Ethnic population in Regina and surrounding area. I truly enjoy shaving and am very happy to be a part of the Queen City Barbers team.",
      image: "/images/henok.jpg"
    },
    {
      name: "Sveta Orlenko",
      title: "Professional Barber",
      bio: "I have over 19 years' experience and am highly educated with diplomas from Ukraine, London England, and Israel. I was part of a highly professional hair team creating modern platform artistry hairstyles.",
      fullBio: "I've specialized in everything from Men's haircutting and beard shaping to hair tattoos. I have developed a passion for cutting Men's hair and love doing hair Tattoos! I specialize in Men's barbering as part of the Queen City Barbers team.",
      image: "/images/sveta.jpg"
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
