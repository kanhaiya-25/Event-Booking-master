import Link from "next/link"
import { Search } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-24 px-4 md:px-6 bg-gradient-to-b from-primary/10 to-background">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Discover Events That Move You
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-balance">
          Find concerts, conferences, workshops, and more in your area
        </p>

        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto justify-center">
          <Link
            href="/events"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition font-semibold"
          >
            <Search className="w-5 h-5" />
            Browse All Events
          </Link>
          <Link
            href="/create-event"
            className="flex items-center justify-center px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary/5 transition font-semibold"
          >
            Create an Event
          </Link>
        </div>
      </div>
    </section>
  )
}
