"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { createEvent } from "@/lib/event-storage"
import { useUser } from "@/lib/user-context"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

const EVENT_TYPES = [
  { value: "workshop", label: "Workshop", description: "Educational/training event" },
  { value: "meetup", label: "Meetup", description: "Community gathering" },
  { value: "webinar", label: "Webinar", description: "Online event" },
  { value: "conference", label: "Conference", description: "Large professional event" },
  { value: "concert", label: "Concert", description: "Music performance" },
  { value: "sports", label: "Sports", description: "Sports event" },
]

export default function CreateEventPage() {
  const router = useRouter()
  const { session } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    category: "workshop",
    date: "",
    location: "",
    description: "",
    capacity: "100",
    image: "/community-event.png",
  })

  if (!session) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <Link href="/events" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">You must be signed in to create an event</p>
            <Link
              href="/auth/login"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
            >
              Sign In
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!formData.title.trim()) {
        setError("Event title is required")
        setIsLoading(false)
        return
      }

      if (!formData.date) {
        setError("Event date is required")
        setIsLoading(false)
        return
      }

      if (!formData.location.trim()) {
        setError("Event location is required")
        setIsLoading(false)
        return
      }

      if (!formData.description.trim()) {
        setError("Event description is required")
        setIsLoading(false)
        return
      }

      const capacity = Number.parseInt(formData.capacity)
      if (isNaN(capacity) || capacity < 1) {
        setError("Capacity must be at least 1")
        setIsLoading(false)
        return
      }

      createEvent({
        title: formData.title,
        date: formData.date,
        location: formData.location,
        category: formData.category as "workshop" | "meetup" | "webinar" | "conference" | "concert" | "sports",
        description: formData.description,
        attendees: 0,
        capacity,
        image: formData.image,
        organizer: `${session.firstName} ${session.lastName}`,
        createdBy: session.userId,
      })

      router.push("/events?created=true")
    } catch (err) {
      setError("Failed to create event. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-8 px-4 md:px-6 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link href="/events" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Create an Event</h1>
          <p className="text-muted-foreground">Share your event with our community</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Event Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, category: type.value }))}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    formData.category === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold text-foreground">{type.label}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State or Online"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event in detail"
              rows={6}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Event Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              placeholder="Maximum number of attendees"
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Event..." : "Create Event"}
          </button>
        </form>
      </div>

      <Footer />
    </main>
  )
}
