"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function Preview({ open, onOpenChange, campaign }) {
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState("")

  const handleSendTest = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/newsletter/campaigns/${campaign.id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      })

      if (!response.ok) throw new Error("Failed to send test email")

      toast.success("Test email sent successfully")
    } catch (error) {
      toast.error("Failed to send test email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Campaign Preview</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="test">Send Test</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <div className="rounded-md border bg-muted px-4 py-2">
                {campaign?.subject}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <div
                className="prose prose-sm max-w-none rounded-md border bg-background p-4"
                dangerouslySetInnerHTML={{ __html: campaign?.content }}
              />
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="test-email"
                  type="email"
                  placeholder="Enter test email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <Button onClick={handleSendTest} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Test
                </Button>
              </div>
            </div>

            <div className="rounded-md border bg-muted p-4 text-sm text-muted-foreground">
              <p>
                Send a test email to verify how your campaign will look in different
                email clients. The test email will be sent immediately.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
