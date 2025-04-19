// src/app/forum/category/[id]/_components/CreateThreadModal.tsx
"use client";

import { useState } from "react";
import { forumThreadService } from "@/services/forumThread.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth_v0";

interface CreateThreadModalProps {
  categoryId: string;
  onClose: () => void;
}

export default function CreateThreadModal({
  categoryId,
  onClose,
}: CreateThreadModalProps) {
  const [title, setTitle] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.userRoles?.some(
    (userRole) => userRole.role.name === "ADMIN"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a thread title");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const { data } = await forumThreadService.createForumThread({
        title: title.trim(),
        forumCategoryId: categoryId,
        isLocked: isAdmin ? isLocked : false,
        isPinned: isAdmin ? isPinned : false,
      });

      if (data && data.id) {
        // Refresh the page or navigate to the new thread
        router.refresh(); // Refresh the current page to show the new thread
        router.push(`/forum/thread/${data.id}`); // Navigate to the new thread
      } else {
        setError("Failed to create thread. Please try again.");
      }
    } catch (err) {
      console.error("Error creating thread:", err);
      setError("Failed to create thread. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create New Thread</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="thread-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Thread Title
            </label>
            <input
              type="text"
              id="thread-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter thread title"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {isAdmin && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pin-thread"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="pin-thread"
                  className="ml-2 text-sm text-gray-700"
                >
                  Pin this thread
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lock-thread"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="lock-thread"
                  className="ml-2 text-sm text-gray-700"
                >
                  Lock this thread
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Thread"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
