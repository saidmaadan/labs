import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const technology = await prisma.technology.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!technology) {
      return NextResponse.json(
        { error: "Technology not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(technology);
  } catch (error) {
    console.error(`GET /api/technologies/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch technology" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await request.json();

    const technology = await prisma.technology.update({
      where: {
        id: params.id,
      },
      data: {
        name: json.name,
        slug: json.slug,
        description: json.description,
        icon: json.icon,
      },
    });

    return NextResponse.json(technology);
  } catch (error) {
    console.error(`PUT /api/technologies/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to update technology" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.technology.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/technologies/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to delete technology" },
      { status: 500 }
    );
  }
}
