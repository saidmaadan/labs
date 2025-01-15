"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function BlogSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-1/4" />
      </CardFooter>
    </Card>
  );
}

export function LatestBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts?limit=3&published=true");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data.result?.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <section className="py-24 sm:py-32">
      <div className="container-center">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Latest from the Blog
          </h2>
          <p className="mt-2 text-lg leading-8 text-muted-foreground">
            Stay up to date with our latest insights and developments.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {loading ? (
            <>
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
            </>
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <Card className="w-full rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="w-full aspect-h-3 aspect-w-4 bg-gray-200">
                      <img
                        src={post.image || "/blog/default-blog.svg"}
                        alt={post.title || ''}
                        className="object-cover w-full min-h-[250px] max-h-[250px]"
                      />
                    </div>
                    <CardHeader>
                      <Badge variant="secondary">
                          {post.category?.name || "Uncategorized"}
                      </Badge>
                      
                    </CardHeader>
                    <CardContent>
                      <div className="group relative">
                        <h3 className="mt-3 text-lg font-semibold leading-6">
                          <span className="absolute inset-0" />
                          {post.title}
                        </h3>
                        
                        {/* <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                          {post.excerpt.slice(0, 150)}..
                        </p> */}
                      </div>
                      <div className="flex items-center justify-between gap-x-2 text-xs mt-10">
                      <div className="text-sm leading-6">
                          <p className="font-normal">
                            By: {post.author?.name || "Anonymous"}
                          </p>
                        </div>
                        <time dateTime={post.publishedAt} className="text-muted-foreground">
                          {format(new Date(post.publishedAt), "MMM d, yyyy")}
                        </time>
                        
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-3">
              No blog posts found.
            </p>
          )}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="text-sm font-semibold leading-6 text-foreground hover:text-muted-foreground"
          >
            View all posts <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
