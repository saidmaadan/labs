import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { format, parseISO, eachDayOfInterval } from "date-fns"

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams
    const campaignId = searchParams.get("campaignId")
    const startDate = parseISO(searchParams.get("startDate"))
    const endDate = parseISO(searchParams.get("endDate"))

    // Base query conditions
    const whereConditions = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (campaignId) {
      whereConditions.campaignId = campaignId
    }

    // Get overview statistics
    const [totalSubscribers, eventCounts, bounceCount] = await Promise.all([
      prisma.subscriber.count({
        where: { status: "SUBSCRIBED" },
      }),
      prisma.campaignEmailEvent.groupBy({
        by: ["type"],
        where: whereConditions,
        _count: true,
      }),
      prisma.campaignEmailEvent.count({
        where: {
          ...whereConditions,
          type: "BOUNCE",
        },
      }),
    ])

    // Transform event counts into overview stats
    const overview = {
      totalSubscribers,
      totalSent: 0, // Will be calculated from campaign data
      totalOpens: eventCounts.find((e) => e.type === "OPEN")?._count || 0,
      totalClicks: eventCounts.find((e) => e.type === "CLICK")?._count || 0,
      totalBounces: bounceCount,
    }

    // Get sent count from campaigns
    const campaignStats = await prisma.campaign.aggregate({
      where: campaignId ? { id: campaignId } : {},
      _sum: {
        sentCount: true,
      },
    })
    overview.totalSent = campaignStats._sum.sentCount || 0

    // Get daily statistics
    const dailyStats = await Promise.all(
      eachDayOfInterval({ start: startDate, end: endDate }).map(
        async (date) => {
          const nextDay = new Date(date)
          nextDay.setDate(date.getDate() + 1)

          const dayStats = await prisma.campaignEmailEvent.groupBy({
            by: ["type"],
            where: {
              ...whereConditions,
              createdAt: {
                gte: date,
                lt: nextDay,
              },
            },
            _count: true,
          })

          return {
            date: format(date, "yyyy-MM-dd"),
            opens: dayStats.find((s) => s.type === "OPEN")?._count || 0,
            clicks: dayStats.find((s) => s.type === "CLICK")?._count || 0,
          }
        }
      )
    )

    // Get events by device/client
    const eventsByDevice = await prisma.campaignEmailEvent.groupBy({
      by: ["userAgent"],
      where: whereConditions,
      _count: true,
      orderBy: {
        _count: "desc",
      },
      take: 10,
    })

    // Get events by location (based on IP)
    const eventsByLocation = await prisma.campaignEmailEvent.groupBy({
      by: ["ipAddress"],
      where: whereConditions,
      _count: true,
      orderBy: {
        _count: "desc",
      },
      take: 10,
    })

    return NextResponse.json({
      overview,
      dailyStats,
      eventsByDevice: eventsByDevice.map((e) => ({
        device: e.userAgent || "Unknown",
        count: e._count,
      })),
      eventsByLocation: eventsByLocation.map((e) => ({
        location: e.ipAddress || "Unknown",
        count: e._count,
      })),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
