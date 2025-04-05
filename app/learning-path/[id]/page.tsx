"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getLearningPath } from "@/lib/learning-paths"
import { ArrowLeft, BookOpen, Check, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import type { LearningPath } from "@/types"

export default function LearningPathPage() {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const { toast } = useToast()

  useEffect(() => {
    async function fetchLearningPath() {
      if (!id) return

      setIsLoading(true)
      try {
        const path = await getLearningPath(id as string)
        setLearningPath(path)

        // In a real app, you would fetch the user's progress from the database
        // For now, we'll use local storage to simulate this
        const savedProgress = localStorage.getItem(`learning-path-${id}`)
        if (savedProgress) {
          setCompletedSteps(JSON.parse(savedProgress))
        }
      } catch (error) {
        console.error("Error fetching learning path:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLearningPath()
  }, [id])

  const toggleStepCompletion = (index: number) => {
    let newCompletedSteps

    if (completedSteps.includes(index)) {
      newCompletedSteps = completedSteps.filter((step) => step !== index)
    } else {
      newCompletedSteps = [...completedSteps, index]
    }

    setCompletedSteps(newCompletedSteps)

    // Save progress to local storage
    localStorage.setItem(`learning-path-${id}`, JSON.stringify(newCompletedSteps))

    // Show toast
    if (!completedSteps.includes(index)) {
      toast({
        title: "Step marked as completed",
        description: "Your progress has been saved",
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full max-w-lg mb-8" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!learningPath) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Learning path not found</h2>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const progress =
    learningPath.steps.length > 0 ? Math.round((completedSteps.length / learningPath.steps.length) * 100) : 0

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{learningPath.title}</h1>
          <p className="text-muted-foreground max-w-2xl">{learningPath.description}</p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Learning Path for {learningPath.topic}</CardTitle>
                <CardDescription>Follow these steps to master {learningPath.topic}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{progress}%</div>
                <div className="text-sm text-muted-foreground">
                  {completedSteps.length}/{learningPath.steps.length} steps completed
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {learningPath.steps.map((step, index) => (
              <div
                key={index}
                className={`flex gap-4 p-4 rounded-lg transition-colors ${
                  completedSteps.includes(index) ? "bg-primary/10" : "hover:bg-muted/50"
                }`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full shrink-0 mt-0.5"
                  onClick={() => toggleStepCompletion(index)}
                >
                  {completedSteps.includes(index) ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </Button>
                <div>
                  <div className="font-medium">{step}</div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              <BookOpen className="inline-block h-4 w-4 mr-1" />
              Created {new Date(learningPath.createdAt || "").toLocaleDateString()}
            </div>

            {progress === 100 ? (
              <Button className="gap-2">
                <Check className="h-4 w-4" /> Completed!
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/playlist/${encodeURIComponent(learningPath.topic)}`}>Find Videos for This Topic</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

