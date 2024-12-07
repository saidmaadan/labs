import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UAParser } from "ua-parser-js"
import { format } from "date-fns"

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams
    const campaignId = searchParams.get("campaignId")

    if (!campaignId) {
      return new NextResponse("Campaign ID is required", { status: 400 })
    }

    // Get all events for the campaign
    const events = await prisma.campaignEmailEvent.findMany({
      where: {
        campaignId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Process device and browser stats
    const deviceStats = new Map()
    const browserStats = new Map()
    const locationStats = new Map()
    const clickedLinks = new Map()
    const hourlyStats = new Map()

    events.forEach((event) => {
      if (event.userAgent) {
        const parser = new UAParser(event.userAgent)
        const device = parser.getDevice().type || "desktop"
        const browser = parser.getBrowser().name || "unknown"

        // Update device stats
        deviceStats.set(device, (deviceStats.get(device) || 0) + 1)
        
        // Update browser stats
        browserStats.set(browser, (browserStats.get(browser) || 0) + 1)
      }

      // Update location stats
      if (event.ipAddress) {
        locationStats.set(
          event.ipAddress,
          (locationStats.get(event.ipAddress) || 0) + 1
        )
      }

      // Track clicked links
      if (event.type === "CLICK" && event.url) {
        const linkStats = clickedLinks.get(event.url) || {
          url: event.url,
          clicks: 0,
          uniqueClicks: new Set(),
          lastClicked: null,
        }
        linkStats.clicks++
        linkStats.uniqueClicks.add(event.subscriberId)
        linkStats.lastClicked = event.createdAt
        clickedLinks.set(event.url, linkStats)
      }

      // Track hourly engagement
      const hour = new Date(event.createdAt).getHours()
      const hourStats = hourlyStats.get(hour) || { opens: 0, clicks: 0 }
      if (event.type === "OPEN") hourStats.opens++
      if (event.type === "CLICK") hourStats.clicks++
      hourlyStats.set(hour, hourStats)
    })

    // Format data for response
    const response = {
      deviceStats: Array.from(deviceStats.entries()).map(([name, value]) => ({
        name,
        value,
      })),
      browserStats: Array.from(browserStats.entries()).map(([name, value]) => ({
        name,
        value,
      })),
      geographicData: Array.from(locationStats.entries())
        .map(([location, count]) => ({
          location,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      topLinks: Array.from(clickedLinks.values())
        .map((link) => ({
          url: link.url,
          clicks: link.clicks,
          uniqueClicks: link.uniqueClicks.size,
          lastClicked: link.lastClicked,
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10),
      hourlyEngagement: Array.from(hourlyStats.entries())
        .map(([hour, stats]) => ({
          hour,
          ...stats,
        }))
        .sort((a, b) => a.hour - b.hour),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching advanced analytics:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
