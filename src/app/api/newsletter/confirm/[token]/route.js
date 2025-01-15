import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
export async function GET(req, { params }) {
  try {
    const token = params.token
    console.log("Processing confirmation token:", token)

    if (!token) {
      console.log("No token provided")
      return NextResponse.redirect(new URL("/newsletter/invalid-token", req.url))
    }

    // Find subscriber by confirmation token
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        confirmationToken: token,
        status: "PENDING",
      },
    })

    if (!subscriber) {
      console.log("No pending subscriber found for token:", token)
      return NextResponse.redirect(new URL("/newsletter/invalid-token", req.url))
    }

    console.log("Found subscriber:", subscriber.email)

    // Update subscriber status and clear confirmation token
    const updatedSubscriber = await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "SUBSCRIBED",
        confirmationToken: null,
        confirmedAt: new Date(),
      },
    })

    console.log("Updated subscriber status to SUBSCRIBED")

    // Add to welcome campaign if exists
    try {
      const welcomeCampaign = await prisma.campaign.findFirst({
        where: {
          type: "WELCOME",
          status: "DRAFT",
        },
      })

      if (welcomeCampaign) {
        console.log("Found welcome campaign:", welcomeCampaign.id)
        
        // Check if subscriber is already added to the campaign
        const existingSubscription = await prisma.campaignSubscriber.findFirst({
          where: {
            campaignId: welcomeCampaign.id,
            subscriberId: updatedSubscriber.id,
          },
        })

        if (!existingSubscription) {
          await prisma.campaignSubscriber.create({
            data: {
              campaignId: welcomeCampaign.id,
              subscriberId: updatedSubscriber.id,
            },
          })
          console.log("Added subscriber to welcome campaign")
        } else {
          console.log("Subscriber already in welcome campaign")
        }
      } else {
        console.log("No welcome campaign found")
      }
    } catch (error) {
      console.error("Welcome campaign error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }

    console.log("Confirmation successful, redirecting to success page")
    // const baseUrl = new URL(req.url).origin
    return NextResponse.redirect(`${baseUrl}/newsletter/confirmed`)
  } catch (error) {
    console.error("[NEWSLETTER_CONFIRM] Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    // const baseUrl = new URL(req.url).origin
    return NextResponse.redirect(`${baseUrl}/newsletter/error`)
  }
}
