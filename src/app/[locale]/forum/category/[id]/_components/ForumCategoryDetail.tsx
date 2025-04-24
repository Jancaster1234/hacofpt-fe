// src/app/[locale]/forum/category/[id]/_components/ForumCategoryDetail.tsx
"use client";

import { useEffect, useState } from "react";
import { ForumCategory } from "@/types/entities/forumCategory";
import { useAuth } from "@/hooks/useAuth_v0";
import CreateThreadModal from "./CreateThreadModal";
import { forumThreadService } from "@/services/forumThread.service";

export function ForumCategoryDetail({ category }: { category: ForumCategory }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  const handleNewThreadClick = () => {
    if (!user) {
      // Handle not logged in case - could redirect to login or show message
      alert("Please log in to create a thread");
      return;
    }

    setIsCreateModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        <p className="mt-2 text-gray-600">{category.description}</p>
      </div>

      <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <ThreadCounter categoryId={category.id} />
        </div>
        <button
          onClick={handleNewThreadClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          New Thread
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

  useEffect(() => {
    const fetchThreadCount = async () => {
      try {
        // You might need to create this method in your service or modify an existing one
        const { data } =
          await forumThreadService.getForumThreadsByCategoryId(categoryId);
        setCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error("Error fetching thread count:", err);
        setCount(0);
      }
    };

    fetchThreadCount();
  }, [categoryId]);

  return (
    <span>
      {count !== null ? (
        <>
          {count} thread{count !== 1 ? "s" : ""}
        </>
      ) : (
        "Loading threads..."
      )}
    </span>
  );
}
