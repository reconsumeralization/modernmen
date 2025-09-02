// =============================================================================
// DAILY OPERATIONS DATA - Operational checklists and procedures
// =============================================================================

export interface ChecklistItem {
  id: string
  task: string
  category: 'opening' | 'midday' | 'closing' | 'maintenance'
  priority: 'high' | 'medium' | 'low'
  estimatedTime?: number // in minutes
  assignedTo?: string
  completed: boolean
  timestamp?: Date
}

export interface OperationalProcedure {
  id: string
  title: string
  category: string
  description: string
  steps: string[]
  requiredStaff: string[]
  estimatedDuration: number
  frequency: 'daily' | 'weekly' | 'monthly'
  criticalPath: boolean
}

// =============================================================================
// OPENING PROCEDURES CHECKLIST
// =============================================================================

export const openingChecklist: ChecklistItem[] = [
  // Pre-Opening (8:30 AM - 9:00 AM)
  {
    id: 'unlock-doors',
    task: 'Unlock main entrance and side doors',
    category: 'opening',
    priority: 'high',
    estimatedTime: 2,
    completed: false
  },
  {
    id: 'power-equipment',
    task: 'Turn on main power switches and equipment',
    category: 'opening',
    priority: 'high',
    estimatedTime: 5,
    completed: false
  },
  {
    id: 'thermostat',
    task: 'Set thermostat to 72°F (22°C)',
    category: 'opening',
    priority: 'medium',
    estimatedTime: 1,
    completed: false
  },
  {
    id: 'lights-signage',
    task: 'Turn on all lights and signage',
    category: 'opening',
    priority: 'high',
    estimatedTime: 3,
    completed: false
  },
  {
    id: 'coffee-area',
    task: 'Start coffee maker and prepare waiting area',
    category: 'opening',
    priority: 'medium',
    estimatedTime: 5,
    completed: false
  },
  {
    id: 'voicemail-email',
    task: 'Check voicemail and email for overnight messages',
    category: 'opening',
    priority: 'high',
    estimatedTime: 5,
    completed: false
  },
  {
    id: 'review-appointments',
    task: 'Review appointments for the day',
    category: 'opening',
    priority: 'high',
    estimatedTime: 10,
    completed: false
  },
  {
    id: 'prepare-workstations',
    task: 'Prepare workstations (chairs, tools, supplies)',
    category: 'opening',
    priority: 'high',
    estimatedTime: 15,
    completed: false
  },
  {
    id: 'sanitize-surfaces',
    task: 'Sanitize high-touch surfaces',
    category: 'opening',
    priority: 'high',
    estimatedTime: 10,
    completed: false
  },
  {
    id: 'emergency-check',
    task: 'Check emergency exits and equipment',
    category: 'opening',
    priority: 'high',
    estimatedTime: 3,
    completed: false
  },
  {
    id: 'cash-drawer',
    task: 'Count cash drawer and prepare float ($200)',
    category: 'opening',
    priority: 'high',
    estimatedTime: 5,
    completed: false
  },
  {
    id: 'pos-system',
    task: 'Turn on POS system and verify connectivity',
    category: 'opening',
    priority: 'high',
    estimatedTime: 3,
    completed: false
  }
]

// =============================================================================
// CLOSING PROCEDURES CHECKLIST
// =============================================================================

