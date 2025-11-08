"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { getRegistrations } from "@/lib/registration-storage"
import RegistrationConfirmDialog from "./registration-confirm-dialog"

interface Event {
  id: string
  title: string
  attendees: number
  capacity: number
}

export default function RegistrationCard({ event }: { event: Event }) {
  const [isRegistered, setIsRegistered] = useState(false)
  const [ticketCount, setTicketCount] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()
  const { session } = useUser()
  const spotsRemaining = event.capacity - event.attendees

  const isAlreadyRegistered = () => {
    if (!session) return false
    const registrations = getRegistrations()
    return registrations.some((r) => r.eventId === event.id)
  }

  const handleRegisterClick = () => {
    if (!session) {
      router.push("/auth/login")
      return
    }

    if (spotsRemaining > 0) {
      setShowConfirmation(true)
    }
  }

  const handleConfirmation = (completed: boolean) => {
    setShowConfirmation(false)
    if (completed) {
      setIsRegistered(true)
      setTicketCount(1)
    }
  }

  if (isRegistered) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="font-bold text-foreground mb-2">Registration Confirmed!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You've successfully registered for {ticketCount} ticket{ticketCount > 1 ? "s" : ""}
          </p>
          <button
            onClick={() => setIsRegistered(false)}
            className="text-sm text-primary hover:text-primary/80 font-semibold"
          >
            Register Additional Tickets
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-1">Price per ticket</p>
          <p className="text-3xl font-bold text-foreground">$49</p>
        </div>

        {spotsRemaining <= 0 ? (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20 mb-6">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Event Full</p>
              <p className="text-sm text-destructive/80">This event has reached capacity</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">Number of Tickets</label>
              <div className="flex items-center gap-3 border border-input rounded-lg bg-background p-2 w-fit">
                <button
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className="w-8 h-8 rounded hover:bg-muted transition flex items-center justify-center"
                >
                  −
                </button>
                <span className="font-semibold w-8 text-center">{ticketCount}</span>
                <button
                  onClick={() => setTicketCount(Math.min(spotsRemaining, ticketCount + 1))}
                  className="w-8 h-8 rounded hover:bg-muted transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{spotsRemaining} spots available</p>
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
                <span className="font-bold text-lg text-foreground">
                  ${49 * ticketCount + Math.round(49 * ticketCount * 0.1)}
                </span>
              </div>
            </div>

            <button
              onClick={handleRegisterClick}
              disabled={isAlreadyRegistered()}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAlreadyRegistered() ? "Already Registered" : session ? "Review & Register" : "Sign In to Register"}
            </button>
          </>
        )}

        <div className="text-xs text-muted-foreground text-center mt-4">
          By registering, you agree to our terms and conditions
        </div>
      </div>

      {showConfirmation && (
        <RegistrationConfirmDialog event={event} ticketCount={ticketCount} onComplete={handleConfirmation} />
      )}
    </>
  )
}
