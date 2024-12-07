import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const campaignId = searchParams.get("cid")
    const subscriberId = searchParams.get("sid")
    const url = searchParams.get("url")
    
    if (!type || !campaignId || !subscriberId) {
      return new NextResponse("Missing required parameters", { status: 400 })
    }

    const headersList = headers()
    const userAgent = headersList.get("user-agent")
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"

    // Record the event
    await prisma.campaignEmailEvent.create({
      data: {
        type,
        campaignId,
        subscriberId,
        url,
        userAgent,
        ipAddress,
        metadata: {
          headers: Object.fromEntries(headersList.entries()),
        },
      },
    })

    // For open tracking, return a 1x1 transparent GIF
    if (type === "OPEN") {
      return new NextResponse(Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"), {
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      })
    }

    // For click tracking, redirect to the target URL
    if (type === "CLICK" && url) {
      return NextResponse.redirect(url)
    }

    return new NextResponse("OK")
  } catch (error) {
    console.error("Error tracking event:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
