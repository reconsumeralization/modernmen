'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Calendar,
  Clock,
  Scissors,
  MapPin,
  Phone,
  Mail,
  Star,
  Gift,
  RefreshCw
} from 'lucide-react'
import { useChatBot } from './ChatBotService'
import { useChatBotIntegration } from './ChatBotIntegration'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'booking' | 'service' | 'confirmation'
  actions?: Action[]
}

interface Action {
  label: string
  action: string
  icon?: React.ReactNode
}

const QUICK_ACTIONS: Action[] = [
  { label: 'Book Appointment', action: 'book', icon: <Calendar className="w-3 h-3" /> },
  { label: 'Our Services', action: 'services', icon: <Scissors className="w-3 h-3" /> },
  { label: 'Hours & Location', action: 'hours', icon: <MapPin className="w-3 h-3" /> },
  { label: 'Contact Info', action: 'contact', icon: <Phone className="w-3 h-3" /> },
  { label: 'Loyalty Program', action: 'loyalty', icon: <Gift className="w-3 h-3" /> }
]

export function AdvancedChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Welcome to Modern Men Salon! I\'m your virtual assistant. How can I help you today?',
      timestamp: new Date(),
      type: 'text',
      actions: QUICK_ACTIONS
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { chatbotState, processMessage, resetConversation } = useChatBot()
  const { createAppointment, isCreatingAppointment } = useChatBotIntegration()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleQuickAction = async (action: string) => {
    let message = ''

    switch (action) {
      case 'book':
        message = 'I want to book an appointment'
        break
      case 'services':
        message = 'Tell me about your services'
        break
      case 'hours':
        message = 'What are your hours?'
        break
      case 'contact':
        message = 'How can I contact you?'
        break
      case 'loyalty':
        message = 'Tell me about your loyalty program'
        break
      default:
        message = action
    }

    await handleMessage(message)
  }

  const handleMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent.trim(),
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Process the message through the chatbot service
    setTimeout(async () => {
      const response = processMessage(messageContent)

      // Check if booking is complete (step 7) and create actual appointment
      let finalResponse = response
      if (chatbotState.conversationStep === 6 && chatbotState.customerInfo?.phone) {
        // This is the phone step completion - create the appointment
        try {
          const selectedService = SALON_SERVICES.find(s => s.id === chatbotState.selectedService)
          if (selectedService && chatbotState.selectedDate && chatbotState.selectedTime && chatbotState.customerInfo) {
            const result = await createAppointment({
              serviceId: selectedService.id,
              date: chatbotState.selectedDate,
              time: chatbotState.selectedTime,
              customerName: chatbotState.customerInfo.name,
              customerEmail: chatbotState.customerInfo.email,
              customerPhone: chatbotState.customerInfo.phone
            })

            finalResponse = result.message
          }
        } catch (error) {
          finalResponse = "❌ Sorry, there was an error creating your appointment. Please try again or contact us directly."
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: finalResponse,
        timestamp: new Date(),
        type: 'text'
      }

      // Add contextual actions based on conversation state
      if (chatbotState.currentIntent === 'booking') {
        assistantMessage.actions = [
          { label: 'Start Over', action: 'reset', icon: <RefreshCw className="w-3 h-3" /> }
        ]
      } else if (chatbotState.conversationStep >= 7) {
        // Booking completed
        assistantMessage.actions = [
          { label: 'Book Another', action: 'book', icon: <Calendar className="w-3 h-3" /> },
          { label: 'View Services', action: 'services', icon: <Scissors className="w-3 h-3" /> }
        ]
      } else {
        assistantMessage.actions = QUICK_ACTIONS
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, isCreatingAppointment ? 3000 : 1000)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleMessage(input)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleActionClick = async (action: string) => {
    if (action === 'reset') {
      resetConversation()
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Conversation reset! How can I help you today?',
        timestamp: new Date(),
        type: 'text',
        actions: QUICK_ACTIONS
      }])
      return
    }

    await handleQuickAction(action)
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-white/20">
                <AvatarFallback className="bg-white/10 text-white font-bold text-lg">
                  MM
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg">Modern Men Assistant</h3>
              <p className="text-blue-100 text-sm">Your personal salon concierge</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">4.9/5 from 2,847 reviews</span>
              </div>
            </div>
          </div>

          {/* Conversation Status */}
          {chatbotState.currentIntent && (
            <div className="text-right">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {chatbotState.currentIntent === 'booking' ? '📅 Booking Mode' : '💬 Inquiry Mode'}
              </Badge>
              {chatbotState.conversationStep > 0 && (
                <p className="text-xs text-blue-100 mt-1">
                  Step {chatbotState.conversationStep} of 7
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 h-96 p-6">
        <div className="space-y-6">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}

              <div className={`flex flex-col gap-2 max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Quick Actions */}
                {message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionClick(action.action)}
                        className="text-xs h-8 px-3 bg-white hover:bg-blue-50 border-gray-200"
                      >
                        {action.icon}
                        <span className="ml-1">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
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

      {/* Input Area */}
      <div className="p-6 border-t bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={
                chatbotState.currentIntent === 'booking'
                  ? 'Continue booking your appointment...'
                  : 'Ask me anything about Modern Men Salon...'
              }
              className="pr-12 h-12 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isTyping}
            />
            {input.trim() && (
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
                disabled={isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>

        {/* Conversation Context */}
        {chatbotState.currentIntent === 'booking' && chatbotState.selectedService && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Current Booking:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
              {chatbotState.selectedService && (
                <div>Service: {chatbotState.selectedService}</div>
              )}
              {chatbotState.selectedDate && (
                <div>Date: {chatbotState.selectedDate}</div>
              )}
              {chatbotState.selectedTime && (
                <div>Time: {chatbotState.selectedTime}</div>
              )}
              {chatbotState.customerInfo?.name && (
                <div>Name: {chatbotState.customerInfo.name}</div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>🛡️ Secure & Private</span>
            <span>⚡ Instant Responses</span>
          </div>
          <button
            onClick={() => {
              resetConversation()
              setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Conversation reset! How can I help you today?',
                timestamp: new Date(),
                type: 'text',
                actions: QUICK_ACTIONS
              }])
            }}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Reset Conversation
          </button>
        </div>
      </div>
    </div>
  )
}
