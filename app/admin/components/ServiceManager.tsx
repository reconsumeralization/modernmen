'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { servicesAPI } from '@/lib/api'
import AdminLayout from './AdminLayout'

interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  category: string
  addOns: string[]
  isActive: boolean
}

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const loadServices = async () => {
    try {
      setLoading(true)
      const response = await servicesAPI.getAll()
      setServices(response.services || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        // Assuming a delete API exists for services
        // await servicesAPI.delete(id);
        loadServices() // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete service')
      }
    }
  }

  return (
    <AdminLayout currentPage="services">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Service Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-salon-gold text-salon-dark px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-yellow-500"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Service</span>
          </button>
        </div>

        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.category}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingService(service)} className="text-blue-600 hover:text-blue-800">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{service.duration} min</span>
                  <span className="text-lg font-medium text-salon-gold">${service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Modal (Add/Edit) */}
        {showModal && (
          <ServiceModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false)
              setEditingService(null)
            }}
            onSave={loadServices}
            service={editingService}
          />
        )}
      </div>
    </AdminLayout>
  )
}

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  service?: Service | null
}

function ServiceModal({ isOpen, onClose, onSave, service }: ServiceModalProps) {
  const [formData, setFormData] = useState<Service>({
    id: service?.id || '',
    name: service?.name || '',
    description: service?.description || '',
    duration: service?.duration || 0,
    price: service?.price || 0,
    category: service?.category || '',
    addOns: service?.addOns || [],
    isActive: service?.isActive ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (formData.id) {
        // Update existing service
        // await servicesAPI.update(formData.id, formData);
      } else {
        // Create new service
        await servicesAPI.create(formData);
      }
      onSave()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service')
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
            <h3 className="text-lg font-medium mb-4">{service ? 'Edit Service' : 'Add Service'}</h3>
            {error && <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</div>}
            <div className="space-y-4">
              <input type="text" placeholder="Service Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full border p-2 rounded-md" />
              <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border p-2 rounded-md" />
              <input type="number" placeholder="Duration (minutes)" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} required className="w-full border p-2 rounded-md" />
              <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required className="w-full border p-2 rounded-md" />
              <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="text" placeholder="Add-ons (comma-separated)" value={formData.addOns.join(', ')} onChange={e => setFormData({...formData, addOns: e.target.value.split(',').map(s => s.trim())})} className="w-full border p-2 rounded-md" />
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="form-checkbox" />
                <span>Active</span>
              </label>
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