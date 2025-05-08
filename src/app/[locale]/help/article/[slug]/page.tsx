"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { blogPostService } from "@/services/blogPost.service";
import { BlogPost } from "@/types/entities/blogPost";
import { useAuth } from "@/hooks/useAuth_v0";
import Link from "next/link";
import PostHeader from "@/components/shared/PostHeader";
import PostToc from "@/components/shared/PostToc";
import PostContent from "@/components/shared/PostContent";
import PostSharing from "@/components/shared/PostSharing";
import PostReadingProgress from "@/components/shared/PostReadingProgress";
import TiptapRenderer from "@/components/TiptapRenderer/ClientRenderer";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  const { user } = useAuth();
  const params = useParams();
  const slug = params.slug as string;

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate reading time based on word count
  const readingTime = useMemo(() => {
    if (!blogPost?.content) return 0;
    const wpm = 150;
    // Rough calculation based on content length
    const wordCount = blogPost.content.split(/\s+/).length;
    return Math.ceil(wordCount / wpm);
  }, [blogPost?.content]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const response = await blogPostService.getBlogPostBySlug(slug);

        if (response.data && response.data.id) {
          setBlogPost(response.data);
        } else {
          //setError("Blog post not found");
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

  // Component for the loading state
  const LoadingState = () => (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Loading article...
        </p>
      </div>
    </div>
  );

  // Component for the error state
  const ErrorState = () => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-6 text-center">
      <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
        Error
      </h2>
      <p className="text-red-600 dark:text-red-200">{error}</p>
      <p className="mt-4">
        <Link
          href="/help"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Return to Help Center
        </Link>
      </p>
    </div>
  );

  // Component for the not found state
  const NotFoundState = () => (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-6 text-center">
      <p className="text-yellow-700 dark:text-yellow-300">
        No article found with this slug.
      </p>
      <p className="mt-4">
        <Link
          href="/help"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Browse All Articles
        </Link>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation back to help center */}
        <div className="mb-6">
          <Link
            href="/help"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Help Center
          </Link>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : !blogPost ? (
          <NotFoundState />
        ) : (
          <article className="py-4 sm:py-6 flex flex-col items-center w-full dark:text-gray-100 transition-colors">
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
                      <div
                        dangerouslySetInnerHTML={{ __html: blogPost.content }}
                      />
                    ) : (
                      <TiptapRenderer>{blogPost.content}</TiptapRenderer>
                    )}
                  </div>
                </PostContent>
              </div>

              {/* Right sidebar - Table of Contents */}
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
        )}
      </div>
    </div>
  );
}
