'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
      <div className="flex items-center">
        <div className="bg-gray-900 text-white px-3 py-2 rounded-md mr-3">
          <span className="font-bold text-lg">MM</span>
        </div>
        <div className="text-left">
          <div className="font-bold text-gray-900 text-lg leading-tight">Modern Men</div>
          <div className="text-sm text-gray-500 leading-tight">Hair Salon</div>
        </div>
      </div>
    </Link>
  )
}
