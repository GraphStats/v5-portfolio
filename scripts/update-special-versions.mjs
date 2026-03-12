import "dotenv/config"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"

const requiredEnv = (key) => {
  const value = process.env[key]
  if (!value) {
    console.error(`Missing env ${key}. Add it to your .env.local before running this script.`)
    process.exit(1)
  }
  return value
}

const firebaseConfig = {
  apiKey: requiredEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: requiredEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: requiredEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: requiredEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requiredEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requiredEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function updateChangelog() {
  const docRef = doc(db, "update-p", "main")
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    console.log("Document not found.")
    return
  }

  const data = docSnap.data()
  const changelog = data.changelog || []

  const newYearStart = {
    id: "special_new_year_start",
    version: "v3.0.3 (special version)",
    date: "2025-12-20",
    changes: ["Golden New Year theme activated on the site"],
  }

  const newYearEnd = {
    id: "special_new_year_end",
    version: "v3.0.3",
    date: "2026-01-02",
    changes: ["Bug fix", "Feature addition", "New Year theme removed"],
  }

  const updatedChangelog = [newYearEnd, newYearStart, ...changelog]

  await setDoc(docRef, {
    ...data,
    changelog: updatedChangelog,
    next_update_date: "2025-12-20T00:00:00",
    no_update_planned: false,
    updated_at: new Date().toISOString(),
  })

  console.log("Changelog updated successfully with special versions.")
}

updateChangelog().catch((error) => {
  console.error("Failed to update changelog:", error)
  process.exit(1)
})
