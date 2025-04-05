"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveIDXProject } from "@/lib/idx-projects"
import { addPointsToUser } from "@/lib/user-profile"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Github, Plus, Trash } from "lucide-react"
import Link from "next/link"
import type { SkillLevel } from "@/types"

export default function NewProjectPage() {
  const { user, loading, refreshUserProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [repositoryUrl, setRepositoryUrl] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [technologies, setTechnologies] = useState<string[]>([])
  const [newTechnology, setNewTechnology] = useState("")
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Pre-fill form if query parameters exist
    const titleParam = searchParams.get("title")
    const descriptionParam = searchParams.get("description")
    const technologiesParam = searchParams.get("technologies")
    const difficultyParam = searchParams.get("difficulty")

    if (titleParam) setTitle(titleParam)
    if (descriptionParam) setDescription(descriptionParam)
    if (technologiesParam) {
      const techArray = technologiesParam.split(",").map((t) => t.trim())
      setTechnologies(techArray)
    }
    if (difficultyParam) {
      const level = difficultyParam.toLowerCase()
      if (level === "easy") setSkillLevel("beginner")
      else if (level === "medium") setSkillLevel("intermediate")
      else if (level === "hard") setSkillLevel("advanced")
    }
  }, [searchParams])

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()])
      setNewTechnology("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to create a project",
        variant: "destructive",
      })
      return
    }

    if (!title.trim() || !description.trim() || !repositoryUrl.trim() || technologies.length === 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate points based on skill level
      const points = skillLevel === "beginner" ? 50 : skillLevel === "intermediate" ? 100 : 200

      // Save the project
      const projectId = await saveIDXProject(user.uid, {
        title,
        description,
        repositoryUrl,
        liveUrl: liveUrl || undefined,
        technologies,
        skillLevel,
        status: "planning",
        points,
      })

      // Add points to the user
      await addPointsToUser(user.uid, points)

      // Refresh user profile to update points
      await refreshUserProfile()

      toast({
        title: "Project created successfully",
        description: `You earned +${points} points for creating this project!`,
      })

      // Redirect to the project page
      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Failed to create project",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Loading...</h2>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Please sign in to create a project</h2>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Create New IDX Project</h1>
          <p className="text-muted-foreground max-w-2xl">
            Document your project on the IDX platform to track your progress and earn points.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Fill in the details about your IDX project</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repositoryUrl">Repository URL *</Label>
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="repositoryUrl"
                    placeholder="https://github.com/username/repository"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL (Optional)</Label>
                <Input
                  id="liveUrl"
                  placeholder="https://your-project.vercel.app"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies *</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {technologies.map((tech, index) => (
                    <div key={index} className="bg-muted rounded-full px-3 py-1 text-sm flex items-center gap-1">
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 rounded-full"
                        onClick={() => handleRemoveTechnology(tech)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a technology"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTechnology()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTechnology}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level *</Label>
                <Select value={skillLevel} onValueChange={(value) => setSkillLevel(value as SkillLevel)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (50 points)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (100 points)</SelectItem>
                    <SelectItem value="advanced">Advanced (200 points)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/projects">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}

