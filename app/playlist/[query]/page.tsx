"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PlaylistResults } from "@/components/playlist-results"
import { PlaylistSkeleton } from "@/components/playlist-skeleton"
import { fetchVideos } from "@/lib/youtube"
import { filterAndCategorizeVideos } from "@/lib/ai-filter"
import { saveToHistory } from "@/lib/history"
import { createLearningPath } from "@/lib/learning-paths"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import type { CategorizedVideos, LearningPath } from "@/types"

export default function PlaylistPage() {
  const params = useParams()
  const query = decodeURIComponent(params.query as string)
  const [loading, setLoading] = useState(true)
  const [categorizedVideos, setCategorizedVideos] = useState<CategorizedVideos | null>(null)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      try {
        // Fetch videos from YouTube API
        const videos = await fetchVideos(query)

        // Use AI to categorize videos
        const categorized = await filterAndCategorizeVideos(videos, query)

        setCategorizedVideos(categorized)

        // If user is logged in, save to history and create learning path
        if (user) {
          // Save to user's history
          await saveToHistory(user.uid, query, categorized)

          // Create a learning path for this topic
          try {
            const path = await createLearningPath(user.uid, query)
            setLearningPath(path)
          } catch (error) {
            console.error("Error creating learning path:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error loading playlist",
          description: "There was a problem loading the playlist. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, user, toast])

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-16 px-4">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Learning Playlist: <span className="text-primary">{query}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              AI-curated videos organized by skill level to help you learn {query} effectively. Start with beginner
              content and progress through intermediate to advanced topics.
            </p>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          <PlaylistSkeleton />
        </div>
      </main>
    )
  }

  if (!categorizedVideos) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium">No videos found for this query</h2>
            <p className="text-muted-foreground mt-2">Try a different search term</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Learning Playlist: <span className="text-primary">{query}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            AI-curated videos organized by skill level to help you learn {query} effectively. Start with beginner
            content and progress through intermediate to advanced topics.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <PlaylistResults categorizedVideos={categorizedVideos} query={query} learningPath={learningPath} />
      </div>
    </main>
  )
}

