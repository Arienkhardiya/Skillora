"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DeploymentGuide() {
  const [copiedSteps, setCopiedSteps] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSteps({ ...copiedSteps, [stepId]: true })

    toast({
      title: "Copied to clipboard",
    })

    setTimeout(() => {
      setCopiedSteps({ ...copiedSteps, [stepId]: false })
    }, 2000)
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Deployment Guide</CardTitle>
        <CardDescription>
          Follow these steps to deploy your YouTube Playlist Generator application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vercel">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="vercel">Vercel Deployment</TabsTrigger>
            <TabsTrigger value="firebase">Firebase Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vercel" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">1. Prepare Your Repository</h3>
              <div className="bg-muted p-4 rounded-md relative">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                  # Clone the repository
                  git clone https://github.com/yourusername/youtube-playlist-generator.git
                  cd youtube-playlist-generator
                  
                  # Install dependencies
                  npm install
                  
                  # Make sure everything works locally
                  npm run dev
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`# Clone the repository
git clone https://github.com/yourusername/youtube-playlist-generator.git
cd youtube-playlist-generator

# Install dependencies
npm install

# Make sure everything works locally
npm run dev`, "step1")}
                >
                  {copiedSteps["step1"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <h3 className="text-lg font-medium">2. Set Up Vercel Account</h3>
              <p className="text-muted-foreground">
                If you don't already have a Vercel account, sign up at{" "}
                <a 
                  href="https://vercel.com/signup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  vercel.com/signup
                </a>
              </p>
              
              <h3 className="text-lg font-medium">3. Install Vercel CLI (Optional)</h3>
              <div className="bg-muted p-4 rounded-md relative">
                <pre className="text-sm overflow-x-auto">
                  npm install -g vercel
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard("npm install -g vercel", "step3")}
                >
                  {copiedSteps["step3"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <h3 className="text-lg font-medium">4. Deploy to Vercel</h3>
              <p className="text-muted-foreground mb-2">
                You can deploy using the Vercel CLI or directly from the Vercel dashboard by connecting your GitHub repository.
              </p>
              
              <div className="bg-muted p-4 rounded-md relative">
                <pre className="text-sm overflow-x-auto">
                  # Using Vercel CLI
                  vercel
                  
                  # Follow the prompts to configure your project
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`# Using Vercel CLI
vercel

# Follow the prompts to configure your project`, "step4")}
                >
                  {copiedSteps["step4"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <h3 className="text-lg font-medium">5. Set Environment Variables</h3>
              <p className="text-muted-foreground mb-2">
                Add the following environment variables in your Vercel project settings:
              </p>
              
              <div className="bg-muted p-4 rounded-md relative">
                <pre className="text-sm overflow-x-auto">
                  YOUTUBE_API_KEY=your_youtube_api_key
                  GEMINI_API_KEY=your_gemini_api_key
                  
                  # Firebase config
                  NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
                  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
                  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
                  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
                  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
                  NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key

# Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id`, "step5")}
                >
                  {copiedSteps["step5"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex justify-end">
                <Button asChild>
                  <a 
                    href="https://vercel.com/new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Deploy to Vercel <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="firebase" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">1. Create a Firebase Project</h3>
              <p className="text-muted-foreground">
                Go to the{" "}
                <a 
                  href="https://console.firebase.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Firebase Console
                </a>{" "}
                and create a new project.
              </p>
              
              <h3 className="text-lg font-medium">2. Enable Authentication</h3>
              <p className="text-muted-foreground mb-2">
                In the Firebase Console, go to Authentication and enable Google Sign-In.
              </p>
              
              <h3 className="text-lg font-medium">3. Create Firestore Database</h3>
              <p className="text-muted-foreground mb-2">
                In the Firebase Console, go to Firestore Database and create a new database in production mode.
              </p>
              
              <h3 className="text-lg font-medium">4. Set Up Firestore Security Rules</h3>
              <div className="bg-muted p-4 rounded-md relative">
                <pre className="text-sm overflow-x-auto">
                  rules_version = '2';
                  service cloud.firestore {\
                    match /databases/{database}/documents {
                      match /users/{userId} {
                        allow read, write: if request.auth != null && request.auth.uid == request.auth.uid;

                        match /history/{document=**} {
                          allow read, write: if request.auth != null && request.auth.uid == request.auth.uid;
                        }
                      }

                      match /learningPaths/{pathId} {
                        allow read: if true;
                        allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
                      }

                      match /idxProjects/{projectId} {
                        allow read: if true;
                        allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
                      }
                    }
                  }
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == request.auth.uid;

      match /history/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == request.auth.uid;
      }
    }

    match /learningPaths/{pathId} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    match /idxProjects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}`, "step4-firebase")}
                >
                  {copiedSteps["step4-firebase"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <h3 className="text-lg font-medium">5. Get Firebase Configuration</h3>
              <p className="text-muted-foreground mb-2">
                In the Firebase Console, go to Project Settings and scroll down to "Your apps". Click on the web app (create one if needed) and copy the Firebase configuration.
              </p>
              
              <div className="bg-muted p-4 rounded-md relative">
                <pre className="text-sm overflow-x-auto">
                  // Your web app's Firebase configuration
                  const firebaseConfig = {
                    apiKey: "YOUR_API_KEY",
                    authDomain: "YOUR_AUTH_DOMAIN",
                    projectId: "YOUR_PROJECT_ID",
                    storageBucket: "YOUR_STORAGE_BUCKET",
                    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
                    appId: "YOUR_APP_ID"
                  };
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};`, "step5-firebase")}
                >
                  {copiedSteps["step5-firebase"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <h3 className="text-lg font-medium">6. Update Firebase Configuration in Your App</h3>
              <p className="text-muted-foreground mb-2">
                Update the Firebase configuration in <code>lib/firebase.ts</code> with your Firebase project details or use environment variables as shown in the Vercel deployment tab.
              </p>
              
              <div className="flex justify-end">
                <Button asChild>
                  <a 
                    href="https://console.firebase.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Go to Firebase Console <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

