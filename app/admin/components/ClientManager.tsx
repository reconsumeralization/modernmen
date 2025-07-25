'use client'

import React, { useState, useEffect } from 'react'
import ClientCard from './clients/ClientCard'
import SearchBar from './ui/SearchBar'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorState from './ui/ErrorState'
import { Plus } from 'lucide-react'

const ClientManager = () => {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/admin/clients', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch clients')
      
      const data = await response.json()
      setClients(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client => 
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchClients} />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search clients..."
        className="max-w-md mb-6"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map(client => (
          <ClientCard 
            key={client.id} 
            client={client}
            onEdit={() => console.log('Edit client:', client)}
            onView={() => console.log('View client:', client)}
          />
        ))}
      </div>
    </div>
  )
}

export default ClientManager