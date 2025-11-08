interface CreatedEvent {
  id: string
  title: string
  date: string
  location: string
  category: "workshop" | "meetup" | "webinar" | "conference" | "concert" | "sports"
  description: string
  attendees: number
  capacity: number
  image: string
  organizer: string
  createdBy: string
  createdAt: string
}

const EVENTS_STORAGE_KEY = "event_created_events"

export function getCreatedEvents(): CreatedEvent[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(EVENTS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function createEvent(event: Omit<CreatedEvent, "id" | "createdAt">): CreatedEvent {
  if (typeof window === "undefined") throw new Error("Not in browser")

  const newEvent: CreatedEvent = {
    ...event,
    id: `event_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const events = getCreatedEvents()
  events.push(newEvent)
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))

  return newEvent
}

export function deleteEvent(eventId: string): boolean {
  if (typeof window === "undefined") return false

  const events = getCreatedEvents()
  const filtered = events.filter((e) => e.id !== eventId)

  if (filtered.length === events.length) return false

  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filtered))
  return true
}

export function getEventsByOrganizer(userId: string): CreatedEvent[] {
  const events = getCreatedEvents()
  return events.filter((e) => e.createdBy === userId)
}

export function updateEventAttendees(eventId: string, ticketCount: number): boolean {
  if (typeof window === "undefined") return false

  const events = getCreatedEvents()
  const event = events.find((e) => e.id === eventId)

  if (!event) return false

  event.attendees += ticketCount
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
  return true
}

export function getEventById(eventId: string): CreatedEvent | undefined {
  const events = getCreatedEvents()
  return events.find((e) => e.id === eventId)
}
