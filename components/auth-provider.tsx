"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserProfile } from "@/lib/user-profile"
import type { UserProfile } from "@/types"

type AuthContextType = {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  refreshUserProfile: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } catch (error) {
        console.error("Error refreshing user profile:", error)
      }
    }
  }

  useEffect(() => {
    let unsubscribe: () => void

    try {
      // Check if auth is properly initialized
      if (auth && typeof auth.onAuthStateChanged === "function") {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user)

          if (user) {
            try {
              const profile = await getUserProfile(user.uid)
              setUserProfile(profile)
            } catch (error) {
              console.error("Error fetching user profile:", error)
            }
          } else {
            setUserProfile(null)
          }

          setLoading(false)
        })
      } else {
        console.error("Firebase auth not properly initialized")
        setLoading(false)
      }
    } catch (error) {
      console.error("Error setting up auth state listener:", error)
      setLoading(false)
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, refreshUserProfile }}>{children}</AuthContext.Provider>
  )
}

