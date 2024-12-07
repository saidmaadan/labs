import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Try to find post by ID first, if not found try by slug
    let post = await prisma.post.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id, published: true }
        ]
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
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "Post not found",
        },
        { status: 404 }
      );
    }

    // Transform the post data
    const transformedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.content.substring(0, 150) + "...",
      content: post.content,
      image: post.imageUrl,
      publishedAt: post.createdAt,
      published: Boolean(post.published), // Ensure published is a boolean
      category: post.category,
      metaTitle: post.metaTitle || post.title,
      metaDescription: post.metaDescription || post.excerpt,
      metaKeywords: post.metaKeywords,
      author: {
        name: post.author?.name || 'Anonymous',
        image: post.author?.image,
      },
    };

    return NextResponse.json({
      result: {
        post: transformedPost,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching post",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    // First find the post
    const existingPost = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { 
          success: false,
          error: "Post not found" 
        },
        { status: 404 }
      );
    }

    // Parse the update data
    const json = await request.json();
    const updateData = {
      title: json.title,
      slug: json.slug,
      content: json.content,
      excerpt: json.excerpt,
      imageUrl: json.imageUrl,
      categoryId: json.categoryId,
      published: json.published || false,
      featured: json.featured || false,
      metaTitle: json.metaTitle,
      metaDescription: json.metaDescription,
      metaKeywords: json.metaKeywords,
    };

    // Update the post
    const post = await prisma.post.update({
      where: {
        id: params.id,
      },
      data: updateData,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        category: true,
      },
    });

    // Transform the post data
    const transformedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.content.substring(0, 150) + "...",
      content: post.content,
      image: post.imageUrl,
      publishedAt: post.createdAt,
      published: Boolean(post.published), // Ensure published is a boolean
      featured: Boolean(post.featured), // Ensure featured is a boolean
      category: post.category,
      metaTitle: post.metaTitle || post.title,
      metaDescription: post.metaDescription || post.excerpt,
      metaKeywords: post.metaKeywords,
      author: {
        name: post.author?.name || 'Anonymous',
        image: post.author?.image,
      },
    };
    
    return NextResponse.json({
      success: true,
      result: transformedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update post" 
      },
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

    await prisma.post.delete({
      where: {
        id: params.id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