export const closingChecklist: ChecklistItem[] = [
  // Pre-Closing (6:00 PM - 6:30 PM)
  {
    id: 'closing-announcement',
    task: 'Remind customers of closing time (15 minutes prior)',
    category: 'closing',
    priority: 'high',
    estimatedTime: 1,
    completed: false
  },
  {
    id: 'final-appointments',
    task: 'Prepare final appointments and check waitlist',
    category: 'closing',
    priority: 'high',
    estimatedTime: 5,
    completed: false
  },
  {
    id: 'station-closure',
    task: 'Begin closing routine for completed stations',
    category: 'closing',
    priority: 'medium',
    estimatedTime: 10,
    completed: false
  },
  {
    id: 'pending-payments',
    task: 'Process any pending payments',
    category: 'closing',
    priority: 'high',
    estimatedTime: 5,
    completed: false
  },
  {
    id: 'end-of-day-reports',
    task: 'Prepare end-of-day reports',
    category: 'closing',
    priority: 'high',
    estimatedTime: 10,
    completed: false
  },
  {
    id: 'secure-valuables',
    task: 'Secure valuables and cash',
    category: 'closing',
    priority: 'high',
    estimatedTime: 2,
    completed: false
  },

  // Closing Sequence (6:30 PM - 7:00 PM)
  {
    id: 'final-checkout',
    task: 'Final customer checkout and goodbyes',
    category: 'closing',
    priority: 'high',
    estimatedTime: 5,
    completed: false
  },
  {
    id: 'deep-clean',
    task: 'Deep clean all workstations and common areas',
    category: 'closing',
    priority: 'high',
    estimatedTime: 15,
    completed: false
  },
  {
    id: 'sanitize-tools',
    task: 'Sanitize tools and equipment',
    category: 'closing',
    priority: 'high',
    estimatedTime: 10,
    completed: false
  },
  {
    id: 'restock-supplies',
    task: 'Restock supplies and organize inventory',
    category: 'closing',
    priority: 'medium',
    estimatedTime: 10,
    completed: false
  },
  {
    id: 'financial-reconciliation',
    task: 'Process daily financial reconciliation',
    category: 'closing',
    priority: 'high',
    estimatedTime: 10,
    completed: false
  },
  {
    id: 'lock-cash-drawer',
    task: 'Lock cash drawer and secure safe',
    category: 'closing',
    priority: 'high',
    estimatedTime: 2,
    completed: false
  },
  {
    id: 'shutdown-equipment',
    task: 'Turn off equipment (following safety protocols)',
    category: 'closing',
    priority: 'high',
    estimatedTime: 5,
    completed: false
  },
  {
    id: 'final-walkthrough',
    task: 'Final walkthrough - check all areas',
    category: 'closing',
    priority: 'high',
    estimatedTime: 3,
    completed: false
  },
  {
    id: 'alarm-system',
    task: 'Set alarm system and security lights',
    category: 'closing',
    priority: 'high',
    estimatedTime: 2,
    completed: false
  },
  {
    id: 'lock-doors',
    task: 'Lock all doors and windows',
    category: 'closing',
    priority: 'high',
    estimatedTime: 3,
    completed: false
  },
  {
    id: 'staff-departure',
    task: 'Staff departure log and time tracking',
    category: 'closing',
    priority: 'medium',
    estimatedTime: 2,
    completed: false
  }
]

// =============================================================================
// WEEKLY MAINTENANCE CHECKLIST
// =============================================================================

export const weeklyMaintenanceChecklist: ChecklistItem[] = [
  {
    id: 'schedule-review',
    task: 'Review and optimize staff schedule for upcoming week',
    category: 'maintenance',
    priority: 'high',
    estimatedTime: 30,
    completed: false
  },
  {
    id: 'inventory-count',
    task: 'Complete full inventory count and reconciliation',
    category: 'maintenance',
    priority: 'high',
    estimatedTime: 45,
    completed: false
  },
  {
    id: 'supplier-orders',
    task: 'Place orders with suppliers for restocking',
    category: 'maintenance',
    priority: 'high',
    estimatedTime: 20,
    completed: false
  },
  {
    id: 'equipment-deep-clean',
    task: 'Deep clean all equipment and machinery',
    category: 'maintenance',
    priority: 'high',
    estimatedTime: 60,
    completed: false
  },
  {
    id: 'financial-reports',
    task: 'Generate and review weekly financial reports',
    category: 'maintenance',
    priority: 'high',
    estimatedTime: 30,
    completed: false
  },
  {
    id: 'customer-feedback',
    task: 'Review customer feedback and implement improvements',
    category: 'maintenance',
    priority: 'medium',
    estimatedTime: 25,
    completed: false
  },
  {
    id: 'marketing-campaigns',
    task: 'Plan and schedule marketing campaigns for next week',
    category: 'maintenance',
    priority: 'medium',
    estimatedTime: 20,
    completed: false
  },
  {
    id: 'staff-training',
    task: 'Conduct weekly staff training session',
    category: 'maintenance',
    priority: 'medium',
    estimatedTime: 45,
    completed: false
  }
]

// =============================================================================
// MONTHLY PROCEDURES
// =============================================================================

export const monthlyProceduresChecklist: ChecklistItem[] = [
  {
    id: 'financial-analysis',
    task: 'Complete monthly financial analysis and budgeting',
    category: 'maintenance',
    priority: 'high',
    estimatedTime: 120,
    completed: false
  },
  {
    id: 'staff-performance-reviews',
    task: 'Conduct staff performance reviews',
    category: 'maintenance',
    priority: 'high',
    estimatedTime: 240,
    completed: false
  },
  {
    id: 'inventory-optimization',
    task: 'Analyze inventory turnover and optimize stock levels',
    category: 'maintenance',
    priority: 'medium',
    estimatedTime: 60,
    completed: false
  },
  {
    id: 'equipment-maintenance',
    task: 'Schedule professional equipment maintenance',
    category: 'maintenance',
    priority: 'high',
    estimatedTime: 30,
    completed: false
  },
  {
    id: 'marketing-effectiveness',
    task: 'Review marketing campaign effectiveness',
    category: 'maintenance',
    priority: 'medium',
    estimatedTime: 45,
    completed: false
  },
  {
    id: 'customer-retention-analysis',
    task: 'Analyze customer retention patterns and strategies',
    category: 'maintenance',
    priority: 'medium',
    estimatedTime: 60,
    completed: false
  }
]

