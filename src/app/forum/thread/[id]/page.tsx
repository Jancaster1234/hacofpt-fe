// src/app/forum/thread/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ThreadPost } from "@/types/entities/threadPost";
import { useAuth } from "@/hooks/useAuth_v0";
import PostForm from "./_components/PostForm";
import ThreadPostItem from "./_components/ThreadPostItem";
import { threadPostService } from "@/services/threadPost.service";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params?.id as string;
  const { user } = useAuth();

  const [threadPosts, setThreadPosts] = useState<ThreadPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts for the thread
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Replace mock call with real service call
      const response = await threadPostService.getAllThreadPosts();
      // Filter posts to show only posts from this thread
      const postsForThread = response.data.filter(
        (post) => post.forumThreadId === threadId && !post.isDeleted
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
  const handlePostSaved = () => {
    fetchPosts();
  };

  const handlePostDeleted = (postId: string) => {
    setThreadPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handlePostUpdated = (updatedPost: ThreadPost) => {
    setThreadPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Discussion Thread
        </h1>

        {/* New Post Form */}
        {user && (
          <div className="bg-white p-6 shadow-md rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Start a New Discussion
            </h2>
            <PostForm forumThreadId={threadId} onPostSaved={handlePostSaved} />
          </div>
        )}

        {/* Discussion Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading discussions...</p>
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
            <div className="bg-white p-8 shadow-md rounded-lg text-center">
              <p className="text-gray-500">
                No discussions available in this thread yet. Be the first to
                post!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
