// =============================================================================
// EMERGENCY PROCEDURES - Comprehensive emergency response system
// =============================================================================

export interface EmergencyProcedure {
  id: string
  type: 'medical' | 'fire' | 'security' | 'natural-disaster' | 'equipment' | 'customer-incident'
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  immediateActions: string[]
  escalationProtocol: string[]
  requiredContacts: Contact[]
  documentation: string[]
  recoverySteps: string[]
  preventionMeasures: string[]
}

export interface Contact {
  name: string
  role: string
  primaryPhone: string
  secondaryPhone?: string
  email?: string
  availability: string
}

export interface EmergencySupply {
  category: string
  item: string
  quantity: number
  location: string
  expirationDate?: string
  responsible: string
}

// =============================================================================
// EMERGENCY CONTACT LIST
// =============================================================================

export const emergencyContacts: Contact[] = [
  {
    name: 'Emergency Services',
    role: '911 Dispatcher',
    primaryPhone: '911',
    availability: '24/7'
  },
  {
    name: 'Fire Department',
    role: 'Non-Emergency Line',
    primaryPhone: '555-FIRE',
    availability: '24/7'
  },
  {
    name: 'Police Department',
    role: 'Non-Emergency Line',
    primaryPhone: '555-POLICE',
    availability: '24/7'
  },
  {
    name: 'Manager - Sarah Johnson',
    role: 'Salon Manager',
    primaryPhone: '555-0123',
    secondaryPhone: '555-0124',
    email: 'sarah@modernmen.com',
    availability: 'Business Hours + On-Call'
  },
  {
    name: 'Owner - David Wilson',
    role: 'Business Owner',
    primaryPhone: '555-0456',
    secondaryPhone: '555-0457',
    email: 'david@modernmen.com',
    availability: 'Business Hours + Emergency'
  },
  {
    name: 'Medical Professional - Dr. Lisa Chen',
    role: 'On-Call Physician',
    primaryPhone: '555-0789',
    email: 'dr.chen@medical.com',
    availability: 'Emergency Only'
  },
  {
    name: 'Equipment Technician - Mike\'s Barber Supply',
    role: 'Equipment Maintenance',
    primaryPhone: '555-0321',
    email: 'service@mikesbarbersupply.com',
    availability: 'Business Hours'
  },
  {
    name: 'Insurance Agent - Secure Business Insurance',
    role: 'Claims Processing',
    primaryPhone: '555-0654',
    email: 'claims@secureinsurance.com',
    availability: 'Business Hours'
  }
]

// =============================================================================
// COMPREHENSIVE EMERGENCY PROCEDURES
// =============================================================================

