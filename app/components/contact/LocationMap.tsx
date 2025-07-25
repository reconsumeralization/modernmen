'use client'

export default function LocationMap() {
  return (
    <div>
      <div className="mb-4">
        <p className="text-orange-500 font-semibold">#4 - 425 Victoria Ave East</p>
        <p className="text-gray-900">Regina, SK S4N 0N8</p>
      </div>
      
      {/* Google Maps Embed */}
      <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.123456789!2d-104.6177!3d50.4452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x531c1e40fba0b5f1%3A0x123456789!2s425%20Victoria%20Ave%20E%2C%20Regina%2C%20SK%20S4N%200N8!5e0!3m2!1sen!2sca!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Modern Men Hair Salon Location"
        ></iframe>
      </div>
      
      <div className="mt-4 space-y-2">
        <a 
          href="https://maps.google.com/?q=425+Victoria+Ave+E,+Regina,+SK"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block btn-primary text-center w-full"
        >
          Get Directions
        </a>
        <p className="text-sm text-gray-500 text-center">
          Free parking available
        </p>
      </div>
    </div>
  )
}
