import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // For admin routes, we want to get all projects regardless of published status
    const isAdminRoute = request.url.includes("/admin/");

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: isAdminRoute ? {} : { published: true },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.project.count(
        isAdminRoute ? {} : { where: { published: true } }
      ),
    ]);

    return NextResponse.json({
      success: true,
      result: {
        projects,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch projects" 
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
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // Convert string boolean values to actual booleans
    data.featured = data.featured === "true";
    data.published = data.published === "true";

    // Ensure required fields
    if (!data.title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug || slugify(data.title),
        description: data.description || "",
        content: data.content || "",
        image: data.image || "",
        demoUrl: data.demoUrl || "",
        githubUrl: data.githubUrl || "",
        category: data.category || "",
        status: data.status || "DRAFT",
        featured: Boolean(data.featured),
        published: Boolean(data.published),
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      result: project 
    });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
