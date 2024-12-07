"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { BlogPostForm } from "@/components/forms/blog-post-form";
import { toast } from "sonner";

export default function EditBlogPost({ params }) {
  const router = useRouter();
 
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blog post");
      }
      
      if (data.success && data.result.post) {
        setPost(data.result.post);
      } else {
        throw new Error("Post data not found");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error(error.message);
      router.push("/admin/blog");
    } finally {
      setIsLoading(false);
    }
  }, [postId, router]);

  useEffect(() => {
    if (postId !== "new") {
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [fetchPost, postId]);

  const handleSuccess = () => {
    router.push("/admin/blog");
    router.refresh(); // Add this to force a refresh of the blog list
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">
        {postId === "new" ? "Create Blog Post" : "Edit Blog Post"}
      </h2>
      <BlogPostForm
        post={post}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
