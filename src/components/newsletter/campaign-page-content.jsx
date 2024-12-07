"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { CampaignForm } from "@/components/newsletter/campaign-form"
import { CampaignSubscribers } from "@/components/newsletter/campaign-subscribers"
import { CampaignSettings } from "@/components/newsletter/campaign-settings"
import { AnalyticsDashboard } from "@/components/newsletter/analytics-dashboard"
import { toast } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function CampaignPageContent({ params }) {
  const router = useRouter()
  const isNew = params.id === "new"
  const [loading, setLoading] = useState(!isNew)
  const [campaign, setCampaign] = useState(null)

  const fetchCampaign = async () => {
    if (isNew || !params.id) return
    try {
      setLoading(true)
      const response = await fetch(`/api/newsletter/campaigns/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch campaign")
      const data = await response.json()
      setCampaign(data)
    } catch (error) {
      toast.error("Failed to load campaign details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchCampaign()
    }
  }, [params.id])

  const handleUpdate = (updatedCampaign) => {
    setCampaign(updatedCampaign)
    if (isNew) {
      router.push(`/admin/newsletter/campaign/${updatedCampaign.id}`)
    }
    toast.success("Campaign saved successfully")
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isNew && !campaign) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Campaign not found</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {isNew ? "Create Campaign" : "Edit Campaign"}
        </h2>
        <p className="text-muted-foreground">
          {isNew
            ? "Create a new email campaign"
            : "Make changes to your email campaign"}
        </p>
      </div>

      {isNew ? (
        <Card className="p-6">
          <CampaignForm onSuccess={handleUpdate} />
        </Card>
      ) : (
        <Tabs defaultValue="edit" className="space-y-4">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-4">
            <Card className="p-6">
              <CampaignForm campaign={campaign} onSuccess={handleUpdate} />
            </Card>
          </TabsContent>
          <TabsContent value="subscribers" className="space-y-4">
            <Card className="p-6">
              <CampaignSubscribers campaign={campaign} />
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <CampaignSettings campaign={campaign} onSuccess={handleUpdate} />
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card className="p-6">
              <AnalyticsDashboard campaign={campaign} />
            </Card>
          </TabsContent>
        </Tabs>
      )}
      </div>
      </TooltipProvider>
  )
}
