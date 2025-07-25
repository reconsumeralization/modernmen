'use client'

import React, { useState, useEffect } from 'react'
import StaffFilters from './staff/StaffFilters'
import StaffCard from './staff/StaffCard'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorState from './ui/ErrorState'

interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'OWNER' | 'MANAGER' | 'STYLIST' | 'BARBER' | 'RECEPTIONIST'
  specialties: string[]
  isActive: boolean
  totalBookings: number
  rating: number
}

const StaffManager = () => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<string>('all')

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/admin/staff', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch staff')
      
      const data = await response.json()
      setStaff(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff')
    } finally {
      setLoading(false)
    }
  }

  const toggleStaffActive = async (staffId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`/api/admin/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      })

      if (!response.ok) throw new Error('Failed to update staff')
      
      await fetchStaff() // Refresh the list
    } catch (err) {
      console.error('Error updating staff:', err)
      alert('Failed to update staff status')
    }
  }

  const handleEditStaff = (staffMember: Staff) => {
    // TODO: Open staff edit modal
    console.log('Edit staff:', staffMember)
  }

  const handleNewStaff = () => {
    // TODO: Open new staff modal
    console.log('New staff')
  }

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    const matchesActive = activeFilter === 'all' || 
      (activeFilter === 'true' && member.isActive) ||
      (activeFilter === 'false' && !member.isActive)
    
    return matchesSearch && matchesRole && matchesActive
  })

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchStaff} />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
      </div>

      <StaffFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
        onNewStaff={handleNewStaff}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((member) => (
            <StaffCard
              key={member.id}
              staff={member}
              onEdit={handleEditStaff}
              onToggleActive={toggleStaffActive}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No staff members found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffManager