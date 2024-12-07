import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { ConfirmSubscriptionEmail } from "@/emails/confirm-subscription"
import crypto from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL

export async function POST(req) {
  try {
    const { email, firstName, lastName } = await req.json()

    if (!email) {
      return new NextResponse("Email is required", { status: 400 })
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === "UNSUBSCRIBED") {
        // Generate new confirmation token
        const confirmationToken = crypto.randomBytes(32).toString("hex")
        
        // Resubscribe with new confirmation token
        const updatedSubscriber = await prisma.subscriber.update({
          where: { email },
          data: {
            status: "PENDING",
            firstName: firstName || existingSubscriber.firstName,
            lastName: lastName || existingSubscriber.lastName,
            confirmationToken,
          },
        })

        // Send confirmation email
        await sendConfirmationEmail(updatedSubscriber)
        
        return NextResponse.json({
          message: "Please check your email to confirm your subscription",
        })
      }
      
      if (existingSubscriber.status === "PENDING") {
        // Resend confirmation email
        await sendConfirmationEmail(existingSubscriber)
        
        return NextResponse.json({
          message: "Please check your email to confirm your subscription",
        })
      }
      
      return new NextResponse("Email already subscribed", { status: 400 })
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString("hex")

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        firstName,
        lastName,
        status: "PENDING",
        confirmationToken,
      },
    })

    // Send confirmation email
    await sendConfirmationEmail(subscriber)

    return NextResponse.json({
      message: "Please check your email to confirm your subscription",
    })
  } catch (error) {
    console.error("[NEWSLETTER_SUBSCRIBE]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

async function sendConfirmationEmail(subscriber) {
  const confirmationUrl = `${BASE_URL}/api/newsletter/confirm/${subscriber.confirmationToken}`

  await resend.emails.send({
    from: "InventiveLabs <newsletter@sales.inventivelabs.co>",
    to: subscriber.email,
    subject: "Confirm your newsletter subscription",
    react: ConfirmSubscriptionEmail({
      confirmationUrl,
      firstName: subscriber.firstName,
    }),
  })
}
