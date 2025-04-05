import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PlaylistSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="mb-8">
        <CardContent className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-lg mb-6" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="beginner">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="beginner" disabled>
            Beginner
          </TabsTrigger>
          <TabsTrigger value="intermediate" disabled>
            Intermediate
          </TabsTrigger>
          <TabsTrigger value="advanced" disabled>
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="beginner">
          <div className="flex items-start gap-4 mb-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full max-w-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VideoCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />

      <CardContent className="p-4">
        <Skeleton className="h-6 w-full mb-2" />
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

