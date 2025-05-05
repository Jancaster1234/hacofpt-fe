// src/app/[locale]/_components/FeaturedBlogPosts.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import { blogPostService } from "@/services/blogPost.service";
import { BlogPost } from "@/types/entities/blogPost";
import Link from "next/link";

const FeaturedBlogPosts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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
          // Sort by publishedAt date (newest first) and take the first 6 posts
          const sortedPosts = response.data
            .sort((a, b) => {
              const dateA = a.publishedAt
                ? new Date(a.publishedAt).getTime()
                : 0;
              const dateB = b.publishedAt
                ? new Date(b.publishedAt).getTime()
                : 0;
              return dateB - dateA;
            })
            .slice(0, 6);

          setBlogPosts(sortedPosts);
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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setCurrentIndex((prev) => {
        const newIndex =
          direction === "left"
            ? Math.max(prev - 1, 0)
            : Math.min(prev + 1, blogPosts.length - 1);
        return newIndex;
      });
    }
  };

  // Format the date and time from API response
  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return "Not published";

    try {
      const date = new Date(dateTimeString);

      // Format: May 6, 2025
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with "View All" Link */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 relative">
            Recent Blog Posts
            <span className="block w-12 h-1 bg-blue-500 mt-2"></span>
          </h2>
          <Link href="/help" className="text-blue-500 text-sm hover:underline">
            View All &rarr;
          </Link>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="relative mt-8">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll("left")}
            disabled={isLoading || blogPosts.length === 0 || currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full z-10 hidden md:flex hover:bg-gray-200 transition ${
              isLoading || blogPosts.length === 0 || currentIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <FaChevronLeft className="text-gray-700" />
          </button>

          {/* Scrollable Card Container */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-500">{error}</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-700">
                No published blog posts available at the moment.
              </p>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
            >
              {blogPosts.map((post, index) => (
                <a
                  href={`/help/article/${post.slug}`}
                  key={post.id}
                  className="min-w-[280px] md:min-w-[320px] bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105"
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
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {post.title}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaCalendarAlt className="h-3 w-3" />
                        <span className="text-xs">
                          {formatDateTime(post.publishedAt)}
                        </span>
                      </div>
                      {post.createdByUserName && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaUser className="h-3 w-3" />
                          <span className="text-xs">
                            {post.createdByUserName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll("right")}
            disabled={
              isLoading ||
              blogPosts.length === 0 ||
              currentIndex === Math.max(0, blogPosts.length - 1)
            }
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full z-10 hidden md:flex hover:bg-gray-200 transition ${
              isLoading ||
              blogPosts.length === 0 ||
              currentIndex === Math.max(0, blogPosts.length - 1)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>

        {/* Dots Navigation */}
        {!isLoading && !error && blogPosts.length > 0 && (
          <div className="flex justify-center mt-4">
            {blogPosts.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 mx-1 rounded-full transition ${
                  index === currentIndex ? "bg-blue-500 w-3" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;
