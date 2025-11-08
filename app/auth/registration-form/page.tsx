"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useUser } from "@/lib/user-context"
import { updateUser } from "@/lib/auth-storage"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function EventRegistrationFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { session } = useUser()
  const eventId = searchParams.get("eventId")

  const [formData, setFormData] = useState({
    dietaryPreferences: "",
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/auth/login")
    }
  }, [session, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setIsSubmitting(true)
    setErrorMessage("")

    try {
      updateUser(session.userId, {
        dietaryPreferences: formData.dietaryPreferences,
      })
      setSuccessMessage("Registration details saved successfully!")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setErrorMessage("Failed to save registration details")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 px-4 md:px-6 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Complete Your Registration</h1>
          <p className="text-muted-foreground">Help us make your event experience better</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
        {successMessage && (
          <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20 mb-6">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20 mb-6">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Dietary Preferences</label>
            <textarea
              name="dietaryPreferences"
              value={formData.dietaryPreferences}
              onChange={handleChange}
              placeholder="e.g., Vegetarian, Vegan, Gluten-free, Nut allergies, etc."
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">This helps us prepare better catering options</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Special Requests</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any accommodations or requests we should know about?"
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Emergency Contact Phone</label>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Complete Registration"}
          </button>
        </form>
      </div>

      <Footer />
    </main>
  )
}
