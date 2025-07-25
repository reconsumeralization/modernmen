'use client'

import Link from 'next/link'

export default function BookingCard({ 
  title, 
  children, 
  buttonText, 
  buttonHref, 
  buttonAction,
  buttonClass = "btn-primary" 
}: {
  title: string
  children: React.ReactNode
  buttonText: string
  buttonHref?: string
  buttonAction?: () => void
  buttonClass?: string
}) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      {children}
      {buttonHref ? (
        <Link 
          href={buttonHref} 
          className={`${buttonClass} w-full justify-center inline-flex`}
        >
          {buttonText}
        </Link>
      ) : (
        <button 
          onClick={buttonAction}
          className={`${buttonClass} w-full justify-center inline-flex`}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}
