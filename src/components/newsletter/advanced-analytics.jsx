"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AdvancedAnalytics({ campaignId }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    deviceStats: [],
    browserStats: [],
    topLinks: [],
    hourlyEngagement: [],
    geographicData: [],
  })

  const fetchAdvancedAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/newsletter/analytics/advanced?campaignId=${campaignId}`
      )
      if (!response.ok) throw new Error("Failed to fetch analytics")
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("Failed to fetch advanced analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdvancedAnalytics()
  }, [campaignId])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Email opens by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deviceStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.deviceStats.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browser Usage</CardTitle>
            <CardDescription>Email opens by browser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.browserStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.browserStats.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Opens by location</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Opens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.geographicData.map((item) => (
                    <TableRow key={item.location}>
                      <TableCell>{item.location}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Clicked Links</CardTitle>
          <CardDescription>Top performing links in your campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Unique Clicks</TableHead>
                <TableHead>Last Clicked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topLinks.map((link) => (
                <TableRow key={link.url}>
                  <TableCell className="font-medium">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {link.url}
                    </a>
                  </TableCell>
                  <TableCell>{link.clicks}</TableCell>
                  <TableCell>{link.uniqueClicks}</TableCell>
                  <TableCell>
                    {format(new Date(link.lastClicked), "MMM d, yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Hours</CardTitle>
          <CardDescription>
            When your subscribers are most active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hour</TableHead>
                <TableHead>Opens</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Engagement Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.hourlyEngagement.map((hour) => (
                <TableRow key={hour.hour}>
                  <TableCell>
                    {format(new Date().setHours(hour.hour, 0), "ha")}
                  </TableCell>
                  <TableCell>{hour.opens}</TableCell>
                  <TableCell>{hour.clicks}</TableCell>
                  <TableCell>
                    {Math.round((hour.clicks / hour.opens) * 100)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
