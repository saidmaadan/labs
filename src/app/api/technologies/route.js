import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(technologies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch technologies" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await request.json();

    const technology = await prisma.technology.create({
      data: {
        name: json.name,
        slug: json.slug,
        description: json.description,
      },
    });

    return NextResponse.json(technology);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create technology" },
      { status: 500 }
    );
  }
}
