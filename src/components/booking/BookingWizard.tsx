'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { BookingFormSkeleton } from '@/components/ui/loading'

// Lazy load booking components
const BookingPage = dynamic(() => import('@/app/portal/book/page'), {
  loading: () => <BookingFormSkeleton />
})

const ServicePreview = dynamic(() => import('@/components/booking/ServicePreview'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-64" />
})

const BookingTips = dynamic(() => import('@/components/booking/BookingTips'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />
})

export function BookingWizard() {
  return (
    <Suspense fallback={<BookingFormSkeleton />}>
      <BookingPage />
    </Suspense>
  )
}

export { ServicePreview, BookingTips }
