import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Hardcode the Firebase config values to ensure they're properly loaded
const firebaseConfig = {
  apiKey: "AIzaSyBfl3kVRIvyBeODnqqGoZ43JGqD7p2lBbE",
  authDomain: "musica-bd724.firebaseapp.com",
  projectId: "musica-bd724",
  storageBucket: "musica-bd724.firebasestorage.app",
  messagingSenderId: "993961852711",
  appId: "1:993961852711:web:1de6949d3bb03e6c6a7302",
  measurementId: "G-BRKDW1V44Y",
}

// Initialize Firebase with error handling
let app
let auth
let db
let storage

try {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }

  // Initialize Firebase services
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)

  console.log("Firebase initialized successfully")
} catch (error) {
  console.error("Error initializing Firebase:", error)

  // Create fallback objects to prevent app from crashing
  if (!app) app = {} as any
  if (!auth) auth = {} as any
  if (!db) db = {} as any
  if (!storage) storage = {} as any
}

export { app, auth, db, storage }

