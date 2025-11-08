"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getSession, logout as logoutStorage, type AuthSession } from "./auth-storage"

interface UserContextType {
  session: AuthSession | null
  isLoading: boolean
  logout: () => void
  refreshSession: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedSession = getSession()
    setSession(savedSession)
    setIsLoading(false)
  }, [])

  const logout = () => {
    logoutStorage()
    setSession(null)
  }

  const refreshSession = () => {
    const savedSession = getSession()
    setSession(savedSession)
  }

  return <UserContext.Provider value={{ session, isLoading, logout, refreshSession }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
