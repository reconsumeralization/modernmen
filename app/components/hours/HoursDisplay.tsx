'use client'

interface HoursDisplayProps {
  hours: Array<{
    day: string
    time: string
  }>
}

export default function HoursDisplay({ hours }: HoursDisplayProps) {
  return (
    <div className="space-y-4">
      {hours.map((schedule) => (
        <div key={schedule.day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-900">{schedule.day}</span>
          <span className={`${schedule.time === 'Closed' ? 'text-red-500' : 'text-gray-600'}`}>
            {schedule.time}
          </span>
        </div>
      ))}
    </div>
  )
}
