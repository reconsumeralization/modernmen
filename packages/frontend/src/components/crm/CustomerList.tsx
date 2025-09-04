'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Star,
  Calendar,
  DollarSign,
  Users,
  ChevronDown,
  ChevronUp,
  Download,
  Upload
} from '@/lib/icon-mapping'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { errorMonitor, ErrorCategory, ErrorSeverity } from '@/lib/error-monitoring'

interface Customer {
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

interface CustomerListProps {
  className?: string
  onCustomerSelect?: (customer: Customer) => void
  onCustomerEdit?: (customer: Customer) => void
  onCustomerDelete?: (customer: Customer) => void
  showActions?: boolean
  compact?: boolean
  maxHeight?: string
}

const tierColors = {
  bronze: 'bg-amber-100 text-amber-800',
  silver: 'bg-gray-100 text-gray-800',
  gold: 'bg-yellow-100 text-yellow-800',
  platinum: 'bg-purple-100 text-purple-800'
}

const tierIcons = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎'
}

export function CustomerList({
  className,
  onCustomerSelect,
  onCustomerEdit,
  onCustomerDelete,
  showActions = true,
  compact = false,
  maxHeight = '600px'
}: CustomerListProps) {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [tierFilter, setTierFilter] = useState<'all' | 'bronze' | 'silver' | 'gold' | 'platinum'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'tier' | 'spent' | 'visits' | 'lastVisit'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        status: statusFilter,
        loyaltyTier: tierFilter,
        sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`
      })

      const response = await fetch(`/api/customers?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }

      const data = await response.json()
      setCustomers(data.customers || [])
      setTotalPages(data.totalPages || 1)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load customers'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'CustomerList',
          action: 'fetchCustomers',
          metadata: {
            searchTerm,
            statusFilter,
            tierFilter,
            sortBy,
            sortOrder,
            currentPage
          }
        },
        ['crm', 'customers', 'fetch']
      )
    } finally {
      setLoading(false)
    }
  }

  // Fetch customers when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers()
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter, tierFilter, sortBy, sortOrder, currentPage])

  // Handle customer actions
  const handleCustomerClick = (customer: Customer) => {
    if (onCustomerSelect) {
      onCustomerSelect(customer)
    } else {
      router.push(`/crm/customers/${customer.id}`)
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    if (onCustomerEdit) {
      onCustomerEdit(customer)
    } else {
      router.push(`/crm/customers/${customer.id}/edit`)
    }
  }

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete ${customer.fullName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete customer')
      }

      // Refresh the list
      await fetchCustomers()

      if (onCustomerDelete) {
        onCustomerDelete(customer)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete customer'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'CustomerList',
          action: 'deleteCustomer',
          metadata: { customerId: customer.id }
        },
        ['crm', 'customers', 'delete']
      )
    }
  }

  // Handle bulk actions
  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedCustomers.length} customers?`)) {
      return
    }

    try {
      await Promise.all(
        selectedCustomers.map(id =>
          fetch(`/api/customers/${id}`, { method: 'DELETE' })
        )
      )

      setSelectedCustomers([])
      await fetchCustomers()
    } catch (err) {
      const errorMessage = 'Failed to delete selected customers'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'CustomerList',
          action: 'bulkDelete',
          metadata: { selectedCount: selectedCustomers.length }
        },
        ['crm', 'customers', 'bulk-delete']
      )
    }
  }

  // Toggle sort
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  // Export customers
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Tier', 'Points', 'Total Spent', 'Visits', 'Last Visit', 'Status'].join(','),
      ...customers.map(customer => [
        `"${customer.fullName}"`,
        `"${customer.email}"`,
        `"${customer.phone || ''}"`,
        customer.loyaltyTier,
        customer.loyaltyPoints,
        customer.totalSpent,
        customer.visitCount,
        customer.lastVisit ? `"${new Date(customer.lastVisit).toLocaleDateString()}"` : '',
        customer.isActive ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100) // Assuming amount is in cents
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  // Render customer row (table view)
  const renderCustomerRow = (customer: Customer) => (
    <TableRow
      key={customer.id}
      className={cn(
        "hover:bg-gray-50 cursor-pointer",
        !customer.isActive && "opacity-60"
      )}
      onClick={() => handleCustomerClick(customer)}
    >
      {showActions && (
        <TableCell>
          <Checkbox
            checked={selectedCustomers.includes(customer.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedCustomers(prev => [...prev, customer.id])
              } else {
                setSelectedCustomers(prev => prev.filter(id => id !== customer.id))
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </TableCell>
      )}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={customer.avatar} alt={customer.fullName} />
            <AvatarFallback>
              {customer.firstName[0]}{customer.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{customer.fullName}</div>
            <div className="text-sm text-gray-500">{customer.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{tierIcons[customer.loyaltyTier]}</span>
          <Badge className={tierColors[customer.loyaltyTier]}>
            {customer.loyaltyTier}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(customer.totalSpent)}
      </TableCell>
      <TableCell className="text-center">{customer.visitCount}</TableCell>
      <TableCell>{formatDate(customer.lastVisit)}</TableCell>
      {showActions && (
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                handleCustomerClick(customer)
              }}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                handleEditCustomer(customer)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteCustomer(customer)
                }}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  )

  // Render customer card (card view)
  const renderCustomerCard = (customer: Customer) => (
    <motion.div
      key={customer.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-shadow",
          !customer.isActive && "opacity-60"
        )}
        onClick={() => handleCustomerClick(customer)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={customer.avatar} alt={customer.fullName} />
                <AvatarFallback>
                  {customer.firstName[0]}{customer.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{customer.fullName}</h3>
                <p className="text-sm text-gray-500">{customer.email}</p>
                {customer.phone && (
                  <p className="text-sm text-gray-500">{customer.phone}</p>
                )}
              </div>
            </div>
            <Badge className={tierColors[customer.loyaltyTier]}>
              {tierIcons[customer.loyaltyTier]} {customer.loyaltyTier}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-1 text-gray-500">
                <DollarSign className="h-4 w-4" />
                Total Spent
              </div>
              <div className="font-medium">{formatCurrency(customer.totalSpent)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="h-4 w-4" />
                Visits
              </div>
              <div className="font-medium">{customer.visitCount}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last visit: {formatDate(customer.lastVisit)}
            </div>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    handleCustomerClick(customer)
                  }}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    handleEditCustomer(customer)
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Customer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCustomer(customer)
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Customer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading customers</div>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <Button onClick={fetchCustomers}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="text-gray-600">
            {customers.length} customers • Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={(value: any) => setTierFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedCustomers.length} customers selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedCustomers([])}>
                  Clear Selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer List */}
      <Card>
        <CardContent className="p-0">
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {showActions && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCustomers.length === customers.length && customers.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCustomers(customers.map(c => c.id))
                            } else {
                              setSelectedCustomers([])
                            }
                          }}
                        />
                      </TableHead>
                    )}
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('name')}
                    >
                      Customer
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('tier')}
                    >
                      Tier
                      {sortBy === 'tier' && (
                        sortOrder === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 text-right"
                      onClick={() => handleSort('spent')}
                    >
                      Total Spent
                      {sortBy === 'spent' && (
                        sortOrder === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 text-center"
                      onClick={() => handleSort('visits')}
                    >
                      Visits
                      {sortBy === 'visits' && (
                        sortOrder === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('lastVisit')}
                    >
                      Last Visit
                      {sortBy === 'lastVisit' && (
                        sortOrder === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                      )}
                    </TableHead>
                    {showActions && <TableHead className="w-12">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {customers.map(renderCustomerRow)}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {customers.map(renderCustomerCard)}
                </AnimatePresence>
              </div>
            </div>
          )}

          {customers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || tierFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first customer'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
