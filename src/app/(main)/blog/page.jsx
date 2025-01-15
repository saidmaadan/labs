"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, Tag } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 4; // Number of posts per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsRes, categoriesRes] = await Promise.all([
          fetch(`/api/posts?page=${currentPage}&limit=${postsPerPage}&published=true`),
          fetch('/api/categories')
        ]);
        
        if (!postsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const postsData = await postsRes.json();
        const categoriesData = await categoriesRes.json();

        // Ensure postsData is an array and set posts
        const postsArray = Array.isArray(postsData.result?.posts) ? postsData.result.posts : [];
        setPosts(postsArray);
        setTotalPosts(postsData.result?.total || 0);

        // Handle categories data properly
        const categoriesArray = categoriesData.success && Array.isArray(categoriesData.result) 
          ? categoriesData.result.map(cat => cat.name) 
          : [];
        setCategories(['All', ...categoriesArray]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]); // Add currentPage to dependency array

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Filter posts based on category and search query
  const filteredPosts = Array.isArray(posts) ? posts.filter((post) => {
    if (!post) return false;
    
    const matchesCategory =
      selectedCategory === "All" || 
      (post.category && post.category.name === selectedCategory);
    
    const matchesSearch =
      !searchQuery ||
      (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }) : [];

  // Calculate total pages based on filtered posts when searching or filtering
  const totalPages = searchQuery || selectedCategory !== 'All' 
    ? Math.ceil(filteredPosts.length / postsPerPage)
    : Math.ceil(totalPosts / postsPerPage);

  // Use filtered posts for display when searching or filtering
  const displayPosts = searchQuery || selectedCategory !== 'All'
    ? filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
    : posts;

  if (error) {
    return (
      <div className="py-24 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-24 sm:py-32">
      <div className="container-center">
        {/* Header */}
        <div className="text-center">
          <motion.h1
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Latest Insights & Articles
          </motion.h1>
          <motion.p
            className="mt-2 text-lg leading-8 text-foreground/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Stay up to date with the latest news and updates.
          </motion.p>
        </div>

        {/* Two Column Layout */}
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Sidebar - Search and Categories */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Search</h3>
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Categories</h3>
                  <div className="flex lg:flex-col gap-4 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="justify-start"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Blog Posts */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {displayPosts.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-foreground/60">No posts found.</p>
                  </div>
                ) : (
                  displayPosts.map((post) => (
                    <motion.article
                      key={post.id}
                      className="flex flex-col items-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {post.image && (
                        <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 mb-4">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime={post.publishedAt} className="text-foreground/60 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                        </time>
                        {post.category && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {post.category.name}
                          </Badge>
                        )}
                      </div>
                      <div className="group relative">
                        <h3 className="mt-3 text-lg font-semibold leading-6 text-foreground">
                          <Link href={`/blog/${post.slug}`}>
                            <span className="absolute inset-0" />
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-foreground/60">
                          {post.excerpt}
                        </p>
                      </div>
                    </motion.article>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
