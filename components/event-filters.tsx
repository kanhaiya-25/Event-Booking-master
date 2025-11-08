"use client"

import { Search } from "lucide-react"

interface EventFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  categoryFilter: string
  onCategoryChange: (category: string) => void
  dateFilter: string
  onDateChange: (date: string) => void
}

export default function EventFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  dateFilter,
  onDateChange,
}: EventFiltersProps) {
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "conference", label: "Conference" },
    { value: "concert", label: "Concert" },
    { value: "workshop", label: "Workshop" },
    { value: "meetup", label: "Meetup" },
    { value: "sports", label: "Sports" },
  ]

  const dateOptions = [
    { value: "all", label: "All Dates" },
    { value: "upcoming", label: "Upcoming" },
    { value: "this-week", label: "This Week" },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
      <h3 className="font-bold text-foreground mb-6">Filters</h3>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Event or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground mb-2">Date</label>
        <select
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {dateOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
