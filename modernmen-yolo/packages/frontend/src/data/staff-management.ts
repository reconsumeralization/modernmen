// =============================================================================
// STAFF MANAGEMENT SYSTEM - Comprehensive HR and scheduling procedures
// =============================================================================

export interface StaffSchedule {
  id: string
  staffId: string
  staffName: string
  date: string
  startTime: string
  endTime: string
  role: string
  workstation?: string
  breaks: BreakPeriod[]
  notes?: string
}

export interface BreakPeriod {
  startTime: string
  endTime: string
  type: 'lunch' | 'short-break'
  coverageBy?: string
}

export interface StaffPerformance {
  id: string
  staffId: string
  period: string // 'weekly' | 'monthly' | 'quarterly'
  metrics: {
    customerSatisfaction: number
    servicesCompleted: number
    revenueGenerated: number
    punctuality: number
    attendance: number
    teamwork: number
  }
  achievements: string[]
  areasForImprovement: string[]
  goals: string[]
}

export interface StaffTraining {
  id: string
  staffId: string
  trainingType: string
  completionDate: string
  expiryDate?: string
  certification: boolean
  score?: number
  instructor: string
  notes: string
}

export interface SchedulingRules {
  id: string
  rule: string
  priority: 'high' | 'medium' | 'low'
  appliesTo: string[]
  enforcement: 'automatic' | 'manual' | 'warning'
  description: string
}

// =============================================================================
// STAFF SCHEDULING SYSTEM
// =============================================================================

export const schedulingRules: SchedulingRules[] = [
  {
    id: 'peak-hours-coverage',
    rule: 'Minimum 2 staff during peak hours (9AM-12PM, 4PM-7PM)',
    priority: 'high',
    appliesTo: ['all-staff'],
    enforcement: 'automatic',
    description: 'Ensures adequate coverage during busiest periods'
  },
  {
    id: 'reception-always-staffed',
    rule: 'Reception must be staffed at all business hours',
    priority: 'high',
    appliesTo: ['reception-staff'],
    enforcement: 'automatic',
    description: 'Customer service availability requirement'
  },
  {
    id: 'break-overlap-prevention',
    rule: 'No more than 1 staff on break at any time',
    priority: 'high',
    appliesTo: ['all-staff'],
    enforcement: 'automatic',
    description: 'Maintains service continuity during breaks'
  },
  {
    id: 'skill-matching',
    rule: 'Staff assigned to services matching their skill level',
    priority: 'medium',
    appliesTo: ['service-staff'],
    enforcement: 'manual',
    description: 'Quality assurance through appropriate skill assignment'
  },
  {
    id: 'fair-distribution',
    rule: 'Equal distribution of peak hours and weekends',
    priority: 'medium',
    appliesTo: ['all-staff'],
    enforcement: 'warning',
    description: 'Promotes work-life balance and fairness'
  },
  {
    id: 'advance-notice',
    rule: 'Schedule changes require 48-hour notice',
    priority: 'medium',
    appliesTo: ['all-staff'],
    enforcement: 'warning',
    description: 'Provides planning stability for staff'
  },
  {
    id: 'emergency-coverage',
    rule: 'Emergency backup staff identified for each shift',
    priority: 'high',
    appliesTo: ['management'],
    enforcement: 'manual',
    description: 'Ensures coverage for unexpected absences'
  }
]

// =============================================================================
// WEEKLY STAFF SCHEDULE TEMPLATE
// =============================================================================

