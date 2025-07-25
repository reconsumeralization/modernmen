'use client'

import FormField from '../forms/FormField'
import Select from '../forms/Select'

interface ServiceSelectionProps {
  formData: {
    service: string
    staff: string
  }
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function ServiceSelection({ formData, handleChange }: ServiceSelectionProps) {
  const services = [
    { value: "Men's Haircut", label: "Men's Haircut" },
    { value: "Beard Grooming", label: "Beard Grooming" },
    { value: "Hair Styling", label: "Hair Styling" },
    { value: "Fade Cut", label: "Fade Cut" },
    { value: "Hair Tattoo/Undercut Design", label: "Hair Tattoo/Undercut Design" },
    { value: "Color Service", label: "Color Service" },
    { value: "Consultation", label: "Consultation" }
  ]

  const staffMembers = [
    { value: "No Preference", label: "No Preference" },
    { value: "Tammy", label: "Tammy" },
    { value: "Hicham Mellouli", label: "Hicham Mellouli" },
    { value: "Jasmine", label: "Jasmine" },
    { value: "Henok", label: "Henok" },
    { value: "Sveta Orlenko", label: "Sveta Orlenko" }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Service" required>
        <Select
          id="service"
          name="service"
          required
          value={formData.service}
          onChange={handleChange}
          options={services}
          placeholder="Select a service"
        />
      </FormField>
      
      <FormField label="Preferred Stylist">
        <Select
          id="staff"
          name="staff"
          value={formData.staff}
          onChange={handleChange}
          options={staffMembers}
          placeholder="Select a stylist"
        />
      </FormField>
    </div>
  )
}
