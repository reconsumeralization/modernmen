// =============================================================================
// CUSTOMER SERVICE PROCEDURES - Excellence standards and protocols
// =============================================================================

export interface ServiceStandard {
  id: string
  category: 'greeting' | 'consultation' | 'service' | 'followup' | 'complaint'
  title: string
  description: string
  steps: string[]
  timeAllocation: number // in minutes
  qualityMetrics: string[]
  criticalPath: boolean
}

export interface CustomerJourneyStage {
  id: string
  stage: string
  touchpoints: Touchpoint[]
  keyMetrics: string[]
  successCriteria: string[]
}

export interface Touchpoint {
  id: string
  type: 'interaction' | 'communication' | 'experience'
  description: string
  responsible: string
  timing: string
  qualityStandard: string
}

export interface ComplaintResolution {
  id: string
  severity: 'minor' | 'moderate' | 'major' | 'critical'
  responseTime: string
  resolutionAuthority: string
  compensationGuidelines: string[]
  followUpProtocol: string[]
  preventionMeasures: string[]
}

export interface CustomerFeedbackSystem {
  id: string
  method: string
  frequency: string
  collectionMethod: string
  analysisProcess: string[]
  actionThresholds: Record<string, number>
  improvementCycle: string
}

// =============================================================================
// SERVICE EXCELLENCE STANDARDS
// =============================================================================

export const serviceStandards: ServiceStandard[] = [
  {
    id: 'welcome-protocol',
    category: 'greeting',
    title: 'Customer Welcome Protocol',
    description: 'Standardized warm welcome and initial engagement procedure',
    steps: [
      'Acknowledge customer within 30 seconds of entry',
      'Stand, make eye contact, and smile warmly',
      'Use customer\'s name if recognized ("Welcome back, Mr. Johnson!")',
      'Offer immediate assistance ("How may we help you today?")',
      'Note any special requests or preferences immediately',
      'Escort to appropriate service area or consultation space',
      'Offer refreshments and make customer comfortable'
    ],
    timeAllocation: 2,
    qualityMetrics: [
      'Response time ≤ 30 seconds',
      'Personal greeting used',
      'Eye contact maintained',
      'Warm and genuine smile',
      'Immediate assistance offered'
    ],
    criticalPath: true
  },

  {
    id: 'consultation-process',
    category: 'consultation',
    title: 'Service Consultation Process',
    description: 'Comprehensive consultation to understand customer needs and preferences',
    steps: [
      'Ask open-ended questions about desired outcome',
      'Listen actively without interrupting',
      'Ask clarifying questions to understand preferences',
      'Explain service options and recommendations',
      'Discuss pricing, timing, and expectations clearly',
      'Note any allergies, sensitivities, or special requests',
      'Obtain verbal confirmation of understanding',
      'Document consultation details for service team'
    ],
    timeAllocation: 5,
    qualityMetrics: [
      'All customer preferences documented',
      'Clear explanation of services provided',
      'Pricing transparency maintained',
      'Special requirements noted',
      'Customer understanding confirmed'
    ],
    criticalPath: true
  },

  {
    id: 'service-delivery',
    category: 'service',
    title: 'Service Delivery Excellence',
    description: 'High-quality service execution with attention to detail',
    steps: [
      'Prepare workstation and tools before customer arrival',
      'Greet customer warmly and confirm service details',
      'Maintain clear communication throughout service',
      'Provide regular progress updates and check comfort',
      'Execute service with precision and attention to detail',
      'Offer mirror checks and obtain feedback during service',
      'Complete service within agreed time frame ±5 minutes',
      'Present final result and obtain satisfaction confirmation'
    ],
    timeAllocation: 45,
    qualityMetrics: [
      'Service completed within time frame',
      'Customer comfort regularly checked',
      'Clear communication maintained',
      'Quality standards met or exceeded',
      'Customer satisfaction expressed'
    ],
    criticalPath: true
  },

  {
    id: 'checkout-protocol',
    category: 'followup',
    title: 'Professional Checkout Protocol',
    description: 'Smooth and professional service conclusion and next steps',
    steps: [
      'Present final result in mirror with positive framing',
      'Obtain explicit feedback on service satisfaction',
      'Provide aftercare instructions and product recommendations',
      'Schedule next appointment based on customer preference',
      'Process payment efficiently and professionally',
      'Thank customer sincerely and invite return',
      'Send follow-up satisfaction survey within 1 hour',
      'Note any feedback or suggestions for improvement'
    ],
    timeAllocation: 5,
    qualityMetrics: [
      'Clear aftercare instructions provided',
      'Next appointment scheduled',
      'Payment processed smoothly',
      'Sincere thank you expressed',
      'Follow-up survey sent promptly'
    ],
    criticalPath: true
  },

  {
    id: 'complaint-resolution',
    category: 'complaint',
    title: 'Complaint Resolution Protocol',
    description: 'Effective handling and resolution of customer concerns',
    steps: [
      'Listen to complaint without interruption or defensiveness',
      'Acknowledge feelings and apologize for inconvenience',
      'Restate understanding to confirm accurate comprehension',
      'Offer immediate resolution or compensation',
      'Escalate to manager if issue cannot be resolved immediately',
      'Document complaint details and resolution offered',
      'Follow up within 24 hours to confirm satisfaction',
      'Use feedback to improve processes and prevent recurrence'
    ],
    timeAllocation: 10,
    qualityMetrics: [
      'Active listening demonstrated',
      'Empathy and understanding shown',
      'Resolution offered promptly',
      'Follow-up conducted within 24 hours',
      'Process improvement implemented'
    ],
    criticalPath: true
  }
]

