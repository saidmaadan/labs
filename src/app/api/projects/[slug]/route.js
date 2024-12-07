import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    if (!params?.slug) {
      return NextResponse.json(
        { success: false, error: "Project slug is required" },
        { status: 400 }
      );
    }

    // For admin routes, we want to get the project regardless of published status
    const isAdminRoute = request.url.includes("/admin/");
    
    const project = await prisma.project.findUnique({
      where: {
        slug: params.slug,
        ...(isAdminRoute ? {} : { published: true }),
      },
      include: {
        technologies: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      result: project
    });
  } catch (error) {
    console.error("GET /api/projects/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    if (!params?.slug) {
      return NextResponse.json(
        { success: false, error: "Project slug is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    
    // Convert FormData to object with proper type conversion
    const updateData = {};
    for (const [key, value] of formData.entries()) {
      if (key === "featured" || key === "published") {
        updateData[key] = value === "true";
      } else if (value === "") {
        updateData[key] = null;
      } else {
        updateData[key] = value;
      }
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        ...updateData,
        // Ensure these fields are properly typed
        featured: Boolean(updateData.featured),
        published: Boolean(updateData.published),
      },
      include: {
        technologies: true,
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
      result: updatedProject
    });
  } catch (error) {
    console.error("PUT /api/projects/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: {
        id: project.id,
      },
    });

    return NextResponse.json({ success: true, result: { message: "Project deleted successfully" } });
  } catch (error) {
    console.error("DELETE /api/projects/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
