// Dashboard related types
export interface User {
  name: string
  email: string
  role: 'admin' | 'customer' | 'barber'
}

export interface DashboardStats {
  revenue: number
  previousRevenue: number
  appointments: number
  previousAppointments: number
  customers: number
  previousCustomers: number
}

export interface Appointment {
  id: string
  customerName: string
  service: string
  time: string
  duration: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  barber: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}

export interface ServiceData {
  name: string
  count: number
  percentage: number
}

export interface DataTableColumn<T = any> {
  accessorKey: keyof T
  header: string
  cell?: (props: { row: any }) => React.ReactNode
}
