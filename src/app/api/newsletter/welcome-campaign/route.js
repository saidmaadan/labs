import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const welcomeEmailContent = `
<h1>Welcome to InventiveLabs Newsletter!</h1>

<p>Thank you for subscribing to our newsletter! We're excited to have you join our community.</p>

<p>Here's what you can expect from us:</p>
<ul>
  <li>Latest updates on AI and software development</li>
  <li>Industry insights and best practices</li>
  <li>Exclusive content and early access to new features</li>
  <li>Tips and tutorials from our experts</li>
</ul>

<p>Stay tuned for our upcoming newsletters!</p>

<p>Best regards,<br>The InventiveLabs Team</p>
`

export async function POST(req) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if welcome campaign already exists
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        type: "WELCOME",
      },
    })

    if (existingCampaign) {
      return NextResponse.json({
        message: "Welcome campaign already exists",
        campaign: existingCampaign,
      })
    }

    // Create welcome campaign
    const campaign = await prisma.campaign.create({
      data: {
        name: "Welcome to InventiveLabs Newsletter",
        subject: "Welcome to InventiveLabs Newsletter! 🎉",
        content: welcomeEmailContent,
        type: "WELCOME",
        status: "DRAFT",
        authorId: session.user.id,
        metadata: {
          isSystem: true,
        },
      },
    })

    return NextResponse.json({
      message: "Welcome campaign created successfully",
      campaign,
    })
  } catch (error) {
    console.error("[WELCOME_CAMPAIGN_CREATE]", error)
    return NextResponse.json(
      { message: "Failed to create welcome campaign" },
      { status: 500 }
    )
  }
}
