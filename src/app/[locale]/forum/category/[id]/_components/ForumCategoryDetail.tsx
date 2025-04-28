// src/app/[locale]/forum/category/[id]/_components/ForumCategoryDetail.tsx
"use client";

import { useEffect, useState } from "react";
import { ForumCategory } from "@/types/entities/forumCategory";
import { useAuth } from "@/hooks/useAuth_v0";
import CreateThreadModal from "./CreateThreadModal";
import { forumThreadService } from "@/services/forumThread.service";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export function ForumCategoryDetail({ category }: { category: ForumCategory }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const t = useTranslations("forumCategory");

  const handleNewThreadClick = () => {
    if (!user) {
      // Handle not logged in case - could redirect to login or show message
      alert(t("loginRequired"));
      return;
    }

    setIsCreateModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8 transition-colors duration-300">
      <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          {category.name}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {category.description}
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 transition-colors duration-300">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <ThreadCounter categoryId={category.id} />
        </div>
        <button
          onClick={handleNewThreadClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-200 text-sm sm:text-base"
        >
          {t("newThread")}
        </button>
      </div>

      {isCreateModalOpen && (
        <CreateThreadModal
          categoryId={category.id}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}

// Simple counter component that updates with the thread list
function ThreadCounter({ categoryId }: { categoryId: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("threadCounter");

  useEffect(() => {
    const fetchThreadCount = async () => {
      setIsLoading(true);
      try {
        // You might need to create this method in your service or modify an existing one
        const { data } =
          await forumThreadService.getForumThreadsByCategoryId(categoryId);
        setCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error("Error fetching thread count:", err);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreadCount();
  }, [categoryId]);

  return (
    <span className="inline-flex items-center">
      {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
      {count !== null ? (
        <>
          {count} {count !== 1 ? t("threads") : t("thread")}
        </>
      ) : (
        t("loadingThreads")
      )}
    </span>
  );
}
