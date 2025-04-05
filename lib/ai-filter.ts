import type { CategorizedVideos, VideoType } from "@/types"
import { filterAndCategorizeVideosWithGemini } from "./gemini"

export async function filterAndCategorizeVideos(videos: VideoType[], query: string): Promise<CategorizedVideos> {
  // Use the Gemini API to categorize videos
  return filterAndCategorizeVideosWithGemini(videos, query)
}

