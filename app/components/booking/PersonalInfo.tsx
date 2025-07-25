'use client'

import FormField from '../forms/FormField'
import Input from '../forms/Input'

interface PersonalInfoProps {
  formData: {
    name: string
    phone: string
    email: string
  }
  handleChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PersonalInfo({ formData, handleChangeAction }: PersonalInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Full Name" required>
        <Input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChangeAction}
        />
      </FormField>
      
      <FormField label="Phone Number" required>
        <Input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChangeAction}
        />
      </FormField>
      
      <div className="md:col-span-2">
        <FormField label="Email Address" required>
          <Input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChangeAction}
          />
        </FormField>
      </div>
    </div>
  )
}
