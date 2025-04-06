import { DeploymentGuide } from "@/components/deployment-guide"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DeployPage() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Deployment Instructions</h1>
          <p className="text-muted-foreground max-w-2xl">
            Follow these steps to deploy your YouTube Playlist Generator application to Vercel and set up Firebase for
            authentication and data storage.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DeploymentGuide />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>You'll need these accounts and API keys to deploy the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Vercel Account</h3>
                  <p className="text-sm text-muted-foreground">For hosting the Next.js application</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Firebase Account</h3>
                  <p className="text-sm text-muted-foreground">For authentication and database</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">YouTube API Key</h3>
                  <p className="text-sm text-muted-foreground">For fetching video data from YouTube</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Gemini API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    For AI-powered content categorization and learning paths
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>Common issues and their solutions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Firebase Authentication Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure you've enabled Google Sign-In in the Firebase Console and added your domain to the
                    authorized domains list.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">API Key Errors</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure all API keys are correctly set in your environment variables and have the necessary
                    permissions.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Gemini API Model Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify you're using the correct model name "gemini-1.5-pro" in your API calls.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

