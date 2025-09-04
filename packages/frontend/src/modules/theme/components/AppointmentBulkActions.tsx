import React, { useState } from 'react'
import { Button, Modal, Heading, Select } from '@payloadcms/ui'

interface BulkActionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedAppointments: string[]
  onActionComplete: () => void
}

const AppointmentBulkActions: React.FC<BulkActionModalProps> = ({
  isOpen,
  onClose,
  selectedAppointments,
  onActionComplete
}) => {
  const [action, setAction] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [newStylist, setNewStylist] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async () => {
    if (!action || selectedAppointments.length === 0) return

    setIsLoading(true)
    try {
      const updates = selectedAppointments.map(appointmentId => {
        const updateData: any = {}

        switch (action) {
          case 'status':
            updateData.status = newStatus
            break
          case 'stylist':
            updateData.stylist = newStylist
            break
          case 'cancel':
            updateData.status = 'cancelled'
            break
          case 'confirm':
            updateData.status = 'confirmed'
            break
          case 'send-reminders':
            updateData.reminders = { emailReminder: true, smsReminder: true }
            break
        }

        return fetch(`/api/appointments/${appointmentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
      })

      await Promise.all(updates)
      onActionComplete()
      onClose()
      setAction('')
      setNewStatus('')
      setNewStylist('')
    } catch (error) {
      console.error('Bulk action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal className="w-full max-w-md">
      <div className="p-6">
        <Heading className="text-lg font-semibold text-gray-900 mb-4">
          Bulk Actions ({selectedAppointments.length} appointments)
        </Heading>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Action
            </label>
            <Select
              value={action}
              onChange={(value) => setAction(value)}
              options={[
                { label: 'Change Status', value: 'status' },
                { label: 'Reassign Stylist', value: 'stylist' },
                { label: 'Cancel All', value: 'cancel' },
                { label: 'Confirm All', value: 'confirm' },
                { label: 'Send Reminders', value: 'send-reminders' }
              ]}
            />
          </div>

          {action === 'status' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <Select
                value={newStatus}
                onChange={(value) => setNewStatus(value)}
                options={[
                  { label: 'Confirmed', value: 'confirmed' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'No Show', value: 'no-show' }
                ]}
              />
            </div>
          )}

          {action === 'stylist' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Stylist
              </label>
              <Select
                value={newStylist}
                onChange={(value) => setNewStylist(value)}
                options={[
                  { label: 'Emma Davis', value: 'emma-davis' },
                  { label: 'David Wilson', value: 'david-wilson' },
                  { label: 'Sarah Johnson', value: 'sarah-johnson' }
                ]}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            disabled={isLoading || !action}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Processing...' : 'Apply Action'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AppointmentBulkActions

// Export for use in collection configuration
export const getAppointmentBulkActions = () => [
  {
    label: 'Bulk Actions',
    Component: AppointmentBulkActions,
  }
]
