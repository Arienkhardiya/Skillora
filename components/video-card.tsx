"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { VideoType } from "@/types"
import { ExternalLink, ThumbsUp, Eye, CheckCircle2, Circle, Play, Bookmark, BookmarkCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

interface VideoCardProps {
  video: VideoType
  onWatchedToggle: (videoId: string, isWatched: boolean) => void
}

export function VideoCard({ video, onWatchedToggle }: VideoCardProps) {
  const [isWatched, setIsWatched] = useState(video.watched || false)
  const [isSaved, setIsSaved] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  const handleWatchClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")
  }

  const handleWatchedToggle = () => {
    const newWatchedState = !isWatched
    setIsWatched(newWatchedState)
    onWatchedToggle(video.id, newWatchedState)
  }

  const handleSaveToggle = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Removed from saved videos" : "Saved for later",
    })
  }

  const formatDuration = (durationSeconds: number) => {
    const minutes = Math.floor(durationSeconds / 60)
    const seconds = durationSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${isWatched ? "border-primary/50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden group">
        {!imageLoaded && <Skeleton className="absolute inset-0" />}
        <img
          src={video.thumbnail || "/placeholder.svg?height=720&width=1280"}
          alt={video.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />

        <motion.div
          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <Button size="lg" variant="default" className="rounded-full" onClick={handleWatchClick}>
            <Play className="h-6 w-6" />
          </Button>
        </motion.div>

        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        )}

        {isWatched && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            Watched
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">{video.title}</h3>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">{video.channelTitle}</p>

          <Badge variant="outline" className="text-xs">
            {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
            <Eye className="h-3 w-3" /> {video.viewCount?.toLocaleString() || "N/A"}
          </span>
          <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
            <ThumbsUp className="h-3 w-3" /> {video.likeCount?.toLocaleString() || "N/A"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button onClick={handleWatchClick} className="flex-1" variant="default">
            <ExternalLink className="mr-2 h-4 w-4" /> Watch
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSaveToggle} variant="outline">
                  {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSaved ? "Remove from saved" : "Save for later"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button onClick={handleWatchedToggle} variant="ghost" className="w-full">
          {isWatched ? (
            <>
              <Circle className="mr-2 h-4 w-4" /> Mark as Unwatched
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Watched
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

