'use client'

import HeroContent from './hero/HeroContent'
import HeroActions from './hero/HeroActions'
import HeroContactInfo from './hero/HeroContactInfo'
import HeroImage from './hero/HeroImage'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
        
        {/* Left side - Content */}
        <div>
          <HeroContent />
          <HeroActions />
          <HeroContactInfo />
        </div>
        
        {/* Right side - Clean salon image */}
        <HeroImage />
      </div>
    </section>
  )
}
