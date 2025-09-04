'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  MessageSquare,
  Send,
  Phone,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Bell,
  MessageCircle,
  AtSign
} from '@/lib/icon-mapping'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { errorMonitor, ErrorCategory, ErrorSeverity } from '@/lib/error-monitoring'

interface Customer {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  emailReminders: boolean
  smsReminders: boolean
  marketingEmails: boolean
}

interface Communication {
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

interface CustomerCommunicationProps {
  className?: string
  onCommunicationSent?: (communication: Communication) => void
}

const communicationTypes = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'sms', label: 'SMS', icon: MessageSquare },
  { value: 'notification', label: 'In-App Notification', icon: Bell }
]

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  scheduled: 'bg-blue-100 text-blue-800'
}

const statusIcons = {
  draft: Edit,
  sent: CheckCircle,
  failed: XCircle,
  scheduled: Clock
}

export function CustomerCommunication({ className, onCommunicationSent }: CustomerCommunicationProps) {
  const [activeTab, setActiveTab] = useState('compose')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [communicationType, setCommunicationType] = useState<'email' | 'sms' | 'notification'>('email')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'email' | 'sms' | 'notification'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'sent' | 'failed' | 'scheduled'>('all')

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers?limit=1000')

      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }

      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load customers'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'CustomerCommunication',
          action: 'fetchCustomers'
        },
        ['crm', 'communication', 'fetch-customers']
      )
    }
  }

  // Fetch communications
  const fetchCommunications = async () => {
    try {
      const response = await fetch('/api/communications')

      if (!response.ok) {
        throw new Error('Failed to fetch communications')
      }

      const data = await response.json()
      setCommunications(data.communications || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load communications'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'CustomerCommunication',
          action: 'fetchCommunications'
        },
        ['crm', 'communication', 'fetch-communications']
      )
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchCommunications()
  }, [])

  // Filter customers based on search and communication preferences
  const filteredCustomers = useMemo(() => {
    let filtered = customers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by communication preferences
    if (communicationType === 'email') {
      filtered = filtered.filter(customer => customer.emailReminders || customer.marketingEmails)
    } else if (communicationType === 'sms') {
      filtered = filtered.filter(customer => customer.smsReminders && customer.phone)
    }

    return filtered
  }, [customers, searchTerm, communicationType])

  // Filter communications
  const filteredCommunications = useMemo(() => {
    let filtered = communications

    if (filterType !== 'all') {
      filtered = filtered.filter(comm => comm.type === filterType)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(comm => comm.status === filterStatus)
    }

    return filtered
  }, [communications, filterType, filterStatus])

  // Handle customer selection
  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleSelectAllCustomers = () => {
    setSelectedCustomers(filteredCustomers.map(c => c.id))
  }

  const handleClearSelection = () => {
    setSelectedCustomers([])
  }

  // Send communication
  const handleSendCommunication = async () => {
    if (!message.trim()) {
      setError('Message is required')
      return
    }

    if (selectedCustomers.length === 0) {
      setError('Please select at least one recipient')
      return
    }

    if (communicationType === 'email' && !subject.trim()) {
      setError('Subject is required for email communications')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const communicationData = {
        type: communicationType,
        subject: communicationType === 'email' ? subject : undefined,
        message,
        recipientIds: selectedCustomers,
        scheduledAt: scheduledDate && scheduledTime
          ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
          : undefined
      }

      const response = await fetch('/api/communications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communicationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send communication')
      }

      const data = await response.json()

      // Reset form
      setSubject('')
      setMessage('')
      setSelectedCustomers([])
      setScheduledDate('')
      setScheduledTime('')
      setIsDialogOpen(false)

      // Refresh communications
      await fetchCommunications()

      if (onCommunicationSent) {
        onCommunicationSent(data.communication)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send communication'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'CustomerCommunication',
          action: 'sendCommunication',
          metadata: {
            type: communicationType,
            recipientCount: selectedCustomers.length,
            hasSchedule: !!(scheduledDate && scheduledTime)
          }
        },
        ['crm', 'communication', 'send']
      )
    } finally {
      setLoading(false)
    }
  }

  // Delete communication
  const handleDeleteCommunication = async (communicationId: string) => {
    if (!confirm('Are you sure you want to delete this communication?')) {
      return
    }

    try {
      const response = await fetch(`/api/communications/${communicationId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete communication')
      }

      await fetchCommunications()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete communication'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'CustomerCommunication',
          action: 'deleteCommunication',
          metadata: { communicationId }
        },
        ['crm', 'communication', 'delete']
      )
    }
  }

  // Get character count for SMS
  const getCharacterCount = (text: string) => {
    const smsLimit = 160
    const remaining = smsLimit - text.length
    return { count: text.length, remaining, overLimit: remaining < 0 }
  }

  const charCount = communicationType === 'sms' ? getCharacterCount(message) : null

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Communication</h1>
          <p className="text-gray-600">
            Send emails, SMS messages, and in-app notifications to your customers
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recipients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Recipients ({selectedCustomers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and filters */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={communicationType} onValueChange={(value: 'email' | 'sms' | 'notification') => setCommunicationType(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {communicationTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bulk actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSelectAllCustomers}>
                      Select All ({filteredCustomers.length})
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClearSelection}>
                      Clear Selection
                    </Button>
                  </div>

                  {/* Customer list */}
                  <div className="max-h-96 overflow-y-auto border rounded-lg">
                    <div className="divide-y">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedCustomers.includes(customer.id)}
                              onCheckedChange={() => handleCustomerToggle(customer.id)}
                            />
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {customer.firstName[0]}{customer.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.fullName}</div>
                              <div className="text-sm text-gray-500">
                                {communicationType === 'email' ? customer.email : customer.phone || 'No phone'}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {communicationType === 'email' && customer.emailReminders && (
                              <Badge variant="outline" className="text-xs">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Badge>
                            )}
                            {communicationType === 'sms' && customer.smsReminders && customer.phone && (
                              <Badge variant="outline" className="text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                SMS
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message Composer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {communicationTypes.find(t => t.value === communicationType)?.icon &&
                    React.createElement(communicationTypes.find(t => t.value === communicationType)!.icon, {
                      className: "h-5 w-5"
                    })
                  }
                  Compose {communicationTypes.find(t => t.value === communicationType)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Subject (email only) */}
                  {communicationType === 'email' && (
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject..."
                      />
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        communicationType === 'sms'
                          ? 'Enter SMS message (160 characters max)...'
                          : 'Enter your message...'
                      }
                      rows={8}
                      className={cn(
                        charCount?.overLimit && "border-red-300 focus:border-red-500"
                      )}
                    />
                    {charCount && (
                      <div className={cn(
                        "text-sm mt-1",
                        charCount.overLimit ? "text-red-600" : "text-gray-500"
                      )}>
                        {charCount.count}/{charCount.overLimit ? '160 (over limit)' : '160'} characters
                      </div>
                    )}
                  </div>

                  {/* Scheduling */}
                  <div className="space-y-2">
                    <Label>Schedule (optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Send button */}
                  <Button
                    onClick={handleSendCommunication}
                    disabled={loading || selectedCustomers.length === 0 || !message.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {scheduledDate && scheduledTime ? 'Schedule' : 'Send'} Communication
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Select value={filterType} onValueChange={(value: 'all' | 'email' | 'sms' | 'notification') => setFilterType(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(value: 'all' | 'draft' | 'sent' | 'failed' | 'scheduled') => setFilterStatus(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Communications List */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject/Message</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredCommunications.map((communication) => {
                      const StatusIcon = statusIcons[communication.status]
                      const TypeIcon = communicationTypes.find(t => t.value === communication.type)?.icon || Mail

                      return (
                        <motion.tr
                          key={communication.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="h-4 w-4" />
                              {communication.type}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {communication.subject || communication.message.substring(0, 50) + '...'}
                              </div>
                              {communication.subject && (
                                <div className="text-sm text-gray-500">
                                  {communication.message.substring(0, 30)}...
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{communication.recipients.length}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[communication.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {communication.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {communication.sentAt
                              ? new Date(communication.sentAt).toLocaleString()
                              : communication.scheduledAt
                                ? `Scheduled: ${new Date(communication.scheduledAt).toLocaleString()}`
                                : 'Not sent'
                            }
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCommunication(communication.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>

              {filteredCommunications.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No communications found</h3>
                  <p className="text-gray-500">
                    {filterType !== 'all' || filterStatus !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Start by sending your first communication'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="text-center py-12">
            <AtSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Communication Templates</h3>
            <p className="text-gray-500 mb-4">
              Save and reuse common messages and templates
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
