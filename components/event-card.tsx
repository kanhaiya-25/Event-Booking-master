import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Event {
  id: string
  title: string
  date: string
  location: string
  category: string
  attendees: number
  capacity: number
  image: string
}

export default function EventCard({ event }: { event: Event }) {
  const attendancePercent = (event.attendees / event.capacity) * 100

  return (
    <Link href={`/events/${event.id}`}>
      <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition cursor-pointer h-full">
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{event.category}</span>
            <span className="text-xs text-muted-foreground">{Math.round(attendancePercent)}% Full</span>
          </div>

          <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {event.attendees} / {event.capacity} attending
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
