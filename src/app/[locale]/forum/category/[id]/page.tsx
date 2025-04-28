// src/app/[locale]/forum/category/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ForumCategoryDetail } from "./_components/ForumCategoryDetail";
import { Suspense, useEffect, useState } from "react";
import { ThreadsList } from "./_components/ThreadsList";
import { forumCategoryService } from "@/services/forumCategory.service";
import { ForumCategory } from "@/types/entities/forumCategory";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("forum");
  const toast = useToast();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);

      if (!params.id) {
        console.log("No ID found in params");
        return;
      }

      try {
        const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;
        console.log("Fetching category with ID:", categoryId);

        const { data, message } =
          await forumCategoryService.getForumCategoryById(categoryId);

        if (!data || !data.id) {
          setError(t("categoryNotFound"));
          setCategory(null);
        } else {
          setCategory(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(t("failedToLoadCategory"));
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id, t]);

  if (loading) {
    return <CategorySkeleton />;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8 text-center w-full max-w-md transition-colors duration-300">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {error || t("categoryNotFound")}
          </h2>
          <Link
            href="/forum"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-300"
            aria-label={t("returnToForum")}
          >
            {t("returnToForum")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap transition-colors duration-300">
          <Link
            href="/forum"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
            aria-label={t("forum")}
          >
            {t("forum")}
          </Link>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {category.name}
          </span>
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
  const t = useTranslations("forum");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb skeleton */}
        <div
          className="flex items-center space-x-2 mb-4 md:mb-6"
          aria-label={t("loading")}
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          <div className="h-4 w-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>

        {/* Category Header skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6 md:mb-8 animate-pulse transition-colors duration-300">
          <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-750 flex justify-between items-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
          </div>
        </div>

        {/* ThreadsList skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse transition-colors duration-300">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="p-4 sm:p-6">
                <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
