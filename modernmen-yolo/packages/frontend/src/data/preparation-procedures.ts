// =============================================================================
// PREPARATION PROCEDURES AND PROCEDURES DOCUMENTATION
// =============================================================================

export interface PreparationProcedure {
  id: string
  serviceCategory: string
  serviceName: string
  preparationTime: number // minutes
  customerInstructions: string[]
  barberChecklist: string[]
  requiredSupplies: string[]
  safetyConsiderations: string[]
  aftercareInstructions: string[]
}

export const PREPARATION_PROCEDURES: PreparationProcedure[] = [
  {
    id: 'classic-haircut',
    serviceCategory: 'haircuts',
    serviceName: 'Classic Haircut',
    preparationTime: 5,
    customerInstructions: [
      'Arrive 5-10 minutes early to complete paperwork',
      'Come with clean, dry hair if possible',
      'Wear comfortable clothing that won\'t interfere with the service',
      'Bring reference photos if you have a specific style in mind'
    ],
    barberChecklist: [
      'Verify appointment details and customer preferences',
      'Prepare workstation with necessary tools (scissors, clippers, combs, etc.)',
      'Ensure cape and neck strips are clean and ready',
      'Check clipper guards and blade sharpness',
      'Prepare mirror and styling products if needed',
      'Confirm consultation preferences with customer'
    ],
    requiredSupplies: [
      'Professional scissors',
      'Clippers and guards',
      'Combs and brushes',
      'Cape and neck strips',
      'Spray bottle with water',
      'Mirror for customer feedback'
    ],
    safetyConsiderations: [
      'Ensure all tools are clean and sterilized',
      'Check for any customer allergies to products',
      'Maintain proper posture to prevent strain',
      'Keep work area clear of obstacles'
    ],
    aftercareInstructions: [
      'Wash hair within 24-48 hours to remove styling product residue',
      'Use gentle shampoo and conditioner suitable for your hair type',
      'Avoid excessive heat styling for 48 hours',
      'Schedule next appointment based on hair growth (typically 3-4 weeks)'
    ]
  },
  {
    id: 'beard-trim',
    serviceCategory: 'beard-grooming',
    serviceName: 'Beard Trim',
    preparationTime: 3,
    customerInstructions: [
      'Arrive with a clean, dry beard',
      'Come freshly shaved if you want a complete beard trim',
      'Inform barber of any skin sensitivities or allergies',
      'Bring reference photos if you have a specific beard style in mind'
    ],
    barberChecklist: [
      'Inspect beard for length, texture, and condition',
      'Discuss desired beard style and maintenance preferences',
      'Prepare appropriate tools based on beard type and desired style',
      'Ensure skin is clean and free of irritation',
      'Prepare hot towel and shaving cream if needed'
    ],
    requiredSupplies: [
      'Professional trimmers and scissors',
      'Various guard sizes',
      'Shaving cream and razor (if requested)',
      'Hot towel and moisturizing products',
      'Aftershave and beard oil'
    ],
    safetyConsiderations: [
      'Check for skin sensitivities or allergies',
      'Use sharp, clean tools to prevent pulling',
      'Apply gentle pressure to avoid nicks',
      'Test product on small skin area if needed'
    ],
    aftercareInstructions: [
      'Apply beard oil daily to keep beard soft and healthy',
      'Wash beard regularly with gentle cleanser',
      'Trim every 1-2 weeks to maintain shape',
      'Moisturize skin underneath beard to prevent irritation'
    ]
  },
  {
    id: 'haircut-beard-combo',
    serviceCategory: 'packages',
    serviceName: 'Haircut & Beard Combo',
    preparationTime: 8,
    customerInstructions: [
      'Arrive 10 minutes early for extended consultation',
      'Come with clean, dry hair and beard',
      'Wear comfortable clothing',
      'Bring reference photos for both hair and beard styles',
      'Inform barber of any preferences for service order'
    ],
    barberChecklist: [
      'Conduct comprehensive style consultation covering hair and beard',
      'Prepare workstation for both haircutting and beard grooming',
      'Ensure all tools for both services are ready',
      'Plan service sequence based on customer preferences',
      'Prepare additional supplies for extended service time'
    ],
    requiredSupplies: [
      'Complete haircutting set (scissors, clippers, combs)',
      'Beard grooming tools (trimmers, scissors, guards)',
      'Hot towel and shaving supplies',
      'Styling products for both hair and beard',
      'Mirror and consultation tools'
    ],
    safetyConsiderations: [
      'Monitor customer comfort during extended service',
      'Take breaks if needed to prevent fatigue',
      'Maintain proper sanitation between services',
      'Check for allergies to multiple products'
    ],
    aftercareInstructions: [
      'Follow hair washing guidelines (24-48 hours)',
      'Apply beard oil daily and maintain regular trims',
      'Use appropriate hair products for your hair type',
      'Schedule next appointment when hair/beard growth requires maintenance'
    ]
  },
  {
    id: 'hair-color',
    serviceCategory: 'hair-color',
    serviceName: 'Hair Color',
    preparationTime: 10,
    customerInstructions: [
      'Arrive with clean hair (washed 24 hours prior)',
      'Inform stylist of any allergies to hair products',
      'Discuss desired color and current hair condition',
      'Come prepared for extended service time (60-90 minutes)',
      'Bring reference photos of desired color'
    ],
    barberChecklist: [
      'Conduct thorough consultation about color preferences and hair history',
      'Perform strand test to check color reaction',
      'Prepare color mixing station with proper ventilation',
      'Set up processing area with timer and monitoring equipment',
      'Ensure emergency supplies are available'
    ],
    requiredSupplies: [
      'Professional hair color and developer',
      'Mixing bowls, brushes, and applicators',
      'Timer and processing caps',
      'Protective gloves and clothing',
      'Color remover and toners if needed'
    ],
    safetyConsiderations: [
      'Perform allergy patch test 48 hours before service',
      'Ensure proper ventilation in work area',
      'Wear protective gloves and clothing',
      'Have emergency supplies ready (neutralizer, etc.)',
      'Monitor processing time carefully'
    ],
    aftercareInstructions: [
      'Wait 24 hours before washing colored hair',
      'Use color-safe shampoo and conditioner',
      'Avoid heat styling for 72 hours after coloring',
      'Use color-depositing products to maintain vibrancy',
      'Schedule maintenance appointments every 4-6 weeks'
    ]
  },
  {
    id: 'facial-treatment',
    serviceCategory: 'facial-treatments',
    serviceName: 'Facial Treatment',
    preparationTime: 5,
    customerInstructions: [
      'Arrive with clean skin (no makeup)',
      'Inform therapist of skin conditions or allergies',
      'Come relaxed and prepared for a calming experience',
      'Remove contact lenses if applicable',
      'Discuss skin concerns and goals'
    ],
    barberChecklist: [
      'Review client skin history and concerns',
      'Prepare facial bed and supplies',
      'Ensure room temperature is comfortable',
      'Set up aromatherapy and relaxation elements',
      'Prepare customized treatment plan'
    ],
    requiredSupplies: [
      'Facial cleansers and exfoliants',
      'Steam equipment and extraction tools',
      'Masks and moisturizers',
      'Hot towel and massage supplies',
      'Protective coverings and sanitation supplies'
    ],
    safetyConsiderations: [
      'Check for allergies to facial products',
      'Ensure proper sanitation of all equipment',
      'Monitor client comfort throughout treatment',
      'Have emergency supplies available',
      'Maintain client privacy and comfort'
    ],
    aftercareInstructions: [
      'Avoid touching face excessively for 24 hours',
      'Use gentle, fragrance-free skincare products',
      'Stay out of direct sun and use SPF',
      'Drink plenty of water to maintain skin hydration',
      'Schedule follow-up treatments every 4-6 weeks'
    ]
  }
]

