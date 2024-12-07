"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Loader2, Mail, Send, Users } from "lucide-react"
import { toast } from "sonner"
import { SubscriberList } from "@/components/newsletter/subscriber-list"
import { CampaignList } from "@/components/newsletter/campaign-list"
import { TemplateList } from "@/components/newsletter/template-list"
import Link from "next/link"

export default function NewsletterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    subscribers: 0,
    campaigns: 0,
    templates: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [subscribers, campaigns, templates] = await Promise.all([
          fetch("/api/newsletter/subscribers").then((res) => res.json()),
          fetch("/api/newsletter/campaigns").then((res) => res.json()),
          fetch("/api/newsletter/templates").then((res) => res.json()),
        ])

        setStats({
          subscribers: subscribers.length,
          campaigns: campaigns.length,
          templates: templates.length,
        })
      } catch (error) {
        toast.error("Failed to load newsletter stats")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Newsletter Management</h2>
          <Button onClick={() => router.push("/admin/newsletter/campaign/new")}>
            Create Campaign
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subscribers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.subscribers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Campaigns
                </CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.campaigns}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/admin/newsletter/campaign/new">
                    Create New Campaign
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/newsletter/welcome">
                    Manage Welcome Email
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="subscribers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          <TabsContent value="subscribers" className="space-y-4">
            <SubscriberList />
          </TabsContent>
          <TabsContent value="campaigns" className="space-y-4">
            <CampaignList />
          </TabsContent>
          <TabsContent value="templates" className="space-y-4">
            <TemplateList />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
