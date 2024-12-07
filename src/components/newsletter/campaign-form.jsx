"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { format } from "date-fns"

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-md border">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
})

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  templateId: z.string().optional(),
  scheduledFor: z.string().optional(),
})

export function CampaignForm({ campaign, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign?.name || "",
      subject: campaign?.subject || "",
      content: campaign?.content || "",
      templateId: campaign?.templateId || "none",
      scheduledFor: campaign?.scheduledFor
        ? format(new Date(campaign.scheduledFor), "yyyy-MM-dd'T'HH:mm")
        : "",
    },
  })

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/newsletter/templates")
        const data = await response.json()
        setTemplates(data)
      } catch (error) {
        toast.error("Failed to load templates")
      }
    }

    fetchTemplates()
  }, [])

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const formData = {
        ...values,
        templateId: values.templateId === "none" ? null : values.templateId,
      }

      const response = await fetch(
        campaign
          ? `/api/newsletter/campaigns/${campaign.id}`
          : "/api/newsletter/campaigns",
        {
          method: campaign ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) throw new Error("Failed to save campaign")

      const savedCampaign = await response.json()
      onSuccess(savedCampaign)
    } catch (error) {
      toast.error("Failed to save campaign")
    } finally {
      setLoading(false)
    }
  }

  const onTemplateChange = async (templateId) => {
    if (!templateId || templateId === "none") return

    const template = templates.find((t) => t.id === templateId)
    if (!template) return

    form.setValue("subject", template.subject)
    form.setValue("content", template.content)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Monthly Newsletter" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="templateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Template</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    onTemplateChange(value)
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Subject</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your email subject" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Content</FormLabel>
              <FormControl>
                <Editor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write your email content here..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {campaign ? "Update Campaign" : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
