import { GoogleGenerativeAI } from "@google/generative-ai"
import type { CategorizedVideos, VideoType } from "@/types"

// Initialize the Gemini API with the hardcoded API key
const GEMINI_API_KEY = "AIzaSyCZPInH2Wd86-fTqfi9FsRLc0gpyQ3IziM"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function filterAndCategorizeVideosWithGemini(
  videos: VideoType[],
  query: string,
): Promise<CategorizedVideos> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Prepare the prompt for Gemini
    const prompt = `
      I have a list of YouTube videos about "${query}". 
      Please categorize them into beginner, intermediate, and advanced levels based on their titles and descriptions.
      
      Videos: ${JSON.stringify(videos, null, 2)}
      
      Return your response as a valid JSON object with three arrays: beginner, intermediate, and advanced.
      Each array should contain the video IDs that belong to that category.
      The response should be ONLY the JSON object, nothing else.
    `

    // Generate content with Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : '{"beginner":[],"intermediate":[],"advanced":[]}'

    // Parse the AI response
    const aiCategorization = JSON.parse(jsonStr)

    // Map the categorization back to the full video objects
    const categorizedVideos: CategorizedVideos = {
      beginner: videos.filter((v) => aiCategorization.beginner?.includes(v.id)) || [],
      intermediate: videos.filter((v) => aiCategorization.intermediate?.includes(v.id)) || [],
      advanced: videos.filter((v) => aiCategorization.advanced?.includes(v.id)) || [],
    }

    // If any category is empty, add some videos as fallback
    if (categorizedVideos.beginner.length === 0) {
      categorizedVideos.beginner = videos.slice(0, Math.min(5, videos.length))
    }
    if (categorizedVideos.intermediate.length === 0 && videos.length > 5) {
      categorizedVideos.intermediate = videos.slice(5, Math.min(10, videos.length))
    }
    if (categorizedVideos.advanced.length === 0 && videos.length > 10) {
      categorizedVideos.advanced = videos.slice(10)
    }

    return categorizedVideos
  } catch (error) {
    console.error("Error categorizing videos with Gemini:", error)

    // Fallback to simple categorization if Gemini fails
    const categorizedVideos: CategorizedVideos = {
      beginner: [],
      intermediate: [],
      advanced: [],
    }

    videos.forEach((video, index) => {
      if (index < 5) {
        categorizedVideos.beginner.push(video)
      } else if (index >= 5 && index < 10) {
        categorizedVideos.intermediate.push(video)
      } else {
        categorizedVideos.advanced.push(video)
      }
    })

    return categorizedVideos
  }
}

// Other functions remain the same
export async function generateLearningPathWithGemini(
  query: string,
): Promise<{ title: string; description: string; steps: string[] }> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Prepare the prompt for Gemini
    const prompt = `
      Create a learning path for someone who wants to learn "${query}".
      Return your response as a valid JSON object with the following structure:
      {
        "title": "A catchy title for the learning path",
        "description": "A brief description of what the learner will achieve",
        "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."] (5-7 steps)
      }
      The response should be ONLY the JSON object, nothing else.
    `

    // Generate content with Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch
      ? jsonMatch[0]
      : '{"title":"Learning Path","description":"A structured approach to learning","steps":["Step 1: Basics","Step 2: Practice","Step 3: Advanced"]}'

    // Parse the AI response
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error("Error generating learning path with Gemini:", error)

    // Fallback if Gemini fails
    return {
      title: `Learning Path for ${query}`,
      description: `A structured approach to mastering ${query} from beginner to advanced level.`,
      steps: [
        "Step 1: Understand the fundamentals",
        "Step 2: Practice with simple projects",
        "Step 3: Learn intermediate concepts",
        "Step 4: Build more complex projects",
        "Step 5: Master advanced techniques",
      ],
    }
  }
}

export async function generateProjectIdeasWithGemini(
  query: string,
  skillLevel = "intermediate",
): Promise<{ title: string; description: string; technologies: string[]; difficulty: string }[]> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Prepare the prompt for Gemini
    const prompt = `
      Generate 3 project ideas for someone learning "${query}" at a ${skillLevel} level.
      Return your response as a valid JSON array with objects having this structure:
      [
        {
          "title": "Project title",
          "description": "Brief description of the project",
          "technologies": ["Tech 1", "Tech 2"],
          "difficulty": "Easy/Medium/Hard"
        }
      ]
      The response should be ONLY the JSON array, nothing else.
    `

    // Generate content with Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const jsonStr = jsonMatch
      ? jsonMatch[0]
      : '[{"title":"Sample Project","description":"A simple project","technologies":["Technology 1"],"difficulty":"Medium"}]'

    // Parse the AI response
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error("Error generating project ideas with Gemini:", error)

    // Fallback if Gemini fails
    return [
      {
        title: `${query} Portfolio Project`,
        description: `Build a portfolio showcasing your ${query} skills.`,
        technologies: [query, "HTML", "CSS"],
        difficulty: "Medium",
      },
      {
        title: `${query} Tutorial App`,
        description: `Create an interactive tutorial application for ${query}.`,
        technologies: [query, "JavaScript", "React"],
        difficulty: "Medium",
      },
      {
        title: `${query} Data Visualization`,
        description: `Develop a data visualization tool related to ${query}.`,
        technologies: [query, "D3.js", "SVG"],
        difficulty: "Hard",
      },
    ]
  }
}

