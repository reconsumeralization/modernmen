'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const EnhancedChatBot = dynamic(() => import('./EnhancedChatBot'), { ssr: false })

export default function ChatLauncher() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 shadow-2xl rounded-lg overflow-hidden border border-gray-200 bg-white w-[360px] h-[520px]">
          <EnhancedChatBot />
        </div>
      )}
      <button
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen(!open)}
        className="rounded-full bg-brand-red text-white w-14 h-14 flex items-center justify-center shadow-lg hover:opacity-90"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M1.5 12C1.5 6.201 6.201 1.5 12 1.5S22.5 6.201 22.5 12 17.799 22.5 12 22.5a10.94 10.94 0 01-4.813-1.095c-.335-.157-.502-.235-.585-.265a2.25 2.25 0 00-.2-.058c-.092-.02-.193-.02-.395-.02-.37 0-.554 0-.704-.01a1.5 1.5 0 01-1.43-1.43c-.01-.15-.01-.334-.01-.704 0-.202 0-.303-.02-.395a2.25 2.25 0 00-.058-.2c-.03-.083-.108-.25-.265-.585A10.94 10.94 0 011.5 12z" />
          </svg>
        )}
      </button>
    </div>
  )
}


