import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        template: true,
        subscribers: {
          include: {
            subscriber: true,
          },
        },
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("[CAMPAIGN_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, subject, content, templateId, scheduledFor, status } = body;

    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        name,
        subject,
        content,
        templateId,
        scheduledFor,
        status,
      },
      include: {
        template: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("[CAMPAIGN_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.campaign.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CAMPAIGN_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get campaign and its subscribers
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        subscribers: {
          include: {
            subscriber: true,
          },
        },
      },
    });

    if (!campaign) {
      return new NextResponse("Campaign not found", { status: 404 });
    }

    // Update campaign status to SENDING
    await prisma.campaign.update({
      where: { id: params.id },
      data: { status: "SENDING" },
    });

    // Send emails to all subscribers
    const emailPromises = campaign.subscribers.map(async (campaignSubscriber) => {
      const { subscriber } = campaignSubscriber;
      
      try {
        await resend.emails.send({
          from: "newsletter@yourdomain.com",
          to: subscriber.email,
          subject: campaign.subject,
          html: campaign.content,
        });

        // Update campaign subscriber status
        await prisma.campaignSubscriber.update({
          where: { id: campaignSubscriber.id },
          data: {
            sentAt: new Date(),
          },
        });
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        
        // Update campaign subscriber with error
        await prisma.campaignSubscriber.update({
          where: { id: campaignSubscriber.id },
          data: {
            error: error.message,
            bounced: true,
            bouncedAt: new Date(),
          },
        });
      }
    });

    await Promise.all(emailPromises);

    // Update campaign status to SENT
    const updatedCampaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error("[CAMPAIGN_SEND]", error);
    
    // Update campaign status to FAILED
    await prisma.campaign.update({
      where: { id: params.id },
      data: { status: "FAILED" },
    });

    return new NextResponse("Failed to send campaign", { status: 500 });
  }
}
