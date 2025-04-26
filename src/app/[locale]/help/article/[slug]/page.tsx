// src/app/[locale]/help/article/[slug]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { blogPostService } from "@/services/blogPost.service";
import { BlogPost } from "@/types/entities/blogPost";
import { useAuth } from "@/hooks/useAuth_v0";
import Link from "next/link";

export default function BlogPostPage() {
  const { user } = useAuth();
  const params = useParams();
  const slug = params.slug as string;

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const response = await blogPostService.getBlogPostById("2");

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation back to help center */}
        <div className="mb-6">
          <Link
            href="/help"
            className="text-blue-500 hover:text-blue-700 flex items-center"
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
            <p className="text-gray-500">Loading article...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <p className="mt-4">
              <Link
                href="/help"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Return to Help Center
              </Link>
            </p>
          </div>
        ) : blogPost ? (
          <article className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Banner image */}
            {blogPost.bannerImageUrl && (
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={blogPost.bannerImageUrl}
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-image.jpg";
                  }}
                />
              </div>
            )}

            {/* Article content */}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {blogPost.title}
              </h1>

              <div className="flex items-center text-sm text-gray-500 mb-6">
                {blogPost.publishedAt && (
                  <span className="mr-4">
                    Published: {formatDate(blogPost.publishedAt)}
                  </span>
                )}
                {blogPost.createdByUserName && (
                  <span>Author: {blogPost.createdByUserName}</span>
                )}
              </div>

              {/* Render the content - consider using a markdown renderer if content is markdown */}
              <div className="prose max-w-none text-gray-700">
                {/* If you're using markdown, you might want to use a markdown parser here */}
                <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
              </div>
            </div>
          </article>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center">
            <p className="text-yellow-700">No article found with this slug.</p>
            <p className="mt-4">
              <Link
                href="/help"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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