export const weeklyScheduleTemplate: StaffSchedule[] = [
  // Monday
  {
    id: 'mon-sarah-reception',
    staffId: 'sarah-johnson',
    staffName: 'Sarah Johnson',
    date: '2024-01-08',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Reception Manager',
    workstation: 'Reception',
    breaks: [
      { startTime: '12:00', endTime: '13:00', type: 'lunch' },
      { startTime: '15:00', endTime: '15:15', type: 'short-break' }
    ]
  },
  {
    id: 'mon-mike-barber',
    staffId: 'mike-chen',
    staffName: 'Mike Chen',
    date: '2024-01-08',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Senior Barber',
    workstation: 'Station 1',
    breaks: [
      { startTime: '12:30', endTime: '13:30', type: 'lunch', coverageBy: 'Sarah Johnson' },
      { startTime: '15:30', endTime: '15:45', type: 'short-break' }
    ]
  },
  {
    id: 'mon-david-barber',
    staffId: 'david-ross',
    staffName: 'David Ross',
    date: '2024-01-08',
    startTime: '10:00',
    endTime: '18:00',
    role: 'Barber',
    workstation: 'Station 2',
    breaks: [
      { startTime: '13:00', endTime: '14:00', type: 'lunch', coverageBy: 'Mike Chen' },
      { startTime: '16:00', endTime: '16:15', type: 'short-break' }
    ]
  },

  // Tuesday
  {
    id: 'tue-sarah-reception',
    staffId: 'sarah-johnson',
    staffName: 'Sarah Johnson',
    date: '2024-01-09',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Reception Manager',
    workstation: 'Reception',
    breaks: [
      { startTime: '12:00', endTime: '13:00', type: 'lunch' },
      { startTime: '15:00', endTime: '15:15', type: 'short-break' }
    ]
  },
  {
    id: 'tue-lisa-stylist',
    staffId: 'lisa-brown',
    staffName: 'Lisa Brown',
    date: '2024-01-09',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Senior Stylist',
    workstation: 'Station 3',
    breaks: [
      { startTime: '12:30', endTime: '13:30', type: 'lunch', coverageBy: 'Sarah Johnson' },
      { startTime: '15:30', endTime: '15:45', type: 'short-break' }
    ]
  },
  {
    id: 'tue-mike-barber',
    staffId: 'mike-chen',
    staffName: 'Mike Chen',
    date: '2024-01-09',
    startTime: '10:00',
    endTime: '18:00',
    role: 'Senior Barber',
    workstation: 'Station 1',
    breaks: [
      { startTime: '13:00', endTime: '14:00', type: 'lunch', coverageBy: 'Lisa Brown' },
      { startTime: '16:00', endTime: '16:15', type: 'short-break' }
    ]
  },

  // Wednesday
  {
    id: 'wed-david-reception',
    staffId: 'david-ross',
    staffName: 'David Ross',
    date: '2024-01-10',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Reception',
    workstation: 'Reception',
    breaks: [
      { startTime: '12:00', endTime: '13:00', type: 'lunch' },
      { startTime: '15:00', endTime: '15:15', type: 'short-break' }
    ]
  },
  {
    id: 'wed-mike-barber',
    staffId: 'mike-chen',
    staffName: 'Mike Chen',
    date: '2024-01-10',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Senior Barber',
    workstation: 'Station 1',
    breaks: [
      { startTime: '12:30', endTime: '13:30', type: 'lunch', coverageBy: 'David Ross' },
      { startTime: '15:30', endTime: '15:45', type: 'short-break' }
    ]
  },
  {
    id: 'wed-lisa-stylist',
    staffId: 'lisa-brown',
    staffName: 'Lisa Brown',
    date: '2024-01-10',
    startTime: '10:00',
    endTime: '18:00',
    role: 'Senior Stylist',
    workstation: 'Station 3',
    breaks: [
      { startTime: '13:00', endTime: '14:00', type: 'lunch', coverageBy: 'Mike Chen' },
      { startTime: '16:00', endTime: '16:15', type: 'short-break' }
    ]
  },

  // Thursday
  {
    id: 'thu-sarah-reception',
    staffId: 'sarah-johnson',
    staffName: 'Sarah Johnson',
    date: '2024-01-11',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Reception Manager',
    workstation: 'Reception',
    breaks: [
      { startTime: '12:00', endTime: '13:00', type: 'lunch' },
      { startTime: '15:00', endTime: '15:15', type: 'short-break' }
    ]
  },
  {
    id: 'thu-mike-barber',
    staffId: 'mike-chen',
    staffName: 'Mike Chen',
    date: '2024-01-11',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Senior Barber',
    workstation: 'Station 1',
    breaks: [
      { startTime: '12:30', endTime: '13:30', type: 'lunch', coverageBy: 'Sarah Johnson' },
      { startTime: '15:30', endTime: '15:45', type: 'short-break' }
    ]
  },
  {
    id: 'thu-david-barber',
    staffId: 'david-ross',
    staffName: 'David Ross',
    date: '2024-01-11',
    startTime: '10:00',
    endTime: '18:00',
    role: 'Barber',
    workstation: 'Station 2',
    breaks: [
      { startTime: '13:00', endTime: '14:00', type: 'lunch', coverageBy: 'Mike Chen' },
      { startTime: '16:00', endTime: '16:15', type: 'short-break' }
    ]
  },

  // Friday
  {
    id: 'fri-sarah-reception',
    staffId: 'sarah-johnson',
    staffName: 'Sarah Johnson',
    date: '2024-01-12',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Reception Manager',
    workstation: 'Reception',
    breaks: [
      { startTime: '12:00', endTime: '13:00', type: 'lunch' },
      { startTime: '15:00', endTime: '15:15', type: 'short-break' }
    ]
  },
  {
    id: 'fri-lisa-stylist',
    staffId: 'lisa-brown',
    staffName: 'Lisa Brown',
    date: '2024-01-12',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Senior Stylist',
    workstation: 'Station 3',
    breaks: [
      { startTime: '12:30', endTime: '13:30', type: 'lunch', coverageBy: 'Sarah Johnson' },
      { startTime: '15:30', endTime: '15:45', type: 'short-break' }
    ]
  },
  {
    id: 'fri-mike-barber',
    staffId: 'mike-chen',
    staffName: 'Mike Chen',
    date: '2024-01-12',
    startTime: '10:00',
    endTime: '18:00',
    role: 'Senior Barber',
    workstation: 'Station 1',
    breaks: [
      { startTime: '13:00', endTime: '14:00', type: 'lunch', coverageBy: 'Lisa Brown' },
      { startTime: '16:00', endTime: '16:15', type: 'short-break' }
    ]
  },

  // Saturday
  {
    id: 'sat-sarah-reception',
    staffId: 'sarah-johnson',
    staffName: 'Sarah Johnson',
    date: '2024-01-13',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Reception Manager',
    workstation: 'Reception',
    breaks: [
      { startTime: '12:00', endTime: '13:00', type: 'lunch' },
      { startTime: '15:00', endTime: '15:15', type: 'short-break' }
    ]
  },
  {
    id: 'sat-mike-barber',
    staffId: 'mike-chen',
    staffName: 'Mike Chen',
    date: '2024-01-13',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Senior Barber',
    workstation: 'Station 1',
    breaks: [
      { startTime: '12:30', endTime: '13:30', type: 'lunch', coverageBy: 'Sarah Johnson' },
      { startTime: '15:30', endTime: '15:45', type: 'short-break' }
    ]
  },
  {
    id: 'sat-david-barber',
    staffId: 'david-ross',
    staffName: 'David Ross',
    date: '2024-01-13',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Barber',
    workstation: 'Station 2',
    breaks: [
      { startTime: '13:00', endTime: '14:00', type: 'lunch', coverageBy: 'Mike Chen' },
      { startTime: '16:00', endTime: '16:15', type: 'short-break' }
    ]
  },
  {
    id: 'sat-lisa-stylist',
    staffId: 'lisa-brown',
    staffName: 'Lisa Brown',
    date: '2024-01-13',
    startTime: '10:00',
    endTime: '18:00',
    role: 'Senior Stylist',
    workstation: 'Station 3',
    breaks: [
      { startTime: '14:00', endTime: '15:00', type: 'lunch', coverageBy: 'David Ross' },
      { startTime: '16:30', endTime: '16:45', type: 'short-break' }
    ]
  }
]

