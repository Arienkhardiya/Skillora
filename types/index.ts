export type VideoType = {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  viewCount?: number
  likeCount?: number
  duration?: number // in seconds
  watched?: boolean
}

export type SkillLevel = "beginner" | "intermediate" | "advanced"

export type CategorizedVideos = {
  [key in SkillLevel]: VideoType[]
}

export type SortOption = "relevance" | "mostLiked" | "newest" | "shortest"

export type IDXProject = {
  id: string
  userId: string
  title: string
  description: string
  repositoryUrl: string
  liveUrl?: string
  technologies: string[]
  skillLevel: SkillLevel
  status: "planning" | "in-progress" | "completed"
  createdAt: string
  lastUpdated: string
  thumbnailUrl?: string
  points?: number
}

export type LearningPath = {
  id?: string
  userId?: string
  title: string
  description: string
  topic: string
  steps: string[]
  createdAt?: string
}

export type UserProfile = {
  uid: string
  displayName: string
  email: string
  photoURL: string
  points: number
  level: number
  completedCourses: string[]
  badges: string[]
  joinedAt: string
}