// =============================================================================
// CUSTOMER JOURNEY STAGES
// =============================================================================

export const customerJourneyStages: CustomerJourneyStage[] = [
  {
    id: 'discovery',
    stage: 'Discovery & Booking',
    touchpoints: [
      {
        id: 'online-presence',
        type: 'experience',
        description: 'Website, social media, and online reviews',
        responsible: 'Marketing Team',
        timing: 'Pre-visit',
        qualityStandard: 'Professional, modern, informative'
      },
      {
        id: 'phone-inquiry',
        type: 'communication',
        description: 'Initial phone contact for information or booking',
        responsible: 'Reception Staff',
        timing: 'Pre-visit',
        qualityStandard: 'Answered within 3 rings, knowledgeable, friendly'
      },
      {
        id: 'online-booking',
        type: 'interaction',
        description: 'Self-service booking through website/app',
        responsible: 'Technical System',
        timing: 'Pre-visit',
        qualityStandard: 'Intuitive, fast, confirmation immediate'
      },
      {
        id: 'booking-confirmation',
        type: 'communication',
        description: 'Email/text confirmation of appointment',
        responsible: 'Automated System',
        timing: 'Immediate post-booking',
        qualityStandard: 'Clear, professional, all details included'
      }
    ],
    keyMetrics: [
      'Online booking conversion rate',
      'Phone answer rate within 3 rings',
      'Booking confirmation response time',
      'Website bounce rate and user engagement'
    ],
    successCriteria: [
      'Customer finds salon easily online',
      'Booking process is smooth and intuitive',
      'All communication is clear and timely',
      'Customer feels confident about visit'
    ]
  },

  {
    id: 'arrival',
    stage: 'Arrival & Welcome',
    touchpoints: [
      {
        id: 'physical-entrance',
        type: 'experience',
        description: 'Exterior appearance and entrance experience',
        responsible: 'Facilities Management',
        timing: 'Upon arrival',
        qualityStandard: 'Clean, well-lit, welcoming atmosphere'
      },
      {
        id: 'welcome-greeting',
        type: 'interaction',
        description: 'Initial greeting and check-in process',
        responsible: 'Reception Staff',
        timing: 'Within 30 seconds',
        qualityStandard: 'Warm, personal, efficient'
      },
      {
        id: 'waiting-experience',
        type: 'experience',
        description: 'Waiting area comfort and amenities',
        responsible: 'Operations Team',
        timing: 'During wait',
        qualityStandard: 'Comfortable, engaging, refreshments available'
      },
      {
        id: 'consultation',
        type: 'interaction',
        description: 'Pre-service consultation and planning',
        responsible: 'Service Provider',
        timing: 'Pre-service',
        qualityStandard: 'Thorough, personalized, expectations set'
      }
    ],
    keyMetrics: [
      'Average wait time from arrival to service',
      'Customer satisfaction with welcome experience',
      'Consultation completion rate',
      'Wait area utilization and comfort ratings'
    ],
    successCriteria: [
      'Customer feels immediately welcome',
      'Wait time is minimal and comfortable',
      'Consultation addresses all concerns',
      'Customer is relaxed and ready for service'
    ]
  },

  {
    id: 'service',
    stage: 'Service Delivery',
    touchpoints: [
      {
        id: 'service-preparation',
        type: 'experience',
        description: 'Workstation setup and preparation',
        responsible: 'Service Provider',
        timing: 'Pre-service',
        qualityStandard: 'Clean, organized, professional setup'
      },
      {
        id: 'during-service',
        type: 'interaction',
        description: 'Service execution and customer interaction',
        responsible: 'Service Provider',
        timing: 'During service',
        qualityStandard: 'Skilled, communicative, attentive'
      },
      {
        id: 'progress-checks',
        type: 'communication',
        description: 'Regular check-ins during service',
        responsible: 'Service Provider',
        timing: 'Throughout service',
        qualityStandard: 'Frequent, genuine, responsive to feedback'
      },
      {
        id: 'service-completion',
        type: 'interaction',
        description: 'Final presentation and satisfaction check',
        responsible: 'Service Provider',
        timing: 'End of service',
        qualityStandard: 'Proud presentation, feedback solicited'
      }
    ],
    keyMetrics: [
      'Service completion within estimated time',
      'Customer satisfaction during service',
      'Progress check frequency and quality',
      'Service quality rating (1-5 scale)'
    ],
    successCriteria: [
      'Service meets or exceeds expectations',
      'Customer feels cared for throughout',
      'Communication is clear and frequent',
      'Final result delights the customer'
    ]
  },

  {
    id: 'checkout',
    stage: 'Checkout & Follow-up',
    touchpoints: [
      {
        id: 'payment-process',
        type: 'interaction',
        description: 'Smooth and professional payment processing',
        responsible: 'Reception Staff',
        timing: 'Post-service',
        qualityStandard: 'Efficient, transparent, secure'
      },
      {
        id: 'next-appointment',
        type: 'communication',
        description: 'Scheduling of future appointment',
        responsible: 'Reception Staff',
        timing: 'Post-service',
        qualityStandard: 'Convenient options, confirmation sent'
      },
      {
        id: 'thank-you',
        type: 'communication',
        description: 'Personal thank you and farewell',
        responsible: 'Service Team',
        timing: 'At departure',
        qualityStandard: 'Sincere, personal, memorable'
      },
      {
        id: 'follow-up-survey',
        type: 'communication',
        description: 'Post-service satisfaction survey',
        responsible: 'Automated System',
        timing: 'Within 1 hour',
        qualityStandard: 'Easy to complete, actionable feedback'
      }
    ],
    keyMetrics: [
      'Payment processing time',
      'Next appointment booking rate',
      'Follow-up survey response rate',
      'Overall visit satisfaction score'
    ],
    successCriteria: [
      'Payment process is seamless',
      'Future appointment is scheduled',
      'Customer leaves with positive feelings',
      'Feedback is collected for improvement'
    ]
  },

  {
    id: 'retention',
    stage: 'Retention & Loyalty',
    touchpoints: [
      {
        id: 'loyalty-program',
        type: 'communication',
        description: 'Enrollment and engagement in loyalty program',
        responsible: 'Operations Team',
        timing: 'Post-visit',
        qualityStandard: 'Valuable benefits, easy participation'
      },
      {
        id: 'birthday-recognition',
        type: 'communication',
        description: 'Birthday greetings and special offers',
        responsible: 'Marketing Team',
        timing: 'On birthday',
        qualityStandard: 'Personalized, timely, special treatment'
      },
      {
        id: 're-engagement',
        type: 'communication',
        description: 'Contact with inactive customers',
        responsible: 'Marketing Team',
        timing: 'After 3 months inactivity',
        qualityStandard: 'Welcoming, value-driven, non-intrusive'
      },
      {
        id: 'special-offers',
        type: 'communication',
        description: 'Exclusive offers for loyal customers',
        responsible: 'Marketing Team',
        timing: 'Regular intervals',
        qualityStandard: 'Relevant, valuable, exclusive'
      }
    ],
    keyMetrics: [
      'Loyalty program enrollment rate',
      'Customer retention rate (12 months)',
      'Repeat visit frequency',
      'Lifetime customer value'
    ],
    successCriteria: [
      'Customer feels valued and appreciated',
      'Return visits are frequent and regular',
      'Loyalty program participation is high',
      'Customer lifetime value increases over time'
    ]
  }
]

