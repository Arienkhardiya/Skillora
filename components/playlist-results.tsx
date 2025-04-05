"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoCard } from "@/components/video-card"
import type { CategorizedVideos, SkillLevel, SortOption, VideoType, LearningPath } from "@/types"
import { Button } from "@/components/ui/button"
import {
  ArrowDownAZ,
  Clock,
  ThumbsUp,
  Calendar,
  GraduationCap,
  Code,
  Lightbulb,
  Filter,
  Share2,
  Save,
  Download,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PlaylistResultsProps {
  categorizedVideos: CategorizedVideos
  query: string
  learningPath?: LearningPath | null
}

export function PlaylistResults({ categorizedVideos, query, learningPath }: PlaylistResultsProps) {
  const [activeTab, setActiveTab] = useState<SkillLevel>("beginner")
  const [sortOption, setSortOption] = useState<SortOption>("relevance")
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption)
  }

  const sortVideos = (videos: VideoType[]): VideoType[] => {
    const videosCopy = [...videos]

    switch (sortOption) {
      case "mostLiked":
        return videosCopy.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      case "newest":
        return videosCopy.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      case "shortest":
        return videosCopy.sort((a, b) => (a.duration || 0) - (b.duration || 0))
      default:
        return videosCopy // Default is relevance (as returned by API)
    }
  }

  const getSkillLevelIcon = (level: SkillLevel) => {
    switch (level) {
      case "beginner":
        return <Lightbulb className="h-4 w-4" />
      case "intermediate":
        return <Code className="h-4 w-4" />
      case "advanced":
        return <GraduationCap className="h-4 w-4" />
      default:
        return null
    }
  }

  const getSortIcon = () => {
    switch (sortOption) {
      case "mostLiked":
        return <ThumbsUp className="h-4 w-4" />
      case "newest":
        return <Calendar className="h-4 w-4" />
      case "shortest":
        return <Clock className="h-4 w-4" />
      default:
        return <ArrowDownAZ className="h-4 w-4" />
    }
  }

  const handleWatchedToggle = async (videoId: string, isWatched: boolean) => {
    toast({
      title: isWatched ? "Marked as watched" : "Marked as unwatched",
      description: "Your progress has been saved",
    })
  }

  const getSkillLevelDescription = (level: SkillLevel) => {
    switch (level) {
      case "beginner":
        return {
          title: "Beginner Content",
          description: "Start your learning journey with these foundational videos that cover the basics.",
          icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
        }
      case "intermediate":
        return {
          title: "Intermediate Content",
          description: "Build on your knowledge with these practical, hands-on videos for intermediate learners.",
          icon: <Code className="h-6 w-6 text-blue-500" />,
        }
      case "advanced":
        return {
          title: "Advanced Content",
          description: "Master advanced concepts and techniques with these in-depth, expert-level videos.",
          icon: <GraduationCap className="h-6 w-6 text-purple-500" />,
        }
      default:
        return { title: "", description: "", icon: null }
    }
  }

  const totalVideos = Object.values(categorizedVideos).reduce((sum, videos) => sum + videos.length, 0)

  return (
    <div className="space-y-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI-Curated Learning Path</span>
            <span className="text-sm font-normal text-muted-foreground">{totalVideos} videos found</span>
          </CardTitle>
          <CardDescription>
            These videos have been analyzed and categorized by AI to create an optimal learning path for {query}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show or hide filtering options</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Playlist saved" })}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Playlist
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save this playlist to your account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast({ title: "Share link copied to clipboard" })}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this playlist with others</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Playlist exported" })}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export this playlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-sm font-medium mr-2">Sort by:</span>
                      <Select value={sortOption} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="mostLiked">Most Liked</SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="shortest">Shortest Duration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Additional filters could go here */}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Tabs defaultValue="beginner" value={activeTab} onValueChange={(v) => setActiveTab(v as SkillLevel)}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="beginner" className="flex items-center gap-2">
            {getSkillLevelIcon("beginner")} Beginner
          </TabsTrigger>
          <TabsTrigger value="intermediate" className="flex items-center gap-2">
            {getSkillLevelIcon("intermediate")} Intermediate
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            {getSkillLevelIcon("advanced")} Advanced
          </TabsTrigger>
        </TabsList>

        {Object.entries(categorizedVideos).map(([level, videos]) => {
          const { title, description, icon } = getSkillLevelDescription(level as SkillLevel)

          return (
            <TabsContent key={level} value={level} className="space-y-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">{icon}</div>
                <div>
                  <h2 className="text-xl font-semibold">{title}</h2>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={level + sortOption}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortVideos(videos).map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: index * 0.05 },
                        }}
                      >
                        <VideoCard video={video} onWatchedToggle={handleWatchedToggle} />
                      </motion.div>
                    ))}
                  </div>

                  {videos.length === 0 && (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">No {level} videos found for this topic</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

