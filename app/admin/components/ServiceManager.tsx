'use client'

import React, { useState, useEffect } from 'react'
import ServiceCard from './services/ServiceCard'
import SearchBar from './ui/SearchBar'
import FilterDropdown from './ui/FilterDropdown'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorState from './ui/ErrorState'
import { Plus } from 'lucide-react'

const ServiceManager = () => {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/admin/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch services')
      
      const data = await response.json()
      setServices(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const toggleServiceActive = async (serviceId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      })
      if (!response.ok) throw new Error('Failed to update service')
      await fetchServices()
    } catch (err) {
      alert('Failed to update service status')
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
    const matchesActive = activeFilter === 'all' || 
      (activeFilter === 'true' && service.isActive) ||
      (activeFilter === 'false' && !service.isActive)
    return matchesSearch && matchesCategory && matchesActive
  })

  const categories = Array.from(new Set(services.map((s: any) => s.category))).map(cat => ({ value: cat, label: cat }))
  const activeOptions = [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchServices} />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search services..." className="max-w-md" />
        <FilterDropdown value={categoryFilter} onChange={setCategoryFilter} options={categories} placeholder="All Categories" />
        <FilterDropdown value={activeFilter} onChange={setActiveFilter} options={activeOptions} placeholder="All Services" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map(service => (
          <ServiceCard 
            key={service.id} 
            service={service}
            onEdit={() => console.log('Edit service:', service)}
            onToggleActive={toggleServiceActive}
          />
        ))}
      </div>
    </div>
  )
}

export default ServiceManager