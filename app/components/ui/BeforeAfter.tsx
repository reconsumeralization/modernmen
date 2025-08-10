'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BeforeAfterProps {
  beforeSrc: string
  afterSrc: string
  alt: string
}

export default function BeforeAfter({ beforeSrc, afterSrc, alt }: BeforeAfterProps) {
  const [position, setPosition] = useState(50)

  return (
    <div className="relative w-full max-w-3xl mx-auto select-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded">
        <Image src={beforeSrc} alt={`${alt} before`} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image src={afterSrc} alt={`${alt} after`} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        </div>
        <div
          className="absolute top-0 bottom-0"
          style={{ left: `${position}%` }}
        >
          <div className="w-0.5 h-full bg-white/80" />
          <div className="absolute top-1/2 -translate-y-1/2 -ml-3 px-2 py-1 text-xs bg-white text-black">Drag</div>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="w-full mt-3"
        aria-label="Compare before and after"
      />
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Before</span>
        <span>After</span>
      </div>
    </div>
  )
}


