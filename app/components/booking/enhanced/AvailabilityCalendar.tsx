'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfToday } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface TimeSlot {
  time: string
  datetime: string
  available: boolean
  availableStaff?: { id: string; name: string }[]
}

interface AvailabilityCalendarProps {
  staffId: string
  serviceId: string
  onSelectSlot: (date: string, time: string) => void
  onSwitchToAny?: () => void
  onSwitchToStaff?: (id: string) => void
}

export default function AvailabilityCalendar({ 
  staffId, 
  serviceId, 
  onSelectSlot,
  onSwitchToAny,
  onSwitchToStaff
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(startOfToday())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [altStaff, setAltStaff] = useState<{ id: string; name: string }[] | null>(null)
  const [checkingAlt, setCheckingAlt] = useState(false)
  
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
    // If user chose a specific barber, check if other barbers are available at this exact time
    if (staffId !== 'any') {
      void fetchAltForTime(slot.time)
    } else {
      // If user chose 'any', derive alt list from slot data if present
      if (slot.availableStaff && slot.availableStaff.length > 1) {
        setAltStaff(slot.availableStaff)
      } else {
        setAltStaff(null)
      }
    }
  }

  const fetchAltForTime = async (time: string) => {
    try {
      setCheckingAlt(true)
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const res = await fetch(`/api/availability?date=${dateStr}&staffId=any&serviceId=${serviceId}`)
      if (res.ok) {
        const data = await res.json()
        const match = (data.slots || []).find((s: TimeSlot) => s.time === time)
        if (match && match.availableStaff && match.availableStaff.length > 0) {
          setAltStaff(match.availableStaff)
        } else {
          setAltStaff(null)
        }
      }
    } catch (e) {
      setAltStaff(null)
    } finally {
      setCheckingAlt(false)
    }
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
          <div className="text-center py-8">
            <p className="text-gray-600 mb-3">No available slots for this date{staffId !== 'any' ? ' with your selected barber' : ''}.</p>
            {staffId !== 'any' && (
              <button
                type="button"
                onClick={onSwitchToAny}
                className="px-4 py-2 text-sm font-medium border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                Show availability with any barber
              </button>
            )}
          </div>
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

      {/* Alternate staff suggestion */}
      {staffId !== 'any' && selectedSlot && altStaff && altStaff.length > 0 && (
        <div className="mt-6 p-3 rounded-md border border-amber-300 bg-amber-50 text-amber-900 text-sm">
          <p className="font-medium mb-2">This time is available with {altStaff.length} {altStaff.length === 1 ? 'barber' : 'barbers'}:</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {altStaff.map((s) => (
              <span key={s.id} className="px-2 py-1 rounded border border-amber-300 bg-white text-amber-900">{s.name}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSwitchToAny}
              className="px-4 py-2 text-sm font-medium border-2 border-black hover:bg-black hover:text-white transition-colors"
              disabled={checkingAlt}
            >
              {checkingAlt ? 'Checking…' : 'Book with any barber'}
            </button>
            {altStaff[0] && (
              <button
                type="button"
                onClick={() => onSwitchToStaff && onSwitchToStaff(altStaff[0].id)}
                className="px-4 py-2 text-sm font-medium border-2 border-amber-300 bg-white hover:bg-amber-100 text-amber-900 transition-colors"
              >
                Book with {altStaff[0].name}
              </button>
            )}
            <span className="text-xs text-amber-800">You can still specify a preference after switching.</span>
          </div>
        </div>
      )}
    </div>
  )
}