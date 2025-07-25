'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      {...props}
    />
  )
}
