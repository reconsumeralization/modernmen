'use client'

import { Suspense } from 'react'
import SuccessContent from './SuccessContent'

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