// =============================================================================
// COMPLAINT RESOLUTION PROTOCOLS
// =============================================================================

export const complaintResolutionProtocols: ComplaintResolution[] = [
  {
    id: 'minor-complaint',
    severity: 'minor',
    responseTime: 'Immediate (during visit)',
    resolutionAuthority: 'Front-line staff',
    compensationGuidelines: [
      'Verbal apology and acknowledgment',
      'Complimentary service upgrade if applicable',
      'Discount on current visit (10-20%)',
      'Priority scheduling for next visit',
      'Personal follow-up call within 24 hours'
    ],
    followUpProtocol: [
      'Document complaint details and resolution',
      'Follow up with customer within 24 hours',
      'Verify satisfaction with resolution',
      'Note any patterns for process improvement',
      'Share feedback with team for learning'
    ],
    preventionMeasures: [
      'Enhanced staff training on service standards',
      'Regular quality audits and checklists',
      'Improved communication protocols',
      'Customer preference documentation',
      'Process standardization and consistency'
    ]
  },

  {
    id: 'moderate-complaint',
    severity: 'moderate',
    responseTime: 'Within 1 hour',
    resolutionAuthority: 'Supervisor/Manager',
    compensationGuidelines: [
      'Formal written apology from management',
      '50% discount on current or next service',
      'Complimentary add-on service or product',
      'VIP treatment for next visit',
      'Personal follow-up from manager within 24 hours',
      'Consideration for loyalty program upgrade'
    ],
    followUpProtocol: [
      'Manager personally handles resolution',
      'Detailed documentation of incident and resolution',
      'Customer satisfaction survey within 48 hours',
      'Regular check-ins for first month after incident',
      'Review incident in team meeting for prevention'
    ],
    preventionMeasures: [
      'Manager training on complaint resolution',
      'Regular staff feedback sessions',
      'Process documentation and standardization',
      'Quality control checkpoints implementation',
      'Customer feedback integration into operations'
    ]
  },

  {
    id: 'major-complaint',
    severity: 'major',
    responseTime: 'Within 30 minutes',
    resolutionAuthority: 'Owner/Upper Management',
    compensationGuidelines: [
      'Full refund or credit for service',
      'Complimentary full service package',
      'Extended VIP treatment and priority service',
      'Personal apology from ownership',
      'Compensation for any related expenses',
      'Loyalty program premium membership'
    ],
    followUpProtocol: [
      'Ownership-level involvement in resolution',
      'Comprehensive incident investigation',
      'Customer receives formal written apology',
      'Ongoing relationship management',
      'Regular status updates for several months',
      'Dedicated account management if requested'
    ],
    preventionMeasures: [
      'Comprehensive quality management system',
      'Regular third-party quality audits',
      'Advanced staff training programs',
      'Technology improvements for service consistency',
      'Customer experience mapping and optimization'
    ]
  },

  {
    id: 'critical-complaint',
    severity: 'critical',
    responseTime: 'Immediate (within 15 minutes)',
    resolutionAuthority: 'Executive Team',
    compensationGuidelines: [
      'Full refund plus compensation for inconvenience',
      'Extended complimentary services or products',
      'Priority access to all services and staff',
      'Formal investigation and corrective action plan',
      'Consideration of systemic changes to prevent recurrence',
      'Potential financial compensation based on impact'
    ],
    followUpProtocol: [
      'Executive-level communication and resolution',
      'Formal investigation with external review if needed',
      'Comprehensive documentation and analysis',
      'Customer involvement in resolution process',
      'Long-term relationship rebuilding plan',
      'Regular progress reports to customer'
    ],
    preventionMeasures: [
      'Root cause analysis and systemic improvements',
      'External consultant engagement for quality review',
      'Comprehensive staff retraining programs',
      'Technology upgrades for service quality',
      'Industry best practice implementation',
      'Regular external audits and certifications'
    ]
  }
]

