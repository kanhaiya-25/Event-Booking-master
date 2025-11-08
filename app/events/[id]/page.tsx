"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import EventDetailsSection from "@/components/event-details-section"
import RegistrationCard from "@/components/registration-card"
import { mockEvents } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"

export default function EventDetailsPage() {
  const params = useParams()
  const eventId = params.id as string
  const event = mockEvents.find((e) => e.id === eventId)

  if (!event) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <Link href="/events" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
            <p className="text-muted-foreground">Sorry, we couldn't find the event you're looking for.</p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Link href="/events" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventDetailsSection event={event} />
          </div>
          <div className="lg:col-span-1">
            <RegistrationCard event={event} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
