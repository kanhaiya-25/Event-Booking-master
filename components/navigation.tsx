"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Calendar, LogOut, User } from "lucide-react"
import { useUser } from "@/lib/user-context"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { session, logout } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary/80">
            <Calendar className="w-6 h-6" />
            EventHub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-foreground hover:text-primary transition">
              Browse Events
            </Link>
            {session && (
              <Link href="/dashboard" className="text-foreground hover:text-primary transition">
                Dashboard
              </Link>
            )}
            {/* Auth buttons in navigation */}
            {session ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {session.firstName} {session.lastName}
                </div>
                <Link href="/profile" className="flex items-center gap-2 text-foreground hover:text-primary transition">
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-foreground hover:text-destructive transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-foreground hover:text-primary transition font-semibold">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden" aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <Link href="/events" className="text-foreground hover:text-primary transition">
              Browse Events
            </Link>
            {session && (
              <Link href="/dashboard" className="text-foreground hover:text-primary transition">
                Dashboard
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profile" className="text-foreground hover:text-primary transition">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-left text-foreground hover:text-destructive transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-foreground hover:text-primary transition font-semibold">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition font-semibold text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
