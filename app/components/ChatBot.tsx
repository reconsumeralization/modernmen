'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
  options?: string[]
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you book an appointment at Modern Men Hair Salon. What can I help you with today?",
      isBot: true,
      timestamp: new Date(),
      options: ["Book an Appointment", "Check Hours", "View Services", "Contact Info"]
    }
  ])
  const [input, setInput] = useState('')
  const [step, setStep] = useState('welcome')
  const [bookingData, setBookingData] = useState({
    service: '',
    stylist: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (text: string, isBot: boolean = false, options?: string[]) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isBot,
      timestamp: new Date(),
      options
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleOptionClick = (option: string) => {
    addMessage(option, false)
    
    switch (option) {
      case "Book an Appointment":
        setStep('service')
        addMessage("Great! Let's book your appointment. What service would you like?", true, [
          "Men's Haircut", "Beard Grooming", "Hair Styling", "Hair Tattoo/Design"
        ])
        break
      case "Check Hours":
        addMessage("Our hours are:\n\nMonday: 9am - 6pm\nTuesday: 9am - 5pm\nWednesday: 9am - 8pm\nThursday: 9am - 8pm\nFriday: 9am - 5pm\nSaturday: 9am - 5pm\nSunday: Closed", true, [
          "Book an Appointment", "Contact Info"
        ])
        break
      case "View Services":
        addMessage("Our services include:\n\n✂️ Men's Haircuts & Styling (Starting at $45)\n🧔 Beard Grooming & Shaving (Starting at $25)\n🎨 Hair Tattoos & Design (Starting at $35)\n\nAll services by our skilled team!", true, [
          "Book an Appointment", "Meet Our Team"
        ])
        break
      case "Contact Info":
        addMessage("📍 #4 - 425 Victoria Ave East, Regina, SK\n📞 Phone: (306) 522-4111\n💬 Text: (306) 541-5511\n📧 Email: info@modernmen.ca", true, [
          "Book an Appointment", "Get Directions"
        ])
        break
      case "Meet Our Team":
        addMessage("Our talented team:\n\n👨‍💼 Hicham Mellouli - Master Barber\n💇‍♀️ Ella Forestal - Fade & Hair Tattoo Specialist\n✂️ Tri Ha - Modern Styling Expert", true, [
          "Book with Hicham", "Book with Ella", "Book with Tri", "No Preference"
        ])
        break
      case "Get Directions":
        window.open('https://maps.google.com/?q=425+Victoria+Ave+E,+Regina,+SK', '_blank')
        addMessage("Opening directions in a new tab!", true, ["Book an Appointment"])
        break
      default:
        handleBookingStep(option)
    }
  }

  const handleBookingStep = (response: string) => {
    switch (step) {
      case 'service':
        setBookingData(prev => ({ ...prev, service: response }))
        setStep('stylist')
        addMessage(`Perfect! You've selected ${response}. Do you have a preferred stylist?`, true, [
          "Hicham Mellouli", "Ella Forestal", "Tri Ha", "No Preference"
        ])
        break
      case 'stylist':
        setBookingData(prev => ({ ...prev, stylist: response }))
        setStep('contact')
        addMessage("Great choice! I'll need your contact information to complete the booking. Please provide your name:", true)
        break
      case 'contact':
        if (!bookingData.name) {
          setBookingData(prev => ({ ...prev, name: response }))
          addMessage("Thanks! What's your phone number?", true)
        } else if (!bookingData.phone) {
          setBookingData(prev => ({ ...prev, phone: response }))
          addMessage("Perfect! What's your email address?", true)
        } else if (!bookingData.email) {
          setBookingData(prev => ({ ...prev, email: response }))
          setStep('complete')
          addMessage(`Excellent! Here's your booking request:

📋 **Booking Summary**
Service: ${bookingData.service}
Stylist: ${bookingData.stylist}
Name: ${bookingData.name}
Phone: ${bookingData.phone}
Email: ${response}

We'll contact you within 24 hours to confirm your appointment time. You can also call us at (306) 522-4111 to schedule immediately!`, true, [
            "Book Another Appointment", "Contact Us"
          ])
        }
        break
    }
  }

  const handleSendMessage = () => {
    if (!input.trim()) return
    
    const userMessage = input.trim()
    setInput('')
    
    if (step === 'contact') {
      handleBookingStep(userMessage)
    } else {
      addMessage(userMessage, false)
      
      // Simple bot responses
      setTimeout(() => {
        addMessage("I'd be happy to help! Please choose an option above or type 'book' to start booking an appointment.", true, [
          "Book an Appointment", "Check Hours", "View Services"
        ])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-salon-dark text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-salon-gold rounded-full flex items-center justify-center">
                  <span className="text-salon-dark font-bold text-sm">MM</span>
                </div>
                <div>
                  <h3 className="font-semibold">Modern Men Assistant</h3>
                  <p className="text-xs text-gray-300">Booking Helper</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-salon-gold text-salon-dark'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {message.options && (
                      <div className="mt-2 space-y-1">
                        {message.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="block w-full text-left text-xs bg-salon-dark text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salon-gold text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-salon-gold text-salon-dark p-2 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-salon-gold text-salon-dark p-4 rounded-full shadow-lg hover:bg-yellow-500 transition-colors"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  )
}
