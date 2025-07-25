'use client'

import FormField from '../forms/FormField'
import Input from '../forms/Input'
import Select from '../forms/Select'

interface DateTimeSelectionProps {
  formData: {
    date: string
    time: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function DateTimeSelection({ formData, handleChange }: DateTimeSelectionProps) {
  const timeSlots = [
    { value: "9:00 AM", label: "9:00 AM" },
    { value: "9:30 AM", label: "9:30 AM" },
    { value: "10:00 AM", label: "10:00 AM" },
    { value: "10:30 AM", label: "10:30 AM" },
    { value: "11:00 AM", label: "11:00 AM" },
    { value: "11:30 AM", label: "11:30 AM" },
    { value: "1:00 PM", label: "1:00 PM" },
    { value: "1:30 PM", label: "1:30 PM" },
    { value: "2:00 PM", label: "2:00 PM" },
    { value: "2:30 PM", label: "2:30 PM" },
    { value: "3:00 PM", label: "3:00 PM" },
    { value: "3:30 PM", label: "3:30 PM" },
    { value: "4:00 PM", label: "4:00 PM" },
    { value: "4:30 PM", label: "4:30 PM" },
    { value: "5:00 PM", label: "5:00 PM" },
    { value: "5:30 PM", label: "5:30 PM" },
    { value: "6:00 PM", label: "6:00 PM" },
    { value: "6:30 PM", label: "6:30 PM" }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Preferred Date" required>
        <Input
          type="date"
          id="date"
          name="date"
          required
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </FormField>
      
      <FormField label="Preferred Time" required>
        <Select
          id="time"
          name="time"
          required
          value={formData.time}
          onChange={handleChange}
          options={timeSlots}
          placeholder="Select a time"
        />
      </FormField>
    </div>
  )
}
