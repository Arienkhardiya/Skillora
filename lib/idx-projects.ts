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
import type { IDXProject } from "@/types"

export async function saveIDXProject(
  userId: string,
  project: Omit<IDXProject, "id" | "userId" | "createdAt">,
): Promise<string> {
  try {
    const projectData = {
      ...project,
      userId,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    const docRef = await addDoc(collection(db, "idxProjects"), projectData)
    return docRef.id
  } catch (error) {
    console.error("Error saving IDX project:", error)
    throw error
  }
}

export async function getUserIDXProjects(userId: string): Promise<IDXProject[]> {
  try {
    const projectsRef = collection(db, "idxProjects")
    const q = query(projectsRef, where("userId", "==", userId), orderBy("lastUpdated", "desc"))

    const querySnapshot = await getDocs(q)
    const projects: IDXProject[] = []

    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...(doc.data() as Omit<IDXProject, "id">),
      })
    })

    return projects
  } catch (error) {
    console.error("Error getting user IDX projects:", error)
    return []
  }
}

export async function updateIDXProject(projectId: string, updates: Partial<IDXProject>): Promise<boolean> {
  try {
    const projectRef = doc(db, "idxProjects", projectId)

    // Ensure we're not overwriting id, userId, or createdAt
    const { id, userId, createdAt, ...validUpdates } = updates as any

    await updateDoc(projectRef, {
      ...validUpdates,
      lastUpdated: new Date().toISOString(),
    })

    return true
  } catch (error) {
    console.error("Error updating IDX project:", error)
    return false
  }
}

export async function deleteIDXProject(projectId: string): Promise<boolean> {
  try {
    const projectRef = doc(db, "idxProjects", projectId)
    await deleteDoc(projectRef)
    return true
  } catch (error) {
    console.error("Error deleting IDX project:", error)
    return false
  }
}

export async function getIDXProject(projectId: string): Promise<IDXProject | null> {
  try {
    const projectRef = doc(db, "idxProjects", projectId)
    const projectSnap = await getDoc(projectRef)

    if (projectSnap.exists()) {
      return {
        id: projectSnap.id,
        ...(projectSnap.data() as Omit<IDXProject, "id">),
      }
    }

    return null
  } catch (error) {
    console.error("Error getting IDX project:", error)
    return null
  }
}

