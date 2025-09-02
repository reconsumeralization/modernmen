"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  User,

  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Home,
  Phone,
  MapPin,
  Clock,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

// User flow types
export type UserFlow = "booking" | "onboarding" | "support" | "loyalty"

// Flow step interface
interface FlowStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  component?: React.ComponentType<any>
  validation?: (data: any) => boolean
  required?: boolean
  skippable?: boolean
}

// Booking flow steps
const bookingFlowSteps: FlowStep[] = [
  {
    id: "service",
    title: "Choose Service",
    description: "Select the service you want",
    icon: () => (
      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">M</span>
      </div>
    ),
    required: true
  },
  {
    id: "barber",
    title: "Select Barber",
    description: "Choose your preferred barber",
    icon: User,
    required: true
  },
  {
    id: "datetime",
    title: "Pick Date & Time",
    description: "Select your preferred date and time",
    icon: Calendar,
    required: true
  },
  {
    id: "confirm",
    title: "Confirm Booking",
    description: "Review and confirm your appointment",
    icon: CheckCircle,
    required: true
  }
]

// Onboarding flow steps
const onboardingFlowSteps: FlowStep[] = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Get started with Modern Men",
    icon: Home,
    required: true
  },
  {
    id: "profile",
    title: "Your Profile",
    description: "Tell us about yourself",
    icon: User,
    required: true
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Set your grooming preferences",
    icon: Star,
    skippable: true
  },
  {
    id: "complete",
    title: "You're All Set",
    description: "Ready to book your first appointment",
    icon: CheckCircle,
    required: true
  }
]

// Support flow steps
const supportFlowSteps: FlowStep[] = [
  {
    id: "issue",
    title: "Describe Issue",
    description: "Tell us what's happening",
    icon: Phone,
    required: true
  },
  {
    id: "details",
    title: "More Details",
    description: "Provide additional information",
    icon: MapPin,
    required: true
  },
  {
    id: "contact",
    title: "Contact Method",
    description: "How would you like us to help?",
    icon: Clock,
    required: true
  }
]

// Loyalty flow steps
const loyaltyFlowSteps: FlowStep[] = [
  {
    id: "status",
    title: "Your Status",
    description: "Check your current loyalty status",
    icon: Star,
    required: true
  },
  {
    id: "benefits",
    title: "Available Benefits",
    description: "See what you can redeem",
    icon: CreditCard,
    required: true
  },
  {
    id: "redeem",
    title: "Redeem Reward",
    description: "Choose your reward",
    icon: CheckCircle,
    skippable: true
  }
]

interface UserFlowProps {
  type: UserFlow
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: (data: Record<string, any>) => void
  onCancel?: () => void
  data?: Record<string, any>
  className?: string
}

export function UserFlow({
  type,
  currentStep,
  onStepChange,
  onComplete,
  onCancel,
  data = {},
  className
}: UserFlowProps) {
  const router = useRouter()

  const getFlowSteps = () => {
    switch (type) {
      case "booking":
        return bookingFlowSteps
      case "onboarding":
        return onboardingFlowSteps
      case "support":
        return supportFlowSteps
      case "loyalty":
        return loyaltyFlowSteps
      default:
        return []
    }
  }

  const steps = getFlowSteps()
  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1)
    } else {
      onComplete(data)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  if (!currentStepData) return null

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {/* Progress Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-xl">
                {currentStepData.title}
              </CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {steps.length}: {currentStepData.description}
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Step Indicators */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-2 text-center max-w-20",
                  isCurrent ? "text-blue-600 font-medium" : "text-gray-500"
                )}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2 mt-[-20px] transition-colors",
                    index < currentStep ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <StepContent
            step={currentStepData}
            data={data[currentStepData.id]}
            onDataChange={(newData) => {
              // This would typically update the parent component's state
              console.log("Step data changed:", currentStepData.id, newData)
            }}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? (
            "Complete"
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Step content renderer
interface StepContentProps {
  step: FlowStep
  data?: any
  onDataChange: (data: any) => void
}

function StepContent({ step, data, onDataChange }: StepContentProps) {
  const Icon = step.icon

  // Default content for each step type
  const renderDefaultContent = () => {
    switch (step.id) {
      case "service":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Haircut", price: "$35", duration: "30 min" },
                { name: "Beard Grooming", price: "$25", duration: "25 min" },
                { name: "Hair & Beard Combo", price: "$55", duration: "55 min" }
              ].map((service) => (
                <Card key={service.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                    <p className="text-lg font-bold text-green-600">{service.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "barber":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Mike Johnson", specialty: "Classic Cuts", rating: 4.8 },
                { name: "Sarah Davis", specialty: "Modern Styles", rating: 4.9 },
                { name: "Alex Rodriguez", specialty: "Color Specialist", rating: 4.7 }
              ].map((barber) => (
                <Card key={barber.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">{barber.name}</h4>
                        <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{barber.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "datetime":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">Calendar component would go here</p>
            </div>
          </div>
        )

      case "confirm":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium mb-4">Booking Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">Classic Haircut</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Barber:</span>
                    <span className="font-medium">Mike Johnson</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="font-medium">Dec 15, 2024 at 2:00 PM</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>$35.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon className="w-8 h-8 text-gray-500" />
              <div>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-muted-foreground">Step content goes here</p>
            </div>
          </div>
        )
    }
  }

  return renderDefaultContent()
}

// Hook for managing user flows
export function useUserFlow(type: UserFlow) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [flowData, setFlowData] = React.useState<Record<string, any>>({})
  const [isCompleted, setIsCompleted] = React.useState(false)

  const getSteps = () => {
    switch (type) {
      case "booking":
        return bookingFlowSteps
      case "onboarding":
        return onboardingFlowSteps
      case "support":
        return supportFlowSteps
      case "loyalty":
        return loyaltyFlowSteps
      default:
        return []
    }
  }

  const steps = getSteps()

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const previous = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step)
    }
  }

  const updateData = (stepId: string, data: any) => {
    setFlowData(prev => ({
      ...prev,
      [stepId]: data
    }))
  }

  const complete = () => {
    setIsCompleted(true)
  }

  const reset = () => {
    setCurrentStep(0)
    setFlowData({})
    setIsCompleted(false)
  }

  return {
    currentStep,
    steps,
    flowData,
    isCompleted,
    progress: ((currentStep + 1) / steps.length) * 100,
    next,
    previous,
    goToStep,
    updateData,
    complete,
    reset
  }
}
