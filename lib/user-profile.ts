import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "./firebase"
import type { UserProfile } from "@/types"

export async function createUserProfile(
  uid: string,
  userData: { displayName: string; email: string; photoURL?: string },
): Promise<UserProfile> {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const newUser: UserProfile = {
        uid,
        displayName: userData.displayName || "Skillora User",
        email: userData.email,
        photoURL: userData.photoURL || "",
        points: 0,
        level: 1,
        completedCourses: [],
        badges: [],
        joinedAt: new Date().toISOString(),
      }

      await setDoc(userRef, newUser)
      return newUser
    }

    return userSnap.data() as UserProfile
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile
    }

    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<boolean> {
  try {
    const userRef = doc(db, "users", uid)

    // Ensure we're not overwriting uid or joinedAt
    const { uid: _, joinedAt: __, ...validUpdates } = updates as any

    await updateDoc(userRef, validUpdates)
    return true
  } catch (error) {
    console.error("Error updating user profile:", error)
    return false
  }
}

export async function addPointsToUser(uid: string, points: number): Promise<boolean> {
  try {
    const userRef = doc(db, "users", uid)

    await updateDoc(userRef, {
      points: increment(points),
    })

    // Check if user should level up
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile
      const currentPoints = userData.points
      const currentLevel = userData.level

      // Simple level up formula: level = floor(points / 100) + 1
      const newLevel = Math.floor(currentPoints / 100) + 1

      if (newLevel > currentLevel) {
        await updateDoc(userRef, {
          level: newLevel,
        })
      }
    }

    return true
  } catch (error) {
    console.error("Error adding points to user:", error)
    return false
  }
}

export async function awardBadgeToUser(uid: string, badge: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile
      const currentBadges = userData.badges || []

      // Only add the badge if the user doesn't already have it
      if (!currentBadges.includes(badge)) {
        await updateDoc(userRef, {
          badges: [...currentBadges, badge],
        })
      }

      return true
    }

    return false
  } catch (error) {
    console.error("Error awarding badge to user:", error)
    return false
  }
}

