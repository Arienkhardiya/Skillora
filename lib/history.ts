import { doc, setDoc, getDoc, collection, query, getDocs, orderBy, limit } from "firebase/firestore"
import { db } from "./firebase"
import type { CategorizedVideos } from "@/types"

export async function saveToHistory(userId: string, searchQuery: string, categorizedVideos: CategorizedVideos) {
  try {
    const historyRef = doc(db, "users", userId, "history", searchQuery)

    await setDoc(historyRef, {
      query: searchQuery,
      timestamp: new Date().toISOString(),
      videos: categorizedVideos,
    })

    return true
  } catch (error) {
    console.error("Error saving to history:", error)
    return false
  }
}

export async function getUserHistory(userId: string, maxItems = 10) {
  try {
    const historyRef = collection(db, "users", userId, "history")
    const q = query(historyRef, orderBy("timestamp", "desc"), limit(maxItems))

    const querySnapshot = await getDocs(q)
    const history: any[] = []

    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return history
  } catch (error) {
    console.error("Error getting user history:", error)
    return []
  }
}

export async function updateWatchStatus(userId: string, searchQuery: string, videoId: string, isWatched: boolean) {
  try {
    const historyRef = doc(db, "users", userId, "history", searchQuery)
    const historyDoc = await getDoc(historyRef)

    if (!historyDoc.exists()) {
      return false
    }

    const data = historyDoc.data()
    const videos = data.videos

    // Update the watched status for the video in all categories
    for (const category of Object.keys(videos)) {
      const categoryVideos = videos[category]
      const videoIndex = categoryVideos.findIndex((v: any) => v.id === videoId)

      if (videoIndex !== -1) {
        videos[category][videoIndex].watched = isWatched
      }
    }

    // Update the document
    await setDoc(historyRef, {
      ...data,
      videos,
    })

    return true
  } catch (error) {
    console.error("Error updating watch status:", error)
    return false
  }
}

