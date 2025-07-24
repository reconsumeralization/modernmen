'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { staffAPI } from '@/lib/api'
import AdminLayout from './AdminLayout'

interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  isActive: boolean
}

export default function StaffManager() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  const loadStaff = async () => {
    try {
      setLoading(true)
      const response = await staffAPI.getAll()
      setStaff(response.staff || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        // Assuming a delete API exists for staff
        // await staffAPI.delete(id);
        loadStaff() // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete staff member')
      }
    }
  }

  return (
    <AdminLayout currentPage="staff">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Staff Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-salon-gold text-salon-dark px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-yellow-500"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Staff</span>
          </button>
        </div>

        {loading && <div className="text-center">Loading staff...</div>}
        {error && <div className="text-red-600 p-4 bg-red-50 rounded-md">{error}</div>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setEditingStaff(member)} className="text-gray-600 hover:text-gray-900"><PencilIcon className="h-5 w-5" /></button>
                      <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Staff Modal (Add/Edit) */}
        {showModal && (
          <StaffModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false)
              setEditingStaff(null)
            }}
            onSave={loadStaff}
            staff={editingStaff}
          />
        )}
      </div>
    </AdminLayout>
  )
}

interface StaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  staff?: Staff | null
}

function StaffModal({ isOpen, onClose, onSave, staff }: StaffModalProps) {
  const [formData, setFormData] = useState<Staff>({
    id: staff?.id || '',
    firstName: staff?.firstName || '',
    lastName: staff?.lastName || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
    role: staff?.role || 'STYLIST',
    isActive: staff?.isActive ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (formData.id) {
        // Update existing staff
        // await staffAPI.update(formData.id, formData);
      } else {
        // Create new staff
        // await staffAPI.create(formData);
      }
      onSave()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save staff')
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
            <h3 className="text-lg font-medium mb-4">{staff ? 'Edit Staff' : 'Add Staff'}</h3>
            {error && <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</div>}
            <div className="space-y-4">
              <input type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="text" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full border p-2 rounded-md" />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required className="w-full border p-2 rounded-md" />
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded-md">
                <option value="STYLIST">Stylist</option>
                <option value="BARBER">Barber</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="MANAGER">Manager</option>
                <option value="OWNER">Owner</option>
              </select>
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