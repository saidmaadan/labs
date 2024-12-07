import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("[SUBSCRIBERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, firstName, lastName } = body;

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === "UNSUBSCRIBED") {
        // Resubscribe
        const updatedSubscriber = await prisma.subscriber.update({
          where: { email },
          data: {
            status: "SUBSCRIBED",
            confirmedAt: new Date(),
            unsubscribedAt: null,
          },
        });
        return NextResponse.json(updatedSubscriber);
      }
      return new NextResponse("Email already subscribed", { status: 400 });
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        firstName,
        lastName,
        status: "SUBSCRIBED",
        confirmedAt: new Date(),
      },
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error("[SUBSCRIBERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
