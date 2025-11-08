interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  company?: string
  dietaryPreferences?: string
  createdAt: string
}

interface AuthSession {
  userId: string
  email: string
  firstName: string
  lastName: string
}

const USERS_STORAGE_KEY = "event_users"
const SESSION_STORAGE_KEY = "auth_session"

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getUserById(userId: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.id === userId) || null
}

export function getUserByEmail(email: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.email === email) || null
}

export function createUser(user: Omit<User, "id" | "createdAt">): User {
  if (typeof window === "undefined") throw new Error("Not in browser")

  const newUser: User = {
    ...user,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const users = getAllUsers()
  users.push(newUser)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

  return newUser
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  if (typeof window === "undefined") return null

  const users = getAllUsers()
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) return null

  users[index] = { ...users[index], ...updates }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

  const session = getSession()
  if (session?.userId === userId) {
    const updatedSession: AuthSession = {
      ...session,
      email: users[index].email,
      firstName: users[index].firstName,
      lastName: users[index].lastName,
    }
    setSession(updatedSession)
  }

  return users[index]
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(SESSION_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setSession(session: AuthSession | null): void {
  if (typeof window === "undefined") return
  if (session) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

export function resetPassword(email: string, newPassword: string): boolean {
  if (typeof window === "undefined") return false

  const user = getUserByEmail(email)
  if (!user) return false

  updateUser(user.id, { password: newPassword })
  return true
}
