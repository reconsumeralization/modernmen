'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Booking {
  id: string
  clientName: string
  service: string
  staff: string
  date: string
  time: string
  duration: number
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  price: number
  notes?: string
}

export default function BookingManager() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        clientName: 'John Smith',
        service: "Men's Haircut",
        staff: 'Hicham Mellouli',
        date: selectedDate,
        time: '09:00',
        duration: 60,
        status: 'CONFIRMED',
        price: 45,
        notes: 'Regular client, prefers short sides'
      },
      {
        id: '2',
        clientName: 'Mike Johnson',
        service: 'Beard Grooming',
        staff: 'Ella Forestal',
        date: selectedDate,
        time: '10:30',
        duration: 30,
        status: 'PENDING',
        price: 25
      },
      {
        id: '3',
        clientName: 'David Wilson',
        service: 'Hair Tattoo',
        staff: 'Tri Ha',
        date: selectedDate,
        time: '14:00',
        duration: 45,
        status: 'IN_PROGRESS',
        price: 35,
        notes: 'Custom design requested'
      }
    ]
    setBookings(mockBookings)
  }, [selectedDate])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'NO_SHOW': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus as any }
          : booking
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Booking Management</h2>
        <button
          onClick={() => setShowNewBookingModal(true)}
          className="bg-salon-gold text-salon-dark px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-yellow-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <CalendarDaysIcon className="h-6 w-6 text-salon-gold" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
          />
          <span className="text-gray-600">
            {bookings.length} bookings for this date
          </span>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Today's Schedule</h3>
        </div>
        
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No bookings for this date</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-lg">{booking.time}</span>
                        <span className="text-gray-500">({booking.duration} min)</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Client</p>
                        <p className="font-medium">{booking.clientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service</p>
                        <p className="font-medium">{booking.service}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Stylist</p>
                        <p className="font-medium">{booking.staff}</p>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Notes</p>
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-lg font-bold text-salon-gold">
                      ${booking.price}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      {booking.status === 'PENDING' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                          title="Confirm booking"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                          title="Start service"
                        >
                          <ClockIcon className="h-5 w-5" />
                        </button>
                      )}
                      
                      {booking.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                          title="Complete service"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => setEditingBooking(booking)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Edit booking"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                        title="Cancel booking"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <NewBookingModal
          onClose={() => setShowNewBookingModal(false)}
          onSave={(booking) => {
            setBookings(prev => [...prev, { ...booking, id: Date.now().toString() }])
            setShowNewBookingModal(false)
          }}
        />
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={(updatedBooking) => {
            setBookings(prev => 
              prev.map(b => b.id === updatedBooking.id ? updatedBooking : b)
            )
            setEditingBooking(null)
          }}
        />
      )}
    </div>
  )
}

function NewBookingModal({ onClose, onSave }: { onClose: () => void, onSave: (booking: Omit<Booking, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    clientName: '',
    service: '',
    staff: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: 60,
    price: 45,
    notes: ''
  })

  const services = [
    { name: "Men's Haircut", duration: 60, price: 45 },
    { name: "Beard Grooming", duration: 30, price: 25 },
    { name: "Hair Tattoo", duration: 45, price: 35 },
    { name: "Hair Styling", duration: 30, price: 30 }
  ]

  const staff = ['Hicham Mellouli', 'Ella Forestal', 'Tri Ha']

  const handleServiceChange = (serviceName: string) => {
    const service = services.find(s => s.name === serviceName)
    if (service) {
      setFormData(prev => ({
        ...prev,
        service: serviceName,
        duration: service.duration,
        price: service.price
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      status: 'PENDING'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">New Booking</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service *
              </label>
              <select
                required
                value={formData.service}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
              >
                <option value="">Select service</option>
                {services.map(service => (
                  <option key={service.name} value={service.name}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stylist *
              </label>
              <select
                required
                value={formData.staff}
                onChange={(e) => setFormData(prev => ({ ...prev, staff: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
              >
                <option value="">Select stylist</option>
                {staff.map(stylist => (
                  <option key={stylist} value={stylist}>
                    {stylist}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-salon-gold text-salon-dark rounded-md hover:bg-yellow-500"
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditBookingModal({ booking, onClose, onSave }: { 
  booking: Booking
  onClose: () => void
  onSave: (booking: Booking) => void 
}) {
  const [formData, setFormData] = useState(booking)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Edit Booking</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-salon-gold text-salon-dark rounded-md hover:bg-yellow-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
                    
