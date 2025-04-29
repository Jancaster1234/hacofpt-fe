// src/app/[locale]/forum/thread/[id]/_components/PostForm.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { threadPostService } from "@/services/threadPost.service";
import { ThreadPost } from "@/types/entities/threadPost";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const toast = useToast();
  const t = useTranslations("forum");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError(t("errors.emptyContent"));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let response;

      if (isEditing && (postId || post?.id)) {
        // Update existing post
        response = await threadPostService.updateThreadPost(
          postId || post?.id || "",
          {
            forumThreadId,
            content,
            isDeleted: false,
          }
        );
        toast.success(t("success.postUpdated"));
      } else {
        // Create new post
        response = await threadPostService.createThreadPost({
          forumThreadId,
          content,
          isDeleted: false,
        });
        toast.success(t("success.postCreated"));
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
      const errorMessage = err.message || t("errors.failedToSave");
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // If user isn't authenticated, show a message
  if (!user && !currentUsername) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md transition-colors duration-300">
        <p className="text-yellow-700 dark:text-yellow-400">
          {t("auth.signInToParticipate")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full transition-colors duration-300"
    >
      <div className="mb-4">
        <textarea
          id="content"
          name="content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("placeholders.shareThoughts")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   transition-colors duration-300"
          disabled={submitting}
          aria-label={t("aria.postContent")}
        />
        {error && (
          <p
            className="text-red-600 dark:text-red-400 text-sm mt-1"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 sm:px-4 sm:py-2 text-gray-700 dark:text-gray-300 
                     bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 
                     dark:hover:bg-gray-600 transition-colors duration-300 text-sm sm:text-base"
            disabled={submitting}
            aria-label={t("aria.cancel")}
          >
            {t("actions.cancel")}
          </button>
        )}
        <button
          type="submit"
          className="px-3 py-2 sm:px-4 sm:py-2 text-white bg-indigo-600 dark:bg-indigo-700 
                   rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 
                   transition-colors duration-300 flex items-center justify-center
                   min-w-[80px] text-sm sm:text-base"
          disabled={submitting}
          aria-label={isEditing ? t("aria.update") : t("aria.post")}
        >
          {submitting ? (
            <LoadingSpinner size="sm" className="text-white" showText={false} />
          ) : isEditing ? (
            t("actions.update")
          ) : (
            t("actions.post")
          )}
        </button>
      </div>
    </form>
  );
}