// =============================================================================
// PREPARATION PROCEDURE UTILITIES
// =============================================================================

export function getPreparationProcedure(serviceCategory: string, serviceName?: string): PreparationProcedure | undefined {
  return PREPARATION_PROCEDURES.find(proc =>
    proc.serviceCategory === serviceCategory &&
    (!serviceName || proc.serviceName === serviceName)
  )
}

export function getPreparationProceduresByCategory(category: string): PreparationProcedure[] {
  return PREPARATION_PROCEDURES.filter(proc => proc.serviceCategory === category)
}

export function getAllPreparationProcedures(): PreparationProcedure[] {
  return PREPARATION_PROCEDURES
}

// =============================================================================
// STANDARD PREPARATION CHECKLIST TEMPLATE
// =============================================================================

export interface PreparationChecklistItem {
  id: string
  category: 'customer' | 'barber' | 'supplies' | 'safety'
  title: string
  description: string
  required: boolean
  completed: boolean
}

export function generatePreparationChecklist(procedure: PreparationProcedure): PreparationChecklistItem[] {
  const checklist: PreparationChecklistItem[] = []

  // Customer preparation items
  procedure.customerInstructions.forEach((instruction, index) => {
    checklist.push({
      id: `customer-${index}`,
      category: 'customer',
      title: `Customer: ${instruction.split(' ').slice(0, 4).join(' ')}...`,
      description: instruction,
      required: true,
      completed: false
    })
  })

  // Barber checklist items
  procedure.barberChecklist.forEach((item, index) => {
    checklist.push({
      id: `barber-${index}`,
      category: 'barber',
      title: `Barber: ${item.split(' ').slice(0, 4).join(' ')}...`,
      description: item,
      required: true,
      completed: false
    })
  })

  // Supplies checklist
  procedure.requiredSupplies.forEach((supply, index) => {
    checklist.push({
      id: `supply-${index}`,
      category: 'supplies',
      title: `Supply: ${supply}`,
      description: `Ensure ${supply.toLowerCase()} is available and ready`,
      required: true,
      completed: false
    })
  })

  // Safety considerations
  procedure.safetyConsiderations.forEach((consideration, index) => {
    checklist.push({
      id: `safety-${index}`,
      category: 'safety',
      title: `Safety: ${consideration.split(' ').slice(0, 3).join(' ')}...`,
      description: consideration,
      required: true,
      completed: false
    })
  })

  return checklist
}
