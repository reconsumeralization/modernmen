import Hero from './components/Hero'

import Services from './services/page'
import Team from './team/page'
import Products from './products/page'
import Hours from './hours-contact/page'
import Booking from './book/page'
import ChatBot from './components/ChatBot'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Team />
      <Products />
      <Hours />
      <Booking />
      <ChatBot />
    </main>
  )
}
