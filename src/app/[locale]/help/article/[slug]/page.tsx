// src/app/[locale]/help/article/[slug]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { blogPostService } from "@/services/blogPost.service";
import { BlogPost } from "@/types/entities/blogPost";
import { useAuth } from "@/hooks/useAuth_v0";
import Link from "next/link";
import Image from "next/image";
import TiptapRenderer from "@/components/TiptapRenderer/ClientRenderer";
import PostHeader from "@/components/shared/PostHeader";
import PostToc from "@/components/shared/PostToc";
import PostContent from "@/components/shared/PostContent";
import PostSharing from "@/components/shared/PostSharing";
import PostReadingProgress from "@/components/shared/PostReadingProgress";

export default function BlogPostPage() {
  const { user } = useAuth();
  const params = useParams();
  const slug = params.slug as string;

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const response = await blogPostService.getBlogPostBySlug(slug);
        console.log("🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹", response.data);
        if (response.data && response.data.id) {
          setBlogPost(response.data);

          // Calculate reading time
          const wpm = 150;
          setReadingTime(Math.ceil((response.data.wordCount || 500) / wpm));
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        setError("Failed to load the article");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation back to help center */}
        <div className="mb-6">
          <Link
            href="/help"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Help Center
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 dark:text-gray-400 transition-colors">
              Loading article...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-6 text-center transition-colors">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2 transition-colors">
              Error
            </h2>
            <p className="text-red-600 dark:text-red-300 transition-colors">
              {error}
            </p>
            <p className="mt-4">
              <Link
                href="/help"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition"
              >
                Return to Help Center
              </Link>
            </p>
          </div>
        ) : blogPost ? (
          <article className="flex flex-col items-center w-full dark:text-gray-100 transition-colors">
            <PostReadingProgress />

            <PostHeader
              title={blogPost.title}
              author={blogPost.createdByUserName || "Unknown Author"}
              createdAt={blogPost.publishedAt || blogPost.createdAt || ""}
              readingTime={readingTime}
              cover={blogPost.bannerImageUrl}
            />

            <div
              className="grid grid-cols-1 w-full px-2 sm:px-0 
             md:grid-cols-[1fr_minmax(650px,_1fr)_1fr] 
             lg:grid-cols-[minmax(auto,256px)_minmax(720px,1fr)_minmax(auto,256px)] 
             gap-4 md:gap-6 lg:gap-8"
            >
              {/* Left sidebar with sharing links */}
              <div className="hidden md:block relative">
                <div className="sticky top-24">
                  <PostSharing />
                </div>
              </div>

              {/* Main content area */}
              <div>
                <PostContent>
                  <div className="dark:prose-invert prose-img:rounded prose-headings:scroll-mt-28">
                    {blogPost.content.includes("<") ? (
                      // If content has HTML tags, render safely
                      <TiptapRenderer>{blogPost.content}</TiptapRenderer>
                    ) : (
                      // Fallback for plain text content
                      <div className="prose max-w-none dark:prose-invert">
                        {blogPost.content.split("\n").map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </PostContent>
              </div>

              {/* Right sidebar with table of contents */}
              <div className="hidden md:block relative">
                <div className="sticky top-24">
                  <PostToc />
                </div>
              </div>
            </div>

            {/* Mobile sharing section shown only on small screens */}
            <div className="block md:hidden w-full mt-8">
              <PostSharing />
            </div>

            {/* Footer image */}
            <div className="mt-8 md:mt-10">
              <Image
                src="/doraemon.png"
                width={250}
                height={250}
                sizes="(max-width: 640px) 200px, (max-width: 768px) 225px, 250px"
                alt=""
                className="mx-auto transition-opacity hover:opacity-90"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </article>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-6 text-center transition-colors">
            <p className="text-yellow-700 dark:text-yellow-400 transition-colors">
              No article found with this slug.
            </p>
            <p className="mt-4">
              <Link
                href="/help"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition"
              >
                Browse All Articles
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
