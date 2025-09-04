// CRM Dashboard Components
export { CRMDashboard } from './CRMDashboard'

// Customer Management Components
export { CustomerList } from './CustomerList'

// Appointment Management Components
export { AppointmentCalendar } from './AppointmentCalendar'

// Communication Components
export { CustomerCommunication } from './CustomerCommunication'

// Types
export interface Customer {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  loyaltyPoints: number
  totalSpent: number
  visitCount: number
  lastVisit?: string
  isActive: boolean
  avatar?: string
  createdAt: string
}

export interface Appointment {
  id: string
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  stylist: {
    id: string
    firstName: string
    lastName: string
  }
  services: Array<{
    id: string
    name: string
    duration: number
    price: number
  }>
  dateTime: string
  duration: number
  status: 'confirmed' | 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  pricing: {
    subtotal: number
    total: number
  }
  notes?: string
}

export interface Communication {
  id: string
  type: 'email' | 'sms' | 'notification'
  subject?: string
  message: string
  recipients: Customer[]
  status: 'draft' | 'sent' | 'failed' | 'scheduled'
  sentAt?: string
  scheduledAt?: string
  createdAt: string
  createdBy: string
  deliveryStats?: {
    sent: number
    delivered: number
    failed: number
    opened?: number
    clicked?: number
  }
}
