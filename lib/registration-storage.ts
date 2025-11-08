interface Registration {
  eventId: string
  eventTitle: string
  ticketCount: number
  registrationDate: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dietaryPreferences?: string
  specialRequests?: string
}

const STORAGE_KEY = "event_registrations"

export function getRegistrations(): Registration[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveRegistration(registration: Registration): void {
  if (typeof window === "undefined") return

  const registrations = getRegistrations()

  // Check if already registered for this event
  const existingIndex = registrations.findIndex((r) => r.eventId === registration.eventId)

  if (existingIndex >= 0) {
    registrations[existingIndex].ticketCount += registration.ticketCount
  } else {
    registrations.push(registration)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations))
}

export function deleteRegistration(eventId: string): boolean {
  if (typeof window === "undefined") return false

  const registrations = getRegistrations()
  const filtered = registrations.filter((r) => r.eventId !== eventId)

  if (filtered.length === registrations.length) return false

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}
