"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function WelcomeCampaignPage() {
  const [isLoading, setIsLoading] = useState(false)

  const createWelcomeCampaign = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/newsletter/welcome-campaign", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create welcome campaign")
      }

      toast.success(data.message)
    } catch (error) {
      // console.error("Welcome campaign error:", error)
      toast.error(error.message || "Failed to create welcome campaign")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Campaign</CardTitle>
          <CardDescription>
            Create or manage the welcome email that new subscribers receive when they confirm their subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={createWelcomeCampaign}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Welcome Campaign...
              </>
            ) : (
              "Create Welcome Campaign"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
