'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  CalendarIcon, 
  ClockIcon,
  UserIcon,
  ScissorsIcon,
  SparklesIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    suggestions?: string[];
    actions?: Array<{
      type: 'book' | 'view-services' | 'check-availability';
      label: string;
      data?: any;
    }>;
  };
}

interface BookingData {
  service?: string;
  stylist?: string;
  date?: string;
  time?: string;
  clientInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

interface ChatBookingProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete?: (booking: BookingData) => void;
}

export default function ChatBooking({ isOpen, onClose, onBookingComplete }: ChatBookingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [currentStep, setCurrentStep] = useState<'greeting' | 'service' | 'stylist' | 'datetime' | 'contact' | 'confirm'>('greeting');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample data - in real app, fetch from API
  const services = [
    { id: '1', name: 'Classic Haircut', duration: 30, price: 35 },
    { id: '2', name: 'Beard Trim', duration: 20, price: 25 },
    { id: '3', name: 'Hot Towel Shave', duration: 45, price: 50 },
    { id: '4', name: 'Hair & Beard Combo', duration: 60, price: 70 },
    { id: '5', name: 'Hair Wash & Style', duration: 40, price: 40 }
  ];

  const stylists = [
    { id: '1', name: 'Marcus Johnson', specialties: ['Classic Cuts', 'Fades'], rating: 4.9 },
    { id: '2', name: 'David Chen', specialties: ['Beard Grooming', 'Shaves'], rating: 4.8 },
    { id: '3', name: 'Alex Rivera', specialties: ['Modern Styles', 'Color'], rating: 4.7 }
  ];

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  // Initialize chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "Welcome to ModernMen! I'm here to help you book your appointment. What service are you looking for today?",
        {
          suggestions: ['Classic Haircut', 'Beard Trim', 'Hot Towel Shave', 'Hair & Beard Combo'],
          actions: [
            { type: 'view-services', label: 'View All Services' }
          ]
        }
      );
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addMessage = (content: string, type: 'user' | 'bot', metadata?: Message['metadata']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (content: string, metadata?: Message['metadata']) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(content, 'bot', metadata);
    }, 1000 + Math.random() * 1000); // Simulate thinking time
  };

  const processUserInput = (input: string) => {
    addMessage(input, 'user');
    
    const lowerInput = input.toLowerCase();
    
    // Service selection
    if (currentStep === 'greeting' || lowerInput.includes('haircut') || lowerInput.includes('beard') || lowerInput.includes('shave')) {
      const selectedService = services.find(s => 
        lowerInput.includes(s.name.toLowerCase()) || 
        s.name.toLowerCase().includes(lowerInput)
      );
      
      if (selectedService) {
        setBookingData(prev => ({ ...prev, service: selectedService.name }));
        setCurrentStep('stylist');
        addBotMessage(
          `Great choice! The ${selectedService.name} takes ${selectedService.duration} minutes and costs $${selectedService.price}. Who would you like as your stylist?`,
          {
            suggestions: stylists.map(s => s.name),
            actions: [
              { type: 'view-services', label: 'No Preference' }
            ]
          }
        );
      } else {
        addBotMessage(
          "I'd be happy to help you choose a service. Here are our most popular options:",
          {
            suggestions: services.map(s => `${s.name} - $${s.price}`),
          }
        );
      }
      return;
    }

    // Stylist selection
    if (currentStep === 'stylist') {
      const selectedStylist = stylists.find(s => 
        lowerInput.includes(s.name.toLowerCase()) ||
        lowerInput.includes('no preference') ||
        lowerInput.includes('any')
      );
      
      if (selectedStylist || lowerInput.includes('no preference') || lowerInput.includes('any')) {
        const stylistName = selectedStylist ? selectedStylist.name : 'Any available stylist';
        setBookingData(prev => ({ ...prev, stylist: stylistName }));
        setCurrentStep('datetime');
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);
        
        addBotMessage(
          `Perfect! I'll book you with ${stylistName}. When would you like to come in?`,
          {
            suggestions: [
              `Today ${today.toLocaleDateString()}`,
              `Tomorrow ${tomorrow.toLocaleDateString()}`,
              `${dayAfter.toLocaleDateString()}`
            ],
            actions: [
              { type: 'check-availability', label: 'Check Availability' }
            ]
          }
        );
      } else {
        addBotMessage(
          "Which stylist would you prefer? Here are our team members:",
          {
            suggestions: [...stylists.map(s => s.name), 'No preference']
          }
        );
      }
      return;
    }

    // Date and time selection
    if (currentStep === 'datetime') {
      // Check if input contains a date
      if (lowerInput.includes('today') || lowerInput.includes('tomorrow') || lowerInput.match(/\d{1,2}\/\d{1,2}/)) {
        let selectedDate = '';
        if (lowerInput.includes('today')) {
          selectedDate = new Date().toDateString();
        } else if (lowerInput.includes('tomorrow')) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          selectedDate = tomorrow.toDateString();
        }
        
        setBookingData(prev => ({ ...prev, date: selectedDate }));
        
        addBotMessage(
          `Great! What time works best for you on ${selectedDate}?`,
          {
            suggestions: timeSlots
          }
        );
      } 
      // Check if input contains a time
      else if (lowerInput.match(/\d{1,2}:\d{2}|am|pm|\d{1,2}\s*(am|pm)/)) {
        const timeMatch = input.match(/\d{1,2}:\d{2}\s*(AM|PM)|(\d{1,2})\s*(AM|PM)/i);
        if (timeMatch) {
          setBookingData(prev => ({ ...prev, time: input }));
          setCurrentStep('contact');
          addBotMessage(
            "Perfect! I'll reserve that time slot. I just need your contact information to confirm the appointment. What's your name?",
            {
              suggestions: ['Continue with booking']
            }
          );
        }
      }
      else {
        addBotMessage(
          "Please let me know your preferred date and time. I can help you with:",
          {
            suggestions: ['Today', 'Tomorrow', 'This weekend', 'Next week']
          }
        );
      }
      return;
    }

    // Contact information
    if (currentStep === 'contact') {
      if (!bookingData.clientInfo?.name) {
        setBookingData(prev => ({
          ...prev,
          clientInfo: { ...prev.clientInfo, name: input }
        }));
        addBotMessage("Thanks! And what's your phone number?");
      } else if (!bookingData.clientInfo?.phone) {
        setBookingData(prev => ({
          ...prev,
          clientInfo: { ...prev.clientInfo, phone: input }
        }));
        addBotMessage("Great! Last thing - what's your email address?");
      } else if (!bookingData.clientInfo?.email) {
        setBookingData(prev => ({
          ...prev,
          clientInfo: { ...prev.clientInfo, email: input }
        }));
        setCurrentStep('confirm');
        
        const finalBooking = {
          ...bookingData,
          clientInfo: { ...bookingData.clientInfo, email: input }
        };
        
        addBotMessage(
          "Perfect! Let me confirm your appointment details:",
          {
            actions: [
              { type: 'book', label: 'Confirm Booking', data: finalBooking }
            ]
          }
        );
        
        // Show booking summary
        setTimeout(() => {
          addBotMessage(
            `📅 Service: ${finalBooking.service}\n👨‍💼 Stylist: ${finalBooking.stylist}\n📆 Date: ${finalBooking.date}\n🕐 Time: ${finalBooking.time}\n👤 Name: ${finalBooking.clientInfo?.name}\n📱 Phone: ${finalBooking.clientInfo?.phone}\n📧 Email: ${finalBooking.clientInfo?.email}`,
            {
              actions: [
                { type: 'book', label: 'Confirm & Book', data: finalBooking },
                { type: 'view-services', label: 'Start Over' }
              ]
            }
          );
        }, 2000);
      }
      return;
    }

    // Default response
    addBotMessage(
      "I'm here to help you book an appointment. What would you like to do?",
      {
        suggestions: ['Book appointment', 'View services', 'Check availability'],
        actions: [
          { type: 'view-services', label: 'Start Booking' }
        ]
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      processUserInput(inputValue);
      setInputValue('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    processUserInput(suggestion);
  };

  const handleActionClick = (action: any) => {
    if (action.type === 'book' && action.data) {
      onBookingComplete?.(action.data);
      addBotMessage("🎉 Your appointment has been booked! We'll send you a confirmation email shortly.");
      setTimeout(() => {
        onClose();
      }, 3000);
    } else if (action.type === 'view-services') {
      if (action.label === 'Start Over') {
        setMessages([]);
        setBookingData({});
        setCurrentStep('greeting');
        setTimeout(() => {
          addBotMessage(
            "Let's start fresh! What service are you looking for today?",
            {
              suggestions: services.map(s => s.name)
            }
          );
        }, 500);
      } else {
        addBotMessage(
          "Here are all our services:",
          {
            suggestions: services.map(s => `${s.name} - $${s.price}`)
          }
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chat Window */}
      <div className="relative w-full max-w-md h-full sm:h-[600px] bg-surface border border-border sm:rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary bg-opacity-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">ModernMen Assistant</h3>
              <p className="text-xs text-text-muted">Book your appointment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-background transition-colors flex items-center justify-center"
          >
            <XMarkIcon className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-primary text-white ml-auto' 
                  : 'bg-background border border-border'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                
                {/* Suggestions */}
                {message.metadata?.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.metadata.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 text-xs rounded-full bg-surface border border-border hover:bg-primary hover:text-white transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Actions */}
                {message.metadata?.actions && (
                  <div className="mt-3 space-y-2">
                    {message.metadata.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleActionClick(action)}
                        className="w-full px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-background border border-border rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text-primary"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
