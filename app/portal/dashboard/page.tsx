'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CalendarIcon, 
  UserCircleIcon, 
  SparklesIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  CreditCardIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

interface CustomerData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface Booking {
  id: string
  date: string
  time: string
  service: {
    name: string
    price: number
  }
  staff: {
    firstName: string
    lastName: string
  }
  status: string
}
export default function CustomerDashboard() {
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('bookings')
  const [giftCardCode, setGiftCardCode] = useState('')
  const [giftCardInfo, setGiftCardInfo] = useState<any | null>(null)
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('customerToken')
    const customerData = localStorage.getItem('customerData')
    
    if (!token || !customerData) {
      router.push('/portal/login')
      return
    }
    
    setCustomer(JSON.parse(customerData))
    fetchCustomerData(token)
  }, [])
  
  const fetchCustomerData = async (token: string) => {
    try {
      // Fetch bookings
      const bookingsResponse = await fetch('/api/customers/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
      }
      
      // Fetch loyalty points
      const pointsResponse = await fetch('/api/customers/loyalty', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (pointsResponse.ok) {
        const pointsData = await pointsResponse.json()
        setLoyaltyPoints(pointsData.totalPoints || 0)
      }
    } catch (error) {
      console.error('Error fetching customer data:', error)
    } finally {
      setLoading(false)
    }
  }  
  const handleLogout = () => {
    localStorage.removeItem('customerToken')
    localStorage.removeItem('customerData')
    router.push('/portal/login')
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const tabs = [
    { id: 'bookings', name: 'My Bookings', icon: CalendarIcon },
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'loyalty', name: 'Loyalty Points', icon: SparklesIcon },
    { id: 'history', name: 'Service History', icon: ClockIcon },
    { id: 'giftcards', name: 'Gift Cards', icon: CreditCardIcon },
  ]
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {customer?.firstName}!
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your appointments and profile
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>      
      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Bookings</h2>
              <button
                onClick={() => router.push('/book-enhanced')}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Book New Appointment
              </button>
            </div>
            
            {bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bookings yet</p>
                <button
                  onClick={() => router.push('/book-enhanced')}
                  className="mt-4 text-gray-900 hover:underline"
                >
                  Book your first appointment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          with {booking.staff.firstName} {booking.staff.lastName}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {formatDate(booking.date)} at {booking.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${booking.status === 'CONFIRMED' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {booking.status}
                        </span>
                        <p className="mt-2 text-lg font-semibold text-gray-900">
                          ${booking.service.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900">
                  {customer?.firstName} {customer?.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{customer?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{customer?.phone}</p>
              </div>
            </div>
            <button className="mt-6 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Edit Profile
            </button>
          </motion.div>
        )}        
        {/* Loyalty Points Tab */}
        {activeTab === 'loyalty' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-white">
              <SparklesIcon className="h-12 w-12 mb-4" />
              <h2 className="text-3xl font-bold mb-2">
                {loyaltyPoints} Points
              </h2>
              <p className="text-yellow-100">
                Earn points with every visit and redeem for free services!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <CreditCardIcon className="h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Earn Points</h3>
                <p className="text-sm text-gray-600">
                  Get 1 point for every $1 spent
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <HeartIcon className="h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Member Benefits</h3>
                <p className="text-sm text-gray-600">
                  Exclusive offers and priority booking
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <SparklesIcon className="h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Redeem Rewards</h3>
                <p className="text-sm text-gray-600">
                  100 points = $10 off any service
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Service History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Service History</h2>
            <p className="text-gray-600">Your complete service history will appear here.</p>
          </motion.div>
        )}

        {/* Gift Cards Tab */}
        {activeTab === 'giftcards' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Gift Cards</h2>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gift Card Code</label>
                <input
                  className="border px-3 py-2 w-64"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                />
              </div>
              <button
                className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white"
                onClick={async () => {
                  if (!giftCardCode) return
                  const res = await fetch(`/api/gift-cards?code=${giftCardCode}`)
                  const data = await res.json()
                  if (res.ok) setGiftCardInfo(data)
                  else {
                    setGiftCardInfo(null)
                    alert(data.error || 'Lookup failed')
                  }
                }}
              >
                Check Balance
              </button>
            </div>
            {giftCardInfo && (
              <div className="border rounded p-4 bg-gray-50">
                <div className="text-sm text-gray-600">Code</div>
                <div className="font-semibold mb-2">{giftCardInfo.code}</div>
                <div className="text-sm text-gray-600">Balance</div>
                <div className="font-semibold">${Number(giftCardInfo.balance).toFixed(2)} CAD</div>
                <div className="text-sm text-gray-600 mt-2">Status</div>
                <div className="font-semibold">{giftCardInfo.status}</div>
                {giftCardInfo.expiresAt && (
                  <div className="text-sm text-gray-600 mt-2">Expires</div>
                )}
                {giftCardInfo.expiresAt && (
                  <div className="font-semibold">{new Date(giftCardInfo.expiresAt).toLocaleDateString()}</div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}