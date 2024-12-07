import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const template = await prisma.emailTemplate.findUnique({
      where: { id: params.id },
      include: {
        campaigns: true,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("[TEMPLATE_GET]", error);
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
    const { name, subject, content, description, isDefault } = body;

    // If this template is set as default, unset any existing default template
    if (isDefault) {
      await prisma.emailTemplate.updateMany({
        where: {
          id: { not: params.id },
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const template = await prisma.emailTemplate.update({
      where: { id: params.id },
      data: {
        name,
        subject,
        content,
        description,
        isDefault,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("[TEMPLATE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if template is used by any campaigns
    const template = await prisma.emailTemplate.findUnique({
      where: { id: params.id },
      include: {
        campaigns: true,
      },
    });

    if (template?.campaigns.length > 0) {
      return new NextResponse(
        "Cannot delete template that is used by campaigns",
        { status: 400 }
      );
    }

    await prisma.emailTemplate.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TEMPLATE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
