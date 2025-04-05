import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { createUserProfile } from "@/lib/user-profile"

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    // Check if auth is properly initialized
    if (!auth || typeof auth.signInWithPopup !== "function") {
      console.error("Firebase auth not properly initialized")
      throw new Error("Authentication service unavailable")
    }

    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Create or update user profile in Firestore
    if (user) {
      await createUserProfile(user.uid, {
        displayName: user.displayName || "Skillora User",
        email: user.email || "",
        photoURL: user.photoURL || "",
      })
    }

    return user
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export const signOut = async () => {
  try {
    // Check if auth is properly initialized
    if (!auth || typeof auth.signOut !== "function") {
      console.error("Firebase auth not properly initialized")
      throw new Error("Authentication service unavailable")
    }

    await firebaseSignOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    // Check if auth is properly initialized
    if (!auth || typeof auth.onAuthStateChanged !== "function") {
      console.error("Firebase auth not properly initialized")
      resolve(null)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