export const emergencyProcedures: EmergencyProcedure[] = [
  {
    id: 'medical-emergency',
    type: 'medical',
    title: 'Medical Emergency Response',
    severity: 'critical',
    immediateActions: [
      'Assess the situation and ensure scene safety',
      'Call 911 immediately and provide location details',
      'Do not move injured person unless absolutely necessary',
      'Provide basic first aid if trained and safe to do so',
      'Clear area around injured person for emergency responders',
      'Notify manager and emergency contact person',
      'Comfort and reassure the injured person',
      'Do not give food, drink, or medication to unconscious person'
    ],
    escalationProtocol: [
      'Manager arrives and takes command of situation',
      'Document all actions taken and witness statements',
      'Contact insurance provider if applicable',
      'Prepare incident report within 24 hours',
      'Follow up with affected customer/staff member',
      'Review procedure effectiveness and update if needed'
    ],
    requiredContacts: [
      emergencyContacts[0], // 911
      emergencyContacts[3], // Manager
      emergencyContacts[5]  // Physician
    ],
    documentation: [
      'Time and date of incident',
      'Description of what happened',
      'Actions taken by staff',
      'Witness statements',
      'Emergency services response details',
      'Medical treatment provided',
      'Follow-up care arrangements'
    ],
    recoverySteps: [
      'Clean and sanitize affected area thoroughly',
      'Replace any used first aid supplies',
      'Conduct staff debriefing session',
      'Offer counseling services if needed',
      'Resume normal operations once area is secure',
      'Monitor staff well-being for several days'
    ],
    preventionMeasures: [
      'Annual first aid and CPR training for all staff',
      'Monthly emergency equipment checks',
      'Clear labeling of first aid supplies',
      'Regular safety drills and procedure reviews',
      'Customer allergy and medical condition documentation',
      'Proper lifting and ergonomics training'
    ]
  },

  {
    id: 'fire-emergency',
    type: 'fire',
    title: 'Fire Emergency Response',
    severity: 'critical',
    immediateActions: [
      'Activate fire alarm system immediately',
      'Call 911 and report fire location and details',
      'Evacuate all customers and staff using nearest exit',
      'Do not use elevators during evacuation',
      'Assist disabled or injured persons to safety',
      'Close all doors behind you to contain fire',
      'Proceed to designated assembly point (parking lot)',
      'Do not re-enter building until cleared by firefighters'
    ],
    escalationProtocol: [
      'Account for all staff and customers at assembly point',
      'Provide headcount to emergency services',
      'Manager coordinates with firefighters and police',
      'Contact insurance provider for potential claims',
      'Arrange temporary relocation if building is damaged',
      'Notify all staff of status and next steps',
      'Schedule business continuity assessment'
    ],
    requiredContacts: [
      emergencyContacts[0], // 911
      emergencyContacts[1], // Fire Department
      emergencyContacts[3], // Manager
      emergencyContacts[7]  // Insurance
    ],
    documentation: [
      'Time alarm was activated and 911 was called',
      'Evacuation time and headcount details',
      'Fire department response and actions',
      'Building damage assessment',
      'Equipment and inventory affected',
      'Insurance claim documentation',
      'Business interruption timeline'
    ],
    recoverySteps: [
      'Wait for fire department clearance to re-enter',
      'Assess structural damage with professionals',
      'Document all damage with photos and videos',
      'Contact restoration specialists if needed',
      'Implement temporary operating procedures',
      'Communicate reopening plans to customers',
      'Resume operations with safety protocols'
    ],
    preventionMeasures: [
      'Monthly fire alarm and extinguisher inspections',
      'Annual fire safety training for all staff',
      'Regular cleaning of exhaust systems and vents',
      'Proper storage of flammable materials',
      'Electrical system maintenance and upgrades',
      'Clear exit signage and emergency lighting tests',
      'No smoking policy enforcement'
    ]
  },

  {
    id: 'security-incident',
    type: 'security',
    title: 'Security Incident Response',
    severity: 'high',
    immediateActions: [
      'Ensure personal safety and customer protection',
      'Call 911 if threat involves violence or weapons',
      'Secure customers and staff in safe area if needed',
      'Do not confront suspicious persons',
      'Observe and document suspect descriptions',
      'Lock all external doors if safe to do so',
      'Monitor situation from secure location',
      'Prepare to evacuate if situation escalates'
    ],
    escalationProtocol: [
      'Manager assesses situation and coordinates response',
      'Contact police for suspicious activity reports',
      'Document incident details and witness statements',
      'Review security camera footage',
      'Implement enhanced security measures temporarily',
      'Notify staff of incident and safety protocols',
      'Consider involving security professional consultation'
    ],
    requiredContacts: [
      emergencyContacts[0], // 911
      emergencyContacts[2], // Police
      emergencyContacts[3]  // Manager
    ],
    documentation: [
      'Time and location of incident',
      'Detailed description of suspicious activity',
      'Physical descriptions of persons involved',
      'Actions taken by staff members',
      'Witness statements and observations',
      'Security camera footage references',
      'Police report number and officer details'
    ],
    recoverySteps: [
      'Conduct staff debriefing and support sessions',
      'Review and update security procedures',
      'Install additional security measures if needed',
      'Communicate incident to customers if appropriate',
      'Monitor for similar incidents in following days',
      'Resume normal operations with enhanced vigilance'
    ],
    preventionMeasures: [
      'Install and maintain security camera system',
      'Implement access control procedures',
      'Staff training on suspicious activity recognition',
      'Regular security assessments and audits',
      'Well-lit exterior and parking areas',
      'Emergency contact information readily available',
      'Cash handling procedures to minimize risk'
    ]
  },

  {
    id: 'natural-disaster',
    type: 'natural-disaster',
    title: 'Natural Disaster Response',
    severity: 'high',
    immediateActions: [
      'Monitor local weather and emergency alerts',
      'Prepare customers and staff for potential evacuation',
      'Secure loose equipment and supplies',
      'Move valuable items to safe locations',
      'Close exterior shutters if available',
      'Prepare emergency supply kits',
      'Establish communication protocols',
      'Monitor situation and await further instructions'
    ],
    escalationProtocol: [
      'Manager makes decision to close based on conditions',
      'Contact all staff regarding closure decisions',
      'Notify customers of schedule changes',
      'Secure building and equipment properly',
      'Establish communication chain for updates',
      'Monitor local news and emergency broadcasts',
      'Plan for business resumption timeline'
    ],
    requiredContacts: [
      emergencyContacts[3], // Manager
      emergencyContacts[4], // Owner
      emergencyContacts[0]  // 911 (if evacuation required)
    ],
    documentation: [
      'Weather conditions and forecast details',
      'Decision-making timeline for closure',
      'Staff and customer notification records',
      'Building security measures taken',
      'Equipment protection procedures followed',
      'Communication logs and updates provided',
      'Business resumption planning documentation'
    ],
    recoverySteps: [
      'Assess building and equipment damage',
      'Contact insurance for damage claims',
      'Coordinate cleanup and repairs',
      'Communicate reopening plans to customers',
      'Implement temporary operating procedures',
      'Conduct staff safety briefing',
      'Resume operations gradually with safety checks'
    ],
    preventionMeasures: [
      'Weather alert system monitoring',
      'Emergency supply kit maintenance',
      'Building reinforcement and protection measures',
      'Staff emergency contact information updates',
      'Business continuity planning',
      'Regular disaster preparedness drills',
      'Backup power and communication systems'
    ]
  },

  {
    id: 'equipment-failure',
    type: 'equipment',
    title: 'Equipment Failure Response',
    severity: 'medium',
    immediateActions: [
      'Stop using faulty equipment immediately',
      'Ensure customer and staff safety around equipment',
      'Switch to backup equipment if available',
      'Inform customers of delay and offer alternatives',
      'Document equipment failure details',
      'Contact equipment technician or manufacturer',
      'Implement temporary workaround procedures'
    ],
    escalationProtocol: [
      'Manager evaluates impact on operations',
      'Contact equipment service provider',
      'Arrange for repair or replacement',
      'Communicate delays to affected customers',
      'Implement backup operating procedures',
      'Track repair progress and timeline',
      'Review maintenance procedures'
    ],
    requiredContacts: [
      emergencyContacts[6], // Equipment Technician
      emergencyContacts[3]  // Manager
    ],
    documentation: [
      'Equipment details and failure symptoms',
      'Time of failure and discovery',
      'Impact on operations and customer service',
      'Actions taken to minimize disruption',
      'Service technician contact and response',
      'Repair timeline and costs',
      'Updated maintenance schedule'
    ],
    recoverySteps: [
      'Complete equipment repair or replacement',
      'Test equipment functionality thoroughly',
      'Update maintenance and inspection schedules',
      'Communicate service resumption to customers',
      'Review incident to prevent future occurrences',
      'Document lessons learned and procedure updates'
    ],
    preventionMeasures: [
      'Regular equipment maintenance schedule',
      'Staff training on equipment operation',
      'Backup equipment availability and maintenance',
      'Regular inspection and testing procedures',
      'Vendor maintenance contracts',
      'Equipment usage logging and monitoring',
      'Spare parts inventory management'
    ]
  },

  {
    id: 'customer-incident',
    type: 'customer-incident',
    title: 'Customer Service Incident Response',
    severity: 'medium',
    immediateActions: [
      'Listen to customer complaint without interruption',
      'Acknowledge their feelings and apologize for inconvenience',
      'Move discussion to private area if needed',
      'Gather all relevant details of the incident',
      'Offer immediate resolution or compensation',
      'Escalate to manager if issue cannot be resolved immediately',
      'Document complaint details and resolution offered'
    ],
    escalationProtocol: [
      'Manager reviews incident and customer history',
      'Determine appropriate compensation or resolution',
      'Implement resolution and follow up with customer',
      'Review incident for process improvement opportunities',
      'Document final resolution and customer satisfaction',
      'Update staff on incident and resolution',
      'Monitor for similar incidents and prevention measures'
    ],
    requiredContacts: [
      emergencyContacts[3], // Manager
      emergencyContacts[4]  // Owner (for major incidents)
    ],
    documentation: [
      'Customer name and contact information',
      'Detailed description of incident',
      'Customer expectations and demands',
      'Resolution offered and agreed upon',
      'Follow-up actions and timeline',
      'Customer satisfaction with resolution',
      'Process improvement recommendations'
    ],
    recoverySteps: [
      'Implement agreed-upon resolution immediately',
      'Follow up with customer within 24 hours',
      'Monitor customer satisfaction and loyalty',
      'Review incident with staff for learning opportunities',
      'Update procedures to prevent similar incidents',
      'Track incident patterns for systemic improvements'
    ],
    preventionMeasures: [
      'Staff training on customer service excellence',
      'Regular customer feedback collection and analysis',
      'Service quality monitoring and checklists',
      'Staff empowerment for immediate issue resolution',
      'Customer expectation management',
      'Regular service quality audits',
      'Complaint resolution procedure reviews'
    ]
  }
]

