'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfToday } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface TimeSlot {
  time: string
  datetime: string
  available: boolean
}

interface AvailabilityCalendarProps {
  staffId: string
  serviceId: string
  onSelectSlot: (date: string, time: string) => void
}

export default function AvailabilityCalendar({ 
  staffId, 
  serviceId, 
  onSelectSlot 
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(startOfToday())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  
  // Fetch availability when date/staff/service changes
  useEffect(() => {
    if (staffId && serviceId) {
      fetchAvailability()
    }
  }, [selectedDate, staffId, serviceId])
  
  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const response = await fetch(
        `/api/availability?date=${dateStr}&staffId=${staffId}&serviceId=${serviceId}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setTimeSlots(data.slots || [])
      } else {
        console.error('Failed to fetch availability')
        setTimeSlots([])
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
      setTimeSlots([])
    } finally {
      setLoading(false)
    }
  }  
  const handleDateChange = (direction: 'prev' | 'next') => {
    const newDate = direction === 'next' 
      ? addDays(selectedDate, 1)
      : addDays(selectedDate, -1)
    
    // Don't allow selecting past dates
    if (newDate >= startOfToday()) {
      setSelectedDate(newDate)
      setSelectedSlot(null)
    }
  }
  
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot.time)
    onSelectSlot(format(selectedDate, 'yyyy-MM-dd'), slot.time)
  }
  
  // Generate week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfToday(), i)
    return {
      date,
      label: format(date, 'EEE'),
      dayNum: format(date, 'd'),
      isSelected: format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    }
  })
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Date & Time
      </h3>      
      {/* Week View */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <button
              key={day.date.toISOString()}
              onClick={() => setSelectedDate(day.date)}
              className={`
                py-3 px-2 rounded-lg text-center transition-all
                ${day.isSelected 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <div className="text-xs font-medium">{day.label}</div>
              <div className="text-lg font-bold">{day.dayNum}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => handleDateChange('prev')}
          disabled={format(selectedDate, 'yyyy-MM-dd') === format(startOfToday(), 'yyyy-MM-dd')}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>        
        <h4 className="text-md font-medium text-gray-900">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h4>
        
        <button
          onClick={() => handleDateChange('next')}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Time Slots */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          Available Times
        </h4>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : timeSlots.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No available slots for this date
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <AnimatePresence mode="popLayout">              {timeSlots.map((slot) => (
                <motion.button
                  key={slot.time}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleSlotSelect(slot)}
                  className={`
                    py-2 px-3 rounded-md text-sm font-medium transition-all
                    ${selectedSlot === slot.time
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {slot.time}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}