// =============================================================================
// STAFF PERFORMANCE TRACKING
// =============================================================================

export const staffPerformanceRecords: StaffPerformance[] = [
  {
    id: 'perf-mike-weekly-2024-w01',
    staffId: 'mike-chen',
    period: 'weekly',
    metrics: {
      customerSatisfaction: 4.8,
      servicesCompleted: 45,
      revenueGenerated: 2250,
      punctuality: 100,
      attendance: 100,
      teamwork: 4.9
    },
    achievements: [
      'Consistently high customer satisfaction scores',
      'Exceeded revenue target by 15%',
      'Mentored junior staff member successfully',
      'Implemented new technique that improved service time'
    ],
    areasForImprovement: [
      'Could improve workstation organization between clients',
      'Consider more proactive product recommendations'
    ],
    goals: [
      'Maintain customer satisfaction above 4.7',
      'Complete advanced styling certification',
      'Increase average service revenue by 10%'
    ]
  },

  {
    id: 'perf-sarah-weekly-2024-w01',
    staffId: 'sarah-johnson',
    period: 'weekly',
    metrics: {
      customerSatisfaction: 4.9,
      servicesCompleted: 38,
      revenueGenerated: 1800,
      punctuality: 100,
      attendance: 100,
      teamwork: 5.0
    },
    achievements: [
      'Perfect attendance record',
      'Successfully managed difficult customer situation',
      'Implemented new booking system improvements',
      'Trained 3 new reception staff members'
    ],
    areasForImprovement: [
      'Consider more proactive upselling opportunities'
    ],
    goals: [
      'Complete management certification course',
      'Increase team productivity by 8%',
      'Implement customer feedback system improvements'
    ]
  },

  {
    id: 'perf-lisa-weekly-2024-w01',
    staffId: 'lisa-brown',
    period: 'weekly',
    metrics: {
      customerSatisfaction: 4.7,
      servicesCompleted: 42,
      revenueGenerated: 2100,
      punctuality: 98,
      attendance: 100,
      teamwork: 4.8
    },
    achievements: [
      'Successfully completed advanced color certification',
      'High customer retention rate with existing clients',
      'Created 5 new hairstyle looks that were well-received',
      'Mentored apprentice stylist effectively'
    ],
    areasForImprovement: [
      'Focus on punctuality for start times',
      'Consider expanding product knowledge for recommendations'
    ],
    goals: [
      'Achieve 100% punctuality for next quarter',
      'Complete advanced cutting techniques course',
      'Increase client base by 15% through referrals'
    ]
  },

  {
    id: 'perf-david-weekly-2024-w01',
    staffId: 'david-ross',
    period: 'weekly',
    metrics: {
      customerSatisfaction: 4.6,
      servicesCompleted: 40,
      revenueGenerated: 1900,
      punctuality: 95,
      attendance: 98,
      teamwork: 4.7
    },
    achievements: [
      'Improved service efficiency by 12%',
      'Successfully handled 3 walk-in customers during peak hours',
      'Received positive feedback on beard grooming techniques',
      'Helped organize team-building event'
    ],
    areasForImprovement: [
      'Work on punctuality and time management',
      'Consider more detailed client consultations',
      'Focus on expanding service menu knowledge'
    ],
    goals: [
      'Improve punctuality to 100%',
      'Complete advanced beard styling course',
      'Increase customer satisfaction to 4.8 average'
    ]
  }
]

