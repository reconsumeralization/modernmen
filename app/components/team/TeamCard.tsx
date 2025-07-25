'use client'

import { motion } from 'framer-motion'

interface TeamMember {
  name: string
  title: string
  bio: string
  fullBio: string
  image: string
}

interface TeamCardProps {
  member: TeamMember
  index: number
}

export default function TeamCard({ member, index }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
    >
      <div className="relative h-80">
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="text-gray-600 text-sm">Professional Photo</div>
            <div className="text-gray-500 text-xs">Coming Soon</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {member.name}
        </h3>
        <p className="text-orange-500 font-medium mb-4">
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
  )
}
