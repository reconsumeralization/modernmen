'use client'

import { useState, useEffect } from 'react'
import { 
  UserGroupIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { clientsAPI } from '@/lib/api'
import AdminLayout from './AdminLayout'

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  totalVisits?: number | null // Make optional and allow null
  totalSpent?: number | null // Make optional and allow null
  lastVisit: string | null
}

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewClientModal, setShowNewClientModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadClients = async () => {
    try {
      setLoading(true)
      const response = await clientsAPI.getAll({ 
        search: searchTerm, 
        page: currentPage, 
        limit: 10 
      })
      setClients(response.clients || [])
      setTotalPages(response.totalPages || 1)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [searchTerm, currentPage])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsAPI.delete(id)
        loadClients() // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete client')
      }
    }
  }

  return (
    <AdminLayout currentPage="clients">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Client Management</h2>
          <button
            onClick={() => setShowNewClientModal(true)}
            className="bg-salon-gold text-salon-dark px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-yellow-500"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Client</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-none focus:ring-0"
            />
          </div>
        </div>

        {error && <div className="text-red-600 p-4 bg-red-50 rounded-md">{error}</div>}

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading clients...</div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{client.firstName} {client.lastName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Visits: {client.totalVisits ?? 0}</div>
                        <div className="text-sm text-gray-500">Spent: ${client.totalSpent ?? 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => setSelectedClient(client)} className="text-blue-600 hover:text-blue-900"><EyeIcon className="h-5 w-5" /></button>
                          <button onClick={() => setEditingClient(client)} className="text-gray-600 hover:text-gray-900"><PencilIcon className="h-5 w-5" /></button>
                          <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 flex items-center justify-between border-t">
                  <p className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        {showNewClientModal && (
          <ClientModal
            isOpen={showNewClientModal}
            onClose={() => setShowNewClientModal(false)}
            onSave={loadClients}
          />
        )}

        {editingClient && (
          <ClientModal
            isOpen={!!editingClient}
            onClose={() => setEditingClient(null)}
            onSave={loadClients}
            client={editingClient}
          />
        )}

        {selectedClient && (
          <ClientDetailModal
            isOpen={!!selectedClient}
            onClose={() => setSelectedClient(null)}
            client={selectedClient}
          />
        )}
      </div>
    </AdminLayout>
  )
}

// Client Modal Component
interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  client?: Client
}

function ClientModal({ isOpen, onClose, onSave, client }: ClientModalProps) {
  const [formData, setFormData] = useState({
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    email: client?.email || '',
    phone: client?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (client) {
        await clientsAPI.update(client.id, formData)
      } else {
        await clientsAPI.create(formData)
      }
      onSave()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save client')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="bg-white rounded-lg p-6 text-left shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-medium mb-4">{client ? 'Edit Client' : 'New Client'}</h3>
            {error && <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</div>}
            <div className="space-y-4">
              <input type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="text" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required className="w-full border p-2 rounded-md" />
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-salon-gold text-salon-dark rounded-md disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Client Detail Modal Component
interface ClientDetailModalProps {
  isOpen: boolean
  onClose: () => void
  client: Client
}

function ClientDetailModal({ isOpen, onClose, client }: ClientDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="bg-white rounded-lg p-6 text-left shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <h3 className="text-lg font-medium mb-4">{client.firstName} {client.lastName}</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Total Visits:</strong> {client.totalVisits ?? 0}</p>
            <p><strong>Total Spent:</strong> ${client.totalSpent ?? 0}</p>
            <p><strong>Last Visit:</strong> {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 border rounded-md">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}