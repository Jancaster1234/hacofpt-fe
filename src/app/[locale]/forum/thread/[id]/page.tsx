// src/app/[locale]/forum/thread/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ThreadPost } from "@/types/entities/threadPost";
import { ForumThread } from "@/types/entities/forumThread";
import { useAuth } from "@/hooks/useAuth_v0";
import PostForm from "./_components/PostForm";
import ThreadPostItem from "./_components/ThreadPostItem";
import { threadPostService } from "@/services/threadPost.service";
import { forumThreadService } from "@/services/forumThread.service";
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
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch thread information
  const fetchThread = async () => {
    try {
      const response = await forumThreadService.getForumThreadById(threadId);
      if (!response.data || !response.data.id) {
        setError(t("threadNotFound"));
        setThread(null);
      } else {
        setThread(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to fetch thread:", error);
      setError(t("failedToLoadThread"));
      setThread(null);
    }
  };

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
      Promise.all([fetchThread(), fetchPosts()]);
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

  if (loading && !thread) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center py-8">
          <LoadingSpinner size="md" showText={true} />
          <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors">
            {t("threadPage.loadingThread")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8 text-center w-full max-w-md transition-colors duration-300">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {error || t("threadNotFound")}
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
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
          {thread.forumCategoryId && (
            <>
              <Link
                href={`/forum/category/${thread.forumCategoryId}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                aria-label={thread.forumCategory?.name || t("category")}
              >
                {thread.forumCategory?.name || t("category")}
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
            </>
          )}
          <span className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {thread.title}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 transition-colors">
          {thread.title}
        </h1>

        {/* New Post Form */}
        {user && !thread.isLocked && (
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 shadow-md rounded-lg mb-6 md:mb-8 transition-colors">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
              {t("threadPage.newDiscussion")}
            </h2>
            <PostForm forumThreadId={threadId} onPostSaved={handlePostSaved} />
          </div>
        )}

        {/* Locked Thread Message */}
        {thread.isLocked && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 md:mb-8 transition-colors">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                {t("threadPage.threadLocked")}
              </p>
            </div>
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
                isThreadLocked={thread.isLocked}
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
