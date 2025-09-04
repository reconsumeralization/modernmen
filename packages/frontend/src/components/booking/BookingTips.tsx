'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Phone } from '@/lib/icon-mapping'

const tips = [
  {
    icon: Clock,
    title: 'Arrival Time',
    description: 'Please arrive 5-10 minutes early for your appointment'
  },
  {
    icon: CheckCircle,
    title: 'Cancellation Policy',
    description: '24-hour notice required for appointment changes'
  },
  {
    icon: Phone,
    title: 'Contact Us',
    description: 'Call (306) 522-4111 if you need to reschedule'
  }
]

export default function BookingTips() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-800 to-amber-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Booking Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-blue-500 rounded-full flex items-center justify-center">
                  <tip.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <Badge className="bg-amber-100 text-amber-800 mb-2">
              💡 Pro Tip
            </Badge>
            <p className="text-sm text-amber-800">
              Book online for the fastest service and to see all available time slots in real-time!
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
