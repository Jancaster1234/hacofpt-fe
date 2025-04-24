// src/app/[locale]/forum/thread/[id]/_components/EditForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThreadPost } from "@/types/entities/threadPost";
import RichTextEditor from "@/components/RichTextEditor";

interface EditFormProps {
  post?: ThreadPost;
  onPostSaved: () => void;
}

export default function EditForm({ post, onPostSaved }: EditFormProps) {
  const [content, setContent] = useState(post?.content || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Replace with your actual API call
      if (post) {
        // Update existing post
        await fetch(`/api/thread-posts/${post.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      } else {
        // Create new post
        await fetch(`/api/thread-posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threadId: window.location.pathname.split("/").pop(),
            content,
          }),
        });
      }

      // Clear form
      setContent("");
      // Notify parent
      onPostSaved();
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {post ? "Edit your post" : "Share your thoughts"}
        </label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting || !content.trim()}>
          {submitting ? "Saving..." : post ? "Update" : "Post"}
        </Button>
      </div>
    </form>
  );
}