// =============================================================================
// EMERGENCY SUPPLY INVENTORY
// =============================================================================

export const emergencySupplies: EmergencySupply[] = [
  // First Aid Supplies
  {
    category: 'First Aid',
    item: 'First Aid Kit',
    quantity: 2,
    location: 'Reception Desk, Back Office',
    responsible: 'Manager'
  },
  {
    category: 'First Aid',
    item: 'Bandages (various sizes)',
    quantity: 50,
    location: 'First Aid Kit',
    responsible: 'Manager'
  },
  {
    category: 'First Aid',
    item: 'Antiseptic Wipes',
    quantity: 30,
    location: 'First Aid Kit',
    expirationDate: '2025-06-01',
    responsible: 'Manager'
  },
  {
    category: 'First Aid',
    item: 'Burn Cream',
    quantity: 5,
    location: 'First Aid Kit',
    expirationDate: '2024-12-01',
    responsible: 'Manager'
  },

  // Fire Safety Equipment
  {
    category: 'Fire Safety',
    item: 'Fire Extinguishers',
    quantity: 4,
    location: 'Main Area, Back Room, Restroom, Storage',
    responsible: 'Manager'
  },
  {
    category: 'Fire Safety',
    item: 'Fire Blanket',
    quantity: 2,
    location: 'Kitchen Area, Main Workstation',
    responsible: 'Manager'
  },
  {
    category: 'Fire Safety',
    item: 'Smoke Detectors',
    quantity: 6,
    location: 'Ceiling throughout building',
    responsible: 'Manager'
  },

  // Emergency Communication
  {
    category: 'Communication',
    item: 'Emergency Contact List',
    quantity: 5,
    location: 'Reception, Manager Office, All Stations',
    responsible: 'Manager'
  },
  {
    category: 'Communication',
    item: 'Flashlights',
    quantity: 4,
    location: 'Emergency Kit, Manager Office',
    responsible: 'Manager'
  },
  {
    category: 'Communication',
    item: 'Whistle',
    quantity: 3,
    location: 'Emergency Kit',
    responsible: 'Manager'
  },

  // Emergency Power and Light
  {
    category: 'Power & Light',
    item: 'Backup Battery Pack',
    quantity: 2,
    location: 'Manager Office, Emergency Kit',
    responsible: 'Manager'
  },
  {
    category: 'Power & Light',
    item: 'Emergency Candles',
    quantity: 10,
    location: 'Emergency Kit',
    responsible: 'Manager'
  },

  // Personal Protection
  {
    category: 'PPE',
    item: 'N95 Masks',
    quantity: 20,
    location: 'First Aid Kit',
    responsible: 'Manager'
  },
  {
    category: 'PPE',
    item: 'Nitrile Gloves',
    quantity: 50,
    location: 'First Aid Kit',
    responsible: 'Manager'
  },

  // Documentation and Forms
  {
    category: 'Documentation',
    item: 'Incident Report Forms',
    quantity: 10,
    location: 'Manager Office, Emergency Kit',
    responsible: 'Manager'
  },
  {
    category: 'Documentation',
    item: 'Emergency Procedure Manual',
    quantity: 3,
    location: 'Manager Office, Reception, Break Room',
    responsible: 'Manager'
  }
]

