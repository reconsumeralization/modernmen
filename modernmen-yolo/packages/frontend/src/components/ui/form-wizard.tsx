
"use client";

import React, { useState, Fragment } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";

import { cn } from "../../lib/utils";

// Custom icon components
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const Check = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

interface WizardStep {
  id: string
  title: string
  description?: string
  component: React.ComponentType<any>
  validation?: (data: any) => boolean | Promise<boolean>
}

interface FormWizardProps {
  steps: WizardStep[]
  onComplete?: (data: Record<string, any>) => void | Promise<void>
  onCancel?: () => void
  initialData?: Record<string, any>
  className?: string
}

// Type assertion to bypass serialization check for client components
const FormWizardComponent = ({
  steps,
  onComplete,
  onCancel,
  initialData = {},
  className,
}: FormWizardProps) => {

  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const updateFormData = (stepId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data }
    }))
  }

  const handleNext = async () => {
    if (currentStepData.validation) {
      const isValid = await currentStepData.validation(formData[currentStepData.id])
      if (!isValid) return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (onComplete) {
        await onComplete(formData)
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = currentStepData.component

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {/* Progress Header */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">
              Step {currentStep + 1} of {steps.length}: {currentStepData.title}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
          {currentStepData.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {currentStepData.description}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Step Indicators */}
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                    ? "border-primary text-primary"
                    : "border-muted-foreground text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2 transition-colors",
                    index < currentStep ? "bg-primary" : "bg-muted-foreground"
                  )}
                />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <CurrentStepComponent
            data={formData[currentStepData.id] || {}}
            onChange={(data: any) => updateFormData(currentStepData.id, data)}
            formData={formData}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? (onCancel || (() => {})) : handlePrevious}
          disabled={isSubmitting}
        >
          {currentStep === 0 ? (
            "Cancel"
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </>
          )}
        </Button>

        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : currentStep === steps.length - 1 ? (
            "Complete"
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Export the component with type assertion to bypass serialization check
export const FormWizard = FormWizardComponent as React.ComponentType<Omit<FormWizardProps, 'onComplete' | 'onCancel'> & {
  onComplete?: (data: Record<string, any>) => void | Promise<void>
  onCancel?: () => void
}>

// Hook for using form wizard
export function useFormWizard(initialData: Record<string, any> = {}) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState(initialData)

  const next = () => setCurrentStep(prev => prev + 1)
  const previous = () => setCurrentStep(prev => Math.max(0, prev - 1))
  const goToStep = (step: number) => setCurrentStep(step)

  const updateData = (stepId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data }
    }))
  }

  return {
    currentStep,
    formData,
    next,
    previous,
    goToStep,
    updateData,
    setFormData,
  }
}
