// Mock appointments data
export const mockRecentAppointments = [
  {
    id: "1",
    customer: "John Smith",
    service: "Classic Haircut",
    date: new Date().toISOString().split('T')[0],
    time: "14:30",
    status: "confirmed" as const,
  },
  {
    id: "2",
    customer: "David Wilson",
    service: "Beard Grooming",
    date: new Date().toISOString().split('T')[0],
    time: "15:30",
    status: "pending" as const,
  },
  {
    id: "3",
    customer: "Robert Brown",
    service: "Hair & Beard Combo",
    date: new Date().toISOString().split('T')[0],
    time: "16:30",
    status: "confirmed" as const,
  },
]
