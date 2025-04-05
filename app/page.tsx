import type React from "react"
import { SearchForm } from "@/components/search-form"
import { SignInButton } from "@/components/sign-in-button"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Layers, Award } from "lucide-react"
import Link from "next/link"

// Update the title and branding to Skillora
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-32 px-4 md:px-6">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-white/5" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tight mb-4">
            Skillora: <span className="text-primary">AI-Powered Learning Hub</span>
          </h1>

          <p className="text-lg md:text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-8">
            Generate customized learning paths categorized by skill level using AI. Find the best resources for your
            learning journey and earn points with IDX projects.
          </p>

          <div className="max-w-2xl mx-auto">
            <SearchForm />
          </div>

          <div className="flex justify-center mt-8">
            <SignInButton />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 md:px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-primary" />}
              title="AI-Powered Curation"
              description="Our AI analyzes video content, comments, and engagement to find the best learning resources for you."
            />

            <FeatureCard
              icon={<Layers className="h-10 w-10 text-primary" />}
              title="Skill-Based Categories"
              description="Videos are automatically organized into Beginner, Intermediate, and Advanced levels to match your expertise."
            />

            <FeatureCard
              icon={<Award className="h-10 w-10 text-primary" />}
              title="IDX Project Points"
              description="Build projects on the IDX platform to apply your skills and earn points to level up your profile."
            />
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-4">Ready to start learning?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Try searching for any topic you want to learn, and our AI will create a personalized learning path for
              you.
            </p>
            <Button size="lg" asChild>
              <Link href="#search">
                Try it now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Example Playlists Section */}
      <div className="py-20 px-4 md:px-6" id="search">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Learning Topics</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore these popular topics or search for anything you want to learn
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TopicCard topic="Learn JavaScript" />
            <TopicCard topic="Python for Beginners" />
            <TopicCard topic="React.js Tutorial" />
            <TopicCard topic="Machine Learning" />
            <TopicCard topic="Web Development" />
            <TopicCard topic="Data Science" />
            <TopicCard topic="UI/UX Design" />
            <TopicCard topic="Digital Marketing" />
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-center mb-8">Search for any topic</h3>
            <div className="max-w-2xl mx-auto">
              <SearchForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function TopicCard({ topic }: { topic: string }) {
  return (
    <Link
      href={`/playlist/${encodeURIComponent(topic)}`}
      className="bg-card hover:bg-accent rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all"
    >
      <span className="font-medium">{topic}</span>
    </Link>
  )
}