// =============================================================================
// EMERGENCY DRILL SCHEDULE
// =============================================================================

export interface EmergencyDrill {
  id: string
  type: 'fire' | 'medical' | 'evacuation' | 'security' | 'equipment'
  frequency: 'monthly' | 'quarterly' | 'annually'
  duration: number // in minutes
  participants: string[]
  lastConducted?: Date
  nextScheduled: Date
  objectives: string[]
}

export const emergencyDrills: EmergencyDrill[] = [
  {
    id: 'monthly-fire-drill',
    type: 'fire',
    frequency: 'monthly',
    duration: 15,
    participants: ['all-staff'],
    nextScheduled: new Date('2024-02-01'),
    objectives: [
      'Practice evacuation procedures',
      'Test fire alarm system',
      'Verify emergency exit accessibility',
      'Account for all personnel',
      'Review fire safety procedures'
    ]
  },
  {
    id: 'quarterly-medical-drill',
    type: 'medical',
    frequency: 'quarterly',
    duration: 30,
    participants: ['all-staff'],
    nextScheduled: new Date('2024-04-01'),
    objectives: [
      'Practice first aid response',
      'Test emergency communication',
      'Review medical emergency procedures',
      'Verify first aid equipment access',
      'Practice coordination with emergency services'
    ]
  },
  {
    id: 'annual-evacuation-drill',
    type: 'evacuation',
    frequency: 'annually',
    duration: 20,
    participants: ['all-staff', 'management'],
    nextScheduled: new Date('2024-06-01'),
    objectives: [
      'Full building evacuation simulation',
      'Test assembly point procedures',
      'Practice headcount and accountability',
      'Review evacuation routes and procedures',
      'Coordinate with local emergency services'
    ]
  },
  {
    id: 'quarterly-security-drill',
    type: 'security',
    frequency: 'quarterly',
    duration: 25,
    participants: ['all-staff', 'management'],
    nextScheduled: new Date('2024-03-01'),
    objectives: [
      'Practice security incident response',
      'Test security system and cameras',
      'Review suspicious activity procedures',
      'Practice lockdown procedures',
      'Coordinate with local law enforcement'
    ]
  }
]

