import { Metadata } from 'next'
import { AdvancedChatBot } from '@/components/ai/AdvancedChatBot'

export const metadata: Metadata = {
  title: 'AI Chatbot | Modern Men Salon',
  description: 'Experience our intelligent salon assistant that can help you book appointments, learn about services, and answer your questions 24/7.',
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, MessageCircle, Zap, Shield, Clock, Users } from 'lucide-react'

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="w-12 h-12" />
              <h1 className="text-4xl font-bold">Modern Men AI Assistant</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your intelligent salon concierge available 24/7 to help with bookings, service information, and all your grooming needs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <MessageCircle className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-lg">Instant Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get immediate answers to your questions about services, pricing, and availability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-lg">Smart Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Book appointments instantly with our intelligent booking system that checks availability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-lg">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your personal information is secure. We use enterprise-grade encryption for all data.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Chatbot Component */}
          <div className="flex justify-center mb-12">
            <AdvancedChatBot />
          </div>

          {/* Capabilities */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                What Can I Help You With?
              </CardTitle>
              <CardDescription>
                Our AI assistant can help with all aspects of your salon experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-900">📅 Appointment Management</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Book new appointments instantly</li>
                    <li>• Check real-time availability</li>
                    <li>• Reschedule existing appointments</li>
                    <li>• Cancel appointments when needed</li>
                    <li>• Get appointment reminders</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-900">💇‍♂️ Service Information</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Detailed service descriptions</li>
                    <li>• Current pricing information</li>
                    <li>• Service duration details</li>
                    <li>• Stylist recommendations</li>
                    <li>• Product suggestions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-900">🏪 Salon Information</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Operating hours and location</li>
                    <li>• Contact information</li>
                    <li>• Parking and accessibility</li>
                    <li>• Salon policies and procedures</li>
                    <li>• Loyalty program details</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-900">🎯 Personalized Service</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Remember your preferences</li>
                    <li>• Recommend services based on history</li>
                    <li>• VIP customer perks</li>
                    <li>• Birthday and special occasion offers</li>
                    <li>• Personalized styling advice</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Available Anytime</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">&lt;30s</div>
                <div className="text-sm text-gray-600">Average Response Time</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
                <div className="text-sm text-gray-600">Services Available</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">4.9★</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Start Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>
                Getting started with our AI assistant is easy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold text-lg">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Start a Conversation</h4>
                  <p className="text-sm text-gray-600">
                    Type a message or click on quick action buttons to begin
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold text-lg">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Choose Your Service</h4>
                  <p className="text-sm text-gray-600">
                    Select from our range of professional grooming services
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold text-lg">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Book Instantly</h4>
                  <p className="text-sm text-gray-600">
                    Complete your booking and receive instant confirmation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
