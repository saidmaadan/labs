"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function SimilarPosts({ posts, currentPostId }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Similar Posts</h2>
      <div className="space-y-4">
        {posts.filter(post => post.id !== currentPostId).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex gap-4">
                    {post.image && (
                      <div className="relative w-24 h-24">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4">
                      <h3 className="font-medium line-clamp-2 mb-2 text-foreground hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <time 
                        dateTime={post.publishedAt}
                        className="text-sm text-muted-foreground"
                      >
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
