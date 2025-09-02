// Common types used across the application
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'boolean'
  options?: SelectOption[]
}