// =============================================================================
// EMERGENCY COMMUNICATION TEMPLATES
// =============================================================================

export const emergencyCommunicationTemplates = {
  fireEmergency: {
    subject: 'URGENT: Fire Emergency at Modern Men Hair Salon',
    message: `Dear Valued Customer,

We regret to inform you that due to a fire emergency at our location, we are currently closed. Our primary concern is the safety of our customers and staff.

Emergency services are on site and we are cooperating fully with firefighters. We will provide updates as soon as we have more information about when we can reopen.

For urgent inquiries, please contact our emergency line at [emergency-phone].

We apologize for any inconvenience this may cause and appreciate your understanding during this difficult time.

Best regards,
Modern Men Hair Salon Management Team`
  },

  medicalEmergency: {
    subject: 'Update: Medical Emergency at Modern Men Hair Salon',
    message: `Dear Valued Customer,

We experienced a medical emergency at our salon today. Our team responded immediately and emergency services were called.

The affected individual is receiving appropriate medical care. Out of respect for privacy, we cannot provide additional details at this time.

Our operations are continuing normally, and all appointments for today are being accommodated. If you have an appointment today and have not been contacted, please proceed as scheduled.

We appreciate your understanding and continued support.

Best regards,
Modern Men Hair Salon Management Team`
  },

  temporaryClosure: {
    subject: 'Temporary Closure Notice - Modern Men Hair Salon',
    message: `Dear Valued Customer,

Due to [reason: weather emergency/equipment failure/etc.], Modern Men Hair Salon will be temporarily closed [timeframe].

We apologize for any inconvenience this may cause. All appointments during the closure period will be automatically rescheduled, and you will receive a confirmation text/email with your new appointment time.

For urgent matters, please contact us at [contact-phone].

We look forward to serving you soon.

Best regards,
Modern Men Hair Salon Management Team`
  },

  reopeningNotice: {
    subject: 'We\'re Back! Modern Men Hair Salon Reopening',
    message: `Dear Valued Customer,

We're pleased to announce that Modern Men Hair Salon has reopened following [reason for closure].

All systems are operational and we're ready to provide you with our usual exceptional service. If your appointment was affected by the closure, you should have received a rescheduling notice.

We appreciate your patience and continued support during this time.

See you soon!
Modern Men Hair Salon Team`
  }
}

// =============================================================================
// EXPORT ALL EMERGENCY DATA
// =============================================================================

export const emergencyData = {
  emergencyContacts,
  emergencyProcedures,
  emergencySupplies,
  emergencyDrills,
  emergencyCommunicationTemplates
}
