'use client'

import React from 'react'
import Image from 'next/image'
import { BaseBlockProps } from './index'

interface TeamBlockProps extends BaseBlockProps {
  title?: string
  subtitle?: string
  teamMembers?: any[]
  layout?: 'cards' | 'circles' | 'grid' | 'carousel'
  showBio?: boolean
  showSocials?: boolean
  isPreview?: boolean
}

export const TeamBlock: React.FC<TeamBlockProps> = ({
  id,
  title,
  subtitle,
  teamMembers = [],
  layout = 'cards',
  showBio = true,
  showSocials = false,
  className = '',
  isPreview = false,
}) => {
  // Mock data for preview
  const mockMembers = [
    {
      name: 'John Smith',
      title: 'Senior Stylist',
      bio: 'With over 10 years of experience, John specializes in modern cuts and classic styling.',
      image: { url: '/placeholder-avatar.jpg' }
    },
    {
      name: 'Sarah Johnson',
      title: 'Master Colorist', 
      bio: 'Sarah is our expert in color transformations and creative hair treatments.',
      image: { url: '/placeholder-avatar.jpg' }
    }
  ]

  const members = teamMembers.length > 0 ? teamMembers : mockMembers

  return (
    <section id={id} className={`team-block py-16 px-6 bg-white ${className}`}>
      <div className="max-w-6xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {layout === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <TeamCard key={index} member={member} showBio={showBio} showSocials={showSocials} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const TeamCard: React.FC<{ member: any; showBio: boolean; showSocials: boolean }> = ({ 
  member, 
  showBio, 
  showSocials 
}) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <div className="relative h-64 overflow-hidden">
      <Image
        src={member.image?.url || '/placeholder-avatar.jpg'}
        alt={member.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
      <p className="text-blue-600 font-medium mb-3">{member.title || member.position}</p>
      {showBio && member.bio && (
        <p className="text-gray-600 leading-relaxed">{member.bio}</p>
      )}
    </div>
  </div>
)

export default TeamBlock