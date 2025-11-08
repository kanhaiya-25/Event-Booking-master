"use client"

import Link from "next/link"
import { useState } from "react"
import { mockEvents } from "@/lib/mock-data"
import { getCreatedEvents, updateEventAttendees } from "@/lib/event-storage"
import { deleteRegistration } from "@/lib/registration-storage"
import { formatDate } from "@/lib/utils"
import { Calendar, MapPin, Ticket, Trash2 } from "lucide-react"
import { useUser } from "@/lib/user-context"

interface MyEventsSectionProps {
  registrations: any[]
}

export default function MyEventsSection({ registrations }: MyEventsSectionProps) {
  const [registrationsList, setRegistrationsList] = useState(registrations)
  const { session } = useUser()

  const handleDeleteRegistration = (eventId: string, eventTitle: string, ticketCount: number) => {
    if (confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
      updateEventAttendees(eventId, -ticketCount)

      deleteRegistration(eventId)
      setRegistrationsList(registrationsList.filter((r) => r.eventId !== eventId))
    }
  }

  if (registrationsList.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">No Registrations Yet</h2>
        <p className="text-muted-foreground mb-6">Start exploring events and register for ones you're interested in</p>
        <Link
          href="/events"
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
        >
          Browse Events
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Registrations</h2>
      <div className="space-y-4">
        {registrationsList.map((reg, i) => {
          const event = mockEvents.find((e) => e.id === reg.eventId)
          const createdEvent = getCreatedEvents().find((e) => e.id === reg.eventId)
          const eventData = event || createdEvent
          if (!eventData) return null

          return (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex-1">
                <Link
                  href={`/events/${eventData.id}`}
                  className="font-bold text-lg text-foreground hover:text-primary transition mb-2 block"
                >
                  {eventData.title}
                </Link>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(eventData.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {eventData.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 md:ml-auto">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Tickets</p>
                  <p className="flex items-center gap-1 font-bold text-foreground">
                    <Ticket className="w-4 h-4" />
                    {reg.ticketCount}
                  </p>
                </div>
                <Link
                  href={`/events/${eventData.id}`}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition font-semibold text-sm whitespace-nowrap"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDeleteRegistration(eventData.id, eventData.title, reg.ticketCount)}
                  className="bg-destructive/10 text-destructive hover:bg-destructive/20 px-4 py-2 rounded-lg transition font-semibold text-sm whitespace-nowrap flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
