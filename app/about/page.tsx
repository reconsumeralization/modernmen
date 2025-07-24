'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-salon-dark mb-8">
            Our Mission
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              At Modern Men Salon we take Men's Grooming to the highest level of experience and satisfaction. 
              It is our mission to continually deliver a level of consistency in service that creates long term 
              value and support for the gentlemen we are passionate about serving.
            </p>
            <p>
              Our love for this male focused grooming industry is growing along with the industry itself and our 
              team of incomparably talented men's stylists and barbers. We promise and strive to be better every 
              day and continually evolve our skillsets to offer more to the every day male looking to improve 
              their overall appearance.
            </p>
            <p className="text-salon-gold font-semibold">
              Giving them the needed confidence to put their best version of self forward and conquer their every day!
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-salon-dark mb-4">
              New Clients Welcome
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We gladly accept New Clients to come give us an opportunity to showcase our level of service and talents 
              and believe that once you meet us you will want to return. We are a group of highly skilled individuals 
              who love what we do and genuinely care about your experience!
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-salon-dark mb-4">
              Thank You
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We want to give a Huge Thank You to All our Valued Clients who have been supporting and encouraging us 
              throughout the years! We look forward to giving many more years of loyal service!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
