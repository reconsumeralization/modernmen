import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { AboutSection } from '@/components/sections/about-section'
import { TeamSection } from '@/components/sections/team-section'
import { ContactSection } from '@/components/sections/contact-section'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <TeamSection />
        <ContactSection />
      </div>
      <Footer />
    </>
  )
}