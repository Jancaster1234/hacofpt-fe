// src/app/[locale]/forum/thread/[id]/_components/PostForm.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { threadPostService } from "@/services/threadPost.service";
import { ThreadPost } from "@/types/entities/threadPost";

interface PostFormProps {
  forumThreadId: string;
  onPostSaved: () => void;
  postId?: string;
  initialContent?: string;
  onCancel?: () => void;
  isEditing?: boolean;
  currentUsername?: string;
  post?: ThreadPost;
}

export default function PostForm({
  forumThreadId,
  onPostSaved,
  postId,
  initialContent = "",
  onCancel,
  isEditing = false,
  currentUsername,
  post,
}: PostFormProps) {
  const [content, setContent] = useState(initialContent || post?.content || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let updatedPost;

      if (isEditing && (postId || post?.id)) {
        // Update existing post
        const response = await threadPostService.updateThreadPost(
          postId || post?.id || "",
          {
            forumThreadId,
            content,
            isDeleted: false,
          }
        );
        updatedPost = response.data;
      } else {
        // Create new post
        const response = await threadPostService.createThreadPost({
          forumThreadId,
          content,
          isDeleted: false,
        });
        updatedPost = response.data;
      }

      // Reset form if it's a new post
      if (!isEditing) {
        setContent("");
      }

      onPostSaved();

      if (onCancel && isEditing) {
        onCancel();
      }
    } catch (err: any) {
      setError(err.message || "Failed to save post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // If user isn't authenticated, show a message
  if (!user && !currentUsername) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          Please sign in to participate in this discussion.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <textarea
          id="content"
          name="content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={submitting}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          disabled={submitting}
        >
          {submitting && (
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
          )}
          {isEditing ? "Update" : "Post"}
        </button>
      </div>
    </form>
  );
}
