"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export function SearchForm() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      toast({
        title: "Please enter a search query",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Encode the query for URL
      const encodedQuery = encodeURIComponent(query)
      router.push(`/playlist/${encodedQuery}`)
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Error generating playlist",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row w-full items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="What do you want to learn? (e.g., 'JavaScript', 'Machine Learning')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto" size="lg">
          {loading ? (
            <span className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Generating...
            </span>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Generate Playlist
            </>
          )}
        </Button>
      </div>
    </motion.form>
  )
}

