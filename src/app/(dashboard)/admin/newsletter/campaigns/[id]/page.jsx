"use client"

import { use } from "react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { CampaignForm } from "@/components/newsletter/campaign-form"
import { CampaignSubscribers } from "@/components/newsletter/campaign-subscribers"
import { CampaignSettings } from "@/components/newsletter/campaign-settings"
import { CampaignTest } from "@/components/newsletter/campaign-test"
import { AnalyticsDashboard } from "@/components/newsletter/analytics-dashboard"
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye } from "lucide-react"

import { Preview } from "@/components/newsletter/preview"

export default function CampaignPage({ params }) {
  const id = use(params.id)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState(null)
  const isNew = id === "new"
  const [previewOpen, setPreviewOpen] = useState(false)

  const fetchCampaign = async () => {
    if (isNew) {
      setCampaign({
        name: "",
        subject: "",
        content: "",
        status: "DRAFT",
        metadata: {
          trackOpens: true,
          trackClicks: true,
        },
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/newsletter/campaigns/${id}`)
      if (!response.ok) throw new Error("Failed to fetch campaign")
      const data = await response.json()
      setCampaign(data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaign()
  }, [id])

  const handleUpdate = (updatedCampaign) => {
    setCampaign(updatedCampaign)
    
    toast.success("Campaign updated successfully")
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!campaign && !isNew) {
    return <div>Campaign not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/newsletter")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? "New Campaign" : campaign.name || "Untitled Campaign"}
          </h1>
        </div>
        {!isNew && (
          <Button
            variant="outline"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        )}
      </div>

      <Tabs defaultValue={isNew ? "content" : "overview"} className="space-y-4">
        <TabsList>
          {!isNew && <TabsTrigger value="overview">Overview</TabsTrigger>}
          <TabsTrigger value="content">Content</TabsTrigger>
          {!isNew && <TabsTrigger value="subscribers">Subscribers</TabsTrigger>}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {!isNew && (
          <TabsContent value="overview" className="space-y-4">
            <Card className="p-6">
              <AnalyticsDashboard campaignId={id} />
            </Card>
          </TabsContent>
        )}

        <TabsContent value="content">
          <Card className="p-6">
            <CampaignForm
              campaign={campaign}
              onUpdate={handleUpdate}
              isNew={isNew}
            />
          </Card>
        </TabsContent>

        {!isNew && (
          <TabsContent value="subscribers">
            <Card className="p-6">
              <CampaignSubscribers campaignId={id} />
            </Card>
          </TabsContent>
        )}

        <TabsContent value="settings">
          <Card className="p-6">
            <CampaignSettings
              campaign={campaign}
              onUpdate={handleUpdate}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <Preview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        campaign={campaign}
      />
    </div>
  )
}
