'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scissors, Clock, CheckCircle } from '@/lib/icon-mapping'

interface Service {
  id: string
  name: string
  price: string
  duration: string
  description: string
  popular?: boolean
  category: string
  features: string[]
}

interface ServicePreviewProps {
  services: Service[]
  selectedService?: string
  onServiceSelect: (serviceId: string) => void
}

export default function ServicePreview({
  services,
  selectedService,
  onServiceSelect
}: ServicePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-xl">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 rounded-full bg-white/20">
              <Scissors className="h-5 w-5" />
            </div>
            <span>Our Services</span>
          </CardTitle>
          <CardDescription className="text-slate-200">
            Professional hair care services
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {services.length === 0 ? (
              // Show skeleton loading for services
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                          <div className="h-5 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => onServiceSelect(service.name)}
                >
                  <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedService === service.name
                      ? 'border-amber-500 bg-amber-50 shadow-lg'
                      : 'border-gray-200 bg-gray-50 hover:border-amber-300 hover:bg-amber-50/50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                            {service.name}
                          </h4>
                          {service.popular && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{service.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                      <span className="font-bold text-lg text-amber-600">{service.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
