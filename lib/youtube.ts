import type { VideoType } from "@/types"
import { fetchVideosFromYouTube } from "./youtube-api"

export async function fetchVideos(query: string): Promise<VideoType[]> {
  // Use the YouTube API to fetch videos
  return fetchVideosFromYouTube(query)
}

