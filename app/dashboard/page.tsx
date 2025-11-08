"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import DashboardStats from "@/components/dashboard-stats"
import MyEventsSection from "@/components/my-events-section"
import { getRegistrations } from "@/lib/registration-storage"

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState([])

  useEffect(() => {
    const savedRegistrations = getRegistrations()
    setRegistrations(savedRegistrations)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 px-4 md:px-6 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your event registrations and bookings</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <DashboardStats registrations={registrations} />
        <MyEventsSection registrations={registrations} />
      </div>

      <Footer />
    </main>
  )
}
