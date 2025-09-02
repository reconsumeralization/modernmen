"use client";

import React, { useState, Fragment, useCallback, useEffect } from "react";
import { Button } from "../../../src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Progress } from "../../../src/components/ui/progress";
import { cn } from "../../../src/lib/utils";

// Custom icon components
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Check = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const Loader = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Enhanced interfaces with better typing
interface WizardStepValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<any>;
  validation?: (data: any) => boolean | Promise<boolean> | WizardStepValidationResult | Promise<WizardStepValidationResult>;
  optional?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  estimatedTime?: string;
}

interface FormWizardProps {
  steps: WizardStep[];
  onComplete?: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  onStepChange?: (currentStep: number, previousStep: number) => void;
  initialData?: Record<string, any>;
  className?: string;
  allowSkipOptional?: boolean;
  showStepNumbers?: boolean;
  showProgress?: boolean;
  showEstimatedTime?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  theme?: 'default' | 'modern' | 'minimal';
}

interface FormWizardState {
  currentStep: number;
  formData: Record<string, any>;
  isSubmitting: boolean;
  validationErrors: Record<string, string[]>;
  validationWarnings: Record<string, string[]>;
  isValidating: boolean;
  hasUnsavedChanges: boolean;
}

// Enhanced FormWizard component with better error handling and UX
const FormWizardComponent = ({
  steps,
  onComplete,
  onCancel,
  onStepChange,
  initialData = {},
  className,
  allowSkipOptional = false,
  showStepNumbers = true,
  showProgress = true,
  showEstimatedTime = false,
  autoSave = false,
  autoSaveDelay = 1000,
  theme = 'default',
}: FormWizardProps) => {
  const [state, setState] = useState<FormWizardState>({
    currentStep: 0,
    formData: initialData,
    isSubmitting: false,
    validationErrors: {},
    validationWarnings: {},
    isValidating: false,
    hasUnsavedChanges: false,
  });

  const currentStepData = steps[state.currentStep];
  const progress = ((state.currentStep + 1) / steps.length) * 100;

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !state.hasUnsavedChanges) return;

    const timeoutId = setTimeout(() => {
      // Implement auto-save logic here
      console.log('Auto-saving form data...', state.formData);
      setState(prev => ({ ...prev, hasUnsavedChanges: false }));
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [state.formData, state.hasUnsavedChanges, autoSave, autoSaveDelay]);

  // Enhanced form data update with change tracking
  const updateFormData = useCallback((stepId: string, data: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [stepId]: { ...prev.formData[stepId], ...data }
      },
      hasUnsavedChanges: true,
      validationErrors: {
        ...prev.validationErrors,
        [stepId]: [] // Clear errors when data changes
      }
    }));
  }, []);

  // Enhanced validation with detailed error reporting
  const validateStep = useCallback(async (stepIndex: number): Promise<WizardStepValidationResult> => {
    const step = steps[stepIndex];
    if (!step.validation) {
      return { isValid: true };
    }

    setState(prev => ({ ...prev, isValidating: true }));

    try {
      const result = await step.validation(state.formData[step.id]);
      
      // Handle both boolean and detailed validation results
      if (typeof result === 'boolean') {
        return { isValid: result };
      }
      
      return result;
    } catch (error) {
      console.error(`Validation error for step ${step.id}:`, error);
      return {
        isValid: false,
        errors: ['Validation failed. Please check your input and try again.']
      };
    } finally {
      setState(prev => ({ ...prev, isValidating: false }));
    }
  }, [steps, state.formData]);

  // Enhanced navigation with validation and callbacks
  const handleNext = useCallback(async () => {
    const validationResult = await validateStep(state.currentStep);
    
    setState(prev => ({
      ...prev,
      validationErrors: {
        ...prev.validationErrors,
        [currentStepData.id]: validationResult.errors || []
      },
      validationWarnings: {
        ...prev.validationWarnings,
        [currentStepData.id]: validationResult.warnings || []
      }
    }));

    if (!validationResult.isValid && !allowSkipOptional) {
      return;
    }

    if (state.currentStep < steps.length - 1) {
      const newStep = state.currentStep + 1;
      setState(prev => ({ ...prev, currentStep: newStep }));
      onStepChange?.(newStep, state.currentStep);
    } else {
      await handleSubmit();
    }
  }, [state.currentStep, currentStepData.id, validateStep, allowSkipOptional, onStepChange, steps.length]);

  const handlePrevious = useCallback(() => {
    if (state.currentStep > 0) {
      const newStep = state.currentStep - 1;
      setState(prev => ({ ...prev, currentStep: newStep }));
      onStepChange?.(newStep, state.currentStep);
    }
  }, [state.currentStep, onStepChange]);

  const handleSubmit = useCallback(async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      if (onComplete) {
        await onComplete(state.formData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // You might want to show a toast or error message here
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [onComplete, state.formData]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      const previousStep = state.currentStep;
      setState(prev => ({ ...prev, currentStep: stepIndex }));
      onStepChange?.(stepIndex, previousStep);
    }
  }, [steps.length, state.currentStep, onStepChange]);

  const CurrentStepComponent = currentStepData.component;
  const currentErrors = state.validationErrors[currentStepData.id] || [];
  const currentWarnings = state.validationWarnings[currentStepData.id] || [];

  // Theme-based styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'modern':
        return {
          container: "max-w-5xl mx-auto",
          card: "border-0 shadow-lg bg-gradient-to-br from-white to-gray-50",
          progress: "h-3 rounded-full",
        };
      case 'minimal':
        return {
          container: "max-w-3xl mx-auto",
          card: "border border-gray-200 shadow-sm",
          progress: "h-1",
        };
      default:
        return {
          container: "max-w-4xl mx-auto",
          card: "",
          progress: "",
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={cn(themeClasses.container, className)} role="main" aria-label="Form wizard">
      {/* Progress Header */}
      {showProgress && (
        <Card className={cn("mb-6", themeClasses.card)}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                {currentStepData.icon && (
                  <currentStepData.icon className="w-5 h-5" />
                )}
                {showStepNumbers && `Step ${state.currentStep + 1} of ${steps.length}: `}
                {currentStepData.title}
                {currentStepData.optional && (
                  <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {showEstimatedTime && currentStepData.estimatedTime && (
                  <span className="text-xs text-muted-foreground">
                    ~{currentStepData.estimatedTime}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
                {state.hasUnsavedChanges && autoSave && (
                  <span className="text-xs text-amber-600">Unsaved changes</span>
                )}
              </div>
            </div>
            <Progress value={progress} className={cn("w-full", themeClasses.progress)} />
            {currentStepData.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {currentStepData.description}
              </p>
            )}
          </CardHeader>
        </Card>
      )}

      {/* Enhanced Step Indicators */}
      <div className="flex items-center justify-center mb-6 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <Fragment key={step.id}>
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => goToStep(index)}
                disabled={index > state.currentStep}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  index < state.currentStep
                    ? "bg-primary border-primary text-primary-foreground shadow-md"
                    : index === state.currentStep
                    ? "border-primary text-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-muted-foreground text-muted-foreground hover:border-primary/50",
                  index > state.currentStep && "cursor-not-allowed opacity-50"
                )}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
                aria-current={index === state.currentStep ? "step" : undefined}
              >
                {index < state.currentStep ? (
                  <Check className="w-5 h-5" />
                ) : state.isValidating && index === state.currentStep ? (
                  <Loader className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2 transition-colors duration-200",
                    index < state.currentStep ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          </Fragment>
        ))}
      </div>

      {/* Error and Warning Messages */}
      {(currentErrors.length > 0 || currentWarnings.length > 0) && (
        <Card className="mb-6 border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            {currentErrors.length > 0 && (
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-destructive mb-1">
                    Please fix the following errors:
                  </h4>
                  <ul className="text-sm text-destructive space-y-1">
                    {currentErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {currentWarnings.length > 0 && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-600 mb-1">
                    Warnings:
                  </h4>
                  <ul className="text-sm text-amber-600 space-y-1">
                    {currentWarnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step Content */}
      <Card className={themeClasses.card}>
        <CardContent className="p-6">
          <CurrentStepComponent
            data={state.formData[currentStepData.id] || {}}
            onChange={(data: any) => updateFormData(currentStepData.id, data)}
            formData={state.formData}
            errors={currentErrors}
            warnings={currentWarnings}
            isValidating={state.isValidating}
          />
        </CardContent>
      </Card>

      {/* Enhanced Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={state.currentStep === 0 ? (onCancel || (() => {})) : handlePrevious}
          disabled={state.isSubmitting || state.isValidating}
          className="min-w-[100px]"
        >
          {state.currentStep === 0 ? (
            "Cancel"
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </>
          )}
        </Button>

        <div className="flex items-center gap-2">
          {allowSkipOptional && currentStepData.optional && (
            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={state.isSubmitting || state.isValidating}
            >
              Skip
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={state.isSubmitting || state.isValidating}
            className="min-w-[120px]"
          >
            {state.isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2" />
                Submitting...
              </>
            ) : state.isValidating ? (
              <>
                <Loader className="w-4 h-4 mr-2" />
                Validating...
              </>
            ) : state.currentStep === steps.length - 1 ? (
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
    </div>
  );
};

// Export the component with enhanced type safety
export const FormWizard = FormWizardComponent as React.ComponentType<FormWizardProps>;

// Enhanced hook with additional utilities
export function useFormWizard(initialData: Record<string, any> = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isValidating, setIsValidating] = useState(false);

  const next = useCallback(() => setCurrentStep(prev => prev + 1), []);
  const previous = useCallback(() => setCurrentStep(prev => Math.max(0, prev - 1)), []);
  const goToStep = useCallback((step: number) => setCurrentStep(step), []);

  const updateData = useCallback((stepId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data }
    }));
    // Clear errors when data is updated
    setErrors(prev => ({
      ...prev,
      [stepId]: []
    }));
  }, []);

  const setStepError = useCallback((stepId: string, errorMessages: string[]) => {
    setErrors(prev => ({
      ...prev,
      [stepId]: errorMessages
    }));
  }, []);

  const clearErrors = useCallback((stepId?: string) => {
    if (stepId) {
      setErrors(prev => ({
        ...prev,
        [stepId]: []
      }));
    } else {
      setErrors({});
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialData);
    setErrors({});
    setIsValidating(false);
  }, [initialData]);

  return {
    currentStep,
    formData,
    errors,
    isValidating,
    next,
    previous,
    goToStep,
    updateData,
    setFormData,
    setStepError,
    clearErrors,
    setIsValidating,
    reset,
  };
}

// Utility function for creating wizard steps
export function createWizardStep(config: Omit<WizardStep, 'id'> & { id?: string }): WizardStep {
  return {
    id: config.id || config.title.toLowerCase().replace(/\s+/g, '-'),
    ...config,
  };
}

// Type exports for better developer experience
export type {
  WizardStep,
  WizardStepValidationResult,
  FormWizardProps,
  FormWizardState,
};
