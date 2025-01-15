import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ShareButtons } from "@/components/share-buttons";
import { SimilarPosts } from "@/components/similar-posts";

async function getPost(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${slug}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch post");
    }

    const data = await res.json();
    return data.result.post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

async function getSimilarPosts(categoryId, currentPostId) {
  if (!categoryId) return [];
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/posts`,
      { cache: "no-store" }
    );
    
    if (!res.ok) {
      throw new Error("Failed to fetch similar posts");
    }

    const data = await res.json();
    // Filter posts by category and exclude current post
    const similarPosts = (data.result?.posts || [])
      .filter(post => 
        post.category?.id === categoryId && 
        post.id !== currentPostId
      )
      .slice(0, 5); // Limit to 5 similar posts

    return similarPosts;
  } catch (error) {
    console.error("Error fetching similar posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Fetch similar posts if the post has a category
  const similarPosts = post.category 
    ? await getSimilarPosts(post.category.id, post.id)
    : [];

  return (
    <div className="py-20 mt-10">
      <div className="container-center">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <header className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  {post.category && (
                    <>
                      <span>•</span>
                      <span>{post.category.name}</span>
                    </>
                  )}
                </div>
                <ShareButtons 
                  url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}
                  title={post.title}
                />
              </div>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
              )}
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.image && (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <span className="font-medium">{post.author.name}</span>
                </div>
              )}
            </header>

            {post.image && (
              <div className="relative w-full h-[400px] mb-8">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            {post.category && similarPosts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  More from {post.category.name}
                </h2>
                <SimilarPosts posts={similarPosts} currentPostId={post.id} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
