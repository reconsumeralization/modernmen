// Mock notifications data
export const mockNotifications = [
  {
    id: "1",
    title: "New Customer Registration",
    message: "John Smith has created an account",
    type: "info" as const,
    timestamp: new Date(Date.now() - 300000),
    read: false,
  },
  {
    id: "2",
    title: "Appointment Cancelled",
    message: "David Wilson's 2:00 PM appointment was cancelled",
    type: "warning" as const,
    timestamp: new Date(Date.now() - 900000),
    read: false,
  },
  {
    id: "3",
    title: "Payment Received",
    message: "$35 payment received from Robert Brown",
    type: "success" as const,
    timestamp: new Date(Date.now() - 1800000),
    read: true,
  },
]
