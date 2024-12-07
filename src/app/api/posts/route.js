import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // For admin routes, we want to get all posts regardless of published status
    const isAdminRoute = request.url.includes("/admin/");

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: isAdminRoute ? {} : { published: true },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          category: true,
        },
      }),
      prisma.post.count({
        where: isAdminRoute ? {} : { published: true },
      }),
    ]);

    // Transform the posts data
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + "..." : ""),
      content: post.content,
      image: post.imageUrl,
      publishedAt: post.publishedAt || post.createdAt,
      createdAt: post.createdAt,
      published: post.published,
      category: post.category,
      author: {
        name: post.author?.name || 'Anonymous',
        image: post.author?.image,
      },
    }));

    return NextResponse.json({
      result: {
        posts: transformedPosts,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch posts",
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
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const post = await prisma.post.create({
      data: {
        ...json,
        authorId: session.user.id,
      },
      include: {
        category: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      result: post,
      success: true,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create post",
      },
      { status: 500 }
    );
  }
}
