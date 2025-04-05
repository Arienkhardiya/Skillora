import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore"
import { db } from "./firebase"
import type { LearningPath } from "@/types"
import { generateLearningPathWithGemini } from "./gemini"

export async function createLearningPath(userId: string, topic: string): Promise<LearningPath> {
  try {
    // Generate a learning path using Gemini
    const generatedPath = await generateLearningPathWithGemini(topic)

    const learningPath: Omit<LearningPath, "id"> = {
      userId,
      title: generatedPath.title,
      description: generatedPath.description,
      topic,
      steps: generatedPath.steps,
      createdAt: new Date().toISOString(),
    }

    const docRef = await addDoc(collection(db, "learningPaths"), learningPath)

    return {
      id: docRef.id,
      ...learningPath,
    }
  } catch (error) {
    console.error("Error creating learning path:", error)
    throw error
  }
}

export async function getUserLearningPaths(userId: string): Promise<LearningPath[]> {
  try {
    const pathsRef = collection(db, "learningPaths")
    const q = query(pathsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const paths: LearningPath[] = []

    querySnapshot.forEach((doc) => {
      paths.push({
        id: doc.id,
        ...(doc.data() as Omit<LearningPath, "id">),
      })
    })

    return paths
  } catch (error) {
    console.error("Error getting user learning paths:", error)
    return []
  }
}

export async function getLearningPath(pathId: string): Promise<LearningPath | null> {
  try {
    const pathRef = doc(db, "learningPaths", pathId)
    const pathSnap = await getDoc(pathRef)

    if (pathSnap.exists()) {
      return {
        id: pathSnap.id,
        ...(pathSnap.data() as Omit<LearningPath, "id">),
      }
    }

    return null
  } catch (error) {
    console.error("Error getting learning path:", error)
    return null
  }
}

export async function updateLearningPath(pathId: string, updates: Partial<LearningPath>): Promise<boolean> {
  try {
    const pathRef = doc(db, "learningPaths", pathId)

    // Ensure we're not overwriting id, userId, or createdAt
    const { id, userId, createdAt, ...validUpdates } = updates as any

    await updateDoc(pathRef, validUpdates)
    return true
  } catch (error) {
    console.error("Error updating learning path:", error)
    return false
  }
}

export async function deleteLearningPath(pathId: string): Promise<boolean> {
  try {
    const pathRef = doc(db, "learningPaths", pathId)
    await deleteDoc(pathRef)
    return true
  } catch (error) {
    console.error("Error deleting learning path:", error)
    return false
  }
}

