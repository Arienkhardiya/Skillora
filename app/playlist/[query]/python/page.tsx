"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BookOpen, Code, Copy, Play, Terminal } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PythonPlaylistPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const query = decodeURIComponent(params.query as string)
  const [code, setCode] = useState<string>("")
  const [output, setOutput] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // Generate Python code based on the query
    const generatePythonCode = () => {
      const pythonCode = `# Python learning script for: ${query}

# Import necessary libraries
import random
import time

def main():
    print(f"Welcome to your Python learning journey for {query}!")
    print("This is an interactive Python environment to practice your skills.")
    print("=" * 50)
    
    # Simulate some basic operations related to the topic
    print(f"Generating sample ${query} content...")
    time.sleep(1)  # Simulate processing
    
    # Generate some random data based on the topic
    sample_data = [random.randint(1, 100) for _ in range(10)]
    print(f"Sample data: {sample_data}")
    print(f"Sum: {sum(sample_data)}")
    print(f"Average: {sum(sample_data)/len(sample_data):.2f}")
    print(f"Max: {max(sample_data)}")
    print(f"Min: {min(sample_data)}")
    
    # Provide a learning tip
    tips = [
        "Remember to practice regularly!",
        "Try to build small projects to reinforce your learning.",
        "Collaborate with others to learn faster.",
        "Don't be afraid to make mistakes - they're part of learning!",
        "Document your code as you write it."
    ]
    print("\\nLearning tip:", random.choice(tips))
    
    print("\\nHappy coding!")

if __name__ == "__main__":
    main()
`
      setCode(pythonCode)
    }

    generatePythonCode()
  }, [query])

  const runCode = () => {
    setIsRunning(true)
    setOutput("Running code...\n")

    // Simulate Python execution (in a real app, this would call a backend service)
    setTimeout(() => {
      const simulatedOutput = `Welcome to your Python learning journey for ${query}!
This is an interactive Python environment to practice your skills.
==================================================
Generating sample ${query} content...
Sample data: [23, 45, 67, 12, 89, 34, 56, 78, 90, 43]
Sum: 537
Average: 53.70
Max: 90
Min: 12

Learning tip: Try to build small projects to reinforce your learning.

Happy coding!`

      setOutput(simulatedOutput)
      setIsRunning(false)
    }, 2000)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste it in your local Python environment",
    })
  }

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/playlist/${params.query}`}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Video Playlist
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Python Learning Environment: <span className="text-primary">{query}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Practice Python programming related to {query}. Run code directly in your browser and see the results
            instantly.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8 border-none shadow-lg overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Interactive Python Environment</CardTitle>
            <CardDescription>
              Edit the code below and run it to see the output. This environment is perfect for experimenting with
              Python concepts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" /> Code Editor
                </TabsTrigger>
                <TabsTrigger value="output" className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" /> Output
                </TabsTrigger>
              </TabsList>
              <TabsContent value="code">
                <div className="relative">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono h-[400px] resize-none p-4 bg-muted/50"
                  />
                  <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={copyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="output">
                <div className="font-mono bg-black text-green-400 p-4 rounded-md h-[400px] overflow-auto whitespace-pre-wrap">
                  {output || "Run the code to see output here..."}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/playlist/${params.query}`}>
                <BookOpen className="mr-2 h-4 w-4" /> Back to Learning Materials
              </Link>
            </Button>
            <Button onClick={runCode} disabled={isRunning} className="relative overflow-hidden">
              {isRunning ? (
                <span className="flex items-center">
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  />
                  Running...
                </span>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Run Code
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Resources for Python {query}</CardTitle>
            <CardDescription>Here are some additional resources to help you learn Python for {query}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCard
                title="Official Python Documentation"
                description="Comprehensive documentation for Python language and standard library."
                link="https://docs.python.org/3/"
              />
              <ResourceCard
                title="Real Python Tutorials"
                description="Practical Python tutorials for developers of all skill levels."
                link="https://realpython.com/"
              />
              <ResourceCard
                title="Python for Data Science Handbook"
                description="Essential tools for working with data in Python."
                link="https://jakevdp.github.io/PythonDataScienceHandbook/"
              />
              <ResourceCard
                title="Automate the Boring Stuff with Python"
                description="Practical programming for total beginners."
                link="https://automatetheboringstuff.com/"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function ResourceCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.a>
  )
}

