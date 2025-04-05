"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserHistory } from "@/lib/history"
import { getUserLearningPaths } from "@/lib/learning-paths"
import { getUserIDXProjects } from "@/lib/idx-projects"
import { Award, BookOpen, Code, Flame, GraduationCap, Search, Trophy } from "lucide-react"
import Link from "next/link"
import { SearchForm } from "@/components/search-form"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { LearningPath, IDXProject } from "@/types"

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth()
  const [history, setHistory] = useState<any[]>([])
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [projects, setProjects] = useState<IDXProject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        setIsLoading(true)
        try {
          const [historyData, pathsData, projectsData] = await Promise.all([
            getUserHistory(user.uid),
            getUserLearningPaths(user.uid),
            getUserIDXProjects(user.uid),
          ])

          setHistory(historyData)
          setLearningPaths(pathsData)
          setProjects(projectsData)
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchUserData()
  }, [user])

  if (loading || !user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Loading dashboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Skillora</h1>
          <p className="text-muted-foreground max-w-2xl">
            Your personalized learning dashboard. Track your progress, manage your learning paths, and build projects to
            earn points.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UserProfileCard user={user} userProfile={userProfile} />
          <StatsCard history={history} projects={projects} />
          <SearchCard />
        </div>

        <Tabs defaultValue="learning" className="mt-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Learning Paths
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Watch History
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Code className="h-4 w-4" /> IDX Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning">
            <LearningPathsTab learningPaths={learningPaths} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab history={history} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsTab projects={projects} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function UserProfileCard({ user, userProfile }: { user: any; userProfile: any }) {
  const level = userProfile?.level || 1
  const points = userProfile?.points || 0
  const nextLevelPoints = level * 100
  const progress = Math.min(100, ((points % 100) / (nextLevelPoints - (level - 1) * 100)) * 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Your learning journey stats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
            <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{user?.displayName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-primary/10">
                Level {level}
              </Badge>
              <span className="text-sm text-muted-foreground">{points} points</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {level + 1}</span>
            <span>
              {points % 100}/{nextLevelPoints - (level - 1) * 100}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {userProfile?.badges && userProfile.badges.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Badges Earned</h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.badges.map((badge: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  <Trophy className="h-3 w-3 mr-1" /> {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/profile">View Full Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function StatsCard({ history, projects }: { history: any[]; projects: IDXProject[] }) {
  const watchedVideos = history.reduce((count, item) => {
    const watchedInCategories = Object.values(item.videos || {})
      .flat()
      .filter((v: any) => v.watched).length
    return count + watchedInCategories
  }, 0)

  const completedProjects = projects.filter((p) => p.status === "completed").length
  const streak = 3 // This would be calculated based on user activity

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Learning Stats</CardTitle>
        <CardDescription>Your progress at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{watchedVideos}</div>
            <div className="text-sm text-muted-foreground">Videos Watched</div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{completedProjects}</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <Flame className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{history.length}</div>
            <div className="text-sm text-muted-foreground">Topics Explored</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SearchCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Discover New Skills</CardTitle>
        <CardDescription>Search for any topic to start learning</CardDescription>
      </CardHeader>
      <CardContent>
        <SearchForm />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="text-sm font-medium">Popular Topics</div>
        <div className="flex flex-wrap gap-2">
          <Link href="/playlist/JavaScript">
            <Badge variant="secondary" className="cursor-pointer">
              JavaScript
            </Badge>
          </Link>
          <Link href="/playlist/Python">
            <Badge variant="secondary" className="cursor-pointer">
              Python
            </Badge>
          </Link>
          <Link href="/playlist/React">
            <Badge variant="secondary" className="cursor-pointer">
              React
            </Badge>
          </Link>
          <Link href="/playlist/Machine%20Learning">
            <Badge variant="secondary" className="cursor-pointer">
              Machine Learning
            </Badge>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

function LearningPathsTab({ learningPaths, isLoading }: { learningPaths: LearningPath[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (learningPaths.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-medium mb-2">No Learning Paths Yet</h3>
        <p className="text-muted-foreground mb-4">Start by searching for a topic you want to learn</p>
        <Button asChild>
          <Link href="/#search">
            <Search className="mr-2 h-4 w-4" /> Find Topics
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {learningPaths.map((path) => (
        <Card key={path.id}>
          <CardHeader>
            <CardTitle>{path.title}</CardTitle>
            <CardDescription>{path.topic}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
            <div className="text-sm">
              <span className="font-medium">{path.steps.length} steps</span> in this learning path
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/learning-path/${path.id}`}>Continue Learning</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function HistoryTab({ history, isLoading }: { history: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-medium mb-2">No Watch History Yet</h3>
        <p className="text-muted-foreground mb-4">Start watching videos to build your history</p>
        <Button asChild>
          <Link href="/#search">
            <Search className="mr-2 h-4 w-4" /> Find Videos
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {history.map((item) => {
        const totalVideos = Object.values(item.videos || {}).flat().length
        const watchedVideos = Object.values(item.videos || {})
          .flat()
          .filter((v: any) => v.watched).length
        const progress = totalVideos > 0 ? (watchedVideos / totalVideos) * 100 : 0

        return (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.query}</CardTitle>
              <CardDescription>
                {new Date(item.timestamp).toLocaleDateString()} • {watchedVideos}/{totalVideos} videos watched
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2 mb-4" />
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/playlist/${encodeURIComponent(item.query)}`}>Continue Learning</Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

function ProjectsTab({ projects, isLoading }: { projects: IDXProject[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-medium mb-2">No IDX Projects Yet</h3>
        <p className="text-muted-foreground mb-4">Create your first project to earn points</p>
        <Button asChild>
          <Link href="/projects/new">
            <Code className="mr-2 h-4 w-4" /> Create Project
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>
                  {project.skillLevel} • {project.status}
                </CardDescription>
              </div>
              {project.points && (
                <Badge variant="outline" className="bg-primary/10">
                  +{project.points} pts
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/projects/${project.id}`}>View Project</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