// =============================================================================
// CUSTOMER FEEDBACK SYSTEMS
// =============================================================================

export const customerFeedbackSystems: CustomerFeedbackSystem[] = [
  {
    id: 'post-service-survey',
    method: 'Digital Survey',
    frequency: 'After every service',
    collectionMethod: 'Automated email/text link',
    analysisProcess: [
      'Survey responses collected in real-time',
      'Automated alerts for scores below 4.0',
      'Weekly summary reports generated',
      'Monthly trend analysis conducted',
      'Action items assigned to responsible staff'
    ],
    actionThresholds: {
      'immediate_followup': 3.5,
      'manager_review': 3.0,
      'executive_review': 2.5,
      'quality_alert': 2.0
    },
    improvementCycle: 'Weekly review and monthly action planning'
  },

  {
    id: 'net-promoter-score',
    method: 'NPS Survey',
    frequency: 'Monthly',
    collectionMethod: 'Email campaign to recent customers',
    analysisProcess: [
      'NPS calculation and segmentation',
      'Detractor follow-up within 24 hours',
      'Monthly NPS trend tracking',
      'Quarterly deep-dive analysis',
      'Customer insights integration'
    ],
    actionThresholds: {
      'detractor_followup': 6,
      'segment_analysis': 50,
      'trend_alert': 5
    },
    improvementCycle: 'Monthly reporting with quarterly action plans'
  },

  {
    id: 'mystery-shopper',
    method: 'Professional Mystery Shopping',
    frequency: 'Quarterly',
    collectionMethod: 'Third-party mystery shopper visits',
    analysisProcess: [
      'Detailed service quality assessment',
      'Comparison against service standards',
      'Staff performance evaluation',
      'Operational gap identification',
      'Improvement recommendation development'
    ],
    actionThresholds: {
      'staff_coaching': 85,
      'process_review': 80,
      'management_intervention': 75
    },
    improvementCycle: 'Quarterly reports with immediate action items'
  },

  {
    id: 'social-media-monitoring',
    method: 'Social Media Analytics',
    frequency: 'Daily/Weekly',
    collectionMethod: 'Automated social media monitoring',
    analysisProcess: [
      'Real-time mention tracking',
      'Sentiment analysis and categorization',
      'Response time monitoring',
      'Trend identification',
      'Competitive analysis'
    ],
    actionThresholds: {
      'immediate_response': 2, // hours
      'escalation_review': 10, // mentions
      'trend_alert': 5 // negative mentions
    },
    improvementCycle: 'Daily monitoring with weekly strategic review'
  }
]

