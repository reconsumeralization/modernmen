// Mock appointments data
export const mockRecentAppointments = [
  {
    id: "1",
    customerName: "John Smith",
    service: "Classic Haircut",
    time: new Date().toISOString(),
    duration: 30,
    status: "confirmed" as const,
    barber: "Mike Johnson",
  },
  {
    id: "2",
    customerName: "David Wilson",
    service: "Beard Grooming",
    time: new Date(Date.now() + 3600000).toISOString(),
    duration: 25,
    status: "pending" as const,
    barber: "Sarah Davis",
  },
  {
    id: "3",
    customerName: "Robert Brown",
    service: "Hair & Beard Combo",
    time: new Date(Date.now() + 7200000).toISOString(),
    duration: 55,
    status: "confirmed" as const,
    barber: "Mike Johnson",
  },
]