// =============================================================================
// STAFF TRAINING RECORDS
// =============================================================================

export const staffTrainingRecords: StaffTraining[] = [
  {
    id: 'training-mike-certification-2024',
    staffId: 'mike-chen',
    trainingType: 'Advanced Cutting Techniques',
    completionDate: '2024-01-15',
    expiryDate: '2026-01-15',
    certification: true,
    score: 95,
    instructor: 'Master Barber Academy',
    notes: 'Excellent technique demonstration, particularly strong in precision cutting and client consultation.'
  },

  {
    id: 'training-sarah-management-2024',
    staffId: 'sarah-johnson',
    trainingType: 'Customer Service Management',
    completionDate: '2024-01-10',
    expiryDate: '2025-01-10',
    certification: true,
    score: 98,
    instructor: 'Service Excellence Institute',
    notes: 'Outstanding performance in conflict resolution scenarios. Natural leadership abilities demonstrated.'
  },

  {
    id: 'training-lisa-color-2024',
    staffId: 'lisa-brown',
    trainingType: 'Advanced Hair Color Techniques',
    completionDate: '2024-01-08',
    expiryDate: '2026-01-08',
    certification: true,
    score: 97,
    instructor: 'International Color Academy',
    notes: 'Exceptional understanding of color theory and application. Creative approach to color solutions.'
  },

  {
    id: 'training-david-basic-2024',
    staffId: 'david-ross',
    trainingType: 'Basic Barber Training Refresher',
    completionDate: '2024-01-12',
    expiryDate: '2025-01-12',
    certification: true,
    score: 92,
    instructor: 'Modern Men Training Program',
    notes: 'Solid performance with room for improvement in consultation techniques. Good technical skills.'
  },

  {
    id: 'training-mike-safety-2024',
    staffId: 'mike-chen',
    trainingType: 'Workplace Safety and Sanitation',
    completionDate: '2024-01-05',
    expiryDate: '2025-01-05',
    certification: true,
    score: 100,
    instructor: 'OSHA Certified Trainer',
    notes: 'Perfect score on safety protocols. Demonstrated excellent knowledge of sanitation procedures.'
  },

  {
    id: 'training-sarah-firstaid-2024',
    staffId: 'sarah-johnson',
    trainingType: 'First Aid and CPR Certification',
    completionDate: '2024-01-03',
    expiryDate: '2026-01-03',
    certification: true,
    score: 96,
    instructor: 'American Red Cross',
    notes: 'Strong performance in emergency response scenarios. Confident in first aid application.'
  }
]

