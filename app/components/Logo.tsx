'use client'

import Image from 'next/image'

export default function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <div className="flex items-center">
      <Image 
        src="/images/logo.png" 
        alt="Modern Men Hair Salon Logo" 
        width={200} 
        height={60} 
        className={className}
        priority
      />
    </div>
  )
}
