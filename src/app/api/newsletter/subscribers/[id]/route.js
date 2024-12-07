import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscriber = await prisma.subscriber.findUnique({
      where: { id: params.id },
      include: {
        campaigns: {
          include: {
            campaign: true,
          },
        },
      },
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error("[SUBSCRIBER_GET]", error);
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
    const { status, firstName, lastName } = body;

    const subscriber = await prisma.subscriber.update({
      where: { id: params.id },
      data: {
        status,
        firstName,
        lastName,
        ...(status === "UNSUBSCRIBED" ? { unsubscribedAt: new Date() } : {}),
      },
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error("[SUBSCRIBER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.subscriber.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[SUBSCRIBER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
