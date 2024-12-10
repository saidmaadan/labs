import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { prisma } from "@/lib/prisma"
import { Skeleton } from "@/components/ui/skeleton"

async function getStats() {
  const [projectCount, postCount, categoryCount, subscriberCount, userCount] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.subscriber.count(),
    prisma.user.count(),
    prisma.category.count(),
  ])

  return {
    projectCount,
    postCount,
    subscriberCount,
    userCount,
    categoryCount
  }
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-[100px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px]" />
      </CardContent>
    </Card>
  )
}

async function StatsCards() {
  const stats = await getStats()
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ stats.projectCount}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ stats.postCount}</div>
            <p className="text-xs text-muted-foreground">
              +4 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ stats.categoryCount}</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ stats.subscriberCount}</div>
            <p className="text-xs text-muted-foreground">
              +201 from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentProjects />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
        }
      >
        <StatsCards />
      </Suspense>
    // <div className="flex flex-col gap-4">
    //   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">12</div>
    //         <p className="text-xs text-muted-foreground">
    //           +2 from last month
    //         </p>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">24</div>
    //         <p className="text-xs text-muted-foreground">
    //           +4 from last month
    //         </p>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Categories</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">8</div>
    //         <p className="text-xs text-muted-foreground">
    //           +1 from last month
    //         </p>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">573</div>
    //         <p className="text-xs text-muted-foreground">
    //           +201 from last month
    //         </p>
    //       </CardContent>
    //     </Card>
    //   </div>
    //   <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
    //     <Card className="col-span-4">
    //       <CardHeader>
    //         <CardTitle>Overview</CardTitle>
    //       </CardHeader>
    //       <CardContent className="pl-2">
    //         <Overview />
    //       </CardContent>
    //     </Card>
    //     <Card className="col-span-3">
    //       <CardHeader>
    //         <CardTitle>Recent Projects</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <RecentProjects />
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
  )
}
