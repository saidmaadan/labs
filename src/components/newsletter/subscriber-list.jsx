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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MoreHorizontal, User, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SubscriberForm } from "./subscriber-form"

const statusColors = {
  SUBSCRIBED: "success",
  UNSUBSCRIBED: "destructive",
  PENDING: "warning",
  BOUNCED: "destructive",
}

export function SubscriberList() {
  const [loading, setLoading] = useState(true)
  const [subscribers, setSubscribers] = useState([])
  const [selectedSubscriber, setSelectedSubscriber] = useState(null)
  const [open, setOpen] = useState(false)

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/newsletter/subscribers")
      const data = await response.json()
      setSubscribers(data)
    } catch (error) {
      toast.error("Failed to load subscribers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      await fetchSubscribers()
      toast.success("Subscriber status updated")
    } catch (error) {
      toast.error("Failed to update subscriber status")
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete subscriber")

      await fetchSubscribers()
      toast.success("Subscriber deleted")
    } catch (error) {
      toast.error("Failed to delete subscriber")
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
        <h3 className="text-lg font-medium">Subscribers</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Subscriber
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedSubscriber ? "Edit Subscriber" : "Add New Subscriber"}
              </DialogTitle>
            </DialogHeader>
            <SubscriberForm
              subscriber={selectedSubscriber}
              onSuccess={() => {
                setOpen(false)
                setSelectedSubscriber(null)
                fetchSubscribers()
              }}
            />
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
              <TableHead>Subscribed</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">{subscriber.email}</TableCell>
                <TableCell>
                  {subscriber.firstName} {subscriber.lastName}
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[subscriber.status]}>
                    {subscriber.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {subscriber.confirmedAt
                    ? formatDistanceToNow(new Date(subscriber.confirmedAt), {
                        addSuffix: true,
                      })
                    : "Never"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedSubscriber(subscriber)
                          setOpen(true)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      {subscriber.status !== "SUBSCRIBED" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(subscriber.id, "SUBSCRIBED")
                          }
                        >
                          Mark as Subscribed
                        </DropdownMenuItem>
                      )}
                      {subscriber.status !== "UNSUBSCRIBED" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(subscriber.id, "UNSUBSCRIBED")
                          }
                        >
                          Mark as Unsubscribed
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(subscriber.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
