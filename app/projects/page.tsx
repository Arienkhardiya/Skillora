"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserIDXProjects } from "@/lib/idx-projects"
import { generateProjectIdeasWithGemini } from "@/lib/gemini"
import { Code, Plus, ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { IDXProject } from "@/types"

export default function ProjectsPage() {
  const { user, loading } = useAuth()
  const [projects, setProjects] = useState<IDXProject[]>([])
  const [projectIdeas, setProjectIdeas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTopic, setSearchTopic] = useState("")
  const [generatingIdeas, setGeneratingIdeas] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProjects() {
      if (user) {
        setIsLoading(true)
        try {
          const projectsData = await getUserIDXProjects(user.uid)
          setProjects(projectsData)
        } catch (error) {
          console.error("Error fetching projects:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchProjects()
  }, [user])

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchTopic.trim()) {
      toast({
        title: "Please enter a topic",
        variant: "destructive",
      })
      return
    }

    setGeneratingIdeas(true)

    try {
      const ideas = await generateProjectIdeasWithGemini(searchTopic)
      setProjectIdeas(ideas)
    } catch (error) {
      console.error("Error generating project ideas:", error)
      toast({
        title: "Failed to generate project ideas",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setGeneratingIdeas(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Loading projects...</h2>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">IDX Projects</h1>
          <p className="text-muted-foreground max-w-2xl">
            Build projects on the IDX platform to apply your skills and earn additional points. Track your progress and
            showcase your portfolio.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <p className="text-muted-foreground">Track and manage your IDX platform projects</p>
          </div>

          <Button asChild>
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" /> Create New Project
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="myprojects" className="mt-8">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="myprojects" className="flex items-center gap-2">
              <Code className="h-4 w-4" /> My Projects
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Github className="h-4 w-4" /> Project Ideas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myprojects">
            <MyProjectsTab projects={projects} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="ideas">
            <ProjectIdeasTab
              projectIdeas={projectIdeas}
              searchTopic={searchTopic}
              setSearchTopic={setSearchTopic}
              handleGenerateIdeas={handleGenerateIdeas}
              generatingIdeas={generatingIdeas}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function MyProjectsTab({ projects, isLoading }: { projects: IDXProject[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <h3 className="text-xl font-medium mb-2">No Projects Yet</h3>
        <p className="text-muted-foreground mb-4">Create your first project to earn points</p>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <CardFooter className="flex gap-2">
            <Button asChild variant="default" className="flex-1">
              <Link href={`/projects/${project.id}`}>View Details</Link>
            </Button>
            {project.repositoryUrl && (
              <Button asChild variant="outline">
                <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild variant="outline">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function ProjectIdeasTab({
  projectIdeas,
  searchTopic,
  setSearchTopic,
  handleGenerateIdeas,
  generatingIdeas,
}: {
  projectIdeas: any[]
  searchTopic: string
  setSearchTopic: (value: string) => void
  handleGenerateIdeas: (e: React.FormEvent) => Promise<void>
  generatingIdeas: boolean
}) {
  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate Project Ideas</CardTitle>
          <CardDescription>Get AI-powered project ideas based on a topic you're interested in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateIdeas} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="topic" className="sr-only">
                Topic
              </Label>
              <Input
                id="topic"
                placeholder="Enter a topic (e.g., React, Machine Learning, Web Development)"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={generatingIdeas}>
              {generatingIdeas ? "Generating..." : "Generate Ideas"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatingIdeas ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
      ) : projectIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectIdeas.map((idea, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{idea.title}</CardTitle>
                <CardDescription>Difficulty: {idea.difficulty}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{idea.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {idea.technologies.map((tech: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link
                    href={`/projects/new?title=${encodeURIComponent(idea.title)}&description=${encodeURIComponent(idea.description)}&technologies=${encodeURIComponent(idea.technologies.join(","))}&difficulty=${encodeURIComponent(idea.difficulty)}`}
                  >
                    Use This Idea
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : searchTopic ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No Ideas Generated Yet</h3>
          <p className="text-muted-foreground mb-4">Click the Generate Ideas button to get started</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Github className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">Enter a Topic to Generate Ideas</h3>
          <p className="text-muted-foreground mb-4">
            Get AI-powered project ideas based on your interests and skill level
          </p>
        </div>
      )}
    </div>
  )
}

