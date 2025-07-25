'use client'

import BookingCard from './BookingCard'

export default function BookingOptions() {
  const openMessenger = () => {
    window.open('https://m.me/modernmenhairsalon', '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <BookingCard
        title="Online Booking"
        buttonText="Book Online"
        buttonHref="/book"
      >
        <p className="text-gray-600 mb-4">Schedule your appointment online 24/7</p>
      </BookingCard>
      
      <BookingCard
        title="Call Us"
        buttonText="(306) 522-4111"
        buttonHref="tel:+13065224111"
        buttonClass="btn-secondary"
      >
        <p className="text-gray-600 mb-4">Speak directly with our team</p>
      </BookingCard>
      
      <BookingCard
        title="Facebook Messenger"
        buttonText="Message Us"
        buttonAction={openMessenger}
        buttonClass="btn-primary bg-blue-600 hover:bg-blue-700"
      >
        <p className="text-gray-600 mb-4">Quick and convenient messaging</p>
      </BookingCard>
    </div>
  )
}
