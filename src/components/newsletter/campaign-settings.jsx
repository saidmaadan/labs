"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

const formSchema = z.object({
  scheduledFor: z.string().optional(),
  metadata: z.object({
    trackOpens: z.boolean().default(true),
    trackClicks: z.boolean().default(true),
    sendFromName: z.string().optional(),
    sendFromEmail: z.string().email().optional(),
    replyToEmail: z.string().email().optional(),
  }),
})

export function CampaignSettings({ campaign, onUpdate }) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduledFor: campaign?.scheduledFor
        ? format(new Date(campaign.scheduledFor), "yyyy-MM-dd'T'HH:mm")
        : "",
      metadata: {
        trackOpens: campaign?.metadata?.trackOpens ?? true,
        trackClicks: campaign?.metadata?.trackClicks ?? true,
        sendFromName: campaign?.metadata?.sendFromName || "",
        sendFromEmail: campaign?.metadata?.sendFromEmail || "",
        replyToEmail: campaign?.metadata?.replyToEmail || "",
      },
    },
  })

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/newsletter/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to update settings")

      const updatedCampaign = await response.json()
      onUpdate(updatedCampaign)
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Scheduling</h3>
            <p className="text-sm text-muted-foreground">
              Configure when this campaign should be sent
            </p>
          </div>
          <FormField
            control={form.control}
            name="scheduledFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule Send</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty to send manually
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Configure email tracking options
            </p>
          </div>

          <FormField
            control={form.control}
            name="metadata.trackOpens"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Track Opens</FormLabel>
                  <FormDescription>
                    Track when recipients open your emails
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metadata.trackClicks"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Track Clicks</FormLabel>
                  <FormDescription>
                    Track when recipients click links in your emails
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Sender Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure how your email appears to recipients
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="metadata.sendFromName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Name" />
                  </FormControl>
                  <FormDescription>
                    The name that appears in the from field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.sendFromEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                    />
                  </FormControl>
                  <FormDescription>
                    The email address that appears in the from field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="metadata.replyToEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reply-To Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="replies@example.com"
                  />
                </FormControl>
                <FormDescription>
                  The email address that receives replies
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </form>
    </Form>
  )
}
