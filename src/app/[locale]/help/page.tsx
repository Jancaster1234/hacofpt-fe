// src/app/[locale]/help/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { blogPostService } from "@/services/blogPost.service";
import { BlogPost } from "@/types/entities/blogPost";

export default function HelpPage() {
  const { user } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublishedBlogPosts = async () => {
      setIsLoading(true);
      try {
        const response =
          await blogPostService.getBlogPostsByStatus("PUBLISHED");
        if (response.data) {
          setBlogPosts(response.data);
        } else {
          setError("Failed to fetch blog posts");
        }
      } catch (err) {
        setError("An error occurred while fetching blog posts");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedBlogPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="mt-2 text-gray-600">
            Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!
            Explore our published resources below.
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-700">
              No published help articles available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                {post.bannerImageUrl && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={post.bannerImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                  <div className="text-sm text-gray-500 mb-3">
                    {post.publishedAt && (
                      <span>
                        Published:{" "}
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 mb-4 line-clamp-3">
                    {/* Display a preview of the content */}
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 && "..."}
                  </div>
                  <a
                    href={`/help/article/${post.slug}`}
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
