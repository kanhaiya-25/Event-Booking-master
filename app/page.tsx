"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarDays, Users, Ticket, ArrowRight } from "lucide-react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import EventCard from "@/components/event-card"
import Footer from "@/components/footer"
import { mockEvents } from "@/lib/mock-data"
import { getCreatedEvents } from "@/lib/event-storage"

export default function Home() {
  const [events, setEvents] = useState(mockEvents)

  useEffect(() => {
    const createdEvents = getCreatedEvents()
    setEvents([...mockEvents, ...createdEvents])
  }, [])

  const upcomingEvents = events.filter((event) => new Date(event.date) > new Date()).slice(0, 6)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />

      {/* Featured Events Section */}
      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Upcoming Events</h2>
            <p className="text-muted-foreground text-lg">Discover amazing events happening near you</p>
          </div>
          <Link
            href="/events"
            className="mt-4 md:mt-0 text-primary hover:text-primary/80 font-semibold flex items-center gap-2"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <CalendarDays className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">500+</h3>
              <p className="text-muted-foreground">Events Hosted</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">50K+</h3>
              <p className="text-muted-foreground">Happy Attendees</p>
            </div>
            <div className="text-center">
              <Ticket className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">100K+</h3>
              <p className="text-muted-foreground">Tickets Sold</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
