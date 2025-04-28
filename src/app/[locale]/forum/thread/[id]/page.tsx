// src/app/[locale]/forum/thread/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ThreadPost } from "@/types/entities/threadPost";
import { useAuth } from "@/hooks/useAuth_v0";
import PostForm from "./_components/PostForm";
import ThreadPostItem from "./_components/ThreadPostItem";
import { threadPostService } from "@/services/threadPost.service";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params?.id as string;
  const { user } = useAuth();
  const toast = useToast();
  const t = useTranslations("forum");

  const [threadPosts, setThreadPosts] = useState<ThreadPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts for the thread
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await threadPostService.getAllThreadPosts();
      // Filter posts to show only posts from this thread
      // Note: We now include deleted posts but will display them differently
      const postsForThread = response.data.filter(
        (post) => post.forumThreadId === threadId
      );
      setThreadPosts(postsForThread);
    } catch (error) {
      console.error("Failed to fetch thread posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (threadId) {
      fetchPosts();
    }
  }, [threadId]);

  // Handle post actions
  const handlePostSaved = (message?: string) => {
    fetchPosts();
    if (message) {
      toast.success(message);
    }
  };

  const handlePostDeleted = (postId: string, message?: string) => {
    // Instead of removing the post, mark it as deleted in the UI
    setThreadPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isDeleted: true,
              deletedById: user?.id,
              updatedAt: new Date().toISOString(),
            }
          : post
      )
    );

    if (message) {
      toast.success(message);
    }
  };

  const handlePostUpdated = (updatedPost: ThreadPost, message?: string) => {
    setThreadPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );

    if (message) {
      toast.success(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 text-center transition-colors">
          {t("threadPage.title")}
        </h1>

        {/* New Post Form */}
        {user && (
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 shadow-md rounded-lg mb-6 md:mb-8 transition-colors">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
              {t("threadPage.newDiscussion")}
            </h2>
            <PostForm forumThreadId={threadId} onPostSaved={handlePostSaved} />
          </div>
        )}

        {/* Discussion Posts */}
        <div className="space-y-4 md:space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <LoadingSpinner size="md" showText={true} />
              <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors">
                {t("threadPage.loadingDiscussions")}
              </p>
            </div>
          ) : threadPosts.length > 0 ? (
            threadPosts.map((post) => (
              <ThreadPostItem
                key={post.id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
                refreshPosts={fetchPosts}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 shadow-md rounded-lg text-center transition-colors">
              <p className="text-gray-500 dark:text-gray-400 transition-colors">
                {t("threadPage.noDiscussions")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
