import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, X, Minimize2, Maximize2, Send, Bot, User, Calendar, Clock, Scissors } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'booking' | 'service' | 'confirmation'
  data?: any
}

interface SalonService {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
}

const SALON_SERVICES: SalonService[] = [
  { id: '1', name: 'Classic Haircut', description: 'Traditional men\'s haircut with styling', duration: 30, price: 35, category: 'Haircut' },
  { id: '2', name: 'Premium Haircut', description: 'Premium styling with wash and finish', duration: 45, price: 50, category: 'Haircut' },
  { id: '3', name: 'Beard Trim', description: 'Professional beard shaping and trimming', duration: 20, price: 20, category: 'Grooming' },
  { id: '4', name: 'Full Service', description: 'Haircut, beard trim, and styling', duration: 60, price: 65, category: 'Package' },
  { id: '5', name: 'Hair Color', description: 'Professional hair coloring service', duration: 90, price: 80, category: 'Color' },
  { id: '6', name: 'Scalp Treatment', description: 'Deep conditioning scalp treatment', duration: 30, price: 40, category: 'Treatment' }
]

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hi! I\'m your Modern Men salon assistant. How can I help you today?',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const processUserMessage = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase()

    // Booking related queries
    if (message.includes('book') || message.includes('appointment') || message.includes('schedule')) {
      return 'I\'d be happy to help you book an appointment! Here are our available services:\n\n' +
        SALON_SERVICES.map(service =>
          `• ${service.name} - $${service.price} (${service.duration}min)\n  ${service.description}`
        ).join('\n\n') +
        '\n\nWould you like to book any of these services? Please tell me your preferred date and time.'
    }

    // Service inquiries
    if (message.includes('service') || message.includes('price') || message.includes('cost')) {
      return 'Here are our current services and pricing:\n\n' +
        SALON_SERVICES.map(service =>
          `💇‍♂️ **${service.name}**\n   Price: $${service.price}\n   Duration: ${service.duration} minutes\n   ${service.description}`
        ).join('\n\n') +
        '\n\nAll services include consultation and professional styling.'
    }

    // Hours inquiry
    if (message.includes('hour') || message.includes('open') || message.includes('time')) {
      return '🕐 **Our Hours:**\n\n' +
        '• Monday - Friday: 9:00 AM - 8:00 PM\n' +
        '• Saturday: 8:00 AM - 6:00 PM\n' +
        '• Sunday: 10:00 AM - 5:00 PM\n\n' +
        'We recommend booking appointments in advance, especially on weekends!'
    }

    // Location/contact
    if (message.includes('location') || message.includes('address') || message.includes('contact') || message.includes('phone')) {
      return '📍 **Contact Information:**\n\n' +
        '📞 Phone: (555) 123-4567\n' +
        '📧 Email: info@modernmen.com\n' +
        '📍 Address: 123 Style Street, Downtown\n\n' +
        'We\'re located in the heart of downtown with easy parking available.'
    }

    // Stylist inquiry
    if (message.includes('stylist') || message.includes('barber') || message.includes('staff')) {
      return '👨‍💼 **Our Expert Stylists:**\n\n' +
        '• **Marcus** - Master Barber (8 years experience)\n' +
        '• **Jordan** - Style Specialist (6 years experience)\n' +
        '• **Alex** - Creative Director (10 years experience)\n' +
        '• **Taylor** - Grooming Expert (5 years experience)\n\n' +
        'All our stylists are licensed professionals with extensive training in men\'s grooming.'
    }

    // Products inquiry
    if (message.includes('product') || message.includes('shampoo') || message.includes('gel')) {
      return '🛍️ **Our Premium Products:**\n\n' +
        'We carry professional-grade products including:\n\n' +
        '• Premium shampoos and conditioners\n' +
        '• Professional styling products\n' +
        '• Beard oils and balms\n' +
        '• Hair treatment solutions\n\n' +
        'Ask your stylist about product recommendations during your visit!'
    }

    // Loyalty program
    if (message.includes('loyalty') || message.includes('points') || message.includes('discount') || message.includes('reward')) {
      return '🎁 **Loyalty Program:**\n\n' +
        'Join our loyalty program and earn points with every visit!\n\n' +
        '• Earn 1 point per $1 spent\n' +
        '• Redeem 100 points for $10 off\n' +
        '• Get a free service after 10 visits\n' +
        '• Birthday specials for members\n\n' +
        'Sign up is free and easy at your next visit!'
    }

    // Default responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! Welcome to Modern Men. I\'m here to help you with booking appointments, learning about our services, or answering any questions about our salon.'
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re very welcome! It was my pleasure to assist you. Feel free to reach out anytime you need help with your grooming needs. 😊'
    }

    // General fallback
    return 'I\'m here to help with:\n\n' +
      '• 📅 Booking appointments\n' +
      '• 💇‍♂️ Service information and pricing\n' +
      '• 🕐 Salon hours and location\n' +
      '• 👨‍💼 Stylist information\n' +
      '• 🛍️ Product recommendations\n' +
      '• 🎁 Loyalty program details\n\n' +
      'What would you like to know more about?'
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      type: 'text'
    }

    setMessages((prev: Message[]) => [...prev, newMessage])
    setInput('')
    setIsTyping(true)

    // Process the message and get response
    setTimeout(async () => {
      const response = await processUserMessage(newMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type: 'text'
      }

      setMessages((prev: Message[]) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch bg-white rounded-lg shadow-lg border">
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-white text-blue-600">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Modern Men Assistant</h3>
            <p className="text-xs opacity-90">Always here to help</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[400px] w-full p-4">
        <div className="space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-6 h-6 mt-1">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    <Bot className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.role === 'user' && (
                <Avatar className="w-6 h-6 mt-1">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-6 h-6 mt-1">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  <Bot className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
            placeholder="Ask me anything about our services..."
          className="flex-1"
            disabled={isTyping}
        />
          <Button type="submit" disabled={isTyping || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
      </form>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
            📅 Book Appointment
          </Badge>
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
            💇‍♂️ Our Services
          </Badge>
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
            🕐 Hours
          </Badge>
        </div>
      </div>
    </div>
  )
}