// =============================================================================
// STAFF TIME OFF AND LEAVE MANAGEMENT
// =============================================================================

export interface TimeOffRequest {
  id: string
  staffId: string
  staffName: string
  type: 'vacation' | 'sick' | 'personal' | 'training' | 'bereavement'
  startDate: string
  endDate: string
  hoursRequested: number
  status: 'pending' | 'approved' | 'denied' | 'cancelled'
  reason: string
  submittedDate: string
  approvedBy?: string
  approvedDate?: string
  notes?: string
}

export const timeOffRequests: TimeOffRequest[] = [
  {
    id: 'pto-mike-vacation-2024-02',
    staffId: 'mike-chen',
    staffName: 'Mike Chen',
    type: 'vacation',
    startDate: '2024-02-12',
    endDate: '2024-02-16',
    hoursRequested: 40,
    status: 'approved',
    reason: 'Family vacation planned for 5 days',
    submittedDate: '2024-01-01',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2024-01-03',
    notes: 'Coverage arranged with David Ross for extra shifts'
  },

  {
    id: 'pto-lisa-training-2024-03',
    staffId: 'lisa-brown',
    staffName: 'Lisa Brown',
    type: 'training',
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    hoursRequested: 8,
    status: 'approved',
    reason: 'Advanced color techniques workshop',
    submittedDate: '2024-01-10',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2024-01-12',
    notes: 'Paid training day approved. Coverage by agency stylist.'
  },

  {
    id: 'pto-sarah-personal-2024-02',
    staffId: 'sarah-johnson',
    staffName: 'Sarah Brown',
    type: 'personal',
    startDate: '2024-02-08',
    endDate: '2024-02-08',
    hoursRequested: 8,
    status: 'pending',
    reason: 'Personal appointment',
    submittedDate: '2024-01-20',
    notes: 'Awaiting approval. Will arrange coverage if approved.'
  }
]

// =============================================================================
// STAFF DEVELOPMENT PLAN
// =============================================================================

