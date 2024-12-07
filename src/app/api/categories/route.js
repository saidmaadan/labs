import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json({
      success: true,
      result: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch categories" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized" 
        },
        { status: 401 }
      );
    }

    const json = await request.json();
    const category = await prisma.category.create({
      data: json,
    });
    return NextResponse.json({
      success: true,
      result: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create category" 
      },
      { status: 500 }
    );
  }
}
