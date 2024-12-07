"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Mail, Eye } from "lucide-react"
import { toast } from "sonner"

export function CampaignTest({ campaign }) {
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [previewMode, setPreviewMode] = useState("desktop")

  const sendTestEmail = async () => {
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

  const getPreviewFrame = () => {
    const baseStyles = "w-full bg-white"
    switch (previewMode) {
      case "desktop":
        return "max-w-4xl h-[600px]"
      case "tablet":
        return "max-w-md h-[800px]"
      case "mobile":
        return "max-w-xs h-[700px]"
      default:
        return "max-w-4xl h-[600px]"
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Preview & Test
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[800px]">
        <DialogHeader>
          <DialogTitle>Preview Campaign</DialogTitle>
          <DialogDescription>
            Preview how your campaign will look and send a test email
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="h-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="test">Send Test</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="h-full">
            <div className="space-y-4 h-full">
              <div className="flex justify-end space-x-2">
                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                >
                  Desktop
                </Button>
                <Button
                  variant={previewMode === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("tablet")}
                >
                  Tablet
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                >
                  Mobile
                </Button>
              </div>

              <div className="border rounded-lg p-4 h-[calc(100%-60px)] overflow-hidden">
                <iframe
                  srcDoc={campaign.content}
                  className={`${baseStyles} ${getPreviewFrame()}`}
                  title="Campaign Preview"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="test">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  placeholder="Enter email address"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">What will be tested:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Email content and formatting</li>
                  <li>Subject line: {campaign.subject}</li>
                  {campaign.metadata?.trackOpens && (
                    <li>Open tracking pixel</li>
                  )}
                  {campaign.metadata?.trackClicks && (
                    <li>Click tracking on all links</li>
                  )}
                  <li>Sender name and reply-to settings</li>
                </ul>
              </div>

              <DialogFooter>
                <Button
                  onClick={sendTestEmail}
                  disabled={loading}
                >
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Mail className="mr-2 h-4 w-4" />
                  Send Test Email
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
