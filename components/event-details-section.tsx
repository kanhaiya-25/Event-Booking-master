import { Calendar, MapPin, Users, Share2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Event {
  id: string
  title: string
  date: string
  location: string
  category: string
  description: string
  attendees: number
  capacity: number
  image: string
  organizer: string
}

export default function EventDetailsSection({ event }: { event: Event }) {
  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
        <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
      </div>

      {/* Event Info */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded">
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-4">{event.title}</h1>

        <div className="space-y-3 text-lg text-muted-foreground">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-foreground">{formatDate(event.date)}</p>
              <p className="text-sm">2:00 PM - 6:00 PM</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-foreground">{event.location}</p>
              <p className="text-sm">View on map</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-foreground">{event.attendees} Going</p>
              <p className="text-sm">{event.capacity - event.attendees} spots remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">About Event</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">{event.description}</p>

        <h3 className="font-semibold text-foreground mb-2">Organized by</h3>
        <p className="text-muted-foreground">{event.organizer}</p>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Event Type</p>
          <p className="font-semibold text-foreground">{event.category}</p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Capacity</p>
          <p className="font-semibold text-foreground">{event.capacity} people</p>
        </div>
      </div>
    </div>
  )
}
