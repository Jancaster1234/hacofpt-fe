// src/app/[locale]/forum/thread/[id]/_components/EditForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThreadPost } from "@/types/entities/threadPost";
import RichTextEditor from "@/components/RichTextEditor";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface EditFormProps {
  post?: ThreadPost;
  onPostSaved: () => void;
}

export default function EditForm({ post, onPostSaved }: EditFormProps) {
  const [content, setContent] = useState(post?.content || "");
  const [submitting, setSubmitting] = useState(false);
  const t = useTranslations("forum");
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      toast.info(post ? t("updatingPost") : t("creatingPost"));

      let response;

      if (post) {
        // Update existing post
        response = await fetch(`/api/thread-posts/${post.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      } else {
        // Create new post
        response = await fetch(`/api/thread-posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threadId: window.location.pathname.split("/").pop(),
            content,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("errorSavingPost"));
      }

      // Show success toast
      toast.success(
        post ? t("postUpdatedSuccessfully") : t("postCreatedSuccessfully")
      );

      // Clear form
      setContent("");
      // Notify parent
      onPostSaved();
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast.error(error.message || t("errorSavingPost"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
        >
          {post ? t("editYourPost") : t("shareYourThoughts")}
        </label>
        <div className="transition-colors duration-300 dark:border-gray-700">
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting || !content.trim()}
          className="flex items-center justify-center min-w-[80px] bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-300"
          aria-disabled={submitting || !content.trim()}
        >
          {submitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {post ? t("updating") : t("posting")}
            </>
          ) : post ? (
            t("update")
          ) : (
            t("post")
          )}
        </Button>
      </div>
    </form>
  );
}
