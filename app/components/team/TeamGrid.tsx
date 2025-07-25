'use client'

import TeamCard from './TeamCard'

interface TeamMember {
  name: string
  title: string
  bio: string
  fullBio: string
  image: string
}

interface TeamGridProps {
  teamMembers: TeamMember[]
}

export default function TeamGrid({ teamMembers }: TeamGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member, index) => (
        <TeamCard 
          key={member.name} 
          member={member} 
          index={index} 
        />
      ))}
    </div>
  )
}
