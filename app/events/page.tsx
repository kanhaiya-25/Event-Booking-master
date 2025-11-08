"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import EventCard from "@/components/event-card"
import EventFilters from "@/components/event-filters"
import { mockEvents } from "@/lib/mock-data"
import { getCreatedEvents } from "@/lib/event-storage"

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [allEvents, setAllEvents] = useState(mockEvents)
  const [showCreated, setShowCreated] = useState(false)

  useEffect(() => {
    const createdEvents = getCreatedEvents()
    setAllEvents([...mockEvents, ...createdEvents])

    // Show notification if event was just created
    const params = new URLSearchParams(window.location.search)
    if (params.get("created") === "true") {
      setShowCreated(true)
      setTimeout(() => setShowCreated(false), 5000)
    }
  }, [])

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const eventDate = new Date(event.date)
      const today = new Date()
      if (dateFilter === "upcoming") {
        matchesDate = eventDate > today
      } else if (dateFilter === "this-week") {
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        matchesDate = eventDate > today && eventDate <= nextWeek
      }
    }

    return matchesSearch && matchesCategory && matchesDate
  })

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {showCreated && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-700 px-4 md:px-6 py-4 max-w-7xl mx-auto mx-4 md:mx-6 rounded-lg mt-4">
          <p className="font-semibold">Event created successfully! Check it out in the list below.</p>
        </div>
      )}

      <section className="py-12 px-4 md:px-6 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Browse Events</h1>
          <p className="text-muted-foreground">Find and register for events that interest you</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <EventFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
            />
          </aside>

          <div className="flex-1">
            <div className="mb-6 text-sm text-muted-foreground">
              Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No events found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