export interface DevelopmentPlan {
  id: string
  staffId: string
  staffName: string
  period: string
  goals: DevelopmentGoal[]
  mentor?: string
  reviewDate: string
  status: 'active' | 'completed' | 'on-hold'
}

export interface DevelopmentGoal {
  id: string
  category: 'technical' | 'customer-service' | 'leadership' | 'business'
  goal: string
  targetDate: string
  progress: number // 0-100
  actions: string[]
  resources: string[]
  successMetrics: string[]
}

export const staffDevelopmentPlans: DevelopmentPlan[] = [
  {
    id: 'dev-mike-2024',
    staffId: 'mike-chen',
    staffName: 'Mike Chen',
    period: '2024-Q1',
    mentor: 'Master Barber Association',
    reviewDate: '2024-04-01',
    status: 'active',
    goals: [
      {
        id: 'mike-technical-1',
        category: 'technical',
        goal: 'Master advanced fade techniques',
        targetDate: '2024-03-31',
        progress: 75,
        actions: [
          'Complete advanced cutting workshop',
          'Practice techniques on training head daily',
          'Seek feedback from senior barbers',
          'Document technique improvements'
        ],
        resources: [
          'Advanced Cutting Techniques Manual',
          'Training head for practice',
          'Video tutorials from Master Barber Academy'
        ],
        successMetrics: [
          'Complete certification exam with 90%+ score',
          'Receive positive feedback from 5 client consultations',
          'Successfully perform technique on 20 clients'
        ]
      },
      {
        id: 'mike-business-1',
        category: 'business',
        goal: 'Increase average service revenue by 15%',
        targetDate: '2024-03-31',
        progress: 60,
        actions: [
          'Complete product knowledge training',
          'Practice upselling techniques in role-play',
          'Track current vs target revenue metrics',
          'Implement personalized recommendation system'
        ],
        resources: [
          'Product Knowledge Training Materials',
          'Sales Training Program',
          'Revenue Tracking Spreadsheet'
        ],
        successMetrics: [
          'Achieve 15% revenue increase',
          'Maintain customer satisfaction above 4.7',
          'Successfully upsell products to 30% of clients'
        ]
      }
    ]
  },

  {
    id: 'dev-sarah-2024',
    staffId: 'sarah-johnson',
    staffName: 'Sarah Johnson',
    period: '2024-Q1',
    mentor: 'Operations Manager',
    reviewDate: '2024-04-01',
    status: 'active',
    goals: [
      {
        id: 'sarah-leadership-1',
        category: 'leadership',
        goal: 'Develop team leadership and mentoring skills',
        targetDate: '2024-03-31',
        progress: 80,
        actions: [
          'Complete leadership training course',
          'Mentor 2 junior team members',
          'Lead weekly team meetings',
          'Implement feedback system for team'
        ],
        resources: [
          'Leadership Development Course',
          'Mentoring Guidelines Handbook',
          'Team Meeting Facilitation Guide'
        ],
        successMetrics: [
          'Successfully mentor 2 team members',
          'Receive positive feedback from team members',
          'Complete leadership certification'
        ]
      },
      {
        id: 'sarah-customer-1',
        category: 'customer-service',
        goal: 'Implement customer feedback system improvements',
        targetDate: '2024-03-31',
        progress: 90,
        actions: [
          'Analyze current feedback collection methods',
          'Design improved feedback system',
          'Train team on new system',
          'Monitor and measure system effectiveness'
        ],
        resources: [
          'Customer Feedback System Software',
          'Survey Design Best Practices Guide',
          'Analytics Dashboard Training'
        ],
        successMetrics: [
          'Increase response rate by 25%',
          'Implement automated follow-up system',
          'Achieve 20% improvement in customer satisfaction'
        ]
      }
    ]
  }
]

// =============================================================================
// EXPORT ALL STAFF MANAGEMENT DATA
// =============================================================================

export const staffManagementData = {
  schedulingRules,
  weeklyScheduleTemplate,
  staffPerformanceRecords,
  staffTrainingRecords,
  timeOffRequests,
  staffDevelopmentPlans
}
