/**
 * Icon Usage Examples
 * This file demonstrates how to use the unified icon system
 */

import React from 'react'
import { MapPin, Search, Settings, User, Bell, getIcon, iconMapping } from './icons-index'

// Example 1: Direct icon import (recommended for most use cases)
export const DirectIconUsage = () => (
  <div>
    <MapPin size={24} />
    <Search size={20} />
    <Settings size={16} />
  </div>
)

// Example 2: Using getIcon function (useful for dynamic icon selection)
export const DynamicIconUsage = ({ iconName }: { iconName: string }) => {
  const IconComponent = getIcon(iconName)
  return <IconComponent size={24} />
}

// Example 3: Using iconMapping object (alternative dynamic approach)
export const MappingIconUsage = ({ iconName }: { iconName: string }) => {
  const IconComponent = iconMapping[iconName] || MapPin // fallback to MapPin
  return <IconComponent size={24} />
}

// Example 4: Icon with props
export const StyledIconUsage = () => (
  <div>
    <MapPin
      size={32}
      color="#ff6b6b"
      strokeWidth={2}
      className="hover:scale-110 transition-transform"
    />
  </div>
)

// Example 5: Common hair salon icons
export const SalonIcons = () => (
  <div className="flex gap-4">
    <ScissorsIcon size={24} />
    <BrushIcon size={24} />
    <AwardIcon size={24} />
    <ZapIcon size={24} />
    <StarIcon size={24} />
    <CalendarIcon size={24} />
    <PhoneIcon size={24} />
    <MapPinIcon size={24} />
    <ClockIcon size={24} />
    <UserIcon size={24} />
    <MailIcon size={24} />
  </div>
)

// Helper function to get salon-specific icons
export const getSalonIcon = (iconName: string) => {
  const salonIcons = {
    scissors: ScissorsIcon,
    brush: BrushIcon,
    award: AwardIcon,
    zap: ZapIcon,
    star: StarIcon,
    calendar: CalendarIcon,
    phone: PhoneIcon,
    mapPin: MapPinIcon,
    location: MapPinIcon, // alias
    clock: ClockIcon,
    user: UserIcon,
    mail: MailIcon,
    email: MailIcon // alias
  }

  return salonIcons[iconName] || getIcon(iconName)
}

// Import additional icons needed for examples
import {
  Scissors, Brush, Award, Zap, Star, Calendar, Phone, Clock, Mail
} from './icons'

const ScissorsIcon = Scissors
const BrushIcon = Brush
const AwardIcon = Award
const ZapIcon = Zap
const StarIcon = Star
const CalendarIcon = Calendar
const PhoneIcon = Phone
const MapPinIcon = MapPin
const ClockIcon = Clock
const UserIcon = User
const MailIcon = Mail
