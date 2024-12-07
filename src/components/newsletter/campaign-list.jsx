"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, MoreHorizontal, Send } from "lucide-react"
import { toast } from "sonner"
import { format, formatDistanceToNow } from "date-fns"

const statusColors = {
  DRAFT: "secondary",
  SCHEDULED: "warning",
  SENDING: "warning",
  SENT: "success",
  FAILED: "destructive",
}

function CampaignStatus({ status }) {
  return (
    <Badge variant={statusColors[status]}>
      {status}
    </Badge>
  )
}

export function CampaignList() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState([])
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/newsletter/campaigns")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      toast.error("Failed to load campaigns")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const handleSendCampaign = async (id) => {
    try {
      const response = await fetch(`/api/newsletter/campaigns/${id}`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to send campaign")

      await fetchCampaigns()
      toast.success("Campaign sent successfully")
    } catch (error) {
      toast.error("Failed to send campaign")
    }
    setSendDialogOpen(false)
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/newsletter/campaigns/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete campaign")

      await fetchCampaigns()
      toast.success("Campaign deleted")
    } catch (error) {
      toast.error("Failed to delete campaign")
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
        <h3 className="text-lg font-medium">Campaigns</h3>
        <Button onClick={() => router.push("/admin/newsletter/campaign/new")}>
          <Send className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Opens</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  {campaign.name || "Untitled Campaign"}
                </TableCell>
                <TableCell>
                  <CampaignStatus status={campaign.status} />
                </TableCell>
                <TableCell>{campaign.sentCount || 0}</TableCell>
                <TableCell>
                  {campaign._count?.events
                    ? `${Math.round((campaign.openCount / campaign.sentCount) * 100)}%`
                    : "—"}
                </TableCell>
                <TableCell>
                  {campaign._count?.events
                    ? `${Math.round((campaign.clickCount / campaign.sentCount) * 100)}%`
                    : "—"}
                </TableCell>
                <TableCell>
                  {format(new Date(campaign.createdAt), "MMM d, yyyy")}
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
                        onClick={() =>
                          router.push(`/admin/newsletter/campaign/${campaign.id}`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      {campaign.status === "DRAFT" && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCampaign(campaign)
                            setSendDialogOpen(true)
                          }}
                        >
                          Send Campaign
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(campaign.id)}
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

      <AlertDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this campaign? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSendCampaign(selectedCampaign?.id)}
            >
              Send
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
