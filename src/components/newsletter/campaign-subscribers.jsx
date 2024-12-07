"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, UserPlus } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CampaignSubscribers({ campaignId }) {
  const [loading, setLoading] = useState(true)
  const [subscribers, setSubscribers] = useState([])
  const [availableSubscribers, setAvailableSubscribers] = useState([])
  const [open, setOpen] = useState(false)

  const fetchSubscribers = async () => {
    try {
      const response = await fetch(`/api/newsletter/campaigns/${campaignId}`)
      const data = await response.json()
      setSubscribers(data.subscribers || [])
    } catch (error) {
      toast.error("Failed to load campaign subscribers")
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSubscribers = async () => {
    try {
      const response = await fetch("/api/newsletter/subscribers")
      const data = await response.json()
      const currentIds = subscribers.map((s) => s.subscriberId)
      setAvailableSubscribers(
        data.filter((s) => !currentIds.includes(s.id) && s.status === "SUBSCRIBED")
      )
    } catch (error) {
      toast.error("Failed to load available subscribers")
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [campaignId])

  useEffect(() => {
    if (open) {
      fetchAvailableSubscribers()
    }
  }, [open, subscribers])

  const addSubscriber = async (subscriber) => {
    try {
      const response = await fetch(
        `/api/newsletter/campaigns/${campaignId}/subscribers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriberId: subscriber.id }),
        }
      )

      if (!response.ok) throw new Error("Failed to add subscriber")

      await fetchSubscribers()
      toast.success("Subscriber added to campaign")
    } catch (error) {
      toast.error("Failed to add subscriber")
    }
  }

  const removeSubscriber = async (subscriberId) => {
    try {
      const response = await fetch(
        `/api/newsletter/campaigns/${campaignId}/subscribers/${subscriberId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) throw new Error("Failed to remove subscriber")

      await fetchSubscribers()
      toast.success("Subscriber removed from campaign")
    } catch (error) {
      toast.error("Failed to remove subscriber")
    }
  }

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Campaign Subscribers</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Subscribers
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Subscribers</DialogTitle>
            </DialogHeader>
            <Command>
              <CommandInput placeholder="Search subscribers..." />
              <CommandEmpty>No subscribers found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-72">
                  {availableSubscribers.map((subscriber) => (
                    <CommandItem
                      key={subscriber.id}
                      onSelect={() => {
                        addSubscriber(subscriber)
                        setOpen(false)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {subscriber.email}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </Command>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead>Clicked</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.subscriber.email}</TableCell>
                <TableCell>
                  {sub.subscriber.firstName} {sub.subscriber.lastName}
                </TableCell>
                <TableCell>
                  {sub.bounced ? (
                    <Badge variant="destructive">Bounced</Badge>
                  ) : sub.sentAt ? (
                    <Badge variant="success">Sent</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {sub.sentAt ? new Date(sub.sentAt).toLocaleString() : "—"}
                </TableCell>
                <TableCell>
                  {sub.openedAt ? new Date(sub.openedAt).toLocaleString() : "—"}
                </TableCell>
                <TableCell>
                  {sub.clickedAt ? new Date(sub.clickedAt).toLocaleString() : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubscriber(sub.subscriberId)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {subscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No subscribers added to this campaign yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
