'use client'

import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'

interface StripeProviderProps {
  children: React.ReactNode
  options?: {
    appearance?: any
    fonts?: any[]
  }
}

export function StripeProvider({ children, options }: StripeProviderProps) {
  const stripe = getStripe()

  const defaultOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: 'hsl(var(--primary))',
        colorBackground: 'hsl(var(--background))',
        colorText: 'hsl(var(--foreground))',
        colorDanger: 'hsl(var(--destructive))',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '6px',
      },
      rules: {
        '.Input': {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        '.Input:focus': {
          borderColor: 'hsl(var(--primary))',
          boxShadow: '0 0 0 1px hsl(var(--primary))',
        },
      },
    },
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Inter:400,500,600',
      },
    ],

    ...options,
  }

  return (
    <Elements stripe={stripe} options={defaultOptions}>
      {children}
    </Elements>
  )
}