// =============================================================================
// CUSTOMER SERVICE TRAINING MODULES
// =============================================================================

export interface TrainingModule {
  id: string
  title: string
  duration: number // in hours
  frequency: 'annual' | 'quarterly' | 'monthly' | 'weekly'
  targetAudience: string[]
  learningObjectives: string[]
  assessmentMethod: string
  certification: boolean
}

export const trainingModules: TrainingModule[] = [
  {
    id: 'customer-service-basics',
    title: 'Customer Service Excellence Basics',
    duration: 4,
    frequency: 'quarterly',
    targetAudience: ['all-staff'],
    learningObjectives: [
      'Understand customer service principles',
      'Master greeting and communication protocols',
      'Learn active listening and empathy techniques',
      'Practice complaint resolution scenarios',
      'Develop personal customer service style'
    ],
    assessmentMethod: 'Role-playing scenarios and written quiz',
    certification: true
  },

  {
    id: 'product-knowledge',
    title: 'Product and Service Knowledge',
    duration: 6,
    frequency: 'monthly',
    targetAudience: ['service-staff', 'reception'],
    learningObjectives: [
      'Master product features and benefits',
      'Understand service procedures and timing',
      'Learn contraindications and safety protocols',
      'Practice product recommendations',
      'Master pricing and package information'
    ],
    assessmentMethod: 'Product knowledge quiz and demonstration',
    certification: true
  },

  {
    id: 'technical-skill-advancement',
    title: 'Advanced Technical Skills',
    duration: 8,
    frequency: 'quarterly',
    targetAudience: ['barbers', 'stylists'],
    learningObjectives: [
      'Advanced cutting and styling techniques',
      'New product application methods',
      'Customer consultation mastery',
      'Time management and efficiency',
      'Quality control and attention to detail'
    ],
    assessmentMethod: 'Practical demonstration and client feedback',
    certification: true
  },

  {
    id: 'leadership-communication',
    title: 'Leadership and Communication',
    duration: 3,
    frequency: 'monthly',
    targetAudience: ['supervisors', 'managers'],
    learningObjectives: [
      'Team motivation and leadership techniques',
      'Effective communication strategies',
      'Conflict resolution and mediation',
      'Performance coaching and development',
      'Customer relationship management'
    ],
    assessmentMethod: 'Leadership scenario role-playing and peer feedback',
    certification: true
  }
]

// =============================================================================
// EXPORT ALL CUSTOMER SERVICE DATA
// =============================================================================

export const customerServiceData = {
  serviceStandards,
  customerJourneyStages,
  complaintResolutionProtocols,
  customerFeedbackSystems,
  trainingModules
}
