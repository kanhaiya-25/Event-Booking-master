"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { saveRegistration } from "@/lib/registration-storage"
import { updateEventAttendees } from "@/lib/event-storage"
import { AlertCircle } from "lucide-react"

interface RegistrationConfirmDialogProps {
  event: { id: string; title: string; attendees: number; capacity: number }
  ticketCount: number
  onComplete: (completed: boolean) => void
}

export default function RegistrationConfirmDialog({ event, ticketCount, onComplete }: RegistrationConfirmDialogProps) {
  const { session } = useUser()
  const [step, setStep] = useState<"details" | "confirm">("details")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: session?.email || "",
    phone: "",
    dietaryPreferences: "",
    specialRequests: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required")
      return false
    }
    setError("")
    return true
  }

  const handleNextStep = () => {
    if (validateForm()) {
      setStep("confirm")
    }
  }

  const handleConfirmRegistration = async () => {
    setIsSubmitting(true)
    try {
      saveRegistration({
        eventId: event.id,
        eventTitle: event.title,
        ticketCount,
        registrationDate: new Date().toISOString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dietaryPreferences: formData.dietaryPreferences,
        specialRequests: formData.specialRequests,
      })

      updateEventAttendees(event.id, ticketCount)

      onComplete(true)
    } catch (err) {
      setError("Failed to complete registration. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = 49 * ticketCount + Math.round(49 * ticketCount * 0.1)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">Complete Your Registration</h2>
          <button
            onClick={() => onComplete(false)}
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20 mb-6">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {step === "details" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">First Name*</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Last Name*</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Phone*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Dietary Preferences</label>
                  <textarea
                    name="dietaryPreferences"
                    value={formData.dietaryPreferences}
                    onChange={handleInputChange}
                    placeholder="e.g., Vegetarian, Vegan, Gluten-free, Nut allergies"
                    rows={2}
                    className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any special accommodations or requests?"
                    rows={2}
                    className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => onComplete(false)}
                  className="flex-1 px-4 py-2.5 border border-input rounded-lg text-foreground hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Confirm Registration</h3>

                <div className="bg-muted rounded-lg p-4 mb-6 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Event</p>
                    <p className="font-semibold text-foreground">{event.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold text-foreground">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tickets</p>
                      <p className="font-semibold text-foreground">{ticketCount}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-semibold text-foreground">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-semibold text-foreground">{formData.phone}</p>
                    </div>
                  </div>
                  {formData.dietaryPreferences && (
                    <div>
                      <p className="text-xs text-muted-foreground">Dietary Preferences</p>
                      <p className="font-semibold text-foreground">{formData.dietaryPreferences}</p>
                    </div>
                  )}
                  {formData.specialRequests && (
                    <div>
                      <p className="text-xs text-muted-foreground">Special Requests</p>
                      <p className="font-semibold text-foreground">{formData.specialRequests}</p>
                    </div>
                  )}
                </div>

                <div className="bg-muted rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">${49 * ticketCount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Fee</span>
                    <span className="font-semibold text-foreground">${Math.round(49 * ticketCount * 0.1)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-lg text-foreground">${totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep("details")}
                  className="flex-1 px-4 py-2.5 border border-input rounded-lg text-foreground hover:bg-muted transition"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmRegistration}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Confirming..." : "Confirm & Register"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
