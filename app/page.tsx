'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid'
import HeroCarousel from './components/HeroCarousel'
import ChatLauncher from './components/ChatLauncher'

export default function HomePage() {
  const services = [
    {
      title: 'MODERN CUT',
      price: 'from $45',
      duration: '45 min',
      description: 'Precision scissor/clipper work, clean finish, product style'
    },
    {
      title: 'SKIN FADE',
      price: 'from $45',
      duration: '45 min',
      description: 'Seamless gradient with razor-clean edges'
    },
    {
      title: 'HOT TOWEL SHAVE',
      price: 'from $45',
      duration: '45 min',
      description: 'Pre-shave oil, hot lather, multi-pass shave, cold towel, aftercare'
    },
    {
      title: 'BEARD TRIM',
      price: 'from $25',
      duration: '20 min',
      description: 'Shape, symmetry, and oil finish'
    },
    {
      title: 'CUT + BEARD',
      price: 'from $65',
      duration: '60 min',
      description: 'Complete grooming experience'
    },
    {
      title: 'EXPRESS CLEAN-UP',
      price: 'from $20',
      duration: '15 min',
      description: 'Quick neck and ear cleanup'
    }
  ]

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section - Carousel */}
        <HeroCarousel />

        {/* Who We Are */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="section-heading heading-accent">WHO WE ARE</h2>
            <p className="mt-6 text-lg text-gray-600">
              Modernmen is a craft‑first barbershop. We pair classic technique with modern detail work,
              clean lines, and finishes that last. You’ll leave looking sharp — and feeling ready.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4">YOUR NEXT LEVEL STARTS HERE</h2>
              <p className="text-xl text-gray-600">
                Precision cuts, hot shaves, and style that lasts.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-2 border-black p-6 hover:bg-black hover:text-white transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <span className="text-sm font-medium">{service.duration}</span>
                  </div>
                  <p className="text-2xl font-bold mb-3">{service.price}</p>
                  <p className="text-gray-600 group-hover:text-gray-300 mb-6 text-sm">
                    {service.description}
                  </p>
                  <Link
                    href="/book-enhanced"
                    className="text-sm font-bold hover:underline inline-flex items-center gap-1"
                  >
                    BOOK NOW
                    <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Signature Ritual */}
        <section className="py-24 bg-black text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl font-bold mb-6">
                  THE SIGNATURE<br />RITUAL
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Every cut deserves our signature finish. Hot towel prep, 
                  precision detailing, and cooling aftercare that leaves you 
                  feeling as good as you look.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <span>Warm towel preparation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <span>Pre-shave oil or tonic application</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <span>Hot lather neck cleanup</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <span>Cooling tonic finish</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">5</span>
                    </div>
                    <span>Aftercare product recommendation</span>
                  </li>
                </ul>
                <p className="text-2xl font-bold text-red-600">Add to any service +$15</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="/images/optimized/hot-towel-shave-classic-ritual-lg.jpg"
                  alt="Signature ritual"
                  className="w-full h-[600px] object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Memberships */}
        <section id="memberships" className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4">MODERNMEN MEMBERSHIPS</h2>
              <p className="text-xl text-gray-600">
                Stay dialed year-round with exclusive benefits
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-black p-8"
              >
                <h3 className="text-3xl font-bold mb-4">ONCE-MONTHLY</h3>
                <p className="text-4xl font-bold mb-6">$40<span className="text-lg font-normal">/month</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>1 cut per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>20% off add-ons & retail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Priority booking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Roll over 1 unused cut</span>
                  </li>
                </ul>
                <Link
                  href="/book-enhanced"
                  className="block text-center px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-all"
                >
                  GET STARTED
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-black text-white border-2 border-black p-8 relative"
              >
                <div className="absolute -top-4 right-8 bg-red-600 text-white text-sm px-4 py-2 font-bold">
                  LIMITED AVAILABILITY
                </div>
                <h3 className="text-3xl font-bold mb-4">UNLIMITED</h3>
                <p className="text-4xl font-bold mb-6">$120<span className="text-lg font-normal">/month</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Unlimited cuts (fair use)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>20% off all retail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>VIP booking hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Guest passes (2/year)</span>
                  </li>
                </ul>
                <Link
                  href="/book-enhanced"
                  className="block text-center px-6 py-3 bg-white text-black font-bold hover:bg-gray-100 transition-all"
                >
                  JOIN WAITLIST
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gallery/Results */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4">CUTS THAT COMMAND RESPECT</h2>
              <p className="text-xl text-gray-600">Follow @modernmenregina for daily inspiration</p>
            </motion.div>
            {/* Before/After slider */}
            <div className="mb-14">
              {/* Lightweight before/after component */}
              <div className="max-w-4xl mx-auto">
                <iframe
                  title="before-after"
                  className="w-full h-[420px] rounded border"
                  srcDoc="<!doctype html><html><body style='margin:0'><style>html,body,#c{height:100%;}#c{position:relative;overflow:hidden}img{object-fit:cover;width:100%;height:100%;position:absolute;left:0;top:0}#a{clip-path:inset(0 50% 0 0)}#s{position:absolute;top:0;bottom:0;left:50%}#b{width:1px;background:#fff;opacity:.8;height:100%}</style><div id='c'><img src='/images/optimized/barbershop-modern-cut-before-after-lg.jpg'/><div id='a'><img src='/images/optimized/taper-fade-clean-edges-lg.jpg'/></div><div id='s'><div id='b'></div></div></div><input type='range' min='0' max='100' value='50' oninput='a.style.clipPath=\`inset(0 ${100-this.value}% 0 0)\`;s.style.left=this.value+\`%\`' style='position:absolute;left:0;right:0;bottom:8px;width:calc(100% - 16px);margin:0 8px'/></body></html>"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'images/optimized/barbershop-modern-cut-before-after-sm.jpg',
                'images/optimized/skin-fade-detail-razor-finish-sm.jpg',
                'images/optimized/beard-trim-line-up-hot-towel-sm.jpg',
                'images/optimized/hot-towel-shave-classic-ritual-sm.jpg',
                'images/optimized/taper-fade-clean-edges-sm.jpg',
                'images/optimized/kids-cut-clean-style-sm.jpg',
                'images/optimized/buzz-cut-clipper-only-sm.jpg',
                'images/optimized/barber-chair-interior-cinematic-sm.jpg'
              ].map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="aspect-square bg-gray-200 overflow-hidden"
                >
                  <img
                    src={`/${src}`}
                    alt={src
                      .replace('images/optimized/', '')
                      .replace(/-/g, ' ')
                      .replace(/\.jpg$/, '')}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold">Stay sharp. Get updates.</h3>
            <p className="mt-2 text-white/80">Promos, new services, and first dibs on VIP hours.</p>
            <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/api/newsletter" method="post" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: fd.get('email'), consent: fd.get('consent') === 'on' }) }).then(async r => { if (r.ok) { alert('Subscribed!'); (e.currentTarget as HTMLFormElement).reset() } else { alert('Subscription failed') } }) }}>
              <input name="email" type="email" required placeholder="you@email.com" className="flex-1 px-4 py-3 text-black" />
              <button type="submit" className="px-6 py-3 bg-white text-black font-semibold hover:bg-gray-100">Subscribe</button>
              <label className="flex items-center gap-2 text-xs text-white/80 justify-center sm:justify-start">
                <input name="consent" type="checkbox" className="h-4 w-4" /> I agree to receive email communications
              </label>
            </form>
          </div>
        </section>

        {/* Instagram Grid */}
        <section className="py-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Follow us on Instagram</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 overflow-hidden framed">
                  <img src={`/images/optimized/barber-chair-interior-cinematic-sm.jpg`} alt="Modernmen Instagram" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Floating chat launcher */}
      <ChatLauncher />
    </>
  )
}