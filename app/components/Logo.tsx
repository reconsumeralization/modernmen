'use client'

import Image from 'next/image'

export default function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-2">
        <div className="text-white font-bold text-2xl">
          <span className="text-3xl">MM</span>
        </div>
        <div className="text-white">
          <div className="font-bold text-lg leading-tight">MODERN MEN</div>
          <div className="text-salon-gold text-sm font-medium">HAIR SALON</div>
        </div>
      </div>
    </div>
  )
}
