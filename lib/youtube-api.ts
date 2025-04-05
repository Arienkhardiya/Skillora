import type { VideoType } from "@/types"

// YouTube API key hardcoded
const YOUTUBE_API_KEY = "AIzaSyBv0uXFoaQ63svLJ-wXE-mtG13gntKr9KY"

export async function fetchVideosFromYouTube(query: string): Promise<VideoType[]> {
  try {
    // In a production environment, you would use the actual YouTube API
    // const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`);
    // const data = await response.json();

    // For this demo, we'll simulate the API response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock videos based on the query
    const mockVideos: VideoType[] = Array.from({ length: 15 }, (_, i) => {
      const id = `video-${i}-${Date.now()}`
      const isBeginnerVideo = i < 5
      const isIntermediateVideo = i >= 5 && i < 10

      const viewCount = Math.floor(Math.random() * 1000000) + 10000
      const likeCount = Math.floor(viewCount * (Math.random() * 0.1 + 0.01))
      const publishedDate = new Date()
      publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 365))

      let title = ""
      let description = ""

      if (isBeginnerVideo) {
        title = `Introduction to ${query} for Beginners - Part ${i + 1}`
        description = `Learn the fundamentals of ${query} in this beginner-friendly tutorial. Perfect for those just starting out with ${query}.`
      } else if (isIntermediateVideo) {
        title = `${query} Intermediate Tutorial: Building Real Projects - ${i - 4}`
        description = `Take your ${query} skills to the next level with this intermediate tutorial. Learn how to build real-world projects.`
      } else {
        title = `Advanced ${query} Masterclass: Deep Dive - ${i - 9}`
        description = `Master advanced ${query} concepts in this comprehensive deep dive. For experienced developers looking to level up.`
      }

      return {
        id,
        title,
        description,
        thumbnail: `/placeholder.svg?height=720&width=1280&text=${encodeURIComponent(title)}`,
        channelTitle: `${query} Academy`,
        publishedAt: publishedDate.toISOString(),
        viewCount,
        likeCount,
        duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        watched: false,
      }
    })

    return mockVideos
  } catch (error) {
    console.error("Error fetching videos from YouTube:", error)
    throw error
  }
}

export async function getVideoDetails(videoId: string): Promise<VideoType | null> {
  try {
    // In a production environment, you would use the actual YouTube API
    // const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`);
    // const data = await response.json();

    // For this demo, we'll return a mock video
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      id: videoId,
      title: "Sample Video Title",
      description: "This is a sample video description.",
      thumbnail: `/placeholder.svg?height=720&width=1280&text=${encodeURIComponent("Sample Video")}`,
      channelTitle: "Sample Channel",
      publishedAt: new Date().toISOString(),
      viewCount: 10000,
      likeCount: 500,
      duration: 600, // 10 minutes
      watched: false,
    }
  } catch (error) {
    console.error("Error fetching video details:", error)
    return null
  }
}

