// src/app/[locale]/forum/category/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ForumCategoryDetail } from "./_components/ForumCategoryDetail";
import { Suspense, useEffect, useState } from "react";
import { ThreadsList } from "./_components/ThreadsList";
import { forumCategoryService } from "@/services/forumCategory.service";
import { ForumCategory } from "@/types/entities/forumCategory";

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true); // Ensure loading state is set
      setError(null); // Reset any previous errors

      if (!params.id) {
        console.log("No ID found in params");
        return;
      }

      try {
        const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;
        console.log("Fetching category with ID:", categoryId);

        const { data } =
          await forumCategoryService.getForumCategoryById(categoryId);

        if (!data || !data.id) {
          setError("Category not found");
          setCategory(null);
        } else {
          setCategory(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to load category. Please try again.");
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);
  if (loading) {
    return <CategorySkeleton />;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Category not found"}
          </h2>
          <Link href="/forum" className="text-indigo-600 hover:text-indigo-800">
            Return to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/forum" className="hover:text-indigo-600 transition">
            Forum
          </Link>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
          <span className="font-medium text-gray-900">{category.name}</span>
        </div>

        {/* Category Header */}
        <ForumCategoryDetail category={category} />

        {/* Thread List */}
        <ThreadsList categoryId={category.id} />
      </div>
    </div>
  );
}

// Skeleton loader for the whole category page
function CategorySkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-4 w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Category Header skeleton */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 animate-pulse">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-28"></div>
          </div>
        </div>

        {/* ThreadsList skeleton */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