// =============================================================================
// OPERATIONAL PROCEDURES
// =============================================================================

export const operationalProcedures: OperationalProcedure[] = [
  {
    id: 'customer-greeting',
    title: 'Customer Greeting Protocol',
    category: 'customer-service',
    description: 'Standardized customer greeting and initial interaction procedure',
    steps: [
      'Acknowledge customer within 30 seconds of entry',
      'Stand, make eye contact, and smile warmly',
      'Use customer\'s name if known ("Welcome back, Mr. Johnson!")',
      'Offer immediate assistance ("How can we help you today?")',
      'Escort to appropriate area or begin service consultation',
      'Note any special requests or preferences'
    ],
    requiredStaff: ['receptionist', 'barber', 'manager'],
    estimatedDuration: 2,
    frequency: 'daily',
    criticalPath: true
  },

  {
    id: 'appointment-checkin',
    title: 'Appointment Check-in Process',
    category: 'appointment-management',
    description: 'Standard procedure for customer appointment check-in',
    steps: [
      'Verify customer identity and appointment details',
      'Update appointment status to "ARRIVED" in system',
      'Confirm service preferences and any special requests',
      'Prepare workstation and required tools/supplies',
      'Offer refreshments and make customer comfortable',
      'Notify assigned staff member of customer arrival',
      'Begin service within 5 minutes of scheduled time'
    ],
    requiredStaff: ['receptionist', 'barber'],
    estimatedDuration: 3,
    frequency: 'daily',
    criticalPath: true
  },

  {
    id: 'service-delivery',
    title: 'Service Delivery Standards',
    category: 'service-quality',
    description: 'Quality standards and procedures for service delivery',
    steps: [
      'Conduct pre-service consultation and confirm preferences',
      'Prepare workstation and ensure all tools are sterilized',
      'Maintain clear communication throughout service',
      'Monitor time and maintain schedule efficiency',
      'Provide mirror checks and obtain customer feedback',
      'Complete service within estimated time ±5 minutes',
      'Present final result and obtain satisfaction confirmation',
      'Provide aftercare instructions and product recommendations',
      'Schedule next appointment and process payment'
    ],
    requiredStaff: ['barber', 'stylist'],
    estimatedDuration: 45,
    frequency: 'daily',
    criticalPath: true
  },

  {
    id: 'payment-processing',
    title: 'Payment Processing Procedure',
    category: 'financial',
    description: 'Standardized payment processing and reconciliation',
    steps: [
      'Calculate total including any applicable discounts',
      'Present itemized receipt for customer review',
      'Process payment using preferred method',
      'Provide receipt and thank customer',
      'Record transaction in POS system',
      'Reconcile cash drawer at end of shift',
      'File receipts and maintain audit trail',
      'Process refunds/credits according to policy'
    ],
    requiredStaff: ['receptionist', 'manager'],
    estimatedDuration: 5,
    frequency: 'daily',
    criticalPath: true
  },

  {
    id: 'emergency-response',
    title: 'Emergency Response Protocol',
    category: 'safety',
    description: 'Standardized response to medical or safety emergencies',
    steps: [
      'Assess situation and ensure immediate safety',
      'Call emergency services (911) if required',
      'Activate appropriate emergency response team',
      'Provide basic first aid if trained and safe',
      'Contact customer\'s emergency contact if applicable',
      'Document incident details and actions taken',
      'Follow up with affected parties',
      'Review incident and update procedures if needed'
    ],
    requiredStaff: ['all-staff'],
    estimatedDuration: 15,
    frequency: 'daily',
    criticalPath: true
  },

  {
    id: 'closing-routine',
    title: 'End-of-Day Closing Routine',
    category: 'operations',
    description: 'Comprehensive closing procedure for daily operations',
    steps: [
      'Announce closing 15 minutes prior to last customer',
      'Complete all scheduled services',
      'Process final payments and reconcile cash drawer',
      'Deep clean all workstations and common areas',
      'Sanitize all tools and equipment',
      'Restock supplies and organize inventory',
      'Generate end-of-day financial reports',
      'Secure cash, valuables, and confidential information',
      'Turn off equipment following safety protocols',
      'Conduct final walkthrough and security check',
      'Set alarm system and lock all doors',
      'Complete staff departure log'
    ],
    requiredStaff: ['manager', 'all-staff'],
    estimatedDuration: 45,
    frequency: 'daily',
    criticalPath: true
  }
]

