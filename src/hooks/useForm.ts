'use client';

import { useState, useCallback, useEffect } from 'react';

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface FormActions<T> {
  setValue: (field: keyof T, value: any) => void;
  setMultipleValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setMultipleErrors: (errors: Partial<Record<keyof T, string>>) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  setTouched: (field: keyof T, touched?: boolean) => void;
  setTouchedAll: (touched?: boolean) => void;
  reset: (initialValues?: T) => void;
  validate: () => boolean;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e: React.FormEvent) => Promise<void>;
}

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true
}: UseFormOptions<T>): FormState<T> & FormActions<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  // Check if form is dirty (has changes)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  // Set single field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Mark field as touched
    setTouchedState(prev => ({ ...prev, [field]: true }));

    // Validate on change if enabled
    if (validateOnChange && validationSchema) {
      const newValues = { ...values, [field]: value };
      const validationErrors = validationSchema(newValues);
      if (validationErrors[field]) {
        setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
      }
    }
  }, [values, errors, validateOnChange, validationSchema]);

  // Set multiple field values
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));

    // Mark fields as touched
    const touchedFields = Object.keys(newValues).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);

    setTouchedState(prev => ({ ...prev, ...touchedFields }));

    // Validate if enabled
    if (validateOnChange && validationSchema) {
      const updatedValues = { ...values, ...newValues };
      const validationErrors = validationSchema(updatedValues);
      setErrors(prev => ({ ...prev, ...validationErrors }));
    }
  }, [values, validateOnChange, validationSchema]);

  // Set single field error
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  // Set multiple field errors
  const setMultipleErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  // Clear single field error
  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Set single field touched state
  const setTouched = useCallback((field: keyof T, touchedValue = true) => {
    setTouchedState(prev => ({ ...prev, [field]: touchedValue }));

    // Validate on blur if enabled
    if (validateOnBlur && validationSchema && touchedValue) {
      const validationErrors = validationSchema(values);
      if (validationErrors[field]) {
        setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
      }
    }
  }, [values, validateOnBlur, validationSchema]);

  // Set all fields touched state
  const setTouchedAll = useCallback((touchedValue = true) => {
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = touchedValue;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);

    setTouchedState(allTouched);

    // Validate all fields if enabled
    if (validateOnBlur && validationSchema) {
      const validationErrors = validationSchema(values);
      setErrors(validationErrors);
    }
  }, [values, validateOnBlur, validationSchema]);

  // Reset form
  const reset = useCallback((newInitialValues?: T) => {
    setValues(newInitialValues || initialValues);
    setErrors({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Validate form
  const validate = useCallback(() => {
    if (!validationSchema) return true;

    const validationErrors = validationSchema(values);
    setErrors(validationErrors);

    // Mark all fields as touched
    setTouchedAll(true);

    return Object.keys(validationErrors).length === 0;
  }, [values, validationSchema, setTouchedAll]);

  // Handle form submission
  const handleSubmit = useCallback(
    (submitHandler: (values: T) => Promise<void> | void) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouchedAll(true);

        // Validate form
        if (!validate()) {
          return;
        }

        setIsSubmitting(true);

        try {
          await submitHandler(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      },
    [values, validate, setTouchedAll]
  );

  // Re-validate when values change (if validation schema exists)
  useEffect(() => {
    if (validationSchema && validateOnChange) {
      const validationErrors = validationSchema(values);
      setErrors(prev => {
        // Only update errors for touched fields
        const newErrors = { ...prev };
        Object.keys(validationErrors).forEach(key => {
          if (touched[key as keyof T]) {
            newErrors[key as keyof T] = validationErrors[key as keyof T];
          }
        });
        return newErrors;
      });
    }
  }, [values, validationSchema, validateOnChange, touched]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,

    // Actions
    setValue,
    setMultipleValues,
    setError,
    setMultipleErrors,
    clearError,
    clearErrors,
    setTouched,
    setTouchedAll,
    reset,
    validate,
    handleSubmit
  };
}

// Common validation helpers
export const validators = {
  required: (value: any, message = 'This field is required') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return '';
  },

  email: (value: string, message = 'Please enter a valid email') => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return '';
  },

  phone: (value: string, message = 'Please enter a valid phone number') => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return message;
    }
    return '';
  },

  minLength: (min: number, message?: string) => (value: string) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return '';
  },

  maxLength: (max: number, message?: string) => (value: string) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return '';
  },

  numeric: (value: any, message = 'Must be a number') => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return '';
  },

  min: (min: number, message?: string) => (value: number) => {
    if (value < min) {
      return message || `Must be at least ${min}`;
    }
    return '';
  },

  max: (max: number, message?: string) => (value: number) => {
    if (value > max) {
      return message || `Must be no more than ${max}`;
    }
    return '';
  }
};
