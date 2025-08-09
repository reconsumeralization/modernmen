'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { format, addDays, startOfToday, isSameDay } from 'date-fns'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  options?: string[]
  showCalendar?: boolean
  showTimeSlots?: boolean
}

interface BookingData {
  service?: string
  date?: string
  time?: string
  name?: string
  phone?: string
  email?: string
}

export default function EnhancedChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to Modern Men! I'm here to help you book your next grooming experience. What service are you interested in?",
      isBot: true,
      timestamp: new Date(),
      options: ['Haircut', 'Beard Trim', 'Hair + Beard', 'Hot Shave', 'Hair Treatment']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [bookingData, setBookingData] = useState<BookingData>({})
  const [selectedDate, setSelectedDate] = useState(startOfToday())
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Simulate available time slots
  useEffect(() => {
    const generateSlots = () => {
      const slots = []
      const hours = [9, 10, 11, 14, 15, 16, 17]
      const minutes = ['00', '30']
      
      for (const hour of hours) {
        for (const minute of minutes) {
          slots.push(`${hour}:${minute}`)
        }
      }
      
      // Randomly remove some slots to simulate bookings
      return slots.filter(() => Math.random() > 0.3)
    }
    
    setAvailableSlots(generateSlots())
  }, [selectedDate])  
  const handleOptionClick = (option: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option,
      isBot: false,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    
    // Process based on current state
    setTimeout(() => {
      let botResponse: Message
      
      if (!bookingData.service) {
        // Service selected
        setBookingData({ ...bookingData, service: option })
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: `Great choice! ${option} is one of our popular services. When would you like to come in?`,
          isBot: true,
          timestamp: new Date(),
          showCalendar: true
        }
      } else if (bookingData.service && !bookingData.date) {
        // This shouldn't happen with calendar, but handle it
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "Please select a date from the calendar below.",
          isBot: true,
          timestamp: new Date(),
          showCalendar: true
        }
      }
      
      setMessages(prev => [...prev, botResponse!])
      setIsTyping(false)
    }, 1000)
  }
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setBookingData({ ...bookingData, date: format(date, 'yyyy-MM-dd') })
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: format(date, 'EEEE, MMMM d'),
      isBot: false,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Perfect! Here are the available times for ${format(date, 'MMMM d')}:`,
        isBot: true,
        timestamp: new Date(),
        showTimeSlots: true
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 800)
  }  
  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time })
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: time,
      isBot: false,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Excellent! I just need a few details to confirm your booking. What's your name?",
        isBot: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 800)
  }
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    
    // Process based on booking state
    setTimeout(() => {
      let botResponse: Message
      
      if (bookingData.time && !bookingData.name) {
        setBookingData({ ...bookingData, name: inputValue })
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: `Thanks ${inputValue}! What's the best phone number to reach you?`,
          isBot: true,
          timestamp: new Date()
        }
      } else if (bookingData.name && !bookingData.phone) {
        setBookingData({ ...bookingData, phone: inputValue })
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "And your email address for the confirmation?",
          isBot: true,
          timestamp: new Date()
        }
      } else if (bookingData.phone && !bookingData.email) {
        setBookingData({ ...bookingData, email: inputValue })
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: `Perfect! I've booked your ${bookingData.service} for ${format(new Date(bookingData.date!), 'EEEE, MMMM d')} at ${bookingData.time}. You'll receive a confirmation email shortly!`,
          isBot: true,
          timestamp: new Date()
        }
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "I'm here to help you book an appointment. Would you like to start over?",
          isBot: true,
          timestamp: new Date(),
          options: ['Start New Booking', 'Contact Us']
        }
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }  
  const CalendarView = () => {
    const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i))
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 mt-2">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="text-xs font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, startOfToday())
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateSelect(day)}
                className={`
                  p-2 rounded-lg text-sm font-medium transition-all
                  ${isSelected 
                    ? 'bg-black text-white' 
                    : isToday
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
  
  const TimeSlots = () => {
    return (
      <div className="grid grid-cols-3 gap-2 mt-2">
        {availableSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => handleTimeSelect(slot)}
            className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all"
          >
            {slot}
          </button>
        ))}
      </div>
    )
  }
  
  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-all z-50"
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">MM</span>
                </div>
                <div>
                  <h3 className="font-semibold">Modern Men Booking</h3>
                  <p className="text-xs text-gray-300">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-black text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                  
                  {/* Options */}
                  {message.options && (
                    <div className="mt-2 space-y-2">
                      {message.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Calendar */}
                  {message.showCalendar && <CalendarView />}
                  
                  {/* Time Slots */}
                  {message.showTimeSlots && <TimeSlots />}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="border-t p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  disabled={messages[messages.length - 1]?.showCalendar || messages[messages.length - 1]?.showTimeSlots}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                  disabled={!inputValue.trim() || messages[messages.length - 1]?.showCalendar || messages[messages.length - 1]?.showTimeSlots}
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}