// =============================================================================
// STAFF BREAK AND COVERAGE PROTOCOLS
// =============================================================================

export interface BreakSchedule {
  staffMember: string
  breakStart: string
  breakEnd: string
  coverageBy: string
  type: 'lunch' | 'short-break'
}

export const sampleBreakSchedule: BreakSchedule[] = [
  {
    staffMember: 'Mike Johnson',
    breakStart: '12:00',
    breakEnd: '12:30',
    coverageBy: 'Sarah Davis',
    type: 'lunch'
  },
  {
    staffMember: 'Sarah Davis',
    breakStart: '13:00',
    breakEnd: '13:30',
    coverageBy: 'Mike Johnson',
    type: 'lunch'
  },
  {
    staffMember: 'Alex Chen',
    breakStart: '11:30',
    breakEnd: '11:45',
    coverageBy: 'Mike Johnson',
    type: 'short-break'
  }
]

// =============================================================================
// QUALITY CONTROL CHECKPOINTS
// =============================================================================

export interface QualityCheckpoint {
  id: string
  checkpoint: string
  frequency: 'per-service' | 'hourly' | 'daily' | 'weekly'
  responsible: string
  criteria: string[]
}

export const qualityCheckpoints: QualityCheckpoint[] = [
  {
    id: 'workstation-cleanliness',
    checkpoint: 'Workstation cleanliness and organization',
    frequency: 'per-service',
    responsible: 'barber/stylist',
    criteria: [
      'All tools properly organized and accessible',
      'Work surface clean and free of debris',
      'Chair and equipment properly sanitized',
      'Waste properly disposed of',
      'Supplies adequately stocked'
    ]
  },
  {
    id: 'customer-consultation',
    checkpoint: 'Pre-service customer consultation',
    frequency: 'per-service',
    responsible: 'barber/stylist',
    criteria: [
      'Customer preferences clearly understood',
      'Service expectations clearly communicated',
      'Allergies and sensitivities noted',
      'Special requests documented',
      'Service time and pricing confirmed'
    ]
  },
  {
    id: 'service-quality',
    checkpoint: 'Service quality and technique',
    frequency: 'per-service',
    responsible: 'barber/stylist',
    criteria: [
      'Proper tool sterilization maintained',
      'Consistent technique and attention to detail',
      'Regular progress checks with customer',
      'Professional demeanor maintained',
      'Service completed within estimated time'
    ]
  },
  {
    id: 'customer-satisfaction',
    checkpoint: 'Customer satisfaction verification',
    frequency: 'per-service',
    responsible: 'barber/stylist',
    criteria: [
      'Mirror presentation provided',
      'Customer feedback actively sought',
      'Satisfaction clearly expressed',
      'Follow-up appointment scheduled',
      'Positive review encouraged'
    ]
  }
]

// =============================================================================
// PERFORMANCE METRICS DASHBOARD
// =============================================================================

export interface PerformanceMetric {
  id: string
  metric: string
  target: number
  current: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  category: 'operational' | 'financial' | 'customer' | 'staff'
}

export const performanceMetrics: PerformanceMetric[] = [
  {
    id: 'customer-satisfaction',
    metric: 'Average Customer Satisfaction',
    target: 4.5,
    current: 4.2,
    unit: '/5',
    trend: 'up',
    category: 'customer'
  },
  {
    id: 'appointment-show-rate',
    metric: 'Appointment Show-up Rate',
    target: 85,
    current: 82,
    unit: '%',
    trend: 'stable',
    category: 'operational'
  },
  {
    id: 'service-efficiency',
    metric: 'On-time Service Completion',
    target: 90,
    current: 88,
    unit: '%',
    trend: 'up',
    category: 'operational'
  },
  {
    id: 'revenue-per-hour',
    metric: 'Average Revenue per Hour',
    target: 150,
    current: 145,
    unit: '$',
    trend: 'up',
    category: 'financial'
  },
  {
    id: 'customer-retention',
    metric: 'Customer Retention Rate',
    target: 75,
    current: 72,
    unit: '%',
    trend: 'up',
    category: 'customer'
  }
]

// =============================================================================
// EXPORT ALL OPERATIONAL DATA
// =============================================================================

export const operationalData = {
  openingChecklist,
  closingChecklist,
  weeklyMaintenanceChecklist,
  monthlyProceduresChecklist,
  operationalProcedures,
  qualityCheckpoints,
  performanceMetrics,
  sampleBreakSchedule